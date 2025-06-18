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
  Shapes,
  UserRound,
  HandCoins,
  CircleCheckBig,
  Phone,
  Check,
  CircleCheck,
} from "lucide-react-native";
import Modal from "react-native-modal";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import { useNavigation } from "@react-navigation/native";
import { SwipeModal } from "@takuma-ru/vue-swipe-modal";


const PeopleInformation = ({
  handleSwipeRight,
  visible,
  setVisible,
  peopleData,
}: any) => {
  const handleShare = () => {};

  const handleView = () => {
    navigation.navigate("CardInformationPeople", {
      cardData: peopleData,
      onSwipeLeft: () => handleSwipeRight(peopleData.id),
    });
  };

  const handleApply = () => {
    handleSwipeRight();
  };

  // Fallback data if peopleData is not provided
  const defaultpeopleData = {
    doctorName: "Gerente RH Sênior",
    specialty: "Empresa Confidencial",
    date: "Wed, Jul 19",
    time: "10:30 AM",
    type: "Home Visit",
    description: "I feel really sick in my tummy, I think...",
    rating: 4.3,
  };
  const data = peopleData || defaultpeopleData;
  const navigation = useNavigation();

  return (
    <Modal
      isVisible={visible}
      swipeDirection="down" // 📌 habilita o gesto para baixo
      onSwipeComplete={() => setVisible(false)} // 📌 fecha ao completar o swipe
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      backdropOpacity={0.8}
      useNativeDriver={true}
      propagateSwipe={true}
      hideModalContentWhileAnimating={true} // opcional, evita flashes
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
            <View className="mr-3" style={{ position: "relative" }}>
              {peopleData.photoUri ? (
                <Image
                  source={{ uri: peopleData.photoUri }}
                  style={{ width: rf(43), height: rf(43) }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="rounded-full bg-zinc-100 items-center justify-center p-3 w-12 h-12">
                  <UserRound size={rf(25)} />
                </View>
              )}

              {peopleData.isVerified && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    height: rf(13),
                    width: rf(13),
                  }}
                  className="rounded-full bg-primary items-center justify-center "
                >
                  <Check className="text-dark" size={rf(10)} />
                </View>
              )}
            </View>
            <View>
              <Text style={{ ...FONTS.fontSemiBold, fontSize: rf(16) }}>
                {peopleData.function}
              </Text>
              <Text
                style={{
                  ...FONTS.fontBlack,
                  fontSize: rf(12),
                  color: "#6b7280",
                }}
                className="text-sm text-gray-500"
              >
                {peopleData.name || "Empresa confidencial"}
              </Text>
            </View>
            {peopleData.isVerified && (
              <View className="ml-auto flex-row items-center justify-center bg-primary px-2 py-1 rounded-full">
                <Text
                  style={{
                    ...FONTS.fontSemiBold,
                    fontSize: rf(8),
                  }}
                  className="mr-1 text-dark"
                >
                  Verificado
                </Text>
                <CircleCheck size={rf(20)} className="text-dark" />
              </View>
            )}
          </View>

          {/* Job Details */}
          <View className="p-2 mb-4 bg-gray-50 rounded-xl flex-row justify-evenly">
            <View className="gap-4">
              <View className="flex-row items-center">
                <Banknote size={rf(16)} />
                <Text style={{ ...FONTS.fontBlack, fontSize: rf(11) }}>
                  {Mask("amount", peopleData.salary)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <HandCoins size={rf(16)} />
                <Text
                  className="capitalize"
                  style={{ ...FONTS.fontBlack, fontSize: rf(11) }}
                >
                  {peopleData.valueType}
                </Text>
              </View>
            </View>
            <View className="gap-4">
              <View className="flex-row items-center">
                <Phone size={rf(16)} />
                <Text style={{ ...FONTS.fontBlack, fontSize: rf(11) }}>
                  {Mask("hiddenPhone", peopleData.phone)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MapPin size={rf(16)} />
                <Text style={{ ...FONTS.fontBlack, fontSize: rf(11) }}>
                  {peopleData.locality}
                </Text>
              </View>
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
