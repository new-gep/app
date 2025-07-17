import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { rf } from "~/src/hooks/utils/responsiveFont";
import Header from "~/src/layout/Header";
import SwipeableCardPeopleActive from "./Card";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
const SCREEN_WIDTH = Dimensions.get("window").width;
import { FlatList } from "react-native-gesture-handler";
import deleteAnnouncement from "~/src/hooks/delete/announcement";
import FindAnnouncement from "~/src/hooks/findOne/announcement";
import { useNavigation } from "@react-navigation/native";
import useCollaborator from "~/src/function/fetchCollaborator";
import { FONTS } from "~/src/constants/theme";
import { IMAGES } from "~/src/constants/Images";
import Service from "./Card/Service";
export default function Active() {
  const [data, setData] = useState<any>(null);
  const navigation = useNavigation<any>();
  const { collaborator } = useCollaborator();
  const { width, height } = Dimensions.get("window");

  const delet = async (id: number) => {
    Alert.alert(
      "Excluir anúncio",
      "Tem certeza que deseja excluir este anúncio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const response = await deleteAnnouncement(id);
              if (response?.status === 200) {
                setData((prev: any) =>
                  prev.filter((item: any) => item.id !== id)
                );
                Alert.alert("Sucesso", "O anúncio foi excluído com sucesso.", [
                  { text: "OK" },
                ]);
              }
            } catch (error) {
              Alert.alert(
                "Erro",
                "Ocorreu um erro ao tentar excluir o anúncio.",
                [{ text: "OK" }]
              );
              console.error("Erro ao deletar anúncio:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const edit = async (item: any) => {
    navigation.navigate("AnnouncementCreate", item);
  };

  const find = async (cpf: string) => {
    const response = await FindAnnouncement(cpf);
    if (response?.status == 200 && response.announcements.length > 0) {
      setData(response.announcements);
      return;
    }
    setData(false);
  };

  const render = ({ item }: { item: any }) => {
    if (item.creator == "my") {
      return (
        <SwipeableCardPeopleActive
          item={item}
          editAnnouncement={() => edit(item)}
          deleteAnnouncement={() => delet(item.id)}
        />
      );
    }
    if (item.creator == "other") {
      return (
        <Service item={item} />
      )
    }

    return null;
  };

  useEffect(() => {
    if (collaborator && (!data || data.length === 0)) {
      find(collaborator.CPF);
    }
  }, [collaborator]);

  return (
    <BottomSheetModalProvider>
      <View className="bg-white h-full">
        <Header leftIcon="back" title="Anúncio Ativo" />
        {data === null ? (
          <View className="h-full w-full items-center mt-10">
            <View className="gap-1">
              <ActivityIndicator color="#2f2f2f" />
              <Text style={{ ...FONTS.fontSemiBold }}>Carregando</Text>
            </View>
          </View>
        ) : !data ? (
          <View className="items-center justify-center h-3/4 ">
            <Image
              source={IMAGES.unique28}
              style={{
                height: height * 0.4,
                width: width * 0.8,
                resizeMode: "contain",
                opacity: 0.8,
              }}
            />
            <Text
              style={{ ...FONTS.fontSemiBold, fontSize: rf(13) }}
              className=""
            >
              Nenhum anúncio encontrado!
            </Text>
            <Text style={{ ...FONTS.fontLight, fontSize: rf(11) }} className="">
              Crie um agora para começar
            </Text>
          </View>
        ) : (
          <FlatList
            data={data}
            // renderItem={({ item }) => (
            //   <SwipeableCardPeopleActive
            //     item={item}
            //     editAnnouncement={() => edit(item)}
            //     deleteAnnouncement={() => delet(item.id)}
            //   />
            // )}
            renderItem={render}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardWrapper: {
    position: "relative",
    width: SCREEN_WIDTH - rf(30),
    minHeight: rf(20),
  },
  cardContainer: {
    width: SCREEN_WIDTH - rf(32),
    minHeight: rf(20),
    overflow: "visible",
  },
  card: {
    width: "100%",
    minHeight: rf(80),
    overflow: "visible",
  },
});
