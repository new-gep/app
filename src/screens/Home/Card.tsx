import React from "react";
import { Dimensions, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { runOnJS } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.55; // 80% da largura da tela
const MAX_VERTICAL_TRANSLATION = height * 0.2; // Limite da translação vertical
const MAX_ROTATION_ANGLE = 10; // Ângulo máximo de rotação

const Card = ({ data, onSwipe }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0); // Variável para controlar a rotação

  const gesture = Gesture.Pan()
  .onUpdate(({ translationX, translationY }) => {
    translateX.value = translationX;

    // Permite movimento vertical, mas ignora para rotação
    translateY.value = translationY;

    // Rotação proporcional e simétrica para os dois lados
    rotate.value = (translationX / width) * MAX_ROTATION_ANGLE;
  })
  .onEnd(() => {
    if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
      // Swipe horizontal
      translateX.value = withSpring(
        translateX.value > 0 ? width : -width,
        {},
        () => {
          runOnJS(onSwipe)();
        }
      );
    } else {
      // Voltar à posição inicial
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      rotate.value = withSpring(0); // Retorna a rotação para 0
    }
  });


  const animatedStyle = useAnimatedStyle(() => ({
    //@ts-ignore
    transform: [
      { translateX: translateX.value },
      {
        translateY: Math.min(
          Math.max(translateY.value, -MAX_VERTICAL_TRANSLATION),
          MAX_VERTICAL_TRANSLATION
        ),
      },
      { rotateZ: `${rotate.value}deg` }, // Aplica a rotação apenas na horizontal
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        className="absolute w-full h-3/4 rounded-lg bg-gray-300 justify-center items-center"
        style={animatedStyle}
      >
        <Text className="text-xl font-bold">{data.title}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default Card;
