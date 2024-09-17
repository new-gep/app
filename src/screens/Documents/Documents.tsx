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


const Documents = () => {
    const navigation = useNavigation<any>();
    const { collaborator, fetchCollaborator } = useCollaborator();
    const [myDocsData, setMyDocsData] = useState<any[] | null>(null)
    const [error, setError] = useState<boolean>(false)
    const [process, setProcess] = useState<boolean>(false)


    const Picture = async () => {
        try {
            const response = await FindPicture(collaborator.CPF);
            if(response.status != 500){
                setError(false)
                const picturesFromAPI = response.pictures;

                let tempPictureCard: { [key: string]: any } = {};
             
                const picturesWithStatus = picturesFromAPI.map(item => ({
                    picture: item.picture,
                    status: item.status
                }));
        
                // Recuperar os dados das crianças antes da iteração
                let dataToStore = await AsyncStorage.getItem('missingDates');
                let missingDates = dataToStore ? JSON.parse(dataToStore) : {};
                let missingDocumentsChildren = Array.isArray(missingDates.missingDocumentsChildren) 
                    ? missingDates.missingDocumentsChildren 
                    : [];
        
                // Iterando sobre os documentos
                picturesWithStatus.forEach((picture:any) => {
                    const documentKey    = picture.picture;
                    const documentStatus = picture.status;  
                    
                    // Se houver um status válido, cria um card para o documento
                    
                    if (documentStatus) {
                        let document_params : {};
                            
                        document_params = {
                            path: getPathDocument(documentKey),
                            DocumentName: getNameDocument(documentKey),
                            sendDocument: documentStatus.status != 'reproved' ? false : true,
                            typeDocument: getTypeDocument(documentKey),
                            twoPicture  : getTwoPictureDocument(documentKey),
                            statusDocument: documentStatus.status,
                        };
    
                        // Adicionar ao objeto temporário, usando o nome do documento como chave
                        tempPictureCard[getNameDocument(documentKey)] = document_params;
                        
                        return
                    };
        
                    // Tratamento especial para Certidão de Nascimento (filhos)
                    if (documentKey === 'Birth_Certificate') {
                        if (missingDocumentsChildren.length > 0) {
                            missingDocumentsChildren.forEach((children: string) => {
                                let document_params = {
                                    image: getPathDocument(`${documentKey}_${Mask('firstName',children)}`),
                                    DocumentName: `${getNameDocument(documentKey)} (${Mask('firstName',children)})`,
                                    sendDocument: true,
                                    typeDocument: getTypeDocument(`${documentKey}_${Mask('firstName',children)}`),
                                    twoPicture: getTwoPictureDocument(documentKey),
                                    statusDocument: documentStatus ? documentStatus : null,
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
                        statusDocument: null,
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
        }
    };

    const getNameDocument = (name: string ) => {
        if(name.toLowerCase().includes('birth_certificate')){
                const parts = name.split('_');
                return `Certidão de Nascimento (${parts[2]})`
        }else{
            switch (name.toLowerCase()) { 
            case 'rg':
                return 'RG';
            case 'military_certificate':
                return 'Certificado Militar';
            case 'address':
                return 'Comprovante de Endereço';
            case 'work_card':
                return 'Carteira de Trabalho';
            case 'school_history':
                return 'Histórico Escolar';
            case 'marriage_certificate':
                return 'Certidão de Casamento';
            case 'cnh':
                return 'CNH (opcional)';
              default:
                return '?';
            }
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
        case 'military_certificate':
            return false;
          default:
            return '?';
        }
    };

    const getPathDocument = async (name:string) => {
        let response: any;
        if(name.toLowerCase().includes('birth_certificate')){
                response = await FindBucketCollaborator(collaborator.CPF, name)
                return response.path;
        }else{
            switch (name.toLowerCase()) { 
            case 'rg':
                response = await FindBucketCollaborator(collaborator.CPF, 'RG')
                return response.path;
            case 'work_card':
                response = await FindBucketCollaborator(collaborator.CPF, 'Work_Card')
                return response.path;
            case 'address':
                response = await FindBucketCollaborator(collaborator.CPF, 'Address')
                return response.path;
            case 'school_history':
                response = await FindBucketCollaborator(collaborator.CPF, 'School_History')
                return response.path;
            case 'military_certificate':
                response = await FindBucketCollaborator(collaborator.CPF, 'Military_Certificate')
                return response.path;
            case 'marriage_certificate':
                response = await FindBucketCollaborator(collaborator.CPF, 'Marriage_Certificate')
                return response.path;
              case 'cnh':
                response = await FindBucketCollaborator(collaborator.CPF, 'CNH')
                return response.path;
                default:
                    return '?';
            }
        }
    };

    const getTypeDocument = async (name:string) => {
        let response: any;
        if(name.toLowerCase().includes('birth_certificate')){
            response = await FindBucketCollaborator(collaborator.CPF, name)
            return response.type;
        }else{
            switch (name.toLowerCase()) { 
                case 'rg':
                    response = await FindBucketCollaborator(collaborator.CPF, 'RG')
                    return response.type;
                case 'address':
                    response = await FindBucketCollaborator(collaborator.CPF, 'Address')
                    
                    return response.type;
                case 'work_card':
                    response = await FindBucketCollaborator(collaborator.CPF, 'Work_Card')
                  
                    return response.type;
                case 'school_history':
                    response = await FindBucketCollaborator(collaborator.CPF, 'School_History')
                    return response.type;
                case 'marriage_certificate':
                    response = await FindBucketCollaborator(collaborator.CPF, 'Marriage_Certificate')
                    return response.type;
                case 'cnh':
                    response = await FindBucketCollaborator(collaborator.CPF, 'CNH')
                    return response.type;
                case 'military_certificate':
                    response = await FindBucketCollaborator(collaborator.CPF, 'Military_Certificate')
                    return response.type;
                default:
                  return '?';
            }
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchCollaborator()
        });
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
                                                                path={data.path}
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