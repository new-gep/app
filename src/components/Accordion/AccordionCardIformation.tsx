import React from "react";
import { Text, View } from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
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
    skills?: string; 
    benefits?: string; 
    responsibility?: string; 
    requirements?: string;
    locality?: string; 
    model?: string; 
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
      {/* Responsabilidade */}
      <View>
        <View className="flex-row items-center space-x-2 mb-1 px-1">
          {/* <FontAwesome name="exclamation" size={24} color="black" /> */}
          <Text style={[FONTS.fontBold]}>Responsabilidade</Text>
        </View>
        <View className="space-y-2 p-2 rounded-lg">
          <Text style={[FONTS.font, { color: colors.text }]}>
            {props.information.responsibility || "Não informado"}
          </Text>
        </View>
      </View>

      {/* Requisitos */}
      <View>
        <View className="flex-row items-center space-x-2 mb-1">
          {/* <FontAwesome name="check" size={24} color="black" /> */}
          <Text style={[FONTS.fontBold]}>Requisitos</Text>
        </View>
        <View className="space-y-2  p-2 rounded-lg">
          <Text style={[FONTS.font, { color: colors.text }]}>
            {props.information.requirements || "Não informado"}
          </Text>
        </View>
      </View>

      {/* Competência */}
      <View>
        <View className="flex-row items-center space-x-2 mb-1">
          {/* <FontAwesome name="star" size={24} color="black" /> */}
          <Text style={[FONTS.fontBold]}>Competência</Text>
        </View>
        <View className="w-full items-center">
          <View className="flex-row flex-wrap gap-1">
            {props.information.skills &&
              JSON.parse(props.information.skills).map((skill: any) => (
                <View key={skill} className="px-2 py-1 rounded-lg border">
                  <Text
                    className="text-center"
                    style={{ ...FONTS.font, color: "black" }}
                  >
                    {skill}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </View>

      {/* Benefícios */}
      <View className="mb-8">
        <View className="flex-row space-x-2 mb-1 mt-2">
          {/* <FontAwesome5 name="gift" size={24} color="black" /> */}
          <Text style={[FONTS.fontBold]}>Benefícios</Text>
        </View>
        <View className="w-full">
          <View className="flex-row flex-wrap  gap-1">
            {props.information.benefits &&
              JSON.parse(props.information.benefits).map((skill: any) => (
                <View key={skill} className="px-2 py-1 rounded-lg border">
                  <Text
                    className="text-center"
                    style={{ ...FONTS.font, color: "black" }}
                  >
                    {skill}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </View>

    </View>
  );
};

export default AccordionCardIformation;
