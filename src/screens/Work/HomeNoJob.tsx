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
  ActivityIndicator,
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
<<<<<<< HEAD
import TimeLineAdmiss from "./TimeLineAdmiss";

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
=======
>>>>>>> master

export default function HomeNoWork({ setTitleWork }) {
  const navigation = useNavigation<NavigationProp<any>>();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousCards, setPreviousCards] = useState([]);
<<<<<<< HEAD
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
=======
>>>>>>> master

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
            // console.log("response",collaborator.CPF)
            if (response.status !== 200) {
              console.error("Erro ao buscar os cards:", response.message);
              return;
            }

            setJobConected(response.jobs);
            // console.log("response.jobs",response.jobs)
            if (response.processAdmission) {
              setAdmission(true);
              setTitleWork("Processo admissional"); 
              setProcessAdmission(true);
              
              // navigation.navigate("TimeLineAdmiss", { jobConected: response.jobs, CPF: collaborator.CPF });

              // console.log("response.processAdmission", response.processAdmission);

            } else {
              setAdmission(false);
              setTitleWork("Vagas aplicadas");
              // console.log("response.processAdmission", response.processAdmission);
            }

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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : processAdmission ? (
        <>
          <HomeAdmission 
            jobConected={jobConected} 
            CPF={collaborator.CPF} 
          />
        </>
      ) : !process ? (
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
          <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            {jobConected && jobConected.length > 0 ? (
              jobConected.map((job) => (
                <CardHistory 
                  key={job.id} 
                  job={job} 
                />
              ))
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                Sem vagas registradas
              </Text>
            )}
          </ScrollView>
        </>
      ) : (
        collaborator && (
          <HomeAdmission 
            jobConected={jobConected} 
            CPF={collaborator.CPF} 
          />
        )
      )}
      <DevelopmentModal
        visible={isShowDevelopment}
        close={closeDevelopment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dismissButton: {
    backgroundColor: '#FF4B4B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#FFFFFF',
    ...FONTS.fontSemiBold,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

