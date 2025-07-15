import config from '../../../../config.json';
import axios from 'axios'

export default async function Percentage(cpf:any){
    try{
        const response = await axios.get(`${config.API_URL}collaborator/percentage/${cpf}`)
        return response.data
    }catch(e){
        console.log(e)
    }
}