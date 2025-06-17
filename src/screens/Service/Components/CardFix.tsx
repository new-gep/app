import {
  ChevronRight,
  Building2,
  EllipsisVertical,
  History,
  Repeat,
  Mail,
  MessageCircle,
} from "lucide-react-native";
import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";

type StatusKey = "atual" | "demissao" | "ultimo";

export default function Card() {
  const empresaAtualFake = {
    empresa: "Mix Serviços Logisticos LTDA",
    cargo: "Motoboy",
    logoUrl: "",
    status: "atual" as StatusKey, // <- use isso pra mudar a bolinha e mensagem
  };

  const statusMap: Record<StatusKey, { color: string; label: string }> = {
    atual: { color: "#22c55e", label: "Atual" }, // verde
    demissao: { color: "#facc15", label: "Em processo de demissão" }, // amarelo
    ultimo: { color: "#ef4444", label: "Último serviço" }, // vermelho
  };
  const { color, label } = statusMap[empresaAtualFake.status];

  const handleStatusPress = () => {
    Alert.alert("Status", label);
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <View className="flex-row">
        <TouchableOpacity
          //   onPress={() => handleDelete(id)}
          className="w-20 justify-center items-center"
        >
          <EllipsisVertical className="text-dark" size={rf(24)} />
          {/* <Text className="text-white mt-1 text-sm">Apagar</Text> */}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={Style.container} className="mt-5 bg-white p-3 rounded-2xl">
      <View className="px-2">
        <Swipeable
          renderLeftActions={(progress) => renderLeftActions(progress)}
        >
          <TouchableOpacity

            className="w-full bg-white border-b border-zinc-300 rounded-lg p-3 flex-row items-center"
            style={{ height: rf(80) }}
          >
            {/* Logo */}
            {empresaAtualFake.logoUrl ? (
              <Image
                source={{ uri: empresaAtualFake.logoUrl }}
                className="w-12 h-12 rounded-full mr-3"
                resizeMode="cover"
              />
            ) : (
              <View className="rounded-full bg-zinc-100 items-center justify-center p-3 mr-3">
                <Building2 size={rf(25)} />
              </View>
            )}
            <TouchableOpacity onPress={handleStatusPress}>
              <View
                className="absolute"
                style={{
                  bottom: -18,
                  left: -21,
                  backgroundColor: color,
                  width: rf(10),
                  height: rf(10),
                  borderRadius: rf(10),
                }}
              />
            </TouchableOpacity>

            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(14) }}
                  className="text-zinc-800 font-semibold"
                >
                  {empresaAtualFake.empresa || "Empresa Atual"}
                </Text>
              </View>
              <Text
                style={{ ...FONTS.font, fontSize: rf(11) }}
                className="text-zinc-500"
              >
                {empresaAtualFake.cargo || "Cargo não informado"}
              </Text>
            </View>

            <ChevronRight size={20} className="text-zinc-400" />
          </TouchableOpacity>
        </Swipeable>
      </View>

      <>
        <View className="flex-row justify-between mt-5">
          <View className="w-3/6 px-2">
            <TouchableOpacity
              style={[Style.container, { height: rf(100) }]}
              className="bg-blue-200 rounded-2xl p-2 h-20"
            >
              <Text style={{...FONTS.fontLight, fontSize:rf(13)}}>Processos</Text>
              <Repeat size={rf(20)} />
            </TouchableOpacity>
          </View>
          <View className="w-3/6 px-2">
            <TouchableOpacity
              style={[Style.container, { height: rf(100) }]}
              className="bg-purple-200 rounded-2xl p-2 h-20"
            >
              <Text style={{...FONTS.fontLight, fontSize:rf(13)}}>Mensagens</Text>
              <MessageCircle size={rf(20)} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row justify-between mt-5">
          <View className="w-3/6 px-2">
            <TouchableOpacity
              style={[Style.container, { height: rf(100) }]}
              className="bg-yellow-200 rounded-2xl p-2 h-20"
            >
              <Text style={{...FONTS.fontLight, fontSize:rf(13)}}>Propostas</Text>
              <Mail size={rf(20)} />
            </TouchableOpacity>
          </View>
          <View className="w-3/6 px-2">
            <TouchableOpacity
              style={[Style.container, { height: rf(100) }]}
              className="bg-zinc-200 rounded-2xl p-2 h-20"
            >
              <Text style={{...FONTS.fontLight, fontSize:rf(13)}}>Historico</Text>
              <History size={rf(20)} />
            </TouchableOpacity>
          </View>
        </View>
      </>
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
