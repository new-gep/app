import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "~/src/layout/Header";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FONTS } from "~/src/constants/theme";

export default function Modality({ menu, setMenu, select, setSelect }: any) {
  const back = () => {
    setMenu("default");
  };

  const toggleService = (value: string) => {
    if (select.includes(value)) {
      setSelect(select.filter((item: string) => item !== value));
    } else {
      setSelect([...select, value]);
    }
  };

  return (
    <View>
      <Header dynamic={back} title="Modelo" />
      <ScrollView
        className="px-5 mt-5"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className="gap-5">
          <BouncyCheckbox
            size={20}
            text="Presencial"
            textStyle={{
              textDecorationLine: "none",
              ...FONTS.fontBlack,
              color: "black",
            }}
            fillColor="#22c55e" // verde tipo Tailwind 'green-500'
            unfillColor="#f4f4f4"
            isChecked={select.includes("Presencial")}
            iconStyle={{ borderColor: "#22c55e" }}
            onPress={() => toggleService("Presencial")}
          />
          <View className="border-b border-[#a7a7a7]"></View>
          <BouncyCheckbox
            size={20}
            text="Híbrido"
            textStyle={{
              textDecorationLine: "none",
              ...FONTS.fontBlack,
              color: "black",
            }}
            fillColor="#22c55e" // verde tipo Tailwind 'green-500'
            unfillColor="#f4f4f4"
            isChecked={select.includes("Híbrido")}
            iconStyle={{ borderColor: "#22c55e" }}
            onPress={() => toggleService("Híbrido")}
          />
          <View className="border-b border-[#a7a7a7]"></View>
          <BouncyCheckbox
            size={20}
            text="Remoto"
            textStyle={{
              textDecorationLine: "none",
              ...FONTS.fontBlack,
              color: "black",
            }}
            fillColor="#22c55e" // verde tipo Tailwind 'green-500'
            unfillColor="#f4f4f4"
            isChecked={select.includes("Remoto")}
            iconStyle={{ borderColor: "#22c55e" }}
            onPress={() => toggleService("Remoto")}
          />
        </View>
      </ScrollView>
    </View>
  );
}
