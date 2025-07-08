import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import Header from "~/src/layout/Header";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { Video, Camera, CameraOff } from "lucide-react-native";
import ModalUpload from "../../Service/Components/Flex/Create/ModalUpload";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import uploadFile from "~/src/hooks/upload/picture";
import useCollaborator from "~/src/function/fetchCollaborator";
import { FONTS } from "~/src/constants/theme";
// Tamanho da tela
const screenWidth = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 24; // p-6 = 24px
const CARD_SPACING = 8; // margem entre os cards
const NUM_COLUMNS = 3;
const boxSize = (screenWidth - 50 - 2 * 8) / 3;
// Calcula a largura do card
const CARD_SIZE = (screenWidth - HORIZONTAL_PADDING * 2 - CARD_SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export default function Gallery() {
  const { collaborator } = useCollaborator();
  const [images, setImages] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [zoomVisible, setZoomVisible] = useState<boolean>(false);
  const [gallery, setGallery] = useState<Array<any>>([]);
  const [oldGallery, setOldGallery] = useState<Array<any>>([]);
  const [visibleUpload, setVisibleUpload] = useState<boolean>(false);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<Array<any>>([]);

  const openImage = (uri: string) => {
    setActiveImage(uri);
    setZoomVisible(true);
  };

  const handleSave = async () => {
    if (!collaborator) return;
    if (gallery && gallery.length > 0) {
      for (const file of gallery) {
        const uri = file?.uri || file;
        if (uri) {
          const response = await uploadFile(
            uri,
            "gallery",
            "complet",
            collaborator.CPF
          );
          console.log("aqui: ", response);
        };
      };
    } else {
      Alert.alert("Falha", "Faça o upload de uma imagem primeiro!", [
        {
          text: "OK",
        },
      ]);
    };
  };

  useEffect(()=>{

  },[])

  return (
    <BottomSheetModalProvider>
      <View className="h-full bg-white">
        <Header title="Galeria" leftIcon="back" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <ModalUpload
            selectedGalleryIndex={selectedGalleryIndex}
            setSelectedGalleryIndex={setSelectedGalleryIndex}
            setGallerty={setGallery}
            visible={visibleUpload}
            setVisible={setVisibleUpload}
          />

          {/* FOTOS */}
          <Text style={styles.sectionTitle}>Fotos</Text>
          <View className="flex flex-row flex-wrap gap-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  // if (gallery[i]) return;
                  // @ts-ignore
                  setSelectedGalleryIndex(i);
                  setVisibleUpload(true); // abrir modal
                }}
                className="rounded-lg items-center justify-center overflow-hidden bg-gray-100"
                style={[styles.card, { width: boxSize, height: rf(150) }]}
              >
                {gallery[i]?.base64 || gallery[i]?.uri || gallery[i] ? (
                  <Image
                    source={{
                      uri: gallery[i]?.base64 || gallery[i]?.uri || gallery[i],
                    }} // <- garante que funcione se for string ou objeto
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Text style={{ fontSize: rf(26), color: "#aaa" }}>+</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
        </ScrollView>
        <TouchableOpacity
          className="bg-[#fde047] py-4 rounded-t-[20px] mx-4 mb-2"
          onPress={handleSave}
        >
          <Text
            className="text-dark text-center"
            style={{ ...FONTS.fontBold, fontSize: rf(16) }}
          >
            SALVAR
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  card: {
    height: 150,
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: rf(16),
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
  // card: {
  //   width: CARD_SIZE,
  //   height: CARD_SIZE,
  //   borderRadius: 12,
  //   backgroundColor: "#f0f0f0",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   overflow: "hidden",
  // },
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
