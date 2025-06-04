import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import Octicons from "@expo/vector-icons/Octicons";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IMAGES } from "~/src/constants/Images";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";

interface ListItem {
  title: string;
  icon: string | any;
  go?: string;
  variable?: boolean;
  setVariable?: any;
  action?:any
}

export default function List({ items, isUnique, title }: { items: ListItem[],  isUnique?:boolean, title?:string }) {
  const navigation = useNavigation<any>();

  return (
    <View>
      { title &&
        <Text style={{...FONTS.fontMedium, fontSize:rf(17)}} className="my-2">
          {title}
        </Text>
      }
      <View className="bg-white rounded-lg px-3" style={!isUnique ? Style.container : undefined}>
        {items.map((item: ListItem, index: number) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between mb-2"
            onPress={() => {
              if(item.go){
                  navigation.navigate(item.go);
              }
              if(item.setVariable){
                  item.setVariable(!item.variable);
              }
              if(item.action){
                item.action()
              }
            }}
          >
            <View className="flex-row items-center w-1/12 h-1/2">
              {/* @ts-ignore */}
              <Image source={IMAGES[item.icon]} className="h-full w-full" resizeMode="contain" />
            </View>

            <View
              className="flex-row justify-between items-center w-11/12"
              style={{
                borderBottomWidth: index !== items.length - 1 ? 1 : 0,
                borderColor: "#e5e7eb", // equivalente a Tailwind `border-gray-200`
              }}
            >
              <Text style={[Style.text, FONTS.fontLight]}>{item.title}</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={21}
                color="black"
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
    padding: 7,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};
