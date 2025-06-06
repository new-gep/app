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
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
// import HeaderHome from "../../layout/HeaderHome";
import Apply from "~/src/hooks/rabbit/job/Apply";
import ApplyJob from "~/src/hooks/update/job/applyJob";
import CardSearch from "./CardSearch";
import BannerImage from "./Helper/BannerImage";
import BannerCircle from "./Helper/BannerCircle";
import HeaderHome from "~/src/layout/Headerome";
import { rf } from "~/src/hooks/utils/responsiveFont";
const Home = () => {
  const [cards, setCards] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previousCards, setPreviousCards] = useState<any>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { collaborator, fetchCollaborator } = useCollaborator();
  const { validateCollaborator, missingData } = useCollaboratorContext();
  const navigation = useNavigation<NavigationProp<any>>();
  const { height: windowHeight } = Dimensions.get("window");

  const handleSwipeRight = async (id: any) => {
    if (!collaborator) {
      showPopupMessage("Você precisa estar logado para aplicar!");
      return;
    }
    const response = await ApplyJob(id, collaborator?.CPF);
    if (response.status === 200) {
      showPopupMessage("Você aplicou para a vaga com sucesso!");
      handleSwipeLeft();
    } else if (response.status === 400) {
      showPopupMessage("Você já aplicou para essa vaga!");
      handleSwipeLeft();
    } else {
      showPopupMessage("Erro ao aplicar para a vaga!");
    }
    return;
    if (missingData) return;

    try {
      const jobResponse = await FindOneJob(id);
      if (jobResponse.status !== 200) {
        throw new Error("Erro ao buscar detalhes da vaga");
      }

      // Define Candidate type if not already imported
      type Candidate = {
        picture?: string;
        name?: string;
        cpf?: string;
        CPF?: string;
        step?: number;
        status?: any;
        verify?: any;
        observation?: any;
        [key: string]: any;
      };

      const currentCandidates =
        jobResponse.job.candidates?.map(
          ({ picture, name, ...rest }: Candidate) => rest
        ) || [];

      const alreadyApplied = currentCandidates.some(
        (c: any) => c.cpf === collaborator?.CPF
      );
      if (alreadyApplied) {
        updateCardState();
        showPopupMessage("Você já aplicou para esta vaga!");
        return;
      }

      const newCandidate = {
        cpf: collaborator?.CPF,
        step: 0,
        status: null,
        verify: null,
        observation: null,
      };

      let updatedCandidates = [...currentCandidates, newCandidate];

      const updateResponse = await UpdateJobDefault(id, {
        candidates: JSON.stringify(updatedCandidates),
      });

      if (updateResponse.status !== 200) {
        throw new Error("Erro ao atualizar vaga");
      }

      updateCardState();
    } catch (error: any) {
      updateCardState();
      console.error("Erro no aqui:", error);
      showPopupMessage(error.message || "Erro ao aplicar");
      handleUndo();
    }
  };

  const updateCardState = () => {
    setCards((prevCards: any) => {
      if (prevCards.length === 0) return prevCards;

      const [firstCard, ...rest] = prevCards;
      setPreviousCards((prev: any) => [...prev, firstCard]);

      return rest.length > 0 ? rest : prevCards;
    });
  };

  const handleSwipeLeft = () => {
    setCards((prevCards: any) => {
      if (prevCards.length === 0) return prevCards;

      const [firstCard, ...rest] = prevCards;
      setPreviousCards((prev: any) => [...prev, firstCard]);

      return rest;
    });
  };

  const handleUndo = () => {
    if (previousCards.length > 0) {
      const lastCard = previousCards[previousCards.length - 1];

      if (!cards.some((card: { id: any }) => card.id === lastCard.id)) {
        setPreviousCards((prev: any) => prev.slice(0, -1));
        setCards((prevCards: any) => [lastCard, ...prevCards]);
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
      // await fetchJobs();
      await fetchCollaborator();
      validateCollaborator();
    };

    loadData();
  }, []);

  // useEffect(() => {
  //   if (missingData) {
  //     navigation.navigate("CheckCadasterCollaboratorDocument");
  //   }
  // }, [missingData, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
   <SafeAreaView className="flex-1 bg-white">
    <ScrollView
      contentContainerStyle={{

        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Topo da tela */}
      <View className="w-full z-50 mt-1">
        <CardSearch setCards={setCards} />
      </View>

      <BannerImage />
      <BannerCircle />

      {/* Container relativo para os cards */}
      <View
        style={{
          height: windowHeight * 0.60, // altura fixa para comportar os cards (ajuste como preferir)
          position: "relative",
          marginTop: 20,
          paddingHorizontal: 10,
        }}
      >
        {isLoading ? (
          <View className="justify-center items-center py-10">
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : Array.isArray(cards) && cards.length > 0 ? (
          cards.map((card: any, index: number) => (
            <View
              key={card.id}
              style={{
                right:10,
                position: "absolute",
                width: "100%",
                top: index * 5, // espaçamento entre cards (pode ajustar)
                zIndex: cards.length - index,
                // você pode adicionar sombra, bordas, etc aqui se quiser
              }}
            >
              <Card
                data={card}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSuperLike={handleSwipeRight}
                isTopCard={index === 0}
                zIndex={cards.length - index}
                index={index}
                handleUndo={handleUndo}
              />
            </View>
          ))
        ) : !isKeyboardVisible ? (
          <View className="flex justify-center items-center px-5">
            <Text
              style={{
                ...FONTS.fontSemiBold,
                fontSize: rf(16),
                color: COLORS.title,
                marginBottom: 5,
              }}
            >
              {cards === false
                ? "Busque sua vaga"
                : "Não encontramos sua vaga"}
            </Text>
            <Text style={{
                ...FONTS.fontLight,
                fontSize: rf(13),
            }} className="text-center text-gray-400 font-normal">
              {cards === false
                ? "Pesquise sua vaga pelo nome ou palavra-chave"
                : "Não há mais vagas no momento, busque outra!"}
            </Text>
            <Image
              source={
                cards === false
                  ? require("../../assets/images/brand/search.png")
                  : require("../../assets/images/brand/Waiting.png")
              }
              style={{
                width: Dimensions.get("window").width * 0.8,
                height: Dimensions.get("window").height * 0.5,
              }}
              resizeMode="contain"
            />
          </View>
        ) : null}
      </View>
    </ScrollView>
  </SafeAreaView>
);


};

export default Home;
