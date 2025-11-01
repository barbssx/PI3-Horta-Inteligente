const express = require("express");
const router = express.Router();
const mlController = require("../controllers/mlController");

router.post("/treinar", mlController.treinarModelo);
router.post("/prever", mlController.preverTemperatura);
router.get("/ultimos", mlController.ultimosComPrevisao);
router.get("/ultimos-intervalo", mlController.ultimosComIntervalo);

module.exports = router;
