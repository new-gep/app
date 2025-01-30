import config from '../../../../config.json';
import axios from 'axios'
type Props = {
    obligations?: string;
    benefits?: string;
    details ?: string;
    image   ?: string;
    function?: string;
    contract?: string;
    salary  ?: string;
    PCD     ?: string;
    time    ?: any;
    demission?:any;
    motion_demission?:string ;
    candidates?:any
    user_edit ?:string;
    update_at ?:string;
    CPF_collaborator?:string;
    transportation_voucher?:string;
}

export default async function UpdateJobDefault(id:string, props: Props){

    const response = await axios.patch(`${config.API_URL}job/${id}`, props)
    return response.data
}