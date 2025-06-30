import config from "../../../config.json";
import axios from "axios";
import Mask from "~/src/function/mask";
import uploadFileAnnouncement from "../upload/announcement";

type Props = {
  category?: string;
  title?: string;
  typePayment?: string;
  typeAnnouncement?: string;
  salary?: string;
  included?: string;
  notIncluded?: string;
  information?: string;
  gallery?: Array<any>; // <- importante tipar corretamente como array
};

export default async function CreateAnnouncement(props: Props) {
  try {
    // 1. Cria o anúncio
    const response = await axios.post(`${config.API_URL}announcement`, {
      category: props.category,
      title: props.title,
      typePayment: props.typePayment,
      typeAnnouncement: props.typeAnnouncement,
      salary: props.salary && Mask('remove', props.salary),
      included: props.included,
      notIncluded: props.notIncluded,
      information: props.information,
    });

    const id = response.data?.id;

    // 2. Se tiver imagens, envia uma a uma
    if (props.gallery && props.gallery.length > 0 && id) {
      for (const file of props.gallery) {
        const uri = file?.uri || file;
        if (uri) {
          await uploadFileAnnouncement(uri, id);
        }
      }
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao criar anúncio:", error);
    throw error;
  }
}
