import axios from 'axios';
import config from '../../../config.json';

export default async function uploadFile(path: string, nameFile: string, side: string, cpf:string) {
    try {

        // Obtendo a extensão do arquivo de forma segura
        const extend = path.split('.').pop();
        if (!extend) {
            throw new Error('Não foi possível obter a extensão do arquivo.');
        }

        // Preparando o FormData com o arquivo e os dados adicionais
        const formData = new FormData();
        formData.append('file', {
            name: `${nameFile}.${extend}`, // Nome do arquivo
            uri: path,                     // Caminho do arquivo
            type: `image/${extend}`,        // Tipo MIME baseado na extensão
        } as any);
        formData.append('side', side);
        formData.append('name', nameFile);
        formData.append('cpf' , cpf);

        // Fazendo a requisição POST para o upload
        const response = await axios.post(`${config.API_URL}collaborator/upload`, formData, {
            headers: {
                Accept: 'application/json', 
                'Content-Type': 'multipart/form-data',
            },
        });

        // Verificando a resposta do servidor
        return response.data;

    } catch (error) {
        console.error(`Erro ao enviar o arquivo ${nameFile}:`, error);
        return false;
    }
}
