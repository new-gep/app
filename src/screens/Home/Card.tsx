import React, { useLayoutEffect } from "react";
import { Dimensions, Image, View, Text, Alert } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { runOnJS } from "react-native-reanimated";
import Tabs from "./Tabs";
import { AbstractPicture } from "../../constants/abstract";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.6; // 60% da largura da tela
const MAX_ROTATION_ANGLE = 8;

const Card = ({ data, onSwipe, isTopCard, zIndex }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  // Função para quando o card for deslizado para a direita (like)
  const handleLike = () => {
    Alert.alert("Like", `Você curtiu a vaga: ${data.function}`);
  };

  // Função para quando o card for deslizado para a esquerda (dislike)
  const handleDislike = () => {
    Alert.alert("Dislike", `Você não curtiu a vaga: ${data.function}`);
  };

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      if (isTopCard) {
        translateX.value = 0;
        translateY.value = 0;
        rotate.value = 0;
      }
    });
  }, [isTopCard]);

  const gesture = Gesture.Pan()
    .enabled(isTopCard)
    .onUpdate(({ translationX }) => {
      translateX.value = translationX;
      rotate.value = (translationX / width) * MAX_ROTATION_ANGLE;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction = translateX.value > 0 ? 1 : -1;
        if (direction === 1) {
          runOnJS(handleLike)(); // Chama a função "like"
        } else {
          runOnJS(handleDislike)(); // Chama a função "dislike"
        }
        translateX.value = withSpring(
          direction * width * 1.5,
          { damping: 15, stiffness: 120 },
          () => {
            runOnJS(onSwipe)();
          }
        );
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 120 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
        rotate.value = withSpring(0, { damping: 15, stiffness: 120 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    //@ts-ignore
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotateZ: `${rotate.value}deg` },
    ],
    zIndex: isTopCard ? 10 : zIndex,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    opacity: isTopCard ? 1 : 0.99,
  }));

  const likeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1]);
    const scale = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0.8, 1.5]);

    return {
      position: "absolute",
      top: 80,
      left: 30,
      opacity,
      zIndex: 1000,
      transform: [{ scale }],
    };
  });

  const nopeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, -SWIPE_THRESHOLD],
      [0, 1]
    );
    const scale = interpolate(translateX.value, [0, -SWIPE_THRESHOLD], [0.8, 1.5]);

    return {
      position: "absolute",
      top: 80,
      right: 30,
      opacity,
      zIndex: 1000,
      transform: [{ scale }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className="absolute w-full h-[80%] rounded-3xl bg-dark shadow-lg"
        style={[animatedStyle, { overflow: "visible" }]}
      >
        {/* Textos "LIKE" e "NOPE" */}
        <View style={{ position: "relative", flex: 1 }}>
          <Animated.Text
            style={[
              likeStyle,
              {
                fontSize: 32,
                fontWeight: "bold",
                color: "#4CAF50", // Verde
                paddingHorizontal: 10,
              },
            ]}
          >
            LIKE
          </Animated.Text>

          <Animated.Text
            style={[
              nopeStyle,
              {
                fontSize: 32,
                fontWeight: "bold",
                color: "#FF5252", // Vermelho
                paddingHorizontal: 10,
              },
            ]}
          >
            NOPE
          </Animated.Text>
        </View>

        <View className="p-4 justify-between flex-row">
          <Text className="text-white text-lg font-semibold">
            {data.function}
          </Text>
          <FontAwesome name="wheelchair-alt" size={24} color="white" />
        </View>

        <Image
          source={AbstractPicture[data.image]}
          resizeMode="contain"
          className="w-full h-[50%] self-center"
        />
        <View className="p-4 justify-end">
          <Tabs data={data} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default Card;
