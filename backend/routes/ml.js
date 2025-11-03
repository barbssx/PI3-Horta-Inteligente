const express = require("express");
const router = express.Router();
const mlController = require("../controllers/mlController");

router.post("/treinar", mlController.treinarModelo);
router.post("/prever", mlController.preverTemperatura);

// Rotas de Visualização existentes
router.get("/ultimos", mlController.ultimosComPrevisao);
router.get("/ultimos-intervalo", mlController.ultimosPorIntervalo);

// RMSE
router.get("/acuracia", mlController.calcularAcuraciaModelo);

//  Alertas
router.get("/anomalias", mlController.verificarAnomalias);

// Recomendações
router.get("/comandos-otimizacao", mlController.gerarComandosDeOtimizacao);

module.exports = router;
