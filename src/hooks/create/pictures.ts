import config from '../../../config.json';
import axios from 'axios'
type Props = {
    picture :string
    status  :string
    cpf     :string
 }

export default async function CreateAvalidPicture(props: Props){
    const { cpf, picture, status, } = props;

    const propsPicture = {
        CPF_collaborator :cpf,
        status           :status,
        picture          :picture
    };

    const response = await axios.post(`${config.API_URL}picture`, propsPicture)
    return response.data
}