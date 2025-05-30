import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Header from "~/src/layout/Header";

const screenWidth = Dimensions.get("window").width;
const CARD_MARGIN = 8;
const NUM_COLUMNS = 3;
const CARD_SIZE =
  (screenWidth - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const SOCIALS = [
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "facebook", label: "Facebook", icon: "facebook" },
  { key: "linkedin", label: "LinkedIn", icon: "linkedin" },
  { key: "twitter", label: "Twitter", icon: "twitter" },
  { key: "tiktok", label: "TikTok", icon: "tiktok" },
  { key: "youtube", label: "YouTube", icon: "youtube" },
];

export default function Social() {
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const handlePress = (key: string) => {
    setActiveInput(key === activeInput ? null : key);
  };

  const handleChange = (key: string, value: string) => {
    setSocialLinks((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View className="h-full bg-white">
      <Header title="Redes Sociais" leftIcon="back" />
      <ScrollView className="p-6">
        <Text className="text-black text-base font-semibold mb-2">
          Adicione suas redes
        </Text>

        <View style={styles.grid}>
          {SOCIALS.map((item) => (
            <View key={item.key} style={styles.cardWrapper}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => handlePress(item.key)}
              >
                <MaterialCommunityIcons
                  icon={item.icon}
                  size={32}
                  color="#444"
                />
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>

              {activeInput === item.key && (
                <TextInput
                  style={styles.input}
                  placeholder={`Link ou @ do ${item.label}`}
                  placeholderTextColor="#999"
                  value={socialLinks[item.key] || ""}
                  onChangeText={(value) => handleChange(item.key, value)}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardWrapper: {
    width: CARD_SIZE,
    marginRight: CARD_MARGIN,
    marginBottom: CARD_MARGIN,
  },
  card: {
    width: "100%",
    height: CARD_SIZE,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    color: "#444",
  },
  input: {
    marginTop: 6,
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    color: "#000",
  },
});
