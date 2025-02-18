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

const DismissalExamination = ({jobConected, CPF}: {jobConected: any, CPF: any}) => {
  const theme = useTheme();


  const navigation = useNavigation<any>();
  const [myDocsData, setMyDocsData] = useState<any[] | null>(null);
  const { width, height } = Dimensions.get("window");
  const { collaborator, fetchCollaborator } = useCollaborator();
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
      if (!CPF) return;
      // console.log("Colaborador CPF:", CPF);
      const response = await FindPicture(CPF);

      if (response.status == 200) {
        setError(false);
      }

      const documentInfo = await getDocumentInfo("Dismissal_Medical_Examination");

      let document_params = {
        path: documentInfo?.path,
        DocumentName: "Exame Demissional",
        sendDocument: true,
        typeDocument: documentInfo?.type,
        twoPicture: false,
        statusDocument: null,
      };
      // Configuração do documento de carta de demissão
      // console.log("Informações do documento:", document_params);
      const dismissalDoc = response.pictures.find(
        (pic: { picture: string; status: string }) =>
          pic.picture === "Dismissal_Medical_Examination"
      );

      if (dismissalDoc) {
        document_params.statusDocument = dismissalDoc.status;
        // console.log('lalala', document_params.statusDocument)
        document_params.sendDocument = dismissalDoc.status === "reproved";
        
      }

      setMyDocsData([document_params]);
      setProcess(true);

    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      setError(true);
    } 
  };

  React.useEffect(() => {
    if (collaborator) {
      Picture();
    }
  }, [collaborator, process]);


  return (
    <View style={{ marginTop: 50, padding: 20, backgroundColor: theme.colors.background }}>
      <View className="flex-row items-center mb-5">
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center shadow">
            <Text
              style={{ ...FONTS.fontMedium, fontSize: 20, lineHeight: 20 }}
              className="text-center"
            >
              ←
            </Text>
          </View>
        </TouchableOpacity> */}
        <Text
          className="text-2xl font-semibold text-gray-900 dark:text-white flex-1 text-center"
          style={{ ...FONTS.fontSemiBold, marginLeft: 10 }}
        >
          Enviar Exame Demissional
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
                jobId={jobConected.id}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      {error && <Text style={{ color: 'red', textAlign: 'center' }}>Erro ao carregar documentos.</Text>}
    </View>
  );
};

export default DismissalExamination;
