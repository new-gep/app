import React, { useState } from 'react';
import { View, Text, ScrollView,  } from 'react-native';
import Header from '../../layout/Header';
import { IMAGES } from '../../constants/Images';
import { COLORS, FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Cardstyle4 from '../../components/Card/Cardstyle4';
import { useEffect } from 'react';
import { useCollaboratorContext } from '../../context/CollaboratorContext';
import CheckCadasterCollaboratorDocument from '../utils/checkCadasterCollaboratorDocument';
import { useNavigation } from '@react-navigation/native';
import FindPicture from '../../hooks/findOne/picture';
import useCollaborator from '../../function/fetchCollaborator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mask from '../../function/mask';
import FindBucketCollaborator from '../../hooks/bucket/collaborator';

type PicturesProps = {
    CNH:{ status: string } | null;
    RG: { status: string } | null;
    Work_Card: { status: string } | null;
    Address: { status: string } | null;
    School_History: { status: string } | null;
    Marriage_Certificate: { status: string } | null;
    Birth_Certificate: { status: string } | null;
};

type PathPictureProps = {
    CNH: string[] | null;
    RG:  string[] | null;
    Work_Card: string[] | null;
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

const Documents = () => {
    const navigation = useNavigation<any>();
    const { collaborator, fetchCollaborator } = useCollaborator();
    const [myDocsData, setMyDocsData] = useState<any[] | null>(null)
    const [error, setError] = useState<boolean>(false)
    const [process, setProcess] = useState<boolean>(false)
    const [picturesData, setPicturesData] = useState<PicturesProps>({
        RG: null,
        CNH:null,
        Work_Card: null,
        Address: null,
        School_History: null,
        Marriage_Certificate: null,
        Birth_Certificate: null
    });
    const [picturesPath, setPicturesPath] = useState<PathPictureProps>({
        CNH: null,
        RG: null,
        Work_Card: null,
        Address: null,
        School_History: null,
        Marriage_Certificate: null,
        Birth_Certificate: null
    });
    const [picturesType, setPicturesType] = useState<TypePictureProps>({
        CNH: null,
        RG : null,
        Work_Card: null,
        Address  : null,
        School_History: null,
        Marriage_Certificate: null,
        Birth_Certificate: null
    });
    const [picturesStatus, setPicturesStatus] = useState<StatusPictureProps>({
        CNH: null,
        RG : null,
        Work_Card: null,
        Address  : null,
        School_History: null,
        Marriage_Certificate: null,
        Birth_Certificate: null
    });

    const Picture = async () => {
        try {
            const response = await FindPicture(collaborator.CPF);
            if(response.status != 500){
                setError(false)
                const picturesFromAPI = response.pictures;
                // Objeto temporário para garantir unicidade
                let tempPictureCard: { [key: string]: any } = {};
                
                // Novo estado baseado nas imagens encontradas
                const updatedPicturesData = { ...picturesData };
        
                // Atualizando o estado com os documentos da API
                if(picturesFromAPI && picturesFromAPI.length > 0){
                    picturesFromAPI.forEach((pictureObj: { picture: string; status: string }) => {
                        const { picture, status } = pictureObj;
                        if (updatedPicturesData.hasOwnProperty(picture)) {
                            updatedPicturesData[picture as keyof PicturesProps] = { status };
                        }
                    });
                };
        
                // Recuperar os dados das crianças antes da iteração
                let dataToStore = await AsyncStorage.getItem('missingDates');
                let missingDates = dataToStore ? JSON.parse(dataToStore) : {};
                let missingDocumentsChildren = Array.isArray(missingDates.missingDocumentsChildren) 
                    ? missingDates.missingDocumentsChildren 
                    : [];
        
                // Iterando sobre os documentos
                Object.entries(updatedPicturesData).forEach((picture) => {
                    const documentKey = picture[0]; // Nome do documento (RG, Work_Card, etc.)
                    const documentStatus = picture[1]; // Status do documento
        
                    // Se houver um status válido, cria um card para o documento
                    if (documentStatus) {
                        
                        let document_params : {};
    
                        document_params = {
                            path: getPathDocument(documentKey),
                            DocumentName: getNameDocument(documentKey),
                            sendDocument: documentStatus.status != 'reproved' ? false : true,
                            typeDocument: getTypeDocument(documentKey),
                            twoPicture  : getTwoPictureDocument(documentKey),
                            statusDocument: setStatusDocument(documentKey, documentStatus.status),
                        };
    
                        // Adicionar ao objeto temporário, usando o nome do documento como chave
                        tempPictureCard[getNameDocument(documentKey)] = document_params;
                        
                        return
                    };
        
                    // Tratamento especial para Certidão de Casamento
                    if (documentKey === 'Marriage_Certificate') {
                        return;
                    };
        
                    // Tratamento especial para Certidão de Nascimento (filhos)
                    if (documentKey === 'Birth_Certificate') {
                        if (missingDocumentsChildren.length > 0) {
                            missingDocumentsChildren.forEach((children: string) => {
                                let document_params = {
                                    image: IMAGES.item3,
                                    DocumentName: `${getNameDocument(documentKey)} ${Mask('firstName',children)}`,
                                    sendDocument: true,
                                    typeDocument: getTypeDocument(documentKey),
                                    twoPicture: getTwoPictureDocument(documentKey),
                                    statusDocument: setStatusDocument(documentKey, null),
                                };
        
                                // Garantir que não adicionamos duplicatas para os filhos
                                tempPictureCard[`${getNameDocument(documentKey)} ${children}`] = document_params;
                            });
                        }
                        return;
                    };

                    // Caso geral para outros documentos
                    let document_params = {
                        path: getPathDocument(documentKey),
                        DocumentName: getNameDocument(documentKey),
                        sendDocument: true,
                        typeDocument: getTypeDocument(documentKey),
                        twoPicture: getTwoPictureDocument(documentKey),
                        statusDocument: setStatusDocument(documentKey, null),
                    };
        
                    // Adicionar ao objeto temporário para evitar duplicatas
                    tempPictureCard[getNameDocument(documentKey)] = document_params;
                });
        
                // Converter o objeto temporário de volta para um array
                let picture_card = Object.values(tempPictureCard);
        
                setMyDocsData(picture_card);
                return
            };
            setError(true)
        } catch (error) {
            console.error('Erro ao buscar imagens:', error);
        }finally{
            setProcess(true)
            console.log('acabou')
        }
    };

    const getNameDocument = (name: string ) => {
        switch (name.toLowerCase()) { 
            case 'rg':
              return 'RG';
          case 'address':
            return 'Comprovante de Endereço';
          case 'work_card':
            return 'Carteira de Trabalho';
          case 'school_history':
            return 'Histórico Escolar';
        case 'marriage_certificate':
            return 'Certidão de Casamento';
        case 'birth_certificate':
            return 'Certidão de Nascimento';
        case 'cnh':
            return 'CNH (opcional)';
          default:
            return '?';
        }
    };

    const getTwoPictureDocument = (name: string ) => {
        switch (name.toLowerCase()) { 
            case 'rg':
              return true;
          case 'address':
            return false;
          case 'work_card':
            return true;
          case 'school_history':
            return false;
        case 'marriage_certificate':
            return false;
        case 'birth_certificate':
            return false;
        case 'cnh':
            return true;
          default:
            return '?';
        }
    };

    const getPathDocument = async (name:string) => {
        let response: any;
        switch (name.toLowerCase()) { 
          case 'rg':
            response = await FindBucketCollaborator(collaborator.CPF, 'RG')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, RG: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, RG: response.path,};
                });
            return response.path;
          case 'address':
                response = await FindBucketCollaborator(collaborator.CPF, 'Address')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Address: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Address: response.path,};
                });
            return response.path;
          case 'work_card':
                response = await FindBucketCollaborator(collaborator.CPF, 'Work_Card')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Work_Card: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Work_Card: response.path,};
                });
            return response.path;
          case 'school_history':
                response = await FindBucketCollaborator(collaborator.CPF, 'School_History')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, School_History: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, School_History: response.path,};
                });
                return response.path;
          case 'marriage_certificate':
                response = await FindBucketCollaborator(collaborator.CPF, 'Marriage_Certificate')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Marriage_Certificate: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Marriage_Certificate: response.path,};
                });
                return response.path;
          case 'birth_certificate':
                return picturesPath.Birth_Certificate
          case 'cnh':
                response = await FindBucketCollaborator(collaborator.CPF, 'CNH')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, CNH: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, CNH: response.path,};
                });
                return response.path;
            default:
                return '?';
        }
    };

    const getTypeDocument = async (name:string) => {
        let response:any;
        switch (name.toLowerCase()) { 
            case 'rg':
                response = await FindBucketCollaborator(collaborator.CPF, 'RG')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, RG: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, RG: response.path,};
                });
                return response.type;
            case 'address':
                response = await FindBucketCollaborator(collaborator.CPF, 'Address')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Address: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Address: response.path,};
                });
                return response.type;
            case 'work_card':
                response = await FindBucketCollaborator(collaborator.CPF, 'Work_Card')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Work_Card: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Work_Card: response.path,};
                });
                return response.type;
            case 'school_history':
                response = await FindBucketCollaborator(collaborator.CPF, 'School_History')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, School_History: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, School_History: response.path,};
                });
                return response.type;
            case 'marriage_certificate':
                response = await FindBucketCollaborator(collaborator.CPF, 'Marriage_Certificate')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Marriage_Certificate: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Marriage_Certificate: response.path,};
                });
                return response.type;
            case 'birth_certificate':
                response = await FindBucketCollaborator(collaborator.CPF, 'Birth_Certificate')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Marriage_Certificate: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, Marriage_Certificate: response.path,};
                });
                return response.type;
            case 'cnh':
                response = await FindBucketCollaborator(collaborator.CPF, 'CNH')
                setPicturesType((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, CNH: response.type};
                });
                setPicturesPath((prevState) => {
                    // Aqui você garante que o novo estado depende do anterior
                    return { ...prevState, CNH: response.path,};
                });
                return response.type;
            default:
              return '?';
        }
    };

    const setStatusDocument = (name:string, status:string) => {
        switch (name.toLowerCase()) { 
            case 'rg':
                setPicturesStatus((prevState) => {
                    return {
                        ...prevState,
                        RG: status,
                    }
                });
                return picturesStatus.RG
            case 'address':
                setPicturesStatus((prevState) => {
                    return {
                        ...prevState,
                        Address: status,
                    }
                });
                return picturesStatus.Address
            case 'work_card':
                setPicturesStatus((prevState) => {
                    return {
                        ...prevState,
                        Work_Card: status,
                    }
                });
                return picturesStatus.Work_Card
            case 'school_history':
                setPicturesStatus((prevState) => {
                    return {
                        ...prevState,
                        School_History: status,
                    }
                });
                return picturesStatus.School_History;
            case 'marriage_certificate':
                setPicturesStatus((prevState) => {
                    return {
                        ...prevState,
                        Marriage_Certificate: status,
                    }
                });
                return picturesStatus.Marriage_Certificate;
            case 'birth_certificate':
               break
            case 'cnh':
                setPicturesStatus((prevState) => {
                    return {
                        ...prevState,
                        CNH: status,
                    }
                });
                return picturesStatus.CNH
            default:
              return '?';
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchCollaborator()
        });
    
        // Retorna o unsubscribe para ser chamado quando o componente for desmontado
        return unsubscribe;
    }, [navigation]);

    useEffect(()=>{
        if(collaborator){
            Picture()
        }
    },[collaborator,process]);


    return(
        <>
            { error ?
                <View>
                    <Header
                        title='Documentos'
                        leftIcon='back'
                        //titleLeft
                        iconSimple={`folder`}
                    />
                    <View className={`mt-10 items-center`}>
                        <Text style={{ ...FONTS.fontMedium}} className={`text-danger`}>
                            ERRO
                        </Text>
                        <Text style={{ ...FONTS.fontMedium}}>Algo deu errado, tente mais tarde</Text>
                    </View>
                </View>
                :
                <View style={{backgroundColor:COLORS.background,flex:1}}>
                    <Header
                        title='Documentos'
                        leftIcon='back'
                        //titleLeft
                        iconSimple={`folder`}
                    />
                    <View>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1,paddingBottom:70,}}>
                            <View className={`px-5`}>
                                <CheckCadasterCollaboratorDocument/>
                            </View>
                            <View style={[GlobalStyleSheet.container, { paddingTop: 20,paddingHorizontal:10 }]}>
                                <View style={{marginTop:50}}>
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                    >
                                        <View className={`px-2`}>
                                            { myDocsData && process &&
                                                myDocsData.map((data:any, index) => {
                                                    return (
                                                        <View key={index} style={{marginBottom:30}}>
                                                            <Cardstyle4
                                                                documentName={data.DocumentName}
                                                                sendDocument={data.sendDocument}
                                                                typeDocument={data.typeDocument}
                                                                statusDocument={data.statusDocument}
                                                                twoPicture={data.twoPicture}
                                                                picturesPath={picturesPath}
                                                                path={data.path}
                                                                setPath={setPicturesPath}
                                                                setTypeDocument={setPicturesType}
                                                                setPicturesStatus={setPicturesStatus}
                                                            />
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            }
        </>
    )
}

export default Documents