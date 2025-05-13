import config from '../../../../config.json';
import axios from 'axios'

export default async function DossieCollaborator(cpf:any, jobId?:any) {

    const response = await axios.get(`${config.API_URL}collaborator/dossie/${cpf}`, )
    return response.data
}