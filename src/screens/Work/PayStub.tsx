import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator 
} from "react-native";
import Header from "../../layout/Header";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import CheckDocumentServices from "../../hooks/get/job/checkPayStub";
import DocumentVisible from "../../components/Modal/DocumentVisible";
import { COLORS } from "../../constants/theme";

type PayStubParams = {
  jobConected: any; // Substitua 'any' pelo tipo correto, se possível
  CPF: string;
};

const PayStub = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ PayStub: PayStubParams }>>();
  const { jobConected, CPF } = route.params;

  // Estados para filtros
  const [mes, setMes] = useState("Janeiro");
  const [ano, setAno] = useState("2025");

  // Estado para armazenar os documentos (holerites)
  const [documents, setDocuments] = useState<any[]>([]);

  // Estados para controle do modal, documento selecionado e loader
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Função para buscar os documentos via API
  const fetchData = async () => {
    if (jobConected) {
      try {
        const response = await CheckDocumentServices(
          jobConected.id,
          "PayStub",
          ano,
          mes
        );
        console.log("Resposta:", response);
        // Filtra para remover itens nulos
        const validDocuments = response.filter((doc) => doc !== null);
        setDocuments(validDocuments);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
  };

  // Busca inicial (e sempre que os filtros mudarem)
  useEffect(() => {
    fetchData();
  }, [jobConected, CPF, mes, ano]);

  // Ao clicar em um holerite, ativa o loader, define o documento e abre o modal
  const openDocumentModal = async (doc: any) => {
    setIsLoading(true); // Ativa o loader
    setSelectedDocument(doc);
    setModalVisible(true);
    
    try {
      // Simulação de requisição (substitua pelo seu fetch real)
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    } finally {
      setIsLoading(false); // Desativa o loader após o carregamento
    }
  }

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDocument(null);
    setIsLoading(false);
  };

  return (
    <View className="flex-1 p-4">
      <Header 
        title="Holerite Online" 
        leftIcon="back" 
        leftAction={() => navigation.goBack()} 
      />

      <Text className="text-xl font-bold mb-4">
        Informe o mês e o ano para pesquisar holerites:
      </Text>

      {/* Botão para disparar a pesquisa */}
      <TouchableOpacity
        onPress={fetchData}
        className="bg-primary py-4 rounded mb-4"
      >
        <Text className="text-white text-center text-xl font-bold">
          Pesquisar
        </Text>
      </TouchableOpacity>

      {/* Lista de holerites */}
      <ScrollView>
        {documents && documents.length >= 1 ? (
          documents.map((item) => (
            <TouchableOpacity
              key={item.fileName}
              onPress={() => openDocumentModal(item)}
              className="flex-row items-center mb-2"
            >
              <View className="w-36 h-36 bg-gray-300 justify-center items-center mr-2">
                {/* Você pode ajustar esse ícone/data conforme necessário */}
                <Text className="text-2xl font-bold">31</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold">
                  {mes.padStart(2, "0")}/{ano}
                </Text>
                <Text className="text-xl font-bold">{item.service}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text className="text-center mt-5">
            Nenhum holerite disponível
          </Text>
        )}
      </ScrollView>

      {/* Renderiza o modal somente se estiver visível */}
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
          {/* Overlay do loader */}
          {isLoading && (
            <View className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default PayStub;
