import axios from 'axios';
import config from '../../../config.json';

export default async function uploadAbsence(path: string, nameFile: string, id_work: string, cpf: string) {
    try {
        // Verifica se o caminho e o nome do arquivo foram fornecidos
        if (!path) {
            throw new Error('Caminho do arquivo não fornecido');
        }
        if (!nameFile) {
            throw new Error('Nome do arquivo não fornecido');
        }

        // Obtendo a data atual
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.toLocaleString('pt-BR', { month: 'long' });
        const monthInEnglish = {
            'janeiro': 'January',
            'fevereiro': 'February', 
            'março': 'March',
            'abril': 'April',
            'maio': 'May',
            'junho': 'June',
            'julho': 'July',
            'agosto': 'August',
            'setembro': 'September',
            'outubro': 'October',
            'novembro': 'November',
            'dezembro': 'December'
        }[month.toLowerCase()] || month;

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
        formData.append('id_work', id_work);
        formData.append('type', 'Absence');
        formData.append('name', nameFile);
        formData.append('year', year.toString());
        formData.append('month', monthInEnglish);
        formData.append('cpf', cpf);

        // Fazendo a requisição POST para o upload
        const response = await axios.post(`${config.API_URL}job/service/upload`, formData, {
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
