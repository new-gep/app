import config from '../../../../config.json';
import axios from 'axios'

export default async function findAllPropostalsByCPF(cpf:any){
    const response = await axios.get(`${config.API_URL}announcement/propostalByCPF/${cpf}`)
    return response.data
}