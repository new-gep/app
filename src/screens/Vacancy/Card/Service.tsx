import { Check, ChevronRight, EllipsisVertical, UserRound } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet, Dimensions } from "react-native";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { Swipeable } from "react-native-gesture-handler";
import { FONTS } from "~/src/constants/theme";
import Mask from "~/src/function/mask";
import ServiceInformation from "../../Home/Helper/Modal/ServiceInformation";
const SCREEN_WIDTH = Dimensions.get("window").width;

const Service = React.memo(function SwipeableCard({
  item,
  onSwipeRight,
  onSwipeLeft,
  navigateToCardInformation,
}: any) {
  const [visible, setVisible] = useState<boolean>(false);

  const renderLeftActions = () => (
    <View className=" justify-center pl-6 flex-1 rounded-lg"></View>
  );

  const renderRightActions = () => (
    <View className="justify-center items-center  w-20">
      <TouchableOpacity onPress={() => setVisible(true)}>
        <EllipsisVertical size={rf(25)} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.cardWrapper}>
      <ServiceInformation
        handleSwipeRight={onSwipeRight}
        visible={visible}
        setVisible={setVisible}
        peopleData={item}
        autoView={true}
      />
      <Swipeable
        key={item.id}
        onSwipeableOpen={(direction) => {
          if (direction === "left") {
            onSwipeRight(item.id);
          }
        }}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions} // <- necessário para permitir o swipe à direita
      >
        <TouchableOpacity
          className="px-4 py-2 bg-white border-b border-zinc-300 rounded-lg flex-row items-center justify-between"
          style={styles.card}
          onPress={navigateToCardInformation}
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
              >
                {item.function}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-green-600"
              >
                {`${Mask("amount", item.salary)} ${item.valueType}`}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item.model}
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