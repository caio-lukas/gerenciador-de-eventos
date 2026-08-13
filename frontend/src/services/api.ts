import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // Se estiver no emulador Android, mude 'localhost' para '10.0.2.2' no seu .env
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@EventosBR:token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Exportação padrão no final do arquivo
export default api;