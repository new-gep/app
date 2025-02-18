import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import Header from "../../layout/Header";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import CheckDocumentServices from "../../hooks/get/job/checkPayStub";
import DocumentVisible from "../../components/Modal/DocumentVisible";
import SignatureModalCanvas from "../Components/signatureModalCanvas";
import { WebView } from "react-native-webview";

const months = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
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
  const [ano, setAno] = useState(String(currentYear));
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
  const [signatures, setSignatures] = useState<{ [key: string]: string }>({});

  const fetchData = async () => {
    if (jobConected) {
      try {
        setIsFetching(true);
        const response = await CheckDocumentServices(
          jobConected.id,
          "PayStub",
          ano,
          mes
        );
        const validDocuments = Array.isArray(response)
          ? response.filter((doc) => doc !== null)
          : [];
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
  }, [mes, ano]);

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

  const handleSaveSignature = (signature: string) => {
    if (selectedDocument) {
      setSignatures((prev) => ({
        ...prev,
        [selectedDocument.fileName]: signature,
      }));
    }
    setShowSignatureModal(false);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Header
        title="Holerite Online"
        leftIcon="back"
        leftAction={() => navigation.goBack()}
      />

      <Text className="text-xl font-bold mb-4 text-gray-800">
        Selecione o mês e ano:
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
          <Text className="text-base text-gray-800">{ano}</Text>
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
                    setAno(year);
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

            return (
              <View
                key={item.fileName}
                className="mb-4 bg-white rounded-xl shadow-sm"
              >
                <TouchableOpacity
                  onPress={() => openDocumentModal(item)}
                  className="flex-row items-center p-4"
                >
                  <View className="w-16 h-16 bg-gray-100 rounded-lg justify-center items-center mr-4">
                    <Text className="text-2xl font-bold text-primary">
                      {new Date(item.createdAt).getDate()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">
                      {months.find((m) => m.label === mes)?.label} {ano}
                    </Text>
                    <Text className="text-base text-gray-600">
                      {item.service}
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
                        onPress={() => {
                          setSelectedDocument(item);
                          setShowSignatureModal(true);
                        }}
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
        visible={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSaveSignature={handleSaveSignature}
        id={selectedDocument?.id}
        cpf={CPF}
        where={"PayStub"}
      />
    </View>
  );
};

export default PayStub;