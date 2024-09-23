import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckAccountCompletion from '../hooks/utils/CheckAccountCompletion';
import { useNavigation } from '@react-navigation/native';

// Definimos a interface para o contexto
interface CollaboratorContextType {
    validateCollaborator: () => Promise<void>;
    missingData: MissingDataType | null;
}

// Definimos a interface para os dados de "missingData"
interface MissingDataType {
    missingFields: any;
    missingDocuments: any;
    missingDocumentsChildren:any
}

// Cria o contexto com um valor inicial undefined
const CollaboratorContext = createContext<CollaboratorContextType | undefined>(undefined);

// Hook personalizado para acessar o contexto
export const useCollaboratorContext = () => {
    const context = useContext(CollaboratorContext);
    if (!context) {
        throw new Error('useCollaborator must be used within a CollaboratorProvider');
    }
    return context;
};

// Tipagem para as propriedades do CollaboratorProvider
interface CollaboratorProviderProps {
    children: ReactNode;
}

// Componente Provider para envolver a aplicação
export const CollaboratorProvider = ({ children }: CollaboratorProviderProps) => {
    // O estado missingData agora aceita null ou um objeto do tipo MissingDataType
    const [missingData, setMissingData] = useState<MissingDataType | null>(null);
    const navigation = useNavigation();
    
    // Função para validar o colaborador
    const validateCollaborator = async () => {
        try {
            const storedData = await AsyncStorage.getItem('collaborator');
            if (storedData) {
                const collaboratorData = JSON.parse(storedData);
                const { CPF } = collaboratorData;
                if (CPF) {
                    const response = await CheckAccountCompletion(CPF);
                    
                    // Verifica se há campos ou documentos faltando
                    const hasMissingFields    = Array.isArray(response.missingFields) && response.missingFields.length > 0;
                    const hasMissingDocuments = Array.isArray(response.files?.missingDocuments) && response.files.missingDocuments.length > 0;
                    const hasMissingChildren  = Array.isArray(response.files?.missingDocumentsChildren) && response.files.missingDocumentsChildren.length > 0;
                    if (hasMissingFields || hasMissingDocuments || hasMissingChildren) {
                        const dataToStore: MissingDataType = {
                            missingFields: response.missingFields || [],
                            missingDocuments: response.files?.missingDocuments || [],
                            missingDocumentsChildren: response.files?.missingDocumentsChildren || []
                        };
                        console.log('documento do storage',dataToStore.missingDocuments)
                        await AsyncStorage.setItem('missingDates', JSON.stringify(dataToStore));
                        setMissingData(dataToStore); // Agora o tipo está correto
                        return;
                    } else {
                        // Remove os dados de pendências se não houver mais falta de documentos
                        await AsyncStorage.removeItem('missingDates');
                        setMissingData(null); // Nenhum dado pendente
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao validar colaborador:", error);
        }
    };

    useEffect(() => {
        // Executa a validação inicial do colaborador 
        // validateCollaborator() 
    }, []);

    return (
        <CollaboratorContext.Provider value={{ validateCollaborator, missingData }}>
            {children}
        </CollaboratorContext.Provider>
    );
};
