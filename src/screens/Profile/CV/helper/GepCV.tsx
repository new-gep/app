import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import PersonalInfo from "./PersonalInfo";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";
import FindCV from "~/src/hooks/findOne/cv";
import useCollaborator from "~/src/function/fetchCollaborator";
import { COLORS } from "~/src/constants/theme";


export default function CVGep() {
  const [CVEdit, setCVEdit] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [education, setEducation] = useState<
    {
      degree: string;
      institution: string;
      currentlyStudying: boolean | undefined;
      start: string;
      end: string;
    }[]
  >([
    {
      degree: "",
      institution: "",
      currentlyStudying: false,
      start: "",
      end: "",
    },
  ]);
  const [experience, setExperience] = useState<
    {
      role: string;
      company: string;
      responsibilities: string;
      start: string;
      end: string;
      currentlyWork: boolean;
    }[]
  >([
    {
      role: "",
      company: "",
      responsibilities: "",
      start: "",
      end: "",
      currentlyWork: false,
    },
  ]);
  const [skills, setSkills] = useState([""]);
  const [load, setLoad] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const { collaborator } = useCollaborator();


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (collaborator && collaborator.CPF) {
          const response = await FindCV(collaborator.CPF); // Substitua pelo CPF real
          if (response && response.status == 200) {
            if (response.cv) {
              setEducation(response.cv.education);
              setExperience(response.cv.experience);
              setSkills(response.cv.skills);
              setId(response.cv.id);
              setPersonalInfo(response.cv.CPF_collaborator);
              return;
            }
            setPersonalInfo(response.collaborator.collaborator);

            return;
          }
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    if (collaborator && collaborator.CPF) {
      fetchData();
    }
  }, [collaborator]);

  return (
    <View className="flex-1 bg-white p-2">
      {  personalInfo ? (
          <>
            <ScrollView className="p-4">
              <PersonalInfo
                personalInfo={personalInfo}
                setPersonalInfo={setPersonalInfo}
              />
              <Education education={education} setEducation={setEducation} preview={true}/>
              <Experience experience={experience} setExperience={setExperience} preview={true}/>
              <Skills skills={skills} setSkills={setSkills} preview={true}/>
            </ScrollView>
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )

      }
    </View>
  );
}
