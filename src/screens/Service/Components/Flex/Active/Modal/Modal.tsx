import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ScrollView, FlatList } from "react-native-gesture-handler";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";
import {
  UserRound,
  Wrench,
  GraduationCap,
  CarFront,
  Handshake,
  MonitorSmartphone,
  PartyPopper,
  Shirt,
  Hammer,
  HeartPulse,
  House,
  UsersRound,
  Flame,
  Send,
  ChevronRight,
  Eye,
  CircleCheck,
} from "lucide-react-native";
import Candidate from "../Candidate/Index";
import Promotion from "../Promotion/Index";
import ServiceInformation from "~/src/screens/Home/Helper/Modal/ServiceInformation";
import Mask from "~/src/function/mask";
import PeopleInformation from "~/src/screens/Home/Helper/Modal/PeopleInformation";
import deleteAnnouncement from "~/src/hooks/delete/announcement";
import { useNavigation } from "@react-navigation/native";
export default function ModalMenu({ visible, setVisible, item }: any) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalStep, setModalStep] = useState<
    "menu" | "candidates" | "promotion"
  >("menu");
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
  const navigation = useNavigation();
  const [visibleWork, setVisibleWork] = useState<boolean>(false);
  const [visibleResponder, setVisibleResponder] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const serviceIcons = {
    "Assistência Técnica": <Wrench size={rf(25)} className="text-dark" />,
    Aulas: <GraduationCap size={rf(25)} className="text-dark" />,
    "Mecânica e Transportes": <CarFront size={rf(25)} className="text-dark" />,
    Consultoria: <Handshake size={rf(25)} className="text-dark" />,
    "Design e Tecnologia": (
      <MonitorSmartphone size={rf(25)} className="text-dark" />
    ),
    Eventos: <PartyPopper size={rf(25)} className="text-dark" />,
    "Moda e Beleza": <Shirt size={rf(25)} className="text-dark" />,
    "Reformas e Reparos": <Hammer size={rf(25)} className="text-dark" />,
    Saúde: <HeartPulse size={rf(25)} className="text-dark" />,
    "Serviços Domésticos": <House size={rf(25)} className="text-dark" />,
  };
  // 2. Função para retornar o ícone de forma segura
  const renderIcon = (serviceName: string) => {
    return (
      //@ts-ignore
      serviceIcons[serviceName] || (
        <UserRound size={rf(25)} className="text-dark" />
      )
    );
  };

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      setModalStep("menu");
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  useEffect(() => {
    if (currentSnapIndex > 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentSnapIndex, modalStep]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6} // você pode ajustar para 0.4 ou 0.8 se quiser mais claro ou mais escuro
      />
    ),
    []
  );

  const goToStep = (step: "menu" | "candidates" | "promotion") => {
    fadeAnim.setValue(0);
    translateYAnim.setValue(20);
    setModalStep(step);
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }, 10);
  };

  const handleSheetChanges = useCallback(
    (index: number) => {
      setCurrentSnapIndex(index);
      if (index === -1) {
        setVisible(false);
      }
    },
    [setVisible]
  );


  const finishAnnouncement = async () => {
    Alert.alert(
      "Finalizar serviço",
      "Tem certeza que deseja finalizar este serviço?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim, finalizar",
          onPress: async () => {
            try {
              // Sua lógica de finalização aqui
              const response = await deleteAnnouncement(item.id);
              if(response?.status == 200){
                navigation.goBack()
              }
            } catch (error) {
              console.error("Erro ao finalizar serviço:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {item && (
        <ServiceInformation
          autoView={true}
          peopleData={item}
          visible={visibleWork}
          setVisible={setVisibleWork}
          handleSwipeRight={() => {}}
        />
      )}
      {item.CPF_Responder && (
        <PeopleInformation
          visible={visibleResponder}
          setVisible={setVisibleResponder}
          peopleData={{ ...item.CPF_Responder.collaborator, match: true }}
        />
      )}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        snapPoints={["25%", "80%"]}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
      >
        <BottomSheetView style={{ flex: 1 }}>
          {modalStep === "menu" && (
            <View className="flex-row items-center mb-8 px-5">
              <View
                style={{ height: rf(45), width: rf(45) }}
                className="rounded-full bg-zinc-100 items-center justify-center p-3 mr-2"
              >
                {renderIcon(item.category)}
              </View>
              <View>
                <Text
                  style={{
                    fontSize: rf(13),
                    ...FONTS.fontSemiBold,
                    textTransform: "capitalize",
                  }}
                  className="capitalize"
                >
                  {item.title}
                </Text>
                <Text
                  className="text-gray-500"
                  style={{ ...FONTS.fontLight, fontSize: rf(12) }}
                >
                  Categoria: {item?.category && item.category}
                </Text>
                <Text
                  className="text-gray-500"
                  style={{ ...FONTS.fontLight, fontSize: rf(12) }}
                >
                  Anúncio: {item.typeAnnouncement}
                </Text>
                <Text
                  className="text-gray-500"
                  style={{ ...FONTS.fontLight, fontSize: rf(12) }}
                >
                  Publicado: {Mask("dateFormat", item.create_at)}
                </Text>
              </View>
            </View>
          )}
          {currentSnapIndex > 0 && (
            <BottomSheetScrollView
              contentContainerStyle={{
                flexGrow: 1, // Permite que o conteúdo cresça
                flex: 1,
              }}
            >
              <Animated.View
                style={{
                  flex: 1,
                  opacity: fadeAnim,
                  transform: [{ translateY: translateYAnim }],
                }}
                className="px-5 "
              >
                {modalStep === "menu" ? (
                  <View className="gap-5">
                    <TouchableOpacity
                      className="flex-row border-b border-zinc-200 pb-3 justify-between"
                      onPress={() => {
                        if (!item.CPF_Responder) {
                          goToStep("candidates");
                        } else {
                          setVisibleResponder(true);
                        }
                      }}
                    >
                      <View className="flex-row">
                        {!item.CPF_Responder ? (
                          <>
                            <UsersRound size={rf(20)} className="mr-1" />
                            <Text
                              style={{
                                ...FONTS.fontSemiBold,
                                fontSize: rf(12),
                              }}
                            >
                              Candidatos
                            </Text>
                          </>
                        ) : (
                          <>
                            <UserRound size={rf(20)} className="mr-1" />
                            <Text
                              style={{
                                ...FONTS.fontSemiBold,
                                fontSize: rf(12),
                              }}
                            >
                              Prestador de Serviço
                            </Text>
                          </>
                        )}
                      </View>
                      <ChevronRight
                        size={rf(20)}
                        className="ml-1 text-zinc-500"
                      />
                    </TouchableOpacity>
                    {/* <TouchableOpacity className="flex-row border-b border-zinc-200 pb-3 justify-between"
                        onPress={()=> goToStep("promotion")}
                      >
                        <View className="flex-row ">
                          <Flame size={rf(20)} className="mr-1" />
                          <Text
                            style={{ ...FONTS.fontSemiBold, fontSize: rf(12) }}
                          >
                            Promover
                          </Text>
                        </View>
                        <ChevronRight
                          size={rf(20)}
                          className="ml-1 text-zinc-500"
                        />
                      </TouchableOpacity> */}
                    <TouchableOpacity
                      className="flex-row border-b border-zinc-200 pb-3 justify-between"
                      onPress={() => setVisibleWork(true)}
                    >
                      <View className="flex-row ">
                        <Eye size={rf(20)} className="mr-1" />
                        <Text
                          style={{ ...FONTS.fontSemiBold, fontSize: rf(12) }}
                        >
                          Visualizar
                        </Text>
                      </View>
                      <ChevronRight
                        size={rf(20)}
                        className="ml-1 text-zinc-500"
                      />
                    </TouchableOpacity>
                    {item.CPF_Responder && (
                      <TouchableOpacity
                        className="flex-row border-b border-zinc-200 pb-3 justify-between"
                        onPress={finishAnnouncement}
                      >
                        <View className="flex-row ">
                          <CircleCheck size={rf(20)} className="mr-1" />
                          <Text
                            style={{ ...FONTS.fontSemiBold, fontSize: rf(12) }}
                          >
                            Concluir Serviço
                          </Text>
                        </View>
                        <ChevronRight
                          size={rf(20)}
                          className="ml-1 text-zinc-500"
                        />
                      </TouchableOpacity>
                    )}
                    {/* <TouchableOpacity className="flex-row justify-between">
                        <View className="flex-row">
                          <Send size={rf(20)} className="mr-1" />
                          <Text
                            style={{ ...FONTS.fontSemiBold, fontSize: rf(12) }}
                          >
                            Compartilhar
                          </Text>
                        </View>
                        <ChevronRight
                          size={rf(20)}
                          className="ml-1 text-zinc-500"
                        />
                      </TouchableOpacity> */}
                  </View>
                ) : modalStep === "promotion" ? (
                  <Promotion item={item} setModalStep={goToStep} />
                ) : (
                  <Candidate item={item} setModalStep={goToStep} />
                )}
              </Animated.View>
            </BottomSheetScrollView>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});
