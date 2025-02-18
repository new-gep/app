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
import SignatureModalCanvas from "../../../../Components/signatureModalCanvas";
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
<<<<<<< HEAD
            console.log(
              "dynamics aa",
              response.date.dynamic.communication.document
            );
=======

>>>>>>> master

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
          (pic) => pic.picture === "Dismissal_Signature_Communication"
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
      <ScrollView className="h-3/4">
        {dynamicDocs.map((doc, index) => (
          <DismissalCard
            key={`dynamic-${index}`}
            title={doc.title}
            status={doc.status}
            path={doc.path}
            typeDocument={doc.typeDocument}
          />
        ))}
        <TouchableOpacity
          className="bg-red-500 py-3 px-6 rounded-lg items-center mt-2 mx-4"
          onPress={handleOpenModal}
        >
          <Text className="text-white text-lg font-semibold">Assinar</Text>
        </TouchableOpacity>
      </ScrollView>

      {jobConected && jobConected.id && (
        <SignatureModalCanvas
          visible={modalVisible}
          onClose={handleCloseModal}
          onSaveSignature={setSignature}
          cpf={CPF}
          id={jobConected.id}
          where="Dismissal_Signature_Communication"
        />
      )}
    </>
  );
};

export default Company;
