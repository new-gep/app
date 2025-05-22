import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { FONTS } from '~/src/constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LocationFilter = () => {
  const [distance, setDistance] = useState(2);
  const [showFarPeople, setShowFarPeople] = useState(false);

  return (
    <>
    <View className='mb-4'>
        <View className="bg-[#252525] rounded-lg p-4 ">
        <Text className="text-white mb-2" style={{ ...FONTS.fontMedium, fontSize: 16 }}>
            Localização
        </Text>
        <View className="flex-row items-center mb-2">
            <Ionicons name="location" size={16} color="#FFF" />
            <Text className="text-white ml-2" style={{ ...FONTS.fontRegular, fontSize: 14 }}>
            São Paulo, Brasil
            </Text>
        </View>
        <TouchableOpacity className="mb-2">
            <Text className="text-[#FF375F] text-sm">Adicionar novo local</Text>
        </TouchableOpacity>
        </View>
        <Text>Mude a localização aq</Text>
    </View>
    <View className="bg-[#252525] rounded-lg p-4 mb-4">
      <Text className="text-white mb-2" style={{ ...FONTS.fontRegular, fontSize: 14 }}>
        Distância máxima
      </Text>
      <Slider
        minimumValue={1}
        maximumValue={100}
        step={1}
        value={distance}
        onValueChange={setDistance}
        minimumTrackTintColor="#FF375F"
        maximumTrackTintColor="#666"
        thumbTintColor="#FF375F"
        className="mb-4"
      />
      <Text className="text-white mb-2" style={{ ...FONTS.fontRegular, fontSize: 14 }}>
        {distance} km
      </Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-white w-5/6" style={{ ...FONTS.fontRegular, fontSize: 14 }}>
          Mostrar pessoas mais longe de mim se eu ficar sem perfis pra ver
        </Text>
        <Switch
          value={showFarPeople}
          onValueChange={setShowFarPeople}
          trackColor={{ true: '#FF375F', false: '#666' }}
          thumbColor="#FFF"
        />
    </View>
    </View>
    </>
  );
};

export default LocationFilter;