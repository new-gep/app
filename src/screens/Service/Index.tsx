import { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";
import HeaderStyle4 from "~/src/components/Headers/HeaderStyle4";
import { rf } from "~/src/hooks/utils/responsiveFont";
import Card from "./Components/Card";

export default function Service() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState("CLT");
  return (
    <View className="bg-white h-full">
      <HeaderStyle4 title="Serviços" scrollY={scrollY} />
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        className={'px-4'}
        style={{ width: "100%", paddingTop: 70 }}
        contentContainerStyle={{ paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full py-3">
          <View style={Style.container}  className="flex-row bg-white rounded-full p-1 w-full justify-between">
            <TouchableOpacity
              onPress={() => setActiveTab("CLT")}
              className={`flex-1 px-4 py-2 rounded-full items-center ${
                activeTab === "CLT" ? "bg-primary" : ""
              }`}
            >
              <Text
                style={{ fontSize: rf(13) }}
                className={`font-semibold ${
                  activeTab === "CLT" ? "text-dark" : "text-gray-500"
                }`}
              >
                Gep Fix
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("empresa")}
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
        <Card/>
      </Animated.ScrollView>
    </View>
  );
}

const Style = {
  container: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};
