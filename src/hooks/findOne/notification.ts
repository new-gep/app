import config from '../../../config.json';
import axios from 'axios'

export default async function FindNotification(cpf:string){
    const response = await axios.get(`${config.API_URL}notification/${cpf}`)
    return response.data
}