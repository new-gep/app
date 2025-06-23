import {
  Check,
  ChevronRight,
  EllipsisVertical,
  UserRound,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import { rf } from "~/src/hooks/utils/responsiveFont";
import Header from "~/src/layout/Header";
import PeopleInformation from "~/src/screens/Home/Helper/Modal/PeopleInformation";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
export default function Active() {
  const SwipeableCardPeople = React.memo(function SwipeableCard({
    item,
    onSwipeRight,
    onSwipeLeft,
    navigateToCardInformation,
  }: any) {
    const [visible, setVisible] = useState<boolean>(false);
    const renderLeftActions = () => (
      <View className=" justify-center pl-6 flex-1 rounded-lg"></View>
    );
    const renderRightActions = () => (
      <View className="justify-center items-center  w-20">
        <TouchableOpacity onPress={() => setVisible(true)}>
          <EllipsisVertical size={rf(25)} />
        </TouchableOpacity>
      </View>
    );

    const MIN_MODAL_HEIGHT = SCREEN_HEIGHT * 0.4; // Minimum height (40% of screen)
    const MAX_MODAL_HEIGHT = SCREEN_HEIGHT * 0.95;

    return (
      <View style={styles.cardWrapper}>
        <PeopleInformation
          handleSwipeRight={onSwipeRight}
          visible={visible}
          setVisible={setVisible}
          jobData={item}
          peopleData={item}
        />
        <Swipeable
          key={item.id}
          onSwipeableOpen={(direction) => {
            if (direction === "left") {
              onSwipeRight(item.id);
            }
          }}
          renderRightActions={renderRightActions}
          renderLeftActions={renderLeftActions} // <- necessário para permitir o swipe à direita
        >
          <TouchableOpacity
            className="px-4 py-2 bg-white border-b border-zinc-300 rounded-lg flex-row items-center justify-between"
            style={styles.card}
            onPress={navigateToCardInformation}
          >
            <View className="flex-row items-center flex-1">
              <View className="mr-3" style={{ position: "relative" }}>
                {item.photoUri ? (
                  <Image
                    source={{ uri: item.photoUri }}
                    style={{ width: rf(43), height: rf(43) }}
                    className="w-12 h-12 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="rounded-full bg-zinc-100 items-center justify-center p-3 w-12 h-12">
                    <UserRound size={rf(25)} />
                  </View>
                )}

                {item.isVerified && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      height: rf(13),
                      width: rf(13),
                    }}
                    className="rounded-full bg-primary items-center justify-center "
                  >
                    <Check className="text-dark" size={rf(10)} />
                  </View>
                )}
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
                  {`${Mask("amount", item.salary)} ${item.valueType}`}
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
            <View className="mr-3">
              <ChevronRight size={rf(20)} />
            </View>
          </TouchableOpacity>
        </Swipeable>
      </View>
    );
  });

  const createdAds = [
    {
      id: 1,
      title: "Entrega urgente zona sul",
      date: "06/06/2025",
      status: "Ativo",
    },
    {
      id: 2,
      title: "Carona para cargas leves",
      date: "05/06/2025",
      status: "Ativo",
    },
  ];

  const acceptedAds = [
    {
      id: 3,
      title: "Entrega expressa loja X",
      date: "06/06/2025",
      status: "Aceito",
    },
    {
      id: 4,
      title: "Busca de documentos",
      date: "05/06/2025",
      status: "Aceito",
    },
  ];

  const fakeData = [
    {
      id: 1,
      typeService: "flex",
      name: "Maria Oliveira",
      valueType: "a combinar",
      locality: "São Paulo - SP",
      service: "Pintar minha casa",
      contactName: "João Silva",
      isVerified: true,
      function: "Pintar minha casa",
      salary: "150000",
      model: "Presencial",
      phone: "1193291233",
      info: "Serviço de pintura residencial completo, com material incluso.",
      included: "Tinta, mão de obra, limpeza após serviço.",
      notIncluded: "Movimentação de móveis, reparos em paredes.",
      photoUri: "https://randomuser.me/api/portraits/women/75.jpg",
      gallery: [
        "https://www.bgcexperts.com/wp-content/uploads/2024/05/interior-painting-services.jpg",
        "https://www.imageworkspainting.com/hubfs/stock-01.jpg",
        "https://www.solispainting.com/img/hero/painting-projects.jpg",
      ],
    },
  ];

  return (
    <View className="bg-white h-full">
      <Header leftIcon="back" title="Anúncio Ativo" />

      <ScrollView className="px-4 pt-4">
        {/* Anúncios Criados Ativos */}
        <Text className="text-lg font-bold mb-2">Seus anúncios ativos</Text>
        {createdAds.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-2xl p-4 mb-3"
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text className="text-base font-semibold">{item.title}</Text>
            <Text className="text-gray-500 mt-1">Data: {item.date}</Text>
            <Text className="text-green-600 mt-1">Status: {item.status}</Text>
          </View>
        ))}

        {/* Anúncios Aceitos Ativos */}
        <Text className="text-lg font-bold mt-6 mb-2">
          Anúncios que você aceitou
        </Text>
        {acceptedAds.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-2xl p-4 mb-3"
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text className="text-base font-semibold">{item.title}</Text>
            <Text className="text-gray-500 mt-1">Data: {item.date}</Text>
            <Text className="text-blue-600 mt-1">Status: {item.status}</Text>
          </View>
        ))}
      </ScrollView>
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
