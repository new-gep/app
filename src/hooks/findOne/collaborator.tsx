import config from '../../../config.json';
import axios from 'axios'


export default async function FindCollaborator(cpf: any){
    // const { cpf } = props;
    try {
        const response = await axios.get(`${config.API_URL}collaborator/${cpf}`);
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar colaborador:", error.message);
        // Você pode adicionar mais tratamento de erros abaixo, se necessário.
        throw new Error("Falha ao obter os dados do colaborador. Verifique o CPF ou a API.");
      }
      
}