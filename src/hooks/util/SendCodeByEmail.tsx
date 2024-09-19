import config from '../../../config.json';
import axios from 'axios'
type Props = {
    email:string
 }

export default async function SendCodeByEmail(props: Props){
    const {email} = props;
    const response = await axios.get(`${config.API_URL}collaborator/resend/email/${email}`)
    return response.data
}