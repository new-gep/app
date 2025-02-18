import axios from 'axios';
import config from '../../../config.json';

export default async function FindBucketCollaborator(cpf:string, file:string) {
    try {
        const response = await axios.get(`${config.API_URL}collaborator/file/${cpf}/${file}`);
        
        return response.data

    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        return {
            status: 500,
            message: 'Falha na comunicação com o servidor',
        };
    }
}
