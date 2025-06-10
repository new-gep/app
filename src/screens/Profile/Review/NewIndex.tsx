import React from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "~/src/layout/Header";
import Picture from "./Components/Picture";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Personal from "./Components/Personal";
import Interests from "./Components/Interests";
import Work from "./Components/Work";
import Gallery from "./Components/Gallery";
import Media from "./Components/Media";
import Service from "./Components/Service";

export default function Review() {
  return (
    <View className="bg-white h-full">
      <Header leftIcon="back" title="Perfil" />
      <ScrollView className="px-6 py-2" contentContainerStyle={{ paddingBottom: 50 }}>
        <Picture />
        <About />
        <Contact />
        <Interests />
        <Personal />
        <Service />
        <Work />
        <Gallery />
        <Media />
      </ScrollView>
    </View>
  );
}
