import React from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "~/src/layout/Header";

export default function Active() {
  const createdAds = [
    { id: 1, title: "Entrega urgente zona sul", date: "06/06/2025", status: "Ativo" },
    { id: 2, title: "Carona para cargas leves", date: "05/06/2025", status: "Ativo" },
  ];

  const acceptedAds = [
    { id: 3, title: "Entrega expressa loja X", date: "06/06/2025", status: "Aceito" },
    { id: 4, title: "Busca de documentos", date: "05/06/2025", status: "Aceito" },
  ];

  return (
    <View className="bg-white h-full">
      <Header leftIcon="back" title="Anúncio Ativo" />

      <ScrollView className="px-4 pt-4">
        {/* Anúncios Criados Ativos */}
        <Text className="text-lg font-bold mb-2">Seus anúncios ativos</Text>
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

        {/* Anúncios Aceitos Ativos */}
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
