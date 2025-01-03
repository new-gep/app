import React, { useRef } from "react";
import { Dimensions, Text, View, ImageBackground } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { runOnJS } from "react-native-reanimated";
import TabButtonStyle1 from "../../components/Tabs/TabButtonStyle1";
import { FONTS, SIZES } from "../../constants/theme";
import { useTheme } from "@react-navigation/native";
import { grey100 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.55;
const MAX_VERTICAL_TRANSLATION = height * 0.2;
const MAX_ROTATION_ANGLE = 10;

const Tabs = ({ companyName, image, position, time, contract }) => {
  const scrollViewHome = React.useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const buttons = ["Vaga", "Empresa", "Detalhes"];
  const theme = useTheme();
  const { colors } = theme;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const clickable = (i: number) => {
    if (scrollViewHome.current) {
      scrollViewHome.current.scrollTo({ x: i * width, animated: true }); // Sem subtrações
    } else {
      console.error("scrollViewHome ref is null");
    }
  };

  return (
    <>
      <View style={{ paddingBottom: 15 }}>
        <TabButtonStyle1
          buttons={buttons}
          onClick={clickable}
          scrollX={scrollX}
        />
      </View>

      <Animated.ScrollView
        ref={scrollViewHome}
        snapToInterval={width} // Snap na largura exata da tela
        decelerationRate="fast"
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        contentContainerStyle={{ width: width * buttons.length }}
      >
        <View style={[styles.tabBody, { width }]}>
          <View className="w-full px-4 space-y-4">
            <View>
              <Text style={{ ...FONTS.font, color: "#f5f5f5" }}>Cargo:</Text>
              <Text style={{ ...FONTS.font, color: "#f5f5f5" }}>Empresa:</Text>
              <Text style={{ ...FONTS.font, color: "#f5f5f5" }}>
                <MaterialIcons name="attach-money" size={24} color="#f5f5f5" />:
              </Text>
            </View>
            {/* {dadosDoBanco.ISPCD == true ? 'Vaga afirmativa' : 'Não é uma vaga afimartiva' }  */}
          </View>
        </View>
        <View style={[styles.tabBody, { width }]}>
          <View>
          <View className="w-full px-4 space-y-4">
            <Text style={{ ...FONTS.font, color: "#f5f5f5" }}>
              Nome empresa:
            </Text>
            <Text style={{ ...FONTS.font, color: "#f5f5f5" }}>Telefone:</Text>
            <Text style={{ ...FONTS.font, color: "#f5f5f5" }}>Email:</Text>
            <Text style={{ ...FONTS.font, color: "#f5f5f5" }}>Endereço:</Text>
          </View>
          </View>
        </View>

        <View style={[styles.tabBody, { width }]}>
          <View className="w-full px-4 space-y-4">
            <View>
              <Text style={{ ...FONTS.font, color: "#f5f5f5" }}>
                Carga horária:
              </Text>
              <Text style={{ ...FONTS.font, color: "#f5f5f5" }}>
                Beneficios:
              </Text>
              <Text style={{ ...FONTS.font, color: "#f5f5f5" }}>
                Obrigações:
              </Text>
              <Text style={{ ...FONTS.font, color: "#f5f5f5" }}>Detalhes:</Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </>
  );
};

const styles = {
  tabBody: {
    justifyContent: "center" as "center",
    alignItems: "center" as "center",
    paddingHorizontal: 10, // Pequeno padding para evitar overflow
  },
};

export default Tabs;
