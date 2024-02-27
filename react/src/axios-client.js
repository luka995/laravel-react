import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

//request interceptors for sending token with request
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        try{
            //destructure only response from error
            const {response} = error;
            //token is probably expired or invalid
            if (response.status === 401) {
                localStorage.removeItem('ACCESS_TOKEN');
            }
        } catch (e) {
            console.log(e);
        }

        throw error;
    }
);

export default axiosClient;
