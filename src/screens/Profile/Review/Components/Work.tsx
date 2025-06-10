import { View, Text } from "react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import {
  MapPin,
  MapPinCheckInside,
  MapPinXInside,
  Handshake,
  Banknote,
  BusFront,
  Clock,
  House
} from "lucide-react-native";

export default function Work() {
  const data = {
    workPreferences: {
      location: "São Paulo - SP",
      maxDistanceKm: 50,
      allowFurtherDistance: true,
      contractType: ["Autônomo", "CLT"],
      modality: ["Híbrido", "Presencial"],
      schedule: ["Dia", "Noite"],
      mobility: ["Carro", "Moto"],
      paymentType: ["Por dia", "Por hora", "A combinar"],
    },
  };

  const renderTagList = (title: string, icon: JSX.Element, items: string[]) => (
    <View>
      <View>
        <View className="flex-row gap-2 items-center flex-wrap">
          {icon}
          <Text
            style={[FONTS.fontMedium, { fontSize: rf(14), marginBottom: 4 }]}
          >
            {title}
          </Text>
        </View>
        <View className="flex-row flex-wrap">
          {items.map((item, index) => (
            <Text
              key={index}
              style={[Style.tag, FONTS.fontLight, { fontSize: rf(14) }]}
            >
              {item}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={Style.container} className="bg-white p-3 rounded-lg mt-3">
      <Text
        className="mb-6"
        style={{ fontSize: rf(18), ...FONTS.fontSemiBold }}
      >
        Como Trabalho
      </Text>
      <View>
        <View className="flex-row gap-2">
          <MapPin size={rf(16)} />
          <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>
            Distância máxima até {data.workPreferences.maxDistanceKm} km
          </Text>
        </View>
        <View className="flex-row gap-2">
          {data.workPreferences.allowFurtherDistance ? (
            <>
              <MapPinCheckInside size={rf(16)} />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>
                Aceita maiores distâncias
              </Text>
            </>
          ) : (
            <>
              <MapPinXInside size={rf(16)} />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>
                Não aceita maiores distâncias
              </Text>
            </>
          )}
        </View>
            {renderTagList("Contratatos", <Handshake size={rf(16)} />, data.workPreferences.contractType)}
            {renderTagList("Modalidade", <House size={rf(16)} />, data.workPreferences.modality)}
            {renderTagList("Período", <Clock size={rf(16)} />, data.workPreferences.schedule)}
            {renderTagList("Mobilidade", <BusFront size={rf(16)} />, data.workPreferences.mobility)}
            {renderTagList("Pagamentos", <Banknote size={rf(16)} />, data.workPreferences.paymentType)}
      </View>
    </View>
  );
}

const Style = {
  container: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
};
