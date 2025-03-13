import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { AbstractPicture } from "../../constants/abstract";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type CardInformationProps = {
  route: {
    params: {
      cardData: {
        id: string;
        function: string;
        PCD: string;
        image: string;
        salary: string;
        contract_type: string;
        description: string;
        time: {
          journey: string;
        };
        company: {
          company_name: string;
          phone: string;
          email: string;
          street: string;
          number: string;
          district: string;
          city: string;
          uf: string;
          zip_code: string;
        };
        workload: string;
        benefics: string;
        obligations: string;
        details: string;
      };
    };
  };
};

const CardInformation = ({ route }: CardInformationProps) => {
  const { cardData } = route.params;
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white">
      {/* Header com botão de voltar */}
      <View className="bg-blue-600 p-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Detalhes da Vaga</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Cabeçalho do Card */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-blue-600">{cardData.function}</Text>
          {cardData.PCD === "1" && (
            <FontAwesome name="wheelchair-alt" size={24} color="black" />
          )}
        </View>

        <Image
          source={AbstractPicture[cardData.image]}
          resizeMode="contain"
          className="w-full h-[200px] mb-6"
        />

        {/* Seção: Informações da Vaga */}
        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          <Text className="text-lg font-bold mb-4 text-blue-600">Informações da Vaga</Text>
          
          <View className="space-y-2">
            <Text className="text-base">
              <Text className="font-semibold">Salário:</Text> R$ {cardData.salary || "Não informado"}
            </Text>
            <Text className="text-base">
              <Text className="font-semibold">Tipo de Contratação:</Text> {cardData.contract_type || "Não informado"}
            </Text>
            <Text className="text-base">
              <Text className="font-semibold">Jornada:</Text> {cardData.time?.journey || "Não informado"}
            </Text>
            <Text className="text-base">
              <Text className="font-semibold">Carga Horária:</Text> {cardData.workload || "Não informado"}
            </Text>
          </View>
        </View>

        {/* Seção: Informações da Empresa */}
        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          <Text className="text-lg font-bold mb-4 text-blue-600">Informações da Empresa</Text>
          
          <View className="space-y-2">
            <Text className="text-base">
              <Text className="font-semibold">Empresa:</Text> {cardData.company?.company_name || "Não informado"}
            </Text>
            <Text className="text-base">
              <Text className="font-semibold">Telefone:</Text> {cardData.company?.phone || "Não informado"}
            </Text>
            <Text className="text-base">
              <Text className="font-semibold">Email:</Text> {cardData.company?.email || "Não informado"}
            </Text>
            <Text className="text-base">
              <Text className="font-semibold">Localização:</Text> {`${cardData.company?.street || ""}, ${cardData.company?.number || ""} - ${cardData.company?.district || ""}, ${cardData.company?.city || ""} - ${cardData.company?.uf || ""}`}
            </Text>
          </View>
        </View>

        {/* Seção: Detalhes Adicionais */}
        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          <Text className="text-lg font-bold mb-4 text-blue-600">Detalhes Adicionais</Text>
          
          <View className="space-y-4">
            <View>
              <Text className="font-semibold text-base mb-1">Descrição:</Text>
              <Text className="text-base">{cardData.description || "Não informado"}</Text>
            </View>
            
            <View>
              <Text className="font-semibold text-base mb-1">Benefícios:</Text>
              <Text className="text-base">{cardData.benefics || "Não informado"}</Text>
            </View>
            
            <View>
              <Text className="font-semibold text-base mb-1">Obrigações:</Text>
              <Text className="text-base">{cardData.obligations || "Não informado"}</Text>
            </View>
            
            <View>
              <Text className="font-semibold text-base mb-1">Informações Adicionais:</Text>
              <Text className="text-base">{cardData.details || "Não informado"}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CardInformation;
