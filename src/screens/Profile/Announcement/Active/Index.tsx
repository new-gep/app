import React from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "~/src/layout/Header";

export default function Active(){
    return(
        <View className="bg-white h-full">
            <Header leftIcon="back" title="Anúncio Ativo"/>
            <ScrollView>

            </ScrollView>
        </View>
    )
}