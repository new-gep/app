import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { AbstractPicture } from "../../constants/abstract";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type CardInformationProps = {
  route: {
    params: {
      cardData: {
        id: string;
        function: string;
        PCD: string;
        image: string;
        // ... outros campos do seu card
      };
    };
  };
};

const CardInformation = ({ route }: CardInformationProps) => {
  const { cardData } = route.params;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold">{cardData.function}</Text>
          {cardData.PCD === "1" && (
            <FontAwesome name="wheelchair-alt" size={24} color="black" />
          )}
        </View>

        <Image
          source={AbstractPicture[cardData.image]}
          resizeMode="contain"
          className="w-full h-[200px] my-4"
        />

        {/* Adicione aqui mais informações do card */}
      </View>
    </ScrollView>
  );
};

export default CardInformation;
