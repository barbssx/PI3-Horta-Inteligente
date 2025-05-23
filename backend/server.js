const express = require('express');
const cors = require('cors');
const app = express();
const uploadRoutes = require('./routes/upload');
const registrosRoutes = require('./routes/registros');

app.use(cors());
app.use(express.json());
app.use('/api/upload', uploadRoutes);
app.use('/api/registros', registrosRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
