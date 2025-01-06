import React, { useEffect, useRef } from "react";
import { Dimensions, Text, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import TabButtonStyle1 from "../../components/Tabs/TabButtonStyle1";
import { useTheme } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

const Tabs = ({ data }) => {
  const scrollViewHome = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const buttons = ["Vaga", "Empresa", "Detalhes"];
  const theme = useTheme();
  const { colors } = theme;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const clickable = (i: number) => {
    if (scrollViewHome.current) {
      scrollViewHome.current.scrollTo({ x: i * width, animated: true });
    } else {
      console.error("scrollViewHome ref is null");
    }
  };

  // useEffect(() => {
  //   console.log(data);
  // },[]); teste para ver se os dados estão chegando

  return (
    <>
      <View className="pb-4">
        <TabButtonStyle1
          buttons={buttons}
          onClick={clickable}
          scrollX={scrollX}
        />
      </View>

      <Animated.ScrollView
        ref={scrollViewHome}
        snapToInterval={width}
        decelerationRate="fast"
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        contentContainerStyle={{ width: width * buttons.length }}
      >
        {/* Tab 1: Vaga */}
        <View className="flex-1 justify-center items-start px-7 w-full mt-5 gap-3">
            <Text className="text-white text-lg font-semibold">Cargo: {data.function}         
            </Text>
            <Text className="text-white text-lg font-semibold">Empresa: {data.company.company_name}</Text>
            <View className="flex-row items-center">
              <MaterialIcons name="attach-money" size={25} color="#f5f5f5" />
              <Text className="text-white text-lg ml-1">Salário: {data.salary}</Text>
            </View>
          </View>

        {/* Tab 2: Empresa */}
        <View className="flex-1 justify-center items-start px-7 w-full mt-5 gap-3">
          <Text className="text-white text-lg font-semibold">
            Nome empresa: {data.company.company_name}
          </Text>
          <Text className="text-white text-lg font-semibold">Telefone: {data.company.phone}</Text>
          <Text className="text-white text-lg font-semibold">Email: {data.company.email}</Text>
          <Text className="text-white text-lg font-semibold">Endereço: {data.company.street}</Text>
        </View>

        {/* Tab 3: Detalhes */} 
        <View className="flex-1 justify-center items-start px-7 w-full mt-5 gap-3">
          <Text className="text-white text-lg font-semibold">
            Carga horária:
          </Text>
          <Text className="text-white text-lg font-semibold">Benefícios: {data.benefics}</Text>
          <Text className="text-white text-lg font-semibold">Obrigações: {data.obligations}</Text>
          <Text className="text-white text-lg font-semibold">Detalhes: {data.details}</Text>
        </View>
      </Animated.ScrollView>
    </>
  );
};

export default Tabs;
