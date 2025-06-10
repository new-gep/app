import { View, Text, Image } from "react-native";
import { Check, CircleCheckBig, CopyCheck, CircleCheck } from "lucide-react-native";
import { FONTS } from '~/src/constants/theme'
import { rf } from "~/src/hooks/utils/responsiveFont";
export default function Picture() {
  const data = {
    fullName: "João da Silva",
    photoUri: "https://randomuser.me/api/portraits/men/75.jpg",
    age: "20",
    sex: "Masculino",
  };

  return (
    <View className="items-center rounded-2xl mb-4 shadow-md bg-white">
      <View className="relative mb-4">
        <Image
          source={{ uri: data.photoUri }}
          className="w-30 h-30 rounded-full border-2 border-custom-gray-400"
          style={{ width: 120, height: 120 }}
        />
        {1 && (
          <View className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
            <CircleCheck size={24} color="#16a34a" />
          </View>
        )}
      </View>
      <Text style={{fontSize:rf(20),...FONTS.fontBold}} className="text-center">
        {data.fullName}, {data.age}
      </Text>
      <Text className="text-base text-custom-gray-500 mb-3">{data.sex}</Text>
      {1 && (
        <View className="flex-row items-center bg-green-200 px-3 py-1.5 rounded-xl">
          <CircleCheckBig size={20} color="#16a34a" />
          <Text style={{...FONTS.font, color:'#16a34a'}} className="ml-1.5 text-sm font-semibold text-green-600">
            Verificado
          </Text>
        </View>
      )}
    </View>
  );
}
