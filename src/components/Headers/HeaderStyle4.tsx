import React from "react";
import { Animated, Dimensions, Platform, StatusBar } from "react-native";
import {FONTS} from "~/src/constants/theme";

const HEADER_MAX_HEIGHT = 35;
const HEADER_MIN_HEIGHT = 20;
const HEADER_MAX_FONT = 28;
const HEADER_MIN_FONT = 20;

const screenWidth = Dimensions.get("window").width;
const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

const HeaderStyle4 = ({ scrollY }: { scrollY: Animated.Value }) => {
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT + statusBarHeight, HEADER_MIN_HEIGHT + statusBarHeight],
    extrapolate: "clamp",
  });

  const fontSize = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_FONT, HEADER_MIN_FONT],
    extrapolate: "clamp",
  });

  const translateX = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, (screenWidth / 2) - 80], // Ajuste 80 para alinhar o texto ao centro
    extrapolate: "clamp",
  
  });

  return (
    <Animated.View
      style={{
        height: headerHeight,
        // paddingTop:  statusBarHeight,
        justifyContent: "flex-end",
        backgroundColor: "white",

      }}
      className="absolute top-0 left-0 right-0 z-50 px-4 py-2"
    >
      <Animated.Text
        style={{
          transform: [{ translateX }],
          ...FONTS.fontBlack,
          fontWeight: "500",
          fontSize: fontSize,
        }}
      >
        Configurações
      </Animated.Text>
    </Animated.View>
  );
};

export default HeaderStyle4;
