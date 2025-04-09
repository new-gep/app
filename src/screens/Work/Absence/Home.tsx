import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AbsenceGet from "./History";
import AbsenceUpload from "./Send";
import Header from "../../../layout/Header";
import useCollaborator from "~/src/function/fetchCollaborator";

const Absence = () => {
  const { collaborator, updateCollaborator } = useCollaborator();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { jobConected } = route.params as { jobConected: any };
  const path = jobConected?.path || "";

  // Dados para enviar ao DocumentSendServices
  const absenceData = {
    CPF: jobConected?.CPF,
    path: path,
    file_name: `Absence_${jobConected?.name}`,
    id_work: jobConected?.id_work.id || "",
    year: new Date().getFullYear().toString(),
    month: new Date().toLocaleString("en-US", { month: "long" }),
  };


  return (
    <View className="flex-1 bg-white">
      {!isAddingNew && (
        <View className="mb-5">
          <Header
            title="Minhas Ausências"
            leftIcon="back"
            leftAction={() => navigation.goBack()}
          />
        </View>
      )}

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
