const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const os = require('os');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


// YER TUTUCU MODELLER BURAYI DEĞİŞTİRİN openrouterapi.js İLE AYNI OLMALI
let currentModel = 'stepfun/step-3.5-flash:free';
const backupModel = 'liquid/lfm-2.5-1.2b-instruct:free'; // Yedek model

// Local IP adresini otomatik bul
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // IPv4 ve internal olmayan adresleri al
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Middleware - Otomatik CORS
app.use(cors({
  origin: function(origin, callback) {
    // Origin yoksa (Postman, mobile app vb.) kabul et
    if (!origin) {
      return callback(null, true);
    }
    
    // Development mode: tüm localhost ve local IP'lere izin ver
    if (process.env.NODE_ENV !== 'production') {
      // localhost, 127.0.0.1 ve local network IP'lere izin ver
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      const isLocalNetwork = /^https?:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin);
      const is10Network = /^https?:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin);
      const is172Network = /^https?:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+(:\d+)?$/.test(origin);
      
      if (isLocalhost || isLocalNetwork || is10Network || is172Network) {
        return callback(null, true);
      }
    }
    
    // Production mode: sadece belirli domain'lere izin ver
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('CORS policy tarafından engellenmiş'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// OpenRouter API endpoint
app.post('/api/chat', async (req, res) => {
  const { message, model = currentModel, messages } = req.body;

  if (!message && !messages) {
    return res.status(400).json({ error: 'Message veya messages gerekli' });
  }

  const chatMessages = messages || [{ role: 'user', content: message }];

  const callOpenRouter = async (selectedModel) => {
    return await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: selectedModel,
        messages: chatMessages
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MOIRAI_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': req.headers.origin || 'http://localhost:5173',
          'X-Title': 'My React App'
        }
      }
    );
  };

  try {
    // 1. Deneme: Ana model (currentModel veya gelen model)
    console.log(`Deneniyor: ${model}`);
    const response = await callOpenRouter(model);
    
    res.json({
      success: true,
      data: response.data.choices[0].message.content,
      usage: response.data.usage
    });

  } catch (error) {
    console.warn(`Ana model (${model}) hata verdi, yedek model deneniyor...`);

    try {
      // 2. Deneme: Yedek model
      const backupResponse = await callOpenRouter(backupModel);
      
      res.json({
        success: true,
        data: backupResponse.data.choices[0].message.content,
        usage: backupResponse.data.usage,
        isBackupUsed: true // Frontend'e yedek modelin kullanıldığını bildirebilirsin
      });
    } catch (backupError) {
      console.error('Yedek model de başarısız oldu:', backupError.message);
      res.status(500).json({
        success: false,
        error: 'Tüm model denemeleri başarısız oldu.'
      });
    }
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

// Server başlat - Tüm network interface'lerinde dinle
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIPAddress();
  console.log('=================================');
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://${localIP}:${PORT}`);
  console.log('=================================');
});