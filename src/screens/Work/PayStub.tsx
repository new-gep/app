import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { RouteProp, useRoute, useTheme } from "@react-navigation/native";
import Header from "../../layout/Header";
import { useNavigation } from "@react-navigation/native";
import CheckDocumentDismissal from "../../hooks/get/job/checkDismissal";
import FindFile from "../../hooks/get/job/findFile";
import CheckDocumentServices from "../../hooks/get/job/checkPayStub";

// Defina o tipo PayStubParams
type PayStubParams = {
  jobConected: any; // Substitua 'any' pelo tipo correto, se possível
  CPF: string;
};

const PayStub = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ PayStub: PayStubParams }>>();
  const { jobConected, CPF } = route.params;
  const [mes, setMes] = useState("Janeiro");
  const [ano, setAno] = useState("2025");
  const [tipo, setTipo] = useState("Mensal");
  const [modalVisible, setModalVisible] = useState(false);
  const [obligations, setObligations] = useState(null);
  const [dynamics, setDynamics] = useState({});

  const [dynamicDocs, setDynamicDocs] = useState([]);
  const [files, setFiles] = useState({});
  const [currentPicker, setCurrentPicker] = useState<"mes" | "ano" | "tipo">(
    "mes"
  );
  const [isMesOpen, setIsMesOpen] = useState(false);
  const [isAnoOpen, setIsAnoOpen] = useState(false);
  const [isTipoOpen, setIsTipoOpen] = useState(false);

  const anos = [
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010",
    "2009",
    "2008",
    "2007",
    "2006",
    "2005",
    "2004",
    "2003",
    "2002",
    "2001",
    "2000",
    "1999",
    "1998",
    "1997",
    "1996",
    "1995",
    "1994",
    "1993",
    "1992",
    "1991",
    "1990",
    "1989",
    "1988",
    "1987",
    "1986",
    "1985",
    "1984",
    "1983",
    "1982",
    "1981",
    "1980",
  ];
  const monthMap: { [key: string]: { pt: string; en: string } } = {
    0: { pt: "Janeiro", en: "January" },
    1: { pt: "Fevereiro", en: "February" },
    2: { pt: "Março", en: "March" },
    3: { pt: "Abril", en: "April" },
    4: { pt: "Maio", en: "May" },
    5: { pt: "Junho", en: "June" },
    6: { pt: "Julho", en: "July" },
    7: { pt: "Agosto", en: "August" },
    8: { pt: "Setembro", en: "September" },
    9: { pt: "Outubro", en: "October" },
    10: { pt: "Novembro", en: "November" },
    11: { pt: "Dezembro", en: "December" },
  };
  const meses = Object.values(monthMap).map((m) => m.pt);
  const options = {
    mes: meses,
    ano: anos,
    tipo: ["Mensal", "Adiantamento"],
  };

  // const months = [
  //   {
  //     id: '1',
  //     month: 'Agosto',
  //     period: '01 jul 2023 - 31 jul 2023',
  //     status: 'approved'
  //   },
  //   {
  //     id: '2',
  //     month: 'Julho',
  //     period: '01 jun 2023 - 31 jun 2023',
  //     status: 'pending'
  //   },
  //   {
  //     id: '3',
  //     month: 'Junho',
  //     period: '01 Mai 2023 - 30 Mai 2023',
  //     status: 'pending'
  //   }
  // ];

  const holerites = [
    { id: "1", data: "01/2019", tipo: "Adiantamento" },
    { id: "2", data: "12/2018", tipo: "Adiantamento" },
    { id: "3", data: "12/2018", tipo: "13º Salário" },
    { id: "4", data: "12/2018", tipo: "Mensal" },
    { id: "5", data: "11/2018", tipo: "Adiantamento" },
    { id: "6", data: "11/2018", tipo: "Mensal" },
  ];

  const handleSelect = (value: string) => {
    if (currentPicker === "mes") setMes(value);
    if (currentPicker === "ano") setAno(value);
    if (currentPicker === "tipo") setTipo(value);
    setModalVisible(false);
  };

  const toggleDropdown = (type: "mes" | "ano" | "tipo") => {
    if (type === "mes") setIsMesOpen(!isMesOpen);
    if (type === "ano") setIsAnoOpen(!isAnoOpen);
    if (type === "tipo") setIsTipoOpen(!isTipoOpen);
  };

  const renderDropdown = (
    selectedValue: string,
    options: string[],
    onSelect: (value: string) => void,
    isOpen: boolean,
    toggle: () => void
  ) => (
    <View className="border border-gray-300 rounded p-2 mb-2">
      <TouchableOpacity onPress={toggle} className="py-2">
        <Text className="text-lg font-bold">{selectedValue}</Text>
      </TouchableOpacity>
      {isOpen && (
        <ScrollView style={{ maxHeight: 200 }}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                onSelect(option);
                toggle();
              }}
              className="py-2"
            >
              <Text
                className={`text-lg ${
                  selectedValue === option ? "font-bold" : ""
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  useEffect(() => {
    const fetchData = async () => {
      if (jobConected) {
        try {
          const response = await CheckDocumentServices(
            jobConected.id,
            "PayStub",
            ano,
            mes
          );
          console.log("Responass:", response);
          if (response.status === 200) {
            return;
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      }
    };
    fetchData();
  }, [jobConected, CPF]);

  useEffect(() => {
    console.log("jobaaaaaa", jobConected.CPF_collaborator, CPF);
  });

  return (
    <View className="flex-1 p-4">
      <Header
        title="holerite Online"
        leftIcon="back"
        leftAction={() => navigation.goBack()}
      />
      <Text className="text-xl font-bold">
        Informe o mês/ano, o tipo de holerite e clique em "Visualizar holerite":
      </Text>

      <View className="flex-row justify-between my-2">
        <View className="flex-1 mr-2">
          <Text className="text-lg font-bold">Mês:</Text>
          {renderDropdown(mes, meses, setMes, isMesOpen, () =>
            toggleDropdown("mes")
          )}
        </View>

        <View className="flex-1 mr-2">
          <Text className="text-lg font-bold">Ano:</Text>
          {renderDropdown(ano, anos, setAno, isAnoOpen, () =>
            toggleDropdown("ano")
          )}
        </View>

        <View className="flex-1">
          <Text className="text-lg font-bold">Tipo:</Text>
          {renderDropdown(tipo, options.tipo, setTipo, isTipoOpen, () =>
            toggleDropdown("tipo")
          )}
        </View>
      </View>

      <TouchableOpacity className="bg-primary py-4 rounded" onPress={() => {}}>
        <Text className="text-white text-center text-xl font-bold">
          VISUALIZAR holerite
        </Text>
      </TouchableOpacity>

      <Text className="my-4">Meus últimos holerites</Text>
      <ScrollView>
        {holerites.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="flex-row items-center mb-2"
          >
            <View className="w-36 h-36 bg-gray-300 justify-center items-center mr-2">
              <Text className="text-2xl font-bold ">31</Text>

              Criar um componente card para mostrar os holerites/pontos
              {/* {dynamicDocs.map((doc, index) => (
                <DismissalCard
                  key={`dynamic-${index}`}
                  title={doc.title}
                  status={doc.status}
                  path={doc.path}
                  typeDocument={doc.typeDocument}
                />
              ))} */}
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold">{item.data}</Text>
              <Text className="text-xl font-bold ">{item.tipo}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PayStub;
