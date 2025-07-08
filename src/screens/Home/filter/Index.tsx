import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { FONTS } from "~/src/constants/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import LocationFilter from "./Helper/Location";
import AgeRangeFilter from "./Helper/Range";
import useCollaborator from "~/src/function/fetchCollaborator";
import UpdateCollaborator from "~/src/hooks/update/collaborator";
import InterestsFilter from "../../Profile/About/Helper/Interests";
import Header from "~/src/layout/Header";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { useNavigation } from "@react-navigation/native";

export default function Filter() {
  const { collaborator, updateCollaborator } = useCollaborator();
  const navigation = useNavigation<any>();
  const [distance, setDistance] = useState(2);
  const [locations, setLocations] = useState<string[]>([]);
  const [showFarWork, setShowFarWork] = useState<boolean>(false);
  const [payment, setPayment]   = useState<any>(null)
  const [mobility, setMobility] = useState<any>(null)
  const [horary, setHorary]     = useState<any>(null)
  const [modality, setModality] = useState<any>(null) 
  const [contract, setContract] = useState<any>(null)

  const handleSave = async () => {
    if (!collaborator) return;
    const data = {
      distance:distance,
      showFarWork:showFarWork,
      locations:locations,
      payment:payment,
      mobility:mobility,
      horary:horary,
      modality:modality,
      contract:contract
    };
    const response = await UpdateCollaborator(collaborator.CPF, {
      howWork: data,
    });
    if (response.status == 200) {
      updateCollaborator(collaborator.CPF)
      Alert.alert("Sucesso", "Como você trabalha foi atualizado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
      return;
    }
    Alert.alert("Falha", "Não foi possível atualizar como você trabalha!", [
      {
        text: "OK",
      },
    ]);
  };

  useEffect(()=>{
    if(collaborator && collaborator.howWork){
      setDistance(collaborator.howWork.distance)
      setLocations(collaborator.howWork.locations)
      setShowFarWork(collaborator.howWork.showFarWork)
      setContract(collaborator.howWork.contract)
      setModality(collaborator.howWork.modality)
      setHorary(collaborator.howWork.horary)
      setMobility(collaborator.howWork.mobility)
      setPayment(collaborator.howWork.payment)
    }
  },[collaborator]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Meu Trabalho" leftIcon={"back"} />
      <ScrollView className="px-6">
        <LocationFilter showFarWork={showFarWork} setShowFarWork={setShowFarWork} distance={distance} setDistance={setDistance}  locations={locations} setLocations={setLocations}/>
        {/* <AgeRangeFilter /> */}
        <View style={Style.container} className="bg-white rounded-lg p-4 mb-4">
          <InterestsFilter
            border={true}
            title="Contrato"
            onSelect={setContract}
            selected={contract}
            icon="handShake_outline"
            options={[
              "CLT",
              "Contrato",
              "PJ",
              "Autônomo",
              "Freelancer",
              "A combinar",
            ]}
          />
          <InterestsFilter
            border={true}
            title="Modalidade"
            onSelect={setModality}
            selected={modality}
            icon="homeWork_outline"
            options={["Presencial", "Híbrido", "Remoto"]}
          />
          <InterestsFilter
            border={true}
            title="Horários"
            onSelect={setHorary}
            selected={horary}
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
            onSelect={setMobility}
            selected={mobility}
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
            onSelect={setPayment}
            selected={payment}
            icon="savings_outline"
            options={[
              "Fixo",
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
        onPress={handleSave}
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
