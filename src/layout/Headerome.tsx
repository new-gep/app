import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function HeaderHome() {
  const [activeTab, setActiveTab] = useState("pessoa");

  return (
    <View className="px-5 pt-5">
      {/* Toggle */}
      <View className="flex-row bg-gray-200 rounded-full self-start p-1">
        <TouchableOpacity
          onPress={() => setActiveTab("pessoa")}
          className={`px-5 py-2 rounded-full ${
            activeTab === "pessoa" ? "bg-indigo-600" : ""
          }`}
        >
          <Text
            className={`font-semibold ${
              activeTab === "pessoa" ? "text-white" : "text-gray-700"
            }`}
          >
            Pessoa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("empresa")}
          className={`px-5 py-2 rounded-full ${
            activeTab === "empresa" ? "bg-indigo-600" : ""
          }`}
        >
          <Text
            className={`font-semibold ${
              activeTab === "empresa" ? "text-white" : "text-gray-700"
            }`}
          >
            Empresa
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
