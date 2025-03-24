import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
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

type Props = {
  jobConected: any;
  CPF: any;
};

const DismissalSignature = ({ jobConected, CPF }: Props) => {
  const [obligations, setObligations] = useState(null);
  const [dynamics, setDynamics] = useState({}); // Pode começar vazio
  const [signature, setSignature] = useState<string | undefined>(undefined);
  const [signatureFound, setSignatureFound] = useState<any>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [combined, setCombined] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  const [files, setFiles] = useState<any>(null);
  const [obligationDocs, setObligationDocs] = useState([]);
  const [dynamicDocs, setDynamicDocs] = useState([]);
  const [viewedDocuments, setViewedDocuments] = useState<Set<string>>(new Set());
  const [showWaitingScreen, setShowWaitingScreen] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleDocumentViewed = (documentTitle: string) => {
    setViewedDocuments(prev => new Set([...prev, documentTitle]));
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

            const dynamicDocuments = await Promise.all(
              Object.entries(dynamics).map(async ([key, value]) => {
                const dynamicDismissal = await FindFile(
                  jobConected.id,
                  "dismissal_dynamic",
                  0,
                  value
                );
                dynamicDismissal.title = value
                  .toString()
                  .replace(/([A-Z])/g, " $1")
                  .trim();
                return dynamicDismissal;
              })
            );
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
            setFiles(files);
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      }
    };

    fetchData();
  }, [jobConected, CPF]);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await FindPicture(CPF);
      if (response?.status === 200) {
        const signatureFound = response.pictures.find(
          (pic) => pic.picture === "Signature_Dismissal"
        );
        console.log("response do signatureFound", signatureFound.status);
        setSignatureFound(signatureFound);
      } else {
        console.log("Erro ao buscar assinatura");
      }
    };
    fetchData();
  }, [CPF]);

  if (showWaitingScreen) {
    return (
      <View className="flex-1">
        <Header
          title="Demissão"
          leftIcon={"back"}
          rightIcon2={"Edit"}
        />
        <View className="flex-1 mt-16">
          <View className="w-full p-3 rounded-xl flex-row justify-center">
            <View className="w-1/2 flex-1 p-4">
              <Text
                className="w-44"
                style={{ fontWeight: "600", fontSize: 24 }}
              >
                Assinatura Enviada
              </Text>
              <Text className="mt-10" style={{ fontSize: 16 }}>
                Sua assinatura foi enviada com sucesso! Por favor aguarde a aprovação.
              </Text>
            </View>
          </View>

          <View className="items-center mt-16">
            <Image
              source={require("../../../../assets/images/brand/Waiting.png")}
              style={{ width: 250, height: 300 }}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
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
          {signatureFound && signatureFound?.status === "approved" ? (
            <Text>Assinatura aprovada</Text>
          ) : signatureFound?.status === "pending" ? (
            <View className="w-full h-full">
              <WaitingIndicatorDismissal visible={true} status={"pending"} />
            </View>
          ) : signatureFound?.status === "reproved" ? (
            <>
              <View className="w-full">
                <Text className="text-center text-red-500 text-lg font-semibold">Assinatura recusada</Text>
                <Text className="text-center text-gray-600 text-sm">Por favor, assine os documentos novamente</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  snapToAlignment="center"
                  className="w-full"
                >
                  {dynamicDocs.map((doc, index) => (
                    // console.log(doc),
                    // console.log(index),
                    <DismissalCard
                      key={`dynamic-${index}`}
                      title={doc.title}
                      status={doc.status}
                      path={doc.path}
                      typeDocument={doc.typeDocument}
                      onDocumentViewed={handleDocumentViewed}
                      
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
                  <Text className={`text-lg font-semibold ${
                    allDocumentsViewed ? "text-primary" : "text-dark"
                  }`}>
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
                    key={`dynamic-${index}`}
                    title={doc.title}
                    status={doc.status}
                    path={doc.path}
                    typeDocument={doc.typeDocument}
                    onDocumentViewed={handleDocumentViewed}
                  />
                ))}
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
                    <Text className={`text-lg font-semibold ${
                      allDocumentsViewed ? "text-primary" : "text-gray-600"
                    }`}>
                      Assinar
                    </Text>
                  </TouchableOpacity>
                </>
              )}
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
        />
      )}
    </>
  );
};

export default DismissalSignature;
