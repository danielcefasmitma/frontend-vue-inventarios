import axios from "axios";

const BASE_URL = "https://backinventarios.blumbit.net";
const BASE_API_URL = `${BASE_URL}/api`;

const instance = axios.create({
  baseURL: BASE_API_URL,
  /*headers: {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  },*/
});

// Interceptor del lado del Cliente.
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token") || undefined;
  if(token){
    config.headers.Authorization = "Bearer " + token;
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// Interceptor del lado del servidor

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(error.response?.status === 401) {
      localStorage.removeItem("access_token");
      location.href = "/auth/ingresar";
    }
    return Promise.reject(error);
  },
);
export default instance;
