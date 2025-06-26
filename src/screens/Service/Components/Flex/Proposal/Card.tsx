import { Check, ChevronRight, UserRound, Mail, CircleX } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import { rf } from "~/src/hooks/utils/responsiveFont";
import ModalProposal from "./Modal";

export default function ProposalCard({ item }: any) {
  const [visibleService, setVisibleService] = useState<boolean>(false);

  const renderLeftActions = () => (
    <TouchableOpacity
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: rf(80),
      }}
      className="bg-red-400"
      onPress={() => console.log("Delete")}
    >
        <CircleX className="text-white" size={rf(20)}/>
      <Text style={{  ...FONTS.fontSemiBold, fontSize: rf(9), color:'white' }}>Recusar</Text>
    </TouchableOpacity>
  );

  return (
    <>
        <ModalProposal visible={visibleService} setVisible={setVisibleService} item={item}/>
        <Swipeable 
            key={item.id}
            renderLeftActions={renderLeftActions}
        >
        <TouchableOpacity
            className="px-4 py-2 bg-white border-b border-zinc-300 flex-row items-center justify-between"
            style={styles.card}
            onPress={() => setVisibleService(true)}
        >
            <View className="flex-row items-center flex-1">
            <View className="mr-3" style={{ position: "relative" }}>
                <View className="rounded-full bg-zinc-100 items-center justify-center p-3 w-12 h-12">
                <Mail size={rf(19)} />
                </View>
            </View>

            <View className="pr-2">
                <Text
                style={{ ...FONTS.font, fontSize: rf(12) }}
                numberOfLines={1}
                ellipsizeMode="tail"
                >
                {item.function}
                </Text>
                <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-green-600"
                >
                {`${Mask("amount", item.salary)} ${item.valueType}`}
                </Text>
                <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
                >
                {item.model}
                </Text>
                <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
                >
                {item.locality}
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
