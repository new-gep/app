import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  Keyboard,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import SearchJob from "~/src/hooks/get/job/search";
import { useScreen } from "~/src/hooks/utils/useScreen";
import IconNative from "~/src/components/Icon/Icon";
interface CardSearchProps {
  setCards: any;
}

const CardSearch: React.FC<CardSearchProps> = ({ setCards }) => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("pessoa");
  const { wp, hp } = useScreen(); // 📱 dimensões da tela

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

    const uniqueJobs = response.job.filter(
      (job: any, index: any, self: any) =>
        self.findIndex((j: any) => j.id === job.id) === index
    );

    setCards(uniqueJobs);
    setSuggestions([]);
    Keyboard.dismiss();
  };

  return (
    <View>
      <View className="px-4 pt-5 flex-row justify-between items-center">
        {/* Toggle */}
        <View style={Style.container} className="flex-row bg-white rounded-full self-start p-1">
          <TouchableOpacity
            style={activeTab === "pessoa" && Style.container}
            onPress={() => setActiveTab("pessoa")}
            className={`px-5 py-2 rounded-full ${
              activeTab === "pessoa" ? "bg-primary" : ""
            }`}
          >
            <Text
              className={`font-semibold ${
                activeTab === "pessoa" ? "text-black" : "text-gray-500"
              }`}
            >
              Pessoa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("empresa")}
            style={activeTab === "empresa" && Style.container}
            className={`px-5 py-2 rounded-full ${
              activeTab === "empresa" ? "bg-primary" : ""
            }`}
          >
            <Text
              className={`font-semibold ${
                activeTab === "empresa" ? "text-black" : "text-gray-500"
              }`}
            >
              Empresa
            </Text>
          </TouchableOpacity>
        </View>
        <View className="bg-white rounded-full p-2">
          <View className="h-7 w-7">
            <IconNative name={"notification_outline"}/>
          </View>
        </View>
      </View>
      {/* // */}
      <View
        style={{
          width: "100%",
          paddingVertical: hp(1.5),
          zIndex: 50,
        }}
      >
        <View className="w-full px-4 py-2 z-50">
          <View className="w-full flex-row items-center space-x-2">
            {/* Campo de busca */}
            <View style={Style.container} className="flex-1 flex-row  items-center bg-white rounded-xl shadow-md">
              <Icon
                name="search"
                size={22}
                color="#9CA3AF"
                style={{ marginLeft: 12, marginRight: 8 }}
              />
              <TextInput
                placeholder="Pesquisar"
                placeholderTextColor="#9CA3AF"
                className="flex-1 h-10 py-1 text-base text-black"
                value={searchText}
                onChangeText={handleSearch}
                onSubmitEditing={() => searchJob()}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={clearSearch} className="mr-3">
                  <Icon name="close" size={22} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* Botão de filtro */}
            <TouchableOpacity
              style={Style.container}
              // onPress={openFilters}
              className=" p-2 rounded-xl bg-white shadow-md justify-center items-center"
            >
              <View className="h-7 w-7">
                <IconNative name="pageInfo_outline"/>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {suggestions.length > 0 && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: wp(2),
              marginTop: hp(1),
              elevation: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <FlatList
              data={suggestions.slice(0, 5)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSearchText(item);
                    searchJob(item);
                  }}
                  style={{
                    padding: wp(3),
                    borderBottomWidth: 1,
                    borderBottomColor: "#E5E7EB",
                  }}
                >
                  <Text style={{ fontSize: wp(4), color: "#374151" }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
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
