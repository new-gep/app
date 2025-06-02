import React, { useRef } from "react";
import { View, Text, Animated } from "react-native";
import Picture from "./Helper/Picture";
import HeaderStyle4 from "~/src/components/Headers/HeaderStyle4";
import useCollaborator from "~/src/function/fetchCollaborator";
// import List from "./Helper/List";
import List from "~/src/components/Menu/List";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { collaborator, fetchCollaborator } = useCollaborator();
  const logout = async () => {
    await AsyncStorage.clear();
  };

  const about = [
    {
      icon: "user_outline",
      title: "Sobre Mim",
      go: "About",
    },
    // {
    //   icon: "star_outline",
    //   title: "Trabalho",
    //   go: "Filter",
    // },
    {
      icon: "document_outline",
      title: "Currículo",
      go: "CV",
    },
    // {
    //   // icon: "signature_outline",
    //   title: "Serviço",
    //   // go: "CV",
    // },
    // {
    //   icon: "imageLibrary_outline",
    //   title: "Galeria",
    //   go: "Gallery",
    // },
    // {
    //   // icon: "signature_outline",
    //   title: "Redes Sociais",
    //   // go: "CV",
    // },
    {
      icon: "folder_outline",
      title: "Documentos",
      go: "Documents",
    },
    {
      icon: "signature_outline",
      title: "Assinatura",
      go: "Signature",
    },
    {
      icon: "social_outline",
      title: "Redes sociais",
      go: "Social",
    },
  ];
  const service = [
    {
      icon: "volunter_outline",
      title: "Serviço",
      go: "Service",
    },
    {
      icon: "star_outline",
      title: "Como trabalhar",
      go: "Filter",
    },
    {
      icon: "imageLibrary_outline",
      title: "Galeria",
      go: "Gallery",
    },
    {
      icon: "wallet_outline",
      title: "Carteira",
      go: "Wallet",
    },
  ];
  const conf = [
    {
      icon: "key_outline",
      title: "Mudar a Senha",
      go: "ChangePassword",
    },
    {
      icon: "help_outline",
      title: "Ajuda",
      go: "Help",
    },
    {
      icon: "logout_outline",
      title: "Sair",
      action: logout,
      go: "SingIn",
    },
  ];

  return (
    <View className="flex-1">
      <HeaderStyle4 title="Configurações" scrollY={scrollY} />
      <Animated.ScrollView
        className="bg-white px-6"
        contentContainerStyle={{ paddingTop: 90 }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <Picture collaborator={collaborator} />
        <View>
          <List items={about} />
        </View>
        <View className="mt-5">
          <List items={service} />
        </View>
        <View className="mt-5 mb-5">
          <List items={conf} />
        </View>
        <Text className="text-gray-400 text-right">Gep version 2.0v</Text>
      </Animated.ScrollView>
    </View>
  );
}
