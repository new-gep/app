import config from "../../../config.json";
import axios from "axios";
type Props = {
  CPF_collaborator?: string;
  education?: string;
  experience?: string;
  skills?: string;
};

export default async function CreateCV(props: Props) {

  const response = await axios.post(`${config.API_URL}cv`, props);
  return response.data;
}
