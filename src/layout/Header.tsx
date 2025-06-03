import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "../constants/theme";
import { GlobalStyleSheet } from "../constants/StyleSheet";
import { FontAwesome } from "@expo/vector-icons";
import { Dimensions } from "react-native";

type Props = {
  title?: string;
  leftIcon?: string;
  leftAction?: any;
  transparent?: any;
  productId?: string;
  titleLeft?: any;
  titleLeft2?: any;
  titleRight?: any;
  rightIcon1?: any;
  rightIcon2?: any;
  rightIcon3?: string;
  rightIcon4?: any;
  iconSimple?: any;
  dynamic?: any;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Header = ({
  title,
  leftIcon,
  iconSimple,
  leftAction,
  transparent,
  productId,
  titleLeft,
  titleLeft2,
  titleRight,
  rightIcon1,
  rightIcon4,
  rightIcon2,
  rightIcon3,
  dynamic,
}: Props) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const navigation = useNavigation<any>();

  return (
    <View
      style={[
        {
          height: SCREEN_HEIGHT * 0.10,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99,
        },
        transparent && {
          position: "absolute",
          left: 0,
          right: 0,
          borderBottomWidth: 0,
        },
        Platform.OS === "ios" && {
          backgroundColor: colors.card,
        },
      ]}
    >
      <View
        style={[
          GlobalStyleSheet.container,
          {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        ]}
      >
        {leftIcon === "back" && !dynamic && (
          <TouchableOpacity
            onPress={() => (leftAction ? leftAction() : navigation.goBack())}

            style={[styles.actionBtn, { backgroundColor: "#F6F6F6" }]}
          >
            <Feather size={24} color={COLORS.title} name={"arrow-left"} />
          </TouchableOpacity>
        )}
        {dynamic && (
          <TouchableOpacity
            onPress={() => dynamic()}
            style={[styles.actionBtn, { backgroundColor: "#F6F6F6" }]}
          >
            <Feather size={24} color={COLORS.title} name={"arrow-left"} />
          </TouchableOpacity>
        )}

        <View style={{ flex: 1 }}>
          {productId ? (
            <Text
              style={{
                ...FONTS.fontMedium,
                fontSize: 24,
                color: colors.title,
                textAlign: titleLeft ? "left" : "center",
                paddingLeft: titleLeft2 ? 10 : 10,
                paddingRight: titleRight ? 20 : 0,
              }}
            >
              <Text style={{ color: COLORS.primary }}>e</Text>Bike
            </Text>
          ) : (
            <Text
              style={{
                ...FONTS.fontSemiBold,
                fontSize: 18,
                color: colors.title,
                textAlign: titleLeft ? "left" : "center",
                paddingLeft: titleLeft2 ? 10 : 10,
                paddingRight: titleRight ? 40 : 0,
              }}
            >
              {title}
            </Text>
          )}
        </View>
        {rightIcon1 == "search" && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("Search")}
            style={[styles.actionBtn, {}]}
          >
            <Feather size={20} color={colors.title} name={"briefcase"} />
          </TouchableOpacity>
        )}
        {rightIcon2 == "Edit" && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("EditProfile")}
            style={[styles.actionBtn, {}]}
          >
            <FontAwesome size={22} color={colors.title} name={"pencil"} />
          </TouchableOpacity>
        )}
        {rightIcon3 == "cart" && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("MyCart")}
            style={[styles.actionBtn, {}]}
          >
            <FontAwesome
              size={22}
              color={colors.title}
              name={"shopping-cart"}
            />
          </TouchableOpacity>
        )}
        {rightIcon4 == "home" && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              navigation.navigate("DrawerNavigation", { screen: "Home" })
            }
            style={[styles.actionBtn, {}]}
          >
            <FontAwesome size={22} color={colors.title} name={"home"} />
          </TouchableOpacity>
        )}
        {iconSimple && (
          <View style={[styles.actionBtn, {}]}>
            <FontAwesome size={22} color={colors.title} name={iconSimple} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: SCREEN_HEIGHT * 0.06,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    ...FONTS.fontMedium,
  },
  actionBtn: {
    height: 45,
    width: 45,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor:COLORS.card
    // position:'absolute',
    // left:10,
    // top:10,
  },
});

export default Header;
