import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import CheckDocumentAdmissional from "../../../../hooks/get/job/checkSignaure";
import AdmissionalCard from "../../Admission/AdmissionalCard";
import FindFile from "../../../../hooks/get/job/findFile";
import DocumentVisible from "../../../../components/Modal/DocumentVisible";
import { Title } from "react-native-paper";
import AdmissionalCarousel from "../../Admission/AdmissionalCarousel";
import DismissalCard from "./Helper/Card";
import CheckDocumentDismissal from "../../../../hooks/get/job/checkDismissal";
import SignatureModalCanvas from "../../../Components/Signatures/signatureModalCanvas";
import { WebView } from "react-native-webview";
import WaitingIndicator from "../../Admission/admissionalWaitingIndicator";
import WaitingIndicatorDismissal from "./WaitingIndicator";
import { default as useFocusEffect } from "@react-navigation/native";
import FindPicture from "../../../../hooks/findOne/picture";
import Header from "../../../../layout/Header";
import TimelineDemission from "~/src/components/Timeline/TimelineDemission";
import Button from "~/src/components/Button/Button";
import { COLORS } from "~/src/constants/theme";
import FindOnePicture from "~/src/hooks/findOne/onePicture";

type Props = {
  jobConected: any;
  CPF: any;
};

const DismissalSignature = ({ jobConected, CPF }: Props) => {
  const [obligations, setObligations] = useState(null);
  const [dynamics, setDynamics] = useState({}); // Pode começar vazio
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [signatureFound, setSignatureFound] = useState<any>(null);
  const [keySignature, setKeySignature] = useState<any>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [combined, setCombined] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [statusSignature, setStatusSignature] = useState<any>("send");
  const [files, setFiles] = useState<any>(null);
  const [obligationDocs, setObligationDocs] = useState([]);
  const [dynamicDocs, setDynamicDocs] = useState([]);
  const [viewedDocuments, setViewedDocuments] = useState<Set<string>>(
    new Set()
  );
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

  const handleDocumentViewed = (documentTitle: string) => {
    setViewedDocuments((prev) => new Set([...prev, documentTitle]));
  };

  const allDocumentsViewed = React.useMemo(() => {
    return dynamicDocs.length > 0 && viewedDocuments.size >= dynamicDocs.length;
  }, [dynamicDocs.length, viewedDocuments.size]);

  const handleSaveSignature = (signatureData: string) => {
    setSignature(signatureData);
    setShowWaitingScreen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (jobConected) {
        try {
          const response = await CheckDocumentDismissal(jobConected.id);

          if (response.status === 200) {
            const obligations = response.date.obligation;
            const dynamics = response.date.dynamic.document;
            setObligations(obligations);
            setDynamics(dynamics);
            const valueDynamic = Object.values(dynamics);
            const initialLockState = valueDynamic.reduce(
              (acc: any, key: any) => {
                acc[key] = false;
                return acc;
              },
              {}
            );
            setLockSignature(initialLockState);

            const dynamicDocuments = await Promise.all(
              Object.entries(dynamics).map(async ([key, value]) => {
                const dynamicDismissal = await FindFile(
                  jobConected.id,
                  "dismissal_dynamic",
                  0,
                  value
                );
                dynamicDismissal.lockKey = value;
                dynamicDismissal.title = value
                  .toString()
                  .replace(/([A-Z])/g, " $1")
                  .trim();
                return dynamicDismissal;
              })
            );
            console.log(dynamicDocuments[0].lockKey);
            setDynamicDocs(dynamicDocuments);
          }

          // console.log("Obrigações:", obligations); // Log das obrigações
          // console.log("Documentos dinâmicos:", dynamics); // Log dos documentos dinâmicos

          if (response.status === 200) {
            const combined = { ...obligations, ...dynamics };
            delete combined.medical;

            // Preparar documentos obrigatórios
            // const obligationDocuments = Object.keys(obligations).map(key => ({
            //   title: key,
            //   status: true,
            //   path: `https://storage.googleapis.com/admission_pictures_bucket/documents/${CPF}/${key}.pdf`,
            //   typeDocument: "pdf",
            // }));
            // setObligationDocs(obligationDocuments);

            // Preparar documentos dinâmicos

            // Buscar arquivos
            const files = {};
            await Promise.all(
              Object.entries(combined).map(async ([key, value]) => {
                const response = await FindFile(jobConected.id, key, value);
                // console.log(`Arquivo encontrado jobConected`, jobConected.id);
                files[key] = response;
              })
            );
            console.log(files);
            setFiles(files);
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      }
    };

    fetchData();
  }, [jobConected, CPF]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await FindOnePicture(
        "Signature_Dismissal",
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


  return (
    <>
      <TimelineDemission currentStep={3} showProgress={true} />
      <ScrollView className="h-full">
        {/* {dynamicDocs.map((doc, index) => (
          <DismissalCard
            key={`dynamic-${index}`}
            title={doc.title}
            status={doc.status}
            path={doc.path}
            typeDocument={doc.typeDocument}
          />
        ))} */}
        <>
          {statusSignature == "approved" || statusSignature == "pending"  ? (
            <View className="w-full h-full">
              <WaitingIndicatorDismissal
                visible={true}
                status={"pending"}
                current={3}
              />
            </View>
          ) : statusSignature == "reproved" ? (
            <>
              <View className="w-full">
                <Text className="text-center text-red-500 text-lg font-semibold">
                  Assinatura recusada
                </Text>
                <Text className="text-center text-gray-600 text-sm">
                  Por favor, assine os documentos novamente
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  snapToAlignment="center"
                  className="w-full"
                >
                  {dynamicDocs.map((doc, index) => (
                    <DismissalCard
                      lockKey={doc.lockKey}
                      key={`dynamic-${index}`}
                      title={doc.title}
                      status={doc.status}
                      path={doc.path}
                      typeDocument={doc.typeDocument}
                      onDocumentViewed={handleDocumentViewed}
                      setLockSignature={setLockSignature}
                      lockSignature={lockSignature}
                    />
                  ))}
                </ScrollView>
                <Text className="text-center text-gray-600 mt-4 mb-2 px-4">
                  {!allDocumentsViewed
                    ? "Para assinar é necessário visualizar todos os documentos"
                    : "Agora você pode assinar os documentos"}
                </Text>
                <TouchableOpacity
                  className={`py-3 px-6 rounded-lg items-center mt-2 mx-4 ${
                    allDocumentsViewed ? "bg-dark" : "bg-gray-400"
                  }`}
                  onPress={handleOpenModal}
                  disabled={!allDocumentsViewed}
                >
                  <Text
                    className={`text-lg font-semibold ${
                      allDocumentsViewed ? "text-primary" : "text-dark"
                    }`}
                  >
                    Assinar
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View className="flex w-full">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToAlignment="center"
                className="w-full"
              >
                {dynamicDocs.map((doc, index) => (
                  <DismissalCard
                    lockKey={doc.lockKey}
                    key={`dynamic-${index}`}
                    title={doc.title}
                    status={doc.status}
                    path={doc.path}
                    typeDocument={doc.typeDocument}
                    onDocumentViewed={handleDocumentViewed}
                    setLockSignature={setLockSignature}
                    lockSignature={lockSignature}
                  />
                ))}
              </ScrollView>

              <>
                <Text className="text-center text-gray-600 mt-4 mb-2 px-4">
                  {!allDocumentsViewed
                    ? "Para assinar é necessário visualizar todos os documentos"
                    : "Agora você pode assinar os documentos"}
                </Text>
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
            </View>
          )}
        </>
      </ScrollView>

      {jobConected && jobConected.id && (
        <SignatureModalCanvas
          visible={modalVisible}
          onClose={handleCloseModal}
          onSaveSignature={handleSaveSignature}
          cpf={CPF}
          id={jobConected.id}
          where="Dismissal"
          jobId={jobConected.id}
          setStatusSignature={setStatusSignature}
        />
      )}
    </>
  );
};

export default DismissalSignature;
