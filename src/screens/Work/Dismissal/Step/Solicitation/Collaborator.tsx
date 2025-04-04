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
import { FONTS } from "../../../../../constants/theme";
import DismissalCard from "../../../../../components/Card/DismissalCard";
import { useNavigation } from "@react-navigation/native";
import Cardstyle4 from "../../../../../components/Card/Cardstyle4";
import { IMAGES } from "../../../../../constants/Images";
import DocumentCard from "../../../../../components/Card/DocumentCard";
import FindPicture from "../../../../../hooks/findOne/picture";
import useCollaborator from "../../../../../function/fetchCollaborator";
import FindBucketCollaborator from "../../../../../hooks/bucket/collaborator";
import FindCollaborator from "../../../../../hooks/findOne/collaborator";
import FindFile from "../../../../../hooks/get/job/findFile";
import FindOneJob from "../../../../../hooks/get/job/findOne";
import GetColaboratorJob from "../../../../../hooks/get/job/findJobColaborator";
import DismissalSteps from "../Medical";

const DismissalHomeCompany = () => {
  const theme = useTheme();
  const [hasDemissional, setHasDemissional] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  const [myDocsData, setMyDocsData] = useState<any[] | null>(null);
  const { width, height } = Dimensions.get("window");
  const { collaborator, fetchCollaborator } = useCollaborator();
  const [process, setProcess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [idWork, setIdWork] = useState<any | null>(null);
  const [solicitationType, setSolicitationType] = useState<
    "company" | "collaborator" | null
  >(null);

  const Picture = async () => {
    try {
      if (!collaborator?.CPF) return;

      const response = await FindPicture(collaborator.CPF);
      console.log("response:", response);
      if (response.status == 200) {
        setError(false);

        // Configuração do documento de carta de demissão
        const documentInfo = await GetDocumentInfo("Dismissal_Hand");
        console.log("documentInfo:", documentInfo);
        if (documentInfo) {
          let document_params = {
            path: documentInfo?.path,
            DocumentName: "Carta a Punho",
            sendDocument: true,
            typeDocument: documentInfo?.type,
            twoPicture: false,
            statusDocument: null,
          };

          const dismissalDoc = response.pictures.find(
            (pic: { picture: string; status: string }) =>
              pic.picture === "Dismissal_Hand"
          );
          // console.log(document_params.statusDocument)

          if (dismissalDoc) {
            document_params.statusDocument = dismissalDoc.status;
            document_params.sendDocument = dismissalDoc.status === "reproved";
          }

          console.log("document_params:", document_params);

          setMyDocsData([document_params]);
          setProcess(true);

          // Verifique se statusDocument é "approved" e navegue para DismissalSteps
          // if (document_params.statusDocument === "approved") {
          //   navigation.navigate("DismissalSteps");
          // }
        }
        let document_params = {
          path: documentInfo?.path,
          DocumentName: "Carta a Punho",
          sendDocument: true,
          typeDocument: documentInfo?.type,
          twoPicture: false,
          statusDocument: null,
        };
        setMyDocsData([document_params]);
        return;
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      setError(true);
    }
  };

  const GetDocumentInfo = async (name: string) => {
    try {
      const props = {
        id: idWork,
        name: "Dismissal_Hand",
        signature: false,
      };
      const response = await FindFile(props.id, props.name, props.signature);
      console.log("response:", response);
      return response && response.path && response.type
        ? { path: response.path, type: response.type }
        : null;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (collaborator) {
        setIdWork(collaborator.id_work)
      }
    };
    fetchData();
  }, [collaborator]);

  React.useEffect(() => {
    if (collaborator && idWork) {
      Picture();
    }
  }, [collaborator, process, idWork]);

  return (
    <>
      <View>
        <View
          className={`bg-primary w-full p-3 rounded-xl flex-row justify-between`}
        >
          <View className={`w-full`}>
            <Text
              className={`absolute w-full`}
              style={{
                ...FONTS.fontSemiBold,
                fontSize: 22,
                color: "#000000",
                marginTop: -38,
              }}
            >
              Carta de Demissão
            </Text>
            <Text
              className={`mt-2`}
              style={{ ...FONTS.fontRegular, fontSize: 14 }}
            >
              Envie sua carta a punho para iniciar o processo, uma vez enviada,
              não será possível alterar e caso seja necessário, será necessário
              solicitar um novo processo.
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 50 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className={`px-2`}>
              <View style={{ marginBottom: 30 }}>
                {/* <Cardstyle4
                  documentName={data.DocumentName}
                  sendDocument={data.sendDocument}
                  typeDocument={data.typeDocument}
                  statusDocument={data.statusDocument}
                  twoPicture={data.twoPicture}
                  path={data.path}
                  jobId={idWork}
                /> */}
              </View>

          </View>
          <View className={`w-full h-64 items-center justify-center`}>
            <Image
              source={IMAGES.unique13}
              resizeMode="contain"
              className={`h-full w-full`}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default DismissalHomeCompany;
