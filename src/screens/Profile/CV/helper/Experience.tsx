import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type ExperienceType = { role: string; company: string; period: string; responsibilities: string };

interface ExperienceProps {
  experience: ExperienceType[];
  setExperience: React.Dispatch<React.SetStateAction<ExperienceType[]>>;
}

const Experience = ({ experience, setExperience }: ExperienceProps) => {
  // const [experience, setExperience] = useState<ExperienceType[]>([{ role: '', company: '', period: '', responsibilities: '' }]);
  const [editMode, setEditMode] = useState(false);
  const [savedExperience, setSavedExperience] = useState<ExperienceType[]>([]);

  const addExperience = () => {
    setExperience([...experience, { role: '', company: '', period: '', responsibilities: '' }]);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setExperience(updatedExperience);
  };

  const removeExperience = (index: number) => {
    const updatedExperience = experience.filter((_, i) => i !== index);
    setExperience(updatedExperience.length ? updatedExperience : [{ role: '', company: '', period: '', responsibilities: '' }]);
  };

  const saveData = () => {
  const filteredExperience = experience.filter(
    item =>
      item.role.trim() !== "" ||
      item.company.trim() !== "" ||
      item.period.trim() !== "" ||
      item.responsibilities.trim() !== ""
  );
  setSavedExperience(filteredExperience);
  setEditMode(false);
};

  const editData = () => {
    setEditMode(true);
  };

  const resetData = () => {
    setExperience([{ role: '', company: '', period: '', responsibilities: '' }]);
    setSavedExperience([]);
    setEditMode(true);
  };

  return (
    <>
      <View className="px-1 flex-row justify-between items-center mb-3">
        <Text className="text-black font-bold text-lg">Experiência Profissional</Text>
           {editMode ? (
              <TouchableOpacity onPress={saveData}>
                <MaterialCommunityIcons name="content-save-all-outline" size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={editData}>
                <MaterialCommunityIcons name="pencil-box-multiple-outline" size={24} color="black" />
              </TouchableOpacity>
            )}
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
          <Text className="text-black font-bold text-lg">Experiência Profissional</Text>
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
          <View className='flex-col gap-8'>
            {experience.map((exp, index) => (
              <View key={index} className="mt-3 flex-row items-center">
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
                    placeholder="Cargo"
                    // placeholderTextColor="#d1d5db"
                    value={exp.role}
                    onChangeText={(text) => updateExperience(index, 'role', text)}
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
                    placeholder="Empresa"
                    // placeholderTextColor="#d1d5db"
                    value={exp.company}
                    onChangeText={(text) => updateExperience(index, 'company', text)}
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
                    value={exp.period}
                    onChangeText={(text) => updateExperience(index, 'period', text)}
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
                    placeholder="Responsabilidades"
                    // placeholderTextColor="#d1d5db"
                    value={exp.responsibilities}
                    onChangeText={(text) => updateExperience(index, 'responsibilities', text)}
                  />
                </View>
                { index > 0 &&
                  <TouchableOpacity onPress={() => removeExperience(index)} className="ml-2">
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color="black" />
                  </TouchableOpacity>
                }
              </View>
            ))}
            <TouchableOpacity onPress={addExperience} className="mt-2">
              <Text className="text-black">+ Adicionar mais seções</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {(savedExperience && savedExperience.length > 0) ? savedExperience.map((exp, index) => (
              <View key={index} className="mt-2">
                <Text className="text-black">Cargo: {exp.role}</Text>
                <Text className="text-black">Empresa: {exp.company}</Text>
                <Text className="text-black">Período: {exp.period}</Text>
                <Text className="text-black">Responsabilidades: {exp.responsibilities}</Text>
              </View>
            ))
            :
            <Text className="text-gray-500">Nenhuma experiência adicionada.</Text>
          }
          </View>
        )}
      </View>
    </>
  );
};

export default Experience;