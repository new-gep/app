import Work from "../Work/Work";
import Documents from "../Documents/Documents";
import { useEffect, useState } from "react";
import FindCollaborator from "~/src/hooks/findOne/collaborator";
import FindOneJob from "~/src/hooks/get/job/findOne";
import useCollaborator from "~/src/function/fetchCollaborator";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import HomeWork from "../Work/Home";
import HomeNoWork from "../Work/HomeNoJob";
import { COLORS } from "~/src/constants/theme";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import FindAplicateInJob from "~/src/hooks/get/job/findAplicateJob";

const Default = () => {
  const [titleWork, setTitleWork] = useState<string>("");
  const { collaborator, fetchCollaborator, updateCollaborator } = useCollaborator();
  const [hasWork, setHaswork] = useState<boolean | null>(null);
  const [hasWorkk, setHasWorkk] = useState<boolean | null>(null);
  const [jobConected, setjobConected] = useState<any>();
  const [CPF, setCPF] = useState<any>();
  const navigation = useNavigation<NavigationProp<any>>();

  useFocusEffect(
    React.useCallback(() => {
        //verificação admissao
        const fetchJobs = async () => {
          // setIsLoading(true);
          if (collaborator) { 
            try {
              if(collaborator.id_work){
                setHasWorkk(true)
                return
              }
              const response = await FindAplicateInJob(collaborator.CPF);
            
              setHaswork(response.processAdmission);
              if (response.status !== 200) {
                console.log("Erro ao buscar os cards:", response.message);
                return;
              }
            } catch (error) {
              console.error("Erro ao buscar os cards:", error);
              return
            } finally {
              // setIsLoading(false);
            }
          }
        };

      fetchJobs();
    }, [collaborator])
  );

  useEffect(() => {
    if (collaborator) {
      updateCollaborator(collaborator.CPF);
    }
  }, [collaborator]);

  return (
    <>
      {hasWork && hasWorkk === null ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : collaborator && collaborator.id_work ? (
        <HomeWork setTitleWork={undefined} navigation={''} jobConected={hasWorkk} CPF={collaborator.CPF} />
      ) : hasWork ? (
        <>
          <HomeNoWork/>
        </>
      ) : (
        <Documents />
      )}
    </>
    )
};
export default Default;
