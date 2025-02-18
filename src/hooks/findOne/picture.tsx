import axios from 'axios';
import config from '../../../config.json';

export default async function FindPicture(cpf) {
    try {
        const response = await axios.get(`${config.API_URL}picture/${cpf}`);
        
        if (response.status === 200) {
            return response.data;
        } else {
            return {
                status: response.status,
                message: response.data.message || 'Erro desconhecido',
            };
        }
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        return {
            status: 500,
            message: 'Falha na comunicação com o servidor',
        };
    }
}
