import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "~/src/layout/Header";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FONTS } from "~/src/constants/theme";

export default function Category({menu, setMenu, select, setSelect}:any){

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
                        text="Assistência Técnica"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Assistência Técnica")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Assistência Técnica")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Aulas"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Aulas")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Aulas")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Mecânica e Transportes"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Mecânica e Transportes")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Mecânica e Transportes")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Consultoria"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Consultoria")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Consultoria")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Design e Tecnologia"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Design e Tecnologia")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Design e Tecnologia")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Moda e Beleza"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Moda e Beleza")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Moda e Beleza")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Reformas e Reparos"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Reformas e Reparos")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Reformas e Reparos")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Saúde"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Saúde")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Saúde")}
                    />
                    <View className="border-b border-[#a7a7a7]"></View>
                    <BouncyCheckbox
                        size={20}
                        text="Serviços Domésticos"
                        textStyle={{textDecorationLine: 'none', ...FONTS.fontBlack, color:'black'}}
                        fillColor="#22c55e"   // verde tipo Tailwind 'green-500'
                        unfillColor="#f4f4f4" 
                        isChecked={select.includes("Serviços Domésticos")}
                        iconStyle={{ borderColor: "#22c55e" }}
                        onPress={() => toggleService("Serviços Domésticos")}
                    />
                </View>
            </ScrollView>
        </View>
    )
}