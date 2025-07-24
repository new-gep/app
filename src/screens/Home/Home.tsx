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
  Platform,
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
import FindAllService from "~/src/hooks/get/job/allService";
import messaging from "@react-native-firebase/messaging";
import { getApps, initializeApp } from '@react-native-firebase/app';
import * as Notifications from "expo-notifications";

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
      const response = await FindAllService(collaborator.CPF);
      if (response.status !== 200) {
        throw new Error(response.message || "Erro ao buscar os jobs.");
      }
      setCards(response.data);
    } catch (error: any) {
      alert("Erro ao buscar os jobs. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPeople = async () => {
    if (!collaborator) return;
    const response = await AllPeople(collaborator.CPF);
    if (response?.status == 200) {
      setCards(response.peoples);
    }
    setIsLoading(false);
  };

  const isEmulator = () => {
    if (Platform.OS !== "android") {
      // Para iOS, verificar 'Simulator' no Model
      //@ts-ignore
      return Platform.constants.Model?.toLowerCase().includes("simulator");
    }

    // Para Android, verificar propriedades típicas de emuladores
    const { Brand, Model, Fingerprint, Manufacturer } = Platform.constants;

    const isEmulatorByModel =
      Model?.toLowerCase().includes("sdk") ||
      Model?.toLowerCase().includes("emulator");
    const isEmulatorByFingerprint =
      Fingerprint?.toLowerCase().includes("generic") ||
      Fingerprint?.toLowerCase().includes("sdk");
    const isEmulatorByManufacturer =
      Manufacturer?.toLowerCase().includes("genymotion") ||
      Manufacturer?.toLowerCase() === "google";
    const isEmulatorByBrand = Brand?.toLowerCase() === "google";

    // Considera emulador se qualquer uma das condições for verdadeira
    return (
      isEmulatorByModel ||
      isEmulatorByFingerprint ||
      isEmulatorByManufacturer ||
      isEmulatorByBrand
    );
  };

  // async function registerForPushNotificationsAsync() {
  //   //     let token;

  //   const { status: existingStatus } =
  //     await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;

  //   if (existingStatus !== "granted") {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }
  //   if (finalStatus !== "granted") {
  //     alert("Failed to get push token for push notification!");
  //     return;
  //   }

  //   //     return token;
  // }

  async function registerForPushNotificationsAsync() {
  if (!collaborator) return;

  try {
    // ✅ Inicializa o Firebase se ainda não tiver sido
    if (getApps().length === 0) {
      initializeApp();
    }

    let finalStatus;

    // Verifica se já tem permissão
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    finalStatus = existingStatus;

    // Se não tiver, pede permissão
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Se ainda não foi concedido, sai
    if (finalStatus !== "granted") {
      alert("Permissão de notificações não concedida!");
      return;
    }

    // ✅ Obter token FCM
    const token = await messaging().getToken();
    console.log("🔥 FCM Token:", token);

    // Salvar no backend
    // await api.post('/save-token', { collaboratorId: collaborator.id, token });

    // Atualização automática do token
    messaging().onTokenRefresh(async (newToken) => {
      console.log("FCM Token atualizado:", newToken);
      // await api.post('/save-token', { collaboratorId: collaborator.id, token: newToken });
    });
  } catch (error) {
    console.log("Erro ao registrar notificações:", error);
  }
  }

  useEffect(() => {
    if (collaborator) {
      const loadData = async () => {
        // if(!isEmulator()){
          // await registerForPushNotificationsAsync();
        // }
        await fetchJobs();
      };
      loadData();
    };
  }, [collaborator]);

  useEffect(() => {
    if(!collaborator) return;
    const loadData = async () => {
      if (cardSearch == "Service") {
        await fetchJobs();
      } else {
        await fetchPeople();
      }
    };
    setCards(null);
    setIsLoading(true);
    loadData();
  }, [cardSearch, collaborator]);

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

      {/* <ScrollView keyboardShouldPersistTaps="handled"> */}
        {/* Topo da tela */}
        <View className="w-full z-50 mt-1 mb-10">
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
            <ActivityIndicator color={"black"} size={rf(20)} />
            <Text style={{ ...FONTS.fontBlack, fontSize: rf(15) }}>
              Buscando
            </Text>
          </View>
        )}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default Home;
