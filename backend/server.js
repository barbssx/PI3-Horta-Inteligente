const cors = require("cors");
const fs = require("fs");
const express = require("express");
const path = require("path");
require("dotenv").config();

const sequelize = require("./config/database");
const uploadRoutes = require("./routes/upload");
const registrosRoutes = require("./routes/registros");
const mlRoutes = require("./routes/ml");

const app = express();

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Pasta uploads criada.");
}

const allowedOrigins = [
  "https://dashboard-eight-xi-35.vercel.app",
  "https://horta-inteligente-jxenulci8-barbaras-projects-04d294a6.vercel.app",
  "http://localhost:8080",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `O CORS bloqueou a origem: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(express.json());

app.use("/api/upload", uploadRoutes);
app.use("/api/registros", registrosRoutes);
app.use("/api/ml", mlRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err);
    process.exit(1);
  });
