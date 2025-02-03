import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { FONTS } from "../../../../constants/theme";
import DismissalCard from "../../../../components/Card/DismissalCard";
import { useNavigation } from "@react-navigation/native";
import Cardstyle4 from "../../../../components/Card/Cardstyle4";
import { IMAGES } from "../../../../constants/Images";
import DocumentCard from "../../../../components/Card/DocumentCard";
import FindPicture from "../../../../hooks/findOne/picture";
import useCollaborator from "../../../../function/fetchCollaborator";
import FindBucketCollaborator from "../../../../hooks/bucket/collaborator";
import FindCollaborator from "../../../../hooks/findOne/collaborator";
import FindFile from "../../../../hooks/get/job/findFile";
import FindOneJob from "../../../../hooks/get/job/findOne";
import GetColaboratorJob from "../../../../hooks/get/job/findJobColaborator";

const DismissalSteps = () => {
  const theme = useTheme();
  const [hasDemissional, setHasDemissional] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  const [myDocsData, setMyDocsData] = useState<any[] | null>(null);
  const { width, height } = Dimensions.get("window");
  const { collaborator, fetchCollaborator } = useCollaborator();
  const [process, setProcess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [idWork, setIdWork] = useState<number | null>(null);
  const [solicitationType, setSolicitationType] = useState<
    "company" | "collaborator" | null
  >(null);

  const getDocumentInfo = async (name: string) => {
    try {
      const props = {
        id: idWork,
        name: "Dismissal_Medical_Examination",
        signature: false,
      };
      const response = await FindFile(props.id, props.name, props.signature);
      return response && response.path && response.type
        ? { path: response.path, type: response.type }
        : null;
    } catch (error) {
      return null;
    }
  };

  const handleDocumentUpload = () => {
    navigation.navigate("Camera", {
      documentType: "Dismissal_Medical_Examination",
      twoPicture: false,
      returnScreen: "DismissalSteps",
      jobId: 0,
      onUploadComplete: () => {
        setTimeout(() => {
          setProcess(false);
          fetchCollaborator();
          Picture();
        }, 1000);
      },
    });
  };

  const Picture = async () => {
    try {
      if (!collaborator?.CPF) return;

      console.log("Colaborador CPF:", collaborator.CPF);

      const response = await FindPicture(collaborator.CPF);
      console.log("Resposta da busca de imagem:", response);

      if (response.status == 200) {
        setError(false);
      }
      // Configuração do documento de carta de demissão
      const documentInfo = await getDocumentInfo("Dismissal_Medical_Examination");
      console.log("Informações do documento:", documentInfo);

      let document_params = {
        path: documentInfo?.path,
        DocumentName: "Exame Demissional",
        sendDocument: true,
        typeDocument: documentInfo?.type,
        twoPicture: false,
        statusDocument: null,
      };

      const dismissalDoc = response.pictures.find(
        (pic: { picture: string; status: string }) =>
          pic.picture === "Dismissal_Medical_Examination"
      );

      if (dismissalDoc) {
        document_params.statusDocument = dismissalDoc.status;
        console.log('lalala', document_params.statusDocument)
        document_params.sendDocument = dismissalDoc.status === "reproved";
        
        // Nova verificação para status 'approved'
        if (dismissalDoc.status === "approved") {
          // Navegar para a tela DismissalSignature
          navigation.navigate("DismissalSignature");
        }
      }

      setMyDocsData([document_params]);
      setProcess(true);

    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      setError(true);
    } 
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setProcess(false);
      fetchCollaborator();
    });
    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    if (collaborator) {
      Picture();
    }
  }, [collaborator, process]);

  useEffect(() => {
    const fetchData = async () => {
      if (collaborator) {
        const response = await FindCollaborator(collaborator.CPF);
        console.log("Resposta da busca de colaborador:", response);

        if (response.status == 200) {
          if (response.collaborator.id_work) {
            setIdWork(response.collaborator.id_work);
            console.log("ID do trabalho do colaborador:", idWork);
          }
        }
      }
    };
    fetchData();
  }, [collaborator]);

//   useEffect(() => {
//     const fetchData = async () => {
    //   if (collaborator) {
    //     const responseCollaborator = await FindCollaborator(collaborator.CPF);
    //     if (responseCollaborator.status == 200) {
    //       const responseJob = await FindOneJob(
    //         responseCollaborator.collaborator.id_work
    //       );
    //       if (responseJob.status == 200) {
    //         if (responseJob.job.demission) {
    //           setHasDemissional(true);
    //           setSolicitationType(
    //             JSON.parse(responseJob.job.demission).solicitation
    //           );
    //           //console.log("responseJob:", responseJob.job.demission);

    //           // Adicione um log para verificar o tipo de demissão
    //           //console.log("Tipo de demissão:", typeof responseJob.job.demission, responseJob.job.demission);

    //           // Verifique se é uma string e se contém 'company'
    //           if (
    //             typeof responseJob.job.demission === "string" &&
    //             responseJob.job.demission === "company"
    //           ) {
    //             // console.log("Caiu aqui");
    //             navigation.navigate("DismissalHomeCompany");
    //           }
    //         }
    //       }
    //     }
    //     return;
    //   }
//     };
//     fetchData();
//   }, [collaborator]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (collaborator) {
//         const response = await GetColaboratorJob();
//         if (response.status === 200) {
//             const dismissalData = response.jobs[0];
//             console.log("response dismissal:", collaborator);
//             return;
//             if (dismissalData && dismissalData.step === 1) {
//                 setHasDemissional(true);
//                 setSolicitationType(dismissalData.solicitation);
//                 return;
//             if (dismissalData.solicitation === 'company') {
//               navigation.navigate('DismissalHomeCompany');
//             }
//           }
//         }
//       }
//     };
//     fetchData();
//   }, [idWork, collaborator]);

  return (
    <View style={{ marginTop: 50, padding: 20, backgroundColor: theme.colors.background }}>
      <View className="flex-row items-center mb-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center shadow">
            <Text
              style={{ ...FONTS.fontMedium, fontSize: 20, lineHeight: 20 }}
              className="text-center"
            >
              ←
            </Text>
          </View>
        </TouchableOpacity>
        <Text
          className="text-2xl font-semibold text-gray-900 dark:text-white flex-1 text-center"
          style={{ ...FONTS.fontSemiBold, marginLeft: 10 }}
        >
          Enviar exame demissional
        </Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className={`px-2 w-full mt-10`}>
          <View className={`w-full h-80 items-center justify-center mb-5`}>
            <Image
              source={IMAGES.unique13}
              resizeMode="contain"
              className={`h-full w-full`}
            />
          </View>
          {myDocsData?.map((data: any) => (
            <View key={data.DocumentName} style={{ marginBottom: 30 }}>
              <Cardstyle4
                documentName={data.DocumentName}
                sendDocument={data.sendDocument}
                typeDocument={data.typeDocument}
                statusDocument={data.statusDocument}
                twoPicture={data.twoPicture}
                path={data.path}
                jobId={idWork}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      {error && <Text style={{ color: 'red', textAlign: 'center' }}>Erro ao carregar documentos.</Text>}
      {process && <Text style={{ color: 'blue', textAlign: 'center' }}>Carregando...</Text>}
    </View>
  );
};

export default DismissalSteps;
