import { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { FONTS } from "../../constants/theme";
import GetPathPicture from "../../function/getPathPicture";
import * as FileSystem from 'expo-file-system';
import { useNavigation, useTheme } from '@react-navigation/native';
import CreateAvalidPicture from "../../hooks/create/pictures";
import useCollaborator from "../../function/fetchCollaborator";
import UploadFile from "../../hooks/upload/picture";
import RBSheet from "react-native-raw-bottom-sheet";
import SuccessSheet from "../BottomSheet/SuccessSheet";
import DangerSheet from "../BottomSheet/DangerSheet";

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
type StatusPictureProps = {
    CNH: string | null;
    RG: string  | null;
    Work_Card: string | null;
    Address: string | null;
    School_History: string | null;
    Marriage_Certificate: string | null;
    Birth_Certificate: string[] | null;
};
type PropsCreateAvalidPicture = {
    picture :string
    status  :string
    cpf     :string
};
type Props = {
    documentName: string;
    visible: boolean;
    twoPicture:boolean;
    setPath: React.Dispatch<React.SetStateAction<PathPictureProps>>;
    setTypeDocument: React.Dispatch<React.SetStateAction<TypePictureProps>>;
    setPicturesStatus: React.Dispatch<React.SetStateAction<StatusPictureProps>>
    close  : () => void;
};


const DocumentSend = ({ documentName, twoPicture, setPicturesStatus, setTypeDocument, visible, close, setPath }: Props) => {
    const navigation = useNavigation<any>();
    const [front,setFront] = useState<any | null>(null)
    const [back ,setBack]  = useState<any | null>(null)
    const [selection ,setSelection]  = useState<String | null>(null)
    const { collaborator, fetchCollaborator } = useCollaborator();
    const [messageSheet, setMessageSheet] = useState(String);
    const [activeSheet, setActiveSheet]   = useState(String);
    const [noRepeat, setNoRepeat]   = useState(true);
    const [load, setLoad]   = useState(false);
    const refRBSheet = useRef<any>(null);
    const theme = useTheme();
    const { colors }: { colors : any} = theme;
    
    const pathToBase64 = async (uri : any) => {
        const base64String = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return base64String;
    };

    const sendPicture = async (option:string) => {
        let path:any;
        let type:any;

        switch (option) {
            case 'gallery':
                path = await GetPathPicture('gallery');
                type = 'picture'
                break;
            case 'camera':
                path = await GetPathPicture('camera')
                type = 'picture'
                break;
            case 'file':
                path = await GetPathPicture('file')
                type = 'pdf'
                break;
        };

        switch (documentName) {
            case 'Carteira de Trabalho':
                documentName = 'Work_Card'
                break;
            case 'CNH (opcional)':
                documentName = 'CNH'
                break
            case 'Comprovante de Endereço':
                documentName = 'Address'
                break
            case 'Histórico Escolar':
                documentName = 'School_History'
                break
            default:
                console.log(documentName)
                break;
        };

        const response = await UploadFile(path, documentName, 'complet', collaborator.CPF);
        
        if (response.status === 400) {
            setActiveSheet('danger');
            setMessageSheet(`Documento inválido`);
            Sheet();
            setFront(null);
            setBack(null);
            setLoad(false)
            throw new Error('Documento inválido');
        } else if (response.status !== 200) {
            setNoRepeat(true);
            setActiveSheet('danger');
            setMessageSheet(`Erro interno`);
            Sheet();
            setFront(null);
            setBack(null);
            setLoad(false)
            throw new Error('Erro interno no upload');
        };
        const pictureParams: PropsCreateAvalidPicture = {
            picture: documentName,
            status: 'pending',
            cpf: collaborator.CPF,
        };
        const createResponse = await CreateAvalidPicture(pictureParams);
        if (createResponse.status === 201) {
            switch (documentName) {
                case 'RG':
                    setTypeDocument((prevState) => ({
                        ...prevState,
                        RG: 'picture',
                    }));
                    setPicturesStatus((prevState) => ({
                        ...prevState,
                        RG: 'pending',
                    }));
                    setPath((prevState) => ({
                        ...prevState,
                        RG: [front, back],
                    }));
                    break;
                case 'CNH':
                    setTypeDocument((prevState) => ({
                        ...prevState,
                        CNH: 'picture',
                    }));
                    setPicturesStatus((prevState) => ({
                        ...prevState,
                        CNH: 'pending',
                    }));
                    setPath((prevState) => ({
                        ...prevState,
                        CNH: [front, back],
                    }));
                    break;
                case 'Work_Card':
                    setTypeDocument((prevState) => ({
                        ...prevState,
                        Work_Card: 'picture',
                    }));
                    setPicturesStatus((prevState) => ({
                        ...prevState,
                        Work_Card: 'pending',
                    }));
                    setPath((prevState) => ({
                        ...prevState,
                        Work_Card: [front, back],
                    }));
                    break;
                default:
                    break;
            }
            setActiveSheet('success');
            setMessageSheet(`Documentos salvos`);
            Sheet();
            setLoad(false)
            close()
        } else if (createResponse.status === 409) {
            setActiveSheet('danger');
            setMessageSheet('Imagem já existe');
            Sheet();
            setLoad(false)
        } else {
            setActiveSheet('danger');
            setMessageSheet('Erro ao salvar imagem');
            Sheet();
            setLoad(false)
        }
    };

    const handleSelectPictureSide = async (side:string) => {
        setSelection(side)
    }; 

    const handleSendPictureSide = async (send:string) => {
        const response = await GetPathPicture(send)
        if(response && response != 'cancel'){
            switch (selection) {
                case 'front':
                    setFront(response)
                    break;
                case 'back':
                    setBack(response)
                    break;
            }
        };
        setSelection(null)
    };

    const handleExit = () => {
        setSelection(null)
        setNoRepeat(true)
        close()
    };

    const Sheet = async () => {
        await refRBSheet.current.open();
    };


    useEffect(() => {
        const fetchData = async () => {
            if (front && back && noRepeat) {
                // Impede re-execução
                setNoRepeat(false);
                setLoad(true)
                const paths = [front, back];
                switch (documentName) {
                    case 'CNH (opcional)':
                        documentName = 'CNH'
                        break;
                    case 'Carteira de Trabalho':
                        documentName = 'Work_Card'
                        break;
                
                    default:
                        console.log(documentName)
                        break;
                };
                try {
                    // Fazendo o upload dos arquivos front e back
                    await Promise.all(
                        paths.map(async (path, index) => {
                            let side = index === 0 ? 'front' : 'back';
                            
                            // Fazendo o upload do arquivo
                            const response = await UploadFile(path, documentName, side, collaborator.CPF);
    
                            // Verificando o status do upload
                            if (response.status === 400) {
                                setActiveSheet('danger');
                                setMessageSheet(`Documento inválido`);
                                Sheet();
                                setFront(null);
                                setBack(null);
                                setLoad(false)
                                throw new Error('Documento inválido');
                            } else if (response.status !== 200) {
                                setNoRepeat(true);
                                setActiveSheet('danger');
                                setMessageSheet(`Erro interno`);
                                Sheet();
                                setFront(null);
                                setBack(null);
                                setLoad(false)
                                throw new Error('Erro interno no upload');
                            }
                        })
                    );
    
                    // Se todos os uploads forem bem-sucedidos, chamar CreateAvalidPicture
                    const pictureParams: PropsCreateAvalidPicture = {
                        picture: documentName,
                        status: 'pending',
                        cpf: collaborator.CPF,
                    };
    
                    const createResponse = await CreateAvalidPicture(pictureParams);
    
                    // Lidar com a resposta do CreateAvalidPicture
                    if (createResponse.status === 201) {
                        switch (documentName) {
                            case 'RG':
                                setTypeDocument((prevState) => ({
                                    ...prevState,
                                    RG: 'picture',
                                }));
                                setPicturesStatus((prevState) => ({
                                    ...prevState,
                                    RG: 'pending',
                                }));
                                setPath((prevState) => ({
                                    ...prevState,
                                    RG: [front, back],
                                }));
                                break;
                            case 'CNH':
                                setTypeDocument((prevState) => ({
                                    ...prevState,
                                    CNH: 'picture',
                                }));
                                setPicturesStatus((prevState) => ({
                                    ...prevState,
                                    CNH: 'pending',
                                }));
                                setPath((prevState) => ({
                                    ...prevState,
                                    CNH: [front, back],
                                }));
                                break;
                            case 'Work_Card':
                                setTypeDocument((prevState) => ({
                                    ...prevState,
                                    Work_Card: 'picture',
                                }));
                                setPicturesStatus((prevState) => ({
                                    ...prevState,
                                    Work_Card: 'pending',
                                }));
                                setPath((prevState) => ({
                                    ...prevState,
                                    Work_Card: [front, back],
                                }));
                                break;
                            default:
                                break;
                        }
                        setActiveSheet('success');
                        setMessageSheet(`Documentos salvos`);
                        Sheet();
                        setLoad(false)
                        close()
                    } else if (createResponse.status === 409) {
                        setActiveSheet('danger');
                        setMessageSheet('Imagem já existe');
                        Sheet();
                        setLoad(false)
                    } else {
                        setActiveSheet('danger');
                        setMessageSheet('Erro ao salvar imagem');
                        Sheet();
                        setLoad(false)
                    }
                } catch (error) {
                    console.error('Erro durante o processo:', error);
                    setActiveSheet('danger');
                    setMessageSheet('Algo deu errado, tente mais tarde');
                    Sheet();
                    setLoad(false)
                };
            }
        };
    
        fetchData();
    }, [front, back, noRepeat]);


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
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                height={215}
                openDuration={100}
                customStyles={{
                    container: {
                        backgroundColor: theme.dark ? colors.background : colors.cardBg,
                    },
                    draggableIcon: {
                        marginTop: 10,
                        marginBottom: 5,
                        height: 5,
                        width: 80,
                        backgroundColor: colors.border,
                    }
                }}
            >
                { activeSheet === "success" ?
                    <SuccessSheet message={messageSheet} />
                    :
                    <DangerSheet  message={messageSheet} />
                }
            </RBSheet>
            <> 
                { load ?
                    
                    <View className="items-center w-full bg-white rounded-t-3xl p-4">
                        <View className="w-full items-center justify-center mb-5 ">
                            <View className="w-1/12 bg-neutral-400 rounded-xl h-1" />
                        </View>
                        <View className={`my-10`}>
                            <ActivityIndicator color={`#2f2f2f`}/>
                            <Text style={{ ...FONTS.fontMedium, fontSize: 13}} className={`mt-2`}>Salvando documento</Text>
                        </View>
                    </View>
                :
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
                                        className={`w-1/2 mb-4 mt-4 p-2.5 ${front ? 'bg-success' : 'bg-primary'} rounded-lg`}
                                        onPress={()=>handleSelectPictureSide('front')}  
                                    >
                                        <Text className={`${front ? 'text-white' : 'text-dark'} text-center`} style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Frente</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className={`p-2.5 ${back ? 'bg-success' : 'bg-primary'} rounded-lg w-1/2 mb-4`} 
                                        onPress={()=>handleSelectPictureSide('back')}
                                    >
                                        <Text className={`${back ? 'text-white' : 'text-dark'} text-center`} style={{ ...FONTS.fontMedium, fontSize: 14, lineHeight: 21 }}>Verso</Text>
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
                }
                        
            </>
        </Modal>
    );
};



export default DocumentSend;
