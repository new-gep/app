import { Check, ChevronRight, UserRound } from "lucide-react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import { rf } from "~/src/hooks/utils/responsiveFont";
import Modal from "../Modal/Service";

export default function Service( { item }: any) {
  const [visibleService, setVisibleService]= useState<boolean>(false);


  return (
    <View>
      <Modal visible={visibleService} setVisible={setVisibleService} item={item}/>
      <Swipeable
        key={item.id}
      >
        <TouchableOpacity
          className="px-4 py-2 bg-white border-b border-zinc-300 rounded-lg flex-row items-center justify-between"
          style={styles.card}
          onPress={
            ()=> setVisibleService(true)
          }
        >
          <View className="flex-row items-center flex-1">
            <View className="mr-3" style={{ position: "relative" }}>
              {item?.CPF_Creator?.collaborator?.picture ?  (
                <Image
                  source={{ uri: item.CPF_Creator.collaborator.picture }}
                  style={{ width: rf(43), height: rf(43) }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="rounded-full bg-zinc-100 items-center justify-center p-3 w-12 h-12">
                  <UserRound size={rf(25)} />
                </View>
              )}

              {item.isVerified && (
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
            
            <View className="pr-2">
              <Text
                style={{ ...FONTS.font, fontSize: rf(12) }}
                numberOfLines={1}
                ellipsizeMode="tail"
                className="capitalize"
              >
                {item?.title && item.title}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-green-600"
              >
                {item?.salary && Mask("amount", item.salary)} {item?.typePayment && item.typePayment}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item?.category && item.category}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
              {item?.CPF_Creator?.collaborator?.collaborator?.city && item.CPF_Creator.collaborator.collaborator.city},  {item?.CPF_Creator?.collaborator?.collaborator?.uf && item.CPF_Creator.collaborator.collaborator.uf}
              </Text>
            </View>
          </View>
          <View className="mr-3">
            <ChevronRight size={rf(20)} />
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardWrapper: {
    position: "relative",
    minHeight: rf(20),
  },
  cardContainer: {
    minHeight: rf(20),
    overflow: "visible",
  },
  card: {
    width: "100%",
    minHeight: rf(80),
    overflow: "visible",
  },
});
