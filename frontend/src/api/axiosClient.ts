import axios from "axios";


const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});



  axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken"); // or "userToken" depending on the role
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("userToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  

  export default axiosClient;