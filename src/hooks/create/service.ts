import config from '../../../config.json';
import axios from 'axios'
type Props = {
    name :string
    status :string
    type :string
 }

export default async function CreateService(props: Props){
    const { name, status, type } = props;

    const propsService = {
        name           :name,
        status    :status,
        type          :type
    };

    const response = await axios.post(`${config.API_URL}service`, propsService)
    return response.data
}