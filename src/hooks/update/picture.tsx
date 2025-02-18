import config from '../../../config.json';
import axios from 'axios'
type Props = {
    picture  ?:string;
    status   ?:string;
    id_user  ?:number;
 }

export default async function UpdatePicture(cpf:string, props: Props){

    const response = await axios.patch(`${config.API_URL}picture/${cpf}`, props)
    return response.data
}