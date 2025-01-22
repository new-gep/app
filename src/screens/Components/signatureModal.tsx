import React, { useState, useRef, useEffect } from 'react';
import { View, Modal, Dimensions, PanResponder, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ButtonOutline from '../../components/Button/ButtonOutline'; // Ajuste o caminho do ButtonOutline
import CheckDocumentAdmissional from '../../hooks/get/job/checkSignaure';
import AdmissionalCard from '../Work/StepAdmission/AdmissionalCard';
import uploadFile from '../../hooks/upload/job';


const DrawingModal = ({ visible, onClose, onSaveSignature}) => {
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

  // const saveCanvas = () => {
  //   if (paths.length === 0) {
  //     Alert.alert("Atenção", "Você precisa assinar antes de salvar.");
  //     return;
  //   }
  
  //   try {
  //     // Gera o conteúdo do SVG com os paths fornecidos
  //     const svgContent = `
  //       <svg xmlns="http://www.w3.org/2000/svg" width="${screenWidth}" height="${screenHeight}" viewBox="0 0 ${screenWidth} ${screenHeight}">
  //         ${paths
  //           .map(
  //             (path) =>
  //               `<path d="${path}" stroke="black" stroke-width="2" fill="none" />`
  //           )
  //           .join('')}
  //       </svg>
  //     `;
  
  //     // Converte o conteúdo do SVG para base64
  //     const base64SVG = `data:image/svg+xml;base64,${btoa(svgContent)}`;
  //     // console.log("Base64 da assinatura gerado:", base64SVG);
  
  //     // Propaga a assinatura gerada para o componente pai
  //     onSaveSignature(base64SVG);
  //     Alert.alert("Desenho salvo!", "A assinatura foi salva com sucesso.");
  //     onClose();
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Erro", "Não foi possível salvar a assinatura.");
  //   }
  // };
  
  const saveCanvas = async () => {
  if (paths.length === 0) {
    Alert.alert("Atenção", "Você precisa assinar antes de salvar.");
    return;
  }

  try {
    // Defina o tamanho do SVG e do viewport
    const width = screenWidth;
    const height = screenHeight;

    // Gere o conteúdo SVG com paths centralizados
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        ${paths
          .map(
            (path) =>
              `<path d="${path}" 
                stroke="black" 
                stroke-width="2" 
                fill="none" 
                transform="translate(${width / 2}, ${height / 2})"
              />`
          )
          .join('')}
      </svg>
    `;
    // Converta para Base64
    const base64SVG = `data:image/svg+xml;base64,${btoa(svgContent)}`;
    // Propaga a assinatura gerada para o componente pai
    onSaveSignature(base64SVG);
    Alert.alert("Desenho salvo!", "A assinatura foi salva com sucesso.");

// encaminhando assinatura para o banco atraves do hook uploadFile
    try{

      const uploadFile = await onSaveSignature({
        file: base64SVG,
        name: 'assinatura',
        id: 1,
        signature: true
      }
      );
      console.log("positivo capitão",uploadFile)
    }catch(e){
      console.log('erro ao salvar assinatura: ',e)
    }


    onClose();
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
          <Svg  ref={svgRef} style={{ width: '100%', height: '100%' }}>
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
            onPress={ () => {onClose(false)}}
            color="gray"
            title="Fechar"
            size="sm"
          />
        </View>
      </View>
    </Modal>
  );
};

export default DrawingModal;

