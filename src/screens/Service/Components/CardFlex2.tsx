import { View, Text, TouchableOpacity } from "react-native";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { Eye, Send, CreditCard, CirclePlus, Zap } from "lucide-react-native";
import { FONTS } from "~/src/constants/theme";

export default function CardFlex2() {
  return (
    <View className="flex-1 mt-5 flex-row">
      <View className="w-2/6 p-2" style={{ height: rf(180) }}>
        <TouchableOpacity
          style={Style.container}
          className="h-full w-full bg-white rounded-xl p-1 items-center justify-center flex-col-reverse"
        >
          <Text style={{ ...FONTS.fontSemiBold, fontSize: rf(11) }}>
            Ativos
          </Text>
          <Zap size={rf(22)} />
        </TouchableOpacity>
      </View>
      <View className="w-2/6 p-2" style={{ height: rf(180) }}>
        <TouchableOpacity
          style={Style.container}
          className="h-full w-full bg-white rounded-xl p-1 items-center justify-center flex-col-reverse"
        >
          <Text style={{ ...FONTS.fontSemiBold, fontSize: rf(11) }}>
            Gerar
          </Text>
          <CirclePlus size={rf(22)} />
        </TouchableOpacity>
      </View>
      <View className="w-2/6 p-2" style={{ height: rf(180) }}>
        <TouchableOpacity
          style={Style.container}
          className="h-full w-full bg-zinc-700 rounded-xl p-1 items-center justify-center flex-col-reverse"
        >
          <Text
            style={{ ...FONTS.fontSemiBold, fontSize: rf(11) }}
            className="text-white"
          >
            Planos
          </Text>
          <CreditCard className="text-white" size={rf(22)} />
        </TouchableOpacity>
      </View>
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
