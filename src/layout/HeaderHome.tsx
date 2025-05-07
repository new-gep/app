import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "../constants/theme";
import { GlobalStyleSheet } from "../constants/StyleSheet";
import { FontAwesome } from "@expo/vector-icons";
import Mask from "../function/mask";
import { useDispatch } from "react-redux";
import { openDrawer } from "../redux/actions/drawerAction";

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
  collaborator?: any;
  classStyle?: string;
};

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
  collaborator,
  classStyle,
}: Props) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  return (
    <View
      style={[
        {
          height: 65,
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
        className={classStyle}
        style={[
          GlobalStyleSheet.container,
          {
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 15,
            justifyContent: "space-between",
          },
        ]}
      >
        {leftIcon === "menu" && (
          <TouchableOpacity
            focusable={false}
            activeOpacity={1}
            onPress={() => {
              dispatch(openDrawer());
            }}
            style={[styles.actionBtn, { backgroundColor: "#F6F6F6" }]}
          >
            <Feather size={24} color={COLORS.title} name={"menu"} />
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
                fontSize: 20,
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
          <View className="mt-4 px-4" style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                ...FONTS.fontRegular,
                fontSize: 14,
                color: colors.title,
              }}
            >
              Bem-Vindo(a)!
            </Text>
            <Text
              style={{
                ...FONTS.fontSemiBold,
                fontSize: 24,
                color: colors.title,
              }}
            >
              {collaborator && Mask("firstName", collaborator.name)}
            </Text>
          </View>
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
    height: 60,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
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
