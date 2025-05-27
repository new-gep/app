import React from "react";
import BottomNavigation from "./BottomNavigation";
import { View, Animated } from "react-native";
import { useTheme } from "@react-navigation/native";
import DrawerMenu from "../layout/DrawerMenu";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "../redux/actions/drawerAction";
import SideMenu from "react-native-side-menu-updated";

const DrawerNavigation = () => {
  const { isOpen } = useSelector((state: any) => state.drawer);

  const dispatch = useDispatch();

  const { colors } = useTheme();

  return (
    <>
      <View
        style={{
          flex: 1,
          zIndex: 999,
        }}
      >
        {/* <SideMenu
          isOpen={isOpen}
          menu={<DrawerMenu />}
          onChange={(e) => {
            e === false ? dispatch(closeDrawer()) : null;
          }}
          animationFunction={(prop, value) => Animated.timing(prop, {
            toValue: value,
            useNativeDriver: true,
          })}
        > 
        </SideMenu> */}
          <BottomNavigation />
      </View>
    </>
  );
};

export default DrawerNavigation;
