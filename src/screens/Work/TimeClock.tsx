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
import { COLORS } from "../../constants/theme";

type TimeClockParams = {
  jobConected: any;
  CPF: any;
};

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

const TimeClock = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ TimeClock: TimeClockParams }>>();
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

  const fetchData = async () => {
    if (jobConected) {
      try {
        setIsFetching(true);
        const response = await CheckDocumentServices(
          jobConected.id,
          "Point",
          ano,
          mes
        );

        // console.log("Resposta da API:", response); // Adicione este log

        // Verifica se a resposta é um array antes de filtrar
        const validDocuments = Array.isArray(response)
          ? response.filter((doc) => doc !== null)
          : [];

        setDocuments(validDocuments);
      } catch (error) {
        console.error("Erro detalhado:", error.response?.data || error.message);
      } finally {
        setIsFetching(false);
      }
    }
  };

  const handleSignatureSave = async (signature: string) => {
    // Atualizar o documento localmente
    setDocuments(prev => prev.map(doc => {
        if (doc.id === selectedDocument.id) {
            return { ...doc, signature };
        }
        return doc;
    }));
};

  useEffect(() => {
    fetchData();
  }, [mes, ano]);

  const openDocumentModal = async (doc: any) => {
    setIsLoading(true);
    setSelectedDocument(doc);
    setModalVisible(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDocument(null);
    setIsLoading(false);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Header
        title="Ponto Online"
        leftIcon="back"
        leftAction={() => navigation.goBack()}
      />

      <Text className="text-xl font-bold mb-4 text-gray-800">
        Selecione o mês e ano:
      </Text>

      {/* Filtros */}
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

      {/* Modal para seleção de mês */}
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

      {/* Modal para seleção de ano */}
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

      {/* Lista de pontos */}
      <ScrollView className="flex-1">
        {isFetching ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : documents.length >= 1 ? (
          documents.map((item) => (
            <TouchableOpacity
              key={item.fileName}
              onPress={() => openDocumentModal(item)}
              className="flex-row items-center mb-2 p-4 bg-white rounded-xl shadow-sm"
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
                <Text className="text-base text-gray-600">{item.service}</Text>
              </View>
              {item.signature && (
                <View className="ml-2 p-1 bg-green-100 rounded">
                  <Text className="text-green-600 text-xs">Assinado</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-center mt-5 text-gray-500">
            Nenhum registro de ponto encontrado
          </Text>
        )}
      </ScrollView>

      {/* Modal do documento */}
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
    </View>
  );
};

export default TimeClock;
