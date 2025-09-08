const express = require("express");
const router = express.Router();
const taxasController = require("../controllers/taxasController");
const { authenticateToken } = require("../middleware/auth");

// Rotas públicas
router.get("/taxas", taxasController.getAllTaxas);
router.get("/taxas/:id", taxasController.getTaxaById);

// Rotas protegidas (requerem autenticação)
router.post("/taxas", authenticateToken, taxasController.createTaxa);
router.put("/taxas/:id", authenticateToken, taxasController.updateTaxa);
router.delete("/taxas/:id", authenticateToken, taxasController.deleteTaxa);

module.exports = router;

