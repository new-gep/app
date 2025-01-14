import axios from 'axios';
import config from '../../../config.json';


type propsUploadJob = {
        file:any,
        name:any,
        id  :any,
        signature:any
};

export default async function uploadFile(propsUploadJob) {
    try {

        // Obtendo a extensão do arquivo de forma segura
        const extend = propsUploadJob.file.split('.').pop();
        if (!extend) {
            throw new Error('Não foi possível obter a extensão do arquivo.');
        }

        // Preparando o FormData com o arquivo e os dados adicionais
        const formData = new FormData();
        formData.append('file', {
            name: `${'teste'}.${extend}`, // Nome do arquivo
            uri: propsUploadJob.file,             // Caminho do arquivo
            type: `image/${extend}`,        // Tipo MIME baseado na extensão
        } as any);
        formData.append("idJob",  propsUploadJob.id.toString()); 
        formData.append("name",   propsUploadJob.name);
        formData.append("signature", propsUploadJob.signature ? '1': '0'); 

        // Fazendo a requisição POST para o upload
        const response = await axios.post(`${config.API_URL}job/upload`, formData, {
            headers: {
                Accept: 'application/json', 
                'Content-Type': 'multipart/form-data',
            },
        });

        // Verificando a resposta do servidor
        return response.data;

    } catch (error) {
        console.error(`Erro ao enviar o arquivo ${ propsUploadJob.name}:`, error);
        return false;
    }
}
