import axios from 'axios'

export default async function FindCep(cep: string){

    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    return response.data
}