import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native";
import Header from "~/src/layout/Header";
import WaitingIndicator from "../../admissionalWaitingIndicator";
import TimelineFront from "~/src/components/Timeline/TimelineFront";
import FindOnePicture from "~/src/hooks/findOne/onePicture";
import { useNavigation } from "@react-navigation/native";
import AdmissionalContract from "../../admissionalContract";
import SignatureAdmission from "~/src/screens/Components/Signatures/signatureAdmission";
import Button from "~/src/components/Button/Button";
import { COLORS, FONTS } from "~/src/constants/theme";

const Signature = ({
  currentStep,
  CPF,
  jobConected,
}: {
  currentStep: number;
  CPF: string;
  jobConected: any;
}) => {
  const navigation = useNavigation();
  const [signatureFound, setSignatureFound] = useState<any>(null);
  const [statusSignature, setStatusSignature] = useState<any>('send');
  const [lockSignature, setLockSignature] = useState<any>(false);
  const [keySignature, setKeySignature] = useState<any>(false);
  const [modalSignature, setModalSignature] = useState<any>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      if (CPF) {
        const responseSignature = await FindOnePicture(
          "Signature_Admission",
          CPF,
          jobConected[0].id
        );
        console.log("responseSignature", responseSignature);
        if (responseSignature && responseSignature?.status === 200) {
          setSignatureFound(responseSignature.pictures);
          setStatusSignature(responseSignature.pictures.status);
        }else{
            setStatusSignature('send');
        }
      }
    } catch (error) {
        setStatusSignature('send');
      console.log("Erro ao buscar assinatura", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenModal = () => {
    // if (!keySignature) {
    //   return Alert.alert(
    //     "Indisponível",
    //     "Você não pode assinar no momento pois precisa primeiro visualizar todos os documentos."
    //   );
    // }
    setModalSignature(true);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  useEffect(() => {
    if (lockSignature) {
      const lockSignatureObj = Array.isArray(lockSignature)
        ? lockSignature.reduce((obj, value, index) => {
            if (typeof value === "string") {
              obj[value] = false;
            } else {
              obj[`doc${index}`] = value;
            }
            return obj;
          }, {})
        : lockSignature;

      const allTrue = Object.values(lockSignatureObj)
        .filter((value) => typeof value === "boolean")
        .every((value) => value === true);

      console.log("LockSignature convertido:", lockSignatureObj);
      console.log("Todos os documentos foram visualizados?", allTrue);
      setKeySignature(allTrue);
    }
  }, [lockSignature]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <Header
        title={"Assinatura"}
        leftIcon="back"
        leftAction={() => navigation.goBack()}
      />
      <SignatureAdmission
        jobId={jobConected[0].id}
        visible={modalSignature}
        onClose={() => setModalSignature(false)}
        onSaveSignature={"setSignature"}
        cpf={CPF}
        id={jobConected[0].id}
        where="Admission_Signature"
        setStatusSignature={setStatusSignature}
      />
      <>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
        >
          <TimelineFront currentStep={currentStep} showProgress={true} />
          {statusSignature ? (
            statusSignature == "approved" || statusSignature == "pending" ? (
              <View>
                <WaitingIndicator currentStep={currentStep} visible={true} status={"pending"} message="Assinatura em analise, aguarde a aprovação."/>
              </View>
            ) 
             : (
              <>
                <Text
                  className={`text-center ${
                    statusSignature == "reproved"
                      ? "text-red-600"
                      : "text-gray-600"
                  } px-5 mb-5`}
                  style={{ ...FONTS.fontMedium, fontSize: 16 }}
                >
                  {statusSignature == "reproved"
                    ? "Assinatura recusada, por favor assine novamente."
                    : "Assinatura pendente, visualize todos os documentos para assinar."}
                </Text>
                <View className="mb-5">
                  <AdmissionalContract
                    CPF={CPF}
                    jobConected={jobConected}
                    setLockSignature={setLockSignature}
                    lockSignature={lockSignature}
                  />
                </View>
                <View className="border-gray-200 px-4 ">
                  <Button
                    style={{ marginTop: 20, opacity: keySignature ? 1 : 0.7 }}
                    title="Assinar"
                    onPress={handleOpenModal}
                    color={COLORS.dark}
                    text={COLORS.white}
                  />
                </View>
              </>
            )
          ) : (
            ""
          )}
        </ScrollView>
      </>
      {/* <WaitingIndicator currentStep={currentStep} visible={true} status={"pending"} /> */}
    </View>
  );
};

export default Signature;
