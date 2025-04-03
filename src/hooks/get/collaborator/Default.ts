import config from '../../../../config.json';
import axios from 'axios'

export default async function DefaultCollaborator(cpf:any){

    const response = await axios.get(`${config.API_URL}collaborator/${cpf}`)
    return response.data
}