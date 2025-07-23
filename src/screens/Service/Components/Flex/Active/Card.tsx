import {
  ChevronRight,
  EllipsisVertical,
  UserRound,
  Trash2,
  Pencil,
  Wrench,
  GraduationCap,
  CarFront,
  Handshake,
  MonitorSmartphone,
  PartyPopper,
  Shirt,
  Hammer,
  HeartPulse,
  House,
  Banknote,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
import ModalMenu from "./Modal/Modal";
const SwipeableCardPeopleActive = React.memo(function SwipeableCard({
  item,
  editAnnouncement,
  deleteAnnouncement,
}: any) {
  const [visible, setVisible] = useState<boolean>(false);

  const renderRightActions = () => (
    <>
      <TouchableOpacity
        onPress={() => {
          setVisible(true);
        }}
        className="justify-center items-center  w-20"
      >
        <View>
          <EllipsisVertical size={rf(25)} />
        </View>
      </TouchableOpacity>
    </>
  );

  const renderLeftActions = () => (
    <>
      <TouchableOpacity
        className="justify-center items-center bg-red-400 w-20"
        onPress={deleteAnnouncement}
      >
        <View className="items-center justify-center">
          <Trash2 className="text-white" size={rf(20)} />
          <Text
            style={{ ...FONTS.fontSemiBold, fontSize: rf(8) }}
            className="text-white"
          >
            Excluir
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="justify-center items-center bg-gray-400 w-20 "
        onPress={editAnnouncement}
      >
        <View className="items-center justify-center">
          <Pencil className="text-white" size={rf(20)} />
          <Text
            style={{ ...FONTS.fontSemiBold, fontSize: rf(8) }}
            className="text-white"
          >
            Editar
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
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
    <View style={styles.cardWrapper}>
      {item && (
        <ModalMenu visible={visible} setVisible={setVisible} item={item} />
      )}
      <Swipeable
        key={item.id}
        // renderRightActions={renderRightActions}
        renderRightActions={() => null}
        renderLeftActions={item?.CPF_Responder ? () => null : renderLeftActions}
      >
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
          }}
          className="px-5 py-2 bg-white border-b border-zinc-300 flex-row items-center justify-between"
          style={styles.card}
        >
          <View className="flex-row items-center flex-1">
            <View className="mr-3" style={{ position: "relative" }}>
              <View
                style={{ height: rf(45), width: rf(45) }}
                className="rounded-full bg-zinc-100 items-center justify-center p-3"
              >
                {renderIcon(item.category)}
              </View>
            </View>
            <View className="pr-2">
              <Text
                style={{ ...FONTS.font, fontSize: rf(12) }}
                numberOfLines={1}
                ellipsizeMode="tail"
                className="capitalize"
              >
                {item.title}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-green-600"
              >
                {`${Mask("amount", item.salary)} ${
                  item.typePayment && item.typePayment
                }`}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                Anúncio {item.typeAnnouncement}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item.candidates?.length || 0}{" "}
                {item.candidates?.length === 1 ? "Candidato" : "Candidatos"}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                Anunciado em {Mask("dateFormat", item.create_at)}
              </Text>
            </View>
          </View>
          <View className="mr-3">
            <ChevronRight size={rf(20)} />
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardWrapper: {
    position: "relative",
    minHeight: rf(20),
  },
  cardContainer: {
    width: SCREEN_WIDTH - rf(32),
    minHeight: rf(20),
    overflow: "visible",
  },
  card: {
    width: "100%",
    minHeight: rf(80),
    overflow: "visible",
  },
});

export default SwipeableCardPeopleActive;
