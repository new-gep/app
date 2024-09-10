import { useState } from "react";
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import GetPathPicture from "../../function/getPathPicture";
import * as FileSystem from 'expo-file-system';
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
    setPath: React.Dispatch<React.SetStateAction<PathPictureProps>>;
    setTypeDocument: React.Dispatch<React.SetStateAction<TypePictureProps>>;
    close  : () => void;
};


const DocumentSend = ({ documentName, setTypeDocument,visible, close, setPath }: Props) => {
    
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
        
    }


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
            <View className="items-center w-full bg-white rounded-t-3xl p-4">
                <View className="w-full items-center justify-center mb-5 ">
                    <View className="w-1/12 bg-neutral-400 rounded-xl h-1" />
                </View>
                <View className={`w-full`} >
                    <Text style={{ ...FONTS.fontMedium, fontSize: 16}}>Envio de Documento - {documentName}</Text>
                </View>
                <View className="items-center w-full">
                        <TouchableOpacity
                            className="w-1/2 mb-4 mt-4 p-2.5 bg-primary rounded-lg" 
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
                        <TouchableOpacity
                            className="p-2.5 bg-primary rounded-lg w-1/2"  
                            onPress={()=>sendPicture('file')}  
                        >
                            <Text className="text-dark text-center" style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>PDF</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </Modal>
    );
};



export default DocumentSend;
