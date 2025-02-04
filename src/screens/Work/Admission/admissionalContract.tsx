import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import CheckDocumentAdmissional from "../../../hooks/get/job/checkSignaure";
import AdmissionalCard from "./AdmissionalCard";
import FindFile from "../../../hooks/get/job/findFile";
import DocumentVisible from "../../../components/Modal/DocumentVisible";
import { Title } from "react-native-paper";
import AdmissionalCarousel from './AdmissionalCarousel';


type Props = {
  jobConected: any;
  CPF: any;
  setLockSignature: (any) => void;
  lockSignature: any;
};

const AdmissionalContract = ({ jobConected, CPF, setLockSignature, lockSignature }: Props) => {

  const [obligations, setObligations] = useState(null);
  const [dynamics, setDynamics] = useState({}); // Pode começar vazio
  const [combined, setCombined] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  


  const [files, setFiles] = useState<any>(null);
  const [obligationDocs, setObligationDocs] = useState([]);
  const [dynamicDocs, setDynamicDocs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (jobConected) {
        try {
          const response = await CheckDocumentAdmissional(jobConected[0].id);
          const obligations = response.date.obligation;
          const dynamics = response.date.dynamic.document;
          setObligations(obligations);
          setDynamics(dynamics);

          if (response.status === 200) {
            const combined = { ...obligations, ...dynamics };
            delete combined.medical;
            setLockSignature(combined);

            // Preparar documentos obrigatórios
            const obligationDocuments = Object.keys(obligations).map(key => ({
              title: key,
              status: true,
              path: `https://storage.googleapis.com/admission_pictures_bucket/documents/${CPF}/${key}.pdf`,
              typeDocument: "pdf",
            }));
            setObligationDocs(obligationDocuments);

            // Preparar documentos dinâmicos
            const dynamicDocuments = Object.entries(dynamics).map(([key, value]) => ({
              title: value,
              status: key,
              path: `https://storage.googleapis.com/admission_pictures_bucket/documents/${CPF}/${value}.pdf`,
              typeDocument: "pdf",
            }));
            setDynamicDocs(dynamicDocuments);

            // Buscar arquivos
            const files = {};
            await Promise.all(
              Object.entries(combined).map(async ([key, value]) => {
                const response = await FindFile(jobConected[0].id, key, value);
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


  return (
    <View className="flex-row flex-wrap">
      {/* Documentos Obrigatórios */}
      {obligationDocs.map((doc, index) => (
        <AdmissionalCard
          key={`obligation-${index}`}
          title={doc.title}
          status={doc.status}
          path={doc.path}
          typeDocument={doc.typeDocument}
          setLockSignature={setLockSignature}
          lockSignature={lockSignature}
        />
      ))}

      {/* Documentos Dinâmicos */}
      {dynamicDocs.map((doc, index) => (
        <AdmissionalCard
          key={`dynamic-${index}`}
          title={doc.title}
          status={doc.status}
          path={doc.path}
          typeDocument={doc.typeDocument}
          setLockSignature={setLockSignature}
          lockSignature={lockSignature}
        />
      ))}
    </View>
  );
};

export default AdmissionalContract;
