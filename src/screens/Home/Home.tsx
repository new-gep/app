import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  BackHandler,
  Image,
  Dimensions,
} from "react-native";
import Card from "./Card";
import GetAllJob from "../../hooks/get/job/all";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FindOneJob from "../../hooks/get/job/findOne";
import UpdateJobDefault from "../../hooks/update/job/default";
import useCollaborator from "../../function/fetchCollaborator";
import HeaderStyle1 from "../../components/Headers/HeaderStyle1";
import { useCollaboratorContext } from "../../context/CollaboratorContext";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import Header from "../../layout/Header";
import { COLORS, FONTS } from "../../constants/theme";
import Mask from "../../function/mask";
import HeaderHome from "../../layout/HeaderHome";
const Home = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousCards, setPreviousCards] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { collaborator, fetchCollaborator } = useCollaborator();
  const { validateCollaborator, missingData } = useCollaboratorContext();
  const navigation = useNavigation<NavigationProp<any>>();


  const handleSwipeRight = async (id) => {
    console.log("missingData", missingData)
    if (missingData) return;

    try {
      // 1. Buscar detalhes da vaga
      const jobResponse = await FindOneJob(id);
      console.log("jobResponse", jobResponse)

      if (jobResponse.status !== 200) {
        throw new Error("Erro ao buscar detalhes da vaga");
      }

      let currentCandidates = await Promise.all(
        jobResponse.job.candidates?.map(async ({ picture, name, ...rest }) => {
          // Aqui você pode realizar alguma operação assíncrona se necessário
          return rest; // Remove picture e name
        }) || []
      );

      const alreadyApplied = currentCandidates.some(
        (c) => c.cpf === collaborator.CPF 
      );

      if (alreadyApplied) {
        showPopupMessage("Você já aplicou para esta vaga!");
        return;
      }

      // 3. Criar novo candidato formatado
      const newCandidate = {
        cpf: collaborator.CPF,
        step: 0,
        status: null,
        verify: null,
        observation: null,
      };

      // 4. Atualizar lista de candidatos
      const updatedCandidates = [...currentCandidates, newCandidate];
      

      // 5. Enviar para API
      const updateResponse = await UpdateJobDefault(id, {
        candidates: JSON.stringify(updatedCandidates), // Enviar array diretamente
      });

      if (updateResponse.status !== 200) {
        throw new Error("Erro ao atualizar vaga");
      }

      // 6. Atualizar UI somente após sucesso
      setPreviousCards((prev) => [...prev, cards[0]]);
      setCards((prevCards) => prevCards.slice(1));

      showPopupMessage("Candidatura realizada com sucesso!");
    } catch (error) {
      console.error("Erro no swipe:", error);
      showPopupMessage(error.message || "Erro ao aplicar");
      handleUndo(); // Reverte a ação visual
    }
  };

  const handleSwipeLeft = () => {
    setPreviousCards((prev) => [...prev, cards[0]]);
    setCards((prevCards) => prevCards.slice(1));
  };

  // const handleSuperLike = () => {
  //   setPreviousCards((prev) => [...prev, cards[0]]);
  //   setCards((prevCards) => prevCards.slice(1));
  //   showPopupMessage("Super like enviado!");
  // };

  const handleUndo = () => {
    if (previousCards.length > 0) {
      const lastCard = previousCards[previousCards.length - 1]; // Pega o último sem mutar o array
      
      // Verifica se o card já está na lista atual
      if (!cards.some((card) => card.id === lastCard.id)) {
        setPreviousCards((prev) => prev.slice(0, -1));
        setCards((prevCards) => [lastCard, ...prevCards]);
      }
    } else {
      alert("Não há mais cards para voltar.");
    }
  };

  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await GetAllJob();
  
        if (response.status !== 200) {
          throw new Error(response.message || "Erro ao buscar os.");
        }
  
        // Adicione este filtro:
        const uniqueJobs = response.job.filter(
          (job, index, self) =>
            self.findIndex((j) => j.id === job.id) === index
        );
  
        setCards(uniqueJobs); // Altere para usar os jobs filtrados
      } catch (error) {
        console.error("Ocorreu um erro ao buscar os jobs:", error.message);
        alert("Erro ao buscar os jobs. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCollaborator();
      validateCollaborator();
      const backHandlerSubscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          return true;
        }
      );
      return () => backHandlerSubscription.remove();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (missingData) {
      // navigation.navigate("CheckCadasterCollaboratorDocument");
    }
  }, [missingData, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Retorna true para impedir o comportamento padrão de voltar
    });

    return () => backHandler.remove(); // Remove o listener quando o componente for desmontado
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HeaderHome
            title=''
            leftIcon={'menu'}
            rightIcon4={'home'}  
            collaborator={collaborator}
        />

      <View className="flex-1 justify-center bg-white">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : Array.isArray(cards) && cards.length > 0 ? (
          <>
            <View className="flex-1 w-full">
              {/* No return, onde está mapeando os cards: */}
              {cards.map((card, index) => (
                <View
                  key={`${card.id}_${index}`} // Alterar esta linha
                  className="absolute w-full h-full items-center"
                  style={{
                    top: 0,
                    justifyContent: "center",
                    zIndex: cards.length - index,
                  }}
                >
                  <Card
                    data={card}
                    onSwipeLeft={handleSwipeLeft} // Swipe para a esquerda (dislike)
                    onSwipeRight={handleSwipeRight} // Swipe para a direita (like e mostra popup)
                    isTopCard={index === 0}
                    zIndex={cards.length - index}
                    index={index}
                  />
                </View>
              ))}
            </View>

            <View className="absolute bottom-8 z-50 flex-row justify-between items-center w-full px-6">
              <TouchableOpacity onPress={handleUndo} style={{ padding: 16, borderRadius: 9999 }}>
                <MaterialIcons name="replay" size={32} color="#FFC107" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSwipeLeft}
                style={{ padding: 16, borderRadius: 9999 }}
              >
                <FontAwesome name="times" size={32} color="#FF5252" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSwipeRight}
                style={{ padding: 16, borderRadius: 9999 }}
              >
                <FontAwesome name="heart" size={32} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="mt-5 flex justify-between items-center h-full">
              <View
                style={{
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    ...FONTS.fontSemiBold,
                    fontSize: 16,
                    color: COLORS.title,
                    marginBottom: 5,
                    marginTop: 90,
                  }}
                >
                  Sem mais vagas no momento
                </Text>
                <Text className="text-center text-sm text-gray-400 font-normal">
                  Não há mais vagas no momento, volte mais tarde!
                </Text>

                <Image
                  source={require("../../assets/images/brand/Waiting.png")}
                  style={{ width: Dimensions.get('window').width * 0.7, height: Dimensions.get('window').height * 0.5 }}
                  resizeMode="contain"
                />
          </View>
        </View>
        )}
      </View>

      {/* Modal de Popup */}
      <Modal
        transparent
        animationType="fade"
        visible={showPopup}
        onRequestClose={() => setShowPopup(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 shadow-lg">
            <Text className="text-lg font-semibold text-center">
              {popupMessage}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
