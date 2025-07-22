import config from '../../../../config.json';
import axios from 'axios'

export default async function UnapplyJob(id:number, CPF_collaborator: string){
    
    const response = await axios.patch(`${config.API_URL}job/unapply/${id}/${CPF_collaborator}`)
    return response.data
}