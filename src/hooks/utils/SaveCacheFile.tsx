import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";

export default async function SaveCacheFile(
  base64: string,
  StoreName: string,
  setPath?: (path: string) => void
) {
  try {
    // 1. Detecta o tipo e a extensão da imagem
    let ext = "png"; // padrão
    let cleanedBase64 = base64;

    if (base64.startsWith("data:image/")) {
      const matches = base64.match(/^data:image\/(\w+);base64,/);
      if (matches) {
        ext = matches[1];
        if (ext === "jpg") ext = "jpeg";
        cleanedBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
      }
    } else {
      // Assume que é uma string base64 pura ou trata prefixos incorretos, se necessário
      cleanedBase64 = base64;
    }

    // 2. Define o caminho local
    const fileName = `${StoreName}.${ext}`;
    const fullPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    // 3. Verifica se o arquivo já existe e o exclui
    const fileExists = await RNFS.exists(fullPath);
    if (fileExists) {
      await RNFS.unlink(fullPath);
    }

    // 4. Salva o novo arquivo
    await RNFS.writeFile(fullPath, cleanedBase64, "base64");

    // 5. Cria a URI com um timestamp para evitar cache
    const timestamp = Date.now();
    const fileUri = `file://${fullPath}?t=${timestamp}`;

    // 6. Armazena o caminho no AsyncStorage
    await AsyncStorage.setItem(StoreName, fileUri);

    // 7. Atualiza o estado com a nova URI
    if (setPath) {
      setPath(fileUri);
    }

    return {
      status: true,
      path: fileUri,
    };
  } catch (error) {
    console.error("Erro ao salvar o arquivo:", error);
    return {
      status: false,
      path: null,
    };
  }
}