const express = require('express');
const cors = require('cors');
const app = express();
const uploadRoutes = require('./routes/upload');
const registrosRoutes = require('./routes/registros');

const allowedOrigins = [
  'https://dashboard-eight-xi-35.vercel.app',
  'https://horta-inteligente-jxenulci8-barbaras-projects-04d294a6.vercel.app',
  'http://localhost:8080' 
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);

    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `O CORS bloqueou a origem: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());
app.use('/api/upload', uploadRoutes);
app.use('/api/registros', registrosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
