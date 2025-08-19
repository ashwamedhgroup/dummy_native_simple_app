import axios from "axios";
  import AuthStorage from "../auth/storage";
import cache from "../utility/cache";

const API_URL = process.env.EXPO_PUBLIC_API_URL

console.log("API URL:", API_URL);

const apiClient = axios.create({
  baseURL: `${API_URL}`
});
apiClient.interceptors.request.use(async (config) => {
  const token = await AuthStorage.getUser();
  console.log("Token from storage:", token);
  if (token) {
    config.headers.Authorization = `token ${token}`;
  }
  return config;
});


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token no longer valid — delete it
      await AuthStorage.removeToken();

      Toast.show({
        type: 'error',
        text1: 'Session expired',
        text2: 'Please login again.',
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

      return Promise.reject(new Error('Unauthorized'));
    }

    return Promise.reject(error);
  }
);

const originalGet = apiClient.get;

apiClient.get = async (url, config = {}) => {
  try {
    const response = await originalGet(url, config);

    if (response.status === 200) {
      await cache.store(url, response.data);
      return { ok: true, data: response.data };
    }

    return { ok: false, data: null };
  } catch (error) {
    const cachedData = await cache.get(url);
    if (cachedData) {
      console.warn("Serving cached data due to error:", error.message);
      return { ok: true, data: cachedData };
    }

    return { ok: false, error };
  }
};
export default apiClient;
