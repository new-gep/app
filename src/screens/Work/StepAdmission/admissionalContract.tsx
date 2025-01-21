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
          const response = await CheckDocumentAdmissional(jobConected.id);

          const obligations = response.date.obligation;
          const dynamics = response.date.dynamic.document;
          setObligations(obligations);
          setDynamics(dynamics);
          // console.log("Obligations", obligations)
          // console.log("dynamics", dynamics)

          if (response.status === 200) {
            // console.log(jobConected[0].id)

            const files = {};

            await Promise.all(
              Object.entries(obligations).map(async ([key, value], index) => {
                //console.log(`Index: ${index}, Obligation: ${key}, Status: ${value}`);
                const response = await FindFile(jobConected[0].id, key, "0");
                const combined = { ...obligations, ...dynamics };
                delete combined.medical;
                setLockSignature(combined)
                files[key] = response; // Salva a resposta no objeto `files`
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
        files &&
        Object.entries(obligations).map(([key, value], index) => {
          if (key === "medical") {
            return;
          }
          // console.log(`Index: ${index}, Obligation: ${key}, Status: ${value}`);
          //console.log(response)
          // files[key] = response; // Salva a resposta no objeto `files`
          return (
            <>
              <AdmissionalCard
                key={key}
                status={value}
                title={key}
                path={files[key].path}
                typeDocument={files[key].typeDocument}
                setLockSignature={setLockSignature}
                lockSignature={lockSignature}
              />
              <View>

              </View>
            </>
          );
        })}
    </ScrollView>
  );
};

export default AdmissionalContract;
