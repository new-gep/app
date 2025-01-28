import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import CheckDocumentAdmissional from "../../../hooks/get/job/checkSignaure";
import AdmissionalCard from "./AdmissionalCard";
import FindFile from "../../../hooks/get/job/findDocsAdmission";
import DocumentVisible from "../../../components/Modal/DocumentVisible";
import { Title } from "react-native-paper";


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

  useEffect(() => {
    const fetchData = async () => {
      if (jobConected) {
        const files = {};
        try {
          const response = await CheckDocumentAdmissional(jobConected[0].id);
          const obligations = response.date.obligation;
          const dynamics = response.date.dynamic.document;
          setObligations(obligations);
          setDynamics(dynamics);
          // console.log("Obligations", obligations)
          // console.log("dynamics", dynamics)

          if (response.status === 200) {
            // console.log(jobConected[0].id)

            const files = {};
            const combined = { ...obligations, ...dynamics };
            delete combined.medical;
            setLockSignature(combined);

            await Promise.all(
              Object.entries(combined).map(async ([key, value]) => {
                const response = await FindFile(jobConected[0].id, key, "0");
                files[key] = response;
              })
            );

            // console.log("Arquivos encontrados:", files);
            setFiles(files);
          } else {
            console.warn(
              "Algo deu errado:",
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      }
    };

    fetchData();
  }, [jobConected, CPF]);

  return (
    <ScrollView className="p-4 w-full bg-gray-100">
      {obligations &&
        dynamics &&
        files && (
          <>
            {/* Renderiza os documentos obrigatórios */}
            {Object.entries(obligations).map(([key, value]) => {
              if (key === "medical") return null;
              return (
                <View key={`obligation-${key}`}>
                  <AdmissionalCard
                    status={value}
                    title={key}
                    path={files[key]?.path}
                    typeDocument={files[key]?.typeDocument}
                    setLockSignature={setLockSignature}
                    lockSignature={lockSignature}
                  />
                </View>
              );
            })}
            
            {/* Renderiza os documentos dinâmicos */}
            {Object.entries(dynamics).map(([key, value]) => {
              // Separa as palavras por letras maiúsculas e capitaliza a primeira letra
              const formattedTitle = typeof value === 'string' 
                ? value.replace(/([A-Z])/g, ' $1')
                    .trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                : String(value);
              // console.log('Formatted title:', formattedTitle, key);
              return (
                <View key={`dynamic-${key}`}>
                  <AdmissionalCard
                    status={key}
                    title={formattedTitle}
                    path={files[key]?.path}
                    typeDocument={files[key]?.typeDocument}
                    setLockSignature={setLockSignature}
                    lockSignature={lockSignature}
                  />
                </View>
              );
            })}
          </>
        )}
    </ScrollView>
  );
};

export default AdmissionalContract;
