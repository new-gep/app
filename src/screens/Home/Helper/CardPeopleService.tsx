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
  id,
  isCandidate,
  reload,
  setReload,
  distance
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

  const hasAnyService = (serviceObj:any) => {
    if (!serviceObj || typeof serviceObj !== "object") return false;

    // Percorre todas as chaves de nível 1
    return Object.values(serviceObj).some((sub) => {
      // Se for outro objeto, percorre os valores dele também
      if (typeof sub === "object" && !Array.isArray(sub)) {
        return sub && Object.values(sub).some(
          (arr) => Array.isArray(arr) && arr.length > 0
        );
      }

      // Se for um array direto (pouco provável nesse caso), verifica o tamanho
      return Array.isArray(sub) && sub.length > 0;
    });
  };

  return (
    <>
      <PeopleInformation
        handleSwipeRight={onSwipeRight}
        visible={visible}
        setVisible={setVisible}
        setReload={setReload}
        reload={reload}
        distance={distance}
        peopleData={{ ...item, isCandidate: isCandidate, id: id }}
      />
      <Swipeable
        key={item?.id}
        // renderRightActions={(progress) => renderRightActions(item?.id, progress)}
        renderRightActions={() => null}
        leftThreshold={0}
      >
        <View>
          <TouchableOpacity
            className="py-2 bg-white border-b border-zinc-300 flex-row items-center justify-between"
            style={styles.card}
            onPress={() => setVisible(true)}
          >
            <View className="flex-row items-center flex-1">
              <View className="mr-3" style={{ position: "relative" }}>
                {item?.picture ? (
                  <Image
                    source={{ uri: item.picture }}
                    style={{ width: rf(43), height: rf(43) }}
                    className="w-12 h-12 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="rounded-full bg-zinc-100 items-center justify-center p-2">
                    <UserRound size={rf(20)} />
                  </View>
                )}

                {item?.isVerified && (
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
                    {item?.collaborator &&
                      Mask("fullName", item?.collaborator.name)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    maxWidth: SCREEN_WIDTH * 0.4,
                  }}
                >
                  {item?.collaborator &&
                  hasAnyService(item?.collaborator?.service) ? (
                    renderIconFromCategoryMap(item?.collaborator.service)
                  ) : (
                    <Text style={{ ...FONTS.fontBlack, fontSize: rf(10) }}>
                      Sem especialização definida
                    </Text>
                  )}
                </View>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className="text-zinc-500 w-9/12"
                >
                  {item?.collaborator &&
                  item?.collaborator?.howWork?.contract?.length > 0 ? (
                      item?.collaborator?.howWork?.contract?.join(", ")
                  ) : (
                    <Text
                      style={{ ...FONTS.fontBlack, fontSize: rf(10) }}
                    >
                      Sem preferencia de contrato
                    </Text>
                  )}
                </Text>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className="text-zinc-500"
                >
                  {item?.collaborator?.city && item?.collaborator?.uf ?
                    `${item?.collaborator.city}, ${item?.collaborator.uf}` : 'Endereço não cadastrado'}
                </Text>
                { distance &&
                  <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className="text-zinc-500"
                >
                  {distance?.distance? 
                    `${distance?.distance}` : 'Não disponível'}
                </Text>
                }
              </View>
            </View>

            {/* Se quiser o ícone de seta de volta: */}
            <View className="mr-10">
              <ChevronRight size={rf(20)} />
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    </>
  );
});

export default function CardPeople({
  data,
  setCards,
  collaborator,
  showPopupMessage,
  id,
  isCandidate,
  setReload,
  reload
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
    setCards((prev: any) => prev.filter((item: any) => item?.id !== id));
  };

  const handleSwipeLeft = () => {
    showPopupMessage("Opção Menu selecionada!");
  };

  const handleSwipeRight = async (id: any) => {
    console.log("aqui");
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
          item={item?.collaborator}
          distance={item?.distanceInfo}
          id={id}
          isCandidate={isCandidate}
          reload={reload} 
          setReload={setReload}
          isMenuVisible={visibleMenuIds.includes(item?.id)}
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
      {Array.isArray(data) && data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
          removeClippedSubviews={true}
        />
      ) : (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <Text style={{ fontSize: rf(16), color: "gray" }}>
            Nenhuma pessoa encontrada.
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
