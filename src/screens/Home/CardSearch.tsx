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

interface CardSearchProps {
  setCards: (cards: any[]) => void;
}

const CardSearch: React.FC<CardSearchProps> = ({ setCards }) => {
  const [searchText, setSearchText] = useState(""); // Estado para controlar o texto do input
  const [suggestions, setSuggestions] = useState<string[]>([]); // Estado para controlar as sugestões

  // Mock de dados de vagas (substitua por dados reais da API)
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

  // Atualiza as sugestões com base no texto digitado
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

  // Limpa o texto e as sugestões
  const clearSearch = () => {
    setSearchText("");
    setSuggestions([]);
    Keyboard.dismiss(); // Fecha o teclado
  };

  // Função para pesquisar a vaga
  const searchJob = async (text?: string) => {
    const query = text || searchText; // Usa o texto passado ou o estado atual
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
    // Aqui você pode implementar a lógica de pesquisa, como chamar uma API ou navegar para outra tela
    // Alert.alert("Pesquisar", `Você pesquisou por: ${query}`);
    setSuggestions([]); // Limpa as sugestões
    Keyboard.dismiss(); // Fecha o teclado
  };

  return (
    <View className="absolute w-full py-3 px-4 z-50">
      {/* Campo de pesquisa */}
      <View
        className="w-full bg-white rounded-xl flex-row items-center shadow-md"
        style={{
          elevation: 8, // Sombra para Android
          shadowColor: "#000", // Sombra para iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        {/* Ícone de Lupa */}
        <Icon
          name="search"
          size={24}
          color="#9CA3AF"
          style={{ marginLeft: 12, marginRight: 8 }}
        />

        {/* TextInput */}
        <TextInput
          placeholder="Pesquisar vagas"
          placeholderTextColor="#9CA3AF"
          className="flex-1 py-3 text-base text-black"
          style={{
            fontFamily: "System",
          }}
          value={searchText}
          onChangeText={handleSearch} // Atualiza o texto e as sugestões
          onSubmitEditing={() => searchJob()} // Chama a pesquisa ao pressionar "Enter"
        />

        {/* Ícone de "X" (limpar) */}
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={{ marginRight: 12 }}>
            <Icon name="close" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de sugestões */}
      {suggestions.length > 0 && (
        <View
          className="bg-white rounded-lg mt-2 shadow-md"
          style={{
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <FlatList
            data={suggestions.slice(0, 5)} // Limita a 5 sugestões
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSearchText(item); // Preenche o campo com a vaga selecionada
                  searchJob(item); // Chama a pesquisa com o texto selecionado
                }}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#E5E7EB",
                }}
              >
                <Text style={{ fontSize: 16, color: "#374151" }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default CardSearch;