import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";

interface InputProps {
  title?: string;
  placeholder?: string;
  visible: string;
  setVisible: (text: string) => void;
}

export default function Input({
  title,
  placeholder,
  visible,
  setVisible,
}: InputProps) {
  return (
    <View className="px-7">
      {title && <Text className="mb-2" style={{...FONTS.fontBlack, fontSize:rf(18)}}>{title}</Text>}
      <TouchableOpacity className="border-2 border-[#a1a1a1] rounded-md px-5 flex-row items-center justify-between"
        onPress={()=>setVisible('service')}
      >
        <Text
          //   style={styles.input}
          style={{...FONTS.fontBlack, fontSize:rf(17)}}
          
          className="h-10 mt-3 text-[#6e6e6e]"
        >
        {placeholder ? placeholder : 'aqui'}
        </Text>
        <ChevronRight size={rf(20)}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#333",
  },
});
