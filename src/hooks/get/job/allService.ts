import config from '../../../../config.json';
import axios from 'axios'

export default async function FindAllService(filterCategory:any){
    const response = await axios.post(`${config.API_URL}job/findAll`, filterCategory)
    return response.data
}