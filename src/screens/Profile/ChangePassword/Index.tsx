import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import Header from "~/src/layout/Header";
import { useState } from "react";
import { FONTS } from "~/src/constants/theme";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As novas senhas não coincidem.");
      return;
    }

    // Aqui você chamaria sua API para alterar a senha
    // Exemplo: await api.post('/change-password', { currentPassword, newPassword })

    Alert.alert("Sucesso", "Senha alterada com sucesso!");
  };

  return (
    <View className="h-full bg-white">
      <Header title="Mudar a Senha" leftIcon="back" />
      <ScrollView className="py-3 px-8"
        contentContainerStyle={{paddingBottom:50}}
      >
        <View style={styles.card} className="mb-4 rounded-lg"></View>
        <Text className="text-black ">Senha atual</Text>
        <View style={styles.card} className="mb-4 rounded-lg">
          <TextInput
            secureTextEntry
            placeholder="Digite sua senha atual"
            value={currentPassword}
            placeholderTextColor="#999"
            onChangeText={setCurrentPassword}
            className="bg-white rounded-xl p-3 text-black"
          />
        </View>

        <Text className="text-black ">Nova senha</Text>
        <View style={styles.card} className="mb-4 rounded-lg">
          <TextInput
            secureTextEntry
            style={styles.card}
            placeholder="Digite a nova senha"
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            className="bg-white rounded-xl p-3 text-black"
          />
        </View>

        <Text className="text-black-300 ">Confirmar nova senha</Text>
        <View style={styles.card} className="mb-4 rounded-lg">
          <TextInput
            secureTextEntry
            placeholder="Confirme a nova senha"
            placeholderTextColor="#999"
            style={styles.card}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="bg-white rounded-xl p-3 text-black"
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="bg-[#fde047] py-4 rounded-t-[20px] mx-4 mb-2"
        onPress={() => console.log("CONCLUÍDO pressed")}
      >
        <Text
          className="text-dark text-center"
          style={{ ...FONTS.fontBold, fontSize: 16 }}
        >
          SALVAR
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  select: {
    elevation: 8, // Sombra para Android
    shadowColor: "#000", // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
});
