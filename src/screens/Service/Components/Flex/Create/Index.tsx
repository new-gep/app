import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "~/src/layout/Header";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import Icon from "~/src/components/Icon/Icon";
import Form from "./Form";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
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
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <BottomSheetModalProvider>
      <View className="bg-white h-full">
        {!selectedCategory ? (
          <>
            <Header
              leftIcon="back"
              title={"Criar Anúncio"}
            />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Text style={[FONTS.fontBlack, { fontSize: rf(26) }]}>
                Escolha uma Categoria
              </Text>
              <Text
                className="text-gray-500 mb-4"
                style={[FONTS.fontLight, { fontSize: rf(13) }]}
              >
                Escolha qual serviço você deseja anunciar
              </Text>

              <View className="flex flex-row flex-wrap justify-between">
                {services.map((service, index) => (
                  <TouchableOpacity
                    key={index}
                    style={Style.container}
                    className="bg-white rounded-2xl p-5 w-[48%] mb-4 items-center shadow-sm justify-center"
                    activeOpacity={0.7}
                    onPress={() => setSelectedCategory(service)}
                  >
                    <View className="h-7 w-7">
                      <Icon name={service.icon} color="#4B5563" />
                    </View>
                    <Text
                      style={[FONTS.fontLight, { fontSize: rf(12) }]}
                      className="text-center text-gray-700"
                    >
                      {service.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </>
        ) : (
          <Form setSelectedCategory={setSelectedCategory} title={selectedCategory.title}/>
        )}
      </View>
    </BottomSheetModalProvider>
  );
}

const Style = {
  container: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
};
