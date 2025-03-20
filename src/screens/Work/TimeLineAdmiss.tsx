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
import Header from "../../layout/Header";
import TimelineFront from "../../components/Timeline/TimelineFront";
const Timeline = ({ jobConected, CPF }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [signature, setSignature] = useState<any>(null);
  const steps = ["Exames", "Documentação", "Assinatura"];
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [lockSignature, setLockSignature] = useState(null);
  const [keySignature, setKeySignature] = useState(false);
  const [signatureFound, setSignatureFound] = useState<any>(null);
  const [statusSignature, setStatusSignature] = useState<any>(null);
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
            (pic) => pic.picture === "Signature_Admission"
          );
          console.log("signatureFounddddddddddddddddddddddddd", signatureFound);
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
    <View className="flex-1">
      <ScrollView className="h-full bg-white">
        {currentStep === 1 && (
          <>
            <AdmissionalExam CPF={CPF} jobConected={jobConected} />
          </>
        )}
        {currentStep === 2 && (
          <>
            <Header
              title="Exame Admissional"
              leftIcon="back"
              leftAction={() => navigation.goBack()}
            />
            <TimelineFront currentStep={2} showProgress={true} />
            <View className=" bg-primary w-full p-3 rounded-xl flex-row justify-center">
              <View className="w-1/2 flex-1 p-4">
                <Text
                  className="absolute w-44"
                  style={{ fontWeight: "600", fontSize: 24 }}
                >
                  Em espera
                </Text>
                <Text className="mt-10" style={{ fontSize: 14 }}>
                  Estamos preparando seu kit admissional. Por favor, aguarde
                  enquanto finalizamos os últimos detalhes. Retornaremos em
                  breve.
                </Text>
              </View>
            </View>
            <View className="items-center mt-8">
              <Image
                source={require("../../assets/images/brand/Waiting.png")}
                style={{ width: 250, height: 200 }}
                resizeMode="contain"
              />
            </View>
          </>
        )}
        {currentStep === 3 && (
          <>
            {signatureFound && signatureFound?.status === "approved" || signatureFound?.status === "pending" ? (
              <View className="w-full h-full">
                <WaitingIndicator visible={true} status={"pending"} />
              </View>
            ) : signatureFound?.status === "reproved" ? (
              <>
                <Header
                  title="Revisar documentação" 
                  leftIcon="back"
                  leftAction={() => navigation.goBack()}
                />
                <TimelineFront currentStep={3} showProgress={true} status={"pending"} />
                {/* <Image source={require("../../assets/images/brand/reproved.png")} style={{ width: 200, height: 200 }} /> */}
                <Text className="text-center text-gray-500 font-semibold mt-16 mb-2 px-4">
                  Sua documentação foi reprovada. Por favor, revise os documentos e tente novamente.
                </Text>
                
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

              <View className="mt-24">
                <TouchableOpacity
              style={[styles.signButton, { marginHorizontal: 0 }]}
              onPress={handleOpenModal}
            >
              <Text style={styles.signButtonText}>Assinar novamente</Text>
            </TouchableOpacity>
            </View>
              </>
            ) : (
              <View className="flex w-full">
                <Header
                  title="Assinar Documentos"
                  leftIcon="back"
                  leftAction={() => navigation.goBack()}
                />
                <TimelineFront currentStep={3} showProgress={true} />
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

                {signature && (
                  <View className="flex justify-center items-center min-h-min">
                    <Text className="text-lg font-semibold mb-5 mt-5">
                      Assinatura Salva:
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {currentStep === 3 && !signatureFound?.status && (
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          {!Object.values(lockSignature || {}).every(
            (value) => value === true
          ) ? (
            <Text className="text-center text-gray-600 mb-2">
              Para assinar é necessário visualizar todos os documentos
            </Text>
          ) : (
            <TouchableOpacity
              style={[styles.signButton, { marginHorizontal: 0 }]}
              onPress={handleOpenModal}
            >
              <Text style={styles.signButtonText}>Assinar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <SignatureAdmission
        jobId={jobConected[0].id}
        visible={modalVisible}
        onClose={handleCloseModal}
        onSaveSignature={setSignature}
        cpf={CPF}
        id={jobConected[0].id}
        where="Admission_Signature"
      />
    </View>
  );
};

const styles = {
  signButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  signButtonText: {
    color: COLORS.dark,
    fontSize: 18,
    fontWeight: "600",
  },
};

export default Timeline;
