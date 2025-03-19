import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { AbstractPicture } from "../../constants/abstract";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Header from "../../layout/Header";
import AccordionCardIformation from "../../components/Accordion/AccordionCardIformation";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS } from "../../constants/theme";

type CompanyType = {
  company_name: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  district: string;
  city: string;
  uf: string;
  zip_code?: string;
  logo?: string;
}

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
        company?: {
          company_name?: string;
          phone?: string;
          email?: string;
          street?: string;
          number?: string;
          district?: string;
          city?: string;
          uf?: string;
          zip_code?: string;
          logo?: string;
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
      <Header title="Detalhes da Vaga" leftIcon="back" iconSimple="archive" />

      <ScrollView className="flex-1 p-4">
        {/* Cabeçalho do Card */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-dark">
            {cardData.function}
          </Text>
          <Text className="text-sm text-gray-600 mt-1 uppercase">
            {cardData.company?.company_name || "Empresa confidencial"}
          </Text>
          {cardData.PCD === "1" && (
            <View className="mt-2">
              <FontAwesome name="wheelchair-alt" size={24} color="black" />
            </View>
          )}
        </View>

        <View
          style={[
            GlobalStyleSheet.cardHeader,
            { borderBottomColor: COLORS.inputborder },
          ]}
        >
          <Image
            source={AbstractPicture[cardData.image]}
            resizeMode="contain"
            className="w-full h-[200px] mb-6"
          />
        </View>

        <View style={[GlobalStyleSheet.card, { backgroundColor: COLORS.card }]} className="mt-8">           
          <AccordionCardIformation
            information={cardData}
            company={cardData.company as CompanyType}
            details={cardData.details}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CardInformation;
