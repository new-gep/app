import config from '../../../../config.json';
import axios from 'axios'

export default async function FindHistory(cpf:any){
    const response = await axios.get(`${config.API_URL}announcement/history/${cpf}`)
    return response.data
}