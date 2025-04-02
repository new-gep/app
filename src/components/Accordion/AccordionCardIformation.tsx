import React from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { FONTS } from '../../constants/theme';
import { useTheme } from '@react-navigation/native';

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
        <View className="space-y-6">
            {/* Informações */}
            <View>
                <View className="flex-row items-center space-x-2 mb-3">
                    <MaterialIcons name="info-outline" size={24} color={colors.text} />
                    <Text className="text-lg font-bold">
                        Informações
                    </Text>
                </View>
                <View className="space-y-2">
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Salário:</Text> R$ {props.information.salary || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Tipo de Contratação:</Text> {props.information.contract_type || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Jornada:</Text> {props.information.time?.journey || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Carga Horária:</Text> {props.information.workload || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        <Text style={FONTS.fontMedium}>Descrição:</Text> {props.information.description || "Não informado"}
                    </Text>
                </View>
            </View>

            {/* Requisitos */}
            <View>
                <View className="flex-row items-center space-x-2 mb-3">
                    <MaterialCommunityIcons name="clipboard-list-outline" size={24} color={colors.text} />
                    <Text className="text-lg font-bold">
                        Requisitos
                    </Text>
                </View>
                <View className="space-y-2">
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        {props.information.obligations || "Não informado"}
                    </Text>
                </View>
            </View>

            {/* Benefícios */}
            <View>
                <View className="flex-row items-center space-x-2 mb-3">
                    <MaterialIcons name="card-giftcard" size={24} color={colors.text} />
                    <Text className="text-lg font-bold">
                        Benefícios
                    </Text>
                </View>
                <View className="space-y-2 items-start justify-start">
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        {props.information.benefics || "Não informado"}
                    </Text>
                </View>
            </View>

            {/* Detalhes */}
            <View>
                <View className="flex-row items-center space-x-2 mb-3">
                    <FontAwesome name="list-alt" size={24} color={colors.text} />
                    <Text className="text-lg font-bold">
                        Detalhes
                    </Text>
                </View>
                <View className="w-full items-start justify-start">
                    <Text style={[FONTS.fontXs, { color: colors.text }]}>
                        {props.details || "Não informado"}
                    </Text>
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