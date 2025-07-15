import config from '../../../../config.json';
import axios from 'axios'

export default async function FindAll(cpf:any){
    const response = await axios.get(`${config.API_URL}announcement/all/${cpf}`)
    return response.data
}