import config from '../../../../config.json';
import axios from "axios";

const CheckDocumentServices = async (id: any, month: any, year: any, type: any) => {
    try {
        console.log(`${config.API_URL}fileService/${id}/${type}/${year}/${month}`);
        const response = await axios.get(`${config.API_URL}fileService/${id}/${type}/${year}/${month}`);
        return response.data;

    } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
        return {
        status: 500,
        message: "Falha na comunicação com o servidor"
        };
    }
}

export default CheckDocumentServices;