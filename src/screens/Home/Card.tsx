import {
  Building2,
  Check,
  ChevronRight,
  EllipsisVertical,
  UserRound,
} from "lucide-react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Image,
  Animated,
  FlatList,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { FONTS } from "~/src/constants/theme";
import ApplyJob from "~/src/hooks/update/job/applyJob";
import { rf } from "~/src/hooks/utils/responsiveFont";
import Mask from "~/src/function/mask";
import { useNavigation } from "@react-navigation/native";
import WorkInformation from "./Helper/Modal/WorkInformation";
import PeopleInformation from "./Helper/Modal/ServiceInformation";
import { Swipeable } from "react-native-gesture-handler";
import Apply from "~/src/hooks/update/announcement/apply";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 120;
const OPTIONS_WIDTH = rf(80);

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
// Card Company
const SwipeableCardCompany = React.memo(function SwipeableCard({
  item,
  onSwipeRight,
  navigateToCardInformation,
  handleSwipeRight,
}: any) {
  const [visible, setVisible] = useState<boolean>();

  const renderLeftActions = () => (
    <View className=" justify-center pl-6 flex-1 rounded-lg"></View>
  );

  const renderRightActions = () => (
    <View className="justify-center items-center w-20">
      <TouchableOpacity onPress={() => setVisible(true)}>
        <EllipsisVertical size={rf(25)} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.cardWrapper}>
      <WorkInformation
        jobData={item}
        visible={visible}
        setVisible={setVisible}
        handleSwipeRight={handleSwipeRight}
      />
      <Swipeable
        key={item.id}
        onSwipeableOpen={(direction) => {
          if (direction === "left") {
            handleSwipeRight(item.id);
          }
        }}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions} // <- necessário para permitir o swipe à direita
      >
        <TouchableOpacity
          className="px-4 py-2 bg-white border-b border-zinc-300 flex-row items-center justify-between"
          style={styles.card}
          onPress={navigateToCardInformation}
        >
          <View className="flex-row items-center">
            <View className="mr-3" style={{ position: "relative" }}>
              {item.photoUri ? (
                <Image
                  source={{ uri: item.photoUri }}
                  style={{ width: rf(43), height: rf(43) }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="rounded-full bg-zinc-100 items-center justify-center p-3 w-12 h-12">
                  <Building2 size={rf(25)} />
                </View>
              )}

              {/* {item?.isVerified && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    height: rf(13),
                    width: rf(13),
                  }}
                  className="rounded-full bg-primary items-center justify-center"
                >
                  <Check className="text-dark" size={rf(10)} />
                </View>
              )} */}
            </View>

            <View className="pr-2">
              <Text style={{ ...FONTS.font, fontSize: rf(12) }}>
                {item.function}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-green-600"
              >
                {Mask("amount", item.salary)}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item.model}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item.locality}
              </Text>
            </View>
          </View>
          <View className="mr-3">
            <ChevronRight size={rf(20)} />
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
});

// Card People
const SwipeableCardPeople = React.memo(function SwipeableCard({
  item,
  onSwipeRight,
  onSwipeLeft,
  navigateToCardInformation,
}: any) {
  const [visible, setVisible] = useState<boolean>(false);

  const renderLeftActions = () => (
    <View className=" justify-center pl-6 flex-1 rounded-lg"></View>
  );

  const renderRightActions = () => (
    <View className="justify-center items-center  w-20">
      <TouchableOpacity onPress={() => setVisible(true)}>
        <EllipsisVertical size={rf(25)} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.cardWrapper}>
      <PeopleInformation
        handleSwipeRight={onSwipeRight}
        visible={visible}
        setVisible={setVisible}
        jobData={item}
        peopleData={item}
      />
      <Swipeable
        key={item.id}
        onSwipeableOpen={(direction) => {
          if (direction === "left") {
            onSwipeRight(item.id);
          }
        }}
        // renderRightActions={renderRightActions}

        renderLeftActions={renderLeftActions} // <- necessário para permitir o swipe à direita
      >
        <TouchableOpacity
          className="px-4 py-2 bg-white border-b border-zinc-300 rounded-lg flex-row items-center justify-between"
          style={styles.card}
          onPress={() => setVisible(true)}
        >
          <View className="flex-row items-center flex-1">
            <View className="mr-3" style={{ position: "relative" }}>
              {item.picture && item.picture.status == 200 ? (
                <Image
                  source={{ uri: item.picture.path }}
                  style={{ width: rf(43), height: rf(43) }}
                  className="w-12 h-12 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="rounded-full bg-zinc-100 items-center justify-center p-3 w-12 h-12">
                  <UserRound size={rf(25)} />
                </View>
              )}

              {/* {item?.isVerified && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    height: rf(13),
                    width: rf(13),
                  }}
                  className="rounded-full bg-primary items-center justify-center "
                >
                  <Check className="text-dark" size={rf(10)} />
                </View>
              )} */}
            </View>
            <View className="pr-2">
              <Text
                style={{ ...FONTS.font, fontSize: rf(12) }}
                numberOfLines={1}
                ellipsizeMode="tail"
                className="capitalize"
              >
                {item.title}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-green-600"
              >
                {`${Mask("amount", item.salary)} ${item.typePayment}`}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                {item.category}
              </Text>
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                className="text-zinc-500"
              >
                anunciado {Mask("dateFormatBrazil", item.create_at)}
              </Text>
            </View>
          </View>
          <View className="mr-3">
            <ChevronRight size={rf(20)} />
          </View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
});

export default function CathoStyleCards({
  data,
  setCards,
  collaborator,
  showPopupMessage,
}: any) {
  const fakeData = [
    {
      id: 1,
      typeService: "flex",
      name: "Maria Oliveira",
      valueType: "a combinar",
      locality: "São Paulo - SP",
      service: "Pintar minha casa",
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
      id: 2,
      typeService: "flex",
      name: "Carlos Pereira",
      valueType: "por mês",
      locality: "Rio de Janeiro - RJ",
      service: "Subir parede",
      contactName: "Ana Costa",
      isVerified: false,
      function: "Subir parede",
      salary: "250050",
      model: "Presencial",
      phone: "1193291233",
      info: "Serviço para construção de paredes internas e externas.",
      included: "Mão de obra, nivelamento e acabamento básico.",
      notIncluded: "Materiais como tijolos e cimento, pintura.",
      photoUri: "https://randomuser.me/api/portraits/men/75.jpg",
      gallery: [
        "https://th.bing.com/th/id/R.f9222c5218c4a4aa5699946277d4086f?rik=H2svnZ4cKSAzOw&pid=ImgRaw&r=0",
        "https://institutouniversal.vteximg.com.br/arquivos/ids/157077-1000-1000/image_pedreiro.jpg?v=635369638342530000",
      ],
    },
    {
      id: 3,
      typeService: "flex",
      name: "Ana Souza",
      valueType: "por projeto",
      locality: "Belo Horizonte - MG",
      service: "Fazer um sistema",
      contactName: "Pedro Almeida",
      isVerified: true,
      function: "Fazer um sistema",
      salary: "300075",
      model: "Remoto",
      phone: "1193291233",
      info: "Desenvolvimento de sistema web completo.",
      included: "Levantamento de requisitos, codificação, testes.",
      notIncluded: "Hospedagem, manutenção pós-entrega.",
      photoUri: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
      id: 4,
      typeService: "flex",
      name: "José Lima",
      valueType: "a combinar",
      locality: "Curitiba - PR",
      service: "Limpar minha casa",
      contactName: "Mariana Santos",
      isVerified: false,
      function: "Limpar minha casa",
      salary: "80025",
      model: "Presencial",
      phone: "1193291233",
      info: "Limpeza residencial com produtos básicos.",
      included: "Limpeza de chão, banheiros e superfícies.",
      notIncluded: "Limpeza de vidros externos, organização de armários.",
      photoUri: "https://randomuser.me/api/portraits/men/89.jpg",
    },
    {
      id: 5,
      typeService: "flex",
      name: "Fernanda Ribeiro",
      valueType: "por mês",
      locality: "Porto Alegre - RS",
      service: "Pintar minha casa",
      contactName: "Lucas Ferreira",
      isVerified: true,
      function: "Pintar minha casa",
      salary: "200000",
      model: "Presencial",
      phone: "1193291233",
      info: "Pintura com acabamento premium para áreas internas.",
      included: "Tinta premium, mão de obra qualificada.",
      notIncluded: "Texturização de paredes, pintura externa.",
      photoUri: "https://randomuser.me/api/portraits/women/7.jpg",
    },
    {
      id: 6,
      typeService: "flex",
      name: "Rafael Mendes",
      valueType: "por projeto",
      locality: "Salvador - BA",
      service: "Subir parede",
      contactName: "Camila Oliveira",
      isVerified: false,
      function: "Subir parede",
      salary: "350090",
      model: "Presencial",
      phone: "1193291233",
      info: "Construção de parede de alvenaria com acabamento.",
      included: "Mão de obra, alinhamento e reboco.",
      notIncluded: "Materiais, remoção de entulho.",
    },
    {
      id: 7,
      typeService: "flex",
      name: "Patrícia Gomes",
      valueType: "",
      locality: "Fortaleza - CE",
      service: "Fazer um sistema",
      contactName: "Thiago Pereira",
      isVerified: true,
      function: "Fazer um sistema",
      salary: "a combinar",
      model: "Híbrido",
      phone: "1193291233",
      info: "Desenvolvimento de sistema personalizado conforme demanda.",
      included: "Documentação técnica, deploy inicial.",
      notIncluded: "Suporte contínuo, treinamento da equipe.",
      photoUri: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    {
      id: 8,
      typeService: "flex",
      name: "Luiz Carvalho",
      valueType: "por mês",
      locality: "Manaus - AM",
      service: "Limpar minha casa",
      contactName: "Juliana Lima",
      isVerified: false,
      function: "Limpar minha casa",
      salary: "120060",
      model: "Presencial",
      phone: "1193291233",
      info: "Serviço mensal de limpeza de casa com agendamento fixo.",
      included: "Limpeza geral e troca de lixo.",
      notIncluded: "Lavagem de roupas, passadoria.",
    },
    {
      id: 9,
      typeService: "fix",
      name: "CNPJA TECNOLOGIA LTDA",
      contract: "PJ",
      locality: "São Paulo, São Paulo",
      isVerified: true,
      PCD: true,
      DEI: false,
      function: "Gerente RH Sênior",
      salary: "1000000",
      model: "Híbrido",
      photoUri: "https://robohash.org/TECNOLOGIA?set=set3",
      responsibility:
        "Auxiliar na manutenção e desenvolvimento de aplicações e sistemas. Participar de reuniões de equipe para discutir requisitos e soluções. Contribuir na escrita de códigos limpos e documentados. Realizar testes e garantir a qualidade do software. Apoiar na solução de bugs e problemas técnicos.",
      requirements:
        "Ensino médio completo. Experiência prévia em cozinha será um diferencial. Conhecimento em higiene e segurança alimentar. Habilidade para trabalhar em equipe e sob pressão.",
      skills: ["Adaptabilidade", "Banco de dados", "Flexibilidade"],
      benefits: ["VT", "VA", "Gympass", "Auxilio Creche", "Day Off"],
    },
    {
      id: 10,
      typeService: "fix",
      name: "CNPJA TECNOLOGIA LTDA",
      contract: "CLT",
      PCD: true,
      DEI: true,
      locality: "São Paulo, São Paulo",
      isVerified: false,
      function: "Gerente RH",
      salary: "450789",
      model: "Remoto",
      phone: "11932291233",
      responsibility:
        "Gerenciar o departamento de Recursos Humanos. Supervisionar o processo de recrutamento e seleção. Desenvolver e implementar políticas de RH. Treinar líderes e garantir conformidade com legislações trabalhistas.",
      requirements:
        "Gestão de RH, suporte a líderes, desenvolvimento de políticas.",
      notIncluded:
        "Consultoria jurídica externa, atividades de outras áreas como TI ou Financeiro.",
    },
    {
      id: 11,
      typeService: "fix",
      name: "Ortiz‑O'Brien Group",
      contract: "PJ",
      locality: "Rio de Janeiro, Rio de Janeiro",
      isVerified: true,
      PCD: false,
      DEI: true,
      function: "Analista de Dados",
      salary: "850000",
      model: "Híbrido",
      photoUri: "https://robohash.org/OrtizOBrien?set=set3",
      responsibility:
        "Extrair, processar e analisar dados para gerar insights de negócio. Criar dashboards e relatórios. Trabalhar com SQL, Python e ferramentas BI.",
      requirements:
        "Graduação em Estatística, Ciência da Computação ou áreas afins. Experiência com SQL, Python e Power BI.",
      skills: ["SQL", "Python", "Visualização de dados"],
      benefits: ["VT", "VA", "Home Office", "Seguro Saúde"],
    },
    {
      id: 12,
      typeService: "fix",
      name: "McLaughlin LLC",
      contract: "CLT",
      locality: "Curitiba, Paraná",
      isVerified: false,
      PCD: true,
      DEI: false,
      function: "Desenvolvedor Front-End",
      salary: "720000",
      model: "Remoto",
      phone: "4132123344",
      responsibility:
        "Desenvolver interfaces web responsivas usando React e TypeScript. Colaborar com UX/UI em prototipação e testes de usabilidade.",
      requirements:
        "Experiência mínima de 2 anos com React, TypeScript e CSS moderno.",
      skills: ["React", "TypeScript", "CSS"],
      benefits: ["VT", "VA", "Cursos online", "Plano Odontológico"],
    },
    {
      id: 13,
      typeService: "fix",
      name: "Weber, Hayes and VonRueden",
      contract: "PJ",
      locality: "Belo Horizonte, Minas Gerais",
      isVerified: true,
      PCD: false,
      DEI: false,
      function: "Engenheiro de DevOps",
      salary: "980000",
      model: "Híbrido",
      photoUri: "https://robohash.org/WeberHayesVonRueden?set=set3",
      responsibility:
        "Planejar, implementar e manter pipelines CI/CD. Garantir alta disponibilidade usando Docker, Kubernetes e AWS.",
      requirements:
        "Experiência com infraestrutura em nuvem (AWS ou GCP). Automação, containers e orquestração.",
      skills: ["Docker", "Kubernetes", "AWS"],
      benefits: ["VT", "VA", "Vale Cultura", "Seguro de Vida"],
    },
  ];
  // const [cards, setCards] = useState<any>(data);
  const navigation = useNavigation();

  const removeCard = (id: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCards((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  const handleSwipeRight = async (id: any) => {
    if (!collaborator) {
      showPopupMessage("Você precisa estar logado para aplicar!");
      return;
    }

    try {
      const response = await ApplyJob(id, collaborator?.CPF);
      if (response.status === 200) {
        removeCard(id);
        showPopupMessage("Você aplicou para a vaga com sucesso!");
      } else if (response.status === 400) {
        removeCard(id);
        showPopupMessage("Você já aplicou para essa vaga!");
      } else {
        showPopupMessage("Erro ao aplicar para a vaga!");
      }
    } catch (error) {
      showPopupMessage("Erro ao aplicar para a vaga!");
    }
  };

  const handleSwipeRightPeople = async (id: any) => {
    if (!collaborator) {
      showPopupMessage("Você precisa estar logado para aplicar!");
      return;
    }
    const response = await Apply(id, collaborator.CPF);
    if (response.status === 200) {
      removeCard(id);
      showPopupMessage("Você aplicou ao serviço com sucesso!");
    } else if (response.status === 400) {
      removeCard(id);
      showPopupMessage("Você já aplicou para esse serviço!");
    } else {
      showPopupMessage("Erro ao aplicar para o serviço!");
    }
  };

  const navigateToCardInformation = ({ data }: any) => {
    navigation.navigate("CardInformation", {
      cardData: data,
      onSwipeLeft: () => handleSwipeRight(data.id),
    });
  };

  const navigateToCardInformationPeople = ({ data }: any) => {
    navigation.navigate("CardInformationPeople", {
      cardData: data,
      onSwipeLeft: () => handleSwipeRight(data.id),
    });
  };

  const renderItem = useCallback(({ item }: any) => {
    return item.typeService === "fix" ? (
      <SwipeableCardCompany
        navigateToCardInformation={() =>
          navigateToCardInformation({ data: item })
        }
        item={item}
        handleSwipeRight={() => handleSwipeRight(item.id)}
        onSwipeRight={handleSwipeRight}
      />
    ) : (
      <SwipeableCardPeople
        navigateToCardInformation={() =>
          navigateToCardInformationPeople({ data: item })
        }
        item={item}
        handleSwipeRight={() => handleSwipeRightPeople(item.id)}
        onSwipeRight={handleSwipeRightPeople}
      />
    );
  }, []);

  return (
    <View style={styles.container} className="px-4 py-2">
      {Array.isArray(data) && data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
          removeClippedSubviews={true}
        />
      ) : (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <Text style={{ fontSize: rf(16), color: "gray" }}>
            Nenhum trabalho ou serviço encontrado.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cardWrapper: {
    position: "relative",
    width: SCREEN_WIDTH - rf(30),
    minHeight: rf(20),
  },
  cardContainer: {
    width: SCREEN_WIDTH - rf(32),
    minHeight: rf(20),
    overflow: "visible",
  },
  card: {
    width: "100%",
    minHeight: rf(80),
    overflow: "visible",
  },
});
