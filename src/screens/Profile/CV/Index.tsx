import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
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
import CreateCV from "~/src/hooks/create/cv";
import UpdateCV from "~/src/hooks/update/cv";
import Home from "./Home";

export default function CV() {
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

  const saveCV = async () => {
    try {
      setLoad(true);
      if (!collaborator || !collaborator.CPF) {
        console.error("Colaborador não encontrado ou CPF inválido.");
        return;
      }

      const validExperience = experience.filter(
        (item) =>
          item.role.trim() !== "" ||
          item.company.trim() !== "" ||
          item.responsibilities.trim() !== "" ||
          item.start.trim() !== "" ||
          item.end.trim() !== "" ||
          item.currentlyWork
      );

      const validEducation = education.filter(
        (item) =>
          item.degree.trim() !== "" ||
          item.institution.trim() !== "" ||
          item.start.trim() !== "" ||
          item.end.trim() !== "" ||
          item.currentlyStudying
      );

      if (validExperience.length === 0) {
        Alert.alert("Experiência não preenchida.");
        return;
      }

      if (validEducation.length === 0) {
        Alert.alert("Educação não preenchida.");
        return;
      }

      const props = {
        CPF_collaborator: collaborator.CPF,
        education: JSON.stringify(validEducation),
        experience: JSON.stringify(validExperience),
        skills: JSON.stringify(skills),
      };
      let response;
      if(id){
        response = await UpdateCV(id, props);
      }else{
        response = await CreateCV(props);
      }

      if (response && (response.status === 201 || response.status === 200)) {
        Alert.alert("Currículo salvo com sucesso!");
      } else {
        Alert.alert("Erro ao salvar currículo.");
      }
    } catch (error) {
      console.error("Erro ao salvar CV: ", error);
    } finally {
      setLoad(false);
    }
  };

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
      <Header title="Currículo" leftIcon={"back"} iconSimple={"file"} />
      { !CVEdit ?
        <Home/>
        :
        personalInfo ? (
          <>
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
            <View className="py-3 px-2 rounded-t-lg ">
              <TouchableOpacity
                className="bg-primary rounded-lg p-2 py-3"
                onPress={saveCV}
              >
                {load ? (
                  <ActivityIndicator size="small" color={"black"} />
                ) : (
                  <Text className="text-center font-bold text-dark ">Salvar</Text>
                )}
              </TouchableOpacity>
  
              {/* <TouchableOpacity>
                <Text className="text-center  p-2 rounded-lg">
                  Download CV
                </Text>
              </TouchableOpacity> */}
            </View>
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
