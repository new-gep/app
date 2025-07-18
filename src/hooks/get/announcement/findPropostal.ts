import config from '../../../../config.json';
import axios from 'axios'

export default async function FindPropostal(cpfResponder:any, cpfCreator:any){
    const response = await axios.get(`${config.API_URL}announcement/propostal/${cpfResponder}/${cpfCreator}`)
    return response.data
}