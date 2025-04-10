import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefaultCollaborator from '../hooks/get/collaborator/Default';

// Definindo a interface para o colaborador
interface propsCollaborator {
    PCD: string;
    name: string;
    CPF: string;
    email: string;
    phone: string;
    id_work: string;
    terms?: string | null;
    sex?: string | null;
    marriage?: string | null;
    children?: {
        [key: string]: {
            name: string;
            birth: string;
        };
    } | null | 0;
    birth?: string | null;
    zip_code?: string | null;
    street?: string | null;
    district?: string | null;
    city?: string | null;
    uf?: string | null;
    complement?: string | null;
    number?: string | null;
    create_at: string;
    update_at?: string | null;
    delete_at?: string | null;
}

const useCollaborator = () => {
    // Inicializa o estado como `null` enquanto os dados estão sendo carregados
    const [collaborator, setCollaborator] = useState<propsCollaborator | null>(null);

    // Função para buscar o colaborador do AsyncStorage
    const fetchCollaborator = async () => {
        try {
            const storedData = await AsyncStorage.getItem('collaborator');
            if (storedData) {
                const parsedData = JSON.parse(storedData) as propsCollaborator;
                setCollaborator(parsedData);
                updateCollaborator(parsedData?.CPF || null);
                // console.log("Colaborador encontrado:", parsedData);
            }
        } catch (error) {
            await AsyncStorage.removeItem('collaborator');
            console.error('Erro ao buscar colaborador:', error);
        }
    };

    const updateCollaborator = async (cpf: string | null) => {
        try {
            if (!cpf) {
                console.error('CPF não fornecido para atualização do colaborador');
                return;
            }
            
            const response = await DefaultCollaborator(cpf);
            if (response.status === 200) {
                setCollaborator(response.collaborator);
                
                // Atualiza o cache no AsyncStorage
                await AsyncStorage.setItem('collaborator', JSON.stringify(response.collaborator));
            }
        } catch (error) {
            return null;
        }
    };

    useEffect(() => {
        fetchCollaborator(); // Busca o colaborador ao montar o componente
    }, []);

    // useEffect(() => {
    //     if (collaborator && collaborator.CPF) {
    //         updateCollaborator(collaborator.CPF);
    //     }
    // }, [collaborator]);

    return { collaborator, fetchCollaborator, updateCollaborator };
};

export default useCollaborator;
