import React from "react";
import { Animated, Dimensions, Platform, StatusBar, StyleSheet, View } from "react-native";
import { FONTS } from "~/src/constants/theme";
import { BlurView } from 'expo-blur';

const HEADER_MAX_HEIGHT = 35;
const HEADER_MIN_HEIGHT = 20;
const HEADER_MAX_FONT = 28;
const HEADER_MIN_FONT = 16;

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
    outputRange: [0, (screenWidth / 2) - 80],
    extrapolate: "clamp",
  });

  // Controla se o blur deve aparecer
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
      {/* Blur só aparece após rolar */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: showBlur }]}>
        <BlurView
          intensity={100}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        {/* Overlay para reforçar o blur */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,255,255,0.8)" }]} />
      </Animated.View>

      <View style={{ paddingHorizontal: 16, paddingVertical: 8, justifyContent: 'flex-end', height: "100%" }}>
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
      </View>
    </Animated.View>
  );
};

export default HeaderStyle4;
