import React, { useEffect, useState } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { View, Text, Image, Dimensions } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Header from "~/src/layout/Header";
import ProcessCard from "./Card";
import useCollaborator from "~/src/function/fetchCollaborator";
import ProcessJob from "~/src/hooks/get/job/process";
import { IMAGES } from "~/src/constants/Images";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";

export default function Process() {
  const { collaborator } = useCollaborator();
  const [process, setProcess] = useState<any>([]);
  const { width, height } = Dimensions.get("window");

  const render = ({ item }: { item: any }) => {
    return <ProcessCard item={item} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (collaborator) {
        const process = await ProcessJob(collaborator.CPF);
        if (process.status == 200) {
          setProcess(process.data);
        }
      }
    };
    fetchData();
  }, [collaborator]);

  return (
    <BottomSheetModalProvider>
      <View className="bg-white h-full">
        <Header leftIcon="back" title="Processos" />
        <ScrollView className="px-4 pt-4">
          {process.length > 0 ? (
            <FlatList data={process} renderItem={render} />
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
                Nenhum processo encontrado!
              </Text>
              <Text
                style={{ ...FONTS.fontLight, fontSize: rf(11) }}
                className="text-center"
              >
                Fique tranquilo, em breve seus processo estarão disponíveis.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </BottomSheetModalProvider>
  );
}
