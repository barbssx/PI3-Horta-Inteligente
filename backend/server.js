const express = require('express');
const cors = require('cors');
const app = express();
const uploadRoutes = require('./routes/upload');
const registrosRoutes = require('./routes/registros');

const allowedOrigins = [
  'http://localhost:5173',
  'https://dashboard-eight-xi-35.vercel.app/',
  'https://dashboard-production-4d11e.up.railway.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  }
}));

app.use(express.json());
app.use('/api/upload', uploadRoutes);
app.use('/api/registros', registrosRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
