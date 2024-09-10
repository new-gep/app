import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import GetPathPicture from "../../function/getPathPicture";
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
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
    visible: boolean;
    twoPicture:boolean;
    setPath: React.Dispatch<React.SetStateAction<PathPictureProps>>;
    setTypeDocument: React.Dispatch<React.SetStateAction<TypePictureProps>>;
    close  : () => void;
};


const DocumentSend = ({ documentName, twoPicture, setTypeDocument,visible, close, setPath }: Props) => {
    const navigation = useNavigation<any>();
    const [front,setFront] = useState()
    const [back ,setBack]  = useState()
    const [selection ,setSelection]  = useState<String | null>(null)
    
    const pathToBase64 = async (uri : any) => {
        const base64String = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return base64String;
    };

    const sendPicture = async (option:string) => {
        let path:any;
        let type:any
        switch (option) {
            case 'gallery':
                path = await GetPathPicture('gallery');
                path = await pathToBase64(path)
                type = 'picture'
                break;
            case 'camera':
                path = await GetPathPicture('camera')
                path = await pathToBase64(path)
                type = 'picture'
                break;
            case 'file':
                path = await GetPathPicture('file')
                path = await pathToBase64(path)
                type = 'pdf'
                break;
        };

        switch (documentName) {
            case 'RG':
                setPath((prevState) => {
                    return {
                        ...prevState,
                        RG: path,
                    }
                });
                setTypeDocument((prevState) => {
                    return {
                        ...prevState,
                        RG: type,
                    };
                });
                break;
            case 'CNH':
                setPath((prevState) => {
                    return {
                        ...prevState,
                        CNH: path,
                    }
                });
                setTypeDocument((prevState) => {
                    return {
                        ...prevState,
                        CNH: type,
                    };
                });
                break;
            case '':

            default:
                break;
        };
        
    };

    const handleSelectPictureSide = async (side:string) => {
        setSelection(side)
    }; 

    const handleSendPictureSide = async (send:string) => {
        const response = await GetPathPicture(send)
        if(response){
            switch (selection) {
                case 'front':
                    setFront(response)
                    break;
                case 'back':
                    setBack(response)
                    break;
            
                default:
                    break;
            }
        }
    };

    const handleExit = () => {
        setSelection(null)
        close()
    };


    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={300}
            animationOutTiming={300}
            backdropOpacity={0.8}
            useNativeDriver={true}
            onBackdropPress={handleExit}
            className={`justify-end p-0 m-0 `}
        >
            <View className="items-center w-full bg-white rounded-t-3xl p-4">
                <View className="w-full items-center justify-center mb-5 ">
                    <View className="w-1/12 bg-neutral-400 rounded-xl h-1" />
                </View>
                <View className={`w-full`} >
                    <Text style={{ ...FONTS.fontMedium, fontSize: 16}}>Envio de Documento - {documentName} {`${selection == 'front' ? '(Frente)' : selection == 'backa'? '(Verso)' : ''}`}</Text>
                </View>
                { !selection &&
                    <View className={`my-5 px-2`}>
                    <Text style={{ ...FONTS.fontMedium, fontSize: 13}}>
                        Você pode enviar imagens, tirar fotos diretamente ou optar por enviar um PDF com o documento completo.
                    </Text>
                    </View>
                }
                <View className="items-center w-full">
                    
                   { !selection ?
                    <>
                        { twoPicture ?
                            <>
                                <TouchableOpacity
                                    className="w-1/2 mb-4 mt-4 p-2.5 bg-primary rounded-lg" 
                                    onPress={()=>handleSelectPictureSide('front')}  
                                >
                                    <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Frente</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="p-2.5 bg-primary rounded-lg w-1/2 mb-4"    
                                    onPress={()=>handleSelectPictureSide('back')}
                                >
                                    <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Verso</Text>
                                </TouchableOpacity>
                            </>
                        :
                            <>
                                <TouchableOpacity
                                    className="p-2.5 bg-primary rounded-lg w-1/2 mb-4"    
                                    onPress={()=>sendPicture('camera')}
                                >
                                    <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Foto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="p-2.5 bg-primary rounded-lg w-1/2 mb-4"  
                                    onPress={()=>sendPicture('gallery')}  
                                >
                                    <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Galeria</Text>
                                </TouchableOpacity>
                            </>
                        }
                        <TouchableOpacity
                            className="p-2.5 bg-primary rounded-lg w-1/2 mb-4"    
                            onPress={()=>sendPicture('file')}
                        >
                            <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>PDF</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <>
                        <TouchableOpacity
                            className="p-2.5 bg-primary rounded-lg w-1/2 mb-4 mt-4"    
                            onPress={()=>handleSendPictureSide('camera')}
                        >
                            <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Foto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="p-2.5 bg-primary rounded-lg w-1/2 mb-4"  
                            onPress={()=>handleSendPictureSide('gallery')}  
                        >
                            <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Galeria</Text>
                        </TouchableOpacity>
                    </>
                    }

                </View>
            </View>
        </Modal>
    );
};



export default DocumentSend;
