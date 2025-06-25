import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import WorkInformation from "~/src/screens/Home/Helper/Modal/WorkInformation";

export default function Promotion({ setModalStep, item }: any) {
  return (
    <View className="h-full w-full">
      <TouchableOpacity
        className="px-5 mb-5"
        onPress={() => setModalStep("menu")}
      >
        <ChevronLeft size={rf(25)} />
      </TouchableOpacity>
      <View className="items-center justify-center mt-5">
        <Text style={{...FONTS.fontSemiBold, fontSize:rf(13)}} className="">
          Em construção
        </Text>
        <Text style={{...FONTS.fontLight, fontSize:rf(10)}} className="">
          Volte em breve
        </Text>
      </View>
    </View>
  );
}
