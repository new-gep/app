import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { IMAGES } from "~/src/constants/Images";
import {FONTS} from "~/src/constants/theme";

const { height, width } = Dimensions.get("window");

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <View className="mb-5">
        <Text  style={{...FONTS.fontBold,fontSize:32}} className="text-black">
          Pronto para dar o próximo passo? 
        </Text>
        <Text style={{...FONTS.fontRegular,fontSize:16}} className="text-gray-700 mb-2">
          Crie seu currículo, envie seu CV e seja encontrado pelas melhores
          oportunidades.
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {/* Card 1 - Perfil */}
        <TouchableOpacity
          className="w-[48%] aspect-square bg-yellow-100 rounded-2xl justify-center items-center mb-4"
          onPress={() => {}}
        >
          <MaterialIcons name="article" size={24} color="black" />
          <Text className="mt-2 text-center font-semibold">CV</Text>
        </TouchableOpacity>

        {/* Card 2 - Upload CV */}
        <TouchableOpacity
          className="w-[48%] aspect-square bg-yellow-100 rounded-2xl justify-center items-center mb-4"
          onPress={() => {}}
        >
          <MaterialIcons name="cloud-upload" size={24} color="black" />
          <Text className=" mt-2 text-center font-semibold">Upload</Text>
        </TouchableOpacity>

        {/* Card 3 - Visualizar CV */}
        <TouchableOpacity
          className="w-[48%] aspect-square bg-yellow-100 rounded-2xl justify-center items-center mb-4"
          onPress={() => {}}
        >
          <MaterialIcons name="remove-red-eye" size={24} color="black" />
          <Text className="mt-2 text-center font-semibold">Visualizar</Text>
        </TouchableOpacity>
        {/* <View className="w-full items-center">
          <Image
            source={IMAGES.unique26}
            style={{
              height: height * 0.3,
              width: width * 0.8,
              resizeMode: "contain",
              opacity: 0.8,
            }}
          />
        </View> */}
      </View>
    </ScrollView>
  );
}
