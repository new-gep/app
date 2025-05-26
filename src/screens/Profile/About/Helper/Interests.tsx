import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { IMAGES } from "~/src/constants/Images";
import { FONTS } from "~/src/constants/theme";
import ModalDates from "./Modal";

interface InterestsFilterProps {
  title: string;
  icon: any;
  border?: boolean;
  options: string[];
}

const InterestsFilter = ({
  title,
  options,
  icon,
  border,
}: InterestsFilterProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <View>
      <ModalDates visible={modalVisible} setVisible={setModalVisible} dates={selected} />

      <TouchableOpacity
        className="flex-row items-center justify-between"
        onPress={() => {
          console.log("Navegando para:");
          setModalVisible(true)
          // navigation.navigate(item.go);
        }}
      >
        <View className="flex-row items-center w-1/12 h-1/2">
          {/* <MaterialCommunityIcons name={icon} size={19} color="black" /> */}
          <Image source={IMAGES[icon]} className="h-full w-full" resizeMode="contain"/>
        </View>

        <View
          className="flex-row  justify-between items-center w-11/12"
          style={{
            borderBottomWidth: border ? 1 : 0,
            borderColor: "#e5e7eb", // equivalente a Tailwind `border-gray-200`
          }}
        >
          <Text style={styles.text}>{title}</Text>
          <MaterialIcons name="keyboard-arrow-right" size={21} color="black" />
        </View>
      </TouchableOpacity>
      {/* <View className="flex-row flex-wrap">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.select}
            className={`m-1 px-4 py-2 rounded-full ${
              selected.includes(option) ? 'bg-primary' : 'bg-white'
            }`}
            onPress={() => toggleOption(option)}
          >
            <Text
              className={selected.includes(option) ? 'text-dark' : 'text-gray-400'}
              style={{ ...FONTS.fontRegular, fontSize: 14 }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View> */}
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
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};

export default InterestsFilter;
