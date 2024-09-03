import config from '../../../config.json';
import axios from 'axios'

export default async function CheckAccountCompletion(cpf: string){
    try{
        const response = await axios.get(`${config.API_URL}collaborator/check/AccountCompletion/${cpf}`)
        return response.data
    }catch(e){
        console.log(e)
        return{
            status :409,
            message:'Verifique sua internet'
        }
    }
}