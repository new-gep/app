import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Header from "~/src/layout/Header";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import List from "~/src/components/Menu/List";

export default function Wallet() {
  const [showBalance, setShowBalance] = useState(true);
  const ListMenu = [
    {
      icon:'money_outline',
      title:'Fazer um Pix',
    //   variable: cv,
    //   setVariable: setCv
    },
     {
      icon:'receipt_outline',
      title:'Ver Extrato',
    //   variable: upload,
    //   setVariable: setUpload
    },

  ]

  return (
    <View className="h-full bg-white">
      <Header title="Carteira" leftIcon="back" />
      <ScrollView className="p-6">
        {/* Saldo */}
        <View style={styles.card} className="rounded-2xl p-4 mb-4 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500 text-sm">Saldo disponível</Text>
            <Text className="text-2xl font-bold text-black mt-1">
              {showBalance ? "R$ 1.250,00" : "••••••"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowBalance(prev => !prev)}>
            <MaterialIcons
              name={showBalance ? "visibility" : "visibility-off"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <View>
            <List items={ListMenu} />
        </View>
      </ScrollView>
    </View>
  );
}

// Componente reutilizável
function OptionButton({ icon, label }: { icon: any; label: string }) {
  return (
    <TouchableOpacity style={styles.optionButton} className="rounded-2xl flex-row items-center p-4">
      <MaterialIcons name={icon} size={24} color="white" />
      <Text className="text-white text-base font-medium ml-2">{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionButton: {
    backgroundColor: "#04B45F",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});
