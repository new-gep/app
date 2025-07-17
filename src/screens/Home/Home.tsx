import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  BackHandler,
  Image,
  Dimensions,
  Keyboard,
  ScrollView,
} from "react-native";
import Card from "./Card";
import CardPeople from "./Helper/CardPeopleService";
import GetAllJob from "../../hooks/get/job/all";
import useCollaborator from "../../function/fetchCollaborator";
import HeaderStyle1 from "../../components/Headers/HeaderStyle1";
import { useCollaboratorContext } from "../../context/CollaboratorContext";
import { COLORS, FONTS } from "../../constants/theme";
import CardSearch from "./CardSearch";
import BannerImage from "./Helper/BannerImage";
import BannerCircle from "./Helper/BannerCircle";
import { rf } from "~/src/hooks/utils/responsiveFont";
import FindAll from "~/src/hooks/get/announcement/all";
import AllPeople from "~/src/hooks/get/collaborator/AllPeople";

const Home = () => {
  const [cards, setCards] = useState<any>(false);
  const [cardSearch, setCardSearch] = useState<any>("Service");
  const [isLoading, setIsLoading] = useState(true);
  const [previousCards, setPreviousCards] = useState<any>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { collaborator } = useCollaborator();

  const showPopupMessage = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const fetchJobs = async () => {
    try {
      if (!collaborator) return;
      const response = await FindAll(collaborator.CPF);
      if (response.status !== 200) {
        throw new Error(response.message || "Erro ao buscar os jobs.");
      }
      setCards(response.announcements);
    } catch (error: any) {
      alert("Erro ao buscar os jobs. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPeople = async () => {
    if (!collaborator) return;
    const response = await AllPeople(collaborator.CPF)
    if(response?.status == 200){
      setCards(response.peoples);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchJobs();
    };
    loadData();
  }, [collaborator]);

  useEffect(() => {
    const loadData = async () => {
      if (cardSearch == "Service") {
        console.log("buscando emprego");
        await fetchJobs();
      } else {
        console.log("buscando pessoa");
        await fetchPeople();
      }
    };
    setCards(null);
    setIsLoading(true);
    loadData();
  }, [cardSearch]);

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
      {showPopup && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            backgroundColor: "#333",
            padding: 16,
            borderRadius: 10,
            alignItems: "center",
            zIndex: 1000,
            // desloca para o centro exato:
            transform: [
              { translateX: -0.5 * 250 }, // metade da largura do popup (ajuste conforme seu tamanho)
              { translateY: -0.5 * 60 }, // metade da altura do popup (ajuste conforme seu tamanho)
            ],
            width: 250, // largura fixa ou pode ser dinâmica
          }}
        >
          <Text
            className="text-center"
            style={{ color: "#fff", fontSize: rf(14), ...FONTS.fontSemiBold }}
          >
            {popupMessage}
          </Text>
        </View>
      )}

      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Topo da tela */}
        <View className="w-full z-50 mt-1">
          <CardSearch
            setActiveTab={setCardSearch}
            activeTab={cardSearch}
            setCards={setCards}
          />
        </View>
        <BannerImage />
        <BannerCircle />

        {!isLoading ? (
          <>
            {cardSearch == "Service" ? (
              <Card
                data={cards}
                setCards={setCards}
                collaborator={collaborator}
                showPopupMessage={showPopupMessage}
              />
            ) : (
              <CardPeople
                data={cards}
                setCards={setCards}
                collaborator={collaborator}
                showPopupMessage={showPopupMessage}
              />
            )}
          </>
        ) : (
          <View className="mt-10 items-center justify-center">
            <ActivityIndicator color={'black'} size={rf(20)}/>
            <Text style={{...FONTS.fontBlack, fontSize:rf(15)}}>
              Buscando
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
