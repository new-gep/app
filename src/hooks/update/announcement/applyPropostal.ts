import config from '../../../../config.json';
import axios from 'axios'

export default async function applyPropostal(id:number, CPF_collaborator: string){
    const response = await axios.patch(`${config.API_URL}announcement/propostal/apply/${id}/${CPF_collaborator}`)
    return response.data
}