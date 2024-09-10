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
import { Buffer } from "buffer";
import { WebView } from 'react-native-webview';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DocumentSend from '../Modal/DocumentSend'

type PathPictureProps = {
    CNH: string | string[] | null;
    RG: string | string[] | null;
    Work_Card: string | string[] | null;
    Address: string | null;
    School_History: string | null;
    Marriage_Certificate: string | null;
    Birth_Certificate: string[] | null;
};

type TypePictureProps = {
    CNH: string | null;
    RG: string  | null;
    Work_Card: string | null;
    Address: string | null;
    School_History: string | null;
    Marriage_Certificate: string | null;
    Birth_Certificate: string[] | null;
};

type Props = {
    documentName: string;
    sendDocument: boolean;
    typeDocument:string;
    twoPicture:boolean;
    statusDocument:string;
    path?:any;
    setPath: React.Dispatch<React.SetStateAction<PathPictureProps>>;
    setTypeDocument: React.Dispatch<React.SetStateAction<TypePictureProps>>;
};

const Cardstyle4 = ({
    documentName,
    sendDocument,
    typeDocument,
    twoPicture,
    statusDocument,
    path,
    setTypeDocument,
    setPath
}: Props) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const [isBlurred, setIsBlurred] = useState(true); // Controla o desfoque
    const [viewingDocument, setViewingDocument] = useState(false);
    const [sendModalDocument, setSendModalDocument] = useState(false);

    const handlePress = () => {
        setIsBlurred(!isBlurred); // Alterna entre desfocado e normal
    };

    const handleCloseVisibleDocument = () => {
        setViewingDocument(false) 
    };

    const handleCloseSendDocument = () => {
        setSendModalDocument(false)
    };

    const loadPdfBase64 = async (pdfPath) => {
    const pdfBase64 = await FileSystem.readAsStringAsync(pdfPath, {
        encoding: FileSystem.EncodingType.Base64,
    });
    return `data:application/pdf;base64,${pdfBase64}`;
    };


    useEffect(()=>{
        console.log('mudou')
    },[path, typeDocument])

    
    return (
        <View
            style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start' }}
        >
            <DocumentSend setTypeDocument={setTypeDocument} setPath={setPath} close={handleCloseSendDocument} visible={sendModalDocument} documentName={documentName} twoPicture={twoPicture} />
            <DocumentVisible documentName={documentName} setTypeDocument={setTypeDocument} path={path} typeDocument={typeDocument} visible={viewingDocument} twoPicture={twoPicture} close={handleCloseVisibleDocument}/>
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
                    {typeDocument === 'picture' ? 
                            <>
                                <Image
                                    style={{ height: undefined, width: '100%', aspectRatio: 1 / 1.2 }}
                                    source={{ uri: `data:application/pdf;base64,${path}` }}
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
                        :
                     typeDocument === 'pdf' ?
                            <>       
                                <View className={`w-full h-full items-center justify-center`}>
                                    <MaterialCommunityIcons name="folder-remove" size={30} color="black" />
                                    <Text style={{ ...FONTS.fontMedium }} className={`text-xs mt-3 text-center`}>
                                        PDF não pode{"\n"} ser visto
                                    </Text>
                                </View>
                                
                                
                                {isBlurred && 
                                    (
                                        <BlurView
                                            intensity={80}
                                                    tint="dark"
                                                    style={StyleSheet.absoluteFill}
                                                    experimentalBlurMethod="dimezisBlurView"
                                        />
                                    )
                                }
                                {isBlurred && 
                                    (
                                        <FeatherIcon
                                            style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -15 }, { translateY: -15 }] }}
                                            color={COLORS.primary}
                                            size={30}
                                            name="eye-off"
                                        />
                                    )
                                }
                                        
                            </>
                        :
                            <View className={`items-center px-5`}>
                                <Ionicons name="document-text-outline" size={30} color="black" />
                                <Text style={{ ...FONTS.fontMedium }} className={`text-xs mt-3 text-center`}>
                                    Documento {"\n"} pendente
                                </Text>
                            </View>
                    }
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
                    <Text style={{ ...FONTS.fontRegular, fontSize: 12, color: theme.dark ? 'rgba(255,255,255,.7)' : '#6A6A6A', marginTop: 5 }}>{typeDocument =='picture' ? 'Imagem' : typeDocument =='picture' ? 'PDF' : 'Pendente'}</Text>
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
                        <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: statusDocument == 'approved' ? COLORS.success : statusDocument == 'approved' ?  COLORS.danger :  COLORS.dark }}>{statusDocument == 'approved' ? 'Aprovado' :  statusDocument == 'reproved' ? 'Reenviar' : statusDocument == 'pending' ? 'Em Análise' :'Pendente'}</Text>
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
                                onPress={()=>setSendModalDocument(true)}
                            >
                                <Text className={`text-dark`} style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Enviar</Text>
                        </TouchableOpacity>
                    }
                        
                    { !sendDocument && typeDocument != 'pdf' &&
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
                    }
                        
                </View>
            
                
            </View>
        </View>
    );
};


export default Cardstyle4;
