import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  Share2,
  CirclePlus,
  Eye,
  FileText,
  BriefcaseBusiness,
  Building2,
  Banknote,
  MapPin,
  Accessibility,
  Shapes
} from "lucide-react-native";
import Modal from "react-native-modal";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import { useNavigation } from "@react-navigation/native";

const PeopleInformation = ({ handleSwipeRight ,visible, setVisible, jobData }: any) => {
  const handleShare = () => {
    
  };

  const handleView = () => {
    navigation.navigate("CardInformation", {
      cardData: jobData,
      onSwipeLeft: () => handleSwipeRight(jobData.id),
    });
  };

  const handleApply = () => {
    handleSwipeRight()
  };

  // Fallback data if jobData is not provided
  const defaultJobData = {
    doctorName: "Gerente RH Sênior",
    specialty: "Empresa Confidencial",
    date: "Wed, Jul 19",
    time: "10:30 AM",
    type: "Home Visit",
    description: "I feel really sick in my tummy, I think...",
    rating: 4.3,
  };
  const data = jobData || defaultJobData;
  const navigation = useNavigation();

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      onBackdropPress={() => setVisible(false)}
      backdropOpacity={0.8}
      useNativeDriver={true}
      style={{ margin: 0, justifyContent: "flex-end" }}
    >
      <View className="w-full bg-white rounded-t-3xl overflow-hidden shadow-lg">
        {/* Drag Indicator */}
        <View className="flex-row justify-center mt-2 mb-4">
          <View className="w-16 h-1 bg-gray-400 rounded-xl"></View>
        </View>

        {/* Job Header */}
        <View className="px-5 pb-4">
          <View className="flex-row items-center mb-6">
            <View className="rounded-full bg-zinc-100 items-center justify-center p-3 mr-3">
              <Building2 size={rf(25)} />
            </View>
            <View>
              <Text style={{...FONTS.fontSemiBold, fontSize:rf(16)}}>
                {data.function}
              </Text>
              <Text style={{...FONTS.fontBlack, fontSize:rf(12), color:'#6b7280'}} className="text-sm text-gray-500">
                {data.company?.company_name || "Empresa confidencial"}
            </Text>
            </View>
            {/* <View className="ml-auto flex-row items-center bg-green-100 px-2 py-1 rounded-full">
              <BadgeCheck size={rf(20)} color="#10b981" />
              <Text className="text-xs text-green-600 font-semibold ml-1">
                {data.rating}/5
              </Text>
            </View> */}
          </View>

          {/* Job Details */}
          <View className="p-2 mb-4 bg-gray-50 rounded-xl flex-row justify-between">
            <View className="gap-4">
                <View className="flex-row items-center">
                    <Banknote size={rf(16)}/>
                    <Text style={{...FONTS.fontBlack,fontSize:rf(11)}}>{Mask("amount", jobData.salary)}</Text>
                </View>
                <View className="flex-row items-center">
                    <MapPin size={rf(16)}/>
                    <Text style={{...FONTS.fontBlack, fontSize:rf(11)}}>{jobData.locality}</Text>
                </View>
            </View>
            <View className="gap-4">
                <View className="flex-row items-center">
                    <FileText size={rf(16)}/>
                    <Text style={{...FONTS.fontBlack, fontSize:rf(11)}}>{jobData.contract}</Text>
                </View>
                <View className="flex-row items-center">
                    <BriefcaseBusiness size={rf(16)}/>
                    <Text style={{...FONTS.fontBlack, fontSize:rf(11)}}>{jobData.model}</Text>
                </View>
            </View>
            <View className="gap-4">
                { jobData.DEI &&
                    <View className="flex-row  items-center">
                        <Shapes size={rf(16)}/>
                        <Text style={{...FONTS.fontBlack, fontSize:rf(11)}}>Vaga Afirmativa</Text>
                    </View>
                }
                { jobData.PCD &&
                    <View className="flex-row items-center">
                        <Accessibility size={rf(16)}/>
                        <Text style={{...FONTS.fontBlack, fontSize:rf(11)}}>Vaga PCD</Text>
                    </View>
                }
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between">
            <View className="border-r border-zinc-300 flex-1">
              <TouchableOpacity
                className="flex-1 p-3 items-center"
                onPress={handleShare}
              >
                <View className="h-10 items-center">
                  <Share2 size={rf(24)} color="#71717a" />
                  <Text
                    className="text-center text-zinc-500"
                    style={{ ...FONTS.font, fontSize: rf(9) }}
                  >
                    Compartilhar
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View className="border-r border-zinc-300 flex-1">
              <TouchableOpacity
                className="p-3 items-center"
                onPress={handleView}
              >
                <View className="h-10 items-center">
                  <Eye size={rf(24)} color="#71717a" />
                  <Text
                    className="text-center text-zinc-500"
                    style={{ ...FONTS.font, fontSize: rf(9) }}
                  >
                    Visualizar
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <TouchableOpacity
                className="flex-1 p-3 items-center"
                onPress={handleApply}
              >
                <View className="h-10 items-center">
                  <CirclePlus size={rf(24)} color="#71717a" />
                  <Text
                    className="text-center text-zinc-500"
                    style={{ ...FONTS.font, fontSize: rf(9) }}
                  >
                    Candidatar
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PeopleInformation;