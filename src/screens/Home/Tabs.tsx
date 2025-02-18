import React, { useRef } from "react";
import { Dimensions, Text, View, ScrollView } from "react-native";
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

  // console.log('Dados recebidos:', JSON.stringify(data.company.company_name, null, 2));




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

  return (
    <>
      <View>
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
        scrollEventThrottle={14}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        contentContainerStyle={{ width: width * buttons.length }}
      >
        {/* Tab 1: Vaga */}
        <View className="w-[100vw]">
          <Animated.ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            className="p-4 pb-8"
          >
            <Text className="text-white text-xl font-semibold">
              Vaga: {data.function || "Não informado"}
            </Text>
            <View className="flex-row items-center">
              {/* <MaterialIcons name="attach-money" size={25} color="#f5f5f5" /> */}
              <Text className="text-white text-xl font-semibold">
              Salário: R${data.salary || "Não informado"}
              </Text>
            </View>
            <Text className="text-white text-xl font-semibold">
              Tipo de Contratação: {data.contract_type || "Não informado"}
            </Text>
            <Text className="text-white text-xl font-semibold">
              Descrição: {data.description || "Não informado"}
            </Text>
            <Text className="text-white text-xl font-semibold">
              Jornada: {data.time.journey || "Não informado"}
            </Text>
            <Text className="text-white text-xl font-semibold">
              Tipo de localidade: {data.delete_at || "Home Office"}
            </Text>
            <Text className="text-white text-xl font-semibold">
              Data da postagem: {data.delete_at || "Há 6 dias atrás"}
            </Text>
            <Text className="text-white text-xl font-semibold">
              Quantidade de candidatos: {data.delete_at || "200"}
            </Text>
          </Animated.ScrollView>
        </View>

        {/* Tab 2: Empresa */}
        <View className="w-[100vw]">
          <Animated.ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            className="p-4 pb-8"
          >
            <Text className="text-white text-xl font-semibold">
              Empresa: {data.company.company_name || "Não informado"}
            </Text>
            <Text className="text-white text-xl font-semibold">
              Telefone: {data.company.phone || "Não informado"}
            </Text>
            <Text className="text-white text-xl font-semibold">
              E-mail: {data.company.email || "Não informado"}
            </Text>
            <Text className="text-white text-xl font-semibold">
              Endereço:{" "}
              {`${data.company.street || ""}, ${data.company.number || ""} - ${
                data.company.district || ""
              }, ${data.company.city || ""} - ${data.company.uf || ""}`}
            </Text>
            <Text className="text-white text-xl font-semibold">
              CEP: {data.company.zip_code || "Não informado"}
            </Text>
          </Animated.ScrollView>
        </View>

        {/* Tab 3: Detalhes */}
        <View className="w-[100vw] h-[100vh]">
          <ScrollView className="p-4 h-40 w-full">
            <Text className="text-white text-xl font-semibold">
              Carga Horária: {data.workload || "Não informado"}
            </Text>
            <Text className="text-white text-xl font-semibold">
              Benefícios: {data.benefics || "Não informado"}
            </Text>
            <Text className="text-white text-xl font-semibold">
              Obrigações: {data.obligations || "Não informado"}
            </Text>
            <Text className="text-white text-xl font-semibold">
              Detalhes Adicionais: {data.details || "Não informadooooooooooooooooooooooooooooooooooooooooooOOOOOO  oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo              oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"}
            </Text>
          </ScrollView>
        </View>
      </Animated.ScrollView>
    </>
  );
};

export default Tabs;
