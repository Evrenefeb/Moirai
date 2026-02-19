import axios from "axios";

let currentModel = 'stepfun/step-3.5-flash:free'; // YER TUTUCU MODEL BURAYI DEĞİŞTİRİN server.js İLE AYNI OLMALI

// API Base URL'ini otomatik belirle
const getApiBaseUrl = () => {
  // Production için environment variable kullan
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development: mevcut hostname'i kullan
  const hostname = window.location.hostname;
  const port = 3001; // Backend port
  
  return `http://${hostname}:${port}/api`;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug için (geliştirme aşamasında kullanışlı)
console.log('API Base URL:', API_BASE_URL);

export const sendMessageToLLM = async (message, model = currentModel) => {
  try {
    const response = await api.post("/chat", {
      message,
      model,
    });

    return response.data.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Bir hata oluştu");
  }
};

// Konuşma geçmişi ile mesaj gönderme
export const sendMessagesToLLM = async (messages, model = currentModel) => {
  try {
    const response = await api.post("/chat", {
      messages,
      model,
    });

    return response.data.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Bir hata oluştu");
  }
};

// Mevcut modelleri getir
export const getAvailableModels = async () => {
  try {
    const response = await api.get("/models");
    return response.data.models;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Modeller alınamadı");
  }
};

export default api;