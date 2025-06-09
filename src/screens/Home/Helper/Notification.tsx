import React from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "~/src/layout/Header";
import { Bell, CheckCircle, Info, XCircle } from "lucide-react-native";

export default function Notification() {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Anúncio publicado",
      message: "Seu anúncio 'Entrega expressa' foi publicado com sucesso!",
      date: "06/06/2025",
    },
    {
      id: 2,
      type: "info",
      title: "Novo anúncio aceito",
      message: "Você aceitou o anúncio 'Mudança residencial'.",
      date: "05/06/2025",
    },
    {
      id: 3,
      type: "warning",
      title: "Anúncio finalizado",
      message: "O anúncio 'Entrega zona sul' foi finalizado.",
      date: "04/06/2025",
    },
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={22} color="#22c55e" className="mr-3" />;
      case "info":
        return <Info size={22} color="#3b82f6" className="mr-3" />;
      case "warning":
        return <XCircle size={22} color="#f97316" className="mr-3" />;
      default:
        return <Bell size={22} color="#6b7280" className="mr-3" />;
    }
  };

  return (
    <View className="bg-white h-full">
      <Header leftIcon="back" title="Notificações" />
      <ScrollView className="px-4 pt-4 pb-8">
        {notifications.map((item) => (
          <View
            key={item.id}
            className="flex-row items-start bg-white rounded-xl border border-zinc-200 px-4 py-3 mb-3"
            style={{
              elevation: 3,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            }}
          >
            {renderIcon(item.type)}
            <View className="flex-1">
              <Text className="font-semibold text-zinc-800">{item.title}</Text>
              <Text className="text-sm text-zinc-600 mt-0.5">{item.message}</Text>
              <Text className="text-xs text-zinc-400 mt-1">{item.date}</Text>
            </View>
          </View>
        ))}
        {notifications.length === 0 && (
          <Text className="text-center text-zinc-500 mt-10">Você não tem notificações no momento.</Text>
        )}
      </ScrollView>
    </View>
  );
}
