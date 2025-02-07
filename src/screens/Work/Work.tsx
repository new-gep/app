import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
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
import DismissalHome from "./Dismissal/Home";
import PayStub from "./PayStub";
import TimeClock from "./TimeClock";
import Absence from "./Absence";
// import DismissalHomeCompany from "./Dismissal/DismissalHomeCompany";;
import Home from "./Home";
//import HomeAdmission from "./HomeAdmission";

type WishlistScreenProps = StackScreenProps<RootStackParamList, "Work">;

const Stack = createStackNavigator();

const WorkContent = () => {
  const [titleWork, setTitleWork] = useState<string>("");
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
          console.log(response.jobs);
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
        leftIcon={hasWork ? "back" : "home"}
        rightIcon1={hasWork ? "search" : "search"}
      />

      <ScrollView
        className={`bg-white`}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: wishList.length === 0 ? "center" : "flex-start",
        }}
      >
        {hasWork ? (
          <HomeWork setTitleWork={setTitleWork} navigation={navigation} />
        ) : (
          <HomeNoWork setTitleWork={setTitleWork} />
        )}
      </ScrollView>
    </View>
  );
};

const Work = () => {
  const [titleWork, setTitleWork] = useState<string>("");
  const [hasWork, setHaswork] = useState<boolean>(false);
  const { collaborator, fetchCollaborator } = useCollaborator();
  const { validateCollaborator, missingData } = useCollaboratorContext();
  const navigation = useNavigation<NavigationProp<any>>();

  // Verificação Se Trabalha
  useEffect(() => {
    const fetchData = async () => {
      if (collaborator) {
        const response = await FindCollaborator(collaborator.CPF);
        if (response.status == 200) {
          // console.log(response.jobs);
          if (response.collaborator.id_work) {
            setHaswork(true);
          }
        }
      }
    };
    fetchData();
  }, [collaborator]);

  // Verificação Cadastral
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

  return (
    <>
      {hasWork ? 
        <Home setTitleWork={setTitleWork} navigation={navigation}/> 
        :
        <HomeNoWork setTitleWork={setTitleWork} />
      }
    
    </>

  );
};

export default Work;
