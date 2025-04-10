import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import CheckDocumentAdmissional from "../../../hooks/get/job/checkSignaure";
import AdmissionalCard from "./AdmissionalCard";
import FindFile from "../../../hooks/get/job/findFile";
import DocumentVisible from "../../../components/Modal/DocumentVisible";
import { Title } from "react-native-paper";
import AdmissionalCarousel from './AdmissionalCarousel';
import { COLORS } from "~/src/constants/theme";

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
  const [obligationDocs, setObligationDocs] = useState<any>([]);
  const [dynamicDocs, setDynamicDocs] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
              console.log(jobConected[0].id, key, false)
              const response = await FindFile(jobConected[0].id, key, false);
              if(!response){
                return
              }
              return {
                lockKey: key, // Chave original para controle de estado
                title: key, // Título formatado para exibição
                status: true,
                path: response.path,
                typeDocument: response.type,
              };
            })
          );

          const dynamicDocuments = await Promise.all(
            Object.entries(dynamics).map(async ([key, value]) => {
              console.log(jobConected[0].id, key, false)
              const response = await FindFile(jobConected[0].id, 'dynamic', false, value);
              console.log('response', response)
              if(!response){
                return
              }
              return {
                lockKey: value, // Chave original para controle de estado
                title: value, // Título formatado para exibição
                status: true,
                path: response.path,
                typeDocument: response.type,
              };
            })
          );

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
        }finally{
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [jobConected, CPF]);

  return (
    <View className="flex-row flex-wrap">
      {/* Documentos Obrigatórios */}
      {obligationDocs.map((doc, index) => {
        if (!doc) {
          return  // Retorne null para não renderizar nada
        }
        return (
          <AdmissionalCard
            key={`obligation-${index}`}
            lockKey={'doc.lockKey'}
            title={doc.title}
            status={doc.status}
            path={doc.path}
            typeDocument={doc.typeDocument}
            setLockSignature={setLockSignature}
            lockSignature={lockSignature}
          />
        );
      })}

      {/* Documentos Dinâmicos */}
      {/* {dynamicDocs.map((doc, index) => (
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
      ))} */}
      <View className="h-full w-full justify-center items-center flex">
        {loading && <Text className="text-center">Buscando documentos...</Text>}
      </View>
    </View>
  );
};

export default AdmissionalContract;