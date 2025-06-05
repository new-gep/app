import React from "react";
import { View, ScrollView, Image, Text, TouchableOpacity } from "react-native";
import Icon from "~/src/components/Icon/Icon";
const items = [
  {
    label: "Ofertas",
    image: "https://via.placeholder.com/100x100.png?text=%F0%9F%9B%92",
  },
  {
    label: "Frete",
    image: "https://via.placeholder.com/100x100.png?text=%F0%9F%9A%9A",
  },
  {
    label: "Novos",
    image: "https://via.placeholder.com/100x100.png?text=%E2%9C%A8",
  },
  {
    label: "Serviços",
    image: "https://via.placeholder.com/100x100.png?text=%F0%9F%94%A6",
  },
];

export default function BannerCircle() {
  return (
    <View style={{ marginTop: 24 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {items.map((item, index) => (
          <View>
            <TouchableOpacity
              key={index}
              className="bg-gray-300 rounded-full p-1"
              style={{ alignItems: "center", marginRight: 16 }}
              activeOpacity={0.8}
            >
              <View className="h-7 w-7">
                <Icon name={"build_outline"} color="black" />
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, color: "#333" }}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
