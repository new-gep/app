import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "~/src/components/Icon/Icon";
import { FONTS } from "~/src/constants/theme";
type ProfileItem = {
  id: number;
  name: string;
  completed: boolean;
  progress: number; // % de preenchimento desse item
  route: string; // nome da tela para navegação
  iconName: string; // nome do ícone
};

type ModalPercentageProps = {
  progress: any;
  visible: boolean;
  setVisible: (v: boolean) => void;
};

export default function ModalPercentage({
  visible,
  setVisible,
  progress,
}: ModalPercentageProps) {
  const navigation = useNavigation<any>();
  const screenHeight = Dimensions.get("window").height;

  const profileItems: ProfileItem[] = [
    {
      id: 1,
      name: "Galeria",
      completed: progress?.gallery || false,
      progress: 10,
      route: "Gallery",
      iconName: "imageLibrary_outline",
    },
    {
      id: 2,
      name: "Como trabalhar",
      completed: progress?.workPreferences || false, 
      progress: 10,
      route: "Filter",
      iconName: "star_outline",
    },
    {
      id: 3,
      name: "Serviço",
      completed: progress?.services || false,
      progress: 15,
      route: "Service",
      iconName: "volunter_outline",
    },
    {
      id: 4,
      name: "Redes Sociais",
      completed: progress?.socialNetworks || false,
      progress: 10,
      route: "Social",
      iconName: "social_outline",
    },
    {
      id: 5,
      name: "Assinatura",
      completed: progress?.signature || false,
      progress: 10,
      route: "Signature",
      iconName: "signature_outline",
    },
    {
      id: 6,
      name: "Documentos",
      completed: progress?.documents || false,
      progress: 10,
      route: "Documents",
      iconName: "folder_outline",
    },
    {
      id: 7,
      name: "Currículo",
      completed: progress?.resume || false,
      progress: 10,
      route: "CV",
      iconName: "document_outline",
    },
    {
      id: 8,
      name: "Sobre Mim",
      completed: progress?.aboutMe || false,
      progress: 10,
      route: "About",
      iconName: "user_outline",
    },
    {
      id: 9,
      name: "Dados Pessoais",
      completed: progress?.personalData || false,
      progress: 5,
      route: "EditProfile",
      iconName: "user_outline",
    },
  ];

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.8}
      animationInTiming={300}
      animationOutTiming={300}
      onBackdropPress={() => setVisible(false)}
      useNativeDriver={true}
    >
      <View className="flex-1 justify-center items-center">
        <View
          className="bg-white rounded-2xl p-6 w-full"
          style={{
            maxWidth: 400,
            maxHeight: screenHeight * 0.8,
          }}
        >
          <Text
            style={{ fontSize: rf(20), ...FONTS.fontBlack }}
            className=" mb-4 text-center "
          >
            Progresso do Perfil
          </Text>

          <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
            {[...profileItems]
              .sort((a, b) => Number(a.completed) - Number(b.completed))
              .map((item, index, array) => (
                <TouchableOpacity
                  key={item.id}
                  className={`flex-row justify-between items-center py-3 ${
                    index !== array.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                  onPress={() => {
                    setVisible(false);
                    navigation.navigate(item.route);
                  }}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center space-x-3">
                    <View
                      style={{
                        width: rf(23),
                        height: rf(23),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Icon name={item.iconName} />
                    </View>

                    <View>
                      <Text
                        style={{ fontSize: rf(14), ...FONTS.fontLight }}
                        className="text-gray-800"
                      >
                        {item.name}
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`px-3 py-1 rounded-full ${
                      item.completed ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    <Text
                      style={{ fontSize: rf(14) }}
                      className={`font-semibold ${
                        item.completed ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {item.completed ? "Completo" : "Pendente"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>

          {/* <TouchableOpacity
            onPress={() => setVisible(false)}
            className="bg-primary py-3 rounded-full"
          >
            <Text
              style={{ fontSize: rf(16) }}
              className="text-dark text-center font-semibold"
            >
              Fechar
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
}
