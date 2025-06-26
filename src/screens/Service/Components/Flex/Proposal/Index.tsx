import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import { View, Text } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Header from "~/src/layout/Header";
import ProposalCard from "./Card";

export default function Proposal() {
  
  const fakeData = [
    {
      id: 1,
      create: "10/05/2023",
      finish: "11/06/2023",
      candidate: [
        {
          id: 1,
          name: "Mario Oliveira",
          service: [
            "Geladeira",
            "Lava Louça",
            "Televisão",
            "Dança",
            "Concursos",
          ],
          category: ["Assistência Técnica", "Aulas"],
          age: 22,
          phone: "1912345678",
          email: "mario.oliveira@email.com",
          zip_code: "01234-567",
          street: "Rua das Flores",
          district: "Jardim das Rosas",
          city: "São Paulo",
          uf: "SP",
          isVerified: true,
          photoUri: "https://randomuser.me/api/portraits/men/75.jpg",
          birth: "01/10/2001",
          locality: "São Paulo - SP",
          interests: ["Música", "Tecnologia", "Esportes"],
          about:
            "Sou uma pessoa dedicada, focada e apaixonada pelo que faço. Sempre busco aprender e crescer profissionalmente.",
          contact: {
            phone: "+55 11 91234-5678",
            email: "joao.silva@email.com",
            address: "Rua das Flores, 123, São Paulo - SP",
          },
          workPreferences: {
            location: "São Paulo - SP",
            maxDistanceKm: 50,
            allowFurtherDistance: true,
            contractType: ["Autônomo", "CLT"],
            modality: ["Híbrido", "Presencial"],
            schedule: ["Dia", "Noite"],
            mobility: ["Carro", "Moto"],
            paymentType: ["Por dia", "Por hora", "A combinar"],
          },
          social: {
            instagram: "@meuinsta",
            facebook: "https://facebook.com/meuperfil",
            linkedin: "https://linkedin.com/in/meulinkedin",
            twitter: "@meutwitter",
            tiktok: "https://www.tiktok.com/@meutiktok",
            youtube: "https://www.youtube.com/channel/abc123",
            website: "https://www.meusite.com.br",
          },
          personal: {
            pets: ["Cachorro", "Gato"],
            diet: ["Onívoro"],
            loveLanguage: ["Toque Físico", "Tempo de Qualidade"],
            drinks: ["Sim"],
            smokes: ["Não"],
            education: ["Ensino Superior Completo"],
            communicationType: ["Assertiva", "Passiva"],
            children: ["3"],
            marriage: ["Sim"],
            values: ["Familía", "Trabalho"],
          },
        },
        {
          id: 2,
          name: "Carlos Mendes",
          service: ["Pedreiro", "Pintor", "Encanador"],
          category: ["Reformas e Reparos"],
          age: 40,
          phone: "1912345678",
          email: "mario.oliveira@email.com",
          zip_code: "01234-567",
          street: "Rua das Flores",
          district: "Jardim das Rosas",
          city: "São Paulo",
          interests: ["Música", "Tecnologia", "Esportes"],
          uf: "SP",
          isVerified: true,
          photoUri: "https://randomuser.me/api/portraits/men/32.jpg",
          birth: "12/08/1985",
          locality: "Rio de Janeiro - RJ",
          about:
            "Tenho mais de 10 anos de experiência com reformas e reparos residenciais.",
          contact: {
            phone: "+55 21 98888-0000",
            email: "carlos.reformas@email.com",
            address: "Av. das Nações, 45, Rio de Janeiro - RJ",
          },
          workPreferences: {
            location: "Rio de Janeiro - RJ",
            maxDistanceKm: 30,
            allowFurtherDistance: false,
            contractType: ["Autônomo"],
            modality: ["Presencial"],
            schedule: ["Dia"],
            mobility: ["Moto"],
            paymentType: ["A combinar", "Por dia"],
          },
          social: {
            instagram: "@reformas.carlos",
          },
          personal: {
            pets: ["Não"],
            diet: ["Onívoro"],
            loveLanguage: ["Atos de Serviço"],
            drinks: ["Não"],
            smokes: ["Sim"],
            education: ["Ensino Médio Completo"],
            communicationType: ["Assertiva"],
            children: ["2"],
            marriage: ["Sim"],
            values: ["Honestidade", "Comprometimento"],
          },
        },
        {
          id: 3,
          age: 22,
          name: "Juliana Costa",
          phone: "1912345678",
          email: "mario.oliveira@email.com",
          zip_code: "01234-567",
          street: "Rua das Flores",
          district: "Jardim das Rosas",
          city: "São Paulo",
          interests: ["Música", "Tecnologia", "Esportes"],
          service: ["Babá", "Personal Organizer", "Cozinheira"],
          category: ["Serviços Domésticos"],
          isVerified: true,
          photoUri: "https://randomuser.me/api/portraits/women/12.jpg",
          birth: "27/04/1992",
          locality: "Belo Horizonte - MG",
          about:
            "Amo cuidar de crianças e organizar ambientes com carinho e responsabilidade.",
          contact: {
            phone: "+55 31 99876-4321",
            email: "juliana.costa@email.com",
            address: "Rua Verde, 88, Belo Horizonte - MG",
          },
          workPreferences: {
            location: "Belo Horizonte - MG",
            maxDistanceKm: 20,
            allowFurtherDistance: true,
            contractType: ["CLT", "Autônomo"],
            modality: ["Presencial"],
            schedule: ["Dia"],
            mobility: ["Transporte Público"],
            paymentType: ["Por hora"],
          },
          social: {
            facebook: "https://facebook.com/julianacosta",
          },
          personal: {
            pets: ["Cachorro"],
            diet: ["Vegetariano"],
            loveLanguage: ["Palavras de Afirmação"],
            drinks: ["Não"],
            smokes: ["Não"],
            education: ["Ensino Médio Completo"],
            communicationType: ["Empática"],
            children: ["1"],
            marriage: ["Não"],
            values: ["Cuidado", "Paciência"],
          },
        },
      ],
      CPF_Collaborator: {
        id: 1,
        name: "Mario Oliveira",
        service: ["Geladeira", "Lava Louça", "Televisão", "Dança", "Concursos"],
        category: ["Assistência Técnica", "Aulas"],
        age: 22,
        phone: "1912345678",
        email: "mario.oliveira@email.com",
        zip_code: "01234-567",
        street: "Rua das Flores",
        district: "Jardim das Rosas",
        city: "São Paulo",
        uf: "SP",
        isVerified: true,
        photoUri: "https://randomuser.me/api/portraits/men/75.jpg",
        birth: "01/10/2001",
        locality: "São Paulo - SP",
        interests: ["Música", "Tecnologia", "Esportes"],
        about:
          "Sou uma pessoa dedicada, focada e apaixonada pelo que faço. Sempre busco aprender e crescer profissionalmente.",
        contact: {
          phone: "+55 11 91234-5678",
          email: "joao.silva@email.com",
          address: "Rua das Flores, 123, São Paulo - SP",
        },
        workPreferences: {
          location: "São Paulo - SP",
          maxDistanceKm: 50,
          allowFurtherDistance: true,
          contractType: ["Autônomo", "CLT"],
          modality: ["Híbrido", "Presencial"],
          schedule: ["Dia", "Noite"],
          mobility: ["Carro", "Moto"],
          paymentType: ["Por dia", "Por hora", "A combinar"],
        },
        social: {
          instagram: "@meuinsta",
          facebook: "https://facebook.com/meuperfil",
          linkedin: "https://linkedin.com/in/meulinkedin",
          twitter: "@meutwitter",
          tiktok: "https://www.tiktok.com/@meutiktok",
          youtube: "https://www.youtube.com/channel/abc123",
          website: "https://www.meusite.com.br",
        },
        personal: {
          pets: ["Cachorro", "Gato"],
          diet: ["Onívoro"],
          loveLanguage: ["Toque Físico", "Tempo de Qualidade"],
          drinks: ["Sim"],
          smokes: ["Não"],
          education: ["Ensino Superior Completo"],
          communicationType: ["Assertiva", "Passiva"],
          children: ["3"],
          marriage: ["Sim"],
          values: ["Familía", "Trabalho"],
        },
      },
      visibility: "Gratuito",
      typeService: "my",
      service: ["Reformas e Reparos"],
      name: "Maria Oliveira",
      valueType: "a combinar",
      locality: "São Paulo - SP",
      title: "Pintar minha casa",
      contactName: "João Silva",
      isVerified: true,
      function: "Pintar minha casa",
      salary: "150000",
      model: "Presencial",
      phone: "1193291233",
      info: "Serviço de pintura residencial completo, com material incluso.",
      included: "Tinta, mão de obra, limpeza após serviço.",
      notIncluded: "Movimentação de móveis, reparos em paredes.",
      photoUri: "https://randomuser.me/api/portraits/women/75.jpg",
      gallery: [
        "https://www.bgcexperts.com/wp-content/uploads/2024/05/interior-painting-services.jpg",
        "https://www.imageworkspainting.com/hubfs/stock-01.jpg",
        "https://www.solispainting.com/img/hero/painting-projects.jpg",
      ],
    },
    {
      id: 5,
      typeService: "flex",
      create: "10/05/2023",
      finish: "11/06/2023",
      name: "Fernanda Ribeiro",
      valueType: "por mês",
      locality: "Porto Alegre - RS",
      service: "Pintar minha casa",
      contactName: "Lucas Ferreira",
      isVerified: true,
      title: "Pintar minha casa",
      function: "Pintar minha casa",
      salary: "200000",
      model: "Presencial",
      phone: "1193291233",
      info: "Pintura com acabamento premium para áreas internas.",
      included: "Tinta premium, mão de obra qualificada.",
      notIncluded: "Texturização de paredes, pintura externa.",
      photoUri: "https://randomuser.me/api/portraits/women/7.jpg",
    },
  ];

  const render = ({ item }: { item: any }) => {
      return <ProposalCard item={item}/>
  }

  return (
    <BottomSheetModalProvider>
      <View className="bg-white h-full">
        <Header leftIcon="back" title="Propostas" />
        <ScrollView className="px-4 pt-4">
          <FlatList 
            data={fakeData}
            renderItem={render}
            keyExtractor={(item) => item.id.toString()}
          />
        </ScrollView>
      </View>
    </BottomSheetModalProvider>
  );
}
