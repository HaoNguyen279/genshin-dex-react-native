import axios from "axios";



const BASE_URL = process.env.BASE_URL;
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});


const getAllWeapons = async () => {
  try {
    const response = await api.get("/weapons");
    return response.data;
  } catch (error) {
    console.error("Error fetching all weapons:", error);
    throw error;
  }
}