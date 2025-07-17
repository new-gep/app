import {
  Building2,
  ChevronRight,
  EllipsisVertical,
  UserRound,
  Building,
  Wrench,
  BookOpen,
  House,
  Monitor,
  Scissors,
  Hammer,
  HeartPulse,
  Shirt,
  GraduationCap,
  CarFront,
  Handshake,
  MonitorSmartphone,
  PartyPopper,
  BadgeCheck,
  Trash,
  CheckCheck,
  Check,
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
  Image,
  UIManager,
} from "react-native";
import { FONTS } from "~/src/constants/theme";
import ApplyJob from "~/src/hooks/update/job/applyJob";
import { rf } from "~/src/hooks/utils/responsiveFont";
import Mask from "~/src/function/mask";
import { useNavigation } from "@react-navigation/native";
import PeopleInformation from "./Modal/PeopleInformation";
import { Swipeable } from "react-native-gesture-handler";

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
  id
}: any) {
  const [visible, setVisible] = useState<boolean>(false);

  const iconMap: Record<string, JSX.Element> = {
    assistance: <Wrench className="text-zinc-500 mr-1" size={rf(14)} />,
    school: <GraduationCap className="text-zinc-500 mr-1" size={rf(14)} />,
    auto: <CarFront className="text-zinc-500 mr-1" size={rf(14)} />,
    consultancy: <Handshake className="text-zinc-500 mr-1" size={rf(14)} />,
    designTec: (
      <MonitorSmartphone className="text-zinc-500 mr-1" size={rf(14)} />
    ),
    event: <PartyPopper className="text-zinc-500 mr-1" size={rf(14)} />,
    fashion: <Shirt className="text-zinc-500 mr-1" size={rf(14)} />,
    reform: <Hammer className="text-zinc-500 mr-1" size={rf(14)} />,
    health: <HeartPulse className="text-zinc-500 mr-1" size={rf(14)} />,
    domestics: <House className="text-zinc-500 mr-1" size={rf(14)} />,
  };

  const renderIconFromCategoryMap = (categoryObject: Record<string, any>) => {
    if (!categoryObject || typeof categoryObject !== "object") return null;

    return Object.keys(categoryObject).map((key, index) => {
      return (
        <React.Fragment key={index}>
          {iconMap[key] ?? (
            <Building className="text-zinc-500 mr-1" size={rf(14)} />
          )}
        </React.Fragment>
      );
    });
  };

  const renderRightActions = (
    id: number,
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <View className="flex-row">
        <TouchableOpacity
          className="w-20  justify-center items-center"
          onPress={() => {
            setVisible(true);
          }}
        >
          <EllipsisVertical className="text-dark" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = (
    id: number,
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <View className="flex-row">
        <TouchableOpacity
          // onPress={() => handleDelete(id)}
          className="w-20 bg-red-500 justify-center items-center"
        >
          <Trash color="#fff" size={24} />
          {/* <Text className="text-white mt-1 text-sm">Apagar</Text> */}
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <>
      <PeopleInformation
        handleSwipeRight={onSwipeRight}
        visible={visible}
        setVisible={setVisible}
        peopleData={{...item, isCandidate:true, id: id}}
      />
      <Swipeable
        key={item.id}
        renderRightActions={(progress) => renderRightActions(item.id, progress)}
        leftThreshold={0}
      >
        <View>
          <TouchableOpacity
            className="px-4 py-2 bg-white border-b border-zinc-300 flex-row items-center justify-between"
            style={styles.card}
            onPress={()=>setVisible(true)}
          >
            <View className="flex-row items-center flex-1">
              <View className="mr-3" style={{ position: "relative" }}>
                {item.picture ? (
                  <Image
                    source={{ uri: item.picture }}
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
                    className="rounded-full bg-primary items-center justify-center"
                  >
                    <Check className="text-dark" size={rf(10)} />
                  </View>
                )}
              </View>

              <View className="pr-2">
                <View className="flex-row items-center ">
                  <Text
                    style={{ ...FONTS.font, fontSize: rf(12) }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.collaborator &&
                      Mask("fullName", item.collaborator.name)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    maxWidth: SCREEN_WIDTH * 0.4,
                  }}
                >
                  {item.collaborator &&
                    renderIconFromCategoryMap(item.collaborator.service)}
                </View>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className="text-zinc-500"
                >
                  {item.collaborator &&
                    item.collaborator.howWork.contract?.join(", ")}
                </Text>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className="text-zinc-500"
                >
                  {item.collaborator &&
                    `${item.collaborator.city}, ${item.collaborator.uf}`}
                </Text>
              </View>
            </View>

            {/* Se quiser o ícone de seta de volta: */}
            <View>
              <ChevronRight size={rf(20)} />
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    </>
  );
});

export default function 
CardPeople({
  data,
  setCards,
  collaborator,
  showPopupMessage,
  id
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
          item={item.collaborator}
          id={id}
          isMenuVisible={visibleMenuIds.includes(item.id)}
          setMenuVisible={setMenuVisible}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      );
    },
    [visibleMenuIds]
  );

  return (
    <View style={styles.container} className="px-4 py-2">
      <FlatList
        data={data}
        renderItem={renderItem}
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
  tag: {
    backgroundColor: "#fde047",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
    color: "black",
  },
});
