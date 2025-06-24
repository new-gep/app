import React, { useCallback, useRef, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ScrollView, FlatList } from 'react-native-gesture-handler';
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
} from "lucide-react-native";
import Candidate from "./Candidate/Index";
export default function ModalMenu({ visible, setVisible, item }: any) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [modalStep, setModalStep] = useState<"menu" | "candidates">("menu");
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
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

  const goToStep = (step: "menu" | "candidates") => {
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

  const data = useMemo(
      () =>
        Array(50)
          .fill(0)
          .map((_, index) => `index-${index}`),
      []
    );
    const renderItem = useCallback(
      (item: any) => (
        <View key={item} style={styles.itemContainer}>
          <Text>{item}</Text>
        </View>
      ),
      []
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}
        snapPoints={["25%", "50%"]}
        backdropComponent={renderBackdrop}
        enableContentPanningGesture={false}
        
      >
        <BottomSheetView style={{ flex: 1 }}>
            {modalStep === "menu" && (
              <View className="flex-row items-center mb-8">
                <View
                  style={{ height: rf(45), width: rf(45) }}
                  className="rounded-full bg-zinc-100 items-center justify-center p-3 mr-2"
                >
                  {renderIcon(item.service)}
                </View>
                <View>
                  <Text
                    style={{ fontSize: rf(13), ...FONTS.fontSemiBold }}
                    className=""
                  >
                    {item.title}
                  </Text>
                  <Text
                    className="text-gray-500"
                    style={{ ...FONTS.fontLight, fontSize: rf(12) }}
                  >
                    Categoria: {item.service}
                  </Text>
                  <Text
                    className="text-gray-500"
                    style={{ ...FONTS.fontLight, fontSize: rf(12) }}
                  >
                    Publicado: {item.create}
                  </Text>
                </View>
              </View>
            )}
            {currentSnapIndex > 0 && (
              <BottomSheetScrollView
                contentContainerStyle={{
                  paddingBottom: 80 , // Espaço extra para evitar corte
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
                  className="px-5 gap-5"
                >
                  {modalStep === "menu" ? (
                    <>
                      <TouchableOpacity
                        className="flex-row border-b border-zinc-200 pb-3 justify-between"
                        onPress={() => goToStep("candidates")}
                      >
                        <View className="flex-row">
                          <UsersRound size={rf(20)} className="mr-1" />
                          <Text
                            style={{ ...FONTS.fontSemiBold, fontSize: rf(12) }}
                          >
                            Candidatos
                          </Text>
                        </View>
                        <ChevronRight
                          size={rf(20)}
                          className="ml-1 text-zinc-500"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-row border-b border-zinc-200 pb-3 justify-between">
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
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-row border-b border-zinc-200 pb-3 justify-between">
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
                      <TouchableOpacity className="flex-row justify-between">
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
                      </TouchableOpacity>
                    </>
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



