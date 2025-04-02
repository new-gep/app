import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { COLORS, FONTS } from "../../constants/theme";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Header from "../../layout/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadScreenSimple from "../../components/LoadScreen/Simple";
import Mask from "../../function/mask";
import CheckCadasterCollaboratorProfile from "../utils/checkCadasterCollaboratorProfile";
import FindBucketCollaborator from "../../hooks/bucket/collaborator";
import useCollaborator from "../../function/fetchCollaborator";
import DevelopmentModal from "../../components/Modal/Development";
import Feather from "@expo/vector-icons/build/Feather";

type ProfileScreenProps = StackScreenProps<RootStackParamList, "Profile">;

const getZodiacSign = (date: string | null | undefined): { sign: string, icon: any } => {
  if (!date) return { sign: "Não informado", icon: IMAGES.help };
  
  const [day, month] = date.split("-").map(Number);
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
    return { sign: "Áries", icon: require("../../assets/images/zoadicSign/aries.png") };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
    return { sign: "Touro", icon: require("../../assets/images/zoadicSign/Taurus.png") };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
    return { sign: "Gêmeos", icon: require("../../assets/images/zoadicSign/gemini.png") };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
    return { sign: "Câncer", icon: require("../../assets/images/zoadicSign/cancer.png") };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
    return { sign: "Leão", icon: require("../../assets/images/zoadicSign/leo.png") };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
    return { sign: "Virgem", icon: require("../../assets/images/zoadicSign/virgo.png") };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
    return { sign: "Libra", icon: require("../../assets/images/zoadicSign/libra.png") };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return { sign: "Escorpião", icon: require("../../assets/images/zoadicSign/scorpio.png") };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return { sign: "Sagitário", icon: require("../../assets/images/zoadicSign/Sagittarius.png") };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return { sign: "Capricórnio", icon: require("../../assets/images/zoadicSign/capricorn.png") };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return { sign: "Aquário", icon: require("../../assets/images/zoadicSign/aquarius.png") };
  
  return { sign: "Peixes", icon: require("../../assets/images/zoadicSign/Pisces.png") };
};

const Profile = ({ navigation }: ProfileScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const { collaborator, fetchCollaborator } = useCollaborator();
  const [isShowDevelopment, setIsShowDevelopment] = useState<boolean>(false);
  const [path, setPath] = useState<any | null>(null);

  const profileData = [
    {
      id: "1",
      image: IMAGES.call,
      title: "Celular",
      subtitle: collaborator && `+55 ${Mask("phone", collaborator.phone)}`,
    },
    {
      id: "2",
      image: IMAGES.email,
      title: "E-mail",
      subtitle: collaborator && Mask("emailBreakLine", collaborator.email),
    },
    {
      id: "3",
      image: IMAGES.cake,
      title: "Data de Nascimento",
      subtitle: collaborator && Mask("dateFormatBrazil", collaborator.birth),
    },
    {
      id: "3.1",
      image: null,
      title: "Signo",
      subtitle: collaborator && getZodiacSign(Mask("dateFormatBrazil", collaborator.birth)).sign,
      iconName: collaborator && getZodiacSign(Mask("dateFormatBrazil", collaborator.birth)).icon,
    },
    {
      id: "4",
      image: IMAGES.children,
      title: "Filhos",
      subtitle: collaborator
        ? collaborator.children == 0
          ? "Sem filhos"
          : collaborator.children &&
            Object.keys(collaborator.children).length > 0
          ? `${Object.keys(collaborator.children).length} Filhos`
          : "Cadastro incompleto"
        : "Cadastro incompleto",
    },
    {
      id: "5",
      image: IMAGES.ring,
      title: "Casado(a)",
      subtitle:
        collaborator &&
        `${
          collaborator && collaborator.marriage
            ? collaborator.marriage == "1"
              ? "Sim"
              : "Não"
            : "Cadastro incompleto"
        }`,
    },
    {
      id: "6",
      image: IMAGES.WheelchairDuoTone,
      title: "PCD",
      subtitle:
        collaborator &&
        `${
          collaborator && collaborator.PCD
            ? collaborator.PCD == "1"
              ? "Sim"
              : "Não"
            : "Cadastro incompleto"
        }`,
    },
    {
      id: "7",
      image: IMAGES.map,
      title: "Endereço",
      subtitle:
        collaborator &&
        `${
          collaborator.zip_code &&
          collaborator.street &&
          collaborator.number &&
          collaborator.district &&
          collaborator.city &&
          collaborator.uf
            ? `${collaborator.street} N° ${collaborator.number}, ${collaborator.district}, ${collaborator.city} - ${collaborator.uf}`
            : "Cadastro incompleto"
        }`,
    },
  ];

  const profilecartData = [
    {
      id: "1",
      title: "Ponto Digital\nRH",
      subtitle: "Gestão de Ponto",
      image: IMAGES.unique0,
    },
    {
      id: "2",
      title: "Holerite Digital\nRH",
      subtitle: "Gestão de Holerite",
      image: IMAGES.unique1,
    },
  ];

  const getPicture = async () => {
    try {
      const response = await FindBucketCollaborator(
        collaborator.CPF,
        "Picture"
      );
      if (response.status == 200) {
        setPath(response.path);
      }
    } catch (error) {
      console.error("Erro ao resgatar a imagem:", error);
    }
  };

  const closeDevelopment = () => {
    setIsShowDevelopment(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchCollaborator();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (collaborator) {
      getPicture();
    }
  }, [collaborator]);

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      <Header title="Perfil" leftIcon={"back"} rightIcon2={"Edit"} />
      {!collaborator ? (
        <LoadScreenSimple />
      ) : (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
        >
          <DevelopmentModal
            close={closeDevelopment}
            visible={isShowDevelopment}
          />
          {/* <View className={`px-5`}>
                    <CheckCadasterCollaboratorProfile/>
                </View> */}
          <View
            style={[
              GlobalStyleSheet.container,
              { alignItems: "center", marginTop: 50, padding: 0 },
            ]}
          >
            <View
              className={` ${
                path ? "bg-white" : "bg-neutral-300"
              } rounded-full h-32 w-32 justify-center items-center border-2  border-dark p-1`}
            >
              {path ? (
                <Image
                  className={`w-full h-full rounded-full`}
                  source={{ uri: path }}
                />
              ) : (
                <Image
                  className={`w-16 h-16 rounded`}
                  source={IMAGES.user2}
                  tintColor={`white`}
                />
              )}
            </View>
            <Text
              style={{
                ...FONTS.fontSemiBold,
                fontSize: 28,
                color: colors.title,
              }}
            >
              {collaborator && Mask("fullName", collaborator.name)}
            </Text>
            <Text
              style={{ ...FONTS.fontRegular, fontSize: 16, color: COLORS.dark }}
            >
              {collaborator && collaborator.city && collaborator.uf
                ? `${collaborator.city}, ${collaborator.uf}`
                : "Cadastro incompleto"}
            </Text>
          </View>
          <View
            style={[
              GlobalStyleSheet.container,
              { paddingHorizontal: 40, marginTop: 20 },
            ]}
          >
            <View>
              {profileData.map((data: any, index: any) => {
                return (
                  <View
                    key={index}
                    style={[
                      GlobalStyleSheet.flexcenter,
                      {
                        width: "100%",
                        gap: 20,
                        justifyContent: "flex-start",
                        marginBottom: 25,
                        alignItems: "flex-start",
                      },
                    ]}
                  >
                    <View
                      style={{ backgroundColor: COLORS.dark }}
                      className="rounded-full h-12 w-12 items-center justify-center"
                    >
                      {data.image ? (
                        <Image
                          style={[
                            GlobalStyleSheet.image3,
                            {
                              tintColor: COLORS.primary,
                              backgroundColor: COLORS.dark,
                            },
                          ]}
                          source={data.image}
                        />
                      ) : data.iconName ? (
                        <Image
                          style={{
                            width: 24,
                            height: 24,
                            tintColor: COLORS.primary
                          }}
                          source={data.iconName}
                        />
                      ) : (
                        <Feather
                          name="help-circle"
                          size={24}
                          color={COLORS.primary}
                        />
                      )}
                    </View>
                    <View className={`w-5/6 `}>
                      <Text
                        style={[styles.brandsubtitle2, { color: "#7D7D7D" }]}
                      >
                        {data.title}
                      </Text>
                      <Text
                        style={{
                          ...FONTS.fontMedium,
                          fontSize: 16,
                          color: colors.title,
                          marginTop: 5,
                        }}
                      >
                        {data.subtitle}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
          <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
            <View style={[GlobalStyleSheet.flex, { paddingHorizontal: 30 }]}>
              <Text
                style={[
                  styles.brandsubtitle3,
                  { fontSize: 18, color: colors.title },
                ]}
              >
                Serviços Dísponivel
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: -15,
                paddingHorizontal: 15,
                paddingTop: 25,
              }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 30 }}
              >
                <View style={[styles.profilecard]}>
                  {profilecartData.map((data: any, index) => {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                          if (data.id === "1") {
                            navigation.navigate("Point");
                          } else if (data.id === "2") {
                            navigation.navigate("PayStub");
                          }
                        }}
                        key={index}
                        style={[
                          styles.arrivaldata,
                          {
                            backgroundColor: COLORS.dark,
                            borderColor: "#EFEFEF",
                          },
                        ]}
                      >
                        <View
                          style={[
                            GlobalStyleSheet.flexcenter,
                            { gap: 20, justifyContent: "space-around" },
                          ]}
                        >
                          <Image
                            style={{
                              height: 100,
                              width: 100,
                              resizeMode: "contain",
                            }}
                            source={data.image}
                          />
                          <View>
                            <Text
                              numberOfLines={1}
                              style={{
                                ...FONTS.fontMedium,
                                fontSize: 16,
                                color: COLORS.primary,
                              }}
                            >
                              {data.title}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <Text
                                style={{
                                  ...FONTS.fontRegular,
                                  fontSize: 14,
                                  color: COLORS.primary,
                                  opacity: 0.5,
                                }}
                              >
                                {data.subtitle}
                              </Text>
                              <Image
                                style={{
                                  height: 16,
                                  width: 16,
                                  resizeMode: "contain",
                                }}
                                source={IMAGES.share}
                              />
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* <TouchableOpacity
              style={{
                height: 50,
                width: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={async () => {
                await AsyncStorage.clear();
                navigation.navigate("SingIn");
              }}
            >
              <Image source={IMAGES.logout} style={{ width: 20, height: 20 }} />
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  arrivaldata: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    //width:'100%',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#EFEFEF",
  },
  sectionimg: {
    height: 104,
    width: 104,
    borderRadius: 150,
    backgroundColor: COLORS.primary,
    overflow: "hidden",
    marginBottom: 25,
  },
  brandsubtitle2: {
    ...FONTS.fontRegular,
    fontSize: 12,
  },
  brandsubtitle3: {
    ...FONTS.fontMedium,
    fontSize: 12,
    color: COLORS.title,
  },
  profilecard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginRight: 10,
    marginBottom: 20,
  },
  cardimg: {
    height: 54,
    width: 54,
    borderRadius: 55,
    backgroundColor: COLORS.card,
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.34,
    shadowRadius: 18.27,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Profile;
