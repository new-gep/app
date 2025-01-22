import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { COLORS, FONTS } from "../../constants/theme";
import { WebView } from 'react-native-webview';
import ButtonOutline from "../../components/Button/ButtonOutline";
import DrawingModal from "../Components/signatureModal";
import AdmissionalContract from "./StepAdmission/admissionalContract";

const Timeline = ({ jobConected, CPF }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const steps = ["Exames", "Documentação", "Assinatura"];
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [lockSignature, setLockSignature] = useState(null);
  const [keySignature, setKeySignature] = useState(false);

  const handleOpenModal = () => {
    if (!keySignature) {
      return Alert.alert(
        "Indisponível",
        "Você não pode assinar no momento pois precisa primeiro visualizar todos os documentos."
      );
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (signature) {
      console.log("Assinatura:", signature);
    }
  }, [signature]);

  useEffect(() => {
    if (lockSignature) {
      const allTrue = Object.values(lockSignature).every(
        (value) => value === true
      );
      setKeySignature(allTrue);
    }
  }, [lockSignature]);

  useEffect(() => {
    if (jobConected) {
      setCurrentStep(JSON.parse(jobConected[0].candidates)[0].step);
    }
    Animated.timing(lineAnim, {
      toValue: currentStep / (steps.length - 1),
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep, jobConected]);

  return (
    <>
      <ScrollView className="h-3/4">
        {currentStep === 3 && (
          <>
            <View className="flex w-full">
              <AdmissionalContract
                CPF={CPF}
                jobConected={jobConected}
                setLockSignature={setLockSignature}
                lockSignature={lockSignature}
              />
            </View>
            {signature ? (
              <View className="flex justify-center items-center min-h-min ">
                <Text className="text-lg font-semibold mb-5 mt-5">
                  Assinatura Salva:
                </Text>
                <WebView
                  style={{ width: 200, height: 200 }}
                  originWhitelist={['*']}
                  source={{ html: atob(signature.split(',')[1]) }}
                />
              </View>
            ) : (
              <Text className="text-lg text-center mt-4">
                Nenhuma assinatura salva ainda.
              </Text>
            )}
            <TouchableOpacity
              className="bg-red-500 py-3 px-6 rounded-lg items-center"
              onPress={handleOpenModal}
            >
              <Text className="text-white text-lg font-semibold">Assinar</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <DrawingModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSaveSignature={(signature) => setSignature(signature)} // Recebe a assinatura gerada
      />
    </>
  );
};

export default Timeline;
