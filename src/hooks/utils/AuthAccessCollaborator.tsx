import config from '../../../config.json';
import axios from 'axios'
type Props = {
    cpf     :string
    password:string
}

export default async function AuthASingIn(props: Props){
    try{
        const response = await axios.post(`${config.API_URL}collaborator/SingIn`, props)
        console.log("response", `${config.API_URL}collaborator/SingIn`)
        return response.data
    }catch(e){
        console.log(e)
        return{
            status :409,
            message:'Verifique sua internet'
        }
    }
}