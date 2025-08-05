import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  BackHandler,
  Keyboard,
  ScrollView,
} from "react-native";
import Card from "./Card";
import CardPeople from "./Helper/CardPeopleService";
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
import * as Notifications from "expo-notifications";
import UpdateCollaborator from "~/src/hooks/update/collaborator";
import {
  getMessaging,
  getToken,
  onTokenRefresh,
} from "@react-native-firebase/messaging";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const [cards, setCards] = useState<any>(false);
  const [cardSearch, setCardSearch] = useState<any>("Service");
  const [title, setTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [refresh, setRefresh] = useState<number>(0);
  const [previousCards, setPreviousCards] = useState<any>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { collaborator, updateCollaborator } = useCollaborator();
  const { validateCollaborator, missingData } = useCollaboratorContext();

  const showPopupMessage = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const fetchJobs = async () => {
    try {
      if (!collaborator) return;
      setIsLoading(true);
      let filterService = await AsyncStorage.getItem("filterService");
      const props: any = {
        cpf: collaborator.CPF,
        title: title,
        cep: collaborator.zip_code,
      };
      if (filterService) {
        const parsed = JSON.parse(filterService);
          (props.categorySelected = parsed.category),
          (props.modalitySelected = parsed.modality),
          (props.contractSelected = parsed.contract),
          (props.paymentSelected = parsed.payment),
          (props.timeSelected = parsed.time),
          (props.serviceSelected = parsed.service);
          (props.distance = parsed.distance),
          (props.showFarWork = parsed.showFarWork);
      }
      const response = await FindAllService(props);
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
    setIsLoading(true);
    let filterCategory = await AsyncStorage.getItem("filterCategory");
    const props: any = {
      cpf: collaborator.CPF,
      title: title,
      cep: collaborator.zip_code,
    };
    if (filterCategory) {
      const parsed = JSON.parse(filterCategory);
        (props.categorySelected = parsed.category),
        (props.modalitySelected = parsed.modality),
        (props.contractSelected = parsed.contract),
        (props.paymentSelected = parsed.payment),
        (props.timeSelected = parsed.time),
        (props.serviceSelected = parsed.service);
        (props.distance = parsed.distance),
        (props.showFarWork = parsed.showFarWork);
    }

    const response = await AllPeople(props);
    if (response?.status == 200) {
      setCards(response.peoples);
    }
    setIsLoading(false);
  };

  const registerForPushNotificationsAsync = async () => {
    if (!collaborator) return;
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Permissão de notificações não concedida!");
        return;
      }

      const messagingInstance = getMessaging();
      const token = await getToken(messagingInstance);
      if (!collaborator.push_token) {
        const date = {
          push_token: token,
        };
        await UpdateCollaborator(collaborator.CPF, date);
        setTimeout(() => {
          updateCollaborator(collaborator.CPF);
        }, 3000);
      } else {
        if (token !== collaborator.push_token) {
          const date = {
            push_token: token,
          };
          await UpdateCollaborator(collaborator.CPF, date);
          setTimeout(() => {
            updateCollaborator(collaborator.CPF);
          }, 3000);
        }
      }
    } catch (error) {
      console.log("Erro ao registrar notificações:", error);
    }
  };

  useEffect(() => {
    if (!collaborator) return;
    const messaging = getMessaging();
    const unsubscribe = onTokenRefresh(messaging, async (newToken) => {
      await UpdateCollaborator(collaborator.CPF, { push_token: newToken });
    });

    return () => unsubscribe();
  }, [collaborator]);

  useEffect(() => {
    if (collaborator) {
      const loadData = async () => {
        await registerForPushNotificationsAsync();
        await fetchJobs();
      };
      loadData();
    }
  }, [collaborator]);

  useEffect(() => {
    if (!collaborator) return;
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
  }, [cardSearch, collaborator, refresh]);

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

  useFocusEffect(
    useCallback(() => {
      validateCollaborator();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
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
                  style={{
                    color: "#fff",
                    fontSize: rf(14),
                    ...FONTS.fontSemiBold,
                  }}
                >
                  {popupMessage}
                </Text>
              </View>
            )}

            {/* <ScrollView keyboardShouldPersistTaps="handled"> */}
            {/* Topo da tela */}
            <View className="w-full z-50 mt-1 mb-10">
              <CardSearch
                refresh={refresh}
                setRefresh={setRefresh}
                activeTab={cardSearch}
                setActiveTab={setCardSearch}
                setCards={setCards}
                title={title}
                setTitle={setTitle}
                fetchJobs={fetchJobs}
                fetchPeople={fetchPeople}
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
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
