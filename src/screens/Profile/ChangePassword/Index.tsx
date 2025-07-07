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
import UpdatePasswordCollaborator from "~/src/hooks/update/collaborator/password";
import useCollaborator from "~/src/function/fetchCollaborator";
import Input from "../../../components/Input/Input";
import { useState } from "react";
import { FONTS } from "~/src/constants/theme";
import { rf } from "~/src/hooks/utils/responsiveFont";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "~/src/constants/theme";
export default function ChangePassword() {
  const { collaborator } = useCollaborator();
  const navigation = useNavigation<any>();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isFocused, setIsFocused] = useState<any>();
  const [isFocused1, setIsFocused1] = useState<any>();
  const [isFocused2, setIsFocused2] = useState<any>();

  const handleChangePassword = async () => {
    if (!collaborator) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    };

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As novas senhas não coincidem.");
      return;
    };

    const response = await UpdatePasswordCollaborator(collaborator.CPF, {
      currentPassword: currentPassword,
      newPassword: newPassword,
    });

    if (response.status === 200) {
      Alert.alert("Sucesso", "Sua senha foi atualizada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
      return;
    };

    Alert.alert("Falha", "Não foi possível atualizar sua senha!", [
      {
        text: "OK",
      },
    ]);
  };

  return (
    <View className="h-full bg-white">
      <Header title="Mudar a Senha" leftIcon="back" />
      <ScrollView
        className="py-3 px-8"
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.card} className="mb-4 rounded-lg"></View>
        <Text style={{...FONTS.fontLight}} >Senha atual</Text>
        <View style={styles.card} className="mb-4 rounded-lg">
          <Input
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            backround={COLORS.card}
            value={currentPassword}
            onChangeText={(value) => setCurrentPassword(value)}
            isFocused={isFocused}
            type={"password"}
            inputBorder
          />
        </View>

        <Text style={{...FONTS.fontLight}} >Nova senha</Text>
        <View style={styles.card} className="mb-4 rounded-lg">
          <Input
            onFocus={() => setIsFocused1(true)}
            onBlur={() => setIsFocused1(false)}
            backround={COLORS.card}
            value={newPassword}
            onChangeText={(value) => setNewPassword(value)}
            isFocused={isFocused1}
            type={"password"}
            inputBorder
          />
        </View>

        <Text style={{...FONTS.fontLight}}>Confirmar nova senha</Text>
        <View style={styles.card} className="mb-4 rounded-lg">
          <Input
            onFocus={() => setIsFocused2(true)}
            onBlur={() => setIsFocused2(false)}
            backround={COLORS.card}
            value={confirmPassword}
            onChangeText={(value) => setConfirmPassword(value)}
            isFocused={isFocused2}
            type={"password"}
            inputBorder
          />
        </View>
      </ScrollView>
      <TouchableOpacity
        className="bg-[#fde047] py-4 rounded-t-[20px] mx-4 mb-2"
        onPress={handleChangePassword}
      >
        <Text
          className="text-dark text-center"
          style={{ ...FONTS.fontBold, fontSize: rf(16) }}
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
