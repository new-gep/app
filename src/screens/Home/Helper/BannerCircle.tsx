import React from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import Icon from "~/src/components/Icon/Icon";
import { rf } from "~/src/hooks/utils/responsiveFont";
import {
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
} from "lucide-react-native";
const items = [
  { icon: "Wrench", label: "Assistência Técnica" },
  { icon: "GraduationCap", label: "Aulas" },
  { icon: "CarFront", label: "Mecânica e Transportes" },
  { icon: "Handshake", label: "Consultoria" },
  { icon: "MonitorSmartphone", label: "Design e Tecnologia" },
  { icon: "PartyPopper", label: "Eventos" },
  { icon: "Shirt", label: "Moda e Beleza" },
  { icon: "Hammer", label: "Reformas e Reparos" },
  { icon: "HeartPulse", label: "Saúde" },
  { icon: "House", label: "Serviços Domésticos" },
];

const renderIcon = (type: string) => {
  switch (type) {
    case "Wrench":
      return <Wrench size={22} className="text-dark"/>;
    case "GraduationCap":
      return <GraduationCap size={22} className="text-dark"/>;
    case "CarFront":
      return <CarFront size={22} className="text-dark"/>;
    case "Handshake":
      return <Handshake size={22} className="text-dark"/>;
    case "MonitorSmartphone":
      return <MonitorSmartphone size={22} className="text-dark"/>;
    case "PartyPopper":
      return <PartyPopper size={22} className="text-dark"/>;
    case "Shirt":
      return <Shirt size={22} className="text-dark"/>;
    case "Hammer":
      return <Hammer size={22} className="text-dark"/>;
    case "HeartPulse":
      return <HeartPulse size={22} className="text-dark"/>;
    case "House":
      return <House size={22} className="text-dark"/>;
    default:
      return <CarFront size={22} className="text-dark"/>;
  }
};

export default function BannerCircle() {
  return (
    <View style={{ marginTop: 20 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              alignItems: "center",
              marginRight: 16,
              width: 60, // largura fixa para alinhar e permitir quebra
            }}
          >
            <TouchableOpacity
              className="bg-primary rounded-full items-center justify-center p-2"
              activeOpacity={0.8}
            >
              {renderIcon(item.icon)}
            </TouchableOpacity>
            <Text
              className="text-gray-500 text-center"
              style={{
                fontSize: 9,
                marginTop: 4,
                flexWrap: "wrap",
              }}
              numberOfLines={2}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
