import React from "react";
import { View, Text, ScrollView } from "react-native";
import List from "~/src/components/Menu/List";
import Header from "~/src/layout/Header";

export default function Announcement() {
  const Announcement = [
    {
      icon: "search_outline",
      title: "Buscar",
    //   variable: cv,
    //   setVariable: setCv,
    },
    {
      icon: "flash_outline",
      title: "Ativos",
    //   variable: cv,
    //   setVariable: setCv,
    },
    {
      icon: "addCircle_outline",
      title: "Criar Anúncio",
    //   variable: cv,
    //   setVariable: setCv,
    },
    {
      icon: "history_outline",
      title: "Histórico",
    //   variable: upload,
    //   setVariable: setUpload,
    },
  ];


  return (
    <View className="h-full bg-white">
      <Header leftIcon="back" title="Anúncio"/>
      <ScrollView
        className="p-6"
      >
        <View>
            <List items={Announcement}/>
        </View>
      </ScrollView>
    </View>
  );
}
