import axios from "axios";
import { endpoint } from "../config";

const publicAxios = axios.create({
  baseURL: endpoint,
});

export { publicAxios };
