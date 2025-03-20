import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { COLORS, FONTS } from "../../constants/theme";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { addTowishList } from "../../redux/reducer/wishListReducer";
import ImageSwiper from "../../components/ImageSwiper";
import Cardstyle4 from "../../components/Card/Cardstyle4";
import { openDrawer } from "../../redux/actions/drawerAction";
import ProfileCompletionModal from "../../components/Modal/ProfileLock";
import ValidateCollaboratorAndBlock from "../utils/validateCollaboratorAndBlock";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Mask from "../../function/mask";
import useCollaborator from "../../function/fetchCollaborator";
import { useCollaboratorContext } from "../../context/CollaboratorContext";
import DevelopmentModal from "../../components/Modal/Development";
import FindOneJob from "../../hooks/get/job/findOne";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import Header from "../../layout/Header";

const ArrivalData = [
  {
    id: "1",
    title: "Ponto",
    subtitle: "Atalho",
    image: IMAGES.order,
    route: "Point",
  },
  {
    id: "2",
    title: "Holerite",
    subtitle: "Atalho",
    image: IMAGES.payment,
    route: "PayStub",
  },
  // {
  //     id:"3",
  //     title: "Vagas",
  //     subtitle:"Atalho",
  //     image:IMAGES.send
  // },
  {
    id: "4",
    title: "Ausência",
    subtitle: "Atalho",
    image: IMAGES.chat,
    route: "Absence",
  },
  {
    id: "5",
    title: "Demissão",
    subtitle: "Atalho",
    image: IMAGES.chat,
    route: "DismissalHome",
  },
];

export default function HomeWork({
  setTitleWork,
  navigation,
  jobConected,
  CPF,
}) {
  const SwiperData = [
    {
      id: "1",
      image: IMAGES.unique12,
      title: "Holerite",
      subtitle: "Assine e cheque seu pagamento",
      route: "PayStub" as keyof RootStackParamList,
      params: {
        jobConected: jobConected,
        CPF: CPF,
      },
    },
    {
      id: "2",
      image: IMAGES.unique11,
      title: "Ausência",
      subtitle: "Envia seu atestado e justificativas",
      route: "Absence" as keyof RootStackParamList,
      params: {
        jobConected: jobConected,
        CPF: CPF,
      },
    },
    {
      id: "3",
      image: IMAGES.unique12,
      title: "Ponto",
      subtitle: "Assine e cheque seu ponto",
      route: "Point" as keyof RootStackParamList,
      params: {
        jobConected: jobConected,
        CPF: CPF,
      },
    },
  ];

  const dispatch = useDispatch();
  const [isShowDevelopment, setIsShowDevelopment] = useState<boolean>(false);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const { collaborator, fetchCollaborator } = useCollaborator();
  const { validateCollaborator, missingData } = useCollaboratorContext();
  const [loading, setLoading] = useState<boolean>(true);

  const closeDevelopment = () => {
    setIsShowDevelopment(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Inicia o carregamento
        await fetchCollaborator(); // Simula uma chamada de API
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchData();
  }, []);

  // useEffect(()=>{
  //     console.log("lalala",JobConect)
  // })

  return (
    <View className="flex-1 bg-white">
      {loading ? (
        <View className="flex-1">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <>
          <DevelopmentModal
            close={closeDevelopment}
            visible={isShowDevelopment}
          />
          {/* <Header
                        title="Meu trabalho"
                        leftIcon="back"
                    /> */}
          <View className="flex-1">
            <View className="px-8 pt-8">
              <View className="flex flex-row items-start">
                <View>
                  <Text className="text-sm text-gray-600">Bem-Vindo(a) !</Text>
                  <Text className="text-2xl font-semibold text-gray-800">
                    {collaborator && Mask("firstName", collaborator.name)}
                  </Text>
                </View>
              </View>
            </View>
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-row w-full bg-black">
                <ImageSwiper
                  data={SwiperData}
                  onItemPress={(item) => {
                    if (item.route) {
                      navigation.navigate(item.route, item.params || {
                        jobConected: jobConected,
                        CPF: CPF
                      });
                    }
                  }}
                />
              </View>
              <View>
                <View className="px-8 mt-20">
                  <Text className="text-lg font-medium text-gray-800">
                    Categorias
                  </Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 30 }}
                >
                  <View className="flex-row items-center gap-8 mr-6 mb-8">
                    {ArrivalData.map((data: any, index) => (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => {
                          if (data.route) {
                            navigation.navigate(data.route, {
                              jobConected: jobConected,
                              CPF: CPF
                            });
                          }
                        }}
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md w-48"
                      >
                        <View className="flex-row items-center gap-4">
                          <Image
                            source={data.image}
                            className="w-8 h-8"
                            tintColor="#2f2f2f"
                          />
                          <View>
                            <Text className="text-lg font-medium text-gray-800">
                              {data.title}
                            </Text>
                            <Text className="text-base text-primary">
                              {data.subtitle}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  notifactioncricle: {
    height: 16,
    width: 16,
    borderRadius: 16,
    // backgroundColor:COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 2,
    right: 2,
  },
  flex: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  TextInput: {
    ...FONTS.fontRegular,
    fontSize: 16,
    color: COLORS.title,
    height: 60,
    borderRadius: 61,
    paddingHorizontal: 40,
    paddingLeft: 30,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    backgroundColor: "#FAFAFA",
  },
  brandsubtitle2: {
    ...FONTS.fontSemiBold,
    fontSize: 12,
    // color:COLORS.card
  },
  brandsubtitle3: {
    ...FONTS.fontMedium,
    fontSize: 12,
    color: COLORS.title,
  },
  title1: {
    ...FONTS.fontBold,
    fontSize: 28,
    color: COLORS.title,
  },
  title2: {
    ...FONTS.fontRegular,
    fontSize: 12,
    color: COLORS.title,
  },
  title3: {
    ...FONTS.fontSemiBold,
    fontSize: 24,
    color: "#8ABE12",
    //textAlign:'right'
  },
  colorCard: {},
  colorCardTitle: {
    ...FONTS.fontMedium,
    fontSize: 12,
    color: COLORS.title,
    lineHeight: 20,
    textAlign: "center",
  },
  arrivaldata: {
    // backgroundColor:COLORS.card,
    borderRadius: 18,
    width: 199,
    paddingHorizontal: 10,
    paddingLeft: 25,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    shadowColor: "rgba(4,118,78,.6)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.34,
    shadowRadius: 18.27,
    elevation: 4,
  },
  wave1: {
    height: 200,
    borderBottomLeftRadius: 50, // Arredonda para criar o efeito de onda
    borderBottomRightRadius: 50,
    transform: [{ rotate: "-15deg" }],
  },
  wave2: {
    height: 150,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    marginTop: -50, // Sobreposição para criar profundidade
    transform: [{ rotate: "10deg" }],
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  dismissButton: {
    backgroundColor: "#FF4B4B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  dismissButtonText: {
    color: "#FFFFFF",
    ...FONTS.fontSemiBold,
    fontSize: 16,
  },
  pageTitle: {
    ...FONTS.fontSemiBold,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
});
