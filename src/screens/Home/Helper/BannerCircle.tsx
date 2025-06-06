import React from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import Icon from "~/src/components/Icon/Icon";
import { rf } from "~/src/hooks/utils/responsiveFont";
const items = [
  { icon: "build_outline", label: "Assistência Técnica" },
  { icon: "school_outline", label: "Aulas" },
  { icon: "car_outline", label: "Mecânica e Transportes" },
  { icon: "handShake_outline", label: "Consultoria" },
  { icon: "computer_outline", label: "Design e Tecnologia" },
  { icon: "celebration_outline", label: "Eventos" },
  { icon: "styler_outline", label: "Moda e Beleza" },
  { icon: "tools_outline", label: "Reformas e Reparos" },
  { icon: "health_outline", label: "Saúde" },
  { icon: "house_outline", label: "Serviços Domésticos" },
];

export default function BannerCircle() {
  return (
    <View style={{ marginTop: 20 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              alignItems: "center",
              marginRight: 16,
              width: 60, // largura fixa para alinhar e permitir quebra
            }}
          >
            <TouchableOpacity
              className="bg-primary rounded-full p-2"
              activeOpacity={0.8}
            >
              <View className="h-7 w-7">
                <Icon name={item.icon} color="black" />
              </View>
            </TouchableOpacity>
            <Text
              className="text-gray-500 text-center"
              style={{
                fontSize: 9,
                marginTop: 4,
                flexWrap: "wrap",
              }}
              numberOfLines={2}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
