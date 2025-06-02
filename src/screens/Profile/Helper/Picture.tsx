import { View, Text, Image, TouchableOpacity } from "react-native";
import { IMAGES } from "../../../constants/Images";
import { FONTS } from "../../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import Icon from "~/src/components/Icon/Icon";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import FindBucketCollaborator from "~/src/hooks/bucket/collaborator";
import SaveCacheFile from "~/src/hooks/utils/SaveCacheFile";
import Mask from "~/src/function/mask";
import List from "~/src/components/Menu/List";

export default function Picture({ collaborator }: { collaborator?: any }) {
  const [path, setPath] = useState<any | null>(null);
  const navigation = useNavigation<any>();

  const getPicture = async () => {
    const storedImagePath = await AsyncStorage.getItem("collaboratorImage");
    if (storedImagePath) {
      setPath(`${storedImagePath}`);
      return;
    }
    try {
      const response = await FindBucketCollaborator(
        //@ts-ignore
        collaborator.CPF,
        "Picture"
      );

      if (response.status === 200 && response.path) {
        SaveCacheFile(response.path, "collaboratorImage", setPath);
        
      } else {
        console.warn("Resposta inválida da API ou sem base64.");
      }
    } catch (error) {
      // console.log("Erro ao buscar imagem:", error);
      console.error("Erro ao resgatar a imagem:", error);
    }
  };

  useEffect(() => {
    if (collaborator) {
      getPicture();
    }
  }, [collaborator]);

  return (
    <View style={Style.container} className="bg-white rounded-lg mb-4">
      <TouchableOpacity
        onPress={() => navigation.navigate("EditProfile")}
        className="bg-white justify-between flex-row p-4 rounded-lg"
      >
        <View className="flex-row items-center w-2/12 ">
          <View className={`w-16 h-16 rounded-full border-gray-200 bg-gray-200 ${!path && "p-2"}`}>
            <Image
              className={`w-full h-full ${path ? "rounded-full" : ""}`}
              source={path ? { uri: path } : IMAGES.user2}
              tintColor={path ? undefined : "gray"}
              onError={(e) =>
                console.warn("Erro ao renderizar:", e.nativeEvent.error)
              }
            />
          </View>
        </View>
        <View className="w-7/12 items-end justify-center">
          <View>
            <Text style={{ ...FONTS.font, fontSize: 17 }} className="text-dark text-right">
              {collaborator && Mask("fullName", collaborator.name)}
            </Text>
            <Text className="text-center" style={{ ...FONTS.font, fontSize: 14, color: "gray" }}>
              Recado
            </Text>
          </View>
        </View>
        <View className="w-2/12 items-end  justify-center">
          <MaterialIcons name="keyboard-arrow-right" size={21} color="black" />
        </View>
      </TouchableOpacity>
      <View className="border-t border-[#e5e7eb]">
        <List isUnique={true} items={[{icon: "eye_outline", title: "Visualizar",go: "Review"}]} />
      </View>
    </View>
  );
}

const Style = {
  container: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};
