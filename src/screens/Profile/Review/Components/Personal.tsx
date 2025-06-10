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

export default function Personal() {
  const data = {
    pets: ["Cachorro", "Gato"],
    diet: ["Onívoro"],
    loveLanguage: ["Toque Físico", "Tempo de Qualidade"],
    drinks: ["Sim"],
    smokes: ["Não"],
    education: ["Ensino Superior Completo"],
    communicationType: ["Assertiva", "Passiva"],
    children: ["3"],
    marriage: ["Sim"],
    values: ["Familía", "Trabalho"],
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
      <View className="mb-6">
        <Text style={{ fontSize: rf(18), ...FONTS.fontSemiBold }}>
          Informações Pessoais
        </Text>
      </View>

      {renderTagList("Valores", <Scale size={rf(16)} />, data.values)}
      {renderTagList("Formação",<GraduationCap size={rf(16)} />,data.education)}
      {renderTagList("Comunicação",<MessageCircle size={rf(16)} />,data.communicationType)}
      {renderTagList("Casado(a)?", <Heart size={rf(16)} />, data.marriage)}
      {renderTagList("Bebe?", <Wine size={rf(16)} />, data.drinks)}
      {renderTagList("Filhos", <Baby size={rf(16)} />, data.children)}
      {renderTagList("Fuma?", <Cigarette size={rf(16)} />, data.smokes)}
      {renderTagList("Linguagem do Amor",<BookHeart size={rf(16)} />,data.loveLanguage)}
      {renderTagList("Alimentação", <Salad size={rf(16)} />, data.diet)}
      {renderTagList("Pets", <Bone size={rf(16)} />, data.pets)}
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
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
    color: "black",
  },
};
