import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "~/src/layout/Header";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FONTS } from "~/src/constants/theme";

export default function Contract({menu, setMenu, select, setSelect}:any){

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
            <Header dynamic={back} title="Contrato"  />
            <ScrollView className="px-5 mt-5" contentContainerStyle={{ paddingBottom: 80 }}>
                <View className="gap-5">
                    <BouncyCheckbox
                        size={20}
                        text="CLT"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("CLT")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("CLT")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="PJ"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("PJ")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("PJ")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Autônomo"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Autônomo")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Autônomo")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Freelancer"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Freelancer")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Freelancer")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Contrato"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Contrato")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Contrato")}
                        
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
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
                </View>
            </ScrollView>
        </View>
    )
}

