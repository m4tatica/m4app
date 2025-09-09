// backend_project/index.js

const express = require("express");
const bodyParser = require("body-parser"); // body-parser está incluso no express moderno, mas mantemos por consistência.
const cors = require("cors");
const path = require("path");
const { initializeDatabase } = require("./src/models/init");

// Importando as rotas
const taxasRoutes = require("./src/routes/taxas");
const authRoutes = require("./src/routes/auth");
const produtosRoutes = require("./src/routes/produtos");
const precificacaoRoutes = require("./src/routes/precificacao");
const simuladorRoutes = require("./src/routes/simulador");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Usando o parser de JSON nativo do Express

// --- CORREÇÃO PRINCIPAL ---
// Servir os arquivos estáticos (build do frontend) da pasta 'public'
// Esta linha é crucial e deve vir ANTES da rota catch-all ('*').
app.use(express.static(path.join(__dirname, 'public')));

// Inicializa o banco de dados (pode ser importante para Vercel estabelecer a conexão)
initializeDatabase().catch(error => {
  console.error('Falha ao inicializar o banco de dados na inicialização:', error);
});

// Rotas da API - Ajustadas para serem mais explícitas
// Agora cada conjunto de rotas tem seu próprio prefixo.
app.use("/api/taxas", taxasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/produtos", produtosRoutes);
app.use("/api/precificacao", precificacaoRoutes);
app.use("/api/simulador", simuladorRoutes);

// Rota catch-all para servir a Single Page Application (SPA)
// Se nenhuma rota de API ou arquivo estático for encontrado, ele serve a página principal do React.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- ESSENCIAL PARA VERCEL ---
// Em vez de app.listen(), exportamos o 'app' para que a Vercel possa
// usá-lo como uma função serverless.
module.exports = app;
