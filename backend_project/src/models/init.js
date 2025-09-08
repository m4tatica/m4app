const { pool } = require("../config/database");

async function initializeDatabase() {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS taxas (
                id SERIAL PRIMARY KEY,
                parcela_tipo VARCHAR(20) UNIQUE NOT NULL,
                taxa_percentual NUMERIC(5, 2) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                senha_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS produtos (
                id SERIAL PRIMARY KEY,
                codigo_produto VARCHAR(50) UNIQUE,
                nome_produto VARCHAR(255) NOT NULL,
                preco_venda_avista NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("Tabelas verificadas/criadas com sucesso.");

    await pool.query(`
            INSERT INTO taxas (parcela_tipo, taxa_percentual) VALUES
            (\'Pix\', 0.00), (\'Débito\', 1.09), (\'1x\', 3.48), (\'2x\', 5.10), (\'3x\', 5.92),
            (\'4x\', 6.79), (\'5x\', 7.61), (\'6x\', 8.43), (\'7x\', 9.25), (\'8x\', 10.07),
            (\'9x\', 10.89), (\'10x\', 11.71), (\'11x\', 12.53), (\'12x\', 13.35)
            ON CONFLICT (parcela_tipo) DO NOTHING;

            INSERT INTO produtos (codigo_produto, nome_produto, preco_venda_avista) VALUES
            (\'TAU0001\', \'Pistola Taurus G2C .38TPC\', 5350.00),
            (\'TAU00050\', \'PISTOLA TAURUS GX4 CARREY .38TPC PRETA\', 7490.00),
            (\'TAU00229\', \'PISTOLA TAURUS GX2 .38TPC PRETA\', 5900.00),
            (\'TAU00239\', \'PISTOLA TAURUS G3 TORO .38TPC PRETA\', 6299.00)
            ON CONFLICT (codigo_produto) DO NOTHING;
        `);
    console.log("Dados iniciais inseridos/verificados com sucesso.");
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error.message);
  }
}

module.exports = { initializeDatabase };

