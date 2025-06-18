import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import Octicons from "@expo/vector-icons/Octicons";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IMAGES } from "~/src/constants/Images";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import {
  Eye,
  UserRound,
  FileText,
  Images,
  Folders,
  Signature,
  AtSign,
  HandHelping,
  Star,
  Megaphone,
  WalletCards,
  KeyRound,
  CircleHelp,
  LogOut,
  CreditCard,
  Wrench,
  GraduationCap,
  CarFront,
  Handshake,
  MonitorSmartphone,
  PartyPopper,
  Shirt,
  Hammer,
  HeartPulse,
  House,
} from "lucide-react-native";
interface ListItem {
  title: string;
  icon: string | any;
  go?: string;
  variable?: boolean;
  setVariable?: any;
  action?: any;
  newIcon?: boolean;
}

export default function List({
  items,
  isUnique,
  title,
  newIcon,
}: {
  items: ListItem[];
  isUnique?: boolean;
  title?: string;
  newIcon?: boolean;
}) {
  const navigation = useNavigation<any>();
  const renderIcon = (type: string) => {
    switch (type) {
      case "key_outline":
        return <KeyRound size={rf(20)} className="text-dark"/>;
      case "help_outline":
        return <CircleHelp size={rf(20)} className="text-dark"/>;
      case "logout_outline":
        return <LogOut size={rf(20)} className="text-red-500"/>;
      case "wallet_outline":
        return <WalletCards size={rf(20)} className="text-dark"/>;
      case "campaign_outline":
        return <Megaphone size={rf(20)} className="text-dark"/>;
      case "star_outline":
        return <Star size={rf(20)} className="text-dark"/>;
      case "volunter_outline":
        return <HandHelping size={rf(20)} className="text-dark"/>;
      case "CreditCard":
        return <CreditCard size={rf(20)} className="text-dark"/>;
      case "social_outline":
        return <AtSign size={rf(20)} className="text-dark"/>;
      case "signature_outline":
        return <Signature size={rf(20)} className="text-dark"/>;
      case "folder_outline":
        return <Folders size={rf(20)} className="text-dark"/>;
      case "imageLibrary_outline":
        return <Images size={rf(20)} className="text-dark"/>;
      case "document_outline":
        return <FileText size={rf(20)} className="text-dark"/>;
      case "user_outline":
        return <UserRound size={rf(20)} className="text-dark"/>;
      case "eye_outline":
        return <Eye size={22} className="text-dark"/>;
      default:
        return <CarFront size={22} className="text-dark"/>;
    }
  };



  return (
    <View>
      {title && (
        <Text
          style={{ ...FONTS.fontMedium, fontSize: rf(17) }}
          className="my-2"
        >
          {title}
        </Text>
      )}
      <View
        className="bg-white rounded-lg px-3"
        style={!isUnique ? Style.container : undefined}
      >
        {items.map((item: ListItem, index: number) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between mb-2"
            onPress={() => {
              if (item.go) {
                navigation.navigate(item.go);
              }
              if (item.setVariable) {
                item.setVariable(!item.variable);
              }
              if (item.action) {
                item.action();
              }
            }}
          >
            {newIcon ? (
              <>{renderIcon(item.icon)}</>
            ) : (
              <View className="flex-row items-center w-1/12 h-1/2">
                <Image
                  /* @ts-ignore */
                  source={IMAGES[item.icon]}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              </View>
            )}

            <View
              className="flex-row justify-between items-center w-11/12"
              style={{
                borderBottomWidth: index !== items.length - 1 ? 1 : 0,
                borderColor: "#e5e7eb", // equivalente a Tailwind `border-gray-200`
              }}
            >
              <Text style={[Style.text, FONTS.fontLight]}>{item.title}</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={21}
                color="black"
              />
            </View>
          </TouchableOpacity>
        ))}
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
    padding: 7,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};
