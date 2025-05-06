import React, { useLayoutEffect } from "react";
import { Dimensions, Image, View, Text, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import { runOnJS } from "react-native-reanimated";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
//@ts-ignore
import Logo from "../../assets/picture/logo/logo_black.png";

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

const Card: React.FC<CardProps> = ({ data, onSwipeLeft, onSwipeRight, onSuperLike, handleUndo, isTopCard, zIndex, index }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1 - index * 0.02);
  const likeOpacity = useSharedValue(0);
  const nopeOpacity = useSharedValue(0);
  const superLikeOpacity = useSharedValue(0);
  const isAnimating = useSharedValue(false); // Flag para bloquear interações durante animação
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (isTopCard) {
      translateX.value = 0;
      translateY.value = 0;
      rotate.value = 0;
      scale.value = 1;
      likeOpacity.value = 0;
      nopeOpacity.value = 0;
      superLikeOpacity.value = 0;
      isAnimating.value = false;
    } else {
      translateY.value = index * 8;
      scale.value = 1 - index * 0.02;
    }
  }, [isTopCard, index]);

  const gesture = Gesture.Pan()
    .enabled(isTopCard && !isAnimating.value)
    .onUpdate(({ translationX, translationY }) => {
      if (isAnimating.value) return;
      translateX.value = translationX;
      translateY.value = translationY;
      rotate.value = (translationX / width) * MAX_ROTATION_ANGLE;

      likeOpacity.value = interpolate(translationX, [0, SWIPE_THRESHOLD_X], [0, 1]);
      nopeOpacity.value = interpolate(translationX, [0, -SWIPE_THRESHOLD_X], [0, 1]);
      superLikeOpacity.value = interpolate(translationY, [0, -SWIPE_THRESHOLD_Y], [0, 1]);
    })
    .onEnd(({ translationX, translationY, velocityX, velocityY }) => {
      if (isAnimating.value) return;
      isAnimating.value = true;

      if (Math.abs(translationX) > SWIPE_THRESHOLD_X || Math.abs(velocityX) > 600) {
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
        translateY.value = withSpring(index * 8, { damping: 30, stiffness: 180 });
        rotate.value = withSpring(0, { damping: 30, stiffness: 180 });
        scale.value = withSpring(1 - index * 0.02, { damping: 30, stiffness: 180 });
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
      if (isAnimating.value) return;
      if (Math.abs(translateX.value) < 5 && Math.abs(translateY.value) < 5) {
        runOnJS(() => navigation.navigate("CardInformation", { cardData: data }))();
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
    position: "absolute",
  }));

  const likeStyle = useAnimatedStyle(() => ({
    opacity: likeOpacity.value,
    transform: [
      { scale: interpolate(likeOpacity.value, [0, 1], [0.8, 1.4]) },
      { rotate: "-20deg" },
    ],
    position: "absolute",
    top: 60,
    left: 40,
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: nopeOpacity.value,
    transform: [
      { scale: interpolate(nopeOpacity.value, [0, 1], [0.8, 1.4]) },
      { rotate: "20deg" },
    ],
    position: "absolute",
    top: 60,
    right: 40,
  }));

  const superLikeStyle = useAnimatedStyle(() => ({
    opacity: superLikeOpacity.value,
    transform: [{ scale: interpolate(superLikeOpacity.value, [0, 1], [0.8, 1.4]) }],
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
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

  const handleButtonPress = (action: "like" | "nope" | "superLike" | "undo") => {
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

  return (
    <View className="w-full h-full">
      <GestureDetector gesture={composedGestures}>
        <Animated.View
          className="w-[94%] rounded-3xl shadow-lg"
          style={[
            animatedStyle,
            {
              height: height * 0.9,
              marginHorizontal: width * 0.03,
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
          <LinearGradient
            colors={["#FFFFFF", "#E5E7EB"]}
            style={{ flex: 1, borderRadius: 24 }}
          >
            {/* Textos de feedback */}
            <Animated.Text
              style={[
                likeStyle,
                { fontSize: 52, fontWeight: "800", color: "#34C759", textTransform: "uppercase" },
              ]}
              accessibilityLabel="Like"
            >
              LIKE
            </Animated.Text>
            <Animated.Text
              style={{
                ...nopeStyle,
                fontSize: 52,
                fontWeight: "800",
                color: "#FF3B30",
                textTransform: "uppercase",
              }}
              accessibilityLabel="Nope"
            >
              NOPE
            </Animated.Text>
            <Animated.Text
              style={[
                superLikeStyle,
                { fontSize: 52, fontWeight: "800", color: "#5856D6", textTransform: "uppercase" },
              ]}
              accessibilityLabel="Super Like"
            >
              SUPER LIKE
            </Animated.Text>

            {/* Imagem da vaga */}
            <Image
              source={Logo}
              resizeMode="cover"
              style={{
                width: "100%",
                height: "65%",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              }}
            />

            {/* Informações principais */}
            <View className="p-6 space-y-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-3">
                  <Text className="text-3xl font-bold capitalize">{data.function}</Text>
                  <Text className="text-base text-gray-600 uppercase mt-1">
                    {data.company?.company_name || "Empresa confidencial"}
                  </Text>
                </View>
                {data.PCD === "1" && <FontAwesome name="wheelchair-alt" size={28} color="#1F2A44" />}
              </View>

              <Text className="text-gray-500 text-lg">
                {data.company.city && data.company.uf
                  ? `${data.company.city} - ${data.company.uf}`
                  : "Home Office"}
              </Text>

              <Text className="text-gray-900 text-xl font-semibold">
                {data.salary ? `R$ ${data.salary} por mês` : "R$ 8.000 por mês"}
              </Text>

              <Text className="text-gray-400 text-base">
                Publicado há {calculateDaysAgo(data.create_at)} dias
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>

      {/* Botões */}
      {isTopCard && (
        <View className="absolute bottom-8 z-50 flex-row justify-around items-center w-full px-6">
          <TouchableOpacity
            onPress={() => handleButtonPress("undo")}
            style={{
              padding: 16,
              borderRadius: 9999,
              backgroundColor: "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
            }}
            accessibilityLabel="Undo"
          >
            <MaterialIcons name="replay" size={32} color="#FFC107" />
          </TouchableOpacity>

          <Animated.View
            style={[
              nopeButtonStyle,
              {
                padding: 16,
                borderRadius: 9999,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              },
            ]}
          >
            <TouchableOpacity onPress={() => handleButtonPress("nope")} accessibilityLabel="Nope">
              <FontAwesome name="times" size={32} color="#FF5252" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              superLikeButtonStyle,
              {
                padding: 16,
                borderRadius: 9999,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              },
            ]}
          >
            <TouchableOpacity onPress={() => handleButtonPress("superLike")} accessibilityLabel="Super Like">
              <FontAwesome name="star" size={32} color="#5856D6" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              likeButtonStyle,
              {
                padding: 16,
                borderRadius: 9999,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              },
            ]}
          >
            <TouchableOpacity onPress={() => handleButtonPress("like")} accessibilityLabel="Like">
              <FontAwesome name="heart" size={32} color="#4CAF50" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
};

export default Card;