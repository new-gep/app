import { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "../../constants/theme";
import GetPathPicture from "../../function/getPathPicture";
import * as FileSystem from "expo-file-system";
import { useNavigation, useTheme } from "@react-navigation/native";
import CreateAvalidPicture from "../../hooks/create/pictures";
import useCollaborator from "../../function/fetchCollaborator";
import UploadFile from "../../hooks/upload/picture";
import RBSheet from "react-native-raw-bottom-sheet";
import SuccessSheet from "../BottomSheet/SuccessSheet";
import DangerSheet from "../BottomSheet/DangerSheet";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdatePicture from "../../hooks/update/picture";
import { useCollaboratorContext } from "../../context/CollaboratorContext";
import JobPicture from "../../hooks/upload/job";
import UpdateJob from "../../hooks/update/job/default";
import uploadAbsence from "../../hooks/upload/absence";
type PropsCreateAvalidPicture = {
  picture: string;
  status: string;
  cpf: string;
};

type PropsUpdateAvalidPicture = {
  picture: string;
  status: string;
};

type Props = {
  onSuccess?: () => void;
  documentName: string;
  visible: boolean;
  twoPicture: boolean;
  close: () => void;
  statusDocument: any;
  setTypeDocument: any;
  setSendPicture: any;
  setPath: any;
  jobId: any;
  path: any;
  absenceData?: {
    path: string;
    file_name: string;
    id_work: string;
    year: string;
    month: string;
  };
};

const DocumentSendServices = ({
  jobId,
  statusDocument,
  setSendPicture,
  documentName,
  twoPicture,
  setTypeDocument,
  path,
  setPath,
  visible,
  close,
  absenceData,
  onSuccess
}: Props) => {
  const navigation = useNavigation<any>();
  const [front, setFront] = useState<any | null>(null);
  const [back, setBack] = useState<any | null>(null);
  const [selection, setSelection] = useState<String | null>(null);
  const { collaborator, fetchCollaborator } = useCollaborator();
  const { validateCollaborator, missingData } = useCollaboratorContext();
  const [messageSheet, setMessageSheet] = useState(String);
  const [activeSheet, setActiveSheet] = useState(String);
  const [noRepeat, setNoRepeat] = useState(true);
  const [load, setLoad] = useState(false);
  const refRBSheet = useRef<any>(null);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const uploadPictureStorage = async (
    path: any,
    type: string,
    document: string
  ) => {
    const existingData = await AsyncStorage.getItem("picture");
    let pictureData = existingData ? JSON.parse(existingData) : {};

    // Passo 2: Mesclar o novo dado com os existentes
    pictureData = {
      ...pictureData, // Preserva os dados existentes
      [document]: {
        path: path,
        type: type,
      },
    };

    // Passo 3: Salvar de volta o objeto atualizado no AsyncStorage
    await AsyncStorage.setItem("picture", JSON.stringify(pictureData));
    return;
  };

  const convertToBase64 = async (path: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(path, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // console.log('Arquivo em Base64:', base64);
      return base64;
    } catch (error) {
      console.error('Erro ao converter para base64:', error);
      return null;
    }
  };

  const sendPicture = async (option: string) => {
    try {
      setLoad(true);
      let path: any;
      let type: any;
  
      switch (option) {
        case 'gallery':
          path = await GetPathPicture('gallery');
          type = 'picture';
          break;
        case 'camera':
          path = await GetPathPicture('camera');
          type = 'picture';
          break;
        case 'file':
          path = await GetPathPicture('file');
          if (path.error) {
            return;
          }
          type = 'pdf';
          break;
      }
      
      if (!path) {
        console.error('Caminho do arquivo inválido');
        return;
      }
      
      if (absenceData && path) {
        const response = await uploadAbsence(
          path, 
          absenceData.file_name, 
          absenceData.id_work,
          collaborator.CPF
        );
        
        if (response && response.status === 200) {
          if (onSuccess) {
            onSuccess();
          }
        }
      }
      
      setPath(path);
      close();
    } catch (e) {
      console.log('Erro:', e);
    } finally {
      setLoad(false);
    }
  };

  const handleSelectPictureSide = async (side: string) => {
    setSelection(side);
  };

  const handleSendPictureSide = async (send: string) => {
    console.log("toma-leee", send);
    const response = await GetPathPicture(send);

    if (response && response != "cancel") {
      switch (selection) {
        case "front":
          setFront(response);
          break;
        case "back":
          setBack(response);
          break;
      }
    }
    setSelection(null);
  };

  const handleExit = () => {
    setSelection(null);
    setNoRepeat(true);
    close();
  };

  const Sheet = async () => {
    await refRBSheet.current.open();
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (front && back && noRepeat) {
  //         // Impede re-execução
  //         setNoRepeat(false);
  //         setLoad(true);
  //         const paths = [front, back];
  //         switch (documentName) {
  //           case "Carteira de Trabalho":
  //             documentName = "Work_Card";
  //             break;
  //           case "CNH (opcional)":
  //             documentName = "CNH";
  //             break;
  //           case "Titulo de Eleitor (opcional)":
  //             documentName = "Voter_Registration";
  //             break;
  //           default:
  //             // console.log(documentName)
  //             break;
  //         }
  //         try {
  //           // Fazendo o upload dos arquivos front e back
  //           await Promise.all(
  //             paths.map(async (path, index) => {
  //               let side = index === 0 ? "front" : "back";

  //               // Fazendo o upload do arquivo
  //               const response = await UploadFile(
  //                 path,
  //                 documentName,
  //                 side,
  //                 collaborator.CPF
  //               );

  //               switch (response.status) {
  //                 case 400:
  //                   setActiveSheet("danger");
  //                   setMessageSheet(`Documento inválido`);
  //                   Sheet();
  //                   setFront(null);
  //                   setBack(null);
  //                   setLoad(false);
  //                   return;
  //                 default:
  //                   setActiveSheet("danger");
  //                   setMessageSheet(`Erro desconhecido`);
  //                   Sheet();
  //                   setNoRepeat(true);
  //                   setFront(null);
  //                   setBack(null);
  //                   setLoad(false);
  //                   return;
  //               }
  //             })
  //           );

  //           if (statusDocument == "reproved") {
  //             const pictureUpdateParams: PropsUpdateAvalidPicture = {
  //               picture: documentName,
  //               status: "pending",
  //             };
  //             const update = await UpdatePicture(
  //               collaborator.CPF,
  //               pictureUpdateParams
  //             );
  //             switch (update.status) {
  //               case 200:
  //                 validateCollaborator();
  //                 setSendPicture(false);
  //                 setPath([front, back]);
  //                 setTypeDocument("picture");
  //                 setActiveSheet("success");
  //                 setMessageSheet(`Documento Atualizado`);
  //                 Sheet();
  //                 setLoad(false);
  //                 close();
  //                 break;
  //               case 400:
  //                 setActiveSheet("danger");
  //                 setMessageSheet(`Documento não encontrado`);
  //                 setLoad(false);
  //                 Sheet();
  //                 setNoRepeat(true);
  //                 setFront(null);
  //                 setBack(null);
  //                 break;
  //               default:
  //                 setActiveSheet("danger");
  //                 setMessageSheet("Erro, tente novamente!");
  //                 Sheet();
  //                 setNoRepeat(true);
  //                 setFront(null);
  //                 setBack(null);
  //                 setLoad(false);
  //                 break;
  //             }
  //           } else {
  //             const pictureParams: PropsCreateAvalidPicture = {
  //               picture: documentName,
  //               status: "pending",
  //               cpf: collaborator.CPF,
  //             };

  //             const createResponse = await CreateAvalidPicture(pictureParams);
  //             switch (createResponse.status) {
  //               case 201:
  //                 validateCollaborator();
  //                 setSendPicture(false);
  //                 setPath([front, back]);
  //                 setTypeDocument("picture");
  //                 setActiveSheet("success");
  //                 setMessageSheet(`Documento salvo`);
  //                 Sheet();
  //                 setLoad(false);
  //                 close();
  //                 break;
  //               case 409:
  //                 setActiveSheet("danger");
  //                 setMessageSheet("Imagem já existe");
  //                 Sheet();
  //                 setLoad(false);
  //                 setNoRepeat(true);
  //                 setFront(null);
  //                 setBack(null);
  //                 break;
  //               default:
  //                 setActiveSheet("danger");
  //                 setMessageSheet("Erro, tente novamente!");
  //                 Sheet();
  //                 setNoRepeat(true);
  //                 setFront(null);
  //                 setBack(null);
  //                 setLoad(false);
  //                 break;
  //             }
  //           }
  //         } catch (error) {
  //           console.error("Erro durante o processo:", error);
  //           setActiveSheet("danger");
  //           setMessageSheet("Algo deu errado, tente novamente");
  //           Sheet();
  //           setLoad(false);
  //           setNoRepeat(true);
  //           setFront(null);
  //           setBack(null);
  //         }
  //       }
  //     } catch (e) {
  //       setLoad(false);
  //       console.log(e);
  //     }
  //   };

  //   fetchData();
  // }, [front, back, noRepeat]);

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropOpacity={0.8}
      useNativeDriver={true}
      onBackdropPress={handleExit}
      className={`justify-end p-0 m-0`}
    >
      <View className="items-center w-full bg-white rounded-t-3xl p-4">
        <View className="w-full items-center justify-center mb-5">
          <View className="w-1/12 bg-neutral-400 rounded-xl h-1" />
        </View>
        
        {load ? (
          <View className={`my-10`}>
            <ActivityIndicator color={`#2f2f2f`} />
            <Text style={{ ...FONTS.fontMedium, fontSize: 13 }} className={`mt-2`}>
              Processando...
            </Text>
          </View>
        ) : (
          <View className="items-center w-full">
            <TouchableOpacity
              className="p-2.5 bg-primary rounded-lg w-1/2 mb-4"
              onPress={() => sendPicture("camera")}
            >
              <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14 }}>
                Câmera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-2.5 bg-primary rounded-lg w-1/2 mb-4"
              onPress={() => sendPicture("gallery")}
            >
              <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14 }}>
                Galeria
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="p-2.5 bg-primary rounded-lg w-1/2 mb-4"
              onPress={() => sendPicture("file")}
            >
              <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14 }}>
                PDF
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const extractNameChildren = (str: string): string | null => {
  const regex = /\(([^)]+)\)/; // Expressão regular para capturar o texto entre parênteses
  const match = str.match(regex);

  return match ? match[1] : null; // Se houver correspondência, retorna o valor entre parênteses
};

export default DocumentSendServices;
