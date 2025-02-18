import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Modal
} from "react-native";
import Header from "../../layout/Header";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import CheckDocumentServices from "../../hooks/get/job/checkPayStub";
import DocumentVisible from "../../components/Modal/DocumentVisible";
import { COLORS } from "../../constants/theme";
<<<<<<< HEAD
=======
import { Ionicons } from '@expo/vector-icons';
>>>>>>> master

const months = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
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
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
=======
  const [isLoading, setIsLoading] = useState(true);
>>>>>>> master

  const fetchData = async () => {
    if (jobConected) {
      try {
<<<<<<< HEAD
=======
        setIsLoading(true);
>>>>>>> master
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
<<<<<<< HEAD
=======
      } finally {
        setIsLoading(false);
>>>>>>> master
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [mes, ano]);

  const openDocumentModal = async (doc: any) => {
    setIsLoading(true);
    setSelectedDocument(doc);
    setModalVisible(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsLoading(false);
    }
  }

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDocument(null);
    setIsLoading(false);
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

      {/* Filtros */}
      <View className="flex-row justify-between mb-5">
        <TouchableOpacity 
          className="w-[48%] bg-gray-100 rounded-lg p-3 border border-gray-300"
          onPress={() => setShowMonthPicker(true)}
        >
          <Text className="text-base text-gray-800">
            {months.find(m => m.label === mes)?.label}
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
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="slide"
      >
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
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
      >
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
<<<<<<< HEAD
        {documents.length >= 1 ? (
=======
        {isLoading ? (
          <View className="flex-1 justify-center items-center min-h-[400px]">
            <ActivityIndicator size="large" color={'yellow'} />
          </View>
        ) : documents.length >= 1 ? (
>>>>>>> master
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
                  {months.find(m => m.label === mes)?.label} {ano}
                </Text>
                <Text className="text-base text-gray-600">
                  {item.service}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
<<<<<<< HEAD
          <Text className="text-center mt-5 text-gray-500">
            Nenhum registro de holerite encontrado
          </Text>
=======
          <View className="flex-1 justify-center items-center">
            <Text className="text-center mt-5 text-gray-500">
              Nenhum registro de holerite encontrado
            </Text>
          </View>
>>>>>>> master
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
<<<<<<< HEAD
=======
            onSignaturePress={() => {}}
>>>>>>> master
          />
          
          {isLoading && (
            <View className="absolute inset-0 bg-white/90 flex items-center justify-center">
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
<<<<<<< HEAD
=======

          {/* Botão de assinatura */}
          <TouchableOpacity
            className="absolute bottom-5 right-5 bg-white bg-opacity-70 p-3 rounded-full shadow-lg"
            onPress={() => {/* Ação para assinatura */}}
          >
            <Ionicons name="pencil" size={24} color={COLORS.primary} />
          </TouchableOpacity>
>>>>>>> master
        </>
      )}
    </View>
  );
};

<<<<<<< HEAD
export default PayStub;
=======
export default PayStub;
>>>>>>> master
