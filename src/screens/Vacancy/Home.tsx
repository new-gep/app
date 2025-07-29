import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  Animated,
} from "react-native";
import { FONTS, COLORS } from "../../constants/theme";
import Header from "../../layout/Header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FindAplicateInJob from "~/src/hooks/get/job/findAplicateJob";
import useCollaborator from "~/src/function/fetchCollaborator";
import HeaderStyle4 from "~/src/components/Headers/HeaderStyle4";
const { width, height } = Dimensions.get("window");
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FlatList } from "react-native-gesture-handler";
import Service from "./Card/Service";
import Work from "./Card/Work";
import FindCandidacy from "~/src/hooks/get/job/findCandidacy";
import AwaitFetch from "~/src/components/LoadScreen/Load";
import CardPeople from "../Home/Helper/CardPeopleService";

export default function Vacancy() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  type JobItem = {
    job?: {
      function?: string;
    };
    announcement?: {
      announcement?: {
        title?: string;
      };
    };
    service?: string;
    [key: string]: any;
  };

  const [jobConected, setJobConected] = useState<JobItem[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState<number>(1);
  const { collaborator } = useCollaborator();

  const fetchJobs = async () => {
    setIsLoading(true);
    if (collaborator) {
      try {
        const response = await FindCandidacy(collaborator.CPF);
        if (response.status === 200) {
          setJobConected(response.data);
          setFavorites(response.favorite)
        } else {
          console.log("Erro ao buscar os cards:", response.message);
          setJobConected([]);
        }
      } catch (error) {
        console.log("Erro ao buscar os cards:", error);
        setJobConected([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredJobs = jobConected.filter((item) => {
    const title = item?.job?.function || item?.announcement?.announcement?.title || ""; 
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
    }, [collaborator, reload])
  );

  const renderItem = useCallback(({ item }: any) => {
    return item.service === "fix" ? (
      <Work
        item={{ ...item, isCandidate: true }}
        refresh={reload}
        setRefresh={setReload}
      />
    ) : (
      <Service item={item} refresh={reload} setRefresh={setReload} />
    );
  }, []);

  return (
    <>
      <HeaderStyle4 title="Serviços" scrollY={scrollY} />
      <View className="flex justify-between items-center h-full bg-white">
        { isLoading?
        <View style={{ width: "100%", paddingTop: 70 }}>
          <AwaitFetch/>
        </View>
        :
          <>
            {jobConected && jobConected.length > 0 ? (
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
                {filteredJobs.length > 0  ? (
                  <>
                    <FlatList
                      // data={jobConected}
                      data={filteredJobs}
                      renderItem={renderItem}
                      contentContainerStyle={{}}
                      initialNumToRender={5}
                      maxToRenderPerBatch={5}
                      windowSize={10}
                      removeClippedSubviews={true}
                    />

                    { favorites.length > 0  &&
                      <CardPeople data={favorites} setData={setFavorites} setReload={setReload} reload={reload}/>
                    }
                  </>
                  
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
                style={{ width: "100%", paddingTop: 70 }}
                contentContainerStyle={{ alignItems: "center", paddingBottom: 90 }}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={{
                    ...FONTS.fontSemiBold,
                    fontSize: rf(16),
                    color: COLORS.title,
                    marginBottom: 5,
                    marginTop: 40,
                  }}
                >
                  Sem serviços cadastrados
                </Text>

                <Text
                  style={{ fontSize: rf(10), ...FONTS.fontLight }}
                  className=" text-gray-400 "
                >
                  Não se cadastrou em nenhuma serviço até o momento
                </Text>

                <Image
                  source={require("../../assets/images/brand/Business-nojob.png")}
                  style={{ width: width * 0.7, height: height * 0.5 }}
                  resizeMode="contain"
                />
              </Animated.ScrollView>
            )}
          </>
        }
      </View>
    </>
  );
}
