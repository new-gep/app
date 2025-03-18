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
  // console.log("cardData", cardData)
  const navigation = useNavigation();

  const renderFooterContent = () => {
    return (
      <View className="flex-row items-center p-4 rounded-t-2xl border-t border-gray-200">
        {cardData.company.logo ? (
          <Image
            source={{ uri: cardData.company.logo }}
            className="w-12 h-12 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
            <Text className="text-dark text-lg font-bold">
              {cardData.company.company_name?.charAt(0) || "?"}
            </Text>
          </View>
        )}
        <Text className="text-dark text-lg font-semibold ml-3">
          {cardData.company.company_name || "Empresa confidencial"}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header com botão de voltar */}
      <Header title="Detalhes da Vaga" leftIcon="back" iconSimple="archive" />

      <ScrollView className="flex-1 p-4">
        {/* Cabeçalho do Card */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-dark">
            {cardData.function}
          </Text>
          {cardData.PCD === "1" && (
            <FontAwesome name="wheelchair-alt" size={24} color="black" />
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
              company={cardData.company}
              details={cardData.details}
            />
        </View>
      </ScrollView>

      {/* Footer */}
      {renderFooterContent()}
    </View>
  );
};

export default CardInformation;
