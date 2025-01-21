import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
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
import FindAplicateInJob from "../../hooks/get/job/findAplicateJob";
import CardHistory from "./CardHistoryJobCadastrate";
import fetchCollaborator from "../../function/fetchCollaborator";
import HomeAdmission from "./HomeAdmission";

const ArrivalData = [
  {
    id: "1",
    title: "Ponto",
    subtitle: "Atalho",
    image: IMAGES.order,
  },
  {
    id: "2",
    title: "Holerite",
    subtitle: "Atalho",
    image: IMAGES.payment,
  },
  {
    id: "3",
    title: "Vagas",
    subtitle: "Atalho",
    image: IMAGES.send,
  },
  {
    id: "4",
    title: "Ausência",
    subtitle: "Atalho",
    image: IMAGES.chat,
  },
];

export default function HomeNoWork({ setTitleWork }) {
  const navigation = useNavigation<NavigationProp<any>>();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousCards, setPreviousCards] = useState([]);
  const SwiperData = [
    {
      id: "1",
      image: IMAGES.unique10,
      title: "Holerite",
      subtitle: "Assine e cheque seu pagamento",
    },
    {
      id: "2",
      image: IMAGES.unique11,
      title: "Ausência",
      subtitle: "Envia seu atestado e justificativas",
    },
    {
      id: "3",
      image4: IMAGES.unique12,
      title: "Ponto",
      sule: "Assine e cheque seu ponto",
    },
  ];

  const dispatch = useDispatch();
  const [isShowDevelopment, setIsShowDevelopment] = useState<boolean>(false);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const { collaborator, fetchCollaborator } = useCollaborator();
  const { validateCollaborator, missingData } = useCollaboratorContext();

  const [jobConected, setJobConected] = useState<any>(null);
  const [processAdmission, setProcessAdmission] = useState<any>(null); 

  const [process, setAdmission] = useState<any>(null); 

  const closeDevelopment = () => {
    setIsShowDevelopment(false);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        if (collaborator) {
          try {
            const response = await FindAplicateInJob(collaborator.CPF);
            if (response.status !== 200) {
              console.error("Erro ao buscar os cards:", response.message);
              return;
            }

            setJobConected(response.jobs);
            if (response.processAdmission) {
              setAdmission(true);
              setTitleWork("Processo admissional");
            } else {
              setAdmission(false);
              setTitleWork("Vagas aplicadas");
            }

            // if (response.processAdmission && response.processAdmission) {
            //   setProcessAdmission(response.processAdmission);

            // } 
            return;

          } catch (error) {
            console.error("Erro ao buscar os cards:", error);
          } finally {
              setIsLoading(false);

          }
        }
      };

      fetchData();

      
    }, [collaborator])
  );

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      {!process ? (
        <>
          <View style={{ paddingHorizontal: 30, padding: 0, paddingTop: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
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
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {jobConected && jobConected.length > 0 ? (
              jobConected.map((job) => <CardHistory key={job.id} job={job} />)
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                Sem vagas registradas
              </Text>
            )}
          </ScrollView>
        </>
      ) : (
        collaborator && (
          <HomeAdmission jobConected={jobConected} CPF={collaborator.CPF} />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  notifactioncricle: {
    height: 16,
    width: 16,
    borderRadius: 16,
    backgroundColor: COLORS.card,
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
    color: COLORS.card,
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
    backgroundColor: COLORS.card,
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
});
function validateCollaborator() {
  throw new Error("Function not implemented.");
}
