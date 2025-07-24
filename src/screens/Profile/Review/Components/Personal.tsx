import { View, Text } from "react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import {
  Cigarette,
  Salad,
  Heart,
  Bone,
  MessageCircle,
  GraduationCap,
  Wine,
  Baby,
  BookHeart,
  Scale,
} from "lucide-react-native";
import useCollaborator from "~/src/function/fetchCollaborator";
import { useEffect } from "react";

export default function Personal() {
  const { collaborator } = useCollaborator();

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
          { items.length > 0 ?
            items.map((item, index) => (
              <Text
                key={index}
                style={[Style.tag, FONTS.fontLight, { fontSize: rf(14) }]}
              >
                {item}
              </Text>
            ))
            :
            <Text style={[Style.tag, FONTS.fontLight, { fontSize: rf(14) }]}>
              Não informado
            </Text>
          }
        </View>
      </View>
    </View>
  );

  const renderSafeTagList = (
    title: string,
    icon: JSX.Element,
    value: string[] | string | undefined | null
  ) => {
    const items: string[] =
      typeof value === "string" ? [value] : Array.isArray(value) ? value : [];

    const finalItems = items.length > 0 ? items : ["Não informado"];

    return renderTagList(title, icon, finalItems);
  };

  return (
    <View style={Style.container} className="bg-white p-3 rounded-lg mt-3">
      <View className="mb-6">
        <Text style={{ fontSize: rf(18), ...FONTS.fontSemiBold }}>
          Informações Pessoais
        </Text>
      </View>

      {collaborator && (
        <>
          {renderSafeTagList(
            "Valores",
            <Scale size={rf(16)} />,
            collaborator?.about?.values
          )}
          {renderSafeTagList(
            "Formação",
            <GraduationCap size={rf(16)} />,
            collaborator?.about?.formation
          )}
          {renderSafeTagList(
            "Comunicação",
            <MessageCircle size={rf(16)} />,
            collaborator?.about?.communication
          )}
          {renderTagList("Casado(a)?", <Heart size={rf(16)} />, [
            collaborator?.marriage === "1" ? "Sim" : "Não",
          ])}
          {renderSafeTagList(
            "Bebe?",
            <Wine size={rf(16)} />,
            collaborator?.about?.drink
          )}
          {renderTagList(
            "Filhos",
            <Baby size={rf(16)} />,
            collaborator?.children &&
              Object.keys(collaborator.children).length > 0
              ? [
                  `${Object.keys(collaborator.children).length} ${
                    Object.keys(collaborator.children).length === 1
                      ? "filho"
                      : "filhos"
                  }`,
                ]
              : ["Não informado"]
          )}
          {renderSafeTagList(
            "Fuma?",
            <Cigarette size={rf(16)} />,
            collaborator?.about?.smoke
          )}
          {renderSafeTagList(
            "Linguagem do Amor",
            <BookHeart size={rf(16)} />,
            collaborator?.about?.languageLove
          )}
          {renderSafeTagList(
            "Alimentação",
            <Salad size={rf(16)} />,
            collaborator?.about?.food
          )}
          {renderSafeTagList(
            "Pets",
            <Bone size={rf(16)} />,
            collaborator?.about?.pet
          )}
        </>
      )}
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
