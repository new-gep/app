import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import Header from "../../../layout/Header";
import PersonalInfo from "./helper/PersonalInfo";
import Education from "./helper/Education";
import Experience from "./helper/Experience";
import Skills from "./helper/Skills";
import CVPreview from "./Preview";
import { useEffect, useState } from "react";
import FindCV from "~/src/hooks/findOne/cv";
import useCollaborator from "~/src/function/fetchCollaborator";
import { COLORS } from "~/src/constants/theme";


export default function CV() {
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [education, setEducation] = useState([
    { degree: "", institution: "", period: "" },
  ]);
  const [experience, setExperience] = useState<{ role: string; company: string; period: string; responsibilities: string; }[]>([{ role: '', company: '', period: '', responsibilities: '' }]);
  const [skills, setSkills] = useState([""]);
  const { collaborator } = useCollaborator();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (collaborator && collaborator.CPF) {
          const response = await FindCV(collaborator.CPF); // Substitua pelo CPF real
          if(response && response.status == 200){
            if(response.cv){
              console.log("CV: ", response.cv);
              return
            }
            setPersonalInfo(response.collaborator.collaborator)

            return;
          }
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    if(collaborator && collaborator.CPF){
      fetchData();
    }
  }, [collaborator]);

  return (
    <View className="flex-1 bg-white p-2">
      <Header title="Currículo" leftIcon={"back"} iconSimple={"folder"} />
      { personalInfo ?
        <ScrollView className="p-4">
        <PersonalInfo
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
        />
        <Education education={education} setEducation={setEducation} />
        <Experience experience={experience} setExperience={setExperience} />
        <Skills skills={skills} setSkills={setSkills} />
        {/* <CVPreview /> */}
        </ScrollView>
        :
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View> 
      }
    </View>
  );
}
