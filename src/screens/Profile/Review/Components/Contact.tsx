import { View, Text } from "react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { Mail, Phone, MapPin } from "lucide-react-native";
import useCollaborator from "~/src/function/fetchCollaborator";
import Mask from "~/src/function/mask";
export default function Contact() {
   const { collaborator } = useCollaborator();

  return (
    <View style={Style.container} className="bg-white p-3 rounded-lg mt-3">
      <View className="mb-6">
        <Text style={{ fontSize: rf(18), ...FONTS.fontSemiBold }}>Contato</Text>
      </View>
      <View className="flex-col">
        <View className="flex-row gap-2">
            <Phone size={rf(16)}/>
            <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>{collaborator && collaborator.phone ? Mask('phone',collaborator.phone) : 'Não informado'}</Text>
        </View>
        <View className="flex-row gap-2">
            <Mail size={rf(16)}/>
            <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>{collaborator && collaborator.email ? collaborator.email : 'Não informado'}</Text>
        </View>
        <View className="flex-row gap-2">
            <MapPin size={rf(16)}/>
            <Text style={{ ...FONTS.fontLight, fontSize: rf(14) }}>{collaborator && collaborator.city && collaborator.uf ? `${collaborator.city}, ${collaborator.uf}` : 'Não informado'}</Text>
        </View>
      </View>

    </View>
  );
}

const Style = {
  container: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};
