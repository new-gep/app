import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Header from "~/src/layout/Header";
import List from "~/src/components/Menu/List";
import InterestsFilter from "../About/Helper/Interests";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";

export default function Service() {
  const [menu, setMenu] = React.useState<string>("default");
  const navigation = useNavigation<any>();
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

  const renderLists = (itemsArray: any[] ) => {
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
      //   go: "Service",
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
      //   go: "Service",
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
      //   go: "Service",
      option: ["Dança", "Esportes", "Jogos", "Lazer", "Luta"],
    },
    {
      icon: "code_outline",
      title: "Tecnologia",
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
      option: [
        "Alarme automotivo",
        "Ar condicionado",
        "Auto elétrico",
        "Som automotivo",
        "Mecânica Geral"
      ],
    },
    {
      icon: "roller_outline",
      title: "Funilaria e Pintura",
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
      option: ["Insulfilm", "Vidraçaria Automotiva"],
    },
    {
      icon: "carRepair_outline",
      title: "Guincho",
      option: ["Guincho"],
    },
    {
      icon: "box_outline",
      title: "Entregas",
      option: ["Moto", "Carro de passeio", "Fiorino", "Van", "KIA bongo", "HR", "Vuc"],
    },
    {
      icon: "money_outline",
      title: "Vendas",
      option: ["Venda de Automóveis", "Auto Peças"],
    },
  ];
  const consultancy = [
    {
      icon: "camera_outline",
      title: "Mídia",
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
      option: [
        "Advogado",
        "Mediação de Conflitos",
        "Testamento e Planejamento Patrimonial",
      ],
    },
    {
      icon: "user_outline",
      title: "Pessoal",
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
      option: ["Cabeleireiros", "Barbeiros"],
    },
    {
      icon: "shirt_outline",
      title: "Estilo",
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
      option: ["Artesanato", "Esotérico"],
    },
  ];
  const reform = [
    {
      icon: "machine_outline",
      title: "Aluguel de Maquinário",
      option: ["Aluguel de Maquinário"],
    },
    {
      icon: "gardenCart_outline",
      title: "Construção",
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
      option: ["Biomedicina estética", "Remoção de tatuagem"],
    },
    {
      icon: "personInjury_outline",
      title: "Para o Corpo",
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
      option: ["Cuidador de pessoas", "Enfermeira"],
    },
  ];
  const domestics = [
    {
      icon: "house_outline",
      title: "Para a Casa",
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
      option: ["Adestrador de cães", "Passeador de cães", "Serviços para pets"],
    },
  ];

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
        onPress={() => console.log("CONCLUÍDO pressed")}
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
