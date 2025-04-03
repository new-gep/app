// AbsenceAdd.tsx
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import {
  useFocusEffect,
  useTheme,
  useNavigation,
} from "@react-navigation/native";
import DocumentSendServices from "../../../components/Modal/DocumentSendServices";
import { IMAGES } from "../../../constants/Images";
import FindPicture from "../../../hooks/findOne/picture";
import GetJobDocument from "../../../hooks/get/job/findDocument";
import uploadAbsence from "../../../hooks/upload/absence";
import Header from "~/src/layout/Header";
import useCollaborator from "~/src/function/fetchCollaborator";

type AbsenceAddProps = {
  onClose: () => void;
  absenceData: {
    path: string;
    file_name: string;
    id_work: string;
    year: string;
    month: string;
    CPF: string;
  };
};

type DocumentSendServicesProps = {
  // ADICIONE A NOVA PROP
  onSuccess?: () => void;
  // ... (mantenha as outras props existentes)
  absenceData: {
    path: string;
    file_name: string;
    id_work: string;
    year: string;
    month: string;
    CPF: string;
  };
  documentName: string;
  visible: boolean;
  twoPicture: boolean;
  close: () => void;
  setPath: (path: string | null) => void;
  path: string | null;
  statusDocument: string | null;
  setSendPicture: (value: boolean) => void;
  setTypeDocument: (type: string) => void;
  jobId: string;
};

const AbsenceUpload = ({ onClose, absenceData }: AbsenceAddProps) => {
  const theme = useTheme();
  const { collaborator} = useCollaborator();
  const { width, height } = Dimensions.get("window");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [otherReason, setOtherReason] = useState("");
  const [sendModalDocument, setSendModalDocument] = useState(false);
  const [path, setPath] = useState<string | null>(null);
  const [statusDocument, setStatusDocument] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const navigation = useNavigation();

  const handleSelectReason = (reason: string) => {
    // Se clicar na mesma opção que já está selecionada, limpa a seleção
    if (selectedReason === reason) {
      setSelectedReason(null);
      setOtherReason("");
    } else {
      setSelectedReason(reason);
      // Não limpar otherReason se a opção "Outros" for selecionada novamente
      if (reason !== "Outros") {
        setOtherReason("");
      }
    }

    setShowOptions(false);
    // Resetar o caminho do arquivo ao selecionar um novo motivo
    // exceto quando selecionar "Outros" novamente
    if (reason !== "Outros" || selectedReason !== "Outros") {
      setPath(null);
      setDocumentUploaded(false);
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchData = async () => {
  //       try {
  //         if (!absenceData.path) {
  //           setSendModalDocument(true);
  //           return;
  //         }

  //         const response = await uploadAbsence(
  //           absenceData.path,
  //           absenceData.file_name,
  //           absenceData.id_work,
  //           absenceData.CPF
  //         );

  //         if (response && response.status === 200) {
  //           const hasAbsenceDocument = response.documents.find(
  //             (doc: any) => doc.service === "Absence"
  //           );

  //           if (hasAbsenceDocument) {
  //             setStatusDocument(hasAbsenceDocument.status);
  //             setPath(hasAbsenceDocument.path);
  //             setDocumentUploaded(true);

  //             if (hasAbsenceDocument.status === "approved") {
  //               setShowSuccessPopup(true); // Mostra o popup de sucesso
  //             } else if (hasAbsenceDocument.status === "reproved") {
  //               setSendModalDocument(true);
  //             }
  //           } else {
  //             setSendModalDocument(true);
  //             setPath(null);
  //             setDocumentUploaded(false);
  //           }
  //         }
  //       } catch (error) {
  //         console.error("Erro ao buscar documentos:", error);
  //         setSendModalDocument(true);
  //       }
  //     };

  //     fetchData();

  //     return () => {
  //       setSendModalDocument(false);
  //       setPath(null);
  //       setDocumentUploaded(false);
  //     };
  //   }, [absenceData.id_work, absenceData.month, absenceData.year])
  // );

  const handleUploadSuccess = async () => {
    setDocumentUploaded(true);
    setShowSuccessPopup(true);

    const response = await uploadAbsence(
      path,
      'teste',
      absenceData.id_work,
      absenceData.CPF
    );
    console.log(response);

    setTimeout(() => {
      setShowSuccessPopup(false);
      onClose();
      // navigation.goBack();
    }, 3000);
  };

  const handleSendDocument = () => {
    if (!path) {
      Alert.alert(
        "Documento necessário",
        "Por favor, faça o upload do documento antes de enviar.",
        [{ text: "OK", onPress: () => setSendModalDocument(true) }]
      );
      return;
    }

    // Se já tiver um documento, apenas confirma o envio
    Alert.alert(
      "Confirmar envio",
      "Deseja enviar este documento para análise?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: handleUploadSuccess,
        },
      ]
    );
  };

  useEffect(() => {
    if (collaborator) {
      console.log(collaborator);
      
    }
  }, [collaborator]);

  return (
    <>
      <View className="mb-5">
        <Header
          title="Justificar Ausência"
          leftIcon="back"
          leftAction={() => onClose()}
        />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
        {/* Seletor de Motivo */}
        <View className="mt-8 px-5">
          <Text className="mb-2 text-base font-semibold">
            Selecione o motivo da ausência:
          </Text>
          <TouchableOpacity
            className="p-4 border border-gray-700 rounded-lg"
            onPress={() => setShowOptions(!showOptions)}
          >
            <Text className="text-center text-base text-gray-900">
              {selectedReason || "Selecione uma opção"}
            </Text>
          </TouchableOpacity>
          {showOptions && (
            <View className="mt-2 border border-gray-700 rounded-lg">
              <TouchableOpacity
                className="p-3 border-b border-gray-700"
                onPress={() => {
                  handleSelectReason("Atestado de colaborador");
                }}
              >
                <Text className="text-base text-gray-900">
                  Atestado de colaborador
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 border-b border-gray-700"
                onPress={() => {
                  handleSelectReason("Atestado de acompanhamento");
                }}
              >
                <Text className="text-base text-gray-900">
                  Atestado de acompanhamento
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3"
                onPress={() => {
                  handleSelectReason("Outros");
                }}
              >
                <Text className="text-base text-gray-900">Outros</Text>
              </TouchableOpacity>
            </View>
          )}
          {selectedReason === "Outros" && (
            <TextInput
              placeholder="Digite o motivo"
              placeholderTextColor={theme.dark ? "#fff" : "#000"}
              className="mt-4 p-4 border border-gray-700 rounded-lg"
              value={otherReason}
              onChangeText={setOtherReason}
              multiline
            />
          )}
        </View>

        {/* Imagem ilustrativa quando não há motivo selecionado */}
        {!selectedReason && (
          <Image
            source={IMAGES.unique14}
            className="mt-10 self-center"
            style={{
              height: height * 0.4,
              width: width * 0.8,
              resizeMode: "contain",
              opacity: 0.8,
            }}
          />
        )}

        {/* Seção de documentação quando motivo é selecionado */}
        {selectedReason && (
          <View className="mt-10 px-5">
            <View className="mt-5 px-2">
              <DocumentSendServices
                absenceData={absenceData}
                documentName={
                  selectedReason === "Outros" && otherReason
                    ? otherReason
                    : selectedReason
                }
                visible={sendModalDocument}
                twoPicture={false}
                close={() => setSendModalDocument(false)}
                setPath={(newPath: string | null) => {
                  setPath(newPath);
                  if (newPath) setDocumentUploaded(true);
                }}
                path={path}
                statusDocument={null}
                setSendPicture={() => {}}
                setTypeDocument={() => {}}
                jobId={absenceData.id_work}
                onSuccess={handleUploadSuccess}
              />

              {/* Indicador de status do documento */}
              <View className="mt-3 mb-3">
                {path ? (
                  <View className="flex-row items-center justify-center p-2 bg-green-50 rounded-lg">
                    <Text className="text-green-600 mr-2">✓</Text>
                    <Text className="text-green-600">
                      Documento carregado com sucesso
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center justify-center p-2 bg-yellow-50 rounded-lg">
                    <Text className="text-yellow-600 mr-2">!</Text>
                    <Text className="text-yellow-600">
                      Nenhum documento carregado
                    </Text>
                  </View>
                )}
              </View>

              {/* Botões de ação */}
              <View className="flex-col">
                <TouchableOpacity
                  className="bg-gray-200 p-4 rounded-lg mt-3 items-center flex-1"
                  onPress={() => setSendModalDocument(true)}
                >
                  <Text className="text-gray-800 text-base font-medium">
                    {path ? "Alterar documento" : "Carregar documento"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`p-4 rounded-lg mt-3 items-center flex-1 ${
                    path ? "bg-primary" : "bg-gray-400"
                  }`}
                  onPress={() => {
                    if (!path) {
                      Alert.alert(
                        "Documento necessário",
                        "Por favor, carregue um documento antes de enviar.",
                        [
                          {
                            text: "OK",
                            onPress: () => setSendModalDocument(true),
                          },
                        ]
                      );
                    } else {
                      handleSendDocument();
                    }
                  }}
                >
                  <Text className="text-dark text-base font-medium">
                    Enviar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {showSuccessPopup && (
          <View className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <View className="bg-white p-6 rounded-lg w-11/12 max-w-md">
              <View className="flex items-center justify-center mb-4">
                <View className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                  <Text className="text-4xl text-green-600">✓</Text>
                </View>
              </View>
              <Text className="text-xl font-bold text-center text-gray-800 mb-2">
                Ausência Justificada!
              </Text>
              <Text className="text-base text-center text-gray-600 mb-4">
                Seu documento foi enviado para análise.
              </Text>
              <View className="mt-4 border-t border-gray-100 pt-4">
                <Text className="text-sm text-center text-gray-500">
                  Você receberá uma notificação quando o documento for
                  analisado.
                </Text>
              </View>
              <TouchableOpacity
                className="mt-6 bg-green-600 py-3 px-6 rounded-lg"
                onPress={() => {
                  setShowSuccessPopup(false);
                  onClose();
                }}
              >
                <Text className="text-white text-center font-medium">
                  Entendi
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default AbsenceUpload;
