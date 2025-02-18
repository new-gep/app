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
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdatePicture from "../../hooks/update/picture";
import { useCollaboratorContext } from "../../context/CollaboratorContext";
import JobPicture from "../../hooks/upload/job";
import UpdateJob from "../../hooks/update/job/default";


type PropsCreateAvalidPicture = {
    picture :string
    status  :string
    cpf     :string
};

type PropsUpdateAvalidPicture = {
    picture :string
    status  :string
};

type Props = {
    documentName: string;
    visible: boolean;
    twoPicture:boolean;
    close  : () => void;
    statusDocument:any;
    setTypeDocument:any;
    setSendPicture:any;
    setPath:any;
    jobId:any;
};


const DocumentSend = ({jobId, statusDocument ,setSendPicture , documentName, twoPicture, setTypeDocument, setPath, visible, close }: Props) => {
    const navigation = useNavigation<any>();
    const [front,setFront] = useState<any | null>(null)
    const [back ,setBack]  = useState<any | null>(null)
    const [selection ,setSelection]  = useState<String | null>(null)
    const { collaborator, fetchCollaborator } = useCollaborator();
    const { validateCollaborator, missingData } = useCollaboratorContext();
    const [messageSheet, setMessageSheet] = useState(String);
    const [activeSheet, setActiveSheet]   = useState(String);
    const [noRepeat, setNoRepeat]   = useState(true);
    const [load, setLoad]   = useState(false);
    const refRBSheet = useRef<any>(null);
    const theme = useTheme();
    const { colors }: { colors : any} = theme;
    
    
    
    const uploadPictureStorage = async (path:any, type:string, document:string) => {
        const existingData = await AsyncStorage.getItem('picture');
        let pictureData = existingData ? JSON.parse(existingData) : {};

        // Passo 2: Mesclar o novo dado com os existentes
        pictureData = {
            ...pictureData, // Preserva os dados existentes
            [document]:{
                path:path,
                type:type
            },     
        };
                
        // Passo 3: Salvar de volta o objeto atualizado no AsyncStorage
        await AsyncStorage.setItem('picture', JSON.stringify(pictureData));
        return
    };
    
    const sendPicture = async (option:string) => {
        try{
            setLoad(true)
            let path:any;
            let type:any;
            let doc :string = 'complet';

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
                    if(path.error){
                        setActiveSheet('danger');
                        setMessageSheet(`Arquivo muito grande ou inválido`);
                        Sheet();
                        return
                    }
                    type = 'pdf'
                    break;
            };
    
            switch (true) { // Usamos `true` para que cada `case` seja uma condição
                case documentName.includes('Carteira de Trabalho'):
                    documentName = 'Work_Card';
                    break;
                case documentName.includes('RG'):
                    documentName = 'RG';
                    break;
                case documentName.includes('CNH (opcional)'):
                    documentName = 'CNH';
                    break;
                case documentName.includes('Titulo de Eleitor (opcional)'):
                    documentName = 'Voter_Registration';
                    break;
                case documentName.includes('Comprovante de Endereço'):
                    documentName = 'Address';
                    break;
                case documentName.includes('Histórico Escolar'):
                    documentName = 'School_History';
                    break;
                case documentName.includes('Certificado Militar'):
                    documentName = 'Military_Certificate';
                    break;
                case documentName.includes('Certidão de Casamento'):
                    documentName = 'Marriage_Certificate';
                    break;
                case documentName.includes('Certidão de Nascimento'):
                    let children = extractNameChildren(documentName)
                    doc = `Birth_Certificate_${children}`;
                    documentName = `Birth_Certificate_${children}`;
                    break;
                case documentName.includes('Exame Admissional'):
                        documentName = 'medical'
                        const propsDocument = {
                            file:path,
                            name: "medical",
                            id  :jobId,
                            signature:false
                        }
                        const response = await JobPicture(propsDocument);
                        if (response.status !== 200) {
                            setNoRepeat(true);
                            setActiveSheet('danger');
                            setMessageSheet(`Erro interno`);
                            Sheet();
                            setFront(null);
                            setBack(null);
                            setLoad(false)
                            throw new Error('Erro interno no upload');
                        };
                    break;
                case documentName.includes('Carta a Punho'):
                    documentName = 'Dismissal_Hand';
                        const propsDocumentHand = {
                            file:path,
                            name: documentName,
                            id  :jobId,
                            signature:false
                        }
                        const responseHand = await JobPicture(propsDocumentHand);
                        if (responseHand.status !== 200) {
                            setNoRepeat(true);
                            setActiveSheet('danger');
                            setMessageSheet(`Erro interno`);
                            Sheet();
                            setFront(null);
                            setBack(null);
                            setLoad(false)
                            throw new Error('Erro interno no upload');
                        };
                    break;
                    case documentName.includes('Atestado'):
                    documentName = 'Attest_Ausence';
                        const propsDocumentAttest = {
                            file:path,
                            name: documentName,
                            id  :jobId,
                            signature:false
                        }
                        const responseAttest = await JobPicture(propsDocumentAttest);
                        if (responseAttest.status !== 200) {
                            setNoRepeat(true);
                            setActiveSheet('danger');
                            setMessageSheet(`Erro interno`);
                            Sheet();
                            setFront(null);
                            setBack(null);
                            setLoad(false)
                            throw new Error('Erro interno no upload');
                        };
                    break;
                case documentName.includes('Exame Demissional'):
                    documentName = 'Dismissal_Medical_Examination';
                        const propsDocumentDismissalExam = {
                            file:path,
                            name: documentName,
                            id  :jobId,
                            signature:false
                        }
                        const responseDismissalExam = await JobPicture(propsDocumentDismissalExam);
                        if (responseDismissalExam.status !== 200) {
                            setNoRepeat(true);
                            setActiveSheet('danger');
                            setMessageSheet(`Erro interno`);
                            Sheet();
                            setFront(null);
                            setBack(null);
                            setLoad(false)
                            throw new Error('Erro interno no upload');
                        };
                    break;
                default:
                    console.log(`Documento não identificado: ${documentName}`);
                    return;
            };

            if(documentName != 'medical' && documentName.toLowerCase() != 'dismissal_hand' && documentName.toLowerCase() != 'dismissal_medical_examination'){
                const response = await UploadFile(path, documentName, doc, collaborator.CPF);
                if (response.status === 400) {
                    setActiveSheet('danger');
                    setMessageSheet(`Documento inválido`);
                    Sheet();
                    setFront(null);
                    setBack(null);
                    setLoad(false)
                    throw new Error('Documento inválido');
                }
                else if (response.status !== 200) {
                    setNoRepeat(true);
                    setActiveSheet('danger');
                    setMessageSheet(`Erro interno`);
                    Sheet();
                    setFront(null);
                    setBack(null);
                    setLoad(false)
                    throw new Error('Erro interno no upload');
                };
            }
            

            if(statusDocument == 'reproved'){
                const pictureUpdateParams: PropsUpdateAvalidPicture = {
                    picture: documentName == 'medical' ? 'Medical_Examination' : documentName,
                    status: 'pending',
                };
                const update = await UpdatePicture(collaborator.CPF, pictureUpdateParams);
                switch (update.status) {
                    case 200:
                        validateCollaborator()
                        setSendPicture(false)
                        setPath(path)
                        setTypeDocument(type)
                        setActiveSheet('success');
                        setMessageSheet(`Documento Atualizado`);
                        Sheet();
                        setLoad(false)
                        close()
                        break;
                    case 400:
                        setActiveSheet('danger');
                        setMessageSheet(`Documento não encontrado`);
                        setLoad(false)
                        Sheet();
                        setNoRepeat(true);
                        setFront(null);
                        setBack(null);
                        break
                    default:
                        setActiveSheet('danger');
                        setMessageSheet('Erro, tente novamente!');
                        Sheet();
                        setNoRepeat(true);
                        setFront(null);
                        setBack(null);
                        setLoad(false)
                        break;
                }
            }else{
                const pictureParams: PropsCreateAvalidPicture = {
                    picture: documentName == 'medical' ? 'Medical_Examination' : documentName,
                    status: 'pending',
                    cpf: collaborator.CPF,
                };
                const createResponse = await CreateAvalidPicture(pictureParams);

                if(documentName.toLowerCase() == 'dismissal_hand'){
                    const demissionData = {
                        motion_demission: "card",
                        demission: JSON.stringify({step:1, status:null, user:null, solicitation:'collaborator', observation:''})
                    };
                    const response = await UpdateJob(jobId, demissionData);
                    // console.log(response)
                    if(response.status !== 200){
                        setActiveSheet('danger');
                        setMessageSheet(`Erro ao atualizar o job`);
                        Sheet();
                        setLoad(false)
                        return
                    }
                }
    
                if(createResponse.status === 201){
                    setPath(path)
                    setTypeDocument(type)
                    setActiveSheet('success');
                    setMessageSheet(`Documentos salvos`);
                    Sheet();
                    setLoad(false)
                    setSendPicture(false)
                    validateCollaborator()
                    close()
                } 
                else if (createResponse.status === 409) {
                    setActiveSheet('danger');
                    setMessageSheet('Imagem já existe');
                    Sheet();
                } 
                else {
                    setActiveSheet('danger');
                    setMessageSheet('Erro ao salvar imagem');
                    Sheet();
                }
            };

        }catch(e){
            console.log(e)
            setActiveSheet('danger');
            setMessageSheet('Erro ao salvar imagem');
            Sheet();
        }finally{
            setLoad(false)
        };
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
            try{
                if (front && back && noRepeat) {
                    // Impede re-execução
                    setNoRepeat(false);
                    setLoad(true)
                    const paths = [front, back];
                    switch (documentName) {
                        case 'Carteira de Trabalho':
                            documentName = 'Work_Card'
                            break;
                        case 'CNH (opcional)':
                            documentName = 'CNH'
                            break;
                        case 'Titulo de Eleitor (opcional)':
                            documentName = 'Voter_Registration';
                            break;
                        default:
                            // console.log(documentName)
                            break;
                    };
                    try {
                        // Fazendo o upload dos arquivos front e back
                        await Promise.all(
                            paths.map(async (path, index) => {
                                let side = index === 0 ? 'front' : 'back';
                                
                                // Fazendo o upload do arquivo
                                const response = await UploadFile(path, documentName, side, collaborator.CPF);

                                switch (response.status) {
                                    case 400:
                                        setActiveSheet('danger');
                                        setMessageSheet(`Documento inválido`);
                                        Sheet();
                                        setFront(null);
                                        setBack(null);
                                        setLoad(false);
                                        return;
                                    default:
                                        setActiveSheet('danger');
                                        setMessageSheet(`Erro desconhecido`);
                                        Sheet();
                                        setNoRepeat(true);
                                        setFront(null);
                                        setBack(null);
                                        setLoad(false)
                                        return;
                                }
        
                            })
                        );
    
                        
                        if(statusDocument == 'reproved'){
                            const pictureUpdateParams: PropsUpdateAvalidPicture = {
                                picture: documentName,
                                status: 'pending',
                            };
                            const update = await UpdatePicture(collaborator.CPF, pictureUpdateParams);
                            switch (update.status) {
                                case 200:
                                    validateCollaborator()
                                    setSendPicture(false)
                                    setPath([front,back])
                                    setTypeDocument('picture')
                                    setActiveSheet('success');
                                    setMessageSheet(`Documento Atualizado`);
                                    Sheet();
                                    setLoad(false)
                                    close()
                                    break;
                                case 400:
                                    setActiveSheet('danger');
                                    setMessageSheet(`Documento não encontrado`);
                                    setLoad(false)
                                    Sheet();
                                    setNoRepeat(true);
                                    setFront(null);
                                    setBack(null);
                                    break
                                default:
                                    setActiveSheet('danger');
                                    setMessageSheet('Erro, tente novamente!');
                                    Sheet();
                                    setNoRepeat(true);
                                    setFront(null);
                                    setBack(null);
                                    setLoad(false)
                                    break;
                            }
                        }else{
                            const pictureParams: PropsCreateAvalidPicture = {
                                    picture: documentName,
                                    status: 'pending',
                                    cpf: collaborator.CPF
                            };
                
                            const createResponse = await CreateAvalidPicture(pictureParams);
                            switch (createResponse.status) {
                                case 201:
                                    validateCollaborator()
                                    setSendPicture(false)
                                    setPath([front,back])
                                    setTypeDocument('picture')
                                    setActiveSheet('success');
                                    setMessageSheet(`Documento salvo`);
                                    Sheet();
                                    setLoad(false)
                                    close()
                                        break;
                                case 409:
                                        setActiveSheet('danger');
                                        setMessageSheet('Imagem já existe');
                                        Sheet();
                                        setLoad(false)
                                        setNoRepeat(true);
                                        setFront(null);
                                        setBack(null);
                                        break
                                default:
                                        setActiveSheet('danger');
                                        setMessageSheet('Erro, tente novamente!');
                                        Sheet();
                                        setNoRepeat(true);
                                        setFront(null);
                                        setBack(null);
                                        setLoad(false)
                                        break;
                            };
                        }
                    } catch (error) {
                        console.error('Erro durante o processo:', error);
                        setActiveSheet('danger');
                        setMessageSheet('Algo deu errado, tente novamente');
                        Sheet();
                        setLoad(false)
                        setNoRepeat(true);
                        setFront(null);
                        setBack(null);
                    };
                };
            }catch(e){
                setLoad(false)
                console.log(e)
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

const extractNameChildren = (str: string): string | null => {
    const regex = /\(([^)]+)\)/;  // Expressão regular para capturar o texto entre parênteses
    const match = str.match(regex);
    
    return match ? match[1] : null;  // Se houver correspondência, retorna o valor entre parênteses
};
  
  


export default DocumentSend;
