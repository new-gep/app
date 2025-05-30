import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Header from "~/src/layout/Header";

const SOCIALS = [
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "facebook", label: "Facebook", icon: "facebook" },
  { key: "linkedin", label: "LinkedIn", icon: "linkedin" },
  { key: "twitter", label: "Twitter", icon: "twitter" },
  { key: "tiktok", label: "TikTok", icon: "tiktok" },
  { key: "youtube", label: "YouTube", icon: "youtube" },
];

export default function SocialCardForm() {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View className="h-full bg-white">
      <Header title="Redes Sociais" leftIcon="back" />
      <ScrollView className="p-6">
        {/* <Text style={styles.title}>Adicione suas redes sociais</Text> */}

        {SOCIALS.map((item) => (
          <View key={item.key} style={styles.card}>
            <MaterialCommunityIcons
              name={item.icon}
              size={28}
              color="#444"
              style={styles.icon}
            />
            {/* <Text style={styles.label}>{item.label}</Text> */}
            <TextInput
              style={styles.input}
              placeholder={`Link ou @ do ${item.label}`}
              placeholderTextColor="#999"
              value={socialLinks[item.key] || ""}
              onChangeText={(value) => handleChange(item.key, value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
