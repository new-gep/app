// AbsenceGet.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useTheme, useRoute, useNavigation } from '@react-navigation/native';
import CheckDocumentServices from '../../../hooks/get/job/checkPayStub';
import DocumentVisible from '../../../components/Modal/DocumentVisible';
import { IMAGES } from '../../../constants/Images';

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

const monthMap: { [key: string]: string } = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December',
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i + 1));

type AbsenceGetProps = {
  onAddNew: () => void;
};

const AbsenceGet = ({ onAddNew }: AbsenceGetProps) => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); // Ajuste conforme sua tipagem
  const { jobConected, CPF } = route.params;
  const [documents, setDocuments] = useState<any[]>([]);
  const [mes, setMes] = useState(months[0].value);
  const [ano, setAno] = useState(String(currentYear));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { width, height } = Dimensions.get('window');

  const fetchData = async () => {
    if (jobConected) {
      try {
        const response = await CheckDocumentServices(
          jobConected.id,
          'Absence',
          ano,
          monthMap[mes]
        );
        const validDocuments = Array.isArray(response)
          ? response.filter((doc) => doc !== null)
          : [];
        setDocuments(validDocuments);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
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

  const handleAddNew = () => {
    try {
      // Chama a função onAddNew de forma segura
      if (typeof onAddNew === 'function') {
        onAddNew();
      }
    } catch (error) {
      console.error('Erro ao adicionar nova ausência:', error);
      // Aqui você pode adicionar um feedback visual para o usuário
      // Por exemplo, usando um Toast ou Alert
    }
  };

  return (
    <View className="flex-1 px-5">
      {/* Filtros */}
      <View className="flex-row justify-between mb-4">
        <TouchableOpacity
          className="w-[48%] bg-gray-100 rounded-lg p-3 border border-gray-700"
          onPress={() => setShowMonthPicker(true)}
        >
          <Text className="text-base text-gray-800 text-center">
            {months.find((m) => m.value === mes)?.label}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[48%] bg-gray-100 rounded-lg p-3 border border-gray-700"
          onPress={() => setShowYearPicker(true)}
        >
          <Text className="text-base text-gray-800 text-center">{ano}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para seleção de mês */}
      <Modal visible={showMonthPicker} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center">
          <View className="mx-5 bg-white rounded-lg max-h-[60%]">
            <ScrollView>
              {months.map((month) => (
                <TouchableOpacity
                  key={month.label}
                  className="p-4 border-b border-gray-600"
                  onPress={() => {
                    setMes(month.value);
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
      <Modal visible={showYearPicker} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center">
          <View className="mx-5 bg-white rounded-lg max-h-[60%]">
            <ScrollView>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  className="p-4 border-b border-gray-600"
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

      {/* Lista de ausências */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {documents.length >= 1 ? (
          documents.map((item) => (
            <TouchableOpacity
              key={item.fileName}
              className="flex-row items-center mb-2 p-4 bg-white rounded-xl shadow border border-gray-700"
              onPress={() => openDocumentModal(item)}
            >
              <View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center mr-4">
                <Text className="text-2xl font-bold text-primary">
                  {new Date(item.createdAt).getDate()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {months.find((m) => m.value === mes)?.label} {ano}
                </Text>
                <Text className="text-base text-gray-600">{item.service}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center mt-12">
            <Image
              source={IMAGES.unique14}
              className="w-52 h-52 opacity-50"
            />
            <Text className="text-base text-gray-500 mt-4">
              Nenhuma ausência registrada
            </Text>
          </View>
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
            documentName={selectedDocument?.fileName || ''}
            close={closeModal}
          />
          {isLoading && (
            <View className="absolute inset-0 bg-white/90 flex items-center justify-center">
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}
        </>
      )}

      {/* Botão flutuante para adicionar nova ausência */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-green-800 w-14 h-14 rounded-full flex items-center justify-center shadow-lg border border-gray-700"
        onPress={handleAddNew}
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AbsenceGet;
