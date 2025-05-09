import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import CheckDocumentAdmissional from "../../../hooks/get/job/checkSignaure";
import AdmissionalCard from "./AdmissionalCard";
import FindFile from "../../../hooks/get/job/findFile";
import DocumentVisible from "../../../components/Modal/DocumentVisible";
import { Title } from "react-native-paper";
import AdmissionalCarousel from "./AdmissionalCarousel";
import { COLORS, FONTS } from "~/src/constants/theme";

type Props = {
  jobConected: any;
  CPF: any;
  setLockSignature: (any) => void;
  lockSignature: any;
};

const AdmissionalContract = ({
  jobConected,
  CPF,
  setLockSignature,
  lockSignature,
}: Props) => {
  const [obligations, setObligations] = useState(null);
  const [dynamics, setDynamics] = useState({});
  const [combined, setCombined] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  const [files, setFiles] = useState<any>(null);
  const [obligationDocs, setObligationDocs] = useState<any>([]);
  const [dynamicDocs, setDynamicDocs] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  
  
  const fetchData = async () => {
    if (jobConected) {
      try {
        const response = await CheckDocumentAdmissional(jobConected[0].id);
        const obligations = response.date.obligation;
        const dynamics = response.date.dynamic.document;
        console.log('ID: ',jobConected[0].id)
        console.log('dynamics: ',dynamics);
        // Remover campo medical das obrigações
        delete obligations.medical;

        // Criar lista de todas as chaves de documentos
        const allDocumentKeys = [
          // ...Object.keys(obligations),
          ...Object.values(dynamics),
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
            if (!response) {
              return;
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
    
            const response = await FindFile(
              jobConected[0].id,
              "dynamic",
              false,
              value
            );

            if (!response) {
              return;
            }
            return {
              lockKey: value, // Chave original para controle de estado
              title: value?.toString().replace(/([A-Z])/g, ' $1').trim(), // Título formatado para exibição
              status: true,
              path: response.path,
              typeDocument: response.type,
            };
          })
        );

        setObligationDocs(obligationDocuments);
        setDynamicDocs(dynamicDocuments);
        // Atualizar estado combinado
        // const combined = { ...obligations, ...dynamics };
        const combined = { ...dynamics };
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
      } finally {
        setRefreshing(false);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobConected, CPF]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
  }, []);

  return (
    <View className="w-full " style={{ height: Dimensions.get('window').height * 0.4 }}>
      { !loading ?
        <SafeAreaView>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.dark]}
            />
          }
          horizontal  
          showsHorizontalScrollIndicator={false} // Alterado para true
          pagingEnabled
          snapToAlignment="center"
          className="w-full"
          style={{ height: Dimensions.get('window').height * 0.4 }}
        >
          {/* Documentos Obrigatórios */}
          {/* {obligationDocs.map((doc:any, index:any) => {
            if (!doc) {
              return; // Retorne null para não renderizar nada
            }
            return (
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
            );
          })} */}

          {/* Documentos Dinâmicos */}
          {dynamicDocs.map((doc:any, index:any) => (
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
        </ScrollView>
      </SafeAreaView>
      :
      <View className="h-full w-full justify-center items-center flex">
        <Text className="text-center mb-5" style={{...FONTS.fontMedium, fontSize: 16}}>Buscando documentos</Text>
        <ActivityIndicator size="large" color={COLORS.dark} />
      </View>

      }
      
    </View>
  );
};

export default AdmissionalContract;
