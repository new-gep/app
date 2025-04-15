import React from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "../../../layout/Header";
export default function Dossie() {
  return (
    <View className="bg-white  h-full">
      <Header
        title="Dossiê"
        leftIcon={"back"}
        iconSimple={"folder"}
      />
      <Text> Dossiê </Text>
      
      <ScrollView>
        
      </ScrollView>
    </View>
  );
}
