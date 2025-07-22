import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Keyboard,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import SearchJob from "~/src/hooks/get/job/search";
import { useScreen } from "~/src/hooks/utils/useScreen";
import IconNative from "~/src/components/Icon/Icon";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Bell, BellDot, Settings2 } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FindBucketCollaborator from "~/src/hooks/bucket/collaborator";
import SaveCacheFile from "~/src/hooks/utils/SaveCacheFile";
import { IMAGES } from "~/src/constants/Images";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import useCollaborator from "~/src/function/fetchCollaborator";
interface CardSearchProps {
  setCards: any;
  setActiveTab: any;
  activeTab:any
}

const CardSearch: React.FC<CardSearchProps> = ({activeTab ,setActiveTab ,setCards }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { collaborator, fetchCollaborator } = useCollaborator();
  const [searchText, setSearchText] = useState("");
  const [path, setPath] = useState<any>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { wp, hp } = useScreen(); // 📱 dimensões da tela

  const getPicture = async () => {
    const storedImagePath = await AsyncStorage.getItem("collaboratorImage");
    if (storedImagePath) {
      setPath(`${storedImagePath}`);
      return;
    }
    try {
      const response = await FindBucketCollaborator(
        //@ts-ignore
        collaborator.CPF,
        "Picture"
      );

      if (response.status === 200 && response.path) {
        SaveCacheFile(response.path, "collaboratorImage", setPath);
      } else {
        console.warn("Resposta inválida da API ou sem base64.");
      }
    } catch (error) {
      // console.log("Erro ao buscar imagem:", error);
      console.error("Erro ao resgatar a imagem:", error);
    }
  };

  const jobs = [
    "Desenvolvedor Frontend",
    "Desenvolvedor Backend",
    "Designer UI/UX",
    "Gerente de Projetos",
    "Analista de Dados",
    "Engenheiro de Software",
    "Especialista em DevOps",
    "Product Manager",
  ];

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      const filteredJobs = jobs.filter((job) =>
        job.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filteredJobs);
    } else {
      setSuggestions([]);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSuggestions([]);
    Keyboard.dismiss();
  };

  const searchJob = async (text?: string) => {
    const query = text || searchText;
    if (query.trim().length === 0) {
      Alert.alert(
        "Erro",
        "Por favor, digite ou selecione uma vaga para pesquisar."
      );
      return;
    }

    const response = await SearchJob(query);
    if (response.status !== 200) {
      Alert.alert("Erro", "Falha ao buscar a vaga.");
      return;
    }
     setCards();
    const uniqueJobs = response.job.filter(
      (job: any, index: any, self: any) =>
        self.findIndex((j: any) => j.id === job.id) === index
    );

    setCards(uniqueJobs);
    setSuggestions([]);
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (collaborator) {
      getPicture();
    }
  }, [collaborator]);

  return (
    <View>
      <View className="px-4  flex-row justify-between items-end ">
        {/* Toggle */}
        <View
          style={Style.container}
          
          className="flex-row bg-white rounded-full mb-2 p-1"
        >
          <TouchableOpacity
            style={activeTab === "People" ? Style.container : undefined}
            onPress={() => setActiveTab("People")}
            className={`px-5 py-2 items-center justify-center rounded-full ${
              activeTab === "People" ? "bg-primary" : ""
            }`}
          >
            <Text
              style={{...FONTS.fontSemiBold,fontSize:rf(13)}}
              className={`font-semibold ${
                activeTab === "People" ? "text-dark" : "text-gray-500"
              }`}
            >
              Pessoas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("Service")}
            style={activeTab === "Service" && Style.container}
            className={`px-5 py-2 rounded-full ${
              activeTab === "Service" ? "bg-primary" : ""
            }`}
          >
            <Text
            style={{...FONTS.fontSemiBold, fontSize:rf(13)}}
              className={`font-semibold ${
                activeTab === "Service" ? "text-dark" : "text-gray-500"
              }`}
            >
              Serviços
            </Text>
          </TouchableOpacity>
        </View>
        <View className="rounded-full p-2">
          <View
            style={{ height: rf(45), width: rf(45) }}
            className={`rounded-full border-gray-200 bg-gray-200 ${
              !path && "p-2"
            }`}
          >
            <Image
              className={`w-full h-full ${path ? "rounded-full" : ""}`}
              source={path ? { uri: path } : IMAGES.user2}
              tintColor={path ? undefined : "gray"}
              onError={(e) =>
                console.warn("Erro ao renderizar:", e.nativeEvent.error)
              }
            />
          </View>
        </View>
      </View>
      {/* // */}
      {/* <View
        style={Style.container}
        className="flex-1 flex-row items-center bg-white rounded-xl shadow-md pr-3 mt-3 mx-4 mb-5"
      >
        <Icon
          name="search"
          size={22}
          color="#9CA3AF"
          style={{ marginLeft: 12, marginRight: 8 }}
        />
        <TextInput
          style={{...FONTS.fontBlack}}
          placeholder="Pesquisar"
          placeholderTextColor="#9CA3AF"
          className="flex-1 h-10 py-1 text-base text-dark"
          value={searchText}
          onChangeText={handleSearch}
          onSubmitEditing={() => searchJob()}
        />
        {searchText.length > 0 ? (
          <TouchableOpacity onPress={clearSearch} className="mr-2">
            <Settings2 size={22} color="#9CA3AF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            // onPress={openFilters}
            className="pl-2 border-l border-gray-200 ml-1"
          >
            <Settings2 size={22} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View> */}
    </View>
  );
};

const Style = {
  container: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};

export default CardSearch;
