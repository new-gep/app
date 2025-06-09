import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";

const adTypes = [
  { id: "free", title: "Gratuito", description: "Anuncie sem pagar nada!", price: "R$ 0,00" },
  { id: "premium", title: "Premium", description: "Mais visibilidade no app", price: "R$ 9,99 / semana" },
];

export default function SelectAdType({setSelectAdTypeView, adType, setAdType}:any) {

  const handleSelect = (type: any) => {
    setAdType(type.title)
    setSelectAdTypeView(false)
  };

  return (
    <ScrollView className="bg-white h-full ">
      <Text style={[FONTS.fontBlack, { fontSize: rf(20) }]} className="mb-4">Escolha o tipo de anúncio</Text>
      <View className="px-6">
        {adTypes.map((type) => (
          <TouchableOpacity
            style={Styles.card}
            key={type.id}
            onPress={() => handleSelect(type)}
            className="bg-gray-100 rounded-2xl p-4 mb-4"
            activeOpacity={0.8}
          >
            <Text style={[FONTS.fontMedium, { fontSize: rf(16) }]}>{type.title}</Text>
            <Text className="text-gray-600 mt-1">{type.description}</Text>
            <Text className="text-green-600 font-bold mt-2">{type.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const Styles = {
  card: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  select: {
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
