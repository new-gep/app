import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeartIcon } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'user_favorites';

const JobApplicationCard = ({ job, company }) => {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);

  // Carrega o estado de favorito ao montar o componente
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        const favoriteList = favorites ? JSON.parse(favorites) : [];
        setIsFavorite(favoriteList.includes(job.id));
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    };

    loadFavoriteStatus();
  }, [job.id]);

  // Atualiza o AsyncStorage quando o favorito é alterado
  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      let favoriteList = favorites ? JSON.parse(favorites) : [];
      
      if (isFavorite) {
        favoriteList = favoriteList.filter(id => id !== job.id);
      } else {
        favoriteList = [...favoriteList, job.id];
      }
      
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteList));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
    }
  };

  const calculateDaysAgo = (createDate) => {
    const created = new Date(createDate);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <TouchableOpacity
      onPress={() => {
        console.log('=== DEBUG NAVIGATION ===');
        console.log('Job data being passed:', {
          ...job,
          candidates: job.candidates
        });
        
        navigation.navigate('CardInformation', { 
          cardData: {
            ...job,
            candidates: job.candidates
          }
        });
      }}
      style={[styles.card, 'shadow-md']}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-900">{job.function}</Text>
          <TouchableOpacity onPress={toggleFavorite}>
            <HeartIcon 
              size={24} 
              className={isFavorite ? 'text-primary' : 'text-gray-400'} 
              fill={isFavorite ? 'currentColor' : 'none'} 
            />
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-gray-500 mt-1">
          {job.company ? `${job.company.city || ''}, ${job.company.uf || ''}` : 'Localização não informada'}
        </Text>
        <Text className="text-base text-gray-900 mt-1">
          {job.salary ? `R$ ${job.salary} por mês` : 'R$ 8.000 por mês'}
        </Text>
        <Text className="text-sm text-gray-400 mt-1">
          {`Publicado há ${calculateDaysAgo(job.create_at)} dias`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default JobApplicationCard;