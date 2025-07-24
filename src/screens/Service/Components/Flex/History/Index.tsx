import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import Header from "~/src/layout/Header";
import MyServiceCard from "./Card/MyService";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ScrollView, FlatList, Pressable } from "react-native-gesture-handler";
import Service from "./Card/Service";
import FindHistory from "~/src/hooks/get/announcement/history";
import useCollaborator from "~/src/function/fetchCollaborator";
import AwaitFetch from "~/src/components/LoadScreen/Load";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { IMAGES } from "~/src/constants/Images";

export default function History() {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  const { collaborator } = useCollaborator();
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!collaborator) return;
        const response = await FindHistory(collaborator.CPF);
        if (response.status == 200) {
          setHistoryData(response.history);
        }
        setLoader(false);
      } finally {
        
      }
    };

    fetchData();
  }, [collaborator]);

  const render = ({ item }: { item: any }) => {
    if(item.respondedByUser){
      return (
        <Service item={item} />
      )
    }
    if(item.createdByUser){
      return <MyServiceCard item={item}/>
    }

    return null;
  };

  return (
    <BottomSheetModalProvider>
      <View className="bg-white h-full">
        <Header leftIcon="back" title="Histórico" />
        <ScrollView className="px-4 pt-4">
          {loader ? (
            <AwaitFetch />
          ) : historyData.length > 0 ? (
            <FlatList
              data={historyData}
              renderItem={render}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <View className="items-center justify-center h-full ">
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
                Nenhum histórico encontrado!
              </Text>
              <Text
                style={{ ...FONTS.fontLight, fontSize: rf(11) }}
                className="text-center"
              >
                Fique tranquilo, em breve seus serviços estarão disponíveis.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </BottomSheetModalProvider>
  );
}
