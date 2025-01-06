import React, { useLayoutEffect } from "react";
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

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.55;
const MAX_ROTATION_ANGLE = 8;

const Card = ({ data, onSwipe, isTopCard, zIndex }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

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
          <Tabs data={data} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default Card;
