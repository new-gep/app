import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definindo a interface para o colaborador
interface propsCollaborator {
    name: string;
    CPF: string;
    email: string;
    phone: string;
    terms?: string | null;
    sex?: string | null;
    marriage?: string | null;
    children?: {
        [key: string]: {
            name: string;
            birth: string;
        };
    } | null | 0;
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
            }
        } catch (error) {
            console.error('Erro ao buscar colaborador:', error);
        }
    };

    useEffect(() => {
        fetchCollaborator(); // Busca o colaborador ao montar o componente
    }, []);

    return { collaborator, fetchCollaborator };
};

export default useCollaborator;
