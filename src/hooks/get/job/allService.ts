import config from '../../../../config.json';
import axios from 'axios'

export default async function FindAllService(cpf:any){
    const response = await axios.get(`${config.API_URL}job/FindAllService/${cpf}`)
    return response.data
}