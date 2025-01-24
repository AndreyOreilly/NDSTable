import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://195.133.39.82:8080";

console.log("Base URL:", baseURL);

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.error("Ошибка 401: Требуется повторная авторизация");
      }

      if (status === 404) {
        console.error("Ошибка 404: Ресурс не найден");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
