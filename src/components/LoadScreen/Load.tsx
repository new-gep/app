import { ActivityIndicator, View, Text  } from "react-native";
import { FONTS } from "~/src/constants/theme";

export default function AwaitFetch() {
  return (
    <View className="h-full w-full items-center mt-10">
      <View className="gap-1">
        <ActivityIndicator color="#2f2f2f" />
        <Text style={{ ...FONTS.fontSemiBold }}>Carregando</Text>
      </View>
    </View>
  );
}
