import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import Header from "~/src/layout/Header";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ScrollView, FlatList, Pressable } from "react-native-gesture-handler";
import Work from "./Card/Work";
import useCollaborator from "~/src/function/fetchCollaborator";
import HistoryJob from "~/src/hooks/get/job/history";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { IMAGES } from "~/src/constants/Images";
import AwaitFetch from "~/src/components/LoadScreen/Load";

export default function History() {

  const { collaborator } = useCollaborator();
  const [historyData, setHistoryData] = useState<any[]>([]);
  const { width, height } = Dimensions.get("window");
  const [loader, setLoader] = useState<boolean>(true);

  const render = ({ item }: { item: any }) => {
    return <Work item={item} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try{
        if (collaborator) {
          const history = await HistoryJob(collaborator.CPF);
          if (history.status == 200) {
            setHistoryData(history.data);
          }
        }
      }finally{
        setLoader(false);
      }
    };
    fetchData();
  }, [collaborator]);

  return (
    <BottomSheetModalProvider>
      <View className="bg-white h-full">
        <Header leftIcon="back" title="Histórico" />
        <ScrollView className="px-4 pt-4">
          { historyData.length > 0 ? (
            loader ?
             <AwaitFetch />
            :
            <FlatList
              data={historyData}
              renderItem={render}
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
