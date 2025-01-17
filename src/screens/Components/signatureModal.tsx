import React, { useState, useRef, useEffect } from 'react';
import { View, Modal, Dimensions, PanResponder, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ButtonOutline from '../../components/Button/ButtonOutline'; // Ajuste o caminho do ButtonOutline
import CheckDocumentAdmissional from '../../hooks/get/job/checkSignaure';

const DrawingModal = ({ visible, onClose, signature, setSignature }) => {
  const [paths, setPaths] = useState([]); // Armazena todos os caminhos desenhados
  const [currentPath, setCurrentPath] = useState(''); // Armazena o caminho atual
  const svgRef = useRef(null); // Referência para o componente Svg
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get('window');
      setScreenWidth(width);
      setScreenHeight(height);
    };
  
    // Adiciona um listener para mudanças de dimensão
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);
  
    // Cleanup: Remove o listener ao desmontar o componente
    return () => subscription?.remove();
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath(`M${locationX},${locationY}`);
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentPath((prevPath) => `${prevPath} L${locationX},${locationY}`);
    },
    onPanResponderRelease: () => {
      setPaths((prevPaths) => [...prevPaths, currentPath]);
      setCurrentPath('');
    },
  });

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
  };

  const saveCanvas = () => {
    if (paths.length === 0) {
      Alert.alert("Atenção", "Você precisa assinar antes de salvar.");
      return;
    }
  
    try {
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${screenWidth}" height="${screenHeight}" viewBox="0 0 ${screenWidth} ${screenHeight}">
          ${paths
            .map(
              (path) =>
                `<path d="${path}" stroke="black" stroke-width="2" fill="none" />`
            )
            .join('')}
        </svg>
      `;
  
      // Converte o conteúdo SVG em base64
      const base64SVG = `data:image/svg+xml;base64,${btoa(svgContent)}`;
  
      // Verifica se está gerando o base64 corretamente
      console.log("Base64 da assinatura gerado:", base64SVG);
  
      // Atualiza o estado do componente pai
      if (setSignature) {
        setSignature(base64SVG); // Envia o base64 para o pai
      } else {
        console.warn("setSignature não está definido.");
      }
  
      Alert.alert("Desenho salvo!", "A assinatura foi salva com sucesso.");
      onClose(); // Fecha o modal
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar a assinatura.");
    }
  };
  
  
  
  
  

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View
        style={{
          flexDirection: screenWidth > screenHeight ? 'row' : 'column',
          flex: 1,
          backgroundColor: 'black',
        }}
      >
        {/* Área de desenho */}
        <View style={{ flex: 4, backgroundColor: 'white' }} {...panResponder.panHandlers}>
          <Svg ref={svgRef} style={{ width: '100%', height: '100%' }}>
            {paths.map((path, index) => (
              <Path key={index} d={path} stroke="black" strokeWidth={2} fill="none" />
            ))}
            {currentPath ? (
              <Path d={currentPath} stroke="black" strokeWidth={2} fill="none" />
            ) : null}
          </Svg>
        </View>

        {/* Botões na parte inferior ou lateral */}
        <View
          style={{
            flex: 1,
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: 'white',
            flexDirection: screenWidth > screenHeight ? 'column' : 'row',
          }}
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
            disabled={paths.length === 0} // Botão desabilitado se não houver caminhos
          />
          <ButtonOutline
            onPress={onClose}
            color="white"
            title="Fechar"
            size="sm"
          />
        </View>
      </View>
    </Modal>
  );
};

export default DrawingModal;
