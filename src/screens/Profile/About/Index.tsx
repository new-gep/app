import React, { useState } from "react";
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
import InterestsFilter from "./Helper/Interests";
import AboutMy from "./Helper/aboutMy";
import Header from "~/src/layout/Header";
import useCollaborator from "~/src/function/fetchCollaborator";
import UpdateCollaborator from "~/src/hooks/update/collaborator";
import { useNavigation } from "@react-navigation/native";

export default function About() {
  const [presentation, setPresentation] = useState<any>('');
  const [drink, setDrink] = useState<any>(null);
  const [interests, setInterests] = useState<any>(null);
  const [languageLove, setLanguageLove] = useState<any>(null);
  const [values, setValues] = useState<any>(null);
  const [food, setFood] = useState<any>(null);
  const [pet, setPet] = useState<any>(null);
  const [smoke, setSmoke] = useState<any>(null);
  const [communication, setCommunication] = useState<any>(null);
  const [formation, setFormation] = useState<any>(null);
  const { collaborator } = useCollaborator();
  const navigation = useNavigation<any>();

  const handleSave = async () => {
    if (!collaborator) return;
    const about = {
      drink: drink,
      interests: interests,
      languageLove: languageLove,
      values: values,
      food: food,
      pet: pet,
      smoke: smoke,
      formation: formation,
      communication: communication,
    };
    const response = await UpdateCollaborator(collaborator.CPF, {
      about: about,
      presentation: presentation,
    });
    if (response.status == 200) {
      Alert.alert("Sucesso", "Redes Sociais atualizado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
      return;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Sobre mim" leftIcon={"back"} />
      <ScrollView className="px-6 py-3 ">
        <AboutMy text={presentation} setText={setPresentation} />
        <View style={Style.container} className="bg-white rounded-lg p-4 mb-4">
          <InterestsFilter
            border={true}
            icon="chat_outline"
            title="Comunicação"
            options={[
              "Curto conversa no WhatsApp",
              "Gosto de falar no telefone",
              "Adoro chamada de vídeo",
              "Melhor falar pessoalmente",
            ]}
            onSelect={setCommunication}
          />
          <InterestsFilter
            border={true}
            icon="school_outline"
            title="Formação"
            options={[
              "Superior completo",
              "Fazendo faculdade",
              "Cursando o Ensino Médio",
              "Doutorado completo",
              "Fazendo pós",
              "Mestrado completo",
              "Curso técnico",
            ]}
            onSelect={setFormation}
          />
          <InterestsFilter
            border={true}
            onSelect={setSmoke}
            icon="smoke_outline"
            title="Você fuma"
            options={[
              "Fumo socialmente",
              "Fumo quando bebo",
              "Não fumo",
              "Fumante",
              "Tentando parar",
            ]}
          />
          <InterestsFilter
            border={true}
            icon="wine_outline"
            title="Bebida"
            onSelect={setDrink}
            options={[
              "Não curto",
              "Parei de beber",
              "Bebo com modereção",
              "Em ocasiões especiais",
              "Socialmente, aos fins de semana",
              "Quase toda noite",
            ]}
          />
          <InterestsFilter
            onSelect={setInterests}
            border={true}
            icon="book_outline"
            title="Interesses"
            options={[
              "Criatividade",
              "Esportes",
              "Cultura & Arte",
              "Autoconhecimento",
              "Filmes & Séries",
              "Meditação",
              "Academia",
              "Cinema",
              "Leitura",
              "Viagens",
              "Cozinhar",
              "Stand-up",
              "Filosofia",
              "Podcasts",
              "Jogos",
            ]}
          />
          <InterestsFilter
            onSelect={setLanguageLove}
            border={true}
            icon="heart_outline"
            title="Linguagem do amor"
            options={[
              "Gestos de serviço",
              "Presentes",
              "Toque físico",
              "Elogios",
              "Tempo de qualidade",
            ]}
          />
          <InterestsFilter
            onSelect={setValues}
            border={true}
            icon="balance_outline"
            title="Valores"
            options={[
              "Espiritualidade",
              "Relações",
              "Autonomia",
              "Justiça",
              "Aprendizado",
              "Cooperação",
              "Sustentabilidade",
              "Propósito",
            ]}
          />
          <InterestsFilter
            border={true}
            onSelect={setPet}
            icon="pet_outline"
            title="Pets"
            options={[
              "Cachorro",
              "Gato",
              "Réptil",
              "Anfíbio",
              "Passarinho",
              "Peixe",
              "Não tenho, mas amo",
              "Outro",
              "Tartaruga",
              "Hamster",
              "Coelho",
              "Não tenho pets",
              "Gosto de todos",
              "Quero um pet",
              "Tenho alergia a pets",
            ]}
          />
          <InterestsFilter
            onSelect={setFood}
            icon="pizza_outline"
            title="Alimentação"
            options={[
              "Vegano(a)",
              "Vegetariano(a)",
              "Pescetariano(a)",
              "Kosher",
              "Halal",
              "Carnívoro(a)",
              "Onivoro(a)",
            ]}
          />
        </View>
        <View className="mb-7"></View>
      </ScrollView>
      <TouchableOpacity
        className="bg-[#fde047] py-4 rounded-t-[20px] mx-4 mb-2"
        onPress={handleSave}
      >
        <Text
          className="text-dark text-center"
          style={{ ...FONTS.fontBold, fontSize: 16 }}
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
