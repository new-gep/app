import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type EducationItem = {
  degree: string;
  institution: string;
  period: string;
};

type EducationProps = {
  education: EducationItem[];
  setEducation: React.Dispatch<React.SetStateAction<EducationItem[]>>;
};

const Education: React.FC<EducationProps> = ({ education, setEducation }) => {
  // const [education, setEducation] = useState([
  //   { degree: "", institution: "", period: "", },
  // ]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [savedEducation, setSavedEducation] = useState<any>([]);

  const addEducation = () => {
    setEducation([
      ...education,
      { degree: "", institution: "", period: "", },
    ]);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setEducation(updatedEducation);
  };

  const removeEducation = (index: number) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(
      updatedEducation.length
        ? updatedEducation
        : [{ degree: "", institution: "", period: "", }]
    );
  };

  const saveData = () => {
  const filteredEducation = education.filter(
    item =>
      item.degree.trim() !== "" ||
      item.institution.trim() !== "" ||
      item.period.trim() !== "" 
  ); // remove vazios
  setSavedEducation(filteredEducation);
  setEditMode(false);
};

  const editData = () => {
    setEditMode(true);
  };

  const resetData = () => {
    setEducation([
      { degree: "", institution: "", period: "", },
    ]);
    setSavedEducation([]);
    setEditMode(true);
  };

  return (
    <>
      <View className="px-1 flex-row justify-between items-center mb-3">
        <Text className="text-black font-bold text-lg">
          Escolaridade
        </Text>
        <View className="flex-row justify-between items-center">
          <View className="flex-row">
            {editMode ? (
              <TouchableOpacity onPress={saveData}>
                <MaterialCommunityIcons name="content-save-all-outline" size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={editData}>
                <MaterialCommunityIcons name="pencil-box-multiple-outline" size={24} color="black" />
              </TouchableOpacity>
            )}
            {/* <TouchableOpacity onPress={resetData}>
                        <Ionicons name="trash" size={20} color="black" />
                        </TouchableOpacity> */}
          </View>
        </View>
      </View>
      <View
        className="p-4 bg-white rounded-xl mb-4 shadow-md"
        style={{
          elevation: 8, // Sombra para Android
          shadowColor: "#000", // Sombra para iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        {/* <View className="flex-row justify-between items-center">
          <Text className="text-black font-bold text-lg">Escolaridade</Text>
          <View className="flex-row">
            {editMode ? (
              <TouchableOpacity onPress={saveData}>
                <Ionicons name="save" size={20} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={editData}>
                <Ionicons name="pencil" size={20} color="black" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={resetData}>
              <Ionicons name="trash" size={20} color="black" />
            </TouchableOpacity> 
          </View>
        </View> */}
        {editMode ? (
          <View className="flex-col gap-8">
            {education.map((edu, index) => (
              <View key={index} className="mt-2 flex-row items-center">
                <View className="flex-1">
                  <TextInput
                    style={{
                      elevation: 8, // Sombra para Android
                      shadowColor: "#000", // Sombra para iOS
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    }}
                    className="bg-white p-2 rounded-lg mt-2 text-black"
                    placeholder="Curso"
                    // placeholderTextColor="#d1d5db"
                    value={edu.degree}
                    onChangeText={(text) =>
                      updateEducation(index, "degree", text)
                    }
                  />
                  <TextInput
                    style={{
                      elevation: 8, // Sombra para Android
                      shadowColor: "#000", // Sombra para iOS
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    }}
                    className="bg-white p-2 rounded-lg mt-2 text-black"
                    placeholder="Instituição"
                    // placeholderTextColor="#d1d5db"
                    value={edu.institution}
                    onChangeText={(text) =>
                      updateEducation(index, "institution", text)
                    }
                  />
                  <TextInput
                    style={{
                      elevation: 8, // Sombra para Android
                      shadowColor: "#000", // Sombra para iOS
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    }}
                    className="bg-white p-2 rounded-lg mt-2 text-black"
                    placeholder="Período"
                    // placeholderTextColor="#d1d5db"
                    value={edu.period}
                    onChangeText={(text) =>
                      updateEducation(index, "period", text)
                    }
                  />
                  
                </View>
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => removeEducation(index)}
                    className="ml-2"
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={addEducation} className="mt-2">
              <Text className="text-black">+ Adicionar mais seções</Text>
            </TouchableOpacity>
          </View>
        ) : (
        savedEducation && savedEducation.length > 0 ?
          <View>
            {savedEducation.map((edu:any,index:any ) => (
                <View key={index} className="mt-2">
                  <Text className="text-black">Curso: {edu.degree}</Text>
                  <Text className="text-black">
                    Instituição: {edu.institution && edu.institution}
                  </Text>
                  <Text className="text-black">Período: {edu.period}</Text>
                </View>
              )
            )}
          </View>
          :
          <View>
            <Text className="text-gray-500">
              Nenhuma escolaridade adicionada.
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

export default Education;
