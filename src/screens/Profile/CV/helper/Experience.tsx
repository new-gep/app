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
import { rf } from "~/src/hooks/utils/responsiveFont";

type ExperienceType = {
  role: string;
  company: string;
  responsibilities: string;
  start: string;
  end: string;
  currentlyWork: boolean;
};

interface ExperienceProps {
  experience: ExperienceType[];
  setExperience: React.Dispatch<React.SetStateAction<ExperienceType[]>>;
  preview?: boolean;
}

const Experience = ({
  experience,
  setExperience,
  preview,
}: ExperienceProps) => {
  const [editMode, setEditMode] = useState(false);
  const [savedExperience, setSavedExperience] = useState<ExperienceType[]>([]);

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        role: "",
        company: "",
        responsibilities: "",
        start: "",
        end: "",
        currentlyWork: false,
      },
    ]);
  };

  const updateExperience = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const updatedExperience = [...experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setExperience(updatedExperience);
  };

  const removeExperience = (index: number) => {
    const updatedExperience = experience.filter((_, i) => i !== index);
    setExperience(
      updatedExperience.length
        ? updatedExperience
        : [
            {
              role: "",
              company: "",
              responsibilities: "",
              start: "",
              end: "",
              currentlyWork: false,
            },
          ]
    );
  };

  const saveData = () => {
    const isValid = experience.every((item) => {
      const hasBasicInfo =
        item.company.trim() !== "" &&
        item.role.trim() !== "" &&
        item.start.trim() !== "" &&
        item.responsibilities.trim() !== "";

      const hasEndOrWorking = item.currentlyWork || item.end.trim() !== "";

      return hasBasicInfo && hasEndOrWorking;
    });

    if (!isValid) {
      Alert.alert(
        "Campos incompletos",
        "Preencha todos os campos obrigatórios antes de continuar."
      );
      return;
    }

    const filteredExperience = experience.filter(
      (item) =>
        item.company.trim() !== "" ||
        item.start.trim() !== "" ||
        item.end.trim() !== "" ||
        item.responsibilities.trim() !== "" ||
        item.role.trim() !== "" ||
        item.currentlyWork
    );

    setSavedExperience(filteredExperience);
    setEditMode(false);
  };

  const editData = () => {
    setEditMode(true);
  };

  const resetData = () => {
    setExperience([
      {
        role: "",
        company: "",
        responsibilities: "",
        start: "",
        end: "",
        currentlyWork: false,
      },
    ]);
    setSavedExperience([]);
    setEditMode(true);
  };

  useEffect(() => {
    const isValid = experience.every((item) => {
      const hasBasicInfo =
        item.company.trim() !== "" &&
        item.role.trim() !== "" &&
        item.start.trim() !== "" &&
        item.responsibilities.trim() !== "";

      const hasEndOrWorking = item.currentlyWork || item.end.trim() !== "";

      return hasBasicInfo && hasEndOrWorking;
    });

    if (!isValid) {
      return;
    }

    const filteredExperience = experience.filter(
      (item) =>
        item.company.trim() !== "" ||
        item.start.trim() !== "" ||
        item.end.trim() !== "" ||
        item.responsibilities.trim() !== "" ||
        item.role.trim() !== "" ||
        item.currentlyWork
    );

    setSavedExperience(filteredExperience);
  }, []);

  return (
    <>
      <View className="px-1 flex-row justify-between items-center mb-3">
        <Text
          style={{ fontSize: rf(18) }}
          className="text-dark font-bold text-lg"
        >
          Experiência Profissional
        </Text>
        {!preview && (
          <View className="flex-row">
            {editMode ? (
              <TouchableOpacity onPress={saveData}>
                <MaterialCommunityIcons
                  name="content-save-all-outline"
                  size={rf(24)}
                  color="#10B981"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={editData}>
                <MaterialCommunityIcons
                  name="pencil-box-multiple-outline"
                  size={rf(24)}
                  color="#3B82F6"
                />
              </TouchableOpacity>
            )}
          </View>
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
        {editMode ? (
          <View className="flex-col gap-8">
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
                      fontSize: rf(16),
                    }}
                    className="bg-white p-2 rounded-lg mt-2 text-black"
                    placeholder="Cargo"
                    // placeholderTextColor="#d1d5db"
                    value={exp.role}
                    onChangeText={(text) =>
                      updateExperience(index, "role", text)
                    }
                  />
                  <TextInput
                    style={{
                      elevation: 8, // Sombra para Android
                      shadowColor: "#000", // Sombra para iOS
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      fontSize: rf(16),
                    }}
                    className="bg-white p-2 rounded-lg mt-2 text-black"
                    placeholder="Empresa"
                    // placeholderTextColor="#d1d5db"
                    value={exp.company}
                    onChangeText={(text) =>
                      updateExperience(index, "company", text)
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
                          fontSize: rf(16),
                        }}
                        maxLength={7}
                        keyboardType="numeric"
                        className="bg-white p-2 rounded-lg text-black w-1/2"
                        placeholder="Início"
                        value={Mask("formatMonthYear", exp.start)}
                        onChangeText={(text) =>
                          updateExperience(index, "start", text)
                        }
                      />

                      {!exp.currentlyWork && (
                        <TextInput
                          style={{
                            elevation: 8, // Sombra para Android
                            shadowColor: "#000", // Sombra para iOS
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            fontSize: rf(16),
                          }}
                          maxLength={7}
                          keyboardType="numeric"
                          className="bg-white p-2 rounded-lg text-black w-1/2"
                          placeholder="Fim"
                          value={Mask("formatMonthYear", exp.end)}
                          onChangeText={(text) =>
                            updateExperience(index, "end", text)
                          }
                        />
                      )}
                    </View>

                    <View className="flex-row items-center mt-2 ml-4">
                      <Text
                        style={{ fontSize: rf(14) }}
                        className="text-black mr-1 text-xs"
                      >
                        Atual
                      </Text>
                      <Switch
                        style={{
                          transform: [{ scaleX: rf(0.8) }, { scaleY: rf(0.8) }],
                        }}
                        value={exp.currentlyWork}
                        onValueChange={(value) =>
                          updateExperience(index, "currentlyWork", value)
                        }
                      />
                    </View>
                  </View>
                  <View>
                    <TextInput
                      style={{
                        elevation: 8,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        textAlignVertical: "top",
                        fontSize: rf(16),
                      }}
                      multiline
                      className="bg-white p-2 rounded-lg mt-3 text-black h-20"
                      placeholder="Responsabilidades"
                      maxLength={255}
                      value={exp.responsibilities}
                      onChangeText={(text) =>
                        updateExperience(index, "responsibilities", text)
                      }
                    />

                    <Text
                      style={{
                        textAlign: "right",
                        fontSize: rf(12),
                        color: "#6b7280", // Gray-500
                        marginTop: 4,
                      }}
                    >
                      {exp.responsibilities.length}/255
                    </Text>
                  </View>
                </View>
                {index > 0 && (
                  <TouchableOpacity
                    onPress={() => removeExperience(index)}
                    className="ml-2"
                  >
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={rf(24)}
                      color="black"
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={addExperience} className="mt-2">
              <Text style={{ fontSize: rf(18) }} className="text-black">
                + Adicionar mais seções
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {savedExperience && savedExperience.length > 0 ? (
              savedExperience.map((exp, index) => (
                <View key={index} className="mt-2">
                  <View className="flex-row">
                    <Text
                      style={{ fontSize: rf(17) }}
                      className="text-black font-bold"
                    >
                      Cargo:{" "}
                    </Text>
                    <Text style={{ fontSize: rf(16) }}>{exp.role}</Text>
                  </View>
                  <View className="flex-row">
                    <Text
                      style={{ fontSize: rf(17) }}
                      className="text-black font-bold"
                    >
                      Empresa:{" "}
                    </Text>
                    <Text style={{ fontSize: rf(16) }} className="text-black">
                      {exp.company}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <Text
                      style={{ fontSize: rf(17) }}
                      className="text-black font-bold"
                    >
                      Período:{" "}
                    </Text>
                    <Text style={{ fontSize: rf(16) }} className="text-black">
                      {exp.start} - {exp.currentlyWork ? "Atual" : exp.end}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{ fontSize: rf(17) }}
                      className="text-black font-bold"
                    >
                      Responsabilidades:
                    </Text>
                    <Text
                      style={{ fontSize: rf(16) }}
                      className="text-black px-2"
                    >
                      {exp.responsibilities.length > 80
                        ? `${exp.responsibilities.substring(0, 80)}...`
                        : exp.responsibilities}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ fontSize: rf(16) }} className="text-gray-500">
                Nenhuma experiência adicionada.
              </Text>
            )}
          </View>
        )}
      </View>
    </>
  );
};

export default Experience;
