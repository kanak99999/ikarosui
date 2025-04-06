import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    
});
axiosInstance.interceptors.request.use(
    (config) => {
      
      const accessToken = localStorage.getItem('iToken'); // Example: use a cookie or auth context if SSR is involved
  
      if (accessToken) {
        console.log(accessToken);
        config.headers['Authorization'] = `${accessToken}`;
      }
  
      return config;
    },
    (error) => {
      console.log(JSON.stringify(error));
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;