import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
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
                dynamicDismissal.title = value.toString().replace(/([A-Z])/g, ' $1').trim();
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
            (pic) => pic.picture === "Dismissal_Signature"
          );
          // console.log("response do signatureFound", signatureFound.status);
          setSignatureFound(signatureFound);

        } else {
          console.log("Erro ao buscar assinatura");
        }
      };
      fetchData();
    }, [CPF])

  return (
    <>
      <ScrollView className="h-3/4">
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
              <Text className="text-2xl font-bold text-center mb-6">
                Revisar documentação
              </Text>
              <View className="w-full">
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
                    />
                  ))}
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
              <Text className="text-2xl font-bold text-center mb-6">
                Revisar documentação
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
                      key={`dynamic-${index}`}
                      title={doc.title}
                      status={doc.status}
                      path={doc.path}
                      typeDocument={doc.typeDocument}
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
      </ScrollView>

    { jobConected && jobConected.id &&
        <SignatureModalCanvas
        visible={modalVisible}
        onClose={handleCloseModal}
        onSaveSignature={setSignature}
        cpf={CPF}
        id={jobConected.id}
        where="Dismissal_Signature"
      />}
    </>
  );
};

export default DismissalSignature;
