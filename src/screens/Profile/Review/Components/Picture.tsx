import { View, Text, Image } from "react-native";
import {
  Check,
  CircleCheckBig,
  CopyCheck,
  CircleCheck,
} from "lucide-react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FindBucketCollaborator from "~/src/hooks/bucket/collaborator";
import SaveCacheFile from "~/src/hooks/utils/SaveCacheFile";
import { IMAGES } from "~/src/constants/Images";
import useCollaborator from "~/src/function/fetchCollaborator";
import Mask from "~/src/function/mask";
export default function Picture() {
  const [path, setPath] = useState<any>(false);
  const { collaborator } = useCollaborator();

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
    getPicture();
  }, [collaborator]);

  return (
    <View className="items-center rounded-2xl mb-4 shadow-md bg-white">
      <View className="relative mb-4">
        <View className="rounded-full p-2">
          <View
            style={{ height: rf(120), width: rf(120) }}
            className={`rounded-full border-gray-200 bg-gray-200 ${
              !path && "p-2"
            }`}
          >
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
        {/* {1 && (
          <View className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
            <CircleCheck size={24} color="#fde047" />
          </View>
        )} */}
      </View>
      <Text
        style={{ fontSize: rf(20), ...FONTS.fontBold }}
        className="text-center"
      >
        {collaborator?.name ? `${Mask('fullName',collaborator.name)}` : "Nome não informado"}
      </Text>
      <Text className="text-base text-custom-gray-500 mb-3">
        {collaborator?.birth ? `${Mask('age',collaborator.birth)}` : "Idade não informada"}
      </Text>
      {/* {1 && (
        <View className="flex-row items-center bg-primary px-3 py-1.5 rounded-xl">
          <CircleCheckBig size={20} color="#2f2f2f" />
          <Text
            style={{ ...FONTS.font }}
            className="ml-1.5 text-sm font-semibold text-dark"
          >
            Verificado
          </Text>
        </View>
      )} */}
    </View>
  );
}
