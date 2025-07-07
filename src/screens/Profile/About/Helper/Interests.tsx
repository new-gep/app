import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { IMAGES } from "~/src/constants/Images";
import { FONTS } from "~/src/constants/theme";
import ModalDates from "./Modal";
import { rf } from "~/src/hooks/utils/responsiveFont";

interface InterestsFilterProps {
  title: string;
  icon: any;
  border?: boolean;
  options: string[];
  selected?: string[];
  onSelect?: (selected: string[]) => void; 
}

const InterestsFilter = ({
  title,
  options,
  icon,
  border,
  selected,
  onSelect
}: InterestsFilterProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <ModalDates selected={selected} onSelect={onSelect} visible={modalVisible} setVisible={setModalVisible} dates={options} />
      <TouchableOpacity
        className="flex-row items-center justify-between"
        onPress={() => {
          setModalVisible(true)
          // navigation.navigate(item.go);
        }}
      >
        <View className="flex-row items-center w-1/12 h-1/2">
          {/* @ts-ignore */}
          <Image source={IMAGES[icon]} className="h-full w-full" resizeMode="contain"/>
        </View>

        <View
          className="flex-row  justify-between items-center w-11/12"
          style={{
            borderBottomWidth: border ? 1 : 0,
            borderColor: "#e5e7eb", // equivalente a Tailwind `border-gray-200`
          }}
        >
          <Text style={[FONTS.fontLight, styles.text]}>{title}</Text>
          <MaterialIcons name="keyboard-arrow-right" size={21} color="black" />
        </View>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = {
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
    fontSize:rf(15),
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};

export default InterestsFilter;
