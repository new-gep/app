import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
// import CheckDocumentAdmissional from "../../../../hooks/get/job/checkSignaure";
// import AdmissionalCard from "../../Admission/AdmissionalCard";
import FindFile from "../../../../../hooks/get/job/findFile";
import DocumentVisible from "../../../../../components/Modal/DocumentVisible";
import { Title } from "react-native-paper";
// import AdmissionalCarousel from "../../Admission/AdmissionalCarousel";
import DismissalCard from "../Helper/Card";
import CheckDocumentDismissal from "../../../../../hooks/get/job/checkDismissal";
import SignatureModalCanvas from "../../../../Components/Signatures/signatureModalCanvas";
import { WebView } from "react-native-webview";

import WaitingIndicatorDismissal from "../WaitingIndicator";
import { default as useFocusEffect } from "@react-navigation/native";
import FindPicture from "../../../../../hooks/findOne/picture";

type Props = {
  jobConected: any;
  CPF: any;
};

const Company = ({ jobConected, CPF }: Props) => {
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
            const dynamics = response.date.dynamic.communication.document;
            setObligations(obligations);
            setDynamics(dynamics);
            console.log(
              "dynamics aa",
              response.date.dynamic.communication.document
            );

            const dynamicDocuments = await Promise.all(
              Object.entries(dynamics).map(async ([key, value]) => {
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
          (pic:any) => pic.picture === "Signature_Communication"
        );
        // console.log("response do signatureFound", signatureFound.status);
        setSignatureFound(signatureFound);
      } else {
        console.log("Erro ao buscar assinatura");
      }
    };
    fetchData();
  }, [CPF]);

  return (
    <>
    {!signatureFound  && 
      <View className="w-full items-center justify-center">
        <Text className="text-2xl font-semibold">
          Documentos
        </Text>
        <Text className="text-sm text-gray-500 mt-2">
          Assine os documentos abaixo para continuar com o processo de desligamento.
        </Text>
    </View>}
      {signatureFound && signatureFound?.status === "approved" ? (
        <View className="w-full items-center justify-center p-4">
          <Text className="text-lg text-green-500 font-semibold">Assinatura aprovada</Text>
        </View>
      ) : signatureFound?.status === "pending" ? (
        <View className="w-full h-full">
          <WaitingIndicatorDismissal visible={true} status={"pending"} />
        </View>
      ) : (
        <View className="flex w-full">
          {signatureFound?.status === "reproved" && (
            <View className="w-full p-4">
              <Text className="text-center text-red-500 text-lg font-semibold">
                Assinatura recusada
              </Text>
              <Text className="text-center text-gray-600 text-sm mb-4">
                Por favor, assine os documentos novamente
              </Text>
            </View>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToAlignment="center"
            className="w-full"
          >
            {dynamicDocs.map((doc: any, index) => (
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
            <TouchableOpacity
              style={{
                backgroundColor: "#1F2937",
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 8,
                marginHorizontal: 16,
              }}
              onPress={handleOpenModal}
            >
              <Text style={{ color: "#F3F4F6", fontSize: 18, fontWeight: "600" }}>
                Assinar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {jobConected && jobConected.id && (
        <SignatureModalCanvas
          visible={modalVisible}
          onClose={handleCloseModal}
          onSaveSignature={setSignature}
          cpf={CPF}
          id={jobConected.id}
          where="Communication"
          jobId={jobConected.id}
        />
      )}
    </>
  );
};

export default Company;
