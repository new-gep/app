import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import Header from "~/src/layout/Header";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ScrollView, FlatList, Pressable } from "react-native-gesture-handler";
import Work from "./Card/Work";
import useCollaborator from "~/src/function/fetchCollaborator";
import HistoryJob from "~/src/hooks/get/job/history";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { IMAGES } from "~/src/constants/Images";
import AwaitFetch from "~/src/components/LoadScreen/Load";

export default function History() {
  const fakeData = [
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
  const { collaborator } = useCollaborator();
  const [historyData, setHistoryData] = useState<any[]>([]);
  const { width, height } = Dimensions.get("window");
  const [loader, setLoader] = useState<boolean>(true);

  const render = ({ item }: { item: any }) => {
    return <Work item={item} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try{
        if (collaborator) {
          const history = await HistoryJob(collaborator.CPF);
          if (history.status == 200) {
            setHistoryData(history.data);
          }
        }
      }finally{
        setLoader(false);
      }
    };
    fetchData();
  }, [collaborator]);

  return (
    <BottomSheetModalProvider>
      <View className="bg-white h-full">
        <Header leftIcon="back" title="Histórico" />
        <ScrollView className="px-4 pt-4">
          { historyData.length > 0 ? (
            loader ?
             <AwaitFetch />
            :
            <FlatList
              data={historyData}
              renderItem={render}
            />
          ) : (
            <View className="items-center justify-center h-full ">
              <Image
                source={IMAGES.unique28}
                style={{
                  height: height * 0.4,
                  width: width * 0.8,
                  resizeMode: "contain",
                  opacity: 0.8,
                }}
              />
              <Text
                style={{ ...FONTS.fontSemiBold, fontSize: rf(13) }}
                className=""
              >
                Nenhum histórico encontrado!
              </Text>
              <Text
                style={{ ...FONTS.fontLight, fontSize: rf(11) }}
                className="text-center"
              >
                Fique tranquilo, em breve seus serviços estarão disponíveis.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </BottomSheetModalProvider>
  );
}
