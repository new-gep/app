import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import CheckDocumentAdmissional from "../../../hooks/get/job/checkSignaure";
import AdmissionalCard from "./AdmissionalCard";
import FindFile from "../../../hooks/get/job/findDocsAdmission";
import DocumentVisible from "../../../components/Modal/DocumentVisible";
import { Title } from "react-native-paper";

type Props = {
  jobConected: any;
  CPF: any;
};

const AdmissionalContract = ({ jobConected, CPF }: Props) => {
  const [data, setData] = useState({
    medical: false,
    registration: false,
    experience: false,
    extension: false,
    compensation: false,
    voucherDocument: false,
    signature: false,
  });

  const [obligation, setObligation] = useState(null);
  const [dynamics, setDynamic] = useState(null);

  const [files, setFiles] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (jobConected) {
        const files = {};
        try {
          const response = await CheckDocumentAdmissional(jobConected.id);

          const obligations = response.date.obligation;
          const dynamics = response.date.dynamic.document;
          setObligation(obligations);
          setDynamic(dynamics);

          if (response.status === 200) {
            // console.log(jobConected[0].id)

            const files = {};

            await Promise.all(
              Object.entries(obligations).map(async ([key, value], index) => {
                //console.log(`Index: ${index}, Obligation: ${key}, Status: ${value}`);
                const response = await FindFile(jobConected[0].id, key, "0");
                //console.log(response)
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
      {obligation &&
        files &&
        Object.entries(obligation).map(([key, value], index) => {
          // console.log(`Index: ${index}, Obligation: ${key}, Status: ${value}`);
          //console.log(response)
          // files[key] = response; // Salva a resposta no objeto `files`
          return (
            <AdmissionalCard
              status={value}
              title={key}
              path={files[key].path}
              typeDocument={files[key].typeDocument}
            />
          );
        })}
    </ScrollView>
  );
};

export default AdmissionalContract;
