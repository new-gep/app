import React, { useState } from "react";
import {
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { COLORS, FONTS } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { rf } from "../hooks/utils/responsiveFont"; // <-- Importa a função

const ImageSwiper = ({ data }: any) => {
  const [newData] = useState([
    { key: "space-left" },
    ...data,
    { key: "space-right" },
  ]);
  const { width } = useWindowDimensions();
  const height = Dimensions.get("window").height;
  const SIZE = width * 0.75;
  const SPACER = (width - SIZE) / 2;
  const x = useSharedValue(0);
  const screenHeight = Dimensions.get("window").height;
  const navigation = useNavigation<any>();

  const onScroll = (event: any) => {
    x.value = event.nativeEvent.contentOffset.x;
  };

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      scrollEventThrottle={16}
      snapToInterval={SIZE}
      decelerationRate="fast"
      onScroll={onScroll}
      contentContainerStyle={{ paddingTop: 25, paddingBottom: 10 }}
    >
      {newData.map((item, index) => {
        const style = useAnimatedStyle(() => {
          const scale = interpolate(
            x.value,
            [(index - 2) * SIZE, (index - 1) * SIZE, index * SIZE],
            [0.9, 1, 0.9]
          );
          return { transform: [{ scale }] };
        });

        if (!item.image) {
          return <View style={{ width: SPACER }} key={index} />;
        }

        return (
          <View
            key={index}
            style={{
              width: SIZE,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Animated.View
              style={[style, { width: "100%", alignItems: "center" }]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate(item.route, {
                    ...(item.params || {}),
                    jobConected: item.params?.jobConected,
                    CPF: item.params?.CPF,
                  })
                }
                style={{
                  height: height * 0.45,
                  width: "92%",
                  backgroundColor: COLORS.primary,
                  borderRadius: 31,
                  shadowColor: "#025135",
                  shadowOffset: { width: 0, height: 15 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 8,
                  paddingVertical: 15,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Image
                    style={{
                      width: "90%",
                      maxHeight: screenHeight * 0.29,
                      aspectRatio: 1,
                      flexShrink: 1,
                    }}
                    resizeMode="contain"
                    source={item.image}
                  />
                </View>

                <View
                  className="absolute w-full items-center b"
                  style={{ paddingHorizontal: 20, top: "78%" }}
                >
                  <Text
                    className="text-center"
                    style={{
                      ...FONTS.fontSemiBold,
                      fontSize: rf(18), // responsivo
                      color: COLORS.dark,
                      textAlign: "center",
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      ...FONTS.fontMedium,
                      fontSize: rf(13), // responsivo
                      color: COLORS.dark,
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        );
      })}
    </Animated.ScrollView>
  );
};

export default ImageSwiper;
