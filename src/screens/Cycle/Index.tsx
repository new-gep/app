import Work from "../Work/Work";
import Documents from "../Documents/Documents";
import { useEffect, useState } from "react";
import FindCollaborator from "~/src/hooks/findOne/collaborator";
import FindOneJob from "~/src/hooks/get/job/findOne";
import useCollaborator from "~/src/function/fetchCollaborator";
import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import HomeWork from "../Work/Home";
import HomeNoWork from "../Work/HomeNoJob";
import { COLORS } from "~/src/constants/theme";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import FindAplicateInJob from "~/src/hooks/get/job/findAplicateJob";

const Default = () => {
  const [titleWork, setTitleWork] = useState<string>("");
  const { collaborator, fetchCollaborator, updateCollaborator } = useCollaborator();
  const [hasWork, setHaswork] = useState<boolean | null>(null);
  const [hasProcessAdmission, setHasProcessAdmission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [jobConected, setjobConected] = useState<any>();
  const [CPF, setCPF] = useState<any>();
  const navigation = useNavigation<NavigationProp<any>>();

  const fetchJobs = async () => {
    if (!collaborator) {
      console.log('collaborator', collaborator)
      return; // Evita requisições desnecessárias se já tiver trabalho ou não tiver colaborador
    };
    updateCollaborator(collaborator.CPF);
    if(collaborator.id_work){
      setHaswork(true);
      return;
    };
    const response = await FindAplicateInJob(collaborator.CPF);
    if (response.status !== 200) {
      setHasProcessAdmission(false);
      return;
    }
    setHasProcessAdmission(response.processAdmission);
    return
    try {
      if(collaborator.id_work){
        console.log('collaborator.id_work', collaborator.id_work)
        setHaswork(true);
        return;
      }
      
      // Verifica se já temos os dados do processo de admissão
      if (hasProcessAdmission !== null) {
        return; // Evita requisição repetida se já soubermos o status
      }
      
      const response = await FindAplicateInJob(collaborator.CPF);
      if (response.status !== 200) {
        return;
      }
      setHasProcessAdmission(response.processAdmission);
    } catch (error) {
      console.error("Erro ao buscar os cards:", error);
    }
  };

  useEffect(() => {
    //verificação admissao
    if(collaborator){
      fetchJobs()
    }
  }, [collaborator]);

  const onRefresh = async () => {
    await fetchJobs();
  }

  return (
    <>
    { loading ?
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    :
      hasWork ?
      <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => onRefresh()}
            colors={[COLORS.dark]}
          />
        }
        className="flex-1"
      >
        <HomeWork />
      </ScrollView>
      :
      hasProcessAdmission ?
      <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => onRefresh()}
            colors={[COLORS.dark]}
          />
        }
        className="flex-1"
      >
        <HomeNoWork />
      </ScrollView>
      :
      <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => onRefresh()}
            colors={[COLORS.dark]}
          />
        }
        className="flex-1"
      >
        <Documents />
      </ScrollView>
    }
    </>
  );
};
export default Default;
