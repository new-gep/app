import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  Animated,
} from "react-native";
import { FONTS, COLORS } from "../../constants/theme";
import Header from "../../layout/Header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import FindAplicateInJob from "~/src/hooks/get/job/findAplicateJob";
import useCollaborator from "~/src/function/fetchCollaborator";
import HeaderStyle4 from "~/src/components/Headers/HeaderStyle4";
const { width, height } = Dimensions.get("window");
import { rf } from "~/src/hooks/utils/responsiveFont";
import { FlatList } from "react-native-gesture-handler";
import Service from "./Card/Service";
import Work from "./Card/Work";
export default function Vacancy() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [jobConected, setJobConected] = useState([]); // Substitua por seus dados reais
  const [isLoading, setIsLoading] = useState(false);
  const [admission, setAdmission] = useState(false);
  const [processAdmission, setProcessAdmission] = useState(false);
  const { collaborator } = useCollaborator();

  const fetchJobs = async () => {
    setIsLoading(true);
    if (collaborator) {
      try {
        const response = await FindAplicateInJob(collaborator.CPF);
        // console.log(response);
        if (response.status !== 200) {
          console.log("Erro ao buscar os cards:", response.message);
          setJobConected([]);
          return;
        }

        const jobs = Array.isArray(response.jobs) ? response.jobs : [];
        setJobConected(jobs);

        if (response.processAdmission) {
          setAdmission(true);
          // setTitleWork("Processo admissional");
          setProcessAdmission(true);
        } else {
          setAdmission(false);
          // setTitleWork("Vagas aplicadas");
        }
      } catch (error) {
        console.error("Erro ao buscar os cards:", error);
        setJobConected([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
    }, [collaborator])
  );

  const filteredJobs = jobConected?.filter((job: any) =>
    job.function.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const renderItem = useCallback(({ item }: any) => {
    return item.typeService === "fix" ? (
      <Work
        item={item}
        navigateToCardInformation={() => {}}
        handleSwipeRight={() => () => {}}
        onSwipeRight={() => {}}
      />
    ) : (
      <Service
        item={item}
        navigateToCardInformation={() => {}}
        handleSwipeRight={() => () => {}}
        onSwipeRight={() => {}}
      />
    );
  }, []);

  return (
    <>
      <HeaderStyle4 title="Serviços" scrollY={scrollY} />
      <View className="flex justify-between items-center h-full bg-white">
        {jobConected && jobConected.length > 0 ? (
          <Animated.ScrollView
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            {/* Search */}
            {jobConected && jobConected.length > 0 && (
              <View className="px-4 mb-5" style={{ paddingTop: 90 }}>
                <TextInput
                  placeholder="Buscar Vaga..."
                  placeholderTextColor="#9CA3AF"
                  className="p-3 border border-gray-300 rounded-lg text-gray-900"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            )}
            {fakeData?.length > 0 ? (
              <FlatList
                data={fakeData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 30 }}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={10}
                removeClippedSubviews={true}
              />
            ) : (
              <View className="py-20 items-center justify-center">
                <Text className="text-lg text-gray-500 font-semibold">
                  Não há uma vaga com este nome
                </Text>
                <Text className="text-gray-400 mt-2 text-center px-8">
                  Tente buscar com outro termo
                </Text>
              </View>
            )}
          </Animated.ScrollView>
        ) : (
          <Animated.ScrollView
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            style={{ width: "100%", paddingTop: 70 }}
            contentContainerStyle={{ alignItems: "center", paddingBottom: 90 }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                ...FONTS.fontSemiBold,
                fontSize: rf(16),
                color: COLORS.title,
                marginBottom: 5,
                marginTop: 40,
              }}
            >
              Sem serviços cadastrados
            </Text>

            <Text
              style={{ fontSize: rf(10), ...FONTS.fontLight }}
              className=" text-gray-400 "
            >
              Não se cadastrou em nenhuma serviço até o momento
            </Text>

            <Image
              source={require("../../assets/images/brand/Business-nojob.png")}
              style={{ width: width * 0.7, height: height * 0.5 }}
              resizeMode="contain"
            />
          </Animated.ScrollView>
        )}
      </View>
    </>
  );
}
