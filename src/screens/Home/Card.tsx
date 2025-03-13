import React, { useLayoutEffect } from "react";
import { Dimensions, Image, View, Text, ScrollView } from "react-native";
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
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.6;
const MAX_ROTATION_ANGLE = 8;

const Card = ({
  data,
  onSwipeLeft,
  onSwipeRight,
  isTopCard,
  zIndex,
  index,
}) => {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const translateY = useSharedValue(-index * 35); // Empilhamento negativo para sobreposição superior
  const scale = useSharedValue(1 - index * 0.07); // Maior redução de escala
  const navigation = useNavigation();

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      if (isTopCard) {
        translateX.value = 0;
        rotate.value = 0;
        translateY.value = 0; // Reset para posição original quando for o card principal
        scale.value = 1;
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
        translateX.value = withSpring(
          direction * width * 1.5,
          { damping: 15, stiffness: 120 },
          () => {
            if (direction === 1) {
              runOnJS(onSwipeRight)(data.id); // Swipe para a direita (Like)
            } else {
              runOnJS(onSwipeLeft)(); // Swipe para a esquerda (Dislike)
            }
          }
        );
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 120 });
        rotate.value = withSpring(0, { damping: 15, stiffness: 120 });
      }
    });

  const singleTap = Gesture.Tap()
    .enabled(isTopCard)
    .onEnd(() => {
      if (isTopCard) {
        runOnJS(navigation.navigate)('CardInformation', { cardData: data });
      }
    });

  const composedGestures = Gesture.Simultaneous(gesture, singleTap);

  const animatedStyle = useAnimatedStyle(() => ({
    //@ts-ignore
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotate.value}deg` }
    ],
    zIndex: zIndex,
    position: "absolute",
  }));

  const likeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1]);
    const scale = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0.8, 1.5]
    );

    return {
      position: "absolute",
      top: 40,
      left: 20,
      opacity,
      transform: [{ scale }],
    };
  });

  const nopeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, -SWIPE_THRESHOLD],
      [0, 1]
    );
    const scale = interpolate(
      translateX.value,
      [0, -SWIPE_THRESHOLD],
      [0.8, 1.5]
    );

    return {
      position: "absolute",
      top: 40,
      right: 20,
      opacity,
      transform: [{ scale }],
    };
  });

  const cardStyle = useAnimatedStyle(() => ({
    //@ts-ignore
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotate.value}deg` },
    ],
    zIndex: zIndex,
    position: "absolute",
  }));

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.View
        className="w-full rounded-3xl bg-white shadow-lg"
        style={[
          animatedStyle,
          {
            height: Dimensions.get('window').height * 0.5,
            opacity: 1 - index * 0.15, // Camadas progressivamente transparentes
            overflow: "hidden",
            borderWidth: isTopCard ? 6 : 0,
            borderColor: isTopCard ? '#E2E8F0' : 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 10,
          }
        ]}
      >
        <ScrollView
          nestedScrollEnabled
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View style={{ flex: 1 }}>
            {/* Textos "LIKE" e "NOPE" */}
            <Animated.Text
              style={[
                likeStyle,
                {
                  fontSize: 32,
                  fontWeight: "bold",
                  color: "#4CAF50",
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
                  color: "#FF5252",
                },
              ]}
            >
              NOPE
            </Animated.Text>

            {/* Conteúdo do Card */}
            <View className="p-4 justify-between flex-row">
              <Text className="text-white text-lg font-semibold">
                {data.function}
              </Text>
              {data.PCD === "1" ? (
                <FontAwesome name="wheelchair-alt" size={24} color="white" />
              ) : null}
            </View>

            <Image
              source={AbstractPicture[data.image]}
              resizeMode="contain"
              className="w-full h-[20%] self-center"
            />

            <View className="p-4">
              <Tabs data={data} />
            </View>

            <Text className="text-white text-base mt-2">
              Descrição longa que pode ser rolada dentro do card. Aqui você pode
              adicionar muito texto sem afetar o swipe horizontal.
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
};

export default Card;
