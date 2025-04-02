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
  const [dynamics, setDynamics] = useState({});
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
          
          // Remover campo medical das obrigações
          delete obligations.medical;

          // Criar lista de todas as chaves de documentos
          const allDocumentKeys = [
            ...Object.keys(obligations),
            ...Object.keys(dynamics)
          ];

          // Inicializar lockSignature com false para todos os documentos
          const initialLockState = allDocumentKeys.reduce((acc, key) => {
            acc[key] = false;
            return acc;
          }, {});

          setLockSignature(initialLockState);

          // Preparar documentos obrigatórios
          const obligationDocuments = await Promise.all(
            Object.keys(obligations).map(async (key) => {
              const response = await FindFile(jobConected[0].id, key, false);
              return {
                lockKey: key, // Chave original para controle de estado
                title: response.name || key, // Título formatado para exibição
                status: true,
                path: response.path,
                typeDocument: response.type,
              };
            })
          );

          // Preparar documentos dinâmicos
          const dynamicDocuments = Object.entries(dynamics).map(([key, value]) => ({
            lockKey: key, // Manter a chave original
            title: value, // Valor para exibição
            status: true,
            path: `https://storage.googleapis.com/admission_pictures_bucket/documents/${CPF}/${value}.pdf`,
            typeDocument: "pdf",
          }));

          setObligationDocs(obligationDocuments);
          setDynamicDocs(dynamicDocuments);

          // Atualizar estado combinado
          const combined = { ...obligations, ...dynamics };
          setCombined(combined);

          // Buscar arquivos
          const files = {};
          await Promise.all(
            Object.entries(combined).map(async ([key, value]) => {
              const response = await FindFile(jobConected[0].id, key, value);
              files[key] = response;
            })
          );
          setFiles(files);

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
          lockKey={doc.lockKey}
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
          lockKey={doc.lockKey}
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