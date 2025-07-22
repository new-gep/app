import { useNavigation } from "@react-navigation/native";
import {
  Check,
  ChevronRight,
  UserRound,
  Mail,
  CircleX,
  UserRoundMinus,
  UserRoundPlus,
} from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import { rf } from "~/src/hooks/utils/responsiveFont";

export default function ProcessCard({ item }: any) {
  const navigation = useNavigation<any>();
  const step = () => {
    if (item.process === "admission") {
      switch (item.step) {
        case 1:
          return 'Exame Médico'
        case 2:
          return 'Kit Admissional'
        case 3:
          return 'Assinatura'
        default:
          return item.step;
      }
    } 
    else {
      switch (item.step) {
        case 1:
          return 'Exame Médico'
        case 2:
          return 'Kit Demissional'
        case 3:
          return 'Assinatura'
        case '1':
          return 'Exame Médico'
        case '2':
          return 'Kit Demissional'
        case '3':
          return 'Assinatura'
        default:
          return item.step;
      }
    }
  };


  return (
    <>
      <Swipeable key={item.id}>
        <TouchableOpacity
          className="px-4 py-2 bg-white border-b border-zinc-300 flex-row items-center justify-between"
          style={styles.card}
          onPress={() => navigation.navigate("FixActual")}
        >
          <View className="flex-row items-center flex-1">
            <View className="mr-3" style={{ position: "relative" }}>
              {item.process === "admission" ? (
                <View className="rounded-full bg-green-100 items-center justify-center p-3 w-12 h-12">
                  <UserRoundPlus className="text-green-500" size={rf(20)} />
                </View>
              ) : (
                <View className="rounded-full bg-red-100 items-center justify-center p-3 w-12 h-12">
                  <UserRoundMinus className="text-red-500" size={rf(20)} />
                </View>
              )}
            </View>

            <View className="pr-2">
              <Text
                style={{ ...FONTS.font, fontSize: rf(12) }}
                numberOfLines={1}
                ellipsizeMode="tail"
                className="capitalize"
              >
                {item && item?.function}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item && item.process == 'admission' ? 'Processo de Admissão': 'Processo de Demissão'}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                Etapa {step()}
              </Text>
            </View>
          </View>
          <View className="mr-3">
            <ChevronRight size={rf(20)} />
          </View>
        </TouchableOpacity>
      </Swipeable>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardWrapper: {
    position: "relative",
    minHeight: rf(20),
  },
  cardContainer: {
    minHeight: rf(20),
    overflow: "visible",
  },
  card: {
    width: "100%",
    minHeight: rf(80),
    overflow: "visible",
  },
});
