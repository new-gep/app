import axios from "axios";
//@ts-ignore
import config from "../../../config.json";
import RNFetchBlob from "react-native-blob-util";

export default async function signatureFile(propsUploadJob:any) {
  try {

    if (!propsUploadJob.file) {
      throw new Error("Arquivo não foi fornecido.");
    }
    // Obtendo a extensão do arquivo de forma segura
    const extend = propsUploadJob.file.split(".").pop();
    
    if (!extend) {
      throw new Error("Não foi possível obter a extensão do arquivo.");
    }

    // Preparando o FormData com o arquivo e os dados adicionais
    const formData = new FormData();
    if (typeof propsUploadJob.file === "string" && !propsUploadJob.file.includes("file://")) {
      
      const base64Data = propsUploadJob.file.split(",")[1];
      const mimeType = propsUploadJob.file.split(";")[0].split(":")[1]
      const extension = mimeType.split("/")[1];

      const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/arquivo.${extension}`;
      await RNFetchBlob.fs.writeFile(filePath, base64Data, "base64");

      type ReactNativeFile = {
        uri: string;
        name: string;
        id: string;
        type: string;
      };

      // 2. Use o tipo criado
      const fileObject: ReactNativeFile = {
        uri: `file://${filePath}`,
        name: `arquivo.${extension}`,
        type: mimeType,
        id: propsUploadJob.id,
      };

      formData.append("file", fileObject as unknown as Blob);
    } else {
      // console.log(propsUploadJob.file);
      formData.append("file", {
        name: `${"teste"}.${extend}`, // Nome do arquivo
        uri: propsUploadJob.file, // Caminho do arquivo
        type: `image/${extend}`, // Tipo MIME baseado na extensão
        id: propsUploadJob.id,
      } as any);
    }
    formData.append("name", propsUploadJob.name);
    formData.append("cpf", propsUploadJob.cpf);
    // Fazendo a requisição POST para o upload
    const response = await axios.post(`${config.API_URL}collaborator/upload/signature`, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    // console.log("Resposta do servidor:", response.data);

    // Verificando a resposta do servidor
    return response.data;
  } catch (error) {
    console.error(`Erro ao enviar o arquivo ${propsUploadJob.name}:`, error);
    return false;
  }
}
