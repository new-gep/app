import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { COLORS, FONTS } from "../../constants/theme";
import AdmissionalExam from "./StepAdmission/admissionalExam";
import JobAdmissionScreen from "./HomeAdmission";
import Signature from "./StepAdmission/admissionalContract";

type Props = {
    jobConected: any;
    CPF: any;
}

const Timeline = ({jobConected, CPF}: Props) => {
  const steps = ["Exames", "Documentação", "Assinatura"];
  const [currentStep, setCurrentStep] = useState(null); // Estado do passo atual
  const [isLoading, setIsLoading] = useState(true); // Controle de carregamento
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [signatureDataUrl, setSignatureDataUrl] = useState<any>(null);

  // Função para buscar o passo atual do banco de dados
  const fetchCurrentStep = async () => {
    try {
      setIsLoading(true);
    } catch (error) {
      console.error("Erro ao buscar o passo atual:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Executa ao montar o componente e atualiza quando o `currentStep` mudar
  useEffect(() => {
    fetchCurrentStep(); // Busca o passo ao carregar a tela
    if (jobConected) {
      //console.log(JSON.parse(jobConected[0].candidates)[0].step) 
      setCurrentStep(JSON.parse(jobConected[0].candidates)[0].step);     
    }
    Animated.timing(lineAnim, {
      toValue: (currentStep) / (steps.length - 1), // Progresso baseado no passo atual
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep, jobConected]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#505663" />
        <Text className="mt-4 text-lg text-gray-500">
          Carregando informações...
        </Text>
      </View>
    );
  }

  function handleSaveSignature(signatureDataUrl: string): void {
    console.log(signatureDataUrl)
    throw new Error("Function not implemented.");
  }

  return (
    <View className="">
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

            {/* Linha de conexão */}
            {index < steps.length - 1 && (
              <View className="absolute left-10 top-5 h-1 w-full bg-gray-300">
                <Animated.View
                  style={[
                    styles.animatedLine,
                    {
                      width: lineAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", "100%"],
                      }),
                    },
                  ]}
                />
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Mensagem com base no passo atual */}
      <View className=" bg-white rounded-lg shadow-md">
        {currentStep === 1 && (
          
            <AdmissionalExam CPF={CPF} jobConected={jobConected}/>
        )}
        {currentStep === 2 && (
          <View
            className={`mt-16 bg-primary w-full p-3 rounded-xl flex-row justify-between`}
          >
            <View className={`w-1/2 flex-1  p-4"`}>
              <Text
                className={`absolute w-44`}
                style={{
                  ...FONTS.fontSemiBold,
                  fontSize: 24,
                  color: COLORS.dark,
                  marginTop: -38,
                }}
              >
                Em espera
              </Text>
              <Text className={`mt-2`} style={{ ...FONTS.font, fontSize: 14 }}>
              Estamos preparando seu kit admissional. Por favor, aguarde enquanto finalizamos os últimos detalhes. Retornaremos em breve.
              </Text>
            </View>
          </View>
        )}
        {currentStep === 3 && (
          <View>
            <Signature />
          {signatureDataUrl ? (
            <View >
              <Image
                source={{ uri: signatureDataUrl }}
              />
                
            </View>
          ) : (
            <Text >Assinatura ainda não salva.</Text>
          )}
        </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  animatedLine: {
    height: 2,
    backgroundColor: "#2563eb",
  },
});

export default Timeline;
