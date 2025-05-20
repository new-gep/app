import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface SkillsProps {
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
}

const Skills: React.FC<SkillsProps> = ({ skills, setSkills }) => {
  // const [skills, setSkills] = useState([""]);
  const [editMode, setEditMode] = useState(false);
  const [savedSkills, setSavedSkills] = useState<string[] | null>(null);

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills.length ? updatedSkills : [""]);
  };

  const saveData = () => {
    const filteredSkills = skills.filter((skill) => skill.trim() !== ""); // remove vazios
    setSavedSkills(filteredSkills);
    setEditMode(false);
  };

  const editData = () => {
    setEditMode(true);
  };

  const resetData = () => {
    setSkills([""]);
    setSavedSkills([]);
    setEditMode(true);
  };

  useEffect(() => {
    const filteredSkills = skills.filter((skill) => skill.trim() !== ""); // remove vazios
    setSavedSkills(filteredSkills);
  },[])

  return (
    <>
      <View className="px-1 flex-row justify-between items-center mb-3">
        <Text className="text-dark font-bold text-lg">Competências</Text>
        
        <View className="flex-row">
           {editMode ? (
              <TouchableOpacity onPress={saveData}>
                <MaterialCommunityIcons name="content-save-all-outline" size={24} color="#10B981" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={editData}>
                <MaterialCommunityIcons name="pencil-box-multiple-outline" size={24} color="#3B82F6" />
              </TouchableOpacity>
            )}
          {/* <TouchableOpacity onPress={resetData}>
            <Ionicons name="trash" size={20} color="black" />
          </TouchableOpacity> */}
        </View>
      </View>
      <View
        className="p-4 bg-white rounded-xl mb-10 shadow-md"
        style={{
          elevation: 8, // Sombra para Android
          shadowColor: "#000", // Sombra para iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        {editMode ? (
          <>
            {skills.map((skill, index) => (
              <View key={index} className="flex-row items-center mt-2">
                <TextInput
                  style={{
                    elevation: 8, // Sombra para Android
                    shadowColor: "#000", // Sombra para iOS
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}
                  className={`bg-white p-2 rounded-lg mt-2 text-black ${
                    index > 0 ? "w-11/12" : "w-full"
                  }`}
                  placeholder="Competência"
                  // placeholderTextColor="#d1d5db"
                  value={skill}
                  onChangeText={(text) => updateSkill(index, text)}
                />
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => removeSkill(index)}
                    className="ml-2"
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={addSkill} className="mt-8">
              <Text className="text-black">+ Adicionar mais seções</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View>
            {savedSkills && savedSkills.length > 0 ? (
              savedSkills.map((skill, index) => (
                <Text key={index} className="text-black">
                  - {skill}
                </Text>
              ))
            ) : (
              <Text className="text-gray-500">
                Nenhuma competência adicionada.
              </Text>
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default Skills;
