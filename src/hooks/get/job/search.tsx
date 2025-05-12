import config from '../../../../config.json';
import axios from "axios";

const SearchJob = async (job: any) => {
    try {
        const response = await axios.get(`${config.API_URL}job/search/${job}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
        return {
        status: 500,
        message: "Falha na comunicação com o servidor"
        };
    }
}

export default SearchJob;