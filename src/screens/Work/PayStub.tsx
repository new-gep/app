import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import Header from "../../layout/Header";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import CheckDocumentServices from "../../hooks/get/job/checkPayStub";
import DocumentVisible from "../../components/Modal/DocumentVisible";
import SignatureModalCanvas from "../Components/signatureModalCanvas";
import { WebView } from "react-native-webview";
import Feather from "@expo/vector-icons/build/Feather";

const months = [
  { value: "01", label: "Janeiro", english: "January" },
  { value: "02", label: "Fevereiro", english: "February" },
  { value: "03", label: "Março", english: "March" },
  { value: "04", label: "Abril", english: "April" },
  { value: "05", label: "Maio", english: "May" },
  { value: "06", label: "Junho", english: "June" },
  { value: "07", label: "Julho", english: "July" },
  { value: "08", label: "Agosto", english: "August" },
  { value: "09", label: "Setembro", english: "September" },
  { value: "10", label: "Outubro", english: "October" },
  { value: "11", label: "Novembro", english: "November" },
  { value: "12", label: "Dezembro", english: "December" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i + 1));

type PayStubParams = {
  jobConected: any;
  CPF: string;
};

const PayStub = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ PayStub: PayStubParams }>>();
  const { jobConected, CPF } = route.params;

  const [mes, setMes] = useState(months[0].label);
  const [year, setyear] = useState(String(currentYear));
  const [documents, setDocuments] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [viewedDocuments, setViewedDocuments] = useState<{
    [key: string]: boolean;
  }>({});
  const [signatures, setSignatures] = useState<any>({});

  const fetchData = async () => {
    if (jobConected) {
      try {
        setIsFetching(true);
        const monthInEnglish =
          months.find((m) => m.label === mes)?.english || mes;
        const response = await CheckDocumentServices(
          jobConected.id,
          "PayStub",
          year,
          monthInEnglish
        );

        const validDocuments = Array.isArray(response)
          ? response.filter((doc) => doc !== null)
          : [];

        // console.log('ID: ', validDocuments[0].details.id)
        setDocuments(validDocuments);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsFetching(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [mes, year]);

  const handleDocumentView = (fileName: string) => {
    setViewedDocuments((prev) => ({ ...prev, [fileName]: true }));
  };

  const openDocumentModal = async (doc: any) => {
    setIsLoading(true);
    setSelectedDocument(doc);
    setModalVisible(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      handleDocumentView(doc.fileName);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDocument(null);
    setIsLoading(false);
  };

  const handleSaveSignature = async (signature: string) => {
    if (selectedDocument) {
      try {
        setSignatures((prev) => ({
          ...prev,
          [selectedDocument.fileName]: signature,
        }));

        setShowSignatureModal(false);

        Alert.alert("Sucesso", "Assinatura salva com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar assinatura:", error);
        Alert.alert(
          "Erro",
          "Ocorreu um erro ao salvar a assinatura. Tente novamente."
        );
      }
    }
  };

  const handleOpenSignatureModal = (item: any) => {
    setSelectedDocument(item);
    setShowSignatureModal(true);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Header
        title="Holerite Online"
        leftIcon="back"
        leftAction={() => navigation.goBack()}
      />

      <Text className="text-xl font-bold mb-4 text-gray-800">
        Selecione o mês e ano :
      </Text>

      <View className="flex-row justify-between mb-5">
        <TouchableOpacity
          className="w-[48%] bg-gray-100 rounded-lg p-3 border border-gray-300"
          onPress={() => setShowMonthPicker(true)}
        >
          <Text className="text-base text-gray-800">
            {months.find((m) => m.label === mes)?.label}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[48%] bg-gray-100 rounded-lg p-3 border border-gray-300"
          onPress={() => setShowYearPicker(true)}
        >
          <Text className="text-base text-gray-800">{year}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showMonthPicker} transparent={true} animationType="slide">
        <View className="absolute inset-0 bg-black/50 justify-center">
          <View className="mx-5 bg-white rounded-lg max-h-[60%]">
            <ScrollView>
              {months.map((month) => (
                <TouchableOpacity
                  key={month.label}
                  className="p-4 border-b border-gray-200"
                  onPress={() => {
                    setMes(month.label);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text className="text-base text-gray-800">{month.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showYearPicker} transparent={true} animationType="slide">
        <View className="absolute inset-0 bg-black/50 justify-center">
          <View className="mx-5 bg-white rounded-lg max-h-[60%]">
            <ScrollView>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  className="p-4 border-b border-gray-200"
                  onPress={() => {
                    setyear(year);
                    setShowYearPicker(false);
                  }}
                >
                  <Text className="text-base text-gray-800">{year}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView className="flex-1">
        {isFetching ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : documents.length >= 1 ? (
          documents.map((item) => {
            const hasSignature = !!signatures[item.fileName];
            const wasViewed = !!viewedDocuments[item.fileName];
            const details = item.details;
            const status = details?.status;

            let statusColor = "#6b7280"; // cor default
            if (status === "pending") {
              statusColor = "#fbbf24"; // amarelo
            } else if (status === "approved") {
              statusColor = "#22c55e"; // verde
            }

            return (
              <View
                key={item.fileName}
                className={`mb-4 bg-white rounded-xl shadow-sm ${
                  !item.fileName.match(/^Service_PayStub_\d{4}_[A-Za-z]+_\d+$/) && "hidden"
                }`}
              >
                <TouchableOpacity
                  onPress={() => openDocumentModal(item)}
                  className="flex-row items-center p-4"
                >
                  <View className="w-16 h-16 bg-gray-100 rounded-lg justify-center items-center mr-4">
                    {hasSignature ? (
                      <Feather
                        name="check-circle"
                        size={32}
                        color={statusColor}
                      />
                    ) : (
                      <Feather name="edit-3" size={32} color={statusColor} />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">
                      Holerite {months.find((m) => m.label === mes)?.label}{" "}
                      {year}
                    </Text>
                    <Text
                      className={`text-base ${
                        status === "approved"
                          ? "text-green-600"
                          : status === "reproved"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {status === "approved"
                        ? "Aprovado"
                        : status === "pending"
                        ? "Aguardando aprovação"
                        : status === "reproved"
                        ? "Rejeitado, envie novamente"
                        : "Pendente"}
                    </Text>
                  </View>
                </TouchableOpacity>
                        
                <View className="p-4 border-t border-gray-200">
                  {hasSignature ? (
                    <View className="items-center">
                      <Text className="text-lg font-semibold mb-2">
                        Assinatura Salva:
                      </Text>
                      <WebView
                        style={{ width: 200, height: 50 }}
                        originWhitelist={["*"]}
                        source={{
                          html: atob(signatures[item.fileName].split(",")[1]),
                        }}
                      />
                    </View>
                  ) : (
                    <>
                      {!wasViewed && (
                        <Text className="text-center text-gray-600 mb-2">
                          Visualize o documento para habilitar a assinatura
                        </Text>
                      )}
                      <TouchableOpacity
                        className={`py-2 px-4 rounded-lg items-center ${
                          wasViewed ? "bg-primary" : "bg-gray-300"
                        }`}
                        onPress={() => handleOpenSignatureModal(item)}
                        disabled={!wasViewed}
                      >
                        <Text className="text-white text-base font-semibold">
                          Assinar Documento
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <Text className="text-center mt-5 text-gray-500">
            Nenhum registro de holerite encontrado
          </Text>
        )}
      </ScrollView>

      {modalVisible && (
        <>
          <DocumentVisible
            path={selectedDocument?.path}
            typeDocument={selectedDocument?.type}
            twoPicture={false}
            visible={modalVisible}
            documentName={selectedDocument?.fileName || ""}
            close={closeModal}
          />

          {isLoading && (
            <View className="absolute inset-0 bg-white/90 flex items-center justify-center">
              <ActivityIndicator size="large" color="black" />
            </View>
          )}
        </>
      )}

      <SignatureModalCanvas
        key={selectedDocument?.details.id}
        id={selectedDocument?.details.id}
        jobId={jobConected.id}
        visible={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSaveSignature={handleSaveSignature}
        cpf={CPF}
        where="PayStub"
      />
    </View>
  );
};

export default PayStub;
