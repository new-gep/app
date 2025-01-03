import React, { useState } from "react";
import { View, Text } from "react-native";
import Card from "./Card";

const Home = () => {
  const [cards, setCards] = useState([
    { id: 1, title: "Card 1", companyName: "New Gep", image: 'infinity', position: "Desenvolvedor Senior", time: { time: "50", journey: "6x1" }, contract: "PJ" },
    { id: 2, title: "Card 2", companyName: "Pimpolho", image: 'diamond', position: "RH", time: { time: "40", journey: "5x2" }, contract: "PJ" },
    { id: 3, title: "Card 3", companyName: "New Drip", image: 'disc', position: "Desenvolvedor", time: { time: "50", journey: "6x1" }, contract: "PJ" },
  ]);

  const handleSwipe = () => {
    setCards((prevCards) => prevCards.slice(1)); // Remove o primeiro card da lista
  };

  return (
    <View style={{ flex: 1 }}>
      {cards.length > 0 ? (
        <>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              data={card}
              onSwipe={handleSwipe} // Remove o card ao ser swipado
              isTopCard={index === 0} // Apenas o card do topo é arrastável
            />
          ))}
        </>
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 18 }}>
          Sem mais cards!
        </Text>
      )}
    </View>
  );
};

export default Home;
