import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Dimensions,
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
import { COLORS, FONTS } from "~/src/constants/theme";
import { isPending } from "@reduxjs/toolkit";
import JobPicture from "../../../hooks/upload/job";
import GetJobDocument from "../../../hooks/get/job/findDocument";
import Header from "../../../layout/Header";
import Timeline from "../../../components/Timeline/TimelineFront";
import WaitingIndicator from "./admissionalWaitingIndicator";
import TimelineFront from "../../../components/Timeline/TimelineFront";
import FindOneJob from "../../../hooks/get/job/findOne";
import FindAplicateInJob from "~/src/hooks/get/job/findAplicateJob";
type Props = {
  jobConected: any;
  CPF: any;
  setCurrentStep: any;
};
const admissionalExam: React.FC<Props> = ({ CPF, jobConected, setCurrentStep }) => {
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
    if (props == 200) {
      setStatusDocument("pending");
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
      console.log('jobConected', jobConected)
      const response = await FindOnePicture(
        "Medical_Examination",
        CPF,
        jobConected[0].id
      );
      if(response && response.status === 200 && response.pictures?.status === 'approved'){
        const findJob = await FindAplicateInJob(CPF);
        setCurrentStep(JSON.parse(findJob.jobs[0].candidates)[0].step)
        return;
      }
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

  return (
    <View className="flex-1">
      <Header
        title="Exame Admissional"
        leftIcon="back"
        leftAction={() => navigation.goBack()}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.dark]}
            />
          }
        >
          <TimelineFront currentStep={1} showProgress={true} />

          {isLoading ? (
            <ActivityIndicator size="large" color={"#fde047"} />
          ) : statusDocument === "pending" || statusDocument === "approved" && pathDocument ? (
            <>
              <WaitingIndicator
                visible={true}
                status="pending"
                message="Seu exame admissional está em análise. Em breve você receberá um retorno."
              />
            </>
          ) : statusDocument === "reproved" && pathDocument ? (
              <View className="justify-center items-center px-5">
                <View >
                  <Cardstyle4
                    documentName={"Exame Admissional"}
                    sendDocument={true}
                    typeDocument={typeDocument}
                    statusDocument={statusDocument}
                    twoPicture={false}
                    path={pathDocument}
                    jobId={jobConected[0].id}
                    finishSendDocument={finishSendDocument}
                  />
                </View>
                <View className="mt-5">
                  <Text className="text-gray-500 text-base text-center mb-8" style={{ ...FONTS.fontRegular, fontSize: 16 }}>
                    Exame Recusado. Por favor, envie novamente o documento.
                  </Text>
                </View>
                <View >
                  <Image
                    source={require("../../../assets/images/brand/Medical.png")}
                    style={{ width: Dimensions.get("window").width * 0.5, height: Dimensions.get("window").height * 0.3 }}
                    resizeMode="contain"
                  />
                </View>
              
              </View>
          ) : (
            <View className={"w-full "}>
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
                  <View className="px-5">
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
                        style={{
                          width: Dimensions.get("window").width * 0.7,
                          height: Dimensions.get("window").height * 0.3,
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                )
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default admissionalExam;
