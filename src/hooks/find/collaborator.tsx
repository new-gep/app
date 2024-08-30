import config from '../../../config.json';
import axios from 'axios'
type Props = {
    cpf     ?:string
 }

export default async function FindCollaborator(props: Props){
    const { cpf } = props;

    const response = await axios.get(`${config.API_URL}collaborator/${cpf}`)
    return response.data
}