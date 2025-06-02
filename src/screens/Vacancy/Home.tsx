import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  Animated,
} from "react-native";
import Button from "../../components/Button/Button";
import JobApplicationCard from "../../components/Card/JobApplicationCard";
import { FONTS, COLORS } from "../../constants/theme";
import Header from "../../layout/Header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FindAplicateInJob from "~/src/hooks/get/job/findAplicateJob";
import useCollaborator from "~/src/function/fetchCollaborator";
import HeaderStyle4 from "~/src/components/Headers/HeaderStyle4";
const { width, height } = Dimensions.get("window");
export default function Vacancy() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [jobConected, setJobConected] = useState([]); // Substitua por seus dados reais
  const [isLoading, setIsLoading] = useState(false);
  const [admission, setAdmission] = useState(false);
  const [processAdmission, setProcessAdmission] = useState(false);
  const { collaborator } = useCollaborator();

  

  const fetchJobs = async () => {
    setIsLoading(true);
    if (collaborator) {
      try {
        const response = await FindAplicateInJob(collaborator.CPF);
        // console.log(response);
        if (response.status !== 200) {
          console.log("Erro ao buscar os cards:", response.message);
          setJobConected([]);
          return;
        }

        const jobs = Array.isArray(response.jobs) ? response.jobs : [];
        setJobConected(jobs);

        if (response.processAdmission) {
          setAdmission(true);
          // setTitleWork("Processo admissional");
          setProcessAdmission(true);
        } else {
          setAdmission(false);
          // setTitleWork("Vagas aplicadas");
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

  const filteredJobs = jobConected?.filter((job: any) =>
    job.function.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <HeaderStyle4 title="Vagas" scrollY={scrollY} />
      <View className="flex justify-between items-center h-full bg-white">
        {jobConected && jobConected.length < 0 ? (
          <Animated.ScrollView
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            {/* Search */}
            {jobConected && jobConected.length > 0 && (
              <View className="px-4 mb-5" style={{ paddingTop: 90 }}>
                <TextInput
                  placeholder="Buscar Vaga..."
                  placeholderTextColor="#9CA3AF"
                  className="p-3 border border-gray-300 rounded-lg text-gray-900"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            )}
            {jobConected?.length > 0 ? (
              jobConected.map((job: any) => (
                <JobApplicationCard
                  key={job.id}
                  job={job}
                  company={job.company}
                />
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
          </Animated.ScrollView>
        ) : (
          <Animated.ScrollView
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            style={{ width: "100%", paddingTop: 70}}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: 90}}
            showsVerticalScrollIndicator={false}
          >
              <Text
                style={{
                  ...FONTS.fontSemiBold,
                  fontSize: 16,
                  color: COLORS.title,
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
                onPress={() => navigation.navigate("Home")}
                text={COLORS.title}
                color={COLORS.primary}
                style={{ borderRadius: 52, width: width * 0.7 }}
              />
    
          </Animated.ScrollView>
        )}
      </View>
    </>
  );
}
