import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import Cardstyle4 from "../../../components/Card/Cardstyle4";
import FindPicture from "../../../hooks/findOne/picture";
import JobAdmissionScreen from "../HomeAdmission";
import { Text, SafeAreaView, ScrollView } from "react-native";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { isPending } from "@reduxjs/toolkit";
import JobPicture from "../../../hooks/upload/job";
import GetJobDocument from "../../../hooks/get/job/findDocument";

type Props = {
  jobConected: any;
  CPF: any;
};
const admissionalExam: React.FC<Props> = ({ jobConected, CPF }) => {
     const [myDocsData, setMyDocsData] = useState<any[] | null>(null);
      const [sendDocument, setSendDocument] = useState<boolean>(false);
      const [typeDocument, setTypeDocument] = useState<any>(null);
      const [statusDocument, setStatusDocument] = useState<string>("pending");
      const [pathDocument, setPathDocument] = useState<any>(null);
      const [loader, setLoader] = useState<any>(null);

      useFocusEffect(
        useCallback(() => {
          const fetchData = async () => {
            try {
              const response = await FindPicture(CPF); // Função que realiza a busca
              if (response.status === 200 && response.pictures) {
                const pictures = response.pictures;
      
                // Verificar se existe um objeto com "Medical_Examination" na chave "picture"
                const hasMedicalExamination = pictures.find((picture: any) =>
                  picture.picture === "Medical_Examination"
                );
      
                if (hasMedicalExamination) {
                  setStatusDocument(hasMedicalExamination.status);
                  const response = await GetJobDocument(jobConected[0].id, "medical", "1");
                  if (response.status === 200) {
                    if (hasMedicalExamination.status === "reproved") {
                      setSendDocument(true);
                    }
      
                    setTypeDocument(response.type);
                    setPathDocument(response.path);
                    setLoader(true);
                  }
                } else {
                  setSendDocument(true);
                  setTypeDocument(null);
                  setStatusDocument(null);
                  setLoader(true);
                  setPathDocument(null);
                }
              } else {
                console.log("No pictures found.");
              }
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
      
          fetchData();
      
          // Retorno opcional para limpar recursos quando a tela perde o foco
          return () => {
            setLoader(false);
          };
        }, [CPF, jobConected])
      );
      

  return (
    <View className={"mt-5 w-full "}>
       { jobConected ?
            <Cardstyle4
            documentName={"Exame Admissional"}
            sendDocument={sendDocument}
            typeDocument={typeDocument}
            statusDocument={statusDocument}
            twoPicture={false}
            path={pathDocument}
            jobId={jobConected[0].id}
            />
            :
            <Text>carregando</Text>
        }
      </View>
  );
};

export default admissionalExam;
