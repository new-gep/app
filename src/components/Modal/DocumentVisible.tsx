import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import WebView from "react-native-webview";
import * as FileSystem from 'expo-file-system';
import React from "react";
import Pdf from "react-native-pdf";


type Props = {
    typeDocument: string;
    twoPicture: boolean;
    visible: boolean;
    path?: any
    documentName:string
    close: () => void;
};

const DocumentVisible = ({ path, twoPicture, typeDocument, visible, close }: Props) => {
    // Define qual lado da imagem está sendo visualizado ou se deve mostrar as opções
    const [viewingSide, setViewingSide] = useState<'front' | 'back' | null>(null);
    const [loading, setLoading] = useState(true);
    const [pathFront, setPathFront] = useState<any>()
    const [pathBack , setPathBack]  = useState<any>()
    const [pathOne  , setPathOne]    = useState<any>()

    
    useEffect(()=>{
        const fetchData = async () => {
            if (path) {
                if (Array.isArray(path) && path.length > 1) {
                    const pathImageFront = path[0];
                    const pathImageBack = path[1];
                    setPathFront(pathImageFront);
                    setPathBack(pathImageBack)
                    return
                } else {
                    const pathImage = path; // Se for um único caminho
                    setPathOne(pathImage);
                }
            }
        }
        fetchData()
    },[path])
    
    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={300}
            animationOutTiming={300}
            backdropOpacity={0.8}
            useNativeDriver={true}
            onBackdropPress={close}
            className={`justify-end p-0 m-0 `}
        >
            <View>
                {typeDocument === 'picture' ? (
                    <>
                        {!twoPicture && (
                            <Image 
                                className="w-full h-full object-contain" 
                                source={{ uri: pathOne }}
                            />
                        )}
                        {twoPicture && !viewingSide? (
                            <View className="items-center w-full bg-white rounded-t-3xl p-4">
                                <View className="w-full items-center justify-center mb-5 ">
                                    <View className="w-1/12 bg-neutral-400 rounded-xl h-1" />
                                </View>
                                <View className={`w-full`} >
                                    <Text style={{ ...FONTS.fontMedium, fontSize: 16}}>Visualização</Text>
                                </View>
                                <TouchableOpacity
                                    className="w-1/2 mb-4 mt-4 p-2.5 bg-primary rounded-lg"
                                    onPress={() => setViewingSide('front')}
                                >
                                    <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Frente</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="p-2.5 bg-primary rounded-lg w-1/2"
                                    onPress={() => setViewingSide('back')}
                                >
                                    <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Verso</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                {/* Exibe a imagem da frente ou verso com base no estado */}
                                {viewingSide === 'front' && (
                                    <Image className="w-full h-full object-contain" source={{uri:pathFront}}/>
                                )}
                                {viewingSide === 'back'  && (
                                    <Image className="w-full h-full object-contain" source={{uri:pathBack}}/>
                                )}

                                {/* Botão para fechar ou voltar para escolher frente/verso */}
                                <TouchableOpacity
                                    className="absolute top-5 right-5 bg-primary p-2 rounded-lg w-8 h-8 itens-center" 
                                    onPress={() => twoPicture ? setViewingSide(null) : close()}
                                    
                                >
                                    <Image 
                                        source={IMAGES.close}
                                        className={`w-full h-full`}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </>
                        )}
                    </>
                ) : (
                    // Exibição do PDF (placeholder, você pode usar um componente de visualização de PDF real aqui)
                    <View className={`w-full h-full`}>

                                            <Pdf
                                                trustAllCerts={false}
                                                enableDoubleTapZoom={true}
                                                source={{ uri: 'https://tourism.gov.in/sites/default/files/2019-04/dummy-pdf_2.pdf', cache: true }}
                                                onLoadComplete={(numberOfPages,filePath) => {
                                                    console.log(`Number of pages: ${numberOfPages}`);
                                                }}
                                                onPageChanged={(page,numberOfPages) => {
                                                    console.log(`Current page: ${page}`);
                                                }}
                                                onError={(error) => {
                                                    console.log(error);
                                                }}
                                                onPressLink={(uri) => {
                                                    console.log(`Link pressed: ${uri}`);
                                                }}
                                                className="w-full h-full object-contain"
                                            />
                        
                        <TouchableOpacity
                            className="absolute top-5 right-5 bg-primary p-2 rounded-lg w-8 h-8 itens-center" 
                            onPress={() => twoPicture ? typeDocument === 'picture'  ? setViewingSide(null) : close() : close()}    
                        >
                            <Image 
                                source={IMAGES.close}
                                className={`w-full h-full`}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                            
                    </View>
                )}
            </View>
        </Modal>
    );
};



export default DocumentVisible;
