import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
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
import FindNotification from "~/src/hooks/findOne/notification";
import useCollaborator from "~/src/function/fetchCollaborator";
import AwaitFetch from "~/src/components/LoadScreen/Load";
import Mask from "~/src/function/mask";
import deleteNotification from "~/src/hooks/delete/notification";
import { useFocusEffect } from "@react-navigation/native";

export default function Notification() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { collaborator } = useCollaborator();
  const [notifications, setNotifications] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(true);

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
    Alert.alert(
      "Confirmar exclusão",
      "Você tem certeza que deseja deletar esta notificação?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            const response = await deleteNotification(id);
            if (response.status === 200) {
              Alert.alert("Sucesso", "Notificação deletada com sucesso!");
              setNotifications((prev: any) =>
                prev.filter((item: any) => item.id !== id)
              );
            } else {
              Alert.alert("Erro", "Falha ao deletar a notificação.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // const renderRightActions = (
  //   id: number,
  //   progress: Animated.AnimatedInterpolation<number>
  // ) => {
  //   return (
  //     <View className="flex-row">
  //       <TouchableOpacity
  //         onPress={() => handleDelete(id)}
  //         className="w-20 bg-gray-400 justify-center items-center"
  //       >
  //         <Eye color="#fff" size={24} />
  //         {/* <Text className="text-white mt-1 text-sm">Apagar</Text> */}
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

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

  const fetchData = async () => {
    if (!collaborator) return;
    const response = await FindNotification(collaborator.CPF);
    if (response.status == 200) {
      setNotifications(response.data);
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchData();
  }, [collaborator]);

   useFocusEffect(
      React.useCallback(() => {
        validateCollaborator();
      }, [])
    );

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
        {loader ? (
          <AwaitFetch />
        ) : (
          <>
            {notifications.map((item: any, index: any) => (
              <Swipeable
                key={item.id}
                // renderRightActions={(progress) =>
                //   renderRightActions(item.id, progress)
                // }
                renderRightActions={() => null}
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
                    <Text className="font-semibold text-zinc-800 capitalize">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-zinc-600 mt-0.5">
                      {item.body}
                    </Text>
                    <Text className="text-xs text-zinc-400 mt-1">
                      {Mask("dateFormat", item.create_at)}
                    </Text>
                  </View>
                </View>
              </Swipeable>
            ))}

            {notifications.length === 0 && (
              <Text style={{fontSize:rf(16)}} className="text-center text-zinc-500 mt-10">
                Você não tem notificações no momento.
              </Text>
            )}
          </>
        )}
      </Animated.ScrollView>
    </View>
  );
}
function validateCollaborator() {
  throw new Error("Function not implemented.");
}

