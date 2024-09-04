import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckAccountCompletion from "../../hooks/utils/CheckAccountCompletion";
import ProfileCompletionModal from "../../components/Modal/ProfileLock";
import { useNavigation } from '@react-navigation/native';

const ValidateCollaboratorAndBlock = () => {
    const [modalAlertCadaster, setModalAlertCadaster] = useState(false);
    const navigation = useNavigation(); // Obtém o objeto de navegação

    // Função de validação do colaborador e bloqueio
    useEffect(() => {
        const validateCollaborator = async () => {
            try {
                // Recupera os dados do colaborador do AsyncStorage
                const storedData = await AsyncStorage.getItem('collaborator');
                if (storedData) {
                    const collaboratorData = JSON.parse(storedData) as {
                        name: string;
                        CPF: string;
                    };

                    const { CPF } = collaboratorData;

                    // Verifica se o CPF está presente
                    if (CPF) {
                        const response = await CheckAccountCompletion(CPF);
                        
                        // Verifica se há campos ou documentos faltando
                        const hasMissingFields = response.missingFields.length > 0;
                        const hasMissingDocuments = response.files.missingDocuments.length > 0;

                        if (hasMissingFields || hasMissingDocuments) {
                            const dataToStore = {
                                missingFields: response.missingFields,
                                missingDocuments: response.files.missingDocuments,
                                missingDocumentsChildren: response.files.missingDocumentsChildren,
                            };

                            // Armazena os dados de pendências no AsyncStorage
                            await AsyncStorage.setItem('missingDates', JSON.stringify(dataToStore));

                            // Exibe o modal de alerta de cadastro incompleto
                            setModalAlertCadaster(true);
                        } else {
                            // Remove os dados de pendências se não houver mais falta de documentos
                            await AsyncStorage.removeItem('missingDates');
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao validar colaborador:", error);
            }
        };

        // Adiciona o listener de foco
        const unsubscribe = navigation.addListener('focus', validateCollaborator);

        // Remove o listener de foco quando o componente for desmontado
        return unsubscribe;
    }, [navigation]); // O effect será disparado toda vez que a navegação for alterada

    // Função para fechar o modal
    const handleCloseModalAlertCadaster = () => {
        setModalAlertCadaster(false);
    };

    return (
        <ProfileCompletionModal 
            visible={modalAlertCadaster} 
            close={handleCloseModalAlertCadaster} 
        />
    );
};

export default ValidateCollaboratorAndBlock;
