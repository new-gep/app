import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Card from "./Card";
import GetAllJob from "../../hooks/get/job/all";

const Home = () => {
  const [cards, setCards] = useState([]);

  const handleSwipe = () => {
    setCards((prevCards) => prevCards.slice(1)); // Remove o primeiro card da lista
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllJob();
      if (response.status !== 200) {
        console.error("Erro ao buscar os cards:", response.message);
        return;
      }
      setCards(response.job);
    };
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {Array.isArray(cards) && cards.length > 0 ? (
        <View style={{ flex: 1, width: "100%" }}>
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
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 18 }}>
          Sem mais cards!
        </Text>
      )}
    </View>
  );
};

export default Home;
