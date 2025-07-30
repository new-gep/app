import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "~/src/layout/Header";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FONTS } from "~/src/constants/theme";

export default function Service({menu, setMenu, select, setSelect}:any){

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
            <Header dynamic={back} title="Serviço"  />
            <ScrollView className="px-5 mt-5" contentContainerStyle={{ paddingBottom: 80 }}>
                <View className="gap-5">
                    <BouncyCheckbox
                        size={20}
                        text="Empresas"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Empresas")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Empresas")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Serviços informais"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Serviços informais")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Serviços informais")}
                    />
                </View>
            </ScrollView>
        </View>
    )
}