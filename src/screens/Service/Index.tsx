import { useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import HeaderStyle4 from "~/src/components/Headers/HeaderStyle4";
import { rf } from "~/src/hooks/utils/responsiveFont";
import CardFix from "./Components/CardFix";
import CardFix2 from "./Components/CardFix2";
import CardFlex from "./Components/CardFlex";
import CardFlex2 from "./Components/CardFlex2";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCollaboratorContext } from "~/src/context/CollaboratorContext";
const screenWidth = Dimensions.get("window").width;

export default function Service() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState("Fix");
  const { validateCollaborator } = useCollaboratorContext();
  const fixAnim = useRef(new Animated.Value(0)).current; // 0 = ativo
  const flexAnim = useRef(new Animated.Value(1)).current; // 1 = fora da tela
  
  const animateTabs = (tab: any) => {
    setActiveTab(tab);

    Animated.parallel([
      Animated.timing(fixAnim, {
        toValue: tab === "Fix" ? 0 : 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(flexAnim, {
        toValue: tab === "empresa" ? 0 : 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

   useFocusEffect(
      React.useCallback(() => {
        validateCollaborator();
      }, [])
    );

  return (
    <View className="bg-white h-full">
      <HeaderStyle4 title="Serviços" scrollY={scrollY} />
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        className={"px-4"}
        style={{ width: "100%", paddingTop: 70 }}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View className="w-full py-3">
          <View
            style={Style.container}
            className="flex-row bg-white rounded-full p-1 w-full justify-between"
          >
            <TouchableOpacity
              onPress={() => animateTabs("Fix")}
              className={`flex-1 px-4 py-2 rounded-full items-center ${
                activeTab === "Fix" ? "bg-primary" : ""
              }`}
            >
              <Text
                style={{ fontSize: rf(13) }}
                className={`font-semibold ${
                  activeTab === "Fix" ? "text-dark" : "text-gray-500"
                }`}
              >
                Gep CLT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => animateTabs("empresa")}
              className={`flex-1 px-4 py-2 rounded-full items-center ${
                activeTab === "empresa" ? "bg-primary" : ""
              }`}
            >
              <Text
                style={{ fontSize: rf(13) }}
                className={`font-semibold ${
                  activeTab === "empresa" ? "text-dark" : "text-gray-500"
                }`}
              >
                Gep Flex
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Stack de conteúdo */}
        <View style={{ position: "relative" }}>
          {/* Fix */}
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              zIndex: activeTab === "Fix" ? 2 : 1,
              pointerEvents: activeTab === "Fix" ? "auto" : "none",
              transform: [
                {
                  translateY: fixAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50],
                  }),
                },
              ],
              opacity: fixAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }}
          >
            <CardFix />
            {/* <CardFix2 /> */}
          </Animated.View>

          {/* Flex */}
          <Animated.View
            style={{
              position: "relative",
              width: "100%",
              zIndex: activeTab === "empresa" ? 2 : 1,
              pointerEvents: activeTab === "empresa" ? "auto" : "none",
              transform: [
                {
                  translateY: flexAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50],
                  }),
                },
              ],
              opacity: flexAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }}
          >
            <CardFlex />
            {/* <CardFlex2 /> */}
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const Style = {
  container: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
};
