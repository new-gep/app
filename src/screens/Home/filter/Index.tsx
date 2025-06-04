import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { FONTS } from "~/src/constants/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import LocationFilter from "./Helper/Location";
import AgeRangeFilter from "./Helper/Range";
// import InterestsFilter from './Helper/Interests';
import InterestsFilter from "../../Profile/About/Helper/Interests";
import Header from "~/src/layout/Header";
import { rf } from "~/src/hooks/utils/responsiveFont";
export default function Filter() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Meu Trabalho" leftIcon={"back"} />
      <ScrollView className="px-6">
        <LocationFilter />
        {/* <AgeRangeFilter /> */}
        <View style={Style.container} className="bg-white rounded-lg p-4 mb-4">
          <InterestsFilter
            border={true}
            title="Contrato"
            icon="handShake_outline"
            options={["CLT", "Contrato", "PJ", "Autônomo", "Freelancer", "A combinar"]}
          />
          <InterestsFilter
            border={true}
            title="Modalidade"
            icon="homeWork_outline"
            options={["Presencial", "Híbrido", "Remoto"]}
          />
          <InterestsFilter
            border={true}
            title="Horários"
            icon="clock_outline"
            options={[
              "Integral",
              "Manhã",
              "Tarde",
              "Noite",
              "Madrugada",
              "Fins de semana",
              "Horário flexível",
            ]}
          />
          <InterestsFilter
            border={true}
            title="Mobilidade"
            icon="bus_outline"
            options={[
              "Carro",
              "Moto",
              "Aplicativo",
              "Ônibus",
              "Trem",
              "Bike",
              "A combinar",
            ]}
          />
          <InterestsFilter
            title="Pagamento"
            icon="savings_outline"
            options={[
              "Por hora",
              "Por dia",
              "Por semana",
              "Por tarefa",
              "Por mês",
              "A combinar",
            ]}
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="bg-[#fde047] py-4 rounded-t-[20px] mx-4 mb-2"
        onPress={() => console.log("CONCLUÍDO pressed")}
      >
        <Text
          className="text-dark text-center"
          style={{ ...FONTS.fontBold, fontSize: rf(16) }}
        >
          CONCLUÍDO
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const Style = {
  container: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
};
