import config from '../../../config.json';
import axios from 'axios'
type Props = {
    picture :string
    status  :string
    cpf     :string
    id_work :string
 }

export default async function CreateAvalidPicture(props: Props){
    const { cpf, picture, status, id_work } = props;

    const propsPicture = {
        CPF_collaborator :cpf,
        status           :status,
        picture          :picture,
        id_work          :id_work
    };
    console.log("propsPicture lalala", propsPicture)

    const response = await axios.post(`${config.API_URL}picture`, propsPicture)
    return response.data
}