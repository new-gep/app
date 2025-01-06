import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Card from "./Card";
import GetAllJob from "../../hooks/get/job/all";

const Home = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de loading

  const handleSwipe = () => {
    setCards((prevCards) => prevCards.slice(1)); // Remove o primeiro card da lista
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Ativa o loading enquanto os dados estão sendo buscados
      const response = await GetAllJob();
      if (response.status !== 200) {
        console.error("Erro ao buscar os cards:", response.message);
        setIsLoading(false); // Desativa o loading se houver erro
        return;
      }
      setCards(response.job);
      setIsLoading(false); // Desativa o loading após carregar os dados
    };
    fetchData();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-gray-900">
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
            <Card
              key={card.id}
              data={card}
              onSwipe={handleSwipe} // Remove o card ao ser swipado
              isTopCard={index === 0} // Apenas o primeiro card é arrastável
              zIndex={cards.length - index} // Maior zIndex para o topo
            />
          ))}
        </View>
      ) : (
        <Text className="text-center mt-5 text-xl text-white font-semibold">
          Sem mais cards!
        </Text>
      )}
    </View>
  );
};

export default Home;
