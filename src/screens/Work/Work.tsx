import React, { useEffect, useState } from "react";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { View, ScrollView, Image, Text, BackHandler } from "react-native";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { COLORS, FONTS } from "../../constants/theme";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/reducer/cartReducer";
import { removeFromwishList } from "../../redux/reducer/wishListReducer";
import Cardstyle2 from "../../components/Card/Cardstyle2";
import useCollaborator from "../../function/fetchCollaborator";
import FindCollaborator from "../../hooks/findOne/collaborator";
import HomeWork from "./Home";
import HomeNoWork from "./HomeNoJob";
import { useCollaboratorContext } from "../../context/CollaboratorContext";
//import HomeAdmission from "./HomeAdmission";

type WishlistScreenProps = StackScreenProps<RootStackParamList, "Work">;

const Work = () => {
  const [titleWork, setTitleWork] = useState<string>('');
  const [hasWork, setHaswork] = useState<boolean>(false);
  const { collaborator, fetchCollaborator } = useCollaborator();
  const { validateCollaborator, missingData } = useCollaboratorContext();
  const navigation = useNavigation<NavigationProp<any>>();
  const wishList = useSelector((state: any) => state.wishList.wishList);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const addItemToCart = (data: any) => {
    dispatch(addToCart(data));
  };
  const removeItemFromWishList = (data: any) => {
    dispatch(removeFromwishList(data));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCollaborator();
      validateCollaborator();
      const backHandlerSubscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          return true;
        }
      );
      return () => backHandlerSubscription.remove();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (collaborator) {
        const response = await FindCollaborator(collaborator.CPF);
        if (response.status == 200) {
          if (response.collaborator.id_work) {
            setHaswork(true);
          }
        }
      }
    };
    fetchData();
  }, [collaborator]);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title={titleWork}
        leftIcon={hasWork ? "back" : "back"} // Exemplo de alternar o ícone esquerdo
        rightIcon1={hasWork ? "search" : "search"} // Exemplo de alternar o ícone direito
        // titleLeft, se precisar
      />

      <ScrollView
        className={`bg-white`}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: wishList.length === 0 ? "center" : "flex-start",
        }}
      >
        {hasWork ? <HomeWork setTitleWork={setTitleWork}/> : <HomeNoWork setTitleWork={setTitleWork}/>}
      </ScrollView>
    </View>
  );
};

export default Work;
