import {
  Building2,
  Check,
  ChevronRight,
  EllipsisVertical,
  UserRound,
} from "lucide-react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Image,
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
import WorkInformation from "./Helper/Modal/WorkInformation";
import PeopleInformation from "./Helper/Modal/ServiceInformation";
import { Swipeable } from "react-native-gesture-handler";
import Apply from "~/src/hooks/update/announcement/apply";
import Announcement from "../Profile/Announcement/Index";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 120;
const OPTIONS_WIDTH = rf(80);

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
// Card Company
const SwipeableCardCompany = React.memo(function SwipeableCard({
  item,
  onSwipeRight,
  navigateToCardInformation,
  handleSwipeRight,
}: any) {
  const [visible, setVisible] = useState<boolean>();

  const renderLeftActions = () => (
    <View className=" justify-center pl-6 flex-1 rounded-lg"></View>
  );

  const renderRightActions = () => (
    <View className="justify-center items-center w-20">
      <TouchableOpacity onPress={() => setVisible(true)}>
        <EllipsisVertical size={rf(25)} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.cardWrapper}>
      <WorkInformation
        jobData={item}
        visible={visible}
        setVisible={setVisible}
        handleSwipeRight={handleSwipeRight}
      />
      <Swipeable
        key={item.id}
        onSwipeableOpen={(direction) => {
          if (direction === "left") {
            handleSwipeRight(item.job.id);
          }
        }}
        // renderRightActions={renderRightActions}
        renderRightActions={()=> null}
        renderLeftActions={renderLeftActions} // <- necessário para permitir o swipe à direita
      >
        <TouchableOpacity
          className="px-4 py-2 bg-white border-b border-zinc-300 flex-row items-center justify-between"
          style={styles.card}
          onPress={() => setVisible(true)}
        >
          <View className="flex-row items-center">
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
                  <Building2 size={rf(25)} />
                </View>
              )}

              {/* {item?.isVerified && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    height: rf(13),
                    width: rf(13),
                  }}
                  className="rounded-full bg-primary items-center justify-center"
                >
                  <Check className="text-dark" size={rf(10)} />
                </View>
              )} */}
            </View>

            <View className="pr-2">
              <Text style={{ ...FONTS.font, fontSize: rf(12) }} className="capitalize">
                {item?.job?.function ? item.job.function : "Função não informada"}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-green-600"
              >
                {item?.job?.salary ? Mask("amount", item.job.salary) : "Salário não informado"}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item?.job?.model ? item.job.model : "Modelo não informado"}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item?.job?.locality ? item.job.locality : "Localidade não informada"}
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

// Card People
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

  return (

    <View style={styles.cardWrapper}>
      <PeopleInformation
        handleSwipeRight={onSwipeRight}
        visible={visible}
        setVisible={setVisible}
        peopleData={item?.announcement?.announcement}
      />
      <Swipeable
        key={item.id}
        onSwipeableOpen={(direction) => {
          if (direction === "left") {
            onSwipeRight(item?.announcement?.announcement.id);
          }
        }}
        // renderRightActions={renderRightActions}
        renderRightActions={()=> null}
        renderLeftActions={renderLeftActions} // <- necessário para permitir o swipe à direita
      >
        <TouchableOpacity
          className="px-4 py-2 bg-white border-b border-zinc-300 rounded-lg flex-row items-center justify-between"
          style={styles.card}
          onPress={() => setVisible(true)}
        >
          <View className="flex-row items-center flex-1">
            <View className="mr-3" style={{ position: "relative" }}>
              {item?.announcement?.announcement.CPF_Creator?.collaborator?.picture ? (
                <Image
                  source={{ uri: item?.announcement.announcement.CPF_Creator.collaborator.picture }}
                  style={{ width: rf(43), height: rf(43) }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="rounded-full bg-zinc-100 items-center justify-center p-3 w-12 h-12">
                  <UserRound size={rf(25)} />
                </View>
              )}

              {/* {item?.isVerified && (
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
              )} */}
            </View>
            <View className="pr-2">
              <Text
                style={{ ...FONTS.font, fontSize: rf(12) }}
                numberOfLines={1}
                ellipsizeMode="tail"
                className="capitalize"
              >
                {item?.announcement?.announcement?.title ? item?.announcement?.announcement?.title : "Sem título"}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-green-600"
              >
                {item?.announcement?.announcement?.salary && `${Mask("amount", item.announcement.announcement.salary)}`} {item?.announcement?.announcement?.typePayment ? item.announcement.announcement.typePayment : "Pagamento não informado"}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item?.announcement?.announcement?.category ? item.announcement.announcement.category : "Sem categoria"}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                anunciado {Mask("dateFormatBrazil", item?.announcement?.announcement?.create_at)}
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

export default function CathoStyleCards({
  data,
  setCards,
  collaborator,
  showPopupMessage,
}: any) {
  // const [cards, setCards] = useState<any>(data);
  const navigation = useNavigation();

  const removeCard = (id: any) => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  console.log('removendo card com id:', id);

  setCards((prev: any[]) =>
    prev.filter((item: any) => {
      const itemId = item?.service === "fix" ? item?.job?.id : item?.announcement?.announcement?.id;
      return itemId !== id;
    })
  );
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
      console.log("Error applying for job: ", error);
      showPopupMessage("Erro ao aplicar para a vaga!");
    }
  };

  const handleSwipeRightPeople = async (id: any) => {
    if (!collaborator) {
      showPopupMessage("Você precisa estar logado para aplicar!");
      return;
    }
    const response = await Apply(id, collaborator.CPF);
    if (response.status === 200) {
      removeCard(id);
      showPopupMessage("Você aplicou ao serviço com sucesso!");
    } else if (response.status === 400) {
      removeCard(id);
      showPopupMessage("Você já aplicou para esse serviço!");
    } else {
      showPopupMessage("Erro ao aplicar para o serviço!");
    }
  };

  const navigateToCardInformation = ({ data }: any) => {
    navigation.navigate("CardInformation", {
      cardData: data,
      onSwipeLeft: () => handleSwipeRight(data.id),
    });
  };

  const navigateToCardInformationPeople = ({ data }: any) => {
    navigation.navigate("CardInformationPeople", {
      cardData: data,
      onSwipeLeft: () => handleSwipeRight(data.id),
    });
  };

  const renderItem = useCallback(({ item }: any) => {
    return item.service === "fix" ? (
      <SwipeableCardCompany
        navigateToCardInformation={() =>
          navigateToCardInformation({ data: item })
        }
        item={item}
        handleSwipeRight={() => handleSwipeRight(item.job.id)}
        onSwipeRight={handleSwipeRight}
      />
    ) : (
      <SwipeableCardPeople
        navigateToCardInformation={() =>
          navigateToCardInformationPeople({ data: item })
        }
        item={item}
        handleSwipeRight={() => handleSwipeRightPeople(item.id)}
        onSwipeRight={handleSwipeRightPeople}
      />
    );
  }, []);

  return (
    <View style={styles.container} className="px-4 py-2">
      {Array.isArray(data) && data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyExtractor={(item) => item?.service === "fix" ? item.job.id : item?.service === "fix" ? item?.announcement?.announcement?.id : item.id}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
          removeClippedSubviews={true}
        />
      ) : (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <Text style={{ fontSize: rf(16), color: "gray" }}>
            Nenhum trabalho ou serviço encontrado.
          </Text>
        </View>
      )}
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
