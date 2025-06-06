import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Header from "~/src/layout/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // ou outro pacote de ícones
import Icon from "~/src/components/Icon/Icon";
import { FONTS } from '~/src/constants/theme'
import { rf } from "~/src/hooks/utils/responsiveFont";
const services = [
  { icon: "build_outline", title: "Assistência Técnica" },
  { icon: "school_outline", title: "Aulas" },
  { icon: "car_outline", title: "Mecânica e Transportes" },
  { icon: "handShake_outline", title: "Consultoria" },
  { icon: "computer_outline", title: "Design e Tecnologia" },
  { icon: "celebration_outline", title: "Eventos" },
  { icon: "styler_outline", title: "Moda e Beleza" },
  { icon: "tools_outline", title: "Reformas e Reparos" },
  { icon: "health_outline", title: "Saúde" },
  { icon: "house_outline", title: "Serviços Domésticos" },
  { icon: "addCircle_outline", title: "Outros" },
];

export default function Create() {
  return (
    <View className="bg-white h-full">
      <Header leftIcon="back" title="Criar Anúncio" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="mb-4">
            <Text style={[FONTS.fontBlack, {fontSize:rf(26)}]}>
                Escolha uma Categoria
            </Text>
            <Text className="text-gray-500" style={[FONTS.fontLight, {fontSize:rf(13)}]}>
                Escolha qual serviço você deseja anunciar 
            </Text>
        </View>

        <View className="flex flex-row flex-wrap justify-between">
          {services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={Style.container}
              className="bg-white rounded-2xl p-5 w-[48%] mb-4 items-center shadow-sm justify-center"
              activeOpacity={0.7}
              onPress={() => console.log("Selecionado:", service.title)}
            >
              <View className="h-7 w-7">
                <Icon name={service.icon} color="#4B5563" />
              </View>
              <Text style={[FONTS.fontLight, {fontSize:rf(12)}]} className="text-center text-gray-700">{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
