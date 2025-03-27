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
  Dimensions,
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
import TimeLineAdmiss from "./TimeLineAdmiss";
import Button from '../../components/Button/Button'
import Header from '../../layout/Header';
import JobApplicationCard from '../../components/Card/JobApplicationCard';

const { width, height } = Dimensions.get("window");

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
  const [searchQuery, setSearchQuery] = useState('');
  
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

  const fetchJobs = async () => {
    setIsLoading(true);
    if (collaborator) {
      try {
        const response = await FindAplicateInJob(collaborator.CPF);
        if (response.status !== 200) {
          console.log("Erro ao buscar os cards:", response.message);
          setJobConected([]);
          return;
        }

        const jobs = Array.isArray(response.jobs) ? response.jobs : [];
        setJobConected(jobs);
        
        if (response.processAdmission) {
          setAdmission(true);
          setTitleWork("Processo admissional");
          setProcessAdmission(true);
        } else {
          setAdmission(false);
          setTitleWork("Vagas aplicadas");
        }

      } catch (error) {
        console.error("Erro ao buscar os cards:", error);
        setJobConected([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
    }, [collaborator])
  );

  const filteredJobs = jobConected?.filter(job => 
    job.function.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ backgroundColor: colors.card, flex: 1 }}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : processAdmission ? (
        <>
          <HomeAdmission jobConected={jobConected} CPF={collaborator.CPF} />
        </>
      ) : !process ? (
        <>
          <Header
            title='Vagas Cadastradas'
            leftIcon={'back'}
            iconSimple={'archive'}        
          />
          <View className="px-4 mt-4">
            <TextInput
              placeholder="Buscar vaga..."
              placeholderTextColor="#9CA3AF"
              className="p-3 border border-gray-300 rounded-lg text-gray-900"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <View className="mt-5 flex justify-between items-center h-full">
            {jobConected && jobConected.length > 0 ? (
              <ScrollView 
                style={{ width: '100%' }}
                showsVerticalScrollIndicator={false}
              >
                {filteredJobs?.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobApplicationCard key={job.id} job={job} company={job.company}/>
                  ))
                ) : (
                  <View className="py-20 items-center justify-center">
                    <Text className="text-lg text-gray-500 font-semibold">
                      Não há uma vaga com este nome
                    </Text>
                    <Text className="text-gray-400 mt-2 text-center px-8">
                      Tente buscar com outro termo
                    </Text>
                  </View>
                )}
              </ScrollView>
            ) : (
              <View
                style={{
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    ...FONTS.fontSemiBold,
                    fontSize: 16,
                    color: colors.title,
                    marginBottom: 5,
                    marginTop: 40,
                  }}
                >
                  Sem vagas cadastradas
                </Text>
                <Text className="text-center text-sm text-gray-400 font-normal">
                  Não se cadastrou em nenhuma vaga até o momento
                </Text>

                <Image
                  source={require("../../assets/images/brand/Business-nojob.png")}
                  style={{ width: width * 0.7, height: height * 0.5 }}
                  resizeMode="contain"
                />

                <Button 
                  title={"Ver Vagas"}
                  onPress={() => navigation.navigate('Home')}
                  text={COLORS.title}
                  color={COLORS.primary}
                  style={{borderRadius:52 , width: width * 0.7}}
                />
              </View>
            )}
          </View>
        </>
      ) : null}
      <DevelopmentModal visible={isShowDevelopment} close={closeDevelopment} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});