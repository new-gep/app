import config from '../../../../config.json';
import axios from 'axios'

export default async function AllPeople(props:any){
    const response = await axios.post(`${config.API_URL}collaborator/people`, props)
    return response.data
}