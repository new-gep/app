import config from "../../../config.json";
import axios from "axios";
import Mask from "~/src/function/mask";
import uploadFileAnnouncement from "../upload/announcement";

type Props = {
  category?: string;
  title?: string;
  typePayment?: string;
  CPF_creator: string;
  typeAnnouncement?: string;
  salary?: string;
  included?: string;
  notIncluded?: string;
  information?: string;
  street?: string;
  model?: string;
  complement?:string
  number?: string;
  city?: string;
  district?: string;
  state?: string;
  zip?: string;
  gallery?: Array<any>; // <- importante tipar corretamente como array
};

export default async function CreateAnnouncement(props: Props) {
  try {
    // 1. Cria o anúncio
    const response = await axios.post(`${config.API_URL}announcement`, {
      category: props.category,
      title: props.title,
      typePayment: props.typePayment,
      CPF_Creator: { CPF: props.CPF_creator },
      typeAnnouncement: props.typeAnnouncement,
      salary: props.salary && Mask("remove", props.salary),
      included: props.included,
      model: props.model,
      notIncluded: props.notIncluded,
      information: props.information,
      street : props.street,
      number : props.number,
      complement : props.complement,
      city   : props.city,
      district : props.district, 
      state : props.state, 
      cep : props.zip
    });

    if(response.data.status !== 201) return response.data

    if (props.gallery && props.gallery.length > 0 && response.data.announcement.id) {
      for (const file of props.gallery) {
        const uri = file?.uri || file;
        if (uri) {
          await uploadFileAnnouncement(uri, response.data.announcement.id);
        }
      }
    } else {
      // console.log("sem gallery");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao criar anúncio:", error);
    throw error;
  }
}
