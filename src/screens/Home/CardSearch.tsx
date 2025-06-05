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
      Alert.alert("Erro", "Por favor, digite ou selecione uma vaga para pesquisar.");
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
      <View className="px-5 pt-5">
            {/* Toggle */}
            <View className="flex-row bg-gray-200 rounded-full self-start p-1">
              <TouchableOpacity
                onPress={() => setActiveTab("pessoa")}
                className={`px-5 py-2 rounded-full ${
                  activeTab === "pessoa" ? "bg-indigo-600" : ""
                }`}
              >
                <Text
                  className={`font-semibold ${
                    activeTab === "pessoa" ? "text-white" : "text-gray-700"
                  }`}
                >
                  Pessoa
                </Text>
              </TouchableOpacity>
      
              <TouchableOpacity
                onPress={() => setActiveTab("empresa")}
                className={`px-5 py-2 rounded-full ${
                  activeTab === "empresa" ? "bg-indigo-600" : ""
                }`}
              >
                <Text
                  className={`font-semibold ${
                    activeTab === "empresa" ? "text-white" : "text-gray-700"
                  }`}
                >
                  Empresa
                </Text>
              </TouchableOpacity>
            </View>
          </View>
      <View style={{ width: "100%", paddingHorizontal: wp(4), paddingVertical: hp(1.5), zIndex: 50 }}>
        <View
          style={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: wp(3),
            flexDirection: "row",
            alignItems: "center",
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Icon name="search" size={wp(5.5)} color="#9CA3AF" style={{ marginLeft: wp(3), marginRight: wp(2) }} />

          <TextInput
            placeholder="Pesquisar vagas"
            placeholderTextColor="#9CA3AF"
            style={{
              flex: 1,
              paddingVertical: hp(1.2),
              fontSize: wp(4),
              color: "#000",
            }}
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={() => searchJob()}
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={{ marginRight: wp(3) }}>
              <Icon name="close" size={wp(5.5)} color="#9CA3AF" />
            </TouchableOpacity>
          )}
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
                  <Text style={{ fontSize: wp(4), color: "#374151" }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default CardSearch;
