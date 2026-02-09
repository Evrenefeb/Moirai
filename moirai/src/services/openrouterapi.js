import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

let currentModel = 'liquid/lfm-2.5-1.2b-thinking:free'; // YER TUTUCU MODEL BURAYI DEĞİŞTİRİN server.js İLE AYNI OLMALI

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
