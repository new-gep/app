import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "~/src/layout/Header";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FONTS } from "~/src/constants/theme";

export default function Time({menu, setMenu, select, setSelect}:any){

    const back = () => {
        setMenu('default')
    };

    const toggleService = (value: string) => {
        if (select.includes(value)) {
            setSelect(select.filter((item: string) => item !== value));
        } else {
            setSelect([...select, value]);
        }
    };

    return(
        <View>
            <Header dynamic={back} title="Horário"  />
            <ScrollView className="px-5 mt-5" contentContainerStyle={{ paddingBottom: 80 }}>
                <View className="gap-5">
                    <BouncyCheckbox
                        size={20}
                        text="Integral"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Integral")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Integral")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Manhã"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Manhã")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Manhã")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Tarde"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Tarde")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Tarde")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Noite"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Noite")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Noite")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Madrugada"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Madrugada")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Madrugada")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Fins de semana"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Fins de semana")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Fins de semana")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Horário flexível"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Horário flexível")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Horário flexível")}
                    />
                </View>
            </ScrollView>
        </View>
    )
}