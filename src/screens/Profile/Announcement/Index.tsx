import React from "react";
import { View, Text, ScrollView } from "react-native";
import List from "~/src/components/Menu/List";
import Header from "~/src/layout/Header";

export default function Announcement() {
  const Announcement = [
    {
      icon: "flash_outline",
      title: "Ativos",
      go: 'AnnouncementActive',
      //   setVariable: setCv,
    },
    {
      icon: "addCircle_outline",
      title: "Criar Anúncio",
      go: 'AnnouncementCreate',
      //   setVariable: setCv,
    },
    {
      icon: "history_outline",
      title: "Histórico",
      go: 'AnnouncementHistory',
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
