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
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import Header from "~/src/layout/Header";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { Video, Camera, CameraOff } from "lucide-react-native";
import FindFile from "~/src/hooks/findOne/collaborator/file";
import ModalUpload from "../../Service/Components/Flex/Create/ModalUpload";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import uploadFile from "~/src/hooks/upload/picture";
import useCollaborator from "~/src/function/fetchCollaborator";
import { FONTS } from "~/src/constants/theme";
import deleteCollaboratorFiles from "~/src/hooks/delete/collaborator/file";
// Tamanho da tela
const screenWidth = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 24; // p-6 = 24px
const CARD_SPACING = 8; // margem entre os cards
const NUM_COLUMNS = 3;
const boxSize = (screenWidth - 50 - 2 * 8) / 3;
// Calcula a largura do card
const CARD_SIZE =
  (screenWidth - HORIZONTAL_PADDING * 2 - CARD_SPACING * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;

export default function Gallery() {
  const { collaborator } = useCollaborator();
  const [saveLoad, setSaveLoad] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [zoomVisible, setZoomVisible] = useState<boolean>(false);
  const [gallery, setGallery] = useState<Array<any>>([]);
  const [oldGallery, setOldGallery] = useState<Array<any>>([]);
  const [visibleUpload, setVisibleUpload] = useState<boolean>(false);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<Array<any>>(
    []
  );

  const openImage = (uri: string) => {
    setActiveImage(uri);
    setZoomVisible(true);
  };

  const getKeysToDelete = (oldGallery: any[], currentGallery: any[]) => {
    const oldKeys = oldGallery
      .map((item) => (typeof item === "object" ? item.key : null))
      .filter(Boolean);

    const currentKeys = currentGallery
      .map((item) => (typeof item === "object" ? item.key : null))
      .filter(Boolean);

    const toDelete = oldKeys.filter((key) => !currentKeys.includes(key));
    return toDelete;
  };

  const handleSave = async () => {
    if (!collaborator){
      Alert.alert("Erro", "Não foi possivel verificar o usuario!");
      return
    } 
    setSaveLoad(true)

    // 1. Identificar imagens removidas
    const toDelete = getKeysToDelete(oldGallery, gallery);

    // 2. Deletar se houver
    await deleteCollaboratorFiles(toDelete);

    // 3. Fazer upload das novas imagens
    const newImages = gallery.filter((item) => {
      if (typeof item === "string") return true;
      setSaveLoad(false)
      return !item.key && (item.uri || item.base64);
    });

    for (const item of newImages) {
      const uri = typeof item === "string" ? item : item.uri || item.base64;
      await uploadFile(uri, "gallery", "complet", collaborator.CPF);
    }

    Alert.alert("Sucesso", "Imagens atualizadas!");
    setSaveLoad(false)
  };

  const useFetchData = async () => {
    if (!collaborator) return;
    const response = await FindFile("gallery", collaborator.CPF);
    if (response.status == 200) {
      setGallery(response.path);
      setOldGallery(response.path)
    }
    setLoader(true)
  };

  useEffect(() => {
    if (collaborator) {
      useFetchData();
    }
  }, [collaborator]);

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
          { loader ?
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
            :
            <View className="items-center justify-center">
              <Text className="mb-2" style={{...FONTS.fontBlack, fontSize: rf(13)}}>Carregando</Text>
              <ActivityIndicator color={'black'} />
            </View>
          }
        </ScrollView>


        <TouchableOpacity
          className="bg-[#fde047] py-4 rounded-t-[20px] mx-4 mb-2"
          onPress={handleSave}
        >
          { !saveLoad ?
            <Text
            className="text-dark text-center"
            style={{ ...FONTS.fontBold, fontSize: rf(16) }}
          >
            SALVAR
          </Text>
          :
           <ActivityIndicator color={"black"} size={28} />
          }
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
