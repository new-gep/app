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
import FindOnePicture from "~/src/hooks/findOne/onePicture";
import Signature from "./Admission/Step/3/Signature";

const Timeline = ({ jobConected, CPF, fetchVerifyFinish }: { jobConected: any; CPF: any, fetchVerifyFinish:any }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [signature, setSignature] = useState<any>(null);
  const steps = ["Exames", "Documentação", "Assinatura"];
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [lockSignature, setLockSignature] = useState<{
    [key: string]: boolean;
  }>({});
  const [keySignature, setKeySignature] = useState(false);
  const [signatureFound, setSignatureFound] = useState<any>(null);
  const [statusSignature, setStatusSignature] = useState<any>(null);
  const Tab = createBottomTabNavigator<BottomTabParamList>();

  const handleOpenModal = () => {
    // if (!keySignature) {
    //   return Alert.alert(
    //     "Indisponível",
    //     "Você não pode assinar no momento pois precisa primeiro visualizar todos os documentos."
    //   );
    // }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  useEffect(() => {
    if (lockSignature) {
      //Verifica se é um array e converte para objeto se necessário
      const lockSignatureObj = Array.isArray(lockSignature) ?
        lockSignature.reduce((obj, value, index) => {
          if (typeof value === 'string') {
            obj[value] = false;
          } else {
            obj[`doc${index}`] = value;
          }
          return obj;
        }, {}) :
        lockSignature;

      const allTrue = Object.values(lockSignatureObj)
        .filter(value => typeof value === 'boolean')
        .every(value => value === true);

      setKeySignature(allTrue);
    }
  }, [lockSignature]);

  // useEffect(() => {
  //   if (lockSignature && Object.keys(lockSignature).length > 0) {
  //     const allViewed = Object.values(lockSignature).every(
  //       (value) => value === true
  //     );
  //     setKeySignature(allViewed);
  //     // console.log("Todos os documentos visualizados?", allViewed);
  //   }
  // }, [lockSignature]);

  useEffect(() => {
    if (jobConected) {
      setCurrentStep(JSON.parse(jobConected[0].candidates)[0].step);
    }
    Animated.timing(lineAnim, {

      toValue: currentStep / (steps.length - 1),
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [jobConected]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if(CPF){
        const responseSignature = await FindOnePicture("Signature_Admission", CPF, jobConected[0].id);
        if (responseSignature?.status === 200) {
          setSignatureFound(responseSignature.pictures);
        } else {
            console.log("Erro ao buscar assinatura");
          }
        }
      };
      fetchData();
    }, [CPF])
  );

  return (
    <View className="bg-white" style={{ height: Dimensions.get('window').height }}>
      <ScrollView className="h-full bg-white">
        {currentStep === 1 && (
          <>
            <AdmissionalExam CPF={CPF} jobConected={jobConected} setCurrentStep={setCurrentStep} />
          </>
        )}
        {currentStep === 2 && (
          <>
            <WaitingIndicator
              visible={true}
              status={"pending"}
              CPF={CPF}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </>
        )}
        {currentStep === 3 && (
          <Signature fetchVerifyFinish={fetchVerifyFinish} currentStep={currentStep} CPF={CPF} jobConected={jobConected} />
        )}
        {currentStep === 0 && (
          <>
            {(signatureFound && signatureFound?.status === "approved") ||
            signatureFound?.status === "pending" ? (
              <View className="w-full h-full ">
                <WaitingIndicator currentStep={currentStep} visible={true} status={"pending"} />
              </View>
            ) : signatureFound?.status === "reproved" ? (
              <>
                <Header
                  title="Revisar documentação"
                  leftIcon="back"
                  leftAction={() => navigation.goBack()}
                />
                <TimelineFront
                  currentStep={3}
                  showProgress={true}
                  status={"pending"}
                />
                {/* <Image source={require("../../assets/images/brand/reproved.png")} style={{ width: 200, height: 200 }} /> */}
                <Text className="text-center text-gray-500 font-semibold mt-16 mb-2 px-4">
                  Sua documentação foi reprovada. Por favor, revise os
                  documentos e tente novamente.
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
              <View className="flex w-full h-full">
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
              </View>
            )}
          </>
        )}
      </ScrollView>

      {currentStep === 0 && !signatureFound?.status && (
        <View className=" p-4 border-t border-gray-200 mb-20">
          <Text className="text-center text-gray-600">
            Para assinar é necessário visualizar todos os documentos
          </Text>
          <TouchableOpacity
            style={[
              styles.signButton,
              {
                marginHorizontal: 0,
                opacity: keySignature ? 1 : 0.5,
              },
            ]}
            onPress={handleOpenModal}

          >
            <Text style={styles.signButtonText}>Assinar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* {jobConected[0].id && 
      <SignatureAdmission
        jobId={jobConected[0].id}
        visible={modalVisible}
        onClose={handleCloseModal}
        onSaveSignature={setSignature}
        cpf={CPF}
        id={jobConected[0].id}
        where="Admission_Signature"
      />
      } */}
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
