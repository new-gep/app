import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import WebView from "react-native-webview";
import * as FileSystem from 'expo-file-system';
import React from "react";
import Pdf from "react-native-pdf";
import { COLORS } from "../../constants/theme"; // Adicione esta importação
import { Ionicons } from '@expo/vector-icons'; // Adicione esta importação

type Props = {
    typeDocument: string;
    twoPicture: boolean;
    visible: boolean;
    path?: any
    documentName: string
    close: () => void;
    onSignaturePress: () => void;
};

const DocumentVisible = ({ path, twoPicture, typeDocument, visible, close, onSignaturePress }: Props) => {
    const [viewingSide, setViewingSide] = useState<'front' | 'back' | null>(null);
    const [loading, setLoading] = useState(true);
    const [pathFront, setPathFront] = useState<any>()
    const [pathBack, setPathBack] = useState<any>()
    const [pathOne, setPathOne] = useState<any>()

    useEffect(() => {
        const fetchData = async () => {
            try {
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
            <TouchableOpacity
                className="absolute top-5 right-5 bg-primary p-2 rounded-lg w-8 h-8 items-center z-50"
                onPress={() => {
                    if (twoPicture && typeDocument === 'picture') {
                        setViewingSide(null);
                    } else {
                        close();
                    }
                }}
            >
                <Image
                    source={IMAGES.close}
                    className={`w-full h-full`}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {/* Botão de assinatura */}
            {(!loading && typeDocument === 'document') && (
                <TouchableOpacity
                    className="absolute bottom-5 right-5 bg-yellow-500 bg-opacity-70 p-3 rounded-full shadow-lg"
                    onPress={onSignaturePress}
                >
                    <Ionicons name="pencil" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            )}

            {/* Novo botão de assinatura levemente transparente */}
            {(!loading && typeDocument === 'document') && (
                <TouchableOpacity
                    className="absolute bottom-20 right-5 bg-yellow-500 bg-opacity-50 p-3 rounded-full shadow-lg"
                    onPress={onSignaturePress}
                >
                    <Ionicons name="pencil" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            )}

            <View>
                {typeDocument === 'picture' ? (
                    <>
                        {!twoPicture && !loading && (
                            <Image 
                                className="w-full h-full object-contain" 
                                source={{ uri: pathOne }}
                            />
                        )}
                        {twoPicture && !viewingSide && !loading && (
                            <View className="items-center w-full bg-white rounded-t-3xl p-4">
                                <View className="w-full items-center justify-center mb-5 ">
                                    <View className="w-1/12 bg-neutral-400 rounded-xl h-1" />
                                </View>
                                <View className={`w-full`} >
                                    <Text style={{ ...FONTS.fontMedium, fontSize: 16 }}>Visualização</Text>
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
                            <>
                                {viewingSide === 'front' && (
                                    <Image className="w-full h-full object-contain" source={{ uri: pathFront }} />
                                )}
                                {viewingSide === 'back' && (
                                    <Image className="w-full h-full object-contain" source={{ uri: pathBack }} />
                                )}
                            </>
                        )}
                    </>
                ) : (
                    !loading && (
                        <View className={`w-full h-full`}>
                            <Pdf
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