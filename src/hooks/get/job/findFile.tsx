import axios from "axios";
import config from '../../../../config.json';

export default async function FindFile(id:number, name:string, signature: any, dynamic?:any){
    try{
        const response = await axios.get(`${config.API_URL}job/file/${id}/${name}/${signature}/${dynamic}`)
        return response.data
    }catch(e){
        console.log(e) 
    }
};