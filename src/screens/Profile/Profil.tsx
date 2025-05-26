import React, { useRef } from "react";
import { View, Text, Animated } from "react-native";
import Picture from "./Helper/Picture";
import HeaderStyle4 from "~/src/components/Headers/HeaderStyle4";
import useCollaborator from "~/src/function/fetchCollaborator";
import List from "./Helper/List";

export default function Profile() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { collaborator, fetchCollaborator } = useCollaborator();
  const about = [
    {
      icon: "person",
      title: "Sobre Mim",
      go: "About",
    },
    {
      icon: "star",
      title: "Trabalho",
      go: "Filter",
    },
    {
      icon: "file-badge",
      title: "Currículo",
      go: "CV",
    },
  ];

  return (
    <View className="flex-1">
      <HeaderStyle4 scrollY={scrollY} />
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
      </Animated.ScrollView>
    </View>
  );
}
