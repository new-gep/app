import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Card from "./Card";
import GetAllJob from "../../hooks/get/job/all";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Home = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previousCards, setPreviousCards] = useState([]); // Armazena cards swipados

  const handleSwipe = () => {
    setPreviousCards((prev) => [...prev, cards[0]]); // Salva o card antes de remover
    setCards((prevCards) => prevCards.slice(1)); // Remove o primeiro card da lista
  };

  const handleLike = () => {
    setPreviousCards((prev) => [...prev, cards[0]]);
    setCards((prevCards) => prevCards.slice(1)); // Simula o swipe para a direita
  };

  const handleDislike = () => {
    setPreviousCards((prev) => [...prev, cards[0]]);
    setCards((prevCards) => prevCards.slice(1)); // Simula o swipe para a esquerda
  };

  const handleSuperLike = () => {
    setPreviousCards((prev) => [...prev, cards[0]]);
    setCards((prevCards) => prevCards.slice(1)); // Simula o "super like"
  };

  const handleUndo = () => {
    if (previousCards.length > 0) {
      const lastCard = previousCards.pop(); // Recupera o último card
      if (lastCard) {
        setPreviousCards([...previousCards]); // Atualiza o array de histórico
        setCards((prevCards) => [lastCard, ...prevCards]); // Reinsere o card na frente da lista
      }
    } else {
      alert("Não há mais cards para voltar."); // Evita o crash e informa ao usuário
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await GetAllJob();
      if (response.status !== 200) {
        console.error("Erro ao buscar os cards:", response.message);
        setIsLoading(false);
        return;
      }
      setCards(response.job);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="py-4 bg-white shadow-md">
        <Text className="text-center text-2xl text-black font-bold">Vagas</Text>
      </View>

      {/* Conteúdo principal */}
      <View className="flex-1 justify-center bg-white">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text className="mt-4 text-lg text-green-500 font-semibold">
              Carregando vagas...
            </Text>
          </View>
        ) : Array.isArray(cards) && cards.length > 0 ? (
          <View className="flex-1 w-full">
            {cards.map((card, index) => (
              <View
                key={card.id}
                className="absolute w-full h-full items-center"
                style={{
                  top: 0,
                  justifyContent: "center",
                  zIndex: cards.length - index,
                }}
              >
                <Card
                  data={card}
                  onSwipe={handleSwipe}
                  isTopCard={index === 0}
                  zIndex={cards.length - index}
                />
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-center text-xl text-black font-semibold">
              Sem mais cards!
            </Text>
          </View>
        )}
      </View>

      {/* Botões Abaixo do Card (Sempre Fixos) */}
      <View className="absolute bottom-8 z-50 flex-row justify-between items-center w-full px-6">
        <TouchableOpacity onPress={handleUndo} className="p-4 rounded-full">
          <MaterialIcons name="replay" size={32} color="#FFC107" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDislike} className="p-4 rounded-full">
          <FontAwesome name="times" size={32} color="#FF5252" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSuperLike} className="p-4 rounded-full">
          <MaterialIcons name="star" size={32} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLike} className="p-4 rounded-full">
          <FontAwesome name="heart" size={32} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

