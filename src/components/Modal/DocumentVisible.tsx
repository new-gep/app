import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image, ActivityIndicator, Dimensions, ScrollView,  } from "react-native";
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import { FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import WebView from "react-native-webview";
import * as FileSystem from 'expo-file-system';
import Pdf from "react-native-pdf";
import { COLORS } from "../../constants/theme"; // Adicione esta importação

type Props = {  
    typeDocument: string;
    twoPicture: boolean;
    visible: boolean;
    path?: any
    documentName: string
    close: () => void;
};



const { width, height } = Dimensions.get("window");

const DocumentVisible = ({ path, twoPicture, typeDocument, visible, close, documentName }: Props) => {
    const [viewingSide, setViewingSide] = useState<'front' | 'back' | null>(null);
    const [loading, setLoading] = useState(true);
    const [pathFront, setPathFront] = useState<any>()
    const [pathBack, setPathBack] = useState<any>()
    const [pathOne, setPathOne] = useState<any>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log('path', path)
                
                setLoading(true);
                if (path) {
                    if (Array.isArray(path) && path.length > 1) {
                        const pathImageFront = path[0];
                        const pathImageBack = path[1];
                        setPathFront(pathImageFront);
                        setPathBack(pathImageBack);
                    } else {
                        const pathImage = path;
                        setPathOne(pathImage);
                    }
                }
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [path])


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
            {/* Overlay de loading */}
            {loading && (
                <View className="absolute inset-0 bg-white/90 flex items-center justify-center z-50">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )}

            {/* Botão de fechar (agora fora do overlay de loading) */}
            {(!twoPicture || typeDocument !== 'picture') && (
                <TouchableOpacity
                    style={{ 
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        backgroundColor: COLORS.primary,
                        padding: 8,
                        borderRadius: 8,
                        width: 32,
                        height: 32,
                        alignItems: 'center',
                        zIndex: 50
                    }}
                    onPress={close}
                >
                    <Image
                        source={IMAGES.close}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}

            <View>
                {typeDocument === 'picture' ? (
                    <>
                        {!twoPicture && !loading && (
                            <View className="w-full h-full bg-white p-3">
                                <Text style={{ ...FONTS.fontMedium, fontSize: 16 }} className="mb-4">
                                    {documentName}
                                </Text>
                                <GestureHandlerRootView>
                                    <ImageZoom   
                                        isDoubleTapEnabled={true}
                                        isPanEnabled={true}
                                        // style={{ width: '100%', height: Dimensions.get('window').height * 0.7, resizeMode: 'contain' }}
                                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                        className="rounded-lg"
                                        source={{ uri: pathOne }}
                                    />
                                </GestureHandlerRootView>
                            </View>
                        )}
                        {twoPicture && !viewingSide && !loading && (
                            <View className="items-center w-full bg-white rounded-t-3xl p-4">
                                <View className="w-full items-center justify-center mb-5 ">
                                    <View className="w-1/12 bg-neutral-400 rounded-xl h-1" />
                                </View>
                                <View className={`w-full`} >
                                    <Text style={{ ...FONTS.fontMedium, fontSize: 16 }}>{documentName}</Text>
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
                        )}
                        {!loading && viewingSide && (
                            <View className="w-full h-full bg-white p-4">
                                <GestureHandlerRootView>
                                    <Text style={{ ...FONTS.fontMedium, fontSize: 16 }} className="mb-4">
                                        {documentName} - {viewingSide === 'front' ? 'Frente' : 'Verso'}
                                    </Text>
                                
                                {viewingSide === 'front' && (
                                    <ImageZoom style={{ width: '100%', height: Dimensions.get('window').height * 0.7, resizeMode: 'contain' }} source={{ uri: pathFront }} />
                                )}
                                {viewingSide === 'back' && (
                                    <ImageZoom style={{ width: '100%', height: Dimensions.get('window').height * 0.7, resizeMode: 'contain' }} source={{ uri: pathBack }} />
                                    )}
                                </GestureHandlerRootView>
                            </View>
                        )}
                    </>
                ) : (
                    !loading && (
                        <View className={`w-full h-full bg-white  p-4`}>
                            <Text style={{ ...FONTS.fontMedium, fontSize: 16 }} className="mb-4">
                                {documentName}
                            </Text>
                            <Pdf
                                //@ts-ignore
                                trustAllCerts={false}
                                //@ts-ignore
                                enableDoubleTapZoom={true}
                                source={{ uri: pathOne, cache: true }}
                                onLoadComplete={(numberOfPages, filePath) => {
                                    // console.log(`Number of pages: ${numberOfPages}`);
                                }}
                                onPageChanged={(page, numberOfPages) => {
                                    // console.log(`Current page: ${page}`);
                                }}
                                onError={(error) => {
                                    // console.log(error);
                                }}
                                onPressLink={(uri) => {
                                    // console.log(`Link pressed: ${uri}`);
                                }}
                                className="w-full h-full object-contain"
                            />
                        </View>
                    )
                )}
            </View>
        </Modal>
    );
};

export default DocumentVisible;