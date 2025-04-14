import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { COLORS, useTheme } from "@react-navigation/native";
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
import TimelineDemission from "../../../../components/Timeline/TimelineDemission";
import WaitingIndicatorDismissal from "./WaitingIndicator";
import FindOnePicture from "~/src/hooks/findOne/onePicture";

const DismissalExamination = ({jobConected, CPF}: {jobConected: any, CPF: any}) => {
  const theme = useTheme();
  const [loader, setLoader] = useState<boolean>(true);

  const navigation = useNavigation<any>();
  const [myDocsData, setMyDocsData] = useState<any | null>(null);
  const [statusDocument,setStatusDocument] = useState<any>(null)
  const { width, height } = Dimensions.get("window");
  const [refreshing, setRefreshing] = useState(false);
  const { collaborator, fetchCollaborator } = useCollaborator();
  const [idWork, setIdWork] = useState<any>(null);
  const [process, setProcess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getDocumentInfo = async (name: string) => {
    try {
      const props = {
        id: jobConected.id,
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

  // const Picture = async () => {
  //   try {
  //     if (!CPF) return;
  //     // console.log("Colaborador CPF:", CPF);
  //     const response = await FindPicture(CPF);

  //     if (response.status == 200) {
  //       setError(false);
  //     }

  //     const documentInfo = await getDocumentInfo("Dismissal_Medical_Examination");

  //     let document_params = {
  //       path: documentInfo?.path,
  //       DocumentName: "Exame Demissional",
  //       sendDocument: true,
  //       typeDocument: documentInfo?.type,
  //       twoPicture: false,
  //       statusDocument: null,
  //     };
  //     // Configuração do documento de carta de demissão
  //     // console.log("Informações do documento:", document_params);
  //     const dismissalDoc = response.pictures.find(
  //       (pic: { picture: string; status: string }) =>
  //         pic.picture === "Dismissal_Medical_Examination"
  //     );

  //     if (dismissalDoc) {
  //       document_params.statusDocument = dismissalDoc.status;
  //       // console.log('lalala', document_params.statusDocument)
  //       document_params.sendDocument = dismissalDoc.status === "reproved";
        
  //     }

  //     setMyDocsData([document_params]);
  //     setProcess(true);

  //   } catch (error) {
  //     console.error("Erro ao buscar imagens:", error);
  //     setError(true);
  //   } 
  // };

  const Picture = async () => {
    try {
      if (!collaborator?.CPF) return;
      const response = await FindOnePicture(
        "Dismissal_Medical_Examination",
        collaborator.CPF,
        idWork
      );
      if (response.status == 200) {
        const documentInfo = await getDocumentInfo("Dismissal_Medical_Examination");
        if (documentInfo) {
          let document_params = {
            path: documentInfo?.path,
            DocumentName: "Exame Demissional",
            sendDocument: true,
            typeDocument: documentInfo?.type,
            twoPicture: false,
            statusDocument: response.pictures.status,
          };
          setMyDocsData(document_params);
          setStatusDocument(response.pictures.status);
        }

        let document_params = {
          path: documentInfo?.path,
          DocumentName: "Exame Demissional",
          sendDocument: true,
          typeDocument: documentInfo?.type,
          twoPicture: false,
          statusDocument: response.pictures.status,
        };
        setMyDocsData(document_params);
        return;
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      setError(true);
    } finally {
      setLoader(false);
      setRefreshing(false);
    }
  };

  const finishSendDocument = async (props: any) => {
    if (props == 200) {
      setStatusDocument("pending");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (collaborator) {
        //@ts-ignore
        setIdWork(collaborator.id_work.id);
      }
    };
    fetchData();
  }, [collaborator]);

  useEffect(() => {

    if (collaborator && jobConected && idWork) {
      Picture();
    }
  }, [collaborator, process, jobConected]);


  return (
    <View>

      { statusDocument === "approved" || statusDocument === "pending" ? 
        <View
          className="items-center flex justify-center"
        >
          <WaitingIndicatorDismissal visible={true} current={2} />
        </View>
        :
        <ScrollView showsVerticalScrollIndicator={false}>
          <TimelineDemission currentStep={2} showProgress={true} />
          <View className={`px-2 w-full`}>
              { myDocsData &&
                <View style={{ marginBottom: 30 }}>
                  <Cardstyle4
                    documentName={myDocsData.DocumentName}
                    sendDocument={myDocsData.sendDocument}
                    typeDocument={myDocsData.typeDocument}
                    statusDocument={myDocsData.statusDocument}
                    twoPicture={myDocsData.twoPicture}
                    path={myDocsData.path}
                    jobId={idWork}
                    finishSendDocument={finishSendDocument}
                  />
                </View>
              }
          </View>
          <View className={`w-full h-80 items-center justify-center`}>
              <Image
                source={IMAGES.unique13}
                resizeMode="contain"
                className={`h-full w-full`}
              />
          </View>
        </ScrollView>
      }

      {error && <Text style={{ color: 'red', textAlign: 'center' }}>Erro ao carregar documentos.</Text>}
    </View>
  );
};

export default DismissalExamination;
