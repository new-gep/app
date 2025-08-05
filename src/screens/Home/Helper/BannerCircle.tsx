import React from "react";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import Icon from "~/src/components/Icon/Icon";
import { rf } from "~/src/hooks/utils/responsiveFont";
import {
  Wrench,
  GraduationCap,
  CarFront,
  Handshake,
  MonitorSmartphone,
  PartyPopper,
  Shirt,
  Hammer,
  HeartPulse,
  House,
} from "lucide-react-native";
import useCollaborator from "~/src/function/fetchCollaborator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AllPeople from "~/src/hooks/get/collaborator/AllPeople";
import FindAllService from "~/src/hooks/get/job/allService";

const items = [
  { icon: "Wrench", label: "Assistência Técnica" },
  { icon: "GraduationCap", label: "Aulas" },
  { icon: "CarFront", label: "Mecânica e Transportes" },
  { icon: "Handshake", label: "Consultoria" },
  { icon: "MonitorSmartphone", label: "Design e Tecnologia" },
  { icon: "PartyPopper", label: "Eventos" },
  { icon: "Shirt", label: "Moda e Beleza" },
  { icon: "Hammer", label: "Reformas e Reparos" },
  { icon: "HeartPulse", label: "Saúde" },
  { icon: "House", label: "Serviços Domésticos" },
];

const renderIcon = (type: string) => {
  switch (type) {
    case "Wrench":
      return <Wrench size={22} className="text-dark"/>;
    case "GraduationCap":
      return <GraduationCap size={22} className="text-dark"/>;
    case "CarFront":
      return <CarFront size={22} className="text-dark"/>;
    case "Handshake":
      return <Handshake size={22} className="text-dark"/>;
    case "MonitorSmartphone":
      return <MonitorSmartphone size={22} className="text-dark"/>;
    case "PartyPopper":
      return <PartyPopper size={22} className="text-dark"/>;
    case "Shirt":
      return <Shirt size={22} className="text-dark"/>;
    case "Hammer":
      return <Hammer size={22} className="text-dark"/>;
    case "HeartPulse":
      return <HeartPulse size={22} className="text-dark"/>;
    case "House":
      return <House size={22} className="text-dark"/>;
    default:
      return <CarFront size={22} className="text-dark"/>;
  }
};


export default function BannerCircle({ option, setIsLoading, setCards }:any) {

  const { collaborator, updateCollaborator } = useCollaborator();

  const fetchJobs = async (option:any) => {
    try {
      if (!collaborator) return;
      console.log(option)
      setIsLoading(true);
      const props: any = {
        cpf: collaborator.CPF,
        cep: collaborator.zip_code,
        categorySelected:[option],
        serviceSelected:['Serviços informais']
      };
      const response = await FindAllService(props);
      if (response.status !== 200) {
        throw new Error(response.message || "Erro ao buscar os jobs.");
      }
      setCards(response.data);
    } catch (error: any) {
      alert("Erro ao buscar os jobs. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPeople = async (option:any) => {
    if (!collaborator) return;
    setIsLoading(true);
    const props: any = {
      cpf: collaborator.CPF,
      cep: collaborator.zip_code,
      categorySelected:[option]
    };
    const response = await AllPeople(props);
    if (response?.status == 200) {
      setCards(response.peoples);
    }
    setIsLoading(false);
  };
  
  const handleSearch = async (item:any) => {
    if(option == 'Service'){
      fetchJobs(item.label)
    }else{
      fetchPeople(item.label)
    }
  }

  return (
    <View style={{ marginTop: 20 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              alignItems: "center",
              marginRight: 16,
              width: 60, // largura fixa para alinhar e permitir quebra
            }}
            onPress={()=>handleSearch(item)}
          >
            <View
              className="bg-primary rounded-full items-center justify-center p-2"
              // activeOpacity={0.8}
            >
              {renderIcon(item.icon)}
            </View>
            <Text
              className="text-gray-500 text-center"
              style={{
                fontSize: 9,
                marginTop: 4,
                flexWrap: "wrap",
              }}
              numberOfLines={2}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
