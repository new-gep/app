import config from '../../../../config.json';
import axios from 'axios'

export default async function AllPeople(cpf:any){
    const response = await axios.get(`${config.API_URL}collaborator/people/${cpf}`)
    return response.data
}