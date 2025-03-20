import React, { useEffect, useRef, useState } from "react";
import { View, Modal, PanResponder, Dimensions, Alert } from "react-native";
import Canvas from "react-native-canvas";
import ButtonOutline from "../../../components/Button/ButtonOutline";
import uploadFile from "../../../hooks/upload/job";
import WaitingIndicator from "../../Work/Admission/admissionalWaitingIndicator";
import CreateAvalidPicture from "../../../hooks/create/pictures";
import UpdatePicture from "../../../hooks/update/picture";
import CreateAvalidService from "../../../hooks/create/service";

const SignatureAdmission = ({
  visible,
  onClose,
  onSaveSignature,
  id,
  cpf,
  where,
  jobId,
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);

  const handleCanvas = (canvas) => {
    if (canvas) {
      canvas.width = Dimensions.get("window").width;
      canvas.height = Dimensions.get("window").height - 65; // Altura total menos espaço para botões
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

  const getMonthName = (monthNumber: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1] || "Unknown";
  };

  const saveCanvas = async () => {
    try {
      if (canvasRef.current) {
        // Obter o dataURL do canvas
        const dataURL = await canvasRef.current.toDataURL();
        // console.log("dataURL", dataURL);
        
        if (!dataURL) {
          console.log("Erro", "Não foi possível gerar a assinatura. Tente novamente.");
          return;
        }

        // Gera o nome do arquivo
        const fileName = `Signature_Admission_${id}`;
     
        // Preparar dados para upload
        const props = {
          file: dataURL,
          id: jobId,
          dynamic: fileName,
          name: 'admission_signature',
          signature: true // Adicionando flag de assinatura
        };

        const response = await uploadFile(props);
        
        if (response?.status === 200) {
          // Criar registro da imagem após upload bem sucedido
          const pictureProps = {
            picture: `Signature_Admission`,
            status: "pending",
            cpf: cpf,
            id_work: id,
          };

          const pictureResponse = await CreateAvalidPicture(pictureProps);

          if (pictureResponse.status === 409) {
            const responseUpdate = await UpdatePicture(cpf, pictureProps);
            if (responseUpdate.status === 200) {
              Alert.alert("Sucesso", "Assinatura atualizada com sucesso!");
              onClose(false);
              return;
            }else{
              Alert.alert("Erro", "Ocorreu um erro ao atualizar a assinatura. Tente novamente.");
              return;
            }
          }

          Alert.alert("Sucesso", "Assinatura salva com sucesso!");
          onClose(false);
          onSaveSignature(fileName);
        } else {
          Alert.alert("Erro", "Ocorreu um erro ao enviar a assinatura. Tente novamente.");
        }
      }
    } catch (error) {
      console.error("Erro ao processar assinatura:", error);
      Alert.alert(
        "Erro", 
        "Ocorreu um erro ao salvar a assinatura. Por favor, tente novamente."
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-white">
        {/* Área de assinatura ocupando toda a tela */}
        <View className="flex-1 w-full" {...panResponder.panHandlers}>
          <Canvas
            ref={handleCanvas}
            className="flex-1 w-full h-full bg-gray-100"
          />
        </View>

        {/* Botões fixos na parte inferior */}
        <View className="flex-row justify-around items-center bg-white p-4 border-t border-gray-200">
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

export default SignatureAdmission;
