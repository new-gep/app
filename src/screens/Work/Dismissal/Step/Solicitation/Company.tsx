import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import CheckDocumentAdmissional from "../../../../hooks/get/job/checkSignaure";
// import AdmissionalCard from "../../Admission/AdmissionalCard";
import FindFile from "../../../../../hooks/get/job/findFile";
// import AdmissionalCarousel from "../../Admission/AdmissionalCarousel";
import DismissalCard from "../Helper/Card";
import CheckDocumentDismissal from "../../../../../hooks/get/job/checkDismissal";
import SignatureModalCanvas from "../../../../Components/Signatures/signatureModalCanvas";
import WaitingIndicatorDismissal from "../WaitingIndicator";
import { default as useFocusEffect } from "@react-navigation/native";
import FindPicture from "../../../../../hooks/findOne/picture";
import TimelineDemission from "~/src/components/Timeline/TimelineDemission";
import Button from "~/src/components/Button/Button";
import { COLORS, FONTS } from "~/src/constants/theme";
import FindOnePicture from "~/src/hooks/findOne/onePicture";

type Props = {
  jobConected: any;
  CPF: any;
};

const Company = ({ jobConected, CPF }: Props) => {
  const [obligations, setObligations] = useState(null);
  const [dynamics, setDynamics] = useState({}); // Pode começar vazio
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [loader, setLoader] = useState<any>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [combined, setCombined] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [files, setFiles] = useState<any>(null);
  const [obligationDocs, setObligationDocs] = useState([]);
  const [dynamicDocs, setDynamicDocs] = useState([]);
  const [statusSignature, setStatusSignature] = useState<any>(null);
  const [keySignature, setKeySignature] = useState<any>(false);
  const [lockSignature, setLockSignature] = useState<any>(null);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    if (!keySignature) {
      return Alert.alert(
        "Indisponível",
        "Você não pode assinar no momento pois precisa primeiro visualizar todos os documentos."
      );
    }
    setModalVisible(true);
  };

  useEffect(() => {
    if (lockSignature) {
      // Verifica se é um array
      const lockSignatureObj = Array.isArray(lockSignature)
        ? lockSignature.reduce((obj, value, index) => {
            if (typeof value === "string") {
              // Remove a barra inicial se houver
              const cleanKey = value.replace(/^\//, "");
              obj[cleanKey] = false;
            } else if (value !== undefined && value !== null) {
              // Valor não é string, mas também não é undefined/null
              obj[`doc${index}`] = value;
            } else {
              // Valor inválido (provavelmente undefined/null)
              console.warn(`Valor inválido em lockSignature[${index}]:`, value);
            }
            return obj;
          }, {})
        : lockSignature;

      // Verifica se todos os valores booleanos são true
      const allTrue = Object.values(lockSignatureObj)
        .filter((value) => typeof value === "boolean")
        .every((value) => value === true);

      setKeySignature(allTrue);
    }
  }, [lockSignature]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (jobConected) {
          try {
            const response = await CheckDocumentDismissal(jobConected.id);

            if (response.status === 200) {
              const obligations = response.date.obligation;
              const dynamics = response.date.dynamic.communication.document;
              const valueDynamic = Object.values(dynamics);
              const initialLockState = valueDynamic.reduce(
                (acc: any, key: any) => {
                  acc[key] = false;
                  return acc;
                },
                {}
              );

              setLockSignature(initialLockState);
              setObligations(obligations);
              setDynamics(dynamics);

              const dynamicDocuments = await Promise.all(
                Object.entries(dynamics).map(async ([key, value]) => {
                  let trueTitle = value;
                  value = value.toString().replace(/\//g, "").trim();
                  console.log("value", value);
                  const dynamicDismissal = await FindFile(
                    jobConected.id,
                    "dismissal_communication_dynamic",
                    0,
                    value
                  );

                  if (dynamicDismissal.status === 200) {
                    // console.log("ttt ", value);
                    dynamicDismissal.title = value;
                    dynamicDismissal.lockKey = trueTitle;
                    return dynamicDismissal;
                  } else {
                    console.log(
                      "Erro ao buscar documento dinâmico",
                      dynamicDismissal
                    );
                  }
                })
              );
              // console.log("dynamicDocuments", dynamicDocuments.length);
              setDynamicDocs(dynamicDocuments);
            }

            // console.log("Obrigações:", obligations); // Log das obrigações
            // console.log("Documentos dinâmicos:", dynamics); // Log dos documentos dinâmicos

            if (response.status === 200) {
              const combined = { ...obligations, ...dynamics };
              delete combined.medical;

              // Preparar documentos dinâmicos

              // Buscar arquivos
              const files = {};
              await Promise.all(
                Object.entries(combined).map(async ([key, value]) => {
                  const response = await FindFile(jobConected.id, key, value);
                  // console.log(`Arquivo encontrado jobConected`, jobConected.id);
                  files[key] = response;
                  response.lockKey = value;
                })
              );
              setFiles(files);
            }
          } catch (error) {
            console.error("Erro ao buscar dados:", error);
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, [jobConected, CPF]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await FindOnePicture(
        "Signature_Communication",
        CPF,
        jobConected.id
      );
      if (response?.status === 200) {
        // console.log(response.pictures.status);
        setStatusSignature(response.pictures.status);
      } else {
        console.log("Erro ao buscar assinatura");
      }
    };
    fetchData();
  }, [CPF]);

  return (
    <>
      {(!statusSignature || statusSignature === "reproved") && 
          <View>
            <TimelineDemission currentStep={1} showProgress={true} />
          </View>
      }
      {statusSignature === "approved" || statusSignature === "pending" ? (
        <WaitingIndicatorDismissal
          visible={true}
          status={"pending"}
          current={1}
        />
      ) : (
        <View style={{ height: Dimensions.get("window").height * 0.5 }}>
          <Text
            className={`text-center ${
              statusSignature == "reproved" ? "text-red-600" : "text-gray-600"
            } px-5 mb-5`}
            style={{ ...FONTS.fontMedium, fontSize: 16 }}
          >
            {statusSignature == "reproved"
              ? "Assinatura recusada, por favor assine novamente."
              : "Assinatura pendente, visualize todos os documentos para assinar."}
          </Text>
          {!loader ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="center"
              className="w-full h-full"
            >
              {dynamicDocs.map((doc: any, index) => (
                <DismissalCard
                  key={`dynamic-${index}`}
                  title={doc.title}
                  status={doc.status}
                  path={doc.path}
                  typeDocument={doc.typeDocument}
                  lockKey={doc.lockKey}
                  lockSignature={lockSignature}
                  setLockSignature={setLockSignature}
                />
              ))}
            </ScrollView>
          ) : (
            <View className="h-full w-full justify-center items-center flex">
              <Text
                className="text-center mb-5"
                style={{ ...FONTS.fontMedium, fontSize: 16 }}
              >
                Buscando documentos
              </Text>
              <ActivityIndicator size="large" color={COLORS.dark} />
            </View>
          )}
        </View>
      )}

      <>
        { (!statusSignature || statusSignature === "reproved") && (
            <View className="border-gray-200 px-4 ">
              <Button
                style={{ marginTop: 20, opacity: keySignature ? 1 : 0.7 }}
                title="Assinar"
                onPress={handleOpenModal}
                color={COLORS.dark}
                text={COLORS.white}
              />
            </View>
          )}
      </>

      {jobConected && jobConected.id && (
        <SignatureModalCanvas
          visible={modalVisible}
          onClose={handleCloseModal}
          onSaveSignature={setSignature}
          cpf={CPF}
          id={jobConected.id}
          where="Communication"
          jobId={jobConected.id}
          setStatusSignature={setStatusSignature}
        />
      )}
    </>
  );
};

export default Company;
