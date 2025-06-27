import React from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { View, Text } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Header from "~/src/layout/Header";
import ProcessCard from "./Card";

export default function Process() {
  const fakeData = [
    {
      id: 1,
      CNPJ_Company: {
        cnpj: "37335118000180",
        name: "CNPJA TECNOLOGIA LTDA",
      },
      job: {
        function: "Programador",
      },
      process: "admission",
      step: 3,
    },
    {
      id: 1,
      CNPJ_Company: {
        cnpj: "37335118000180",
        name: "CNPJA TECNOLOGIA LTDA",
      },
      job: {
        function: "Borracheiro",
      },
      process: "dismissal",
      step: 1,
    },
  ];

  const render = ({ item }: { item: any }) => {
    return <ProcessCard item={item} />;
  };
  return (
    <BottomSheetModalProvider>
      <View className="bg-white h-full">
        <Header leftIcon="back" title="Processos" />
        <ScrollView className="px-4 pt-4">
          <FlatList
            data={fakeData}
            renderItem={render}
            keyExtractor={(item) => item.id.toString()}
          />
        </ScrollView>
      </View>
    </BottomSheetModalProvider>
  );
}
