const express = require("express");
const router = express.Router();
const simuladorController = require("../controllers/simuladorController");
const { authenticateToken } = require("../middleware/auth");

// Rota protegida - Simulador Estratégico (Visão Interna)
router.post("/simulador/interno", authenticateToken, simuladorController.simuladorInterno);

// Rota pública - Simulador Público (Otimizado para Frontend)
router.get("/simulador/publico", simuladorController.simuladorPublico);

module.exports = router;

