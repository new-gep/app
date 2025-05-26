import React, { useState } from 'react';
import { View, Text } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider'; // Install via npm install @ptomasroos/react-native-multi-slider
import { FONTS } from '~/src/constants/theme';

const AgeRangeFilter = () => {
  const [ageRange, setAgeRange] = useState([18, 70]);

  return (
    <View className="bg-[#252525] rounded-lg p-4 mb-4">
      <Text className="text-white mb-2" style={{ ...FONTS.fontMedium, fontSize: 16 }}>
        Faixa etária
      </Text>
      <MultiSlider
        values={ageRange}
        onValuesChange={(values) => setAgeRange(values)}
        min={18}
        max={70}
        step={1}
        trackStyle={{ backgroundColor: '#666' }}
        selectedStyle={{ backgroundColor: '#FF375F' }}
        markerStyle={{ backgroundColor: '#FF375F' }}
      />
      <Text className="text-white text-center" style={{ ...FONTS.fontRegular, fontSize: 14 }}>
        {ageRange[0]} - {ageRange[1]}
      </Text>
    </View>
  );
};

export default AgeRangeFilter;