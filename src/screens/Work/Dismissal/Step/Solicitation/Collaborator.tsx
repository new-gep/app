import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { COLORS, FONTS } from "../../../../../constants/theme";
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
import WaitingIndicatorDismissal from "../WaitingIndicator";
import FindOnePicture from "~/src/hooks/findOne/onePicture";

const DismissalHomeCompany = () => {
  const theme = useTheme();
  const [loader, setLoader] = useState<boolean>(true);
  const navigation = useNavigation<any>();
  const [myDocsData, setMyDocsData] = useState<any | null>(null);
  const { width, height } = Dimensions.get("window");
  const { collaborator, fetchCollaborator } = useCollaborator();
  const [statusDocument, setStatusDocument] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const [idWork, setIdWork] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const finishSendDocument = async (props: any) => {
    if (props == 200) {
      setStatusDocument("pending");
    }
  };

  const Picture = async () => {
    try {
      if (!collaborator?.CPF) return;
      const response = await FindOnePicture(
        "Dismissal_Hand",
        collaborator.CPF,
        idWork
      );
      if (response.status == 200) {
        setError(false);
        const documentInfo = await GetDocumentInfo("Dismissal_Hand");
        if (documentInfo) {
          let document_params = {
            path: documentInfo?.path,
            DocumentName: "Carta a Punho",
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
          DocumentName: "Carta a Punho",
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

  const GetDocumentInfo = async (name: string) => {
    try {
      const props = {
        id: idWork,
        name: "Dismissal_Hand",
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Picture();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (collaborator) {
        //@ts-ignore
        setIdWork(collaborator.id_work.id);
      }
    };
    fetchData();
  }, [collaborator]);

  React.useEffect(() => {
    if (collaborator && idWork) {
      Picture();
    }
  }, [collaborator, idWork]);

  return (
    <>
      {!loader ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.dark]}
            />
          }
        >
          {statusDocument === "approved" || statusDocument === "pending" ? (
            <View className="mt-5">
              <WaitingIndicatorDismissal current={1} visible={true} />
            </View>
          ) : (
            <>
              <View className={`bg-primary w-full p-3 rounded-xl mt-10`}>
                <View className={`w-full`}>
                  <Text
                    className={`w-full`}
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
                    Envie sua carta a punho para iniciar o processo, uma vez
                    enviada, não será possível alterar e caso seja necessário,
                    será necessário solicitar um novo processo.
                  </Text>
                </View>
              </View>
              <View className={`px-2 mt-10`}>
                {myDocsData && (
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
                )}
              </View>
              <View className={`w-full h-64 items-center justify-center`}>
                <Image
                  source={IMAGES.unique13}
                  resizeMode="contain"
                  className={`h-full w-full`}
                />
              </View>
            </>
          )}
        </ScrollView>
      ) : (
        <View
          className="items-center flex justify-center"
          style={{ flex: 0, minHeight: height }}
        >
          <ActivityIndicator size={"large"} color={COLORS.dark} />
        </View>
      )}
    </>
  );
};

export default DismissalHomeCompany;
