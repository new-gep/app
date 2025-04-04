import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { IMAGES } from "../../constants/Images";
import { COLORS, FONTS } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import Cardstyle4 from "../../components/Card/Cardstyle4";
import { useCollaboratorContext } from "../../context/CollaboratorContext";
import CheckCadasterCollaboratorDocument from "../utils/checkCadasterCollaboratorDocument";
import { useNavigation } from "@react-navigation/native";
import FindPicture from "../../hooks/findOne/picture";
import useCollaborator from "../../function/fetchCollaborator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Mask from "../../function/mask";
import FindBucketCollaborator from "../../hooks/bucket/collaborator";
import Header from "../../layout/Header";

type PicturesProps = {
  CNH: { status: string } | null;
  Voter_Registration: { status: string } | null;
  [key: string]: { status: string | null } | null;
};

const Documents = () => {
  const navigation = useNavigation<any>();
  const { validateCollaborator, missingData } = useCollaboratorContext();
  const { collaborator, fetchCollaborator } = useCollaborator();
  const [myDocsData, setMyDocsData] = useState<any[] | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [process, setProcess] = useState<boolean>(false);
  const [picturesData, setPicturesData] = useState<PicturesProps | {}>({
    Voter_Registration: null,
    CNH: null,
  });
  const { width, height } = Dimensions.get("window");

  const Picture = async () => {
    try {
      const response = await FindPicture(collaborator.CPF);
      if (response.status != 500) {
        setError(false);
        const picturesFromAPI = response.pictures;

        // const picturesFromAPI = response.pictures?.filter((picture: any) => {
        //   return (
        //     !picture.picture.toLowerCase().includes("signature") &&
        //     !picture.picture.toLowerCase().includes("medical") &&
        //     !picture.picture.toLowerCase().includes("dismissal") &&
        //     !picture.picture.toLowerCase().includes("admission")
        //   );
        // });
        // console.log(picturesFromAPI)

        let tempPictureCard: { [key: string]: any } = {};

        const updatedPicturesData = { ...picturesData };

        if (picturesFromAPI && picturesFromAPI.length > 0) {
          picturesFromAPI.forEach(
            (pictureObj: { picture: string; status: string }) => {
              const { picture, status } = pictureObj;

              updatedPicturesData[picture as keyof PicturesProps] = { status };
            }
          );
        }

        // Recuperar os dados das crianças antes da iteração
        let dataToStore = await AsyncStorage.getItem("missingDates");
        let missingDates = dataToStore ? JSON.parse(dataToStore) : {};
        let missingDocumentsChildren = Array.isArray(
          missingDates.missingDocumentsChildren
        )
          ? missingDates.missingDocumentsChildren
          : [];

        if (missingDocumentsChildren && missingDocumentsChildren.length > 0) {
          missingDocumentsChildren.map((children: any) => {
            setPicturesData((prevData) => {
              const key = `Birth_Certificate_${children}`; // Criar chave dinâmica

              // Verifica se a chave já existe no objeto
              if (!prevData[key]) {
                return {
                  [key]: null, // Se não existir, adiciona o novo campo
                  ...prevData,
                };
              }

              return prevData; // Se já existir, retorna o estado anterior sem modificações
            });
          });
        }

        if (
          missingDates.missingDocuments &&
          missingDates.missingDocuments.length > 0
        ) {
          missingDates.missingDocuments.map((document: any) => {
            if (document == "Birth_Certificate") {
              return;
            }
            setPicturesData((prevData) => {
              // Verifica se a chave já existe no objeto
              if (!prevData[document]) {
                return {
                  [document]: null, // Se não existir, adiciona o novo campo
                  ...prevData,
                };
              }
              return prevData; // Se já existir, retorna o estado anterior sem modificações
            });
          });
        }
        // Iterando sobre os documentos
        const documentPromise = Object.entries(updatedPicturesData).forEach(
          ([documentKey, documentStatus]) => {
            // Se houver um status válido, cria um card para o documento

            const checkDocument = documentKey;
            switch (checkDocument) {
              case "Military_Certificate":
                // console.log("aq");
                if (collaborator.sex == "F") {
                  return;
                }
                break;
              case "Marriage_Certificate":
                if (collaborator.marriage == "0") {
                  return;
                }
                break;
            }

            if (documentStatus) {
              let document_params: {};

              document_params = {
                path: getPathDocument(documentKey),
                DocumentName: getNameDocument(documentKey),
                sendDocument:
                  documentStatus.status != "reproved" ? false : true,
                typeDocument: getTypeDocument(documentKey),
                twoPicture: getTwoPictureDocument(documentKey),
                statusDocument: documentStatus.status,
              };

              // Adicionar ao objeto temporário, usando o nome do documento como chave
              tempPictureCard[getNameDocument(documentKey)] = document_params;

              return;
            }

            // Caso geral para outros documentos
            let document_params = {
              path: getPathDocument(documentKey),
              DocumentName: getNameDocument(documentKey),
              sendDocument: true,
              typeDocument: getTypeDocument(documentKey),
              twoPicture: getTwoPictureDocument(documentKey),
              statusDocument: null,
            };

            // Adicionar ao objeto temporário para evitar duplicatas
            tempPictureCard[getNameDocument(documentKey)] = document_params;
          }
        );

        // Converter o objeto temporário de volta para um array
        let picture_card = Object.values(tempPictureCard);

        setMyDocsData(picture_card);
        return;
      }
      setError(true);
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
    } finally {
      setProcess(true);
    }
  };

  const getNameDocument = (name: string) => {
    if (name.toLowerCase().includes("birth_certificate")) {
      const parts = name.split("_");
      return `Certidão de Nascimento (${parts[2]})`;
    } else {
      switch (name.toLowerCase()) {
        case "rg":
          return "RG";
        case "military_certificate":
          return "Certificado Militar";
        case "address":
          return "Comprovante de Endereço";
        case "work_card":
          return "Carteira de Trabalho";
        case "school_history":
          return "Histórico Escolar";
        case "marriage_certificate":
          return "Certidão de Casamento";
        case "cnh":
          return "CNH (opcional)";
        case "voter_registration":
          return "Titulo de Eleitor (opcional)";
        default:
          console.log(name);
          return "?";
      }
    }
  };

  const getTwoPictureDocument = (name: string) => {
    if (name.toLowerCase().includes("birth_certificate")) {
      return false;
    } else {
      switch (name.toLowerCase()) {
        case "rg":
          return true;
        case "address":
          return false;
        case "work_card":
          return true;
        case "school_history":
          return false;
        case "marriage_certificate":
          return false;
        case "birth_certificate":
          return false;
        case "cnh":
          return true;
        case "military_certificate":
          return false;
        case "voter_registration":
          return true;
        default:
          return "?";
      }
    }
  };

  const getPathDocument = async (name: string) => {
    let response: any;
    if (name.toLowerCase().includes("birth_certificate")) {
      response = await FindBucketCollaborator(collaborator.CPF, name);
      return response.path;
    } else {
      switch (name.toLowerCase()) {
        case "rg":
          response = await FindBucketCollaborator(collaborator.CPF, "RG");
          return response.path;
        case "work_card":
          response = await FindBucketCollaborator(
            collaborator.CPF,
            "Work_Card"
          );
          return response.path;
        case "address":
          response = await FindBucketCollaborator(collaborator.CPF, "Address");
          return response.path;
        case "school_history":
          response = await FindBucketCollaborator(
            collaborator.CPF,
            "School_History"
          );
          return response.path;
        case "military_certificate":
          response = await FindBucketCollaborator(
            collaborator.CPF,
            "Military_Certificate"
          );
          return response.path;
        case "marriage_certificate":
          response = await FindBucketCollaborator(
            collaborator.CPF,
            "Marriage_Certificate"
          );
          return response.path;
        case "cnh":
          response = await FindBucketCollaborator(collaborator.CPF, "CNH");
          return response.path;
        case "voter_registration":
          response = await FindBucketCollaborator(
            collaborator.CPF,
            "Voter_Registration"
          );
          return response.path;
        default:
          return "?";
      }
    }
  };

  const getTypeDocument = async (name: string) => {
    let response: any;
    if (name.toLowerCase().includes("birth_certificate")) {
      response = await FindBucketCollaborator(collaborator.CPF, name);
      return response.type;
    } else {
      switch (name.toLowerCase()) {
        case "rg":
          response = await FindBucketCollaborator(collaborator.CPF, "RG");
          return response.type;
        case "address":
          response = await FindBucketCollaborator(collaborator.CPF, "Address");
          return response.type;
        case "work_card":
          response = await FindBucketCollaborator(
            collaborator.CPF,
            "Work_Card"
          );
          return response.type;
        case "school_history":
          response = await FindBucketCollaborator(
            collaborator.CPF,
            "School_History"
          );
          return response.type;
        case "marriage_certificate":
          response = await FindBucketCollaborator(
            collaborator.CPF,
            "Marriage_Certificate"
          );
          return response.type;
        case "cnh":
          response = await FindBucketCollaborator(collaborator.CPF, "CNH");
          return response.type;
        case "military_certificate":
          response = await FindBucketCollaborator(
            collaborator.CPF,
            "Military_Certificate"
          );
          return response.type;
        case "voter_registration":
          response = await FindBucketCollaborator(
            collaborator.CPF,
            "Voter_Registration"
          );
          return response.type;
        default:
          return "?";
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCollaborator();
    });
    return unsubscribe;
  }, [navigation, missingData]);

  useEffect(() => {
    if (collaborator) {
      Picture();
    }
  }, [collaborator, process, missingData]);

  return (
    <>
      {error ? (
        <View>
          <Header
            title="Documentos"
            leftIcon="back"
            //titleLeft
            iconSimple={`folder`}
          />
          <View className={`mt-10 items-center`}>
            <Text style={{ ...FONTS.fontMedium }} className={`text-danger`}>
              ERRO
            </Text>
            <Text style={{ ...FONTS.fontMedium }}>
              Algo deu errado, tente mais tarde
            </Text>
          </View>
        </View>
      ) : (
        <View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
          <Header title="Documentos" leftIcon="back" iconSimple={`folder`} />
          <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 70 }}
            >
              <View className={`px-5`}>
                <CheckCadasterCollaboratorDocument />
              </View>
              <View className={`p-3 mt-5`}>
                <View
                  className={`mt-16 bg-primary w-full p-3 rounded-xl flex-row justify-between`}
                >
                  <View className={`w-2/4`}>
                    <Text
                      className={`absolute w-44`}
                      style={{
                        ...FONTS.fontSemiBold,
                        fontSize: 24,
                        color: "#000000",
                        marginTop: -38,
                      }}
                    >
                      Organização
                    </Text>
                    <Text
                      className={`mt-2`}
                      style={{ ...FONTS.fontRegular, fontSize: 14 }}
                    >
                      Aqui organizamos seus documentos para que as empresas
                      possam acessá-los facilmente.
                    </Text>
                  </View>
                  <View className={`w-2/4`}>
                    <Image
                      source={IMAGES.unique14}
                      style={{
                        height: height * 0.3, // Ajuste dinâmico para altura
                        width: width * 0.5, // Ajuste dinâmico para largura
                        resizeMode: "contain",
                        marginTop: -120,
                      }}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  GlobalStyleSheet.container,
                  { paddingTop: 20, paddingHorizontal: 10 },
                ]}
              >
                <View style={{ marginTop: 50 }}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View className={`px-2`}>
                      {myDocsData &&
                        process &&
                        myDocsData.map((data: any) => {
                          return (
                            <View
                              key={data.DocumentName}
                              style={{ marginBottom: 30 }}
                            >
                              <Cardstyle4
                                documentName={data.DocumentName}
                                sendDocument={data.sendDocument}
                                typeDocument={data.typeDocument}
                                statusDocument={data.statusDocument}
                                twoPicture={data.twoPicture}
                                path={data.path}
                                jobId={0}
                              />
                            </View>
                          );
                        })}
                    </View>
                    <View className={`w-full h-72 items-center justify-center`}>
                      <Image
                        source={IMAGES.unique13}
                        resizeMode="contain"
                        className={`h-full w-full`}
                      />
                    </View>
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </>
  );
};

export default Documents;
