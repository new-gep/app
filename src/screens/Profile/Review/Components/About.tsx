import { View, Text } from "react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";

export default function About() {
  const data = {
    about:
      "Sou uma pessoa dedicada, focada e apaixonada pelo que faço. Sempre busco aprender e crescer profissionalmente.",
  };
  return (
    <View style={Style.container} className="bg-white p-3 rounded-lg">
      <Text
        className="mb-3"
        style={{ fontSize: rf(18), ...FONTS.fontSemiBold }}
      >
        Sobre Mim
      </Text>

      <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>{data.about}</Text>
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
