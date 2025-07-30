import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "~/src/layout/Header";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FONTS } from "~/src/constants/theme";

export default function Payment({menu, setMenu, select, setSelect}:any){

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
            <Header dynamic={back} title="Pagamento"  />
            <ScrollView className="px-5 mt-5" contentContainerStyle={{ paddingBottom: 80 }}>
                <View className="gap-5">
                     <BouncyCheckbox
                        size={20}
                        text="A combinar"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("A combinar")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("A combinar")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Fixo"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Fixo")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Fixo")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Por hora"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Por hora")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Por hora")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Por dia"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Por dia")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Por dia")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Por semana"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Por semana")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Por semana")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Por tarefa"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Por tarefa")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Por tarefa")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Por mês"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Por mês")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Por mês")}
                    />
                </View>
            </ScrollView>
        </View>
    )
}