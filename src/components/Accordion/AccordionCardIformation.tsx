import React from "react";
import { Text, View } from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { FONTS } from "../../constants/theme";
import { useTheme } from "@react-navigation/native";
import Mask from "~/src/function/mask";

interface AccordionCardIformationProps {
  information: {
    salary: string;
    contract_type: string;
    time: {
      journey: string;
    };
    workload: string;
    description: string;
    benefics: string;
    obligations: string;
    details: string;
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
  };
  details: string;
}

const AccordionCardIformation = (props: AccordionCardIformationProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <View className="space-y-3">
      {/* Informações */}
      {/* <View>
                <View className="flex-row items-center space-x-2 mb-3">
                    <MaterialIcons name="info-outline" size={24} color={colors.text} />
                    <Text className="text-lg font-bold">
                        Informações
                    </Text>
                </View>
                <View className="space-y-2">
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Salário:</Text>{Mask('amount',props.information.salary) || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Tipo de Contratação:</Text> {props.information.contract || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Localidade:</Text> {props.information.locality || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Modelo:</Text> {props.information.model || "Não informado"}
                    </Text>
                </View>
            </View> */}

      {/* Responsabilidade */}
      <View>
        <View className="flex-row items-center space-x-2 mb-3">
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            size={24}
            color={colors.text}
          />
          <Text className="text-lg font-bold">Responsabilidade</Text>
        </View>
        <View className="space-y-2">
          <Text style={[FONTS.fontXs, { color: colors.text }]}>
            {props.information.responsibility || "Não informado"}
          </Text>
        </View>
      </View>

      {/* Requisitos */}
      <View>
        <View className="flex-row items-center space-x-2 mb-3">
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            size={24}
            color={colors.text}
          />
          <Text className="text-lg font-bold">Requisitos</Text>
        </View>
        <View className="space-y-2">
          <Text style={[FONTS.fontXs, { color: colors.text }]}>
            {props.information.requirements || "Não informado"}
          </Text>
        </View>
      </View>

      {/* Competência */}
      <View>
        <View className="flex-row items-center space-x-2 mb-3">
          <FontAwesome name="list-alt" size={24} color={colors.text} />
          <Text className="text-lg font-bold">Competência</Text>
        </View>
        <View className="w-full items-center">
          <View className="flex-row flex-wrap gap-1">
            {props.information.skills &&
              JSON.parse(props.information.skills).map((skill: any) => (
                <View key={skill} className="bg-green-900 px-2 py-1 rounded-lg">
                  <Text
                    className="text-center"
                    style={{ ...FONTS.font, color: "white" }}
                  >
                    {skill}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </View>

      {/* Benefícios */}
      <View>
        <View className="flex-row space-x-2 mb-3">
          <MaterialIcons name="card-giftcard" size={24} color={colors.text} />
          <Text className="text-lg font-bold">Benefícios</Text>
        </View>
        <View className="w-full">
          <View className="flex-row flex-wrap  gap-1">
            {props.information.benefits &&
              JSON.parse(props.information.benefits).map((skill: any) => (
                <View key={skill} className="bg-blue-900 px-2 py-1 rounded-lg">
                  <Text
                    className="text-center"
                    style={{ ...FONTS.font, color: "white" }}
                  >
                    {skill}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </View>

      {/* Empresa */}
      {/* <View>
                <Text className="w-40 text-lg font-bold text-primary mb-3 bg-dark rounded-xl p-4">
                    Empresa
                </Text>
                <View className="space-y-2  items-start justify-start">
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Empresa:</Text> {props.company.company_name || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Telefone:</Text> {props.company.phone || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Email:</Text> {props.company.email || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Localização:</Text> {`${props.company.street || ""}, ${props.company.number || ""} - ${props.company.district || ""}, ${props.company.city || ""} - ${props.company.uf || ""}`}
                    </Text>
                </View>
            </View> */}
    </View>
  );
};

export default AccordionCardIformation;
