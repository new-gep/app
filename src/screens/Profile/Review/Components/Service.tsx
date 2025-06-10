import React from "react";
import { View, ScrollView, Text } from "react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";

export default function Service() {
  const data = {
    service: ["Geladeira", "Lava Louça", "Televisão", "Dança", "Concursos"],
  };

  const renderTagList = (items: string[]) => (
    <View>
      <View>
        <View className="flex-row flex-wrap">
          {items.map((item, index) => (
            <Text
              key={index}
              style={[Style.tag, FONTS.fontLight, { fontSize: rf(14) }]}
            >
              {item}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={Style.container} className="bg-white p-3 rounded-lg mt-3">
      <Text
        className="mb-6"
        style={{ fontSize: rf(18), ...FONTS.fontSemiBold }}
      >
        Serviços
      </Text>
      {renderTagList( data.service)}
    </View>
  );
}

const Style = {
  container: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tag: {
    backgroundColor: "#fde047",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
    color: "black",
  },
};
