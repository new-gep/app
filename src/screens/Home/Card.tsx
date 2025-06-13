import { Building2, ChevronRight, EllipsisVertical } from "lucide-react-native";
import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  FlatList,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { FONTS } from "~/src/constants/theme";
import ApplyJob from "~/src/hooks/update/job/applyJob";
import { rf } from "~/src/hooks/utils/responsiveFont";
import Mask from "~/src/function/mask";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 120;
const OPTIONS_WIDTH = rf(80); // Largura total das opções (80px por botão)

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CathoStyleCards({
  data,
  setCards,
  collaborator,
  showPopupMessage,
}: any) {
  const translateXRefs = useRef<Animated.Value[]>([]);
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false)
  useEffect(() => {
    translateXRefs.current = data.map(() => new Animated.Value(0));
  }, [data]);

  const removeCard = (id: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCards((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  const handleSwipeLeft = (id: any) => {
    // Função placeholder para a opção "Menu" ou outras ações
    showPopupMessage("Opção Menu selecionada!");
    // Opcional: remover o card após a ação
    // removeCard(id);
  };

  const handleSwipeRight = async (id: any) => {
    if (!collaborator) {
      showPopupMessage("Você precisa estar logado para aplicar!");
      return;
    }

    try {
      const response = await ApplyJob(id, collaborator?.CPF);
      if (response.status === 200) {
        removeCard(id);
        showPopupMessage("Você aplicou para a vaga com sucesso!");
      } else if (response.status === 400) {
        removeCard(id);
        showPopupMessage("Você já aplicou para essa vaga!");
      } else {
        showPopupMessage("Erro ao aplicar para a vaga!");
      }
    } catch (error) {
      showPopupMessage("Erro ao aplicar para a vaga!");
    }
  };

  const renderItem = ({ item, index }: any) => {
    const translateX = translateXRefs.current[index] ?? new Animated.Value(0);

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        // Limitar o arrasto à esquerda para revelar apenas as opções
        if (gesture.dx < 0) {
          translateX.setValue(Math.max(gesture.dx, -OPTIONS_WIDTH));
          setVisibleMenu(true);
        } else {
          translateX.setValue(gesture.dx);
          setVisibleMenu(false);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swipe completo para a direita
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            handleSwipeRight(item.id);
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swipe à esquerda para revelar opções
          Animated.spring(translateX, {
            
            toValue: -OPTIONS_WIDTH,
            useNativeDriver: true,
          }).start();
        } else {
          // Volta à posição original ou mantém as opções visíveis
          Animated.spring(translateX, {
            toValue: gesture.dx < -SWIPE_THRESHOLD / 2 ? -OPTIONS_WIDTH : 0,
            useNativeDriver: true,
          }).start();
        }
      },
    });

    return (
      <View style={styles.cardWrapper}>
        {/* Contêiner das opções (Menu e Visualizar) */}
        { visibleMenu &&
          <View className="flex-row absolute right-0 h-full px-4 py-2">
            <TouchableOpacity
              className="w-10 items-center justify-center"
              onPress={() => {
                Animated.spring(translateX, {
                  toValue: 0,
                  useNativeDriver: true,
                }).start(() => handleSwipeLeft(item.id));
              }}
            >
              <EllipsisVertical />
            </TouchableOpacity>
          </View>
        }
        {/* Card principal */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.cardContainer,
            { transform: [{ translateX }], marginVertical: 5 },
          ]}
        >
          <TouchableOpacity
            className="px-4 py-2 bg-white border-b border-zinc-300 rounded-lg flex-row items-center justify-between"
            style={styles.card}
          >
            <View className="flex-row items-center flex-1">
              <View className="rounded-full bg-zinc-100 items-center justify-center p-3 mr-3">
                <Building2 size={rf(25)} />
              </View>
              <View className="pr-2">
                <Text
                  style={{ ...FONTS.font, fontSize: rf(12) }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.function}
                </Text>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className="text-green-600"
                >
                  {Mask("amount", item.salary)}
                </Text>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className="text-zinc-500"
                >
                  {item.model}
                </Text>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className="text-zinc-500"
                >
                  {item.locality}
                </Text>
              </View>
            </View>
            <View className="ml-2">
              <ChevronRight size={rf(20)} />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container} className="px-4 py-2">
      <FlatList
        nestedScrollEnabled={true}
        scrollEnabled={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardWrapper: {
    position: "relative",
    width: SCREEN_WIDTH - rf(30),
    minHeight: rf(20),
  },
  cardContainer: {
    width: SCREEN_WIDTH - rf(32),
    minHeight: rf(20),
    overflow: "visible",
  },
  card: {
    width: "100%",
    minHeight: rf(80),
    overflow: "visible",
  },
});