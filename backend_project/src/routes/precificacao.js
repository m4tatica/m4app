const express = require("express");
const router = express.Router();
const precificacaoController = require("../controllers/precificacaoController");

router.post("/precificacao/calcular", precificacaoController.calcularPrecificacao);

module.exports = router;

