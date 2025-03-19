import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import AdmissionalCard from './AdmissionalCard';

const { width } = Dimensions.get('window');

type CarouselProps = {
  cards: Array<{
    title: string;
    status: boolean;
    path: string;
    typeDocument: string;
  }>;
  setLockSignature: (any) => void;
  lockSignature: any;
};

const AdmissionalCarousel = ({ cards, setLockSignature, lockSignature }: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const slideSize = width * 0.9;
    const offset = event.nativeEvent.contentOffset.x;
    const activeIndex = Math.round(offset / slideSize);
    setActiveIndex(activeIndex);
  };

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View className="flex-row items-center w-full justify-center ">
        {cards.map((card, index) => (
          <View key={index} style={{ width: width }}>
            <AdmissionalCard
              title={card.title}
              status={card.status}
              path={card.path}
              typeDocument={card.typeDocument}
              setLockSignature={setLockSignature}
              lockSignature={lockSignature}
            />
          </View>
        ))}
        </View>
      </ScrollView>
      
      <View className="flex-row justify-center items-center mt-4 mb-4">
        {cards.map((_, index) => (
          <TouchableOpacity
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${
              index === activeIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
            onPress={() => {
              scrollViewRef.current?.scrollTo({
                x: index * width,
                animated: true,
              });
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default AdmissionalCarousel; 