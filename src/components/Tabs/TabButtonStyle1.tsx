import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { useTheme } from "@react-navigation/native";

type Props = {
  buttons?: any;
  onClick?: any;
  scrollX?: any;
};

const TabButtonStyle1 = ({ buttons, onClick, scrollX }: Props) => {
  const { colors } = useTheme();
  const [btnContainerWidth, setWidth] = useState(0);

  const btnWidth = btnContainerWidth / buttons.length;

  // Estilo animado para a barra de seleção
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      [0, SIZES.width],
      [0, btnWidth]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={{
        ...styles.btnContainer,
        borderBottomWidth: 1,
        borderColor: colors.border,
      }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {buttons.map((btn: any, i: any) => (
        <TouchableOpacity
          key={btn}
          style={styles.btn}
          onPress={() => onClick(i)}
        >
          <Text
            style={{
              ...FONTS.font,
              ...FONTS.fontMedium,
              color: scrollX.value / SIZES.width === i ? COLORS.primary : "#e0e0e0",
              fontWeight: scrollX.value / SIZES.width === i ? "bold" : "normal",
            }}
          >
            {btn}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Barra de seleção fixa abaixo do texto */}
      <Animated.View
        style={[
          styles.selectionBar,
          { width: btnWidth },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    height: 45,
    flexDirection: "row",
    width: "100%",
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectionBar: {
    height: 3,
    backgroundColor: COLORS.primary, // Cor amarela fixa na barra
    position: "absolute",
    bottom: 0,
  },
});

export default TabButtonStyle1;
