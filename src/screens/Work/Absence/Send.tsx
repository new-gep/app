// AbsenceAdd.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Alert,
  Button,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  useFocusEffect,
  useTheme,
  useNavigation,
} from "@react-navigation/native";
import DocumentSendServices from "../../../components/Modal/DocumentSendServices";
import { IMAGES } from "../../../constants/Images";
import { COLORS } from "../../../constants/theme";
import uploadAbsence from "../../../hooks/upload/absence";
import Header from "~/src/layout/Header";
import useCollaborator from "~/src/function/fetchCollaborator";
import { Picker } from "@react-native-picker/picker";
import { FONTS } from "~/src/constants/theme";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RBSheet from 'react-native-raw-bottom-sheet';
import SuccessSheet from '../../../components/BottomSheet/SuccessSheet';
import DangerSheet from '../../../components/BottomSheet/DangerSheet';

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
  const { collaborator } = useCollaborator();
  const { width, height } = Dimensions.get("window");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [otherReason, setOtherReason] = useState("");
  const [sendModalDocument, setSendModalDocument] = useState(false);
  const [path, setPath] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [activeSheet, setActiveSheet] = useState("success");
  const [messageSheet, setMessageSheet] = useState("");
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const navigation = useNavigation();
  const refRBSheet = useRef<any>(null);

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
    try {
      setLoadingSend(true);
      const response = await uploadAbsence(
        path,
      absenceData.file_name,
      absenceData.id_work,
      absenceData.CPF,
      date,
      otherReason,
      selectedReason
    );
    if (response && response.status === 200) {
      setActiveSheet("success");
      setMessageSheet("Ausência enviada com sucesso");
      refRBSheet.current?.open();
      setTimeout(() => {
        onClose();
        // navigation.goBack();
      }, 3000);
    } else {
      setActiveSheet("error");
      setMessageSheet("Erro ao enviar ausência");
      refRBSheet.current?.open();
    }
    } catch (error) {
      console.error("Erro ao enviar ausência:", error);
      setActiveSheet("error");
      setMessageSheet("Erro ao enviar ausência");
      refRBSheet.current?.open();
    }finally {
      setLoadingSend(false);
    }
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

    if (!date) {
      Alert.alert("Data necessária", "Por favor, selecione uma data.", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }

    if (otherReason === "" && selectedReason == "Outros") {
      Alert.alert(
        "Motivo necessário",
        "Por favor, digite o motivo da ausência.",
        [{ text: "OK", onPress: () => {} }]
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
          <Text
            className="mb-2 text-base font-semibold"
            style={{ ...FONTS.fontMedium, fontSize: 20 }}
          >
            Motivo da Ausência:
          </Text>
          <TouchableOpacity
            className={`p-4 border bg-primary border-gray-700 rounded-lg flex-row justify-between items-center`}
            onPress={() => setShowOptions(!showOptions)}
          >
            <Text
              className="text-base text-gray-900"
              style={{ ...FONTS.fontMedium, fontSize: 18 }}
            >
              {selectedReason || "Selecione uma opção"}
            </Text>
            <Image
              source={showOptions ? IMAGES.arrowDown : IMAGES.arrowRight}
              style={{ width: 32, height: 32 }}
            />
          </TouchableOpacity>
          {showOptions && (
            <View className="border border-t-0 rounded-lg rounded-t-none px-5">
              <TouchableOpacity
                className="p-3 border-b my-1 border-gray-700 bg-dark rounded-lg"
                onPress={() => {
                  handleSelectReason("Atestado");
                }}
              >
                <Text
                  className="text-base text-white"
                  style={{ ...FONTS.fontMedium, fontSize: 16 }}
                >
                  Atestado
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 border-b border-gray-700 bg-dark rounded-lg my-1"
                onPress={() => {
                  handleSelectReason("Atestado de Acompanhamento");
                }}
              >
                <Text
                  className="text-base text-white"
                  style={{ ...FONTS.fontMedium, fontSize: 16 }}
                >
                  Atestado de Acompanhamento
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 bg-dark rounded-lg my-1"
                onPress={() => {
                  handleSelectReason("Outros");
                }}
              >
                <Text
                  className="text-base text-white"
                  style={{ ...FONTS.fontMedium, fontSize: 16 }}
                >
                  Outros
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {selectedReason === "Outros" && (
            <View className=" justify-between">
              <TextInput
                style={{ ...FONTS.fontMedium, fontSize: 16 }}
                className="mt-4 p-3 border border-gray-700 rounded-lg"
                placeholder="Digite o motivo"
                placeholderTextColor={theme.dark ? "#fff" : "#000"}
                value={otherReason}
                onChangeText={setOtherReason}
                multiline
              />
            </View>
          )}
          {selectedReason && (
            <SafeAreaProvider>
              <DatePickerInput
                className="mt-4 bg-white"
                style={{ ...FONTS.fontMedium, fontSize: 16 }}
                locale="pt"
                label="Data da Consulta"
                saveLabel="Salvar"
                value={date}
                onChange={(d: any) => setDate(d)}
                inputMode="start"
              />
            </SafeAreaProvider>
          )}
        </View>

        {/* Imagem ilustrativa quando não há motivo selecionado */}
        {!selectedReason && (
          <>
            <View className="px-5 py-5">
              <Text
                className="text-center"
                style={{ ...FONTS.fontMedium, fontSize: 18 }}
              >
                Selecione o motivo da ausência
              </Text>
              <Text
                className="text-center text-gray-500"
                style={{ ...FONTS.fontRegular, fontSize: 14 }}
              >
                Seleciona o documento, foto ou pdf que comprova a ausência
              </Text>
            </View>

            <Image
              source={IMAGES.unique22}
              className="self-center"
              style={{
                height: height * 0.5,
                width: width * 0.9,
                resizeMode: "contain",
              }}
            />
          </>
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
                  className={`h-14 justify-center rounded-lg mt-3 items-center flex-1 ${
                    path ? "bg-primary" : "bg-gray-400"
                  }`}
                  onPress={() => {
                    handleSendDocument();
                  }}
                >
                  {!loadingSend ?
                  <Text
                    className="text-dark text-base font-medium"
                    style={{ ...FONTS.fontMedium, fontSize: 18 }}
                  >
                    Enviar
                  </Text>
                  :
                  <ActivityIndicator size="small" color={COLORS.dark} />
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          height={215}
          openDuration={100}
          customStyles={{
            container: {
              backgroundColor: theme.dark ? COLORS.background : COLORS.card,
            },
            draggableIcon: {
              marginTop: 10,
              marginBottom: 5,
              height: 5,
              width: 80,
            },
          }}
        >
          {activeSheet === "success" ? (
            <SuccessSheet message={messageSheet} />
          ) : (
            <DangerSheet message={messageSheet} />
          )}
        </RBSheet>
      </ScrollView>
    </>
  );
};

export default AbsenceUpload;
