import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { COLORS, FONTS } from '../../constants/theme';


type Props = {
    message?: string;
}

const DangerSheet: React.FC<Props> = ({ message }) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    return (
        <View style={{
                alignItems:'center',
                paddingHorizontal:35,
                paddingVertical:20,
                backgroundColor:theme.dark ? colors.background  :colors.card
            }}
        >
            <View
                style={{
                    alignItems:'center',
                    justifyContent:'center',
                    marginBottom:15,
                    marginTop:10,
                }}
            >
                <View
                    style={{
                        height:80,
                        width:80,
                        opacity:.2,
                        backgroundColor:COLORS.danger,
                        borderRadius:80,
                    }}
                />
                <View
                    style={{
                        height:65,
                        width:65,
                        backgroundColor:COLORS.danger,
                        borderRadius:65,
                        position:'absolute',
                        alignItems:'center',
                        justifyContent:'center',
                    }}
                >
                    {/* <FeatherIcon size={32} color={COLORS.white} name="check"/> */}
                    <Feather size={32} color={COLORS.white} name="x"/>
                </View>
            </View>
            <Text style={{...FONTS.h4,color:colors.title,marginBottom:8}}>Erro!</Text>
            <Text style={{...FONTS.font,color:colors.text,textAlign:'center'}}>{message}</Text>
        </View>
    );
};


export default DangerSheet;