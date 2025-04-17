import React, { useEffect, useRef, useState } from "react";
import { View, Modal, PanResponder, Dimensions, Alert } from "react-native";
import Canvas from "react-native-canvas";
import Button from "../../../components/Button/Button";
import uploadFile from "../../../hooks/upload/job";
import CreateAvalidPicture from "../../../hooks/create/pictures";
import UpdatePicture from "../../../hooks/update/picture";
import Orientation from "react-native-orientation-locker";
import { COLORS } from "~/src/constants/theme";

const SignatureAdmission = ({
  visible,
  onClose,
  onSaveSignature,
  id,
  cpf,
  where,
  jobId,
  setStatusSignature
}) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCanvas = (canvas:any) => {
    if (canvas) {
      canvas.width = Dimensions.get("window").width;
      canvas.height = Dimensions.get("window").height - 65;
      const ctx = canvas.getContext("2d");

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
      setLoading(true);
      if (canvasRef.current) {
        const dataURL = await canvasRef.current.toDataURL();

        if (!dataURL) {
          console.log("Erro", "Não foi possível gerar a assinatura. Tente novamente.");
          return;
        }

        const fileName = `Signature_Admission_${id}`;
        const props = {
          file: dataURL,
          id: jobId,
          dynamic: fileName,
          name: 'admission_signature',
          signature: true
        };

        const response = await uploadFile(props);
        if (response?.status === 200) {
          const pictureProps = {
            picture: `Signature_Admission`,
            status: "pending",
            cpf: cpf,
            id_work: id,
          };

          const pictureResponse = await CreateAvalidPicture(pictureProps);
          console.log("pictureResponse", pictureResponse);
          if (pictureResponse.status === 409) {
            const responseUpdate = await UpdatePicture(cpf, pictureProps);
            if (responseUpdate.status === 200) {
              Alert.alert("Sucesso", "Assinatura atualizada com sucesso!");
              setStatusSignature("pending");
              onClose(false);
              return;
            } else {
              Alert.alert("Erro", "Ocorreu um erro ao atualizar a assinatura. Tente novamente.");
              return;
            }
          }
          setStatusSignature("pending");
          Alert.alert("Sucesso", "Assinatura salva com sucesso!");
          onClose(false);
          return
        } else {
          Alert.alert("Erro", "Ocorreu um erro ao enviar a assinatura. Tente novamente.");
        }
      }
    } catch (error) {
      console.error("Erro ao processar assinatura:", error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar a assinatura. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && canvasRef.current) {
      handleCanvas(canvasRef.current);
    }
  }, [visible]);

  // useEffect(() => {
  //   if (visible) {
  //     Orientation.lockToLandscape(); // Força modo paisagem
  //   } else {
  //     Orientation.unlockAllOrientations(); // Volta ao normal
  //   }
  
  //   return () => {
  //     Orientation.unlockAllOrientations(); // Garante reset
  //   };
  // }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-white">
        <View className="flex-1 w-full" {...panResponder.panHandlers}>
          <Canvas
            ref={handleCanvas}
            className="flex-1 w-full h-full bg-gray-100"
          />
        </View>

        <View className="flex-row justify-around items-center bg-white p-4 border-t border-gray-200">
          <Button onPress={saveCanvas} loadColor={COLORS.white} loadSize={25} load={loading} color={COLORS.success} text={COLORS.white} title="Salvar" size="sm" />
          <Button onPress={clearCanvas} color={COLORS.danger}  text={COLORS.white} title="Apagar" size="sm" />
          <Button onPress={() => onClose(false)} color="gray" text="white" title="Fechar" size="sm" />
        </View>
      </View>
    </Modal>
  );
};

export default SignatureAdmission;
