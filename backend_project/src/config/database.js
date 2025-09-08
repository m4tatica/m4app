const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_Uvs1FOHpbhw5@ep-square-base-adqa2n6a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
});

pool.on('connect', () => {
    console.log('Conexão com PostgreSQL estabelecida com sucesso.');
});

pool.on('error', (err) => {
    console.error('Erro na conexão com PostgreSQL:', err.message);
});

module.exports = { pool };

