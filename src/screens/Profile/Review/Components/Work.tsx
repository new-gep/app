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
  House,
} from "lucide-react-native";
import useCollaborator from "~/src/function/fetchCollaborator";
import { useEffect, useState } from "react";

export default function Work() {
  const { collaborator } = useCollaborator();
  const [data, setData] = useState<any>(null);


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
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <Text
                key={index}
                style={[Style.tag, FONTS.fontLight, { fontSize: rf(14) }]}
              >
                {item}
              </Text>
            ))
          ) : (
            <Text
              style={[Style.tag, FONTS.fontLight, { fontSize: rf(14) }]}
            >
              Não informado
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    if (collaborator) {
      setData(collaborator.howWork);
    }
  }, [collaborator]);

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
          { data?.distance ?
            <>
              <MapPin size={rf(16)} />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>
                Distância máxima até {data.distance} km
              </Text>
            </>
            :
            <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>
              Localização: Não informado
            </Text>
          }
        </View>
        <View className="flex-row gap-2">
          {data?.showFarWork ? (
            <>
              <MapPinCheckInside size={rf(16)} />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>
                Aceita maiores distâncias
              </Text>
            </>
          ) : data?.showFarWork === false ? (
            <>
              <MapPinXInside size={rf(16)} />
              <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>
                Não aceita maiores distâncias
              </Text>
            </>
          ) : (
            <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>
              Distância não informada
            </Text>
          )}
        </View>
        {renderTagList("Contratatos", <Handshake size={rf(16)} />, data?.contract)}
            {renderTagList("Modalidade", <House size={rf(16)} />, data?.modality)}
            {renderTagList("Período", <Clock size={rf(16)} />, data?.horary)}
            {renderTagList("Mobilidade", <BusFront size={rf(16)} />, data?.mobility)}
            {renderTagList("Pagamentos", <Banknote size={rf(16)} />, data?.payment)}
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
