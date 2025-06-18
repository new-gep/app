import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import Octicons from "@expo/vector-icons/Octicons";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function List({ items }: any) {
  const navigation = useNavigation<any>();

  return (
    <View className="bg-white rounded-lg px-3" style={Style.container}>
      {items.map((item: any, index: number) => (
        <TouchableOpacity
          key={index}
          className="flex-row items-center justify-between mb-2"
          onPress={() => {
            navigation.navigate(item.go);
          }}
        >
          <View className="flex-row items-center w-1/12">
            <Octicons name={item.icon} size={19} color="black" />
          </View>

          <View
            className="flex-row justify-between items-center w-11/12"
            style={{
              borderBottomWidth: index !== items.length - 1 ? 1 : 0,
              borderColor: "#e5e7eb", // equivalente a Tailwind `border-gray-200`
            }}
          >
            <Text style={Style.text}>{item.title}</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={21}
              color="black"
            />
          </View>
        </TouchableOpacity>
      ))}
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
