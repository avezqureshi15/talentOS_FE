import axios from "axios";
import { BE_API_BASE_URL } from "@/constants/constants";

const httpClient = axios.create({
  baseURL: BE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  },
);

export default httpClient;
