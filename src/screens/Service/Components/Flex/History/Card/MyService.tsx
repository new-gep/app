import {
  Building,
  CarFront,
  Hammer,
  ChevronRight,
  GraduationCap,
  Handshake,
  HeartPulse,
  House,
  MonitorSmartphone,
  PartyPopper,
  Shirt,
  Wrench,
  UserRound,
} from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import { rf } from "~/src/hooks/utils/responsiveFont";
import ModalMyService from "../Modal/MyService";
const MyServiceCard = React.memo(function SwipeableCard({ item }: any) {
  const [visible, setVisible] = useState<boolean>(false);

  // 1. Mapeamento entre serviço e ícone
  const serviceIcons = {
    "Assistência Técnica": <Wrench size={rf(25)} className="text-dark" />,
    Aulas: <GraduationCap size={rf(25)} className="text-dark" />,
    "Mecânica e Transportes": <CarFront size={rf(25)} className="text-dark" />,
    Consultoria: <Handshake size={rf(25)} className="text-dark" />,
    "Design e Tecnologia": (
      <MonitorSmartphone size={rf(25)} className="text-dark" />
    ),
    Eventos: <PartyPopper size={rf(25)} className="text-dark" />,
    "Moda e Beleza": <Shirt size={rf(25)} className="text-dark" />,
    "Reformas e Reparos": <Hammer size={rf(25)} className="text-dark" />,
    Saúde: <HeartPulse size={rf(25)} className="text-dark" />,
    "Serviços Domésticos": <House size={rf(25)} className="text-dark" />,
  };
  // 2. Função para retornar o ícone de forma segura
  const renderIcon = (serviceName: string) => {
    return (
      //@ts-ignore
      serviceIcons[serviceName] || (
        <UserRound size={rf(25)} className="text-dark" />
      )
    );
  };

  return (
    <>
      <ModalMyService visible={visible} setVisible={setVisible} item={item} />
      <Swipeable key={item.id}>
        <TouchableOpacity
          className="px-5 py-2 bg-white border-b border-zinc-300 flex-row items-center justify-between"
          style={styles.card}
          onPress={() => setVisible(true)}
        >
          <View className="flex-row items-center flex-1">
            <View className="mr-3" style={{ position: "relative" }}>
              <View
                style={{ height: rf(45), width: rf(45) }}
                className="rounded-full bg-zinc-100 items-center justify-center p-3"
              >
                {item?.category ? renderIcon(item.category) : null}
              </View>
            </View>
            <View className="pr-2">
              <Text
                style={{ ...FONTS.font, fontSize: rf(12) }}
                numberOfLines={1}
                ellipsizeMode="tail"
                className="capitalize"
              >
                {item?.title ? item.title : "Sem título"}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-green-600"
              >
                {`${item?.salary && Mask("amount", item.salary)} ${
                  item.typePayment ? item.typePayment : "Não informado"
                }`}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                Anúncio{" "}
                {item?.typeAnnouncement
                  ? item.typeAnnouncement
                  : "Não informado"}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                Anunciado em{" "}
                {item?.create_at
                  ? Mask("dateFormat", item.create_at)
                  : "Data não informada"}
              </Text>
            </View>
          </View>
          <View className="mr-3">
            <ChevronRight size={rf(20)} />
          </View>
        </TouchableOpacity>
      </Swipeable>
    </>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardWrapper: {
    position: "relative",
    minHeight: rf(20),
  },
  cardContainer: {
    minHeight: rf(20),
    overflow: "visible",
  },
  card: {
    width: "100%",
    minHeight: rf(80),
    overflow: "visible",
  },
  tag: {
    backgroundColor: "#fde047",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
    color: "black",
  },
});

export default MyServiceCard;
