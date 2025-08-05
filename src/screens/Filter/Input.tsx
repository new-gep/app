import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";

interface InputProps {
  go:string;
  title?: string;
  placeholder?: string;
  visible: string;
  setVisible: (text: string) => void;
}

export default function Input({
  go,
  title,
  placeholder,
  visible,
  setVisible,
}: InputProps) {

  return (
    <View className="px-7">
      {title && <Text className="mb-2" style={{ ...FONTS.fontLight, fontSize: rf(16) }}>{title}</Text>}
      <TouchableOpacity style={Styles.card} className="h-10 bg-white rounded-md px-5 flex-row items-center justify-between"
        onPress={()=>setVisible(go)}
      >
        <Text
          style={{...FONTS.fontBlack, fontSize:rf(17)}}
          className=" items-center justify-center text-center text-[#6e6e6e]"
        >
          {placeholder ? placeholder : '...'}
        </Text>
        <ChevronRight size={rf(20)}/>
      </TouchableOpacity>
    </View>
  );
}

const Styles = {
  card: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // backgroundColor: "#FFFFFF",
  },
  select: {
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