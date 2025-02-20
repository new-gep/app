import config from '../../../config.json';
import axios from 'axios';

type Props = {
    name: string
    status: string
    type: string
    documentId?: string   
    cpf?: string            // CPF do funcionário
    signatureDate?: Date    // Data da assinatura
    monthYear?: string      // Mês/Ano de referência (formato MM/YYYY)
}

export default async function CreateService(props: Props) {
    const { 
        name, 
        status, 
        type,
        documentId,
        cpf,
        signatureDate,
        monthYear
    } = props;

    // Estrutura base com campos obrigatórios
    const propsService: any = {
        name,
        status,
        type,
        createdAt: new Date()  // Mantém registro de criação
    };

    // Adiciona campos específicos para PayStub/TimeClock
    if (type === 'PayStub' || type === 'TimeClock') {
        
        propsService.documentId = documentId;
        propsService.cpf = cpf;
        propsService.signatureDate = signatureDate || new Date();
        propsService.monthYear = monthYear || 
            `${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear()}`;
    }

    try {
        const response = await axios.post(`${config.API_URL}service`, propsService);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar serviço:', error);
        throw error;
    }
}