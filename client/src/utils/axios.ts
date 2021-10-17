import axios from 'axios';
import { BASE_URL } from 'src/constants';

const axiosConfig = {
  baseURL: BASE_URL,
  timeout: 30000
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
