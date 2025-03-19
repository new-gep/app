import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

type Props = {
    title : string,
    onPress ?: (e : any) => void,
    color ?: any,
    style ?: object,
    size ?: any,
    text ?: any,
    bg   ?: string,
    load ?: boolean,
    loadColor ?: string,
    loadSize  ?: number,
    icon ?: any
}

const Button = ({
    title,
    onPress,
    color,
    style,
    size,
    text,
    bg,
    load,
    loadColor,
    loadSize,
    icon
}: Props) => {
    return (
        <TouchableOpacity 
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View className={`${bg}`}
                style={[styles.button,color && {
                    backgroundColor:color,
                },size === 'sm' && {
                    height:36,
                    paddingHorizontal:10,
                    borderRadius:4
                },size === 'lg' && {
                    height:55,
                    paddingHorizontal:30,
                },style && {...style}]}
            >
                {load ? (
                    <ActivityIndicator
                        size={loadSize}
                        color={loadColor}
                    />
                ) : (
                    <>
                        <Text style={[
                            styles.buttnTitle,
                            size === 'sm' && { fontSize:14 },
                            size === 'lg' && { fontSize:18 },
                            color && {color: COLORS.white},
                            text && {color: text}
                        ]}>
                            {title}
                        </Text>
                        {icon && <View style={styles.iconContainer}>{icon}</View>}
                    </>
                )}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button : {
        height:60,
        borderRadius:8,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:20,
    },
    buttnTitle : {
        ...FONTS.fontSemiBold,
        fontSize:16,
        color : '#fff',
        lineHeight:24,
        textTransform:'uppercase'
    },
    iconContainer: {
        marginLeft: 8,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default Button;