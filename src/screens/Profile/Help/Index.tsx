import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Header from "~/src/layout/Header";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Habilita animação no Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqs = [
  {
    question: "Como posso redefinir minha senha?",
    answer: "Vá até a tela de perfil, toque em 'Mudar a senha' e siga as instruções.",
  },
  {
    question: "Estou com problemas para acessar minha conta",
    answer: "Verifique se o e-mail e a senha estão corretos. Se necessário, use a opção 'Esqueci minha senha'.",
  },
  {
    question: "Como entro em contato com o suporte?",
    answer: "Você pode nos chamar pelo WhatsApp ou e-mail. Toque no botão 'Suporte' no menu principal.",
  },
  {
    question: "Posso alterar meu e-mail cadastrado?",
    answer: "Sim. Vá até a tela de perfil e edite suas informações.",
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Sim, utilizamos criptografia e seguimos padrões de segurança para proteger suas informações.",
  },
  {
    question: "O que fazer se o app travar?",
    answer: "Tente fechar e abrir o app novamente. Se persistir, entre em contato com o suporte.",
  },
];

export default function Help() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <View className="h-full bg-white">
      <Header title="Ajuda" leftIcon="back" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {faqs.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <View key={index} style={styles.card} className="rounded-2xl mb-4">
              <TouchableOpacity
                onPress={() => toggleAccordion(index)}
                className="flex-row justify-between items-center p-4"
              >
                <Text className="text-lg font-semibold text-black flex-1">
                  {item.question}
                </Text>
                <Text className="text-xl text-black ml-2">
                  {isActive ? <MaterialIcons name="keyboard-arrow-down" size={21} color="black" /> : <MaterialIcons name="keyboard-arrow-right" size={21} color="black" />}
                </Text>
              </TouchableOpacity>
              {isActive && (
                <View className="px-4 pb-4">
                  <Text style={styles.text}>{item.answer}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  text: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    color: "black",
  },
});
