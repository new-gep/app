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
      {title && <Text className="mb-2" style={{...FONTS.fontBlack, fontSize:rf(18)}}>{title}</Text>}
      <TouchableOpacity className="border-2 h-10 border-[#a1a1a1] rounded-md px-5 flex-row items-center justify-between"
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