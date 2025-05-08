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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import Header from "../../layout/Header";
import { COLORS, FONTS } from "../../constants/theme";
import Mask from "../../function/mask";
import HeaderHome from "../../layout/HeaderHome";
import Apply from "~/src/hooks/rabbit/job/Apply";
const Home = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousCards, setPreviousCards] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { collaborator, fetchCollaborator } = useCollaborator();
  const { validateCollaborator, missingData } = useCollaboratorContext();
  const navigation = useNavigation<NavigationProp<any>>();

  const handleSwipeRight = async (id: any) => {
    if (missingData) return;

    try {
      // 1. Buscar detalhes da vaga
      const jobResponse = await FindOneJob(id);
      if (jobResponse.status !== 200) {
        throw new Error("Erro ao buscar detalhes da vaga");
      }

      // 2. Simplificar manipulação de candidatos
      const currentCandidates =
        jobResponse.job.candidates?.map(
          ({ picture, name, ...rest }: Candidate) => rest
        ) || [];

      // 3. Verificar se já aplicou
      const alreadyApplied = currentCandidates.some(
        (c: any) => c.cpf === collaborator?.CPF
      );
      if (alreadyApplied) {
        updateCardState();
        showPopupMessage("Você já aplicou para esta vaga!");
        return;
      }

      // 4. Criar novo candidato
      const newCandidate = {
        cpf: collaborator?.CPF,
        step: 0,
        status: null,
        verify: null,
        observation: null,
      };

      // 5. Atualizar lista de candidatos
      let updatedCandidates = [...currentCandidates, newCandidate];

      const updateResponse = await UpdateJobDefault(id, {
        candidates: JSON.stringify(updatedCandidates),
      });

      if (updateResponse.status !== 200) {
        throw new Error("Erro ao atualizar vaga");
      }

      // 7. Atualizar UI após sucesso
      updateCardState();
      console.time("updateCardState");
    } catch (error: any) {
      updateCardState();
      console.error("Erro no aqui:", error);
      showPopupMessage(error.message || "Erro ao aplicar");
      handleUndo();
    }
  };

  // Função auxiliar para atualizar estado dos cards
  const updateCardState = () => {
    setCards((prevCards) => {
      if (prevCards.length === 0) return prevCards;

      const [firstCard, ...rest] = prevCards;
      setPreviousCards((prev) => [...prev, firstCard]);

      return rest.length > 0 ? rest : prevCards; // se não tiver mais cartas, mantém as atuais
    });
  };

  const handleSwipeLeft = () => {
    setCards((prevCards) => {
      if (prevCards.length === 0) return prevCards;

      const [firstCard, ...rest] = prevCards;
      setPreviousCards((prev) => [...prev, firstCard]);

      return rest;
    });
  };

  // const handleSuperLike = () => {
  //   setPreviousCards((prev) => [...prev, cards[0]]);
  //   setCards((prevCards) => prevCards.slice(1));
  //   showPopupMessage("Super like enviado!");
  // };

  const handleUndo = () => {
    if (previousCards.length > 0) {
      const lastCard = previousCards[previousCards.length - 1];

      // Verifica se o card já está na lista atual
      if (!cards.some((card: { id: any }) => card.id === lastCard.id)) {
        setPreviousCards((prev) => prev.slice(0, -1));
        setCards((prevCards) => [lastCard, ...prevCards]);
      } else {
        alert("Esse card já está na lista.");
      }
    } else {
      alert("Não há mais cards para voltar.");
    }
  };

  const showPopupMessage = (message: any) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const fetchJobs = async () => {
    console.log("caiu aqui");
    try {
      setIsLoading(true);
      const response = await GetAllJob();

      if (response.status !== 200) {
        throw new Error(response.message || "Erro ao buscar os jobs.");
      }

      const uniqueJobs = response.job.filter(
        (job: any, index: any, self: any) =>
          self.findIndex((j: any) => j.id === job.id) === index
      );

      setCards(uniqueJobs);
    } catch (error: any) {
      console.error("Ocorreu um erro ao buscar os jobs:", error.message);
      alert("Erro ao buscar os jobs. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const loadData = async () => {
      await fetchJobs();
      await fetchCollaborator();
      validateCollaborator();
    };

    loadData();
  }, []);

  useEffect(() => {
    if (missingData) {
      // navigation.navigate("CheckCadasterCollaboratorDocument");
    }
  }, [missingData, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return true; // Retorna true para impedir o comportamento padrão de voltar
      }
    );

    return () => backHandler.remove(); // Remove o listener quando o componente for desmontado
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HeaderHome
        title=""
        leftIcon={"menu"}
        rightIcon4={"home"}
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
              {cards.slice(0, 2).map((card: any, index) => (
                <View
                  key={card.id} // Alterar esta linha
                  className="absolute w-full h-full items-center p-2 mt-2"
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
                    onSuperLike={handleSwipeRight}
                    isTopCard={index === 0}
                    zIndex={cards.length - index}
                    index={index}
                    handleUndo={handleUndo}
                  />
                </View>
              ))}
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
                style={{
                  width: Dimensions.get("window").width * 0.7,
                  height: Dimensions.get("window").height * 0.5,
                }}
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
