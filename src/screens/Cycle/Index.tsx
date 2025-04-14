import Work from "../Work/Work";
import Documents from "../Documents/Documents";
import { useEffect, useState } from "react";
import FindOneJob from "~/src/hooks/get/job/findOne";
import useCollaborator from "~/src/function/fetchCollaborator";
import React from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import HomeWork from "../Work/Home";
import HomeNoWork from "../Work/HomeNoJob";
import { COLORS } from "~/src/constants/theme";
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import FindAplicateInJob from "~/src/hooks/get/job/findAplicateJob";
import FindCollaborator from "~/src/hooks/findOne/collaborator";
import Timeline from "../Work/TimeLineAdmiss";

const Default = () => {
  const [titleWork, setTitleWork] = useState<string>("");
  const { collaborator, fetchCollaborator, updateCollaborator } = useCollaborator();
  const [hasWork, setHaswork] = useState<boolean | null>(null);
  const [hasProcessAdmission, setHasProcessAdmission] = useState<boolean | null>(null);
  const [document, setDocument] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [jobConected, setjobConected] = useState<any>();
  const [CPF, setCPF] = useState<any>();
  const navigation = useNavigation<NavigationProp<any>>();

  const fetchJobs = async () => {
    try{
      if (!collaborator) {
        console.log('collaborator', collaborator)
        return; // Evita requisições desnecessárias se já tiver trabalho ou não tiver colaborador
      };
      const responseCollaborator = await FindCollaborator(collaborator.CPF);
      // console.log(responseCollaborator.collaborator?.id_work)
      if(responseCollaborator?.status === 200 && responseCollaborator?.collaborator?.id_work && responseCollaborator?.collaborator?.id_work?.id){
        setCPF(collaborator.CPF);
        setjobConected(responseCollaborator.collaborator);
        setHaswork(true);
        return;
      };
      const response = await FindAplicateInJob(collaborator.CPF);
      if (response.status !== 200 || !response.processAdmission) {
        setDocument(true);
        setHaswork(false)
        setHasProcessAdmission(false);
        return;
      };
      setCPF(collaborator.CPF);
      setjobConected(response.jobs);
      setHaswork(false)
      setHasProcessAdmission(response.processAdmission);
      return
    } catch (error) {
      console.error("Erro ao buscar os collaborador:", error);
    }finally{
      setLoading(false);
    }
    // try {
    //   if(collaborator.id_work){
    //     console.log('collaborator.id_work', collaborator.id_work)
    //     setHaswork(true);
    //     return;
    //   }
      
    //   // Verifica se já temos os dados do processo de admissão
    //   if (hasProcessAdmission !== null) {
    //     return; // Evita requisição repetida se já soubermos o status
    //   }
      
    //   const response = await FindAplicateInJob(collaborator.CPF);
    //   if (response.status !== 200) {
    //     return;
    //   }
    //   setHasProcessAdmission(response.processAdmission);
    // } catch (error) {
    //   console.error("Erro ao buscar os cards:", error);
    // }
  };

  useFocusEffect(
    React.useCallback(() => {
      //verificação admissao
      if(collaborator){
        fetchJobs()
      }
    }, [collaborator])
  );

  const onRefresh = async () => {
    await fetchJobs();
  };

  return (
    <View className="flex-1 bg-white">
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
        <HomeWork jobConected={jobConected} CPF={CPF} />
      </ScrollView>
      :
      hasProcessAdmission?
        <Timeline jobConected={jobConected} CPF={CPF} />
      :
      document ?
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
      :
      <></>
    }
    </View>
  );
};
export default Default;
