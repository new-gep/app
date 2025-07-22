import { Check, ChevronRight, EllipsisVertical, UserRound } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet, Dimensions, Alert } from "react-native";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { Swipeable } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import ServiceInformation from "../../Home/Helper/Modal/ServiceInformation";
import Unapply from "~/src/hooks/update/announcement/unapply";
import useCollaborator from "~/src/function/fetchCollaborator";
const SCREEN_WIDTH = Dimensions.get("window").width;

const Service = React.memo(function SwipeableCard({
  item,
  refresh,
  setRefresh,
}: any) {
  const [visible, setVisible] = useState<boolean>(false);
  const { collaborator } = useCollaborator();

  const handleUnapply = async () => {
      if (!collaborator) return;
  
      Alert.alert(
        "Confirmar desistência",
        "Tem certeza que deseja desistir desta candidatura?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Sim, desistir",
            style: "destructive",
            onPress: async () => {
              try {
                const response = await Unapply(
                  item.announcement.announcement.id,
                  collaborator.CPF
                );
                if (response.status === 200) {
                  Alert.alert(
                    "Sucesso",
                    "Você desistiu da candidatura com sucesso."
                  );
                  setRefresh((prev: number) => prev + 1);
                  setVisible(false);
                } else {
                  Alert.alert(
                    "Erro",
                    "Não foi possível desistir da candidatura. Tente novamente."
                  );
                }
              } catch (error) {
                console.error(error);
                Alert.alert(
                  "Erro",
                  "Ocorreu um erro ao tentar desistir da candidatura."
                );
              }
            },
          },
        ]
      );
  };

  return (
    <View style={styles.cardWrapper}>
      <ServiceInformation
        handleSwipeRight={handleUnapply}
        visible={visible}
        setVisible={setVisible}
        peopleData={{...item.announcement.announcement, apply:true}}
      />
      <Swipeable
        key={item.id}
        onSwipeableOpen={() => null}
        renderRightActions={() => null}
        renderLeftActions={() => null} // <- necessário para permitir o swipe à direita
      >
        <TouchableOpacity
          className="px-4 py-2 bg-white border-b border-zinc-300 rounded-lg flex-row items-center justify-between"
          style={styles.card}
          onPress={() => setVisible(true)}
        >
          <View className="flex-row items-center flex-1">
            <View className="mr-3" style={{ position: "relative" }}>
              {item && item.photoUri ? (
                <Image
                  source={{ uri: item.photoUri }}
                  style={{ width: rf(43), height: rf(43) }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="rounded-full bg-zinc-100 items-center justify-center p-3 w-12 h-12">
                  <UserRound size={rf(25)} />
                </View>
              )}

              {item && item.isVerified && (
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
                {item.announcement?.announcement?.title ? item.announcement?.announcement?.title : "Sem título"}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-green-600"
              >
                {`${item.announcement?.announcement?.salary && Mask("amount", item.announcement?.announcement?.salary)} ${item.announcement?.announcement?.typePayment ? item.announcement?.announcement?.typePayment : ""}`}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item.announcement?.announcement?.category ? item.announcement?.announcement?.category : "Sem categoria"}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item.locality}
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
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardWrapper: {
    position: "relative",
    width: SCREEN_WIDTH - rf(30),
    minHeight: rf(20),
  },
  cardContainer: {
    width: SCREEN_WIDTH - rf(32),
    minHeight: rf(20),
    overflow: "visible",
  },
  card: {
    width: "100%",
    minHeight: rf(80),
    overflow: "visible",
  },
});

export default Service