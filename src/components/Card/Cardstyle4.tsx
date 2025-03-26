import * as React from 'react';
import { useState,useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native'
import { COLORS, FONTS } from '../../constants/theme'
import { IMAGES } from '../../constants/Images'
import { GlobalStyleSheet } from '../../constants/StyleSheet'
import { useTheme } from '@react-navigation/native'
import { BlurView } from 'expo-blur';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DocumentVisible from '../Modal/DocumentVisible'
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DocumentSend from '../Modal/DocumentSend'
import { ActivityIndicator } from 'react-native-paper'
import Pdf from 'react-native-pdf';

interface Props {
    // Props para documento
    documentName?: string;
    sendDocument?: boolean;
    typeDocument?: string;
    statusDocument?: string | null;
    twoPicture?: boolean;
    path?: any;
    jobId?: number;
    setStatusDocument?: any;
    
    // Props para categoria
    id?: any;
    image?: any;
    price?: any;
    brand?: any;
    countnumber?: any;
    title?: any;
    onPress?: () => void;
    onPress2?: () => void;
    onPress5?: () => void;
    product?: boolean;
}

const Cardstyle4 = ({documentName, sendDocument, typeDocument, statusDocument, setStatusDocument, twoPicture, path, jobId}: Props) => {
    const theme = useTheme();
    const { colors }: { colors: any } = theme;
    const [isBlurred, setIsBlurred] = useState(true); // Controla o desfoque
    const [viewingDocument, setViewingDocument] = useState(false);
    const [sendModalDocument, setSendModalDocument] = useState(false);
    const [typePicture, setTypePicture] = useState<any | null>(null)
    const [sendPicture, setSendPicture] = useState<any | null>(null)
    const [newPathPicture, setNewPathPicture] = useState<string | string[] | null>(null)
    const [pathPicture, setPathPicture] = useState<any | null | string[]>(null)
    const [pathPictureSide, setPathPictureSide] = useState<any | null>(null)

    const handlePress = () => {
        setIsBlurred(!isBlurred); // Alterna entre desfocado e normal
    };

    const handleCloseVisibleDocument = () => {
        setViewingDocument(false) 
    };

    const handleCloseSendDocument = () => {
        setSendModalDocument(false)
    };

    useEffect(() => {
        const fetchData = async () => {
            try{
                const resolvedPath = await path;
                const resolvedType = await typeDocument; 
                console.log(documentName)
                setSendPicture(sendDocument)
                if (resolvedPath && resolvedType) {
                    setTypePicture(resolvedType)
                    setPathPictureSide(resolvedPath)
                    
                    if (Array.isArray(resolvedPath) && resolvedPath.length > 1) {
                        const pathImage = resolvedPath[0];
                        setPathPicture(pathImage);
                        return
                    } else {
                        const pathImage = resolvedPath;
                        setPathPicture(pathImage);
                    }
                };
            }catch(e){
                console.log(e)
            }
        };
    
        fetchData();
    }, [statusDocument, path, typeDocument]); // Dependendo da alteração em statusDocument

    useEffect(()=>{
        if(newPathPicture){
            setPathPictureSide(newPathPicture)
            if (Array.isArray(newPathPicture) && newPathPicture.length > 1) {
                const pathImage = newPathPicture[0];
                setPathPicture(pathImage);
                return
            } else {
                const pathImage = newPathPicture;
                setPathPicture(pathImage);
            }
        }
    },[newPathPicture])


    return (
        <View
            style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-start' }}
        >
            <DocumentSend statusDocument={statusDocument} setStatusDocument={setStatusDocument} jobId={jobId} setSendPicture={setSendPicture} setTypeDocument={setTypePicture} setPath={setNewPathPicture} close={handleCloseSendDocument} visible={sendModalDocument} documentName={documentName} twoPicture={twoPicture} />
            <DocumentVisible documentName={documentName}  path={pathPictureSide} typeDocument={typePicture} visible={viewingDocument} twoPicture={twoPicture} close={handleCloseVisibleDocument}/>
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
                        { !statusDocument ||  (typePicture && pathPicture) ?
                            <>
                                {typePicture === 'picture' ? 
                                        <>
                                            <Image
                                                style={{ height: undefined, width: '100%', aspectRatio: 1 / 1.2 }}
                                                source={{ uri: pathPicture }} 
                                                onError={(e) => console.log('Erro ao carregar a imagem:', e.nativeEvent.error)}
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
                                    typePicture === 'pdf' ?
                                        <>       
                                             <Pdf
                                                trustAllCerts={false}
                                                source={{ uri: pathPicture, cache: true }}
                                                onLoadComplete={(numberOfPages,filePath) => {
                                                    // console.log(`Number of pages: ${numberOfPages}`);
                                                }}
                                                onPageChanged={(page,numberOfPages) => {
                                                    // console.log(`Current page: ${page}`);
                                                }}
                                                onError={(error) => {
                                                    // console.log(error);
                                                }}
                                                onPressLink={(uri) => {
                                                    // console.log(`Link pressed: ${uri}`);
                                                }}
                                                style={{ height: undefined, width: '100%', aspectRatio: 1 / 1.2 }}
                                            />

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
                            
                            </>
                            :
                            <View className={`items-center px-5`}>
                                <ActivityIndicator 
                                    color={`#2f2f2f`}
                                />
                            </View>
                        }
                    </View>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    width: '60%',
                    paddingHorizontal: 10,
                }}
            >
                <View>
                    <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title, paddingRight: 40 }}>{documentName}</Text>
                    <Text style={{ ...FONTS.fontRegular, fontSize: 12, color: theme.dark ? 'rgba(255,255,255,.7)' : '#6A6A6A', marginTop: 5 }}>{typePicture =='picture' ? 'Imagem' : typePicture =='pdf' ? 'PDF' : 'Pendente'}</Text>
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
                   
                    { sendPicture &&
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
                        


                    { !sendPicture && 
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
