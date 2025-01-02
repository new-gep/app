import React, { useState } from 'react';
import { View } from 'react-native';
import Card from './Card';

const Home = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'Card 1' },
    { id: 2, title: 'Card 2' },
    { id: 3, title: 'Card 3' },
  ]);

  const handleSwipe = () => {
    setCards((prev) => prev.slice(1)); // Remove o primeiro cartão da pilha
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          data={card}
          onSwipe={handleSwipe}
         // className={`z-${cards.length - index}`} // Substituir zIndex pelo uso de Tailwind classes dinâmicas
        />
      ))}
    </View>
  );
  
};

export default Home;
