import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS, FONTS } from "../../constants/theme";
import AdmissionalExam from "./StepAdmission/admissionalExam";
import AdmissionalContract from "./StepAdmission/admissionalContract";
import ButtonOutline from "../../components/Button/ButtonOutline"; // Ajuste o caminho do botão
import Button from "../../components/Button/Button";
import { ScrollView } from "react-native-gesture-handler";
import DrawingModal from "../Components/signatureModal";

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
  const [lockSignature, setLockSignature] = useState(null);
  const [keySignature, setKeySignature] = useState(Boolean);

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  const handleOpenModal = () => {
    if (!keySignature) {
      return Alert.alert(
        "Indisponível.",        // Título do alerta
        "Você não pode assinar no momento pois precisa primeiro visualizar todos os documentos.",     // Mensagem opcional
      );
    }
    setModalVisible(!modalVisible);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

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

  useEffect(() => {
    if (lockSignature) {
      console.log("alterou:", lockSignature);
      const allTrue = Object.values(lockSignature).every((value) => value === true);
      console.log(allTrue)
      setKeySignature(allTrue);
    }
  }, [lockSignature])

  useEffect(() => {
    fetchCurrentStep(); // Busca o passo ao carregar a tela
    if (jobConected) {
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
    <>
      {/* Timeline */}
      <View className="absolut flex-row justify-between items-center">
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

      <View>
        {/* Conteúdo rolável */}

        <ScrollView className={'h-3/4'}>
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
                  enquanto finalizamos os últimos detalhes. Retornaremos em
                  breve.
                </Text>
              </View>
            </View>
          )}
          {currentStep === 3 && (
            <View className="flex w-full">
              <AdmissionalContract  CPF={CPF} jobConected={jobConected} setLockSignature={setLockSignature} lockSignature={lockSignature}  />
            </View>
          )}
        </ScrollView>

        <View className="absolute z-50 bottom-0 left-0 right-0 p-4  ">
          <TouchableOpacity
            className="bg-red-500 py-3 px-6 rounded-lg items-center"
            onPress={handleOpenModal}
          >
            <Text className="text-white text-lg font-semibold">Assinar</Text>
          </TouchableOpacity>
        </View>

        {/* Botão fixo na parte inferior */}

          <DrawingModal visible={modalVisible} onClose={setModalVisible} />
      </View>
    </>
  );
};

export default Timeline;
