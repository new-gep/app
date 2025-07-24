import { useEffect, useState } from "react";
import { View, Text, Image, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { FONTS } from "~/src/constants/theme";
import useCollaborator from "~/src/function/fetchCollaborator";
import FindFile from "~/src/hooks/findOne/collaborator/file";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { CameraOff } from "lucide-react-native";
const screenWidth = Dimensions.get("window").width;
const CARD_SPACING = 8;
const boxSize = (screenWidth - 50 - 2 * 8) / 3;
export default function Gallery() {
  const { collaborator } = useCollaborator();
  const [gallery, setGallery] = useState<Array<any>>([]);

  const useFetchData = async () => {
    if (!collaborator) return;
    const response = await FindFile("gallery", collaborator.CPF);
    if (response.status == 200) {
      setGallery(response.path);
    }
  };

  useEffect(() => {
    if (collaborator) {
      useFetchData();
    }
  }, [collaborator]);

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={Style.container} className="bg-white p-3 rounded-lg mt-3">
      <Text
        className="mb-6"
        style={{ fontSize: rf(18), ...FONTS.fontSemiBold }}
      >
        Minha Galeria
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {gallery ? (
          <View className="flex flex-row flex-wrap gap-3 mb-4">
            {[...Array(3)].map((_, i) => (
              <View
                key={i}
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
                  <Text style={{ fontSize: rf(26), color: "#aaa" }}>
                    <CameraOff size={rf(20)}/>
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center justify-center h-full">
            <Text
              className="mb-2"
              style={{ ...FONTS.fontBlack, fontSize: rf(13) }}
            >
              Carregando
            </Text>
            <ActivityIndicator color={"black"} />
          </View>
        )}
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
  tag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
    color: "black",
  },
};

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

