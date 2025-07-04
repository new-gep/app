import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Header from "~/src/layout/Header";
import UpdateCollaborator from "~/src/hooks/update/collaborator";
import useCollaborator from "~/src/function/fetchCollaborator";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { useNavigation } from "@react-navigation/native";
const SOCIALS = [
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "facebook", label: "Facebook", icon: "facebook" },
  { key: "linkedin", label: "LinkedIn", icon: "linkedin" },
  { key: "twitter", label: "Twitter", icon: "twitter" },
  { key: "tiktok", label: "TikTok", icon: "tiktok" },
  { key: "youtube", label: "YouTube", icon: "youtube" },
  { key: "site", label: "Site", icon: "chrome" },
];

export default function SocialCardForm() {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const { collaborator } = useCollaborator();
  const navigation = useNavigation<any>();
  const handleChange = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  const saveSocial = async () => {
    if (!collaborator) return;
    const response = await UpdateCollaborator(collaborator.CPF, {
      social: socialLinks,
    });
    if (response.status == 200) {
      Alert.alert("Sucesso", "Redes Sociais atualizado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
      return;
    }
  };

  return (
    <View className="h-full bg-white">
      <Header title="Redes Sociais" leftIcon="back" />
      <ScrollView className="p-6" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* <Text style={styles.title}>Adicione suas redes sociais</Text> */}

        {SOCIALS.map((item) => (
          <View
            key={item.key}
            className="bg-white flex-row rounded-lg items-center p-3 mb-5"
            style={styles.container}
          >
            <FontAwesome5
              name={item.icon}
              size={22}
              color="#444"
              style={styles.icon}
            />
            {/* <Text style={styles.label}>{item.label}</Text> */}
            <TextInput
              style={styles.input}
              placeholder={
                item.label.toLowerCase() === "site"
                  ? "Link do seu Site"
                  : `Link ou @ do ${item.label}`
              }
              placeholderTextColor="#999"
              value={socialLinks[item.key] || ""}
              onChangeText={(value) => handleChange(item.key, value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        className="bg-[#fde047] py-4 rounded-t-[20px] mx-4 mb-2"
        onPress={() => console.log("CONCLUÍDO pressed")}
      >
        <Text
          className="text-dark text-center"
          style={{ ...FONTS.fontBold, fontSize: rf(16) }}
          onPress={saveSocial}
        >
          CONCLUÍDO
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#111",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    width: 80,
    fontSize: 16,
    color: "#444",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
    color: "#000",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
