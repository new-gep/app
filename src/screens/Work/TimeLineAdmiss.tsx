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
import { COLORS } from "../../constants/theme";
import { WebView } from "react-native-webview";
import ButtonOutline from "../../components/Button/ButtonOutline";
import DrawingModal from "../Components/signatureModal";
import AdmissionalContract from "./Admission/admissionalContract";
import AdmissionalExam from "./Admission/admissionalExam";
import SignatureModalCanvas from "../Components/Signatures/signatureModalCanvas";
import CreateAvalidPicture from "../../hooks/create/pictures";
import FindPicture from "../../hooks/findOne/picture";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import WaitingIndicator from "./Admission/admissionalWaitingIndicator";
import HomeWork from "./Home";
import { BottomTabParamList } from "../../navigation/BottomTabParamList";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignatureAdmission from "../Components/Signatures/signatureAdmission";

const Timeline = ({ jobConected, CPF }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const steps = ["Exames", "Documentação", "Assinatura"];
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [lockSignature, setLockSignature] = useState(null);
  const [keySignature, setKeySignature] = useState(false);
  const [signatureFound, setSignatureFound] = useState<any>(null);
  const Tab = createBottomTabNavigator<BottomTabParamList>();

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
    const fetchData = async () => {
      const response = await FindPicture(CPF);
      // console.log(response);
    };
    fetchData();
  }, []);

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
      // console.log("jobConected", jobConected[0].candidates);
      setCurrentStep(JSON.parse(jobConected[0].candidates)[0].step);
    }
    Animated.timing(lineAnim, {
      toValue: currentStep / (steps.length - 1),
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentStep, jobConected]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const response = await FindPicture(CPF);
        // console.log(response);
      };
      fetchData();
    }, [CPF])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const response = await FindPicture(CPF);
        if (response?.status === 200) {
          const signatureFound = response.pictures.find(
            (pic) => pic.picture === "Admission_Signature"
          );
          // console.log("response do signatureFound", signatureFound.status);
          setSignatureFound(signatureFound);
        } else {
          console.log("Erro ao buscar assinatura");
        }
      };
      fetchData();
    }, [CPF])
  );

  return (
    <>
      <ScrollView className="h-3/4">
        {currentStep === 1 && (
          <>
            <AdmissionalExam CPF={CPF} jobConected={jobConected} />
          </>
        )}
        {currentStep === 2 && (
          <View className="mt-16 bg-primary w-full p-3 rounded-xl flex-row justify-center">
            <View className="w-1/2 flex-1 p-4">
              <Text
                className="absolute w-44"
                style={{ fontWeight: '600', fontSize: 24 }}
              >
                Em espera
              </Text>
              <Text className="mt-2" style={{ fontSize: 14 }}>
                Estamos preparando seu kit admissional. Por favor, aguarde
                enquanto finalizamos os últimos detalhes. Retornaremos em breve.
              </Text>
            </View>
          </View>
        )}
        {currentStep === 3 && (
          <>
            {signatureFound && signatureFound?.status === "approved" ? (
              <Text>Assinatura aprovada</Text>
            ) : signatureFound?.status === "pending" ? (
              <View className="w-full h-full">
                <WaitingIndicator visible={true} status={"pending"}/>
              </View>
            ) : signatureFound?.status === "reproved" ? (
              <>
                <Text className="text-2xl font-bold text-center mb-6">Revisar documentação</Text>
                <View className="w-full">
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    snapToAlignment="center"
                    className="w-full"
                  >
                    <AdmissionalContract
                      CPF={CPF}
                      jobConected={jobConected}
                      setLockSignature={setLockSignature}
                      lockSignature={lockSignature}
                    />
                  </ScrollView>
                  <Text className="text-center text-gray-600 mt-4 mb-2 px-4">
                    Para assinar é necessário visualizar todos os documentos
                  </Text>
                  <TouchableOpacity
                    className="bg-red-500 py-3 px-6 rounded-lg items-center mt-2 mx-4"
                    onPress={handleOpenModal}
                  >
                    <Text className="text-white text-lg font-semibold">
                      Assinar
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View className="flex w-full">
                <Text className="text-2xl font-bold text-center mb-6">Revisar documentação</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  snapToAlignment="center"
                  className="w-full"
                >
                  <AdmissionalContract
                    CPF={CPF}
                    jobConected={jobConected}
                    setLockSignature={setLockSignature}
                    lockSignature={lockSignature}
                  />
                </ScrollView>
                
                {signature ? (
                  <View className="flex justify-center items-center min-h-min">
                    <Text className="text-lg font-semibold mb-5 mt-5">
                      Assinatura Salva:
                    </Text>
                    <WebView
                      style={{ width: 200, height: 200 }}
                      originWhitelist={["*"]}
                      source={{ html: atob(signature.split(",")[1]) }}
                    />
                  </View>
                ) : (
                  <>
                    <Text className="text-center text-gray-600 mt-4 mb-2 px-4">
                      Para assinar é necessário visualizar todos os documentos
                    </Text>
                    <TouchableOpacity
                      className="bg-red-500 py-3 px-6 rounded-lg items-center mt-2 mx-4"
                      onPress={handleOpenModal}
                    >
                      <Text className="text-white text-lg font-semibold">
                        Assinar
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* <DrawingModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSaveSignature={(signature) => setSignature(signature)} // Recebe a assinatura gerada
        id={jobConected[0].id}
      /> */}

      <SignatureAdmission
        jobId={jobConected[0].id}
        visible={modalVisible}
        onClose={handleCloseModal}
        onSaveSignature={setSignature}
        cpf={CPF}
        id={jobConected[0].id}
        where="Admission_Signature"
      />
    </>
  );
};

export default Timeline;
