import { View, Text, Image, Dimensions } from "react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";

export default function Gallery() {
  const data = {
    gallery: {
      photos: [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      ],
      videos: [
        "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=400&q=80",
      ],
    },
  };

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
        {data.gallery.photos.map((media, index) => (
          <View
            key={index}
            className="rounded-xl mb-2 overflow-hidden"
            style={{
              width: (screenWidth - 80) / 3,
              height: (screenWidth - 80) / 3,
            }}
          >
            <Image source={{ uri: media }} className="w-full h-full" />
          </View>
        ))}
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
