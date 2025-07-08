import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import Header from "~/src/layout/Header";
import List from "~/src/components/Menu/List";
import InterestsFilter from "../About/Helper/Interests";
import useCollaborator from "~/src/function/fetchCollaborator";
import UpdateCollaborator from "~/src/hooks/update/collaborator";

export default function Service() {
  const navigation = useNavigation<any>();
  const [menu, setMenu] = useState<string>("default");
  const { collaborator, updateCollaborator } = useCollaborator();
  // Assistance
  const [electronics, setElectronics] = useState<any>([]);
  const [homeAppliances, setHomeAppliances] = useState<any>([]);
  const [itAndTelephony, setItAndTelephony] = useState<any>([]);
  // School
  const [academic, setAcademic] = useState<any>([]);
  const [artsEntertainment, setArtsEntertainment] = useState<any>([]);
  const [sports, setSports] = useState<any>([]);
  const [technology, setTechnology] = useState<any>([]);
  // Auto
  const [mechanics, setMechanics] = useState<any>([]);
  const [bodyworkPainting, setBodyworkPainting] = useState<any>([]);
  const [autoGlass, setAutoGlass] = useState<any>([]);
  const [towTruck, setTowTruck] = useState<any>([]);
  const [deliveries, setDeliveries] = useState<any>([]);
  const [autoSales, setAutoSales] = useState<any>([]);
  // Consultancy
  const [media, setMedia] = useState<any>([]);
  const [business, setBusiness] = useState<any>([]);
  const [legal, setLegal] = useState<any>([]);
  const [personal, setPersonal] = useState<any>([]);
  // DesignTec
  const [techDesign, setTechDesign] = useState<any>([]);
  const [graphicDesign, setGraphicDesign] = useState<any>([]);
  const [audioVisual, setAudioVisual] = useState<any>([]);
  // Event
  const [teamSupport, setTeamSupport] = useState<any>([]);
  const [foodDrinks, setFoodDrinks] = useState<any>([]);
  const [musicEntertainment, setMusicEntertainment] = useState<any>([]);
  const [complementaryServices, setComplementaryServices] = useState<any>([]);
  // Fashion
  const [beauty, setBeauty] = useState<any>([]);
  const [hair, setHair] = useState<any>([]);
  const [style, setStyle] = useState<any>([]);
  const [artsMagic, setArtsMagic] = useState<any>([]);
  // Reform
  const [machineryRental, setMachineryRental] = useState<any>([]);
  const [construction, setConstruction] = useState<any>([]);
  const [installation, setInstallation] = useState<any>([]);
  const [repairs, setRepairs] = useState<any>([]);
  const [generalServices, setGeneralServices] = useState<any>([]);
  const [forHome, setForHome] = useState<any>([]);
  // Health
  const [biomedicine, setBiomedicine] = useState<any>([]);
  const [bodyCare, setBodyCare] = useState<any>([]);
  const [mindCare, setMindCare] = useState<any>([]);
  const [familyCare, setFamilyCare] = useState<any>([]);
  // Domestics
  const [domesticHome, setDomesticHome] = useState<any>([]);
  const [domesticFamily, setDomesticFamily] = useState<any>([]);
  const [pets, setPets] = useState<any>([]);

  const handleSave = async () => {
    if (!collaborator) return;
    const data = {
      assistance: {
        electronics: electronics,
        homeAppliances: homeAppliances,
        itAndTelephony: itAndTelephony,
      },
      school: {
        academic: academic,
        artsEntertainment: artsEntertainment,
        sports: sports,
        technology: technology,
      },
      auto: {
        mechanics: mechanics,
        bodyworkPainting: bodyworkPainting,
        autoGlass: autoGlass,
        towTruck: towTruck,
        deliveries: deliveries,
        autoSales: autoSales,
      },
      consultancy: {
        media: media,
        business: business,
        legal: legal,
        personal: personal,
      },
      designTec: {
        techDesign: techDesign,
        graphicDesign: graphicDesign,
        audioVisual: audioVisual,
      },
      event: {
        teamSupport: teamSupport,
        foodDrinks: foodDrinks,
        musicEntertainment: musicEntertainment,
        complementaryServices: complementaryServices,
      },
      fashion: {
        beauty: beauty,
        hair: hair,
        style: style,
        artsMagic: artsMagic,
      },
      reform: {
        machineryRental: machineryRental,
        construction: construction,
        installation: installation,
        repairs: repairs,
        generalServices: generalServices,
        forHome: forHome,
      },
      health: {
        biomedicine: biomedicine,
        bodyCare: bodyCare,
        mindCare: mindCare,
        familyCare: familyCare,
      },
      domestics: {
        domesticHome: domesticHome,
        domesticFamily: domesticFamily,
        pets: pets,
      },
    };
    const response = await UpdateCollaborator(collaborator.CPF, {
      service: data,
    });
    if (response.status == 200) {
      updateCollaborator(collaborator.CPF);
      Alert.alert("Sucesso", "Serviços atualizado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
      return;
    }
    Alert.alert("Falha", "Não foi possível atualizar os serviços!", [
      {
        text: "OK",
      },
    ]);
  };

  const changeMenu = (option: string) => {
    if (option === "default") {
      navigation.goBack();
      return;
    }
    if (option === menu) {
      setMenu("default");
      return;
    }
    setMenu(option);
  };

  const renderLists = (itemsArray: any[]) => {
    return (
      <View style={Style.container} className="bg-white rounded-lg p-4 mb-4">
        {itemsArray.map((item: any, index: number) => {
          const isLast = index === itemsArray.length - 1;
          return (
            <React.Fragment key={index}>
              <InterestsFilter
                border={!isLast} // se for último, border = false; caso contrário true
                title={item.title}
                icon={item.icon}
                options={item.option}
                onSelect={item.setSelect}
                selected={item.select}
              />
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  const services = [
    {
      icon: "build_outline",
      title: "Assistência Técnica",
      action: () => changeMenu("service"),
    },
    {
      icon: "school_outline",
      title: "Aulas",
      action: () => changeMenu("school"),
    },
    {
      icon: "car_outline",
      title: "Mecânica e Transportes",
      action: () => changeMenu("autos"),
    },
    {
      icon: "handShake_outline",
      title: "Consultoria",
      action: () => changeMenu("handShake"),
    },
    {
      icon: "computer_outline",
      title: "Design e Tecnologia",
      action: () => changeMenu("computer"),
    },
    {
      icon: "celebration_outline",
      title: "Eventos",
      action: () => changeMenu("event"),
    },
    {
      icon: "styler_outline",
      title: "Moda e Beleza",
      action: () => changeMenu("styler"),
    },
    {
      icon: "tools_outline",
      title: "Reformas e Reparos",
      action: () => changeMenu("reform"),
    },
    {
      icon: "health_outline",
      title: "Saúde",
      action: () => changeMenu("health"),
    },
    {
      icon: "house_outline",
      title: "Serviços Domésticos",
      action: () => changeMenu("house"),
    },
  ];
  const assistance = [
    {
      icon: "radio_outline",
      title: "Aparelhos Eletrônicos",
      setSelect: setElectronics,
      select: electronics,
      option: [
        "Aparelho de Som",
        "Aquecedor a Gás",
        "Ar Condicionado",
        "Câmera",
        "DVD / Blu-Ray",
        "Home Theater",
        "Televisão",
        "Video Game",
      ],
    },
    {
      icon: "kitchen_outline",
      title: "Eletrodomésticos",
      setSelect: setHomeAppliances,
      select: homeAppliances,
      option: [
        "Adega Climatizada",
        "Fogão e Cooktop",
        "Geladeira e Freezer",
        "Lava Louça",
        "Máquina de Costura",
        "Máquina de Lavar",
        "Microondas",
        "Secadora de Roupas",
      ],
    },
    {
      icon: "deskPhone_outline",
      title: "Informática e Telefonia",
      setSelect: setItAndTelephony,
      select: itAndTelephony,
      option: [
        "Cabeamento e Redes",
        "Celular",
        "Computador Desktop",
        "Fone de Ouvido",
        "Impressora",
        "Notebook",
        "Tablet",
        "Telefone Fixo",
        "Telefonia PABX",
      ],
    },
  ];
  const school = [
    {
      icon: "book2_outline",
      title: "Acadêmicos",
      setSelect: setAcademic,
      select: academic,
      option: [
        "Concursos",
        "Escolares e Reforço",
        "Educação Especial",
        "Ensino Superior",
        "Ensino Profissionalizante",
        "Idiomas",
        "Moda",
        "Pré-Vestibular",
        "Saúde",
        "Tarefas",
      ],
    },
    {
      icon: "theater_outline",
      title: "Artes e Entretenimento",
      setSelect: setArtsEntertainment,
      select: artsEntertainment,
      option: [
        "Artes",
        "Artesanato",
        "Beleza",
        "Bem-Estar",
        "Circo",
        "Fotografia",
        "Moda",
        "Música",
        "Paisagismo",
        "TV e Teatro",
      ],
    },
    {
      icon: "soccer_outline",
      title: "Esportes",
      setSelect: setSports,
      select: sports,
      option: ["Dança", "Esportes", "Jogos", "Lazer", "Luta"],
    },
    {
      icon: "code_outline",
      title: "Tecnologia",
      setSelect: setTechnology,
      select: technology,
      option: [
        "Desenvolvimento Web",
        "Esportes Eletrônicos",
        "Informática",
        "Marketing Digital",
      ],
    },
  ];
  const auto = [
    {
      icon: "build_outline",
      title: "Mecânica",
      setSelect: setMechanics,
      select: mechanics,
      option: [
        "Alarme automotivo",
        "Ar condicionado",
        "Auto elétrico",
        "Som automotivo",
        "Mecânica Geral",
      ],
    },
    {
      icon: "roller_outline",
      title: "Funilaria e Pintura",
      setSelect: setBodyworkPainting,
      select: bodyworkPainting,
      option: [
        "Funilaria",
        "Higienização e Polimento",
        "Martelinho de Ouro",
        "Pintura",
      ],
    },
    {
      icon: "glassBroken_outline",
      title: "Vidraçaria Automotiva",
      setSelect: setAutoGlass,
      select: autoGlass,
      option: ["Insulfilm", "Vidraçaria Automotiva"],
    },
    {
      icon: "carRepair_outline",
      title: "Guincho",
      setSelect: setTowTruck,
      select: towTruck,
      option: ["Guincho"],
    },
    {
      icon: "box_outline",
      title: "Entregas",
      setSelect: setDeliveries,
      select: deliveries,
      option: [
        "Moto",
        "Carro de passeio",
        "Fiorino",
        "Van",
        "KIA bongo",
        "HR",
        "Vuc",
      ],
    },
    {
      icon: "money_outline",
      title: "Vendas",
      setSelect: setAutoSales,
      select: autoSales,
      option: ["Venda de Automóveis", "Auto Peças"],
    },
  ];
  const consultancy = [
    {
      icon: "camera_outline",
      title: "Mídia",
      setSelect: setMedia,
      select: media,
      option: [
        "Assessoria de Imprensa",
        "Escrita e Conteúdo",
        "Pesquisa em Geral",
        "Produção de Conteúdo",
        "Tradutores",
      ],
    },
    {
      icon: "paid_outline",
      title: "Negócios",
      setSelect: setBusiness,
      select: business,
      option: [
        "Administração de Imóveis",
        "Assessor de Investimentos",
        "Auxílio administrativo",
        "Contador",
        "Corretor",
        "Despachante",
        "Economia e Finanças",
        "Digitalizar documentos",
        "Recrutamento e Seleção",
        "Segurança do trabalho",
      ],
    },
    {
      icon: "balance_outline",
      title: "Jurídico",
      setSelect: setLegal,
      select: legal,
      option: [
        "Advogado",
        "Mediação de Conflitos",
        "Testamento e Planejamento Patrimonial",
      ],
    },
    {
      icon: "user_outline",
      title: "Pessoal",
      setSelect: setPersonal,
      select: personal,
      option: [
        "Consultor pessoal",
        "Consultoria especializada",
        "Guia de Turismo",
      ],
    },
  ];
  const designTec = [
    {
      icon: "code_outline",
      title: "Tecnologia",
      setSelect: setTechDesign,
      select: techDesign,
      option: [
        "Apps para smartphone",
        "Desenvolvimento de games",
        "Desenvolvimento de sites",
        "Marketing digital",
        "UI design",
      ],
    },
    {
      icon: "image_outline",
      title: "Gráfica",
      setSelect: setGraphicDesign,
      select: graphicDesign,
      option: [
        "Convites",
        "Criação de logos",
        "Diagramador",
        "Materiais promocionais",
        "Produção gráfica",
      ],
    },
    {
      icon: "stockMedia_outline",
      title: "Áudio / Visual",
      setSelect: setAudioVisual,
      select: audioVisual,
      option: [
        "Animação motion",
        "Áudio e Vídeo",
        "Edição de fotos",
        "Fotografia",
        "Ilustração",
        "Modelagem 2D e 3D",
        "Restauração de Fotos",
        "Web Design",
      ],
    },
  ];
  const event = [
    {
      icon: "groups_outline",
      title: "Equipe e Suporte",
      setSelect: setTeamSupport,
      select: teamSupport,
      option: [
        "Assessor de eventos",
        "Carros de casamento",
        "Celebrantes",
        "Equipamento para festas",
        "Garçons e copeiras",
        "Local para eventos",
        "Manobrista",
        "Organização de Eventos",
        "Recepcionista",
        "Seguranças",
      ],
    },
    {
      icon: "chef_outline",
      title: "Comes e bebes",
      setSelect: setFoodDrinks,
      select: foodDrinks,
      option: [
        "Bartender",
        "Buffet completo",
        "Chocolateiro",
        "Churrasqueiro",
        "Confeiteira",
      ],
    },
    {
      icon: "note_outline",
      title: "Música e animação",
      setSelect: setMusicEntertainment,
      select: musicEntertainment,
      option: [
        "Animação de festas",
        "Bandas e cantores",
        "DJs",
        "Ônibus Balada",
      ],
    },
    {
      icon: "add_outline",
      title: "Serviços Complementares",
      setSelect: setComplementaryServices,
      select: complementaryServices,
      option: [
        "Brindes e lembrancinhas",
        "Convites",
        "Decoração",
        "Edição de vídeos",
        "Fotografia",
        "Florista",
      ],
    },
  ];
  const fashion = [
    {
      icon: "makeup_outline",
      title: "Beleza",
      setSelect: setBeauty,
      select: beauty,
      option: [
        "Bronzeamento",
        "Depilação",
        "Design de sobrancelha",
        "Design de cílios",
        "Manicure e pedicure",
        "Maquiadores",
        "Micropigmentação",
        "Podólogo",
        "Alfaiate",
      ],
    },
    {
      icon: "selfCare_outline",
      title: "Cabelo",
      setSelect: setHair,
      select: hair,
      option: ["Cabeleireiros", "Barbeiros"],
    },
    {
      icon: "shirt_outline",
      title: "Estilo",
      setSelect: setStyle,
      select: style,
      option: [
        "Alfaiate",
        "Corte e costura",
        "Personal stylist",
        "Sapateiro",
        "Visagista",
      ],
    },
    {
      icon: "star_outline",
      title: "Artes e Magia",
      setSelect: setArtsMagic,
      select: artsMagic,
      option: ["Artesanato", "Esotérico"],
    },
  ];
  const reform = [
    {
      icon: "machine_outline",
      title: "Aluguel de Maquinário",
      setSelect: setMachineryRental,
      select: machineryRental,
      option: ["Aluguel de Maquinário"],
    },
    {
      icon: "gardenCart_outline",
      title: "Construção",
      setSelect: setConstruction,
      select: construction,
      option: [
        "Arquitetos",
        "Design de Interiores",
        "Empreiteiro",
        "Engenheiro",
        "Limpeza pós obra",
        "Marmorarias e Granitos",
        "Pedreiro",
        "Poço Artesiano",
        "Remoção de Entulho",
      ],
    },
    {
      icon: "engineering_outline",
      title: "Instalação",
      setSelect: setInstallation,
      select: installation,
      option: [
        "Antenista",
        "Automação residencial",
        "Instalação de eletrônicos",
        "Instalador tv digital",
        "Segurança eletrônica",
        "Toldo e coberturas",
      ],
    },
    {
      icon: "build_outline",
      title: "Reformas e Reparos",
      setSelect: setRepairs,
      select: repairs,
      option: [
        "Encanador",
        "Eletricista",
        "Gás",
        "Gesso e drywall",
        "Pavimentação",
        "Pintor",
        "Serralheria e solda",
        "Vidraceiro",
      ],
    },
    {
      icon: "boxRepair_outline",
      title: "Serviços Gerais",
      setSelect: setGeneralServices,
      select: generalServices,
      option: [
        "Chaveiro",
        "Dedetizador",
        "Desentupidor",
        "Desinfecção",
        "Impermeabilizador",
        "Marceneiro",
        "Marido de aluguel",
        "Mudanças e carretos",
        "Tapeceiro",
      ],
    },
    {
      icon: "house_outline",
      title: "Para Casa",
      setSelect: setForHome,
      select: forHome,
      option: [
        "Banheira",
        "Coifas e exaustores",
        "Decorador",
        "Instalador de papel de parede",
        "Jardinagem",
        "Montador de móveis",
        "Paisagista",
        "Piscina",
        "Redes de proteção",
      ],
    },
  ];
  const health = [
    {
      icon: "vaccine_outline",
      title: "Biomedicina Estética",
      setSelect: setBiomedicine,
      select: biomedicine,
      option: ["Biomedicina estética", "Remoção de tatuagem"],
    },
    {
      icon: "personInjury_outline",
      title: "Para o Corpo",
      setSelect: setBodyCare,
      select: bodyCare,
      option: [
        "Cozinheira",
        "Dentista",
        "Fisioterapeuta",
        "Fonoaudiólogo",
        "Médico",
        "Nutricionista",
        "Quiropraxia",
        "Terapias alternativas",
        "Terapia ocupacional",
      ],
    },
    {
      icon: "brain_outline",
      title: "Para a Mente",
      setSelect: setMindCare,
      select: mindCare,
      option: [
        "Aconselhamento conjugal e familiar",
        "Coach",
        "Doula",
        "Psicanalista",
        "Psicólogo",
      ],
    },
    {
      icon: "family_outline",
      title: "Para a família",
      setSelect: setFamilyCare,
      select: familyCare,
      option: ["Cuidador de pessoas", "Enfermeira"],
    },
  ];
  const domestics = [
    {
      icon: "house_outline",
      title: "Para a Casa",
      setSelect: setDomesticHome,
      select: domesticHome,
      option: [
        "Diarista",
        "Limpeza de piscina",
        "Passadeira",
        "Tapaceiro",
        "Lavadeira",
        "Personal shopper",
      ],
    },
    {
      icon: "family_outline",
      title: "Para a Família",
      setSelect: setDomesticFamily,
      select: domesticFamily,
      option: [
        "Babá",
        "Cozinheira",
        "Entregador",
        "Motorista",
        "Personal Organizer",
        "Segurança Particular",
      ],
    },
    {
      icon: "pet_outline",
      title: "Para os Pets",
      setSelect: setPets,
      select: pets,
      option: ["Adestrador de cães", "Passeador de cães", "Serviços para pets"],
    },
  ];

  useEffect(() => {
    if (collaborator && collaborator.service) {

      // assistance
      setElectronics(
        collaborator.service.assistance.electronics
          ? collaborator.service.assistance.electronics
          : []
      );
      setHomeAppliances(
        collaborator.service.assistance.homeAppliances
          ? collaborator.service.assistance.homeAppliances
          : []
      );
      setItAndTelephony(
        collaborator.service.assistance.itAndTelephony
          ? collaborator.service.assistance.itAndTelephony
          : []
      );
      // school
      setAcademic(
        collaborator.service.school.academic
          ? collaborator.service.school.academic
          : []
      );
      setArtsEntertainment(
        collaborator.service.school.artsEntertainment
          ? collaborator.service.school.artsEntertainment
          : []
      );
      setSports(
        collaborator.service.school.sports
          ? collaborator.service.school.sports
          : []
      );
      setTechnology(
        collaborator.service.school.technology
          ? collaborator.service.school.technology
          : []
      );
      // auto
      setMechanics(
        collaborator.service.auto.mechanics
          ? collaborator.service.auto.mechanics
          : []
      );
      setBodyworkPainting(
        collaborator.service.auto.bodyworkPainting
          ? collaborator.service.auto.bodyworkPainting
          : []
      );
      setAutoGlass(
        collaborator.service.auto.autoGlass
          ? collaborator.service.auto.autoGlass
          : []
      );
      setTowTruck(
        collaborator.service.auto.towTruck
          ? collaborator.service.auto.towTruck
          : []
      );
      setDeliveries(
        collaborator.service.auto.deliveries
          ? collaborator.service.auto.deliveries
          : []
      );
      setAutoSales(
        collaborator.service.auto.autoSales
          ? collaborator.service.auto.autoSales
          : []
      );
      // consultancy
      setMedia(
        collaborator.service.consultancy.media
          ? collaborator.service.consultancy.media
          : []
      );
      setBusiness(
        collaborator.service.consultancy.business
          ? collaborator.service.consultancy.business
          : []
      );
      setLegal(
        collaborator.service.consultancy.legal
          ? collaborator.service.consultancy.legal
          : []
      );
      setPersonal(
        collaborator.service.consultancy.personal
          ? collaborator.service.consultancy.personal
          : []
      );
      // DesignTec
      setTechDesign(
        collaborator.service.designTec.techDesign
          ? collaborator.service.designTec.techDesign
          : []
      );
      setGraphicDesign(
        collaborator.service.designTec.graphicDesign
          ? collaborator.service.designTec.graphicDesign
          : []
      );
      setAudioVisual(
        collaborator.service.designTec.audioVisual
          ? collaborator.service.designTec.audioVisual
          : []
      );
      // Event
      setTeamSupport(
        collaborator.service.event.teamSupport
          ? collaborator.service.event.teamSupport
          : []
      );
      setFoodDrinks(
        collaborator.service.event.foodDrinks
          ? collaborator.service.event.foodDrinks
          : []
      );
      setMusicEntertainment(
        collaborator.service.event.musicEntertainment
          ? collaborator.service.event.musicEntertainment
          : []
      );
      setComplementaryServices(
        collaborator.service.event.complementaryServices
          ? collaborator.service.event.complementaryServices
          : []
      );
      // Fashion
      setBeauty(
        collaborator.service.fashion.beauty
          ? collaborator.service.fashion.beauty
          : []
      );
      setHair(
        collaborator.service.fashion.hair
          ? collaborator.service.fashion.hair
          : []
      );
      setStyle(
        collaborator.service.fashion.style
          ? collaborator.service.fashion.style
          : []
      );
      setArtsMagic(
        collaborator.service.fashion.artsMagic
          ? collaborator.service.fashion.artsMagic
          : []
      );
      // Reform
      setMachineryRental(
        collaborator.service.reform.machineryRental
          ? collaborator.service.reform.machineryRental
          : []
      );
      setConstruction(
        collaborator.service.reform.construction
          ? collaborator.service.reform.construction
          : []
      );
      setInstallation(
        collaborator.service.reform.installation
          ? collaborator.service.reform.installation
          : []
      );
      setRepairs(
        collaborator.service.reform.repairs
          ? collaborator.service.reform.repairs
          : []
      );
      setGeneralServices(
        collaborator.service.reform.generalServices
          ? collaborator.service.reform.generalServices
          : []
      );
      setForHome(
        collaborator.service.reform.forHome
          ? collaborator.service.reform.forHome
          : []
      );
      // Health
      setBiomedicine(
        collaborator.service.health.biomedicine
          ? collaborator.service.health.biomedicine
          : []
      );
      setBodyCare(
        collaborator.service.health.bodyCare
          ? collaborator.service.health.bodyCare
          : []
      );
      setMindCare(
        collaborator.service.health.mindCare
          ? collaborator.service.health.mindCare
          : []
      );
      setFamilyCare(
        collaborator.service.health.familyCare
          ? collaborator.service.health.familyCare
          : []
      );
      // Domestics
      setDomesticHome(
        collaborator.service.domestics.domesticHome
          ? collaborator.service.domestics.domesticHome
          : []
      );
      setDomesticFamily(
        collaborator.service.domestics.domesticFamily
          ? collaborator.service.domestics.domesticFamily
          : []
      );
      setPets(
        collaborator.service.domestics.pets
          ? collaborator.service.domestics.pets
          : []
      );
    }
  }, [collaborator]);

  return (
    <View className="bg-white h-full">
      <Header
        title="Meu Serviço"
        leftAction={() => changeMenu(menu)}
        leftIcon={"back"}
      />
      <ScrollView
        className="p-6"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100, // garante espaço no fim
        }}
      >
        {menu === "default" ? (
          <List items={services} />
        ) : menu === "service" ? (
          renderLists(assistance)
        ) : menu === "school" ? (
          renderLists(school)
        ) : menu === "autos" ? (
          renderLists(auto)
        ) : menu === "handShake" ? (
          renderLists(consultancy)
        ) : menu === "computer" ? (
          renderLists(designTec)
        ) : menu === "event" ? (
          renderLists(event)
        ) : menu === "styler" ? (
          renderLists(fashion)
        ) : menu === "reform" ? (
          renderLists(reform)
        ) : menu === "health" ? (
          renderLists(health)
        ) : menu === "house" ? (
          renderLists(domestics)
        ) : null}
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
    </View>
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
