import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, FONTS } from '../../constants/theme'
import { IMAGES } from '../../constants/Images'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromwishList } from '../../redux/reducer/wishListReducer'
import LikeBtn from '../LikeBtn'
import { BlurView } from 'expo-blur';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DocumentVisible from '../Modal/DocumentVisible'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';

type Props = {
    documentName: string;
    sendDocument: boolean;
    typeDocument:string;
    twoPicture:boolean;
    statusDocument:string;

    image?: any;
    pdf?:any
};

const Cardstyle4 = ({
    documentName,
    sendDocument,
    typeDocument,
    twoPicture,
    statusDocument,
    image,
    pdf

}: Props) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const [isBlurred, setIsBlurred] = useState(true); // Controla o desfoque
    const [viewingDocument, setViewingDocument] = useState(false);
  

    const handlePress = () => {
        setIsBlurred(!isBlurred); // Alterna entre desfocado e normal
    };

    const handleCloseVisibleDocument = () => {
        setViewingDocument(false) 
    };
    
    return (
        <View
            style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start' }}
        >
            <DocumentVisible typeDocument={typeDocument} visible={viewingDocument} twoPicture={twoPicture} Image2={image} Image={image} PDF={pdf} close={handleCloseVisibleDocument}/>
            <View style={{ width: '40%', alignItems: 'center' }}>
            <TouchableOpacity onPress={handlePress}>
                <View
                    style={{
                        height: undefined,
                        width: '100%',
                        backgroundColor: COLORS.primary,
                        borderRadius: 22,
                        aspectRatio: 1 / 1.2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    {typeDocument === 'picture' ? (
                        <>
                            <Image
                                style={{ height: undefined, width: '100%', aspectRatio: 1 / 1.2 }}
                                source={image}
                            />
                            {isBlurred && (
                                <BlurView
                                    intensity={80}
                                    tint="dark"
                                    style={StyleSheet.absoluteFill}
                                    experimentalBlurMethod="dimezisBlurView"
                                />
                            )}
                            {isBlurred && (
                                <FeatherIcon
                                    style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -15 }, { translateY: -15 }] }}
                                    color={COLORS.primary}
                                    size={30}
                                    name="eye-off"
                                />
                            )}
                        </>
                    ) : (
             
                      <>
                           <WebView
                               source={{ uri: 'https://docs.google.com/gview?embedded=true&url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }}
                               style={styles.pdf}
                               onError={() => console.log('Erro ao carregar PDF')}
                           />
                       {isBlurred && (
                                <BlurView
                                    intensity={80}
                                    tint="dark"
                                    style={StyleSheet.absoluteFill}
                                    experimentalBlurMethod="dimezisBlurView"
                                />)}
                                {isBlurred && (
                                <FeatherIcon
                                    style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -15 }, { translateY: -15 }] }}
                                    color={COLORS.primary}
                                    size={30}
                                    name="eye-off"
                                />
                            )}
                      </>
                    )}
                </View>
            </TouchableOpacity>
            </View>
            <View
                style={{
                    width: '60%',
                    paddingHorizontal: 20,
                }}
            >
                <View>
                    <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, paddingRight: 40 }}>{documentName}</Text>
                    <Text style={{ ...FONTS.fontRegular, fontSize: 12, color: theme.dark ? 'rgba(255,255,255,.7)' : '#6A6A6A', marginTop: 5 }}>{typeDocument =='picture' ? 'Imagem' : 'PDF'}</Text>
                </View>
                <View className={`flex-col flex gap-2`} >
                    
                    <View
                        style={{
                            padding: 5,
                            paddingHorizontal: 10,
                            borderRadius: 30,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                        }}
                    >
                        {/* <Image
                            style={[GlobalStyleSheet.image2, { tintColor: show ? COLORS.card : COLORS.primary }]}
                            source={IMAGES.shoppingbag}
                        /> */}
                        <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: statusDocument == 'aproved' ? COLORS.success : statusDocument == 'aproved' ?  COLORS.danger :  COLORS.dark }}>{statusDocument == 'aproved' ? 'Aprovado' :  statusDocument == 'reproved' ? 'Reprovado' : 'Pendente'}</Text>
                    </View>
                   
                    { sendDocument &&
                        <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    padding: 10,
                                    paddingHorizontal: 15,
                                    backgroundColor: COLORS.primary,
                                    borderRadius: 30,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                }}
                            >
                                <Text className={`text-dark`} style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Enviar</Text>
                        </TouchableOpacity>
                    }
                        
                    <TouchableOpacity
                        onPress={()=>setViewingDocument(true)}
                        activeOpacity={0.8}
                        style={{
                                padding: 10,
                                paddingHorizontal: 20,
                                backgroundColor: COLORS.dark,
                                borderRadius: 30,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                        }}
                    >
                        <Text className={`text-white`} style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21}}>Visualizar</Text>
                    </TouchableOpacity>
                        
                </View>
            
                
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    eyeIcon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -15 }, { translateY: -15 }],
        zIndex: 10, // Coloca o ícone acima do BlurView
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});

export default Cardstyle4;
