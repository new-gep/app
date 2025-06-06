import React from "react";
import { View, ScrollView, Image, Dimensions } from "react-native";

const banners = [
  "https://img.freepik.com/psd-gratuitas/publicar-modelo-de-midia-social-ofertas-de-fim-de-ano-ofertas-brasil_314999-1437.jpg?ga=GA1.1.1690379333.1726173945&semt=ais_items_boosted&w=740",
  "https://img.freepik.com/vetores-gratis/modelo-de-banner-engracado-da-black-friday-com-balao-e-fundo-de-zoom-em-quadrinhos_69286-219.jpg?ga=GA1.1.1690379333.1726173945&semt=ais_items_boosted&w=740",
  "https://img.freepik.com/vetores-gratis/modelo-de-banner-horizontal-para-vendas-na-black-friday_23-2150867247.jpg?ga=GA1.1.1690379333.1726173945&semt=ais_items_boosted&w=740",
];

const { width } = Dimensions.get("window");

export default function BannerImage() {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {banners.map((url, index) => (
          <Image
            key={index}
            source={{ uri: url }}
            style={{
              width: width - 64,
              height: 160,
              borderRadius: 16,
              marginRight: 16,
              resizeMode: "cover",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
