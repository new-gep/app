import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AbsenceGet from "./History";
import AbsenceUpload from "./Send";

const Absence = () => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { jobConected } = route.params as { jobConected: any };
  const path = jobConected?.path || "";

  // Dados para enviar ao DocumentSendServices
  const absenceData = {
    CPF: jobConected?.collaborator?.CPF,
    path: path,
    file_name: `Absence_${jobConected?.collaborator?.name}`, 
    id_work: jobConected?.id || "",
    year: new Date().getFullYear().toString(),
    month: new Date().toLocaleString('en-US', { month: 'long' }),
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-5 mt-14">
        <View className="flex-row items-center mb-5">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center border border-gray-700">
              <Text className="text-xl">←</Text>
            </View>
          </TouchableOpacity>

          <Text className="text-2xl font-semibold text-gray-900 flex-1 text-center -ml-10">
            Minhas Ausências
          </Text>
        </View>
      </View>

      {!isAddingNew ? (
        <AbsenceGet onAddNew={() => setIsAddingNew(true)} />
      ) : (
        <AbsenceUpload
          onClose={() => setIsAddingNew(false)}
          absenceData={absenceData}
        />
      )}
    </View>
  );
};

export default Absence;
