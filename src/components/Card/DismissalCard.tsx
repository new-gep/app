import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  onPress: () => void;
  status: string | null;
};

const DismissalCard = ({ onPress, status }: Props) => {
  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return COLORS.success;
      case 'pending':
        return COLORS.primary;
      case 'reproved':
        return 'red';
      default:
        return COLORS.primary;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'pending':
        return 'Em análise';
      case 'reproved':
        return 'Reprovado';
      default:
        return 'Enviar documento';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text style={{ ...FONTS.fontSemiBold, fontSize: 16 }} className="text-gray-900 dark:text-white">
            Carta de Demissão
          </Text>
          <Text 
            style={{ ...FONTS.fontRegular, fontSize: 14, color: getStatusColor() }}
            className="mt-1"
          >
            {getStatusText()}
          </Text>
        </View>
        <Icon 
          name={status ? "check-circle" : "camera"} 
          size={24} 
          color={getStatusColor()} 
        />
      </View>
    </TouchableOpacity>
  );
};

export default DismissalCard; 