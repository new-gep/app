import React from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "~/src/layout/Header";

export default function History(){
    return(
        <View className="bg-white h-full">
            <Header leftIcon="back" title="Histórico"/>
            <ScrollView>

            </ScrollView>
        </View>
    )
}