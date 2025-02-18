import config from '../../../config.json';
import axios from 'axios'
type Props = {
    cpf     ?:string
    email   ?:string
    phone   ?:string
    name    ?:string
    password?:string
    terms   ?:boolean
 }

export default async function CheckCollaborator(props: Props){
    const { cpf, email, phone, name, password } = props;

    const propsCollaborator = {
        CPF  :cpf,
        email:email,
        phone:phone,
        name :name,
        password:password,
        terms:'1' 
    }
    const response = await axios.post(`${config.API_URL}collaborator/checkCollaborator`, propsCollaborator)
    return response.data
}