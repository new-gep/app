import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { useTheme } from "@react-navigation/native";
import { grey300 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

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
      [0, SIZES.width - 60],
      [0, btnWidth]
    );

    return {
      transform: [{ translateX }],
    };
  });

  const animatedOppositeStyle = useAnimatedStyle(() => {
    const translateXOpposit = interpolate(
      scrollX.value,
      [0, SIZES.width - 60],
      [0, -btnWidth]
    );

    return {
      transform: [{ translateX: translateXOpposit }],
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
        <TouchableOpacity key={btn} style={styles.btn} onPress={() => onClick(i)}>
          <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color:'#e0e0e0'}}>
            {btn}
          </Text>
        </TouchableOpacity>
      ))}

      <Animated.View
        style={[
          styles.animatedBtnContainer,
          { width: btnWidth },
          animatedStyle, // Aplicando o estilo animado
        ]}
      >
        {buttons.map((btn: any) => (
          <Animated.View
            key={btn}
            style={[
              styles.animatedBtn,
              { width: btnWidth },
              animatedOppositeStyle, // Estilo animado inverso
            ]}
          >
            <Text style={{ ...FONTS.font, ...FONTS.fontMedium, color: COLORS.primary }}>
              {btn}
            </Text>
            <View
              style={{
                height: 3,
                width: btnWidth,
                backgroundColor: COLORS.primary,
                position: "absolute",
                bottom: 0,
              }}
            />
          </Animated.View>
        ))}
      </Animated.View>
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
  animatedBtnContainer: {
    height: 45,
    flexDirection: "row",
    position: "absolute",
    overflow: "hidden",
  },
  animatedBtn: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default TabButtonStyle1;
