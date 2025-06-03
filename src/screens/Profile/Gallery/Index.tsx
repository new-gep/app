import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import Header from "~/src/layout/Header";

// Tamanho da tela
const screenWidth = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 24; // p-6 = 24px
const CARD_SPACING = 8; // margem entre os cards
const NUM_COLUMNS = 3;

// Calcula a largura do card
const CARD_SIZE =
  (screenWidth - HORIZONTAL_PADDING * 2 - CARD_SPACING * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      const updated = [...images];
      updated[index] = result.assets[0].uri;
      setImages(updated);
    }
  };

  const pickVideo = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
    if (!result.canceled && result.assets.length > 0) {
      const updated = [...videos];
      updated[index] = result.assets[0].uri;
      setVideos(updated);
    }
  };

  return (
    <View className="h-full bg-white">
      <Header title="Galeria" leftIcon="back" />
      <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom:50}}>
        {/* FOTOS */}
        <Text style={styles.sectionTitle}>Fotos</Text>
        <View style={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.cardWrapper,
                (i + 1) % NUM_COLUMNS !== 0 && { marginRight: CARD_SPACING },
              ]}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => pickImage(i)}
              >
                {images[i] ? (
                  <Image source={{ uri: images[i] }} style={styles.media} />
                ) : (
                  <MaterialIcons name="add" size={32} color="#999" />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* VÍDEOS */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Vídeos</Text>
        <View style={styles.grid}>
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.cardWrapper,
                (i + 1) % NUM_COLUMNS !== 0 && { marginRight: CARD_SPACING },
              ]}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => pickVideo(i)}
              >
                {videos[i] ? (
                  <View style={styles.videoPlaceholder}>
                    <MaterialIcons name="videocam" size={28} color="#fff" />
                    <Text style={{ color: "#fff", marginTop: 4, fontSize: 12 }}>
                      Vídeo {i + 1}
                    </Text>
                  </View>
                ) : (
                  <MaterialIcons name="add" size={32} color="#999" />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  cardWrapper: {
    marginBottom: CARD_SPACING,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
});
