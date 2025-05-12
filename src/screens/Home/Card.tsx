import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { Dimensions, Image, View, Text, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

//@ts-ignore
import Logo from "../../assets/picture/logo/logo_black.png";
import Mask from "~/src/function/mask";
import { FONTS } from "~/src/constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD_X = width * 0.3;
const SWIPE_THRESHOLD_Y = height * 0.15;
const MAX_ROTATION_ANGLE = 12;

const calculateDaysAgo = (createDate: string) => {
  const created = new Date(createDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

interface CardProps {
  data: any;
  onSwipeLeft: any;
  onSwipeRight: (id: string) => void;
  onSuperLike: any;
  handleUndo: any;
  isTopCard: boolean;
  zIndex: number;
  index: number;
}

const Card: React.FC<CardProps> = React.memo(
  ({
    data,
    onSwipeLeft,
    onSwipeRight,
    onSuperLike,
    handleUndo,
    isTopCard,
    zIndex,
    index,
  }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);
    const scale = useSharedValue(1 - index * 0.02);
    const likeOpacity = useSharedValue(0);
    const nopeOpacity = useSharedValue(0);
    const superLikeOpacity = useSharedValue(0);
    const isAnimating = useSharedValue(false);
    const navigation = useNavigation();

    useLayoutEffect(() => {
      if (isTopCard) {
        translateX.value = withTiming(0, { duration: 300 });
        translateY.value = withTiming(0, { duration: 300 });
        rotate.value = withTiming(0, { duration: 300 });
        scale.value = withTiming(1, { duration: 300 });
        likeOpacity.value = withTiming(0, { duration: 300 });
        nopeOpacity.value = withTiming(0, { duration: 300 });
        superLikeOpacity.value = withTiming(0, { duration: 300 });
        isAnimating.value = false;
      } else {
        translateY.value = withTiming(index * 9, { duration: 200 }); // Mover o card de baixo
        scale.value = withTiming(1 - index * 0.02, { duration: 200 });
      }
    }, [isTopCard, index]);

    const navigateToCardInformation = () => {
      navigation.navigate("CardInformation", { cardData: data });
    };

    const gesture = Gesture.Pan()
      .enabled(isTopCard && !isAnimating.value)
      .onUpdate(({ translationX, translationY }) => {
        if (isAnimating.value) return;
        translateX.value = translationX;
        translateY.value = translationY;
        rotate.value = (translationX / width) * MAX_ROTATION_ANGLE;

        likeOpacity.value = interpolate(
          translationX,
          [0, SWIPE_THRESHOLD_X],
          [0, 1]
        );
        nopeOpacity.value = interpolate(
          translationX,
          [0, -SWIPE_THRESHOLD_X],
          [0, 1]
        );
        superLikeOpacity.value = interpolate(
          translationY,
          [0, -SWIPE_THRESHOLD_Y],
          [0, 1]
        );
      })
      .onEnd(({ translationX, translationY, velocityX, velocityY }) => {
        if (isAnimating.value) return;
        isAnimating.value = true;

        if (
          Math.abs(translationX) > SWIPE_THRESHOLD_X ||
          Math.abs(velocityX) > 600
        ) {
          const direction = translationX > 0 ? 1 : -1;
          translateX.value = withSpring(
            direction * width * 2,
            { damping: 30, stiffness: 180, velocity: velocityX },
            () => {
              if (direction === 1) {
                runOnJS(onSwipeRight)(data.id);
              } else {
                runOnJS(onSwipeLeft)();
              }
              isAnimating.value = false;
            }
          );
          translateY.value = withSpring(0, { damping: 30, stiffness: 180 });
        } else if (translationY < -SWIPE_THRESHOLD_Y || velocityY < -600) {
          translateY.value = withSpring(
            -height * 2,
            { damping: 30, stiffness: 180, velocity: velocityY },
            () => {
              runOnJS(onSuperLike)(data.id);
              isAnimating.value = false;
            }
          );
          translateX.value = withSpring(0, { damping: 30, stiffness: 180 });
        } else {
          translateX.value = withSpring(0, { damping: 30, stiffness: 180 });
          translateY.value = withSpring(index * 8, {
            damping: 30,
            stiffness: 180,
          });
          rotate.value = withSpring(0, { damping: 30, stiffness: 180 });
          scale.value = withSpring(1 - index * 0.02, {
            damping: 30,
            stiffness: 180,
          });
          likeOpacity.value = withSpring(0);
          nopeOpacity.value = withSpring(0);
          superLikeOpacity.value = withSpring(0);
          isAnimating.value = false;
        }
      });

    const singleTap = Gesture.Tap()
      .enabled(isTopCard && !isAnimating.value)
      .maxDuration(250)
      .onEnd(() => {
        try {
          console.log("aquii");
          if (!navigation) {
            console.error("Navigation não está definido");
            return;
          }
          if (isAnimating.value) return;
          if (
            Math.abs(translateX.value) < 5 &&
            Math.abs(translateY.value) < 5
          ) {
            runOnJS(navigateToCardInformation)();
          }
        } catch (e) {
          console.log(e);
        }
      });

    const composedGestures = Gesture.Simultaneous(gesture, singleTap);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotate.value}deg` },
      ],
      zIndex: zIndex,
      position: "relative", // Alterado de "absolute" para "relative"
      marginTop: index * 10, // Ajuste dinâmico para evitar sobreposição
    }));

    const likeStyle = useAnimatedStyle(() => ({
      opacity: likeOpacity.value,
      transform: [
        { scale: interpolate(likeOpacity.value, [0, 1], [0.8, 1.2]) },
        { rotate: "-20deg" },
      ],
      position: "absolute",
      top: height * 0.45 + 20, // Abaixo da imagem (45% de altura + margem)
      left: 40,
      zIndex: 10, // Acima da imagem e gradiente
    }));

    const nopeStyle = useAnimatedStyle(() => ({
      opacity: nopeOpacity.value,
      transform: [
        { scale: interpolate(nopeOpacity.value, [0, 1], [0.8, 1.2]) },
        { rotate: "20deg" },
      ],
      position: "absolute",
      top: 60,
      right: 40,
      zIndex: 10,
    }));

    const superLikeStyle = useAnimatedStyle(() => ({
      opacity: superLikeOpacity.value,
      transform: [
        { scale: interpolate(superLikeOpacity.value, [0, 1], [0.8, 1.0]) },
      ],
      position: "absolute",
      bottom: 80, // Ajustado para não ser cortado
      alignSelf: "center",
      zIndex: 10,
    }));

    const likeButtonStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        translateX.value,
        [0, SWIPE_THRESHOLD_X],
        ["#FFFFFF", "#4CAF50"]
      ),
    }));

    const nopeButtonStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        translateX.value,
        [0, -SWIPE_THRESHOLD_X],
        ["#FFFFFF", "#FF5252"]
      ),
    }));

    const superLikeButtonStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        translateY.value,
        [0, -SWIPE_THRESHOLD_Y],
        ["#FFFFFF", "#5856D6"]
      ),
    }));

    const handleButtonPress = (
      action: "like" | "nope" | "superLike" | "undo"
    ) => {
      if (isAnimating.value) return;
      isAnimating.value = true;

      if (action === "like") {
        translateX.value = withSpring(
          width * 2,
          { damping: 30, stiffness: 180 },
          () => {
            runOnJS(onSwipeRight)(data.id);
            isAnimating.value = false;
          }
        );
        translateY.value = withSpring(0, { damping: 30, stiffness: 180 });
        likeOpacity.value = withSpring(1);
      } else if (action === "nope") {
        translateX.value = withSpring(
          -width * 2,
          { damping: 30, stiffness: 180 },
          () => {
            runOnJS(onSwipeLeft)();
            isAnimating.value = false;
          }
        );
        translateY.value = withSpring(0, { damping: 30, stiffness: 180 });
        nopeOpacity.value = withSpring(1);
      } else if (action === "superLike") {
        translateY.value = withSpring(
          -height * 2,
          { damping: 30, stiffness: 180 },
          () => {
            runOnJS(onSuperLike)(data.id);
            isAnimating.value = false;
          }
        );
        translateX.value = withSpring(0, { damping: 30, stiffness: 180 });
        superLikeOpacity.value = withSpring(1);
      } else if (action === "undo") {
        runOnJS(handleUndo)();
        isAnimating.value = false;
      }
    };

    // useEffect(()=>{
    //   console.log(data)
    // },[])

    const buttonSize = 60;

    return (
      <View
        style={{
          width: "100%",
          height: "40%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GestureDetector gesture={composedGestures}>
          <Animated.View
            style={[
              animatedStyle,
              {
                width: "94%",
                height: height * 0.6,
                marginHorizontal: width * 0.03,
                borderRadius: 24,
                alignSelf: "center",
                overflow: "hidden",
                borderWidth: isTopCard ? 1 : 0,
                borderColor: isTopCard ? "#D1D5DB" : "transparent",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 12,
              },
            ]}
          >
            <View
              // colors={["#FFFFFF", "#E5E7EB"]}
              style={{ flex: 1, borderRadius: 24 }}
              className="bg-white"
            >
              {/* Textos de feedback */}
              <Animated.Text
                style={[
                  likeStyle,
                  {
                    fontSize: 48, // Tamanho ajustado
                    fontWeight: "800",
                    color: "#34C759",
                    textTransform: "uppercase",
                  },
                ]}
                accessibilityLabel="Like"
              >
                LIKE
              </Animated.Text>

              <Animated.Text
                style={[
                  nopeStyle,
                  {
                    fontSize: 36, // Aumentado para maior visibilidade
                    fontWeight: "800",
                    color: "#FF3B30",
                    textTransform: "uppercase",
                  },
                ]}
                accessibilityLabel="Nope"
              >
                NOPE
              </Animated.Text>

              <Animated.Text
                style={[
                  superLikeStyle,
                  {
                    fontSize: 32, // Menor para não ser tão grande
                    fontWeight: "600",
                    color: "#5856D6",
                    textTransform: "uppercase",
                    opacity: 0.8, // Estilo "vazado"
                    textShadowColor: "rgba(0, 0, 0, 0.2)",
                    textShadowOffset: { width: 2, height: 2 },
                    textShadowRadius: 4,
                  },
                ]}
                accessibilityLabel="Super Like"
              >
                SUPER LIKE
              </Animated.Text>

              <View className="px-3 my-2">
                <View className="flex-row justify-between ">
                  <Text
                    className="font-bold text-xl"
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {data.function}
                  </Text>
                  <View className="flex-row gap-1">
                    {data.PCD === "1" && (
                      <FontAwesome6
                        style={{ marginRight: 3 }}
                        name="wheelchair-move"
                        size={25}
                        color="black"
                      />
                    )}
                    {data.DEI === "1" && (
                      <MaterialIcons name="interests" size={28} color="black" />
                    )}
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4B5563",
                    textTransform: "uppercase",
                  }}
                >
                  {data.company?.company_name || "Empresa confidencial"}
                </Text>
              </View>

              {/* Imagem da vaga */}
              <View className="items-center justify-center p-0 m-0">
                <Image
                  source={Logo}
                  resizeMode="cover"
                  style={{
                    width: "70%",
                    height: "60%",
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                  }}
                />
              </View>

              {/* Informações principais */}
              <View className="px-5">
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    {/* <Text
                      style={{
                        fontSize: 24,
                        textTransform: "capitalize",
                        ...FONTS.fontBold,
                      }}
                    >
                      {data.function}
                    </Text> */}
                    {/* <Text
                      style={{
                        fontSize: 14,
                        color: "#4B5563",
                        textTransform: "uppercase",
                      }}
                    >
                      {data.company?.company_name || "Empresa confidencial"}
                    </Text> */}
                  </View>
                  <View className="flex-row items-center gap-2"></View>
                </View>
                <View>
                  {data.DEI === "1" && (
                    // <View className="flex-row items-center gap-2">
                    //   {/* <MaterialIcons name="interests" size={20} color="black" /> */}
                    //   <Text style={{ fontSize: 14, ...FONTS.fontMedium }}>
                    //     Vaga Afirmativa
                    //   </Text>
                    // </View>
                    <></>
                  )}
                  {data.PCD === "1" && (
                    // <View className="flex-row items-center gap-2">
                    //   {/* <FontAwesome6
                    //     name="wheelchair-move"
                    //     size={24}
                    //     color="black"
                    //   /> */}
                    //   <Text style={{ fontSize: 14, ...FONTS.fontMedium }}>
                    //     Vaga PCD
                    //   </Text>
                    // </View>
                    <></>
                  )}
                  <View className="flex-row items-center gap-2">
                    {/* <FontAwesome6
                      name="map-location-dot"
                      size={20}
                      color="black"
                    /> */}
                    <Text className="text-sm text-gray-500 font-normal">
                      {data.locality && `${data.locality}`}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    {/* <FontAwesome6 name="money-bills" size={20} color="black" /> */}
                    <Text className="font-medium text-lg">
                      {data.salary && Mask("amount", data.salary)}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    {/* <FontAwesome6 name="laptop" size={20} color="black" /> */}
                    <Text className="text-gray-500 font-normal">
                      {data.model && `${data.model}`}
                    </Text>
                  </View>
                </View>

                {/* <Text style={{fontSize: 20, fontWeight: "600", color: "#111827", ...FONTS.fontMedium }}>
                {data.salary ? `${Mask("amount", data.salary)} por mês` : "A combinar"}
              </Text> */}

                <Text className="text-gray-500 mt-3">
                  Publicado há {calculateDaysAgo(data.create_at)} dias
                </Text>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>

        {/* Botões */}
        {isTopCard && (
          // <View
          //   style={{
          //     position: "absolute",
          //     bottom: 32,
          //     zIndex: 50,
          //     flexDirection: "row",
          //     justifyContent: "space-around",
          //     alignItems: "center",
          //     width: "100%",
          //     paddingHorizontal: 24,
          //   }}
          // >
          //   <TouchableOpacity
          //     onPress={() => handleButtonPress("undo")}
          //     style={{
          //       width: buttonSize,
          //       height: buttonSize,
          //       borderRadius: buttonSize / 2,
          //       backgroundColor: "#FFFFFF",
          //       shadowColor: "#000",
          //       shadowOffset: { width: 0, height: 2 },
          //       shadowOpacity: 0.2,
          //       shadowRadius: 4,
          //       elevation: 4,
          //       justifyContent: "center",
          //       alignItems: "center",
          //     }}
          //     accessibilityLabel="Undo"
          //   >
          //     <MaterialIcons name="replay" size={32} color="#FFC107" />
          //   </TouchableOpacity>

          //   <Animated.View
          //     style={[
          //       nopeButtonStyle,
          //       {
          //         width: buttonSize,
          //         height: buttonSize,
          //         borderRadius: buttonSize / 2,
          //         shadowColor: "#000",
          //         shadowOffset: { width: 0, height: 2 },
          //         shadowOpacity: 0.2,
          //         shadowRadius: 4,
          //         elevation: 4,
          //         justifyContent: "center",
          //         alignItems: "center",
          //       },
          //     ]}
          //   >
          //     <TouchableOpacity
          //       onPress={() => handleButtonPress("nope")}
          //       accessibilityLabel="Nope"
          //       style={{
          //         width: buttonSize,
          //         height: buttonSize,
          //         justifyContent: "center",
          //         alignItems: "center",
          //       }}
          //     >
          //       <FontAwesome name="times" size={32} color="#FF5252" />
          //     </TouchableOpacity>
          //   </Animated.View>

          //   <Animated.View
          //     style={[
          //       superLikeButtonStyle,
          //       {
          //         width: buttonSize,
          //         height: buttonSize,
          //         borderRadius: buttonSize / 2,
          //         shadowColor: "#000",
          //         shadowOffset: { width: 0, height: 2 },
          //         shadowOpacity: 0.2,
          //         shadowRadius: 4,
          //         elevation: 4,
          //         justifyContent: "center",
          //         alignItems: "center",
          //       },
          //     ]}
          //   >
          //     <TouchableOpacity
          //       onPress={() => handleButtonPress("superLike")}
          //       accessibilityLabel="Super Like"
          //       style={{
          //         width: buttonSize,
          //         height: buttonSize,
          //         justifyContent: "center",
          //         alignItems: "center",
          //       }}
          //     >
          //       <FontAwesome name="star" size={32} color="#5856D6" />
          //     </TouchableOpacity>
          //   </Animated.View>

          //   <Animated.View
          //     style={[
          //       likeButtonStyle,
          //       {
          //         width: buttonSize,
          //         height: buttonSize,
          //         borderRadius: buttonSize / 2,
          //         shadowColor: "#000",
          //         shadowOffset: { width: 0, height: 2 },
          //         shadowOpacity: 0.2,
          //         shadowRadius: 4,
          //         elevation: 4,
          //         justifyContent: "center",
          //         alignItems: "center",
          //       },
          //     ]}
          //   >
          //     <TouchableOpacity
          //       onPress={() => handleButtonPress("like")}
          //       accessibilityLabel="Like"
          //       style={{
          //         width: buttonSize,
          //         height: buttonSize,
          //         justifyContent: "center",
          //         alignItems: "center",
          //       }}
          //     >
          //       <FontAwesome name="heart" size={32} color="#4CAF50" />
          //     </TouchableOpacity>
          //   </Animated.View>
          // </View>

          <></>
        )}
      </View>
    );
  }
);

export default React.memo(Card);
