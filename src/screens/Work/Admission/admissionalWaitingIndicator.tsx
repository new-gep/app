import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import Timeline from "../../../components/Timeline/TimelineFront";
import Header from "../../../layout/Header";
import TimelineFront from "../../../components/Timeline/TimelineFront";
import { COLORS, FONTS } from "~/src/constants/theme";
import FindAplicateInJob from "~/src/hooks/get/job/findAplicateJob";

type WaitingIndicatorProps = {
  visible: boolean;
  status?: "approved" | "pending";
  message?: string;
  currentStep?: number;
  setCurrentStep?: any;
  CPF?: string;
  RefreshControl?: any;
};

const WaitingIndicator: React.FC<WaitingIndicatorProps> = ({
  visible,
  status,
  message,
  currentStep,
  setCurrentStep,
  CPF,
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [refreshing, setRefreshing] = useState(false);

  const getMessage = () => {
    if (message) {
      return message;
    }

    if (currentStep === 2) {
      return "Seu exame foi aprovado! Em breve enviaremos os documentos para prosseguir com a admissão, por favor aguarde.";
    }

    switch (status) {
      case "approved":
        return "Seus documentos foram aprovados. Agora você pode prosseguir com a assinatura do contrato.";
      case "pending":
        return "Estamos analisando seus documentos. Em breve você poderá prosseguir com a próxima etapa.";
      default:
        return "Aguardando retorno da documentação";
    }
  };

  const fetchData = async () => {
    try {
      console.log("CPF", CPF);
      if (!CPF) return;
      const response = await FindAplicateInJob(CPF);
      console.log(JSON.parse(response.jobs[0].candidates)[0].step);
      setCurrentStep(JSON.parse(response.jobs[0].candidates)[0].step);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
  }, []);

  return (
    <View
      className={`bg-white ${
        currentStep === 2 && "flex justify-center items-center"
      }`}
      style={{
        height: currentStep === 2 ? Dimensions.get("window").height : "auto",
      }}
    >
      <SafeAreaView>
        {(currentStep === 2) && (
          <Header
            title={'Kit Admissional'}
            leftIcon="back"
            leftAction={() => navigation.goBack()}
          />
        )}
        {currentStep === 2 && (
          <TimelineFront currentStep={currentStep} showProgress={true} />
        )}

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.dark]}
            />
          }
        >
          <View
            className={`${
              currentStep == 2 || currentStep == 3
                ? "items-center"
                : "flex-1 justify-start items-center px-6"
            }`}
          >
            <Text className="" style={{ ...FONTS.fontSemiBold, fontSize: 18 }}>
              {currentStep === 2
                ? "Aguardando Kit Admissional"
                : "Aguardando Análise"}
            </Text>

            <View className="w-full h-60% aspect-square">
              <Image
                source={require("../../../assets/images/gif/Timemanagement.gif")}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            </View>

            <Text
              className={`text-gray-500  text-center ${
                currentStep == 2 || currentStep == 3 && "px-5"
              }`}
              style={{ ...FONTS.fontRegular, fontSize: 14 }}
            >
              {getMessage()}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default WaitingIndicator;
