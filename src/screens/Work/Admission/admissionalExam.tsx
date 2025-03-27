import React, { useCallback, useEffect, useState } from "react";
import { View, Image, Text, RefreshControl, ScrollView } from "react-native";
import Cardstyle4 from "../../../components/Card/Cardstyle4";
import FindPicture from "../../../hooks/findOne/picture";
import JobAdmissionScreen from "../HomeAdmission";
import { SafeAreaView } from "react-native";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { isPending } from "@reduxjs/toolkit";
import JobPicture from "../../../hooks/upload/job";
import GetJobDocument from "../../../hooks/get/job/findDocument";
import Header from "../../../layout/Header";
import Timeline from "../../../components/Timeline/TimelineFront";
import WaitingIndicator from "./admissionalWaitingIndicator";

type Props = {
  jobConected: any;
  CPF: any;
};
const admissionalExam: React.FC<Props> = ({ jobConected, CPF }) => {
  const navigation = useNavigation();
  const [myDocsData, setMyDocsData] = useState<any[] | null>(null);
  const [sendDocument, setSendDocument] = useState<boolean>(false);
  const [typeDocument, setTypeDocument] = useState<any>(null);
  const [statusDocument, setStatusDocument] = useState<string | null>(null);
  const [pathDocument, setPathDocument] = useState<any>(null);
  const [loader, setLoader] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    const fetchData = async () => {
      try {
        const response = await FindPicture(CPF);
        if (response.status === 200 && response.pictures) {
          const pictures = response.pictures;
          const hasMedicalExamination = pictures.find(
            (picture: any) => picture.picture === "Medical_Examination"
          );

          if (hasMedicalExamination) {
            setStatusDocument(hasMedicalExamination.status);
            const response = await GetJobDocument(
              jobConected[0].id,
              "medical",
              "1"
            );
            if (response.status === 200) {
              if (hasMedicalExamination.status === "reproved") {
                setSendDocument(true);
              }
              setTypeDocument(response.type);
              setPathDocument(response.path);
              setLoader(true);
            }
          } else {
            setSendDocument(true);
            setTypeDocument(null);
            setStatusDocument(null);
            setLoader(true);
            setPathDocument(null);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setRefreshing(false);
      }
    };

    fetchData();
  }, [CPF, jobConected]);

  const getTimelineStep = () => {
    switch (statusDocument) {
      case "approved":
        return 2;
      case "analyzing":
      case "pending":
      case "reproved":
      default:
        return 1;
    }
  };

  const updateCandidateStep = async () => {
    try {
      if (jobConected && jobConected[0]) {
        const candidates = JSON.parse(jobConected[0].candidates);
        candidates[0].step = 2; // Atualiza para o step 2
        
        // Aqui você precisa implementar a chamada à API para atualizar o step
        // Exemplo:
        // await UpdateJob(jobConected[0].id, { candidates: JSON.stringify(candidates) });
        
        // Após atualizar, recarrega a página
        navigation.replace('Timeline', { jobConected, CPF });
      }
    } catch (error) {
      console.error("Erro ao atualizar step:", error);
    }
  };

  const handleDocumentSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      // Em vez de ir direto para Timeline, vamos para WaitingIndicator
      navigation.replace('WaitingIndicator', { 
        visible: true,
        status: 'pending',
        message: 'Seu exame admissional foi enviado com sucesso! Aguarde enquanto nossa equipe realiza a análise.'
      });
    }, 2000);
  };

  // Mostrar WaitingIndicator apenas se o documento foi enviado E está pendente
  if (statusDocument === "pending" && pathDocument) {
    return (
      <WaitingIndicator 
        visible={true}
        status="pending"
        message="Seu exame admissional está em análise. Em breve você receberá um retorno."
      />
    );
  }

  return (
    <ScrollView 
      className={"flex-1"}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#9Bd35A", "#689F38"]} // Cores do indicador de loading
          tintColor={"#689F38"} // Cor do spinner no iOS
        />
      }
    >
      <View className={"mt-5 w-full "}>
        <Header
          title="Exame Admissional"
          leftIcon="back"
          leftAction={() => navigation.goBack()}
        />

        {loader && (
          <Timeline 
            currentStep={getTimelineStep()} 
            showProgress={false}
          />
        )}

        {showSuccessMessage ? (
          <View className="items-center justify-center p-4 bg-green-100 rounded-lg m-4">
            <Text className="text-green-700 text-lg font-semibold">
              Exame enviado com sucesso!
            </Text>
            <Text className="text-green-600 text-center mt-2">
              Redirecionando para a próxima etapa...
            </Text>
          </View>
        ) : (
          jobConected ? (
            <>
              <Cardstyle4
                documentName={"Exame Admissional"}
                sendDocument={sendDocument}
                typeDocument={typeDocument}
                statusDocument={statusDocument}
                twoPicture={false}
                path={pathDocument}
                jobId={jobConected[0].id}
                onSuccess={handleDocumentSuccess}
              />

              <View className="items-center mt-8">
                <Image
                  source={require('../../../assets/images/brand/Medical.png')}
                  style={{ width: 250, height: 200 }}
                  resizeMode="contain"
                />
              </View>
            </>
          ) : (
            <Text>carregando</Text>
          )
        )}
      </View>
    </ScrollView>
  );
};

export default admissionalExam;
