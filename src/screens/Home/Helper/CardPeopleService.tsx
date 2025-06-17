import {
  Building2,
  ChevronRight,
  EllipsisVertical,
  UserRound,
} from "lucide-react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
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
import { useNavigation } from "@react-navigation/native";
import PeopleInformation from "./Modal/PeopleInformation";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 120;
const OPTIONS_WIDTH = rf(80);

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Card memoizado
const SwipeableCard = React.memo(function SwipeableCard({
  item,
  onSwipeRight,
  onSwipeLeft,
  isMenuVisible,
  setMenuVisible,
  navigateToCardInformation,
}: any) {
  const translateX = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) {
          translateX.setValue(Math.max(gesture.dx, -OPTIONS_WIDTH));
        } else {
          translateX.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
          }).start(() => onSwipeRight(item.id));
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.spring(translateX, {
            toValue: -OPTIONS_WIDTH,
            useNativeDriver: true,
          }).start(() => setMenuVisible(item.id, true));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => setMenuVisible(item.id, false));
        }
      },
    })
  ).current;
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <View style={styles.cardWrapper}>
      <PeopleInformation
        handleSwipeRight={onSwipeRight}
        visible={visible}
        setVisible={setVisible}
        jobData={item}
        peopleData={item}
      />
      {isMenuVisible && (
        <View className="flex-row absolute right-0 h-full px-4 py-2">
          <TouchableOpacity
            className="w-10 items-center justify-center"
            onPress={() => {
              Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
              }).start(() => setVisible(true));
            }}
          >
            <EllipsisVertical size={rf(25)} />
          </TouchableOpacity>
        </View>
      )}
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
          onPress={navigateToCardInformation}
        >
          <View className="flex-row items-center flex-1">
            <View className="rounded-full bg-zinc-100 items-center justify-center p-3 mr-3">
              <UserRound size={rf(25)} />
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
});

export default function CathoStyleCards({
  data,
  setCards,
  collaborator,
  showPopupMessage,
}: any) {
  const [visibleMenuIds, setVisibleMenuIds] = useState<number[]>([]);
  const navigation = useNavigation();
  const setMenuVisible = useCallback((id: number, visible: boolean) => {
    setVisibleMenuIds((prev) =>
      visible ? [...new Set([...prev, id])] : prev.filter((i) => i !== id)
    );
  }, []);

  const removeCard = (id: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCards((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  const handleSwipeLeft = () => {
    showPopupMessage("Opção Menu selecionada!");
  };

  const handleSwipeRight = async (id: any) => {
    showPopupMessage("Você aplicou para a vaga com sucesso!");
    return;
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

  const navigateToCardInformation = ({ data }: any) => {
    navigation.navigate("CardInformationPeople", {
      cardData: data,
      onSwipeLeft: () => handleSwipeRight(data.id),
    });
  };

  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <SwipeableCard
          navigateToCardInformation={() =>
            navigateToCardInformation({ data: item })
          }
          item={item}
          isMenuVisible={visibleMenuIds.includes(item.id)}
          setMenuVisible={setMenuVisible}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      );
    },
    [visibleMenuIds]
  );

  const fakeData = [
    {
      id: 1,
      name: "Maria Oliveira",
      valueType: "a combinar",
      locality: "São Paulo - SP",
      service: "Pintar minha casa",
      contactName: "João Silva",
      isVerified: true,
      function: "Pintar minha casa",
      salary: "150000",
      model: "a combinar",
      phone: "1193291233",
      info: "Serviço de pintura residencial completo, com material incluso.",
      included: "Tinta, mão de obra, limpeza após serviço.",
      notIncluded: "Movimentação de móveis, reparos em paredes.",
    },
    {
      id: 2,
      name: "Carlos Pereira",
      valueType: "por mês",
      locality: "Rio de Janeiro - RJ",
      service: "Subir parede",
      contactName: "Ana Costa",
      isVerified: false,
      function: "Subir parede",
      salary: "250050",
      model: "por mês",
      phone: "1193291233",
      info: "Serviço para construção de paredes internas e externas.",
      included: "Mão de obra, nivelamento e acabamento básico.",
      notIncluded: "Materiais como tijolos e cimento, pintura.",
    },
    {
      id: 3,
      name: "Ana Souza",
      valueType: "por projeto",
      locality: "Belo Horizonte - MG",
      service: "Fazer um sistema",
      contactName: "Pedro Almeida",
      isVerified: true,
      function: "Fazer um sistema",
      salary: "300075",
      model: "por projeto",
      phone: "1193291233",
      info: "Desenvolvimento de sistema web completo.",
      included: "Levantamento de requisitos, codificação, testes.",
      notIncluded: "Hospedagem, manutenção pós-entrega.",
    },
    {
      id: 4,
      name: "José Lima",
      valueType: "a combinar",
      locality: "Curitiba - PR",
      service: "Limpar minha casa",
      contactName: "Mariana Santos",
      isVerified: false,
      function: "Limpar minha casa",
      salary: "80025",
      model: "a combinar",
      phone: "1193291233",
      info: "Limpeza residencial com produtos básicos.",
      included: "Limpeza de chão, banheiros e superfícies.",
      notIncluded: "Limpeza de vidros externos, organização de armários.",
    },
    {
      id: 5,
      name: "Fernanda Ribeiro",
      valueType: "por mês",
      locality: "Porto Alegre - RS",
      service: "Pintar minha casa",
      contactName: "Lucas Ferreira",
      isVerified: true,
      function: "Pintar minha casa",
      salary: "200000",
      model: "por mês",
      phone: "1193291233",
      info: "Pintura com acabamento premium para áreas internas.",
      included: "Tinta premium, mão de obra qualificada.",
      notIncluded: "Texturização de paredes, pintura externa.",
    },
    {
      id: 6,
      name: "Rafael Mendes",
      valueType: "por projeto",
      locality: "Salvador - BA",
      service: "Subir parede",
      contactName: "Camila Oliveira",
      isVerified: false,
      function: "Subir parede",
      salary: "350090",
      model: "por projeto",
      phone: "1193291233",
      info: "Construção de parede de alvenaria com acabamento.",
      included: "Mão de obra, alinhamento e reboco.",
      notIncluded: "Materiais, remoção de entulho.",
    },
    {
      id: 7,
      name: "Patrícia Gomes",
      valueType: "a combinar",
      locality: "Fortaleza - CE",
      service: "Fazer um sistema",
      contactName: "Thiago Pereira",
      isVerified: true,
      function: "Fazer um sistema",
      salary: "a combinar",
      model: "a combinar",
      phone: "1193291233",
      info: "Desenvolvimento de sistema personalizado conforme demanda.",
      included: "Documentação técnica, deploy inicial.",
      notIncluded: "Suporte contínuo, treinamento da equipe.",
    },
    {
      id: 8,
      name: "Luiz Carvalho",
      valueType: "por mês",
      locality: "Manaus - AM",
      service: "Limpar minha casa",
      contactName: "Juliana Lima",
      isVerified: false,
      function: "Limpar minha casa",
      salary: "120060",
      model: "por mês",
      phone: "1193291233",
      info: "Serviço mensal de limpeza de casa com agendamento fixo.",
      included: "Limpeza geral e troca de lixo.",
      notIncluded: "Lavagem de roupas, passadoria.",
    },
  ];

  return (
    <View style={styles.container} className="px-4 py-2">
      <FlatList
        data={fakeData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
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
