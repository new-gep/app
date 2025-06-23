import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Header from "~/src/layout/Header";

export default function History() {
  const createdAds = [
    { id: 1, title: "Entregas no centro", date: "05/06/2025", status: "Publicado" },
    { id: 2, title: "Mudança rápida", date: "01/06/2025", status: "Finalizado" },
  ];

  const acceptedAds = [
    { id: 3, title: "Entrega para zona leste", date: "03/06/2025", status: "Em andamento" },
    { id: 4, title: "Carregar mercadoria", date: "29/05/2025", status: "Finalizado" },
  ];

  return (
    <View className="bg-white h-full">
      <Header leftIcon="back" title="Histórico" />

      <ScrollView className="px-4 pt-4">
        {/* Anúncios Criados */}
        <Text className="text-lg font-bold mb-2">Seus anúncios</Text>
        {createdAds.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-2xl p-4 mb-3"
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text className="text-base font-semibold">{item.title}</Text>
            <Text className="text-gray-500 mt-1">Data: {item.date}</Text>
            <Text className="text-green-600 mt-1">Status: {item.status}</Text>
          </View>
        ))}

        {/* Anúncios Aceitos */}
        <Text className="text-lg font-bold mt-6 mb-2">Anúncios que você aceitou</Text>
        {acceptedAds.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-2xl p-4 mb-3"
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text className="text-base font-semibold">{item.title}</Text>
            <Text className="text-gray-500 mt-1">Data: {item.date}</Text>
            <Text className="text-blue-600 mt-1">Status: {item.status}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
