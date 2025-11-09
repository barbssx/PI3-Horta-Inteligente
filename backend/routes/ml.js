const express = require("express");
const router = express.Router();
let mlController;
try {
  mlController = require("../controllers/mlController");
} catch (err) {
  console.error("Erro ao carregar controllers/mlController:", err);
  throw err;
}

function assertHandler(fn, name) {
  if (typeof fn !== "function") {
    throw new TypeError(
      `ML route handler '${name}' is not a function. Received: ${typeof fn}`
    );
  }
  return fn;
}

router.post(
  "/treinar",
  assertHandler(mlController.treinarModelo, "treinarModelo")
);
router.post(
  "/prever",
  assertHandler(mlController.preverTemperatura, "preverTemperatura")
);

router.get(
  "/ultimos",
  assertHandler(mlController.ultimosComPrevisao, "ultimosComPrevisao")
);
router.get(
  "/ultimos-intervalo",
  assertHandler(mlController.ultimosPorIntervalo, "ultimosPorIntervalo")
);

router.get(
  "/acuracia",
  assertHandler(mlController.calcularAcuraciaModelo, "calcularAcuraciaModelo")
);
router.get(
  "/anomalias",
  assertHandler(mlController.verificarAnomalias, "verificarAnomalias")
);
router.get(
  "/comandos-otimizacao",
  assertHandler(
    mlController.gerarComandosDeOtimizacao,
    "gerarComandosDeOtimizacao"
  )
);

module.exports = router;
