import config from '../../../../config.json';
import axios from "axios";

const CheckDocumentServices = async (id: any, type: any, year: any, month: any) => {
    try {
        const response = await axios.get(`${config.API_URL}job/fileService/${id}/${type}/${year}/${month}`);
<<<<<<< HEAD
        // console.log('teste:', response.data)
=======

>>>>>>> master
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