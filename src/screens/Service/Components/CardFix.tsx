
import { useNavigation } from "@react-navigation/native";
import {
  ChevronRight,
  Building2,
  EllipsisVertical,
  History,
  Repeat,
  Mail,
  MessageCircle,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import FindActualOrLastCompanyJob from "~/src/hooks/get/job/findActualOrLastCompany";
import useCollaborator from "~/src/function/fetchCollaborator";



export default function Card() {
  const navigation = useNavigation<any>();
  const { collaborator } = useCollaborator();
  const [actualCompany, setActualCompany] = useState<any>(null);

  const handleStatusPress = () => {
    
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <View className="flex-row">
        <TouchableOpacity
          //   onPress={() => handleDelete(id)}
          className="w-20 justify-center items-center"
        >
          <EllipsisVertical className="text-dark" size={rf(24)} />
          {/* <Text className="text-white mt-1 text-sm">Apagar</Text> */}
        </TouchableOpacity>
      </View>
    );
  };



  useEffect(()=>{
    const fetchData = async () => {
      if (collaborator) {
        const response = await FindActualOrLastCompanyJob(collaborator.CPF);
        if (response.status === 200) {
          setActualCompany(response.company);
        }
      }
    };
    fetchData();
  }, [collaborator])

  return (
    <View style={Style.container} className="mt-5 bg-white p-3 rounded-2xl">
      { actualCompany &&
        <View className="px-2">
          <Swipeable
            renderLeftActions={() => null}
          >
            <TouchableOpacity
              onPress={() => {
                actualCompany?.status == 'actual' && navigation.navigate("FixActual");
              }}
              className="w-full bg-white border-b border-zinc-300 rounded-lg p-3 flex-row items-center"
              style={{ height: rf(80) }}
            >
              {/* Logo */}
              {actualCompany?.logoUrl ? (
                <Image
                  source={{ uri: actualCompany.logoUrl }}
                  className="w-12 h-12 rounded-full mr-3"
                  resizeMode="cover"
                />
              ) : (
                <View className="rounded-full bg-zinc-100 items-center justify-center p-3 mr-3">
                  <Building2 size={rf(25)} />
                </View>
              )}
              <TouchableOpacity onPress={handleStatusPress}>
                <View
                  className={`${actualCompany?.status == 'actual' ? 'bg-green-500' : 'bg-red-500'} absolute`}
                  style={{
                    bottom: -18,
                    left: -21,
                    width: rf(10),
                    height: rf(10),
                    borderRadius: rf(10),
                  }}
                  
                />
              </TouchableOpacity>

              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text
                    style={{ ...FONTS.fontSemiBold, fontSize: rf(13) }}
                    className="text-zinc-800 font-semibold"
                  >
                    {actualCompany?.CNPJ_company?.company_name ? actualCompany.CNPJ_company.company_name : "Sem empresa"}
                  </Text>
                </View>
                <Text
                  style={{ ...FONTS.font, fontSize: rf(11) }}
                  className="text-zinc-500"
                >
                  {actualCompany?.function ? actualCompany.function : "Sem cargo"}
                </Text>
              </View>

              <ChevronRight size={20} className="text-zinc-400" />
            </TouchableOpacity>
          </Swipeable>
        </View>
      }

      <>
        <View className="flex-row justify-between mt-5">
          <View className="w-3/6 px-2">
            <TouchableOpacity
              style={[Style.container, { height: rf(100) }]}
              className="bg-yellow-200 rounded-2xl p-2 h-20"
              onPress={() => {
                navigation.navigate("FixProcess");
              }}
            >
              <Text style={{...FONTS.fontLight, fontSize:rf(13)}}>Processos</Text>
              <Repeat size={rf(20)} />
            </TouchableOpacity>
          </View>
          {/* <View className="w-3/6 px-2">
            <TouchableOpacity
              style={[Style.container, { height: rf(100) }]}
              className="bg-yellow-200 rounded-2xl p-2 h-20"
            >
              <Text style={{...FONTS.fontLight, fontSize:rf(13)}}>Mensagens</Text>
              <MessageCircle size={rf(20)} />
            </TouchableOpacity>
          </View> */}
          <View className="w-3/6 px-2">
            <TouchableOpacity
              style={[Style.container, { height: rf(100) }]}
              className="bg-yellow-200 rounded-2xl p-2 h-20"
              onPress={() => {
                navigation.navigate("FixProposal");
              }}
            >
              <Text style={{...FONTS.fontLight, fontSize:rf(13)}}>Propostas</Text>
              <Mail size={rf(20)} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row justify-between mt-5">
          {/* <View className="w-3/6 px-2">
            <TouchableOpacity
              style={[Style.container, { height: rf(100) }]}
              className="bg-yellow-200 rounded-2xl p-2 h-20"
            >
              <Text style={{...FONTS.fontLight, fontSize:rf(13)}}>Propostas</Text>
              <Mail size={rf(20)} />
            </TouchableOpacity>
          </View> */}
          <View className="w-3/6 px-2">
            <TouchableOpacity
              style={[Style.container, { height: rf(100) }]}
              className="bg-yellow-200 rounded-2xl p-2 h-20"
              onPress={() => {
                navigation.navigate("FixHistory");
              }}
            >
              <Text style={{...FONTS.fontLight, fontSize:rf(13)}}>Histórico</Text>
              <History size={rf(20)} />
            </TouchableOpacity>
          </View>
        </View>
      </>
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
