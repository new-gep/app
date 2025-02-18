import config from '../../../../config.json';
import axios from "axios";

interface JobResponse {
  status: number;
  jobs?: {
    step: number;
    status: string | null;
    user: string;
    solicitation: 'company' | 'collaborator';
    observation: string;
  };
  message?: string;
}

const GetColaboratorJob = async (): Promise<JobResponse> => {
    try {
        const response = await axios.get(`${config.API_URL}job`);
        return response.data;
    } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
        return {
            status: 500,
            message: "Falha na comunicação com o servidor"
        };
    }
};

export default GetColaboratorJob;