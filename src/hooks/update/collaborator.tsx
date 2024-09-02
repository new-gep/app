import config from '../../../config.json';
import axios from 'axios'
type Props = {
    cpf     ?: string;
    email   ?: string;
    name    ?: string;
    password?: string;
    phone   ?: string;
    terms   ?: string;
    zip_code ?:string;
    street   ?:string;
    district ?:string;
    city     ?:string;
    uf       ?:string;
    complement?:string;
    number   ?:number;
    id_work  ?:string
 }

export default async function UpdateCollaborator(cpf:string, props: Props){

    const response = await axios.patch(`${config.API_URL}collaborator/${cpf}`, props)
    return response.data
}