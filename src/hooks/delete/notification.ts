import config from "../../../config.json";
import axios from "axios";

export default async function deleteNotification(id: any) {
    try{
        const response = await axios.delete(`${config.API_URL}notification/${id}`);
        return response.data;
    }catch(e){
        console.log(e)
    }
}
