import { View, Text, Linking, Pressable } from "react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Music,
} from "lucide-react-native";

export default function Media() {
  const socialData = {
    instagram: "@meuinsta",
    facebook: "https://facebook.com/meuperfil",
    linkedin: "https://linkedin.com/in/meulinkedin",
    twitter: "@meutwitter",
    tiktok: "https://www.tiktok.com/@meutiktok",
    youtube: "https://www.youtube.com/channel/abc123",
    website: "https://www.meusite.com.br",
  };

  const isUrl = (value: string) => value.startsWith("http");

  const icons = {
    instagram: Instagram,
    facebook: Facebook,
    linkedin: Linkedin,
    twitter: Twitter,
    tiktok: Music, // ícone alternativo para TikTok
    youtube: Youtube,
    website: Globe,
  };

  return (
    <View style={Style.container} className="bg-white p-3 rounded-lg mt-3">
      <Text style={{ fontSize: rf(18), ...FONTS.fontSemiBold }} className="mb-6">
        Redes Sociais
      </Text>

      <View className="flex-row flex-wrap gap-4">
        {Object.entries(socialData).map(([key, value]) => {
          const Icon = icons[key as keyof typeof icons];
          const isLink = isUrl(value);

          if (isLink) {
            return (
              <Pressable
                key={key}
                onPress={() => Linking.openURL(value)}
                className="items-center justify-center"
              >
                <Icon size={rf(22)} color="#2563EB" />
              </Pressable>
            );
          } else {
            return (
              <View key={key} className="flex-row items-center gap-2">
                <Icon size={rf(18)} color="#6B7280" />
                <Text style={{ ...FONTS.font, fontSize: rf(14) }}>{value}</Text>
              </View>
            );
          }
        })}
      </View>
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
};
