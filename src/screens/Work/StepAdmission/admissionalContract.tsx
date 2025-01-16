import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import CheckDocumentAdmissional from "../../../hooks/get/job/checkSignaure";

type Props = {
  jobConected: any;
  CPF: any;
};

const AdmissionalContract = ({ jobConected, CPF }: Props) => {
  const [data, setData] = useState<any>(null);
  const [obligation, setObligation] = useState({});
  const [dynamic, setDynamic] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CheckDocumentAdmissional(jobConected.id);

        if (response.status === 200) {
          console.log(response.date.obligation);
          console.log(response.date.dynamic);

          // Atualiza os estados com os dados recebidos
          setObligation(response.date.obligation);
          setDynamic(response.date.dynamic);
        } else {
          console.warn('Algo deu errado:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [jobConected, CPF]);

  return (
    <ScrollView className="p-4 bg-gray-100">
      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Obligation</Text>
        {Object.entries(obligation).map(([key, value]) => (
          <View key={key} className="flex-row justify-between py-2 px-4 bg-white rounded-md mb-2 shadow-sm">
            <Text className="text-gray-700 font-medium">{key}</Text>
            <Text className="text-gray-500">{value ? 'Yes' : 'No'}</Text>
          </View>
        ))}
      </View>

      <View>
        <Text className="text-xl font-bold text-gray-800 mb-4">Dynamic</Text>
        {Object.entries(dynamic).map(([key, value]) => (
          <View key={key} className="flex-row justify-between py-2 px-4 bg-white rounded-md mb-2 shadow-sm">
            <Text className="text-gray-700 font-medium">{key}</Text>
            <Text className="text-gray-500">{JSON.stringify(value)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default AdmissionalContract;


