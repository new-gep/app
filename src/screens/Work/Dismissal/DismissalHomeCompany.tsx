import React from "react";
import { View, Text } from "react-native";
import { FONTS } from "../../../constants/theme";

const DismissalHomeCompany = () => {
  return (
    <View className={'flex-1 justify-center items-center bg-white'}>
      <Text className={'text-2xl font-semibold mb-5'}>
        Processo de Desligamento
      </Text>
      <Text className={'text-base text-center px-5'}>
        A empresa está iniciando um processo de desligamento do colaborador.
        Por favor, aguarde as próximas instruções.
      </Text>
    </View>
  );
};

export default DismissalHomeCompany;
