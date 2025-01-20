import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { COLORS, FONTS } from "../../constants/theme";
import AdmissionalExam from "./StepAdmission/admissionalExam";
import AdmissionalContract from "./StepAdmission/admissionalContract";
import DrawingModal from "../Components/signatureModal";
import ButtonOutline from "../../components/Button/ButtonOutline"; // Ajuste o caminho do botão
import Button from "../../components/Button/Button";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  jobConected: any;
  CPF: any;
};

const Timeline = ({ jobConected, CPF }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const steps = ["Exames", "Documentação", "Assinatura"];
  const [currentStep, setCurrentStep] = useState(null); // Estado do passo atual
  const [isLoading, setIsLoading] = useState(true); // Controle de carregamento
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [signature, setSignature] = useState<string | undefined>(undefined);

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  const handleOpenModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    // Função para atualizar dimensões
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get("window");
      setScreenWidth(width);
      setScreenHeight(height);
    };

    // Adiciona o listener para mudanças de orientação
    const subscription = Dimensions.addEventListener(
      "change",
      handleOrientationChange
    );

    return () => {
      // Remove o listener corretamente
      subscription?.remove();
    };
  }, []);

  const fetchCurrentStep = async () => {
    try {
      setIsLoading(true);
    } catch (error) {
      console.error("Erro ao buscar o passo atual:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentStep(); // Busca o passo ao carregar a tela
    if (jobConected) {
      console.log("connect: ", JSON.parse(jobConected[0].candidates)[0].step);
      setCurrentStep(JSON.parse(jobConected[0].candidates)[0].step);
    }
    Animated.timing(lineAnim, {
      toValue: currentStep / (steps.length - 1), // Progresso baseado no passo atual
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep, jobConected]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#505663" />
        <Text className="text-lg">Carregando informações...</Text>
      </View>
    );
  }

  return (
    <View className="h-full">
      {/* Timeline */}
      <View className="flex-row justify-between items-center">
        {steps.map((step, index) => (
          <View key={index} className="flex-1 items-center relative">
            {/* Círculo do passo */}
            <View
              className={`w-9 h-9 z-20 rounded-full justify-center items-center ${
                index + 1 <= currentStep ? "bg-primary" : "bg-gray-400"
              }`}
            >
              <Text className="text-white font-bold">{index + 1}</Text>
            </View>

            {/* Nome do passo */}
            <Text
              className={`mt-2 text-sm ${
                index + 1 === currentStep
                  ? "text-primary font-semibold"
                  : "text-gray-600"
              }`}
            >
              {step}
            </Text>
          </View>
        ))}
      </View>

      {/* Conteúdo baseado no passo atual */}
      <View className="flex justify-center items-center rounded-lg shadow-md w-full h-full">
        {currentStep === 0 && (
          <AdmissionalExam CPF={CPF} jobConected={jobConected} />
        )}
        {currentStep === 2 && (
          <View className="mt-16 bg-primary w-full p-3 rounded-xl flex-row justify-center">
            <View className="w-1/2 flex-1 p-4">
              <Text
                className="absolute w-44"
                style={{
                  ...FONTS.fontSemiBold,
                  fontSize: 24,
                  color: COLORS.dark,
                  marginTop: -38,
                }}
              >
                Em espera
              </Text>
              <Text className="mt-2" style={{ ...FONTS.font, fontSize: 14 }}>
                Estamos preparando seu kit admissional. Por favor, aguarde
                enquanto finalizamos os últimos detalhes. Retornaremos em breve.
              </Text>
            </View>
          </View>
        )}
        {currentStep === 3 && (
          <>
            <ScrollView className={"flex w-full "}>
              <AdmissionalContract jobConected={jobConected} CPF={CPF} />

              <Button
                title={"Assinar"}
                style={{ marginRight: 8, marginBottom: 8 }}
                text={COLORS.title}
                color={COLORS.primary}
                onPress={handleOpenModal}
              />

              <DrawingModal
                visible={modalVisible}
                onClose={handleCloseModal}
                setSignature={setSignature} // Passa a função para atualizar a assinatura em base64
                signature={signature}
              />
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
};

export default Timeline;
