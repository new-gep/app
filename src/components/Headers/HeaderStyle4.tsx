import React from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { FONTS } from "~/src/constants/theme";
import { BlurView } from "expo-blur";
import { rf } from "~/src/hooks/utils/responsiveFont";
const HEADER_MAX_HEIGHT = 35;
const HEADER_MIN_HEIGHT = 20;
const HEADER_MAX_FONT = 28;
const HEADER_MIN_FONT = 16;

const screenWidth = Dimensions.get("window").width;
const statusBarHeight =
  Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

const HeaderStyle4 = ({
  scrollY,
  title,
}: {
  scrollY: Animated.Value;
  title: string;
}) => {
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [
      HEADER_MAX_HEIGHT + statusBarHeight,
      HEADER_MIN_HEIGHT + statusBarHeight,
    ],
    extrapolate: "clamp",
  });

  const fontSize = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_FONT, HEADER_MIN_FONT],
    extrapolate: "clamp",
  });

  const estimatedTextWidth = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [
      title.length * (HEADER_MAX_FONT * 0.55),
      title.length * (HEADER_MIN_FONT * 0.55),
    ],
    extrapolate: "clamp",
  });

  const translateX = Animated.add(
    scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [0, (screenWidth - title.length * (HEADER_MIN_FONT * 0.55)) / 2 - 16],
      extrapolate: "clamp",
    }),
    new Animated.Value(0)
  );

  const showBlur = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        height: headerHeight,
      }}
      className="absolute top-0 left-0 right-0 z-50"
    >
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: showBlur }]}>
        <BlurView
          intensity={100}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(255,255,255,0.8)" },
          ]}
        />
      </Animated.View>

      <View
        style={{
          height: "100%",
          justifyContent: "flex-end",
          paddingBottom: 8,
          paddingHorizontal: 16,
        }}
      >
        <Animated.Text
          style={{
            transform: [{ translateX }],
            fontSize: fontSize,
            ...FONTS.fontBlack,
            fontWeight: "500",
          }}
        >
          {title}
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

export default HeaderStyle4;
