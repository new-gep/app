import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Cardstyle4 from "../../../components/Card/Cardstyle4";
import FindOnePicture from "../../../hooks/findOne/onePicture";
import JobAdmissionScreen from "../HomeAdmission";
import { SafeAreaView } from "react-native";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import COLORS from "../../../constants/theme";
import { isPending } from "@reduxjs/toolkit";
import JobPicture from "../../../hooks/upload/job";
import GetJobDocument from "../../../hooks/get/job/findDocument";
import Header from "../../../layout/Header";
import Timeline from "../../../components/Timeline/TimelineFront";
import WaitingIndicator from "./admissionalWaitingIndicator";
import TimelineFront from "../../../components/Timeline/TimelineFront";
type Props = {
  jobConected: any;
  CPF: any;
};
const admissionalExam: React.FC<Props> = ({ CPF, jobConected }) => {
  const navigation = useNavigation();
  const [myDocsData, setMyDocsData] = useState<any[] | null>(null);
  const [sendDocument, setSendDocument] = useState<boolean>(false);
  const [typeDocument, setTypeDocument] = useState<any>(null);
  const [statusDocument, setStatusDocument] = useState<string | null>(null);
  const [pathDocument, setPathDocument] = useState<any>(null);
  const [loader, setLoader] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const finishSendDocument = (props: any) => {
    console.log("Props", props);
  };

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
        navigation.replace("Timeline", { jobConected, CPF });
      }
    } catch (error) {
      console.error("Erro ao atualizar step:", error);
    }
  };

  const handleDocumentSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      // Em vez de ir direto para Timeline, vamos para WaitingIndicator
      navigation.replace("WaitingIndicator", {
        visible: true,
        status: "pending",
        message:
          "Seu exame admissional foi enviado com sucesso! Aguarde enquanto nossa equipe realiza a análise.",
      });
    }, 2000);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await FindOnePicture(
        "Medical_Examination",
        CPF,
        jobConected[0].id
      );
      if (response.status === 200 && response.pictures) {
        setStatusDocument(response.pictures.status);
        const documentResponse = await GetJobDocument(
          jobConected[0].id,
          "medical",
          "1"
        );

        if (documentResponse.status === 200) {
          if (response.pictures.status === "reproved") {
            setSendDocument(true);
          }
          setTypeDocument(documentResponse.type);
          setPathDocument(documentResponse.path);
          setLoader(true);
        }
      } else {
        setSendDocument(true);
        setTypeDocument(null);
        setStatusDocument(null);
        setLoader(true);
        setPathDocument(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [CPF, jobConected]);

  if (statusDocument === "approved" && pathDocument) {
  } else if (statusDocument === "pending" && pathDocument) {
    return (
      <WaitingIndicator
        visible={true}
        status="pending"
        message="Seu exame admissional está em análise. Em breve você receberá um retorno."
      />
    );
  } else if (statusDocument === "reproved" && pathDocument) {
    return (
      <View className="h-full flex flex-col justify-between">
        <Header
          title="Exame Admissional"
          leftIcon="back"
          leftAction={() => navigation.goBack()}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#fde047"]}
              tintColor={"#fde047"}
            />
          }
        >
          <TimelineFront currentStep={1} showProgress={true} />

          <View className="h-full justify-center flex-1 items-center px-6">
            <View className="mt-9">
              <Cardstyle4
                documentName={"Exame Admissional"}
                sendDocument={true}
                typeDocument={typeDocument}
                statusDocument={statusDocument}
                twoPicture={false}
                path={pathDocument}
                jobId={jobConected[0].id}
              />
            </View>
            <View className="mt-9">
              <Image
                source={require("../../../assets/images/brand/Medical.png")}
                style={{ width: 250, height: 150 }}
                resizeMode="contain"
              />
            </View>
            <View className="mt-9">
              <Text className="text-2xl font-bold text-dark text-center mt-">
                Exame Reprovado
              </Text>

              <Text className="text-gray-500 text-base text-center mb-8">
                Seu exame admissional foi reprovado. Por favor, envie novamente
                o documento.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 h-screen items-center justify-center">
      {isLoading ? (
        <ActivityIndicator size="large" color={"#fde047"} />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#fde047"]}
              tintColor={"#fde047"}
            />
          }
        >
          <View className={"mt-5 w-full "}>
            <Header
              title="Exame Admissional"
              leftIcon="back"
              leftAction={() => navigation.goBack()}
            />
            <TimelineFront currentStep={1} showProgress={true} />

            {loader && <TimelineFront currentStep={1} showProgress={true} />}

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
              jobConected && (
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
                    finishSendDocument={finishSendDocument}
                  />

                  <View className="items-center mt-16">
                    <Image
                      source={require("../../../assets/images/brand/Medical.png")}
                      style={{ width: 250, height: 200 }}
                      resizeMode="contain"
                    />
                  </View>
                </>
              )
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default admissionalExam;
