import React from "react";
import { Dimensions, Image, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { runOnJS } from "react-native-reanimated";
import Tabs from "./Tabs";
import { AbstractPicture } from "../../constants/abstract";

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.55;
const MAX_ROTATION_ANGLE = 8; // Ângulo de rotação sutil
const MAX_VERTICAL_TRANSLATION = height * 0.1; // Movimento vertical limitado

const Card = ({ data, onSwipe, isTopCard }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const gesture = Gesture.Pan()
    .enabled(isTopCard) // O card só é arrastável se for o topo
    .onUpdate(({ translationX, translationY }) => {
      translateX.value = translationX;
      translateY.value = Math.min(
        Math.max(translationY, -MAX_VERTICAL_TRANSLATION),
        MAX_VERTICAL_TRANSLATION
      );
      rotate.value = (translationX / width) * MAX_ROTATION_ANGLE;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction = translateX.value > 0 ? 1 : -1;
        translateX.value = withSpring(
          direction * width * 1.5, // Move completamente o card para fora da tela
          { damping: 15, stiffness: 120 },
          () => {
            runOnJS(onSwipe)(); // Chama a função de swipe do pai para remover o card
          }
        );
      } else {
        // Volta o card ao centro se não ultrapassar o limite
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
    zIndex: isTopCard ? 1 : 0,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
  className="absolute w-full h-[80%] rounded-3xl bg-dark shadow-lg overflow-hidden"
  style={animatedStyle}
>
  <Image
    source={AbstractPicture[data.image]}
    resizeMode="contain"
    className="w-full h-[50%] self-center"
  />
  <View className="p-4 justify-end">
    <Tabs
      companyName={data.companyName}
      image={data.image}
      position={data.position}
      time={data.time}
      contract={data.contract}
    />
  </View>
</Animated.View>
    </GestureDetector>
  );
};

export default Card;
