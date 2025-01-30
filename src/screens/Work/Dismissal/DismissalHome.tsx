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
import { FONTS } from "../../../constants/theme";
import DismissalCard from "../../../components/Card/DismissalCard";
import { useNavigation } from "@react-navigation/native";
import Cardstyle4 from "../../../components/Card/Cardstyle4";
import { IMAGES } from "../../../constants/Images";
import DocumentCard from "../../../components/Card/DocumentCard";
import FindPicture from "../../../hooks/findOne/picture";
import useCollaborator from "../../../function/fetchCollaborator";
import FindBucketCollaborator from "../../../hooks/bucket/collaborator";
import FindCollaborator from "../../../hooks/findOne/collaborator";
import FindFile from "../../../hooks/get/job/findFile";
import FindOneJob from "../../../hooks/get/job/findOne";
import GetColaboratorJob from "../../../hooks/get/job/findJobColaborator";

const DismissalHome = () => {
  const theme = useTheme();
  const [hasDemissional, setHasDemissional] = useState<boolean>(false);
  const navigation = useNavigation<any>();
  const [myDocsData, setMyDocsData] = useState<any[] | null>(null);
  const { width, height } = Dimensions.get("window");
  const { collaborator, fetchCollaborator } = useCollaborator();
  const [process, setProcess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [idWork, setIdWork] = useState<number | null>(null);
  const [solicitationType, setSolicitationType] = useState<'company' | 'collaborator' | null>(null);

  const handleDocumentUpload = () => {
    navigation.navigate("Camera", {
      documentType: "Dismissal_Hand",
      twoPicture: false,
      returnScreen: "DismissalHome",
      jobId: 0,
      onUploadComplete: () => {
        setTimeout(() => {
          setProcess(false);
          fetchCollaborator();
          Picture();
        }, 1000);
      }
    });
  };


  const Picture = async () => {
    try {
      if (!collaborator?.CPF) return;
      
      const response = await FindPicture(collaborator.CPF);
      if (response.status == 200) {
        setError(false);

        // Configuração do documento de carta de demissão
        const documentInfo = await getDocumentInfo("Dismissal_Hand");
        let document_params = {
          path: documentInfo?.path,
          DocumentName: "Carta a Punho",
          sendDocument: true,
          typeDocument: documentInfo?.type,
          twoPicture: false,
          statusDocument: null,
        };

        const dismissalDoc =  response.pictures.find(
          (pic: { picture: string; status: string }) => 
            pic.picture === "Dismissal_Hand"
        );

        if (dismissalDoc) {
          document_params.statusDocument = dismissalDoc.status;
          document_params.sendDocument = dismissalDoc.status === "reproved";
        }

        setMyDocsData([document_params]);
        setProcess(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      setError(true);
    }
  };

  const getDocumentInfo = async (name: string) => {
    try {
      const props = {
        id: idWork,
        name: 'Dismissal_Hand',
        signature: false,
      }
      const response = await FindFile(props.id, props.name, props.signature);
      return response && response.path && response.type ? { path: response.path, type: response.type } : null;
    } catch (error) {
      return null;
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
        if (response.status == 200) {
          console.log(response.jobs);
          if (response.collaborator.id_work) {
            setIdWork(response.collaborator.id_work);
          }
        }
      }
    };
    fetchData();
  }, [collaborator]);

  useEffect(() => {
    const fetchData = async () => {
      if (collaborator) {
        const response = await GetColaboratorJob();
        if (response.status === 200) {
          const dismissalData = response.jobs;
          if (dismissalData && dismissalData.step === 1) {
            setHasDemissional(true);
            setSolicitationType(dismissalData.solicitation);

            if (dismissalData.solicitation === 'company') {
              navigation.navigate('DismissalHomeCompany');
            }
          }
        }
      }
    };
    fetchData();
  }, [idWork, collaborator]);
  
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {error ? (
        <View className={`mt-10 items-center`}>
          <Text style={{ ...FONTS.fontMedium }} className={`text-danger`}>
            ERRO
          </Text>
          <Text style={{ ...FONTS.fontMedium }}>
            Algo deu errado, tente mais tarde
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
        >
          <View className="px-5 mt-14">
            <View className="flex-row items-center mb-5">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                  <Text
                    style={{ ...FONTS.fontMedium, fontSize: 20, lineHeight: 20 }}
                    className="text-center"
                  >
                    ←
                  </Text>
                </View>
              </TouchableOpacity>

              <Text
                className="text-2xl font-semibold text-gray-900 dark:text-white flex-1 text-center -ml-10"
                style={FONTS.fontSemiBold}
              >
                {solicitationType === 'company' ? 'Demissão pela Empresa' : 'Solicitação de Demissão'}
              </Text>
            </View>

            {solicitationType === 'company' ? (
              <View className="p-3 mt-5">
                <Text style={{ ...FONTS.fontMedium }} className="text-center">
                  Você está em processo de demissão pela empresa.
                  Por favor, aguarde as próximas instruções.
                </Text>
              </View>
            ) : (
              <>
                <View className={`p-3 mt-5`}>
                  <View
                    className={`mt-16 bg-primary w-full p-3 rounded-xl flex-row justify-between`}
                  >
                    <View className={`w-2/4`}>
                      <Text
                        className={`absolute w-44`}
                        style={{
                          ...FONTS.fontSemiBold,
                          fontSize: 22,
                          color: "#000000",
                          marginTop: -38,
                        }}
                      >
                        Documentação
                      </Text>
                      <Text
                        className={`mt-2`}
                        style={{ ...FONTS.fontRegular, fontSize: 14 }}
                      >
                        Envie sua carta de demissão para iniciar o processo
                      </Text>
                    </View>
                    <View className={`w-2/4`}>
                      <Image
                        source={IMAGES.unique14}
                        style={{
                          height: height * 0.3,
                          width: width * 0.5,
                          resizeMode: "contain",
                          marginTop: -120,
                        }}
                      />
                    </View>
                  </View>
                </View>

                <View style={{ marginTop: 50 }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View className={`px-2`}>
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
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default DismissalHome;
