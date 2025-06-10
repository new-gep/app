import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import Header from "~/src/layout/Header";
import {
  Bell,
  CircleCheck,
  Info,
  XCircle,
  Trash,
  Eye,
} from "lucide-react-native";
import { Swipeable } from "react-native-gesture-handler";
import HeaderStyle4 from "~/src/components/Headers/HeaderStyle4";
import { rf } from "~/src/hooks/utils/responsiveFont";

export default function Notification() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Anúncio publicado",
      message: "Seu anúncio 'Entrega expressa' foi publicado com sucesso!",
      date: "06/06/2025",
      hour: "22:17 PM",
    },
    {
      id: 2,
      type: "info",
      title: "Novo anúncio aceito",
      message: "Você aceitou o anúncio 'Mudança residencial'.",
      date: "05/06/2025",
      hour: "10:05 AM",
    },
    {
      id: 3,
      type: "warning",
      title: "Anúncio finalizado",
      message: "O anúncio 'Entrega zona sul' foi finalizado.",
      date: "04/06/2025",
      hour: "19:26 PM",
    },
    {
      id: 4,
      type: "success",
      title: "Anúncio publicado",
      message: "Seu anúncio 'Entrega expressa' foi publicado com sucesso!",
      date: "06/06/2025",
      hour: "22:17 PM",
    },
    {
      id: 5,
      type: "info",
      title: "Novo anúncio aceito",
      message: "Você aceitou o anúncio 'Mudança residencial'.",
      date: "05/06/2025",
      hour: "10:05 AM",
    },
    {
      id: 6,
      type: "warning",
      title: "Anúncio finalizado",
      message: "O anúncio 'Entrega zona sul' foi finalizado.",
      date: "04/06/2025",
      hour: "19:26 PM",
    },
    {
      id: 7,
      type: "info",
      title: "Novo anúncio aceito",
      message: "Você aceitou o anúncio 'Mudança residencial'.",
      date: "05/06/2025",
      hour: "10:05 AM",
    },
    {
      id: 8,
      type: "warning",
      title: "Anúncio finalizado",
      message: "O anúncio 'Entrega zona sul' foi finalizado.",
      date: "04/06/2025",
      hour: "19:26 PM",
    },
    {
      id: 9,
      type: "info",
      title: "Novo anúncio aceito",
      message: "Você aceitou o anúncio 'Mudança residencial'.",
      date: "05/06/2025",
      hour: "10:05 AM",
    },
    {
      id: 10,
      type: "warning",
      title: "Anúncio finalizado",
      message: "O anúncio 'Entrega zona sul' foi finalizado.",
      date: "04/06/2025",
      hour: "19:26 PM",
    },
  ]);

  const renderIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CircleCheck size={22} color="#22c55e" className="mr-3" />;
      case "info":
        return <Info size={22} color="#3b82f6" className="mr-3" />;
      case "warning":
        return <XCircle size={22} color="#f97316" className="mr-3" />;
      default:
        return <Bell size={22} color="#6b7280" className="mr-3" />;
    }
  };

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const renderRightActions = (
    id: number,
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => handleDelete(id)}
          className="w-20 bg-gray-400 justify-center items-center"
        >
          <Eye color="#fff" size={24} />
          {/* <Text className="text-white mt-1 text-sm">Apagar</Text> */}
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = (
    id: number,
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <View className="flex-row">
        <TouchableOpacity
          onPress={() => handleDelete(id)}
          className="w-20 bg-red-500 justify-center items-center"
        >
          <Trash color="#fff" size={24} />
          {/* <Text className="text-white mt-1 text-sm">Apagar</Text> */}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="bg-white h-full">
      {/* <Header leftIcon="back" title="Notificações" /> */}
      <HeaderStyle4 title="Notificação" scrollY={scrollY} />
      <Animated.ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: rf(60), paddingBottom: 20 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        className="pt-4 pb-8"
      >
        {notifications.map((item, index) => (
          <Swipeable
            key={item.id}
            renderRightActions={(progress) =>
              renderRightActions(item.id, progress)
            }
            renderLeftActions={(progress) =>
              renderLeftActions(item.id, progress)
            }
          >
            <View
              className={`flex-row items-start px-4 py-3 bg-white ${
                index !== 0 ? "border-t border-zinc-200" : ""
              }`}
            >
              {renderIcon(item.type)}
              <View className="flex-1">
                <Text className="font-semibold text-zinc-800">
                  {item.title}
                </Text>
                <Text className="text-sm text-zinc-600 mt-0.5">
                  {item.message}
                </Text>
                <Text className="text-xs text-zinc-400 mt-1">
                  {item.date} às {item.hour}
                </Text>
              </View>
            </View>
          </Swipeable>
        ))}

        {notifications.length === 0 && (
          <Text className="text-center text-zinc-500 mt-10">
            Você não tem notificações no momento.
          </Text>
        )}
      </Animated.ScrollView>
    </View>
  );
}
