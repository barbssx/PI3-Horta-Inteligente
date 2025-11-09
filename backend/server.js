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

// Endpoints de saúde para healthcheck do Railway
app.get("/health", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.status(200).json({ status: "ok" });
});
app.get("/api", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.status(200).json({ status: "ok" });
});

app.use("/api/upload", uploadRoutes);
app.use("/api/registros", registrosRoutes);
app.use("/api/ml", mlRoutes);

app.use((err, req, res, next) => {
  console.error(
    "Erro não tratado na rota:",
    err && err.stack ? err.stack : err
  );
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.status(500).json({
    erro: "Erro interno no servidor",
    detalhes: err && err.message ? err.message : String(err),
  });
});

process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err && err.stack ? err.stack : err);
});
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});

const startWithDbRetries = async () => {
  const maxAttempts = 5;
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      attempt++;
      await sequelize.authenticate();
      console.log("Conexão com o banco de dados estabelecida com sucesso.");
      break;
    } catch (err) {
      console.error(
        `Tentativa ${attempt} de ${maxAttempts} - erro ao conectar ao banco:`,
        err && err.message ? err.message : err
      );
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
};

startWithDbRetries();
