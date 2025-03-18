import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { COLORS, FONTS, SIZES } from '../../constants/theme';
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
    const {colors} : {colors : any} = theme;

    const [activeSections, setActiveSections] = useState([0]);
    const setSections = (sections:any) => {
        setActiveSections(
        sections.includes(undefined) ? [] : sections
        );
    };
    
    const SECTIONS = [
        {
            title: 'Informações',
            content: (
                <View className="space-y-2">
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        <Text style={FONTS.fontMedium}>Salário:</Text> R$ {props.information.salary || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        <Text style={FONTS.fontMedium}>Tipo de Contratação:</Text> {props.information.contract_type || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        <Text style={FONTS.fontMedium}>Jornada:</Text> {props.information.time?.journey || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        <Text style={FONTS.fontMedium}>Carga Horária:</Text> {props.information.workload || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        <Text style={FONTS.fontMedium}>Descrição:</Text> {props.information.description || "Não informado"}
                    </Text>
                </View>
            ),
        },
        {
            title: 'Requisitos',
            content: (
                <View className="space-y-2">
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        {props.information.obligations || "Não informado"}
                    </Text>
                </View>
            ),
        },
        {
            title: 'Benefícios',
            content: (
                <View className="space-y-2">
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        {props.information.benefics || "Não informado"}
                    </Text>
                </View>
            ),
        },
        {
            title: 'Detalhes',
            content: (
                <View>
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        {props.details || "Não informado"}
                    </Text>
                </View>
            ),
        },
        {
            title: 'Empresa',
            content: (
                <View className="space-y-2">
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        <Text style={FONTS.fontMedium}>Empresa:</Text> {props.company.company_name || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        <Text style={FONTS.fontMedium}>Telefone:</Text> {props.company.phone || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        <Text style={FONTS.fontMedium}>Email:</Text> {props.company.email || "Não informado"}
                    </Text>
                    <Text style={[FONTS.fontXs, {color: colors.text}]}>
                        <Text style={FONTS.fontMedium}>Localização:</Text> {`${props.company.street || ""}, ${props.company.number || ""} - ${props.company.district || ""}, ${props.company.city || ""} - ${props.company.uf || ""}`}
                    </Text>
                </View>
            ),
        },
        // {
        //     title: 'The Impact of Ecommerce on Business',
        //     content: 'Global Reach: Ecommerce allows businesses to reach a global customer base. With an online store, you can sell your products or services to customers anywhere in the world.',
        // },
    ];

    const AccordionHeader = (item:any, _:any, isActive:any) => {
        return(
            <View style={{
                flexDirection:'row',
                alignItems:'center',
                paddingVertical:10,
                paddingHorizontal:15,
                borderRadius:SIZES.radius_sm,
                backgroundColor: isActive ? COLORS.dark : colors.background,
            }}>
                <Text style={[FONTS.fontSm,FONTS.fontMedium,{color:isActive ? COLORS.card : colors.title,flex:1}]}>{item.title}</Text>
                <View
                    style={[{
                        height:24,
                        width:24,
                        backgroundColor:colors.card,
                        borderRadius:24,
                        alignItems:'center',
                        justifyContent:'center',
                    },isActive && {
                        backgroundColor:'rgba(255,255,255,.9)',
                    }]}
                >
                     <FeatherIcon size={20} color={isActive ? COLORS.title :theme.dark ? 'rgba(255,255,255,0.5)': COLORS.dark} name={isActive ? "minus" : "plus"} />
                    {/* <FeatherIcon size={18} color={isActive ? COLORS.white : colors.title} name={isActive ? 'minus' : 'plus'}/> */}
                </View>
            </View>
        )
    }
    const AccordionBody = (item:any, _:any, isActive:any) => {
        return(
            <View style={{marginBottom:15,marginTop:10,paddingHorizontal:15}}>
                {item.content}
            </View>
        )
    }

    return (
        <>
            <Accordion
                sections={SECTIONS}
                sectionContainerStyle={{marginBottom:6}}
                duration={300}
                activeSections={activeSections}
                onChange={setSections}
                touchableComponent={TouchableOpacity}
                renderHeader={AccordionHeader}
                renderContent={AccordionBody}
            />
        </>
    );
};


export default AccordionCardIformation;
