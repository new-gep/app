import { View, Text, ScrollView } from "react-native";
import Header from "~/src/layout/Header";

export default function Review() {
  return (
    <View className="h-full bg-white">
      <Header
        title="Meu Perfil"
        leftIcon={"back"}
      />
      <ScrollView>

      </ScrollView>
    </View>
  );
}
