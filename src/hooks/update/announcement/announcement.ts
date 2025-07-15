import config from "../../../../config.json";
import axios from "axios";
import uploadFileAnnouncement from "../../upload/announcement";
type Props = {
  category?: string;
  title?: string;
  candidate?: any;
  CPF_responder?: string;
  typePayment?: string;
  typeAnnouncement?: string;
  salary?: string;
  included?: string;
  notIncluded?: string;
  information?: string;
  gallery?: any;
  oldGallery?: any;
};
export default async function UpdateAnnouncement(id: any, props: Props) {
  const response = await axios.patch(`${config.API_URL}announcement/${id}`, {
    category: props.category,
    title: props.title,
    typePayment: props.typePayment,
    typeAnnouncement: props.typeAnnouncement,
    salary: props.salary,
    included: props.included,
    notIncluded: props.notIncluded,
    information: props.information,
  });

  // 1. Keys antigas (antes da edição)
  const oldKeys =
    props.oldGallery?.map((img: any) => img.key).filter(Boolean) || [];

  // 2. Novas imagens (sem key)
  const newImages = props.gallery?.filter((img: any) => !img.key) || [];

  // 3. Keys mantidas pelo usuário
  const keptKeys =
    props.gallery?.map((img: any) => img.key).filter(Boolean) || [];

  // 4. O que deve ser deletado
  const toDelete = oldKeys.filter((key: any) => !keptKeys.includes(key));

  // 5. Disparar uploads em background
  if (newImages.length > 0) {
    Promise.all(
      newImages.map(async (file: any) => {
        const uri = file?.uri || file;
        if (uri) {
          const res = await uploadFileAnnouncement(uri, id);

        }
      })
    ).catch((err) => console.error("Erro em uploads:", err));
  }

  // 6. Disparar exclusões em background
  if (toDelete.length > 0) {
    Promise.all(
      toDelete.map(async (key: string) => {
        try {
          const resDel = await axios.delete(
            `${config.API_URL}announcement/files`,
            { data: { key } }
          );
          console.log(`Imagem deletada: ${key}`, resDel.data);
        } catch (err) {
          console.error(`Erro ao deletar imagem ${key}:`, err);
        }
      })
    ).catch((err) => console.error("Erro em deletar:", err));
  }

  // 7. Retorna imediatamente após PATCH
  return response.data;
}

