import axios from "axios";
import config from "../../../../config.json";

export default  async function deleteCollaboratorFiles(keys: string[]){
  if (keys.length === 0) return;

  try {
    await Promise.all(
      keys.map(async (key) => {
        try {
          const res = await axios.delete(`${config.API_URL}collaborator/del/files`, {
            data: { key },
          });
          return res
        } catch (err) {
          console.error(`Erro ao deletar imagem ${key}:`, err);
        }
      })
    );
  } catch (err) {
    console.error("Erro em deletar:", err);
  }
};
