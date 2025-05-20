import config from "../../../config.json";
import axios from "axios";
type Props = {
  education?: string;
  experience?: string;
  skills?: string;
  update_at?: string;
};

export default async function UpdateCV(id: number, props: Props) {
  try {
    const response = await axios.patch(`${config.API_URL}cv/${id}`, props);
    return response.data;
  } catch (e) {
    return {
      status: 500,
    };
  }
}
