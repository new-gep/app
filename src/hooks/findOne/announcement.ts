import config from '../../../config.json';
import axios from 'axios'

export default async function FindAnnouncement(cpf:string){
    const response = await axios.get(`${config.API_URL}announcement/${cpf}`)
    return response.data
}