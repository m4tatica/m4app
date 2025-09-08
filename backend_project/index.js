const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { initializeDatabase } = require("./src/models/init");
const taxasRoutes = require("./src/routes/taxas");
const authRoutes = require("./src/routes/auth");
const produtosRoutes = require("./src/routes/produtos");
const precificacaoRoutes = require("./src/routes/precificacao");
const simuladorRoutes = require("./src/routes/simulador");

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS
app.use(cors());

app.use(bodyParser.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use("/api", taxasRoutes);
app.use("/api", authRoutes);
app.use("/api", produtosRoutes);
app.use("/api", precificacaoRoutes);
app.use("/api", simuladorRoutes);

// Rota catch-all para SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function startServer() {
  try {
    await initializeDatabase();
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
    
    // Manter o servidor rodando
    process.on('SIGTERM', () => {
      console.log('Recebido SIGTERM, fechando servidor...');
      server.close(() => {
        console.log('Servidor fechado.');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('Recebido SIGINT, fechando servidor...');
      server.close(() => {
        console.log('Servidor fechado.');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

