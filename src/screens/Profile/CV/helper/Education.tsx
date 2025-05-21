import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Mask from "~/src/function/mask";

type EducationItem = {
  degree: string;
  institution: string;
  currentlyStudying?: boolean | undefined;
  start: string;
  end: string;
};

type EducationProps = {
  education: EducationItem[];
  setEducation: any;
  preview?: boolean;
};

const Education: React.FC<EducationProps> = ({ education, setEducation, preview }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [savedEducation, setSavedEducation] = useState<any>([]);

  const addEducation = () => {
    setEducation([
      ...education,
      {
        degree: "",
        institution: "",
        start: "",
        end: "",
        currentlyStudying: false,
      },
    ]);
    setSavedEducation([]);
  };

  const updateEducation = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setEducation(updatedEducation);
  };

  const removeEducation = (index: number) => {
    const updatedEducation = education.filter((_, i) => i !== index);
    setEducation(
      updatedEducation.length
        ? updatedEducation
        : [
            {
              degree: "",
              institution: "",
              start: "",
              end: "",
              currentlyStudying: false,
            },
          ]
    );
  };

  const saveData = () => {
    const isValid = education.every((item) => {
      const hasBasicInfo =
        item.degree.trim() !== "" &&
        item.institution.trim() !== "" &&
        item.start.trim() !== "";

      const hasEndOrStudying = item.currentlyStudying || item.end.trim() !== "";

      return hasBasicInfo && hasEndOrStudying;
    });

    if (!isValid) {
      Alert.alert(
        "Campos incompletos",
        "Preencha todos os campos obrigatórios antes de continuar."
      );
      return;
    }

    const filteredEducation = education.filter(
      (item) =>
        item.degree.trim() !== "" ||
        item.institution.trim() !== "" ||
        item.start.trim() !== "" ||
        item.end.trim() !== "" ||
        item.currentlyStudying
    );

    setSavedEducation(filteredEducation);
    setEditMode(false);
  };

  const editData = () => {
    setEditMode(true);
  };

  const resetData = () => {
    setEducation([
      {
        degree: "",
        institution: "",
        start: "",
        end: "",
        currentlyStudying: false,
      },
    ]);
    setSavedEducation([]);
    setEditMode(true);
  };

  useEffect(() => {
    const isValid = education.every((item) => {
      const hasBasicInfo =
        item.degree.trim() !== "" &&
        item.institution.trim() !== "" &&
        item.start.trim() !== "";

      const hasEndOrStudying = item.currentlyStudying || item.end.trim() !== "";

      return hasBasicInfo && hasEndOrStudying;
    });

    if (!isValid) {
      return;
    }

    const filteredEducation = education.filter(
      (item) =>
        item.degree.trim() !== "" ||
        item.institution.trim() !== "" ||
        item.start.trim() !== "" ||
        item.end.trim() !== "" ||
        item.currentlyStudying
    );

    setSavedEducation(filteredEducation);
  }, []);

  return (
    <>
      <View className="px-1 flex-row justify-between items-center mb-3">
        <Text className="text-dark font-bold text-lg">Escolaridade</Text>
        { !preview &&
          <View className="flex-row justify-between items-center">
          <View className="flex-row">
            {editMode ? (
              <TouchableOpacity onPress={saveData}>
                <MaterialCommunityIcons
                  name="content-save-all-outline"
                  size={24}
                  color="#10B981"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={editData}>
                <MaterialCommunityIcons
                  name="pencil-box-multiple-outline"
                  size={24}
                  color="#3B82F6"
                />
              </TouchableOpacity>
            )}
            {/* <TouchableOpacity onPress={resetData}>
                        <Ionicons name="trash" size={20} color="black" />
                        </TouchableOpacity> */}
          </View>
          </View>
        }
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
                  <View className="flex-row mt-2 justify-between">
                    <View className="flex-row gap-1 w-7/12 justify-between ">
                      <TextInput
                        style={{
                          elevation: 8, // Sombra para Android
                          shadowColor: "#000", // Sombra para iOS
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                        }}
                        className="bg-white p-2 rounded-lg text-black w-1/2"
                        placeholder="Início"
                        maxLength={7}
                        keyboardType="numeric"
                        value={Mask("formatMonthYear", edu.start)}
                        onChangeText={(text) =>
                          updateEducation(index, "start", text)
                        }
                      />

                      {!edu.currentlyStudying && (
                        <TextInput
                          style={{
                            elevation: 8, // Sombra para Android
                            shadowColor: "#000", // Sombra para iOS
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                          }}
                          className="bg-white p-2 rounded-lg text-black w-1/2"
                          placeholder="Fim"
                          maxLength={7}
                          keyboardType="numeric"
                          value={Mask("formatMonthYear", edu.end)}
                          onChangeText={(text) =>
                            updateEducation(index, "end", text)
                          }
                        />
                      )}
                    </View>

                    <View className="flex-row items-center mt-2">
                      <Text className="text-black mr-1 text-xs">Cursando</Text>
                      <Switch
                        value={edu.currentlyStudying}
                        onValueChange={(value) =>
                          updateEducation(index, "currentlyStudying", value)
                        }
                      />
                    </View>
                  </View>
                </View>
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => removeEducation(index)}
                    className="ml-2"
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={addEducation} className="mt-2">
              <Text className="text-black">+ Adicionar mais seções</Text>
            </TouchableOpacity>
          </View>
        ) : savedEducation && savedEducation.length > 0 ? (
          <View className="flex-col gap-3">
            {savedEducation.map((edu: any, index: any) => (
              <View key={index} className="bg-white rounded-lg">
                <View className="flex-row">
                  <Text className="text-black font-bold">Curso: </Text>
                  <Text>{edu.degree}</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-black font-bold">Instituição: </Text>
                  <Text>{edu.institution}</Text>
                </View>
                <View className="flex-row">
                  <Text className="text-black font-bold">Período: </Text>
                  <Text>
                    {edu.start} - {edu.currentlyStudying ? "Cursando" : edu.end}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
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
