import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function AboutMy({text, setText} :any) {
  const maxLength = 200;

  return (
    <View style={styles.card} className="p-4 mb-4 rounded-lg">
      {/* <Text className="">Sobre mim</Text> */}
      <View>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Escreva algo sobre você..."
          placeholderTextColor="#999"
          multiline
          maxLength={maxLength}
        />
        <Text className="text-right justify-end text-xs text-gray-500">
          {text.length}/{maxLength}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  select: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
});
