const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

let currentModel = 'liquid/lfm-2.5-1.2b-thinking:free' // YER TUTUCU MODEL BURAYI DEĞİŞTİRİN openrounterapi.js İLE AYNI OLMALI

// Middleware
app.use(cors({
  origin: 'http://localhost:5173' // Vite default port
}));
app.use(express.json());

// OpenRouter API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = currentModel, messages } = req.body;

    if (!message && !messages) {
      return res.status(400).json({ error: 'Message veya messages gerekli' });
    }

    const chatMessages = messages || [
      {
        role: 'user',
        content: message
      }
    ];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: chatMessages
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MOIRAI_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'My React App'
        }
      }
    );

    res.json({
      success: true,
      data: response.data.choices[0].message.content,
      usage: response.data.usage
    });

  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error?.message || 'Bir hata oluştu'
    });
  }
});

app.get('/api/models', async (req, res) => {
  try {
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.MOIRAI_OPENROUTER_API_KEY}`
      }
    });

    res.json({
      success: true,
      models: response.data.data
    });
  } catch (error) {
    console.error('Error fetching models:', error.message);
    res.status(500).json({
      success: false,
      error: 'Modeller alınamadı'
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
