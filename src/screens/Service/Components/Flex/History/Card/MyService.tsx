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
} from "lucide-react-native";
import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import { rf } from "~/src/hooks/utils/responsiveFont";
import ModalMyService from "../Modal/MyService";
const MyServiceCard = React.memo(function SwipeableCard({
  item
}: any) {
  const [visible, setVisible] = useState<boolean>(false);

  const renderIcon = (categories: string[]) => {
    return categories.map((category, index) => {
      switch (category) {
        case "Assistência Técnica":
          return (
            <Wrench className="text-zinc-500 mr-1" size={rf(20)} key={index} />
          );
        case "Aulas":
          return (
            <GraduationCap
              className="text-zinc-500 mr-1"
              size={rf(20)}
              key={index}
            />
          );
        case "Mecânica e Transportes":
          return (
            <CarFront
              className="text-zinc-500 mr-1"
              size={rf(20)}
              key={index}
            />
          );
        case "Consultoria":
          return (
            <Handshake
              className="text-zinc-500 mr-1"
              size={rf(20)}
              key={index}
            />
          );
        case "Design e Tecnologia":
          return (
            <MonitorSmartphone
              className="text-zinc-500 mr-1"
              size={rf(20)}
              key={index}
            />
          );
        case "Eventos":
          return (
            <PartyPopper
              className="text-zinc-500 mr-1"
              size={rf(20)}
              key={index}
            />
          );
        case "Moda e Beleza":
          return (
            <Shirt className="text-zinc-500 mr-1" size={rf(20)} key={index} />
          );
        case "Reformas e Reparos":
          return (
            <Hammer className="text-zinc-500 mr-1" size={rf(20)} key={index} />
          );
        case "Saúde":
          return (
            <HeartPulse
              className="text-zinc-500 mr-1"
              size={rf(20)}
              key={index}
            />
          );
        case "Serviços Domésticos":
          return (
            <House className="text-zinc-500 mr-1" size={rf(20)} key={index} />
          );
        default:
          return <Building size={rf(20)} key={index} />;
      }
    });
  };

  return (
    <>
    <ModalMyService visible={visible} setVisible={setVisible} item={item} />
      <Swipeable
        key={item.id}
      >
        <TouchableOpacity
          className="px-5 py-2 bg-white border-b border-zinc-300 flex-row items-center justify-between"
          style={styles.card}
          onPress={()=> setVisible(true)}
        >
          <View className="flex-row items-center flex-1">
            <View className="mr-3" style={{ position: "relative" }}>
              <View
                style={{ height: rf(45), width: rf(45) }}
                className="rounded-full bg-zinc-100 items-center justify-center p-3"
              >
                {renderIcon(item.service)}
              </View>
            </View>
            <View className="pr-2">
              <Text
                style={{ ...FONTS.font, fontSize: rf(12) }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.function}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-green-600"
              >
                {`${Mask("amount", item.salary)} ${item.valueType}`}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                Anúncio {item.visibility}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item.candidate.length > 0 ? item.candidate.length : 0}{" "}
                Candidatos
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                Anunciado em {item.create}
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
