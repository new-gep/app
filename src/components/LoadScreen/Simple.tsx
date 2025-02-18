import React from "react"
import { View, Image, Text, ActivityIndicator } from "react-native"
import { useTheme } from '@react-navigation/native';
import { IMAGES } from "../../constants/Images";

export default function LoadScreenSimple(){
    const theme = useTheme();

    return(
        <View className={`h-full w-full flex-row justify-between items-center`}>
            <View className={`text-center flex-col w-full p-2 justify-center items-center`}>
                <Image
                    className='h-44 w-44 absolute -bottom-10'
                    source={theme.dark ? IMAGES.appnamedark :IMAGES.appname}
                    
                />
                <ActivityIndicator
                    color={'#1f2937'}
                    size={16}
                    className={`absolute`}
                />
            </View>
        </View>
    )
}