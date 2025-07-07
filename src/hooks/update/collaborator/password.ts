import config from '../../../../config.json';
import axios from 'axios'
type Props = {
    currentPassword ? :string;
    newPassword ?:string;
 }

export default async function UpdatePasswordCollaborator(cpf:string, props: Props){

    const response = await axios.patch(`${config.API_URL}collaborator/password/${cpf}`, props)
    return response.data
}