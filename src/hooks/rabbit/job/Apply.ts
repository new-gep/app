import config from '../../../../config.json';
import axios from 'axios'
type Props = {
    id?:string,
    collaborator?: any;
}

export default async function Apply(props: Props){
    const response = await axios.post(`${config.API_URL}job/apply`, props)
    return response.data
}