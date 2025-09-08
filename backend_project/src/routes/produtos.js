const express = require("express");
const router = express.Router();
const produtosController = require("../controllers/produtosController");
const { authenticateToken } = require("../middleware/auth");

// Rotas públicas
router.get("/produtos", produtosController.getAllProdutos);
router.get("/produtos/:id", produtosController.getProdutoById);

// Rotas protegidas (requerem autenticação)
router.post("/produtos", authenticateToken, produtosController.createProduto);
router.put("/produtos/:id", authenticateToken, produtosController.updateProduto);
router.delete("/produtos/:id", authenticateToken, produtosController.deleteProduto);

module.exports = router;

