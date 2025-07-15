import {
  Building2,
  ChevronRight,
  EllipsisVertical,
  UserRound,
  Building,
  Wrench,
  BookOpen,
  House,
  Monitor,
  Scissors,
  Hammer,
  HeartPulse,
  Shirt,
  GraduationCap,
  CarFront,
  Handshake,
  MonitorSmartphone,
  PartyPopper,
  BadgeCheck,
  Trash,
  CheckCheck,
  Check,
} from "lucide-react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
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
  Image,
  UIManager,
} from "react-native";
import { FONTS } from "~/src/constants/theme";
import ApplyJob from "~/src/hooks/update/job/applyJob";
import { rf } from "~/src/hooks/utils/responsiveFont";
import Mask from "~/src/function/mask";
import { useNavigation } from "@react-navigation/native";
import PeopleInformation from "./Modal/PeopleInformation";
import { Swipeable } from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 120;
const OPTIONS_WIDTH = rf(80);

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Card memoizado
const SwipeableCard = React.memo(function SwipeableCard({
  item,
  onSwipeRight,
  onSwipeLeft,
  isMenuVisible,
  setMenuVisible,
  navigateToCardInformation,
}: any) {
  const [visible, setVisible] = useState<boolean>(false);

  const iconMap: Record<string, JSX.Element> = {
    assistance: <Wrench className="text-zinc-500 mr-1" size={rf(14)} />,
    school: <GraduationCap className="text-zinc-500 mr-1" size={rf(14)} />,
    auto: <CarFront className="text-zinc-500 mr-1" size={rf(14)} />,
    consultancy: <Handshake className="text-zinc-500 mr-1" size={rf(14)} />,
    designTec: (
      <MonitorSmartphone className="text-zinc-500 mr-1" size={rf(14)} />
    ),
    event: <PartyPopper className="text-zinc-500 mr-1" size={rf(14)} />,
    fashion: <Shirt className="text-zinc-500 mr-1" size={rf(14)} />,
    reform: <Hammer className="text-zinc-500 mr-1" size={rf(14)} />,
    health: <HeartPulse className="text-zinc-500 mr-1" size={rf(14)} />,
    domestics: <House className="text-zinc-500 mr-1" size={rf(14)} />,
  };

  const renderIconFromCategoryMap = (categoryObject: Record<string, any>) => {
    if (!categoryObject || typeof categoryObject !== "object") return null;

    return Object.keys(categoryObject).map((key, index) => {
      return (
        <React.Fragment key={index}>
          {iconMap[key] ?? (
            <Building className="text-zinc-500 mr-1" size={rf(14)} />
          )}
        </React.Fragment>
      );
    });
  };

  const renderRightActions = (
    id: number,
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <View className="flex-row">
        <TouchableOpacity
          className="w-20  justify-center items-center"
          onPress={() => {
            setVisible(true);
          }}
        >
          <EllipsisVertical className="text-dark" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = (
    id: number,
    progress: Animated.AnimatedInterpolation<number>
  ) => {
    return (
      <View className="flex-row">
        <TouchableOpacity
          // onPress={() => handleDelete(id)}
          className="w-20 bg-red-500 justify-center items-center"
        >
          <Trash color="#fff" size={24} />
          {/* <Text className="text-white mt-1 text-sm">Apagar</Text> */}
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <>
      <PeopleInformation
        handleSwipeRight={onSwipeRight}
        visible={visible}
        setVisible={setVisible}
        peopleData={item}
      />
      <Swipeable
        key={item.id}
        renderRightActions={(progress) => renderRightActions(item.id, progress)}
        leftThreshold={0}
      >
        <View>
          <TouchableOpacity
            className="px-4 py-2 bg-white border-b border-zinc-300 flex-row items-center justify-between"
            style={styles.card}
            onPress={()=>setVisible(true)}
          >
            <View className="flex-row items-center flex-1">
              <View className="mr-3" style={{ position: "relative" }}>
                {item.picture ? (
                  <Image
                    source={{ uri: item.picture }}
                    style={{ width: rf(43), height: rf(43) }}
                    className="w-12 h-12 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="rounded-full bg-zinc-100 items-center justify-center p-3 w-12 h-12">
                    <UserRound size={rf(25)} />
                  </View>
                )}

                {item.isVerified && (
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
                )}
              </View>

              <View className="pr-2">
                <View className="flex-row items-center ">
                  <Text
                    style={{ ...FONTS.font, fontSize: rf(12) }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.collaborator &&
                      Mask("fullName", item.collaborator.name)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    maxWidth: SCREEN_WIDTH * 0.4,
                  }}
                >
                  {item.collaborator &&
                    renderIconFromCategoryMap(item.collaborator.service)}
                </View>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className="text-zinc-500"
                >
                  {item.collaborator &&
                    item.collaborator.howWork.contract?.join(", ")}
                </Text>
                <Text
                  style={{ ...FONTS.fontSemiBold, fontSize: rf(10) }}
                  className="text-zinc-500"
                >
                  {item.collaborator &&
                    `${item.collaborator.city}, ${item.collaborator.uf}`}
                </Text>
              </View>
            </View>

            {/* Se quiser o ícone de seta de volta: */}
            <View>
              <ChevronRight size={rf(20)} />
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    </>
  );
});

export default function CardPeople({
  data,
  setCards,
  collaborator,
  showPopupMessage,
}: any) {
  const [visibleMenuIds, setVisibleMenuIds] = useState<number[]>([]);
  const navigation = useNavigation();
  const setMenuVisible = useCallback((id: number, visible: boolean) => {
    setVisibleMenuIds((prev) =>
      visible ? [...new Set([...prev, id])] : prev.filter((i) => i !== id)
    );
  }, []);

  const removeCard = (id: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCards((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  const handleSwipeLeft = () => {
    showPopupMessage("Opção Menu selecionada!");
  };

  const handleSwipeRight = async (id: any) => {
    showPopupMessage("Você aplicou para a vaga com sucesso!");
    return;
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

  const navigateToCardInformation = ({ data }: any) => {
    navigation.navigate("CardInformationPeople", {
      cardData: data,
      onSwipeLeft: () => handleSwipeRight(data.id),
    });
  };

  const renderItem = useCallback(
    ({ item }: any) => {
      return (
        <SwipeableCard
          navigateToCardInformation={() =>
            navigateToCardInformation({ data: item })
          }
          item={item.collaborator}
          isMenuVisible={visibleMenuIds.includes(item.id)}
          setMenuVisible={setMenuVisible}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      );
    },
    [visibleMenuIds]
  );

  const fakeData = [
    {
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
    {
      id: 4,
      age: 44,
      name: "Ricardo Almeida",
      phone: "1912345678",
      email: "mario.oliveira@email.com",
      zip_code: "01234-567",
      street: "Rua das Flores",
      district: "Jardim das Rosas",
      city: "São Paulo",
      interests: ["Música", "Tecnologia", "Esportes"],
      service: ["Desenvolvimento Web", "Marketing Digital", "Web Design"],
      category: ["Design e Tecnologia"],
      isVerified: false,
      photoUri: "https://randomuser.me/api/portraits/men/91.jpg",
      birth: "15/11/1990",
      locality: "Curitiba - PR",
      uf: "SP",
      about:
        "Sou desenvolvedor com foco em performance e experiência do usuário. Atuo há 7 anos na área.",
      contact: {
        phone: "+55 41 91234-5678",
        email: "ricardo.webdev@email.com",
        address: "Rua Web, 404, Curitiba - PR",
      },
      workPreferences: {
        location: "Remoto",
        maxDistanceKm: 0,
        allowFurtherDistance: true,
        contractType: ["PJ", "Freelancer"],
        modality: ["Remoto"],
        schedule: ["Dia", "Noite"],
        mobility: [],
        paymentType: ["A combinar"],
      },
      social: {
        linkedin: "https://linkedin.com/in/ricardoalmeida",
        website: "https://ricardodev.com.br",
      },
      personal: {
        pets: [],
        diet: ["Onívoro"],
        loveLanguage: ["Tempo de Qualidade"],
        drinks: ["Sim"],
        smokes: ["Não"],
        education: ["Ensino Superior Completo"],
        communicationType: ["Assertiva"],
        children: ["0"],
        marriage: ["Sim"],
        values: ["Inovação", "Autonomia"],
      },
    },
    {
      id: 5,
      age: 26,
      name: "Fernanda Lima",
      phone: "1912345678",
      email: "mario.oliveira@email.com",
      zip_code: "01234-567",
      street: "Rua das Flores",
      district: "Jardim das Rosas",
      city: "São Paulo",
      interests: ["Música", "Tecnologia", "Esportes"],
      service: ["Manicure e pedicure", "Maquiadores", "Design de sobrancelha"],
      category: ["Moda e Beleza"],
      isVerified: true,
      photoUri: "https://randomuser.me/api/portraits/women/45.jpg",
      birth: "08/03/1987",
      locality: "Salvador - BA",
      uf: "SP",
      about:
        "Sou especialista em beleza feminina, com atendimento em domicílio ou salão parceiro.",
      contact: {
        phone: "+55 71 98765-1234",
        email: "fernanda.beauty@email.com",
        address: "Rua das Flores, 98, Salvador - BA",
      },
      workPreferences: {
        location: "Salvador - BA",
        maxDistanceKm: 15,
        allowFurtherDistance: true,
        contractType: ["Autônomo"],
        modality: ["Presencial"],
        schedule: ["Dia", "Fim de Semana"],
        mobility: ["Moto"],
        paymentType: ["Por hora"],
      },
      social: {
        instagram: "@fernandabeauty",
        tiktok: "https://www.tiktok.com/@fernandabeauty",
      },
      personal: {
        pets: ["Gato"],
        diet: ["Onívoro"],
        loveLanguage: ["Toque Físico"],
        drinks: ["Sim"],
        smokes: ["Não"],
        education: ["Curso Técnico"],
        communicationType: ["Expressiva"],
        children: ["2"],
        marriage: ["Não"],
        values: ["Beleza", "Autoestima"],
      },
    },
    {
      id: 6,
      age: 66,
      name: "Lucas Barbosa",
      service: ["Eletricista", "Instalação de Câmeras"],
      category: ["Reformas e Reparos"],
      isVerified: false,
      phone: "1912345678",
      email: "mario.oliveira@email.com",
      zip_code: "01234-567",
      street: "Rua das Flores",
      district: "Jardim das Rosas",
      city: "São Paulo",
      interests: ["Música", "Tecnologia", "Esportes"],
      uf: "SP",
      // Sem photoUri
      birth: "20/07/1983",
      locality: "Porto Alegre - RS",
      about:
        "Profissional certificado em instalações elétricas com foco em segurança e eficiência.",
      contact: {
        phone: "+55 51 99887-6543",
        email: "lucas.eletricista@email.com",
        address: "Rua dos Cabos, 321, Porto Alegre - RS",
      },
      workPreferences: {
        location: "Porto Alegre - RS",
        maxDistanceKm: 25,
        allowFurtherDistance: true,
        contractType: ["Autônomo"],
        modality: ["Presencial"],
        schedule: ["Dia", "Noite"],
        mobility: ["Carro"],
        paymentType: ["Por serviço"],
      },
      social: {
        facebook: "https://facebook.com/lucaseletricista",
      },
      personal: {
        pets: ["Não"],
        diet: ["Onívoro"],
        loveLanguage: ["Atos de Serviço"],
        drinks: ["Não"],
        smokes: ["Não"],
        education: ["Curso Técnico"],
        communicationType: ["Objetiva"],
        children: ["1"],
        marriage: ["Sim"],
        values: ["Segurança", "Responsabilidade"],
      },
    },
    {
      id: 7,
      age: 26,
      name: "Beatriz Souza",
      service: ["Fotografia", "Edição de Vídeo"],
      category: ["Aulas"],
      phone: "1912345678",
      email: "mario.oliveira@email.com",
      zip_code: "01234-567",
      street: "Rua das Flores",
      district: "Jardim das Rosas",
      city: "São Paulo",
      uf: "SP",
      interests: ["Música", "Tecnologia", "Esportes"],
      isVerified: true,
      photoUri: "https://randomuser.me/api/portraits/women/56.jpg",
      birth: "05/05/1995",
      locality: "Florianópolis - SC",
      about:
        "Fotógrafa profissional especializada em ensaios femininos e eventos sociais.",
      contact: {
        phone: "+55 48 99123-4567",
        email: "beatriz.foto@email.com",
        address: "Av. da Imagem, 55, Florianópolis - SC",
      },
      workPreferences: {
        location: "Florianópolis - SC",
        maxDistanceKm: 10,
        allowFurtherDistance: false,
        contractType: ["Freelancer"],
        modality: ["Presencial"],
        schedule: ["Dia"],
        mobility: ["Carro"],
        paymentType: ["Por serviço"],
      },
      social: {
        instagram: "@beatrizfoto",
        website: "https://beatrizsouzafotografia.com.br",
      },
      personal: {
        pets: ["Gato"],
        diet: ["Vegetariano"],
        loveLanguage: ["Tempo de Qualidade"],
        drinks: ["Não"],
        smokes: ["Não"],
        education: ["Ensino Superior Incompleto"],
        communicationType: ["Empática"],
        children: ["0"],
        marriage: ["Não"],
        values: ["Criatividade", "Liberdade"],
      },
    },
    {
      id: 8,
      age: 35,
      name: "Renato Farias",
      service: ["Motoboy", "Entregas Expressas"],
      category: ["Mecânica e Transportes"],
      isVerified: false,
      phone: "1912345678",
      email: "mario.oliveira@email.com",
      zip_code: "01234-567",
      street: "Rua das Flores",
      district: "Jardim das Rosas",
      city: "São Paulo",
      uf: "SP",
      interests: ["Música", "Tecnologia", "Esportes"],
      // Sem photoUri
      birth: "22/02/1990",
      locality: "Campinas - SP",
      about:
        "Atendo entregas urgentes com rapidez e responsabilidade. Conheço bem a região.",
      contact: {
        phone: "+55 19 98765-4321",
        email: "renato.moto@email.com",
        address: "Rua das Entregas, 88, Campinas - SP",
      },
      workPreferences: {
        location: "Campinas - SP",
        maxDistanceKm: 50,
        allowFurtherDistance: false,
        contractType: ["Autônomo"],
        modality: ["Presencial"],
        schedule: ["Dia", "Noite"],
        mobility: ["Moto"],
        paymentType: ["Por entrega", "A combinar"],
      },
      social: {},
      personal: {
        pets: [],
        diet: ["Onívoro"],
        loveLanguage: ["Atos de Serviço"],
        drinks: ["Sim"],
        smokes: ["Sim"],
        education: ["Ensino Médio Completo"],
        communicationType: ["Direta"],
        children: ["2"],
        marriage: ["Sim"],
        values: ["Rapidez", "Eficiência"],
      },
    },
    {
      id: 9,
      age: 29,
      name: "Larissa Matos",
      service: ["Tradução", "Revisão de Texto"],
      category: ["Aulas"],
      isVerified: true,
      photoUri: "https://randomuser.me/api/portraits/women/34.jpg",
      birth: "30/09/1994",
      locality: "Recife - PE",
      phone: "1912345678",
      email: "mario.oliveira@email.com",
      zip_code: "01234-567",
      street: "Rua das Flores",
      district: "Jardim das Rosas",
      city: "São Paulo",
      uf: "SP",
      interests: ["Música", "Tecnologia", "Esportes"],
      about:
        "Tradutora bilíngue com foco em textos acadêmicos e técnicos. Domínio de inglês e espanhol.",
      contact: {
        phone: "+55 81 99888-1122",
        email: "larissa.tradutora@email.com",
        address: "Rua das Letras, 101, Recife - PE",
      },
      workPreferences: {
        location: "Remoto",
        maxDistanceKm: 0,
        allowFurtherDistance: true,
        contractType: ["Freelancer", "PJ"],
        modality: ["Remoto"],
        schedule: ["Dia"],
        mobility: [],
        paymentType: ["Por palavra", "A combinar"],
      },
      social: {
        linkedin: "https://linkedin.com/in/larissamatos",
      },
      personal: {
        pets: ["Cachorro"],
        diet: ["Vegano"],
        loveLanguage: ["Palavras de Afirmação"],
        drinks: ["Não"],
        smokes: ["Não"],
        education: ["Ensino Superior Completo"],
        communicationType: ["Analítica"],
        children: ["0"],
        marriage: ["Não"],
        values: ["Conhecimento", "Detalhismo"],
      },
    },
    {
      id: 10,
      age: 34,
      name: "Thiago Rocha",
      service: ["DJ", "Sonorização de Eventos"],
      category: ["Eventos"],
      isVerified: false,
      phone: "1912345678",
      email: "mario.oliveira@email.com",
      zip_code: "01234-567",
      street: "Rua das Flores",
      district: "Jardim das Rosas",
      city: "São Paulo",
      uf: "SP",
      interests: ["Música", "Tecnologia", "Esportes"],
      // Sem photoUri
      birth: "18/06/1989",
      locality: "Fortaleza - CE",
      about:
        "Com mais de 12 anos de experiência, levo música e energia para casamentos, formaturas e festas em geral.",
      contact: {
        phone: "+55 85 98765-9988",
        email: "thiago.dj@email.com",
        address: "Rua do Som, 77, Fortaleza - CE",
      },
      workPreferences: {
        location: "Fortaleza - CE",
        maxDistanceKm: 60,
        allowFurtherDistance: true,
        contractType: ["Autônomo"],
        modality: ["Presencial"],
        schedule: ["Noite", "Fim de Semana"],
        mobility: ["Carro"],
        paymentType: ["Por evento"],
      },
      social: {
        instagram: "@thiagodj",
        youtube: "https://www.youtube.com/@thiagodjoficial",
      },
      personal: {
        pets: [],
        diet: ["Onívoro"],
        loveLanguage: ["Qualidade de Tempo"],
        drinks: ["Sim"],
        smokes: ["Sim"],
        education: ["Curso Técnico"],
        communicationType: ["Extrovertida"],
        children: ["1"],
        marriage: ["Sim"],
        values: ["Alegria", "Profissionalismo"],
      },
    },
  ];

  return (
    <View style={styles.container} className="px-4 py-2">
      <FlatList
        data={data}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
      />
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
  tag: {
    backgroundColor: "#fde047",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
    color: "black",
  },
});
