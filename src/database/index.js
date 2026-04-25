require('dotenv').config(); // Isso deve estar no topo do arquivo!
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: String(process.env.DB_PASSWORD), // Forçar string ajuda a debugar
  port: process.env.DB_PORT,
});

// Teste de conexão (Opcional, mas ajuda muito no log)
pool.on('connect', () => {
  console.log('🐘 PostgreSQL conectado com sucesso!');
});

// Exporta uma função de consulta para ser usada em outros arquivos
module.exports = {
  query: (text, params) => pool.query(text, params),
};