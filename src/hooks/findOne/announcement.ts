import config from '../../../config.json';
import axios from 'axios'


export default async function FindAnnouncement(cpf: any){
    try {
        const response = await axios.get(`${config.API_URL}announcement/${cpf}`);
        return response.data;

      } catch (error:any) {
        console.error("Erro ao buscar colaborador:", error.message);
      }
      
}