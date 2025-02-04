import React, { useEffect, useRef, useState } from "react";
import { View, Modal, PanResponder, Dimensions, Alert } from "react-native";
import Canvas from "react-native-canvas";
import ButtonOutline from "../../components/Button/ButtonOutline";
import uploadFile from "../../hooks/upload/job";
import WaitingIndicator from "../Work/Admission/admissionalWaitingIndicator";
import CreateAvalidPicture from "../../hooks/create/pictures";
import UpdatePicture from "../../hooks/update/picture";


const SignatureModalCanvas = ({ visible, onClose, onSaveSignature, id, cpf, where }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);

  const handleCanvas = (canvas) => {
    if (canvas) {
      canvas.width = Dimensions.get("window").width;
      canvas.height = Dimensions.get("window").height * 0.7; // 70% da altura da tela
      const ctx = canvas.getContext("2d");

      // Configurações de estilo do contexto
      ctx.lineWidth = 4;
      ctx.strokeStyle = "black";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      canvasRef.current = canvas;
      contextRef.current = ctx;
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      if (contextRef.current) {
        contextRef.current.beginPath();
        contextRef.current.moveTo(locationX, locationY);
        isDrawing.current = true;
      }
    },
    onPanResponderMove: (event) => {
      if (isDrawing.current && contextRef.current) {
        const { locationX, locationY } = event.nativeEvent;
        contextRef.current.lineTo(locationX, locationY);
        contextRef.current.stroke();
      }
    },
    onPanResponderRelease: () => {
      if (isDrawing.current && contextRef.current) {
        isDrawing.current = false;
      }
    },
  });

  const clearCanvas = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const saveCanvas = async () => {
    try {
      if (canvasRef.current) {
        const base64Data = await canvasRef.current.toDataURL();
        // Enviar para o backend
        const props = {
          file: base64Data,
          id: id,
          name: where,
        };
        const response = await uploadFile(props);
        if (response?.status === 200) {
        } else {
          alert("Ocorreu um erro ao enviar o arquivo. Tente novamente.");
        }
      }
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      alert("Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.");
    }

    const props = {
      picture :where,
      status  :'pending',
      cpf     : cpf
    }
    const response = await CreateAvalidPicture(props)
    
    if(response.status === 409) {
      const response = await UpdatePicture(cpf, props)
      if(response.status === 200) {
        Alert.alert("Sucesso", "Assinatura salva com sucesso!", [
          {
            text: "OK",
          },
        ]);
        onClose(false)
      }
      return;
    }

    Alert.alert("Sucesso", "Assinatura salva com sucesso!", [
      {
        text: "OK",
        onPress: () => {
          // Nada acontece ao pressionar OK
        },
      },
    ]);

    onClose(false)
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-white">
        {/* Área de assinatura */}
        <View className="flex-1 w-full" {...panResponder.panHandlers}>
          <Canvas
            ref={handleCanvas}
            className="flex-1 w-full h-full bg-gray-200"
          />
        </View>

        {/* Botões na parte inferior */}
        <View
          className={`flex ${
            Dimensions.get("window").width > Dimensions.get("window").height
              ? "flex-col"
              : "flex-row"
          } justify-around items-center bg-white p-4`}
        >
          <ButtonOutline
            onPress={clearCanvas}
            color="red"
            title="Apagar"
            size="sm"
          />
          <ButtonOutline
            onPress={saveCanvas}
            color="green"
            title="Salvar"
            size="sm"
          />
          <ButtonOutline
            onPress={() => {
              onClose(false);
            }}
            color="gray"
            title="Fechar"
            size="sm"
          />
        </View>
      </View>
    </Modal>
  );
};

export default SignatureModalCanvas;
