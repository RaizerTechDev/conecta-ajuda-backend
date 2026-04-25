require('dotenv').config();
const { Pool } = require('pg');

// No Render, a variável DATABASE_URL já vem com tudo (user, senha, host, porta)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Forçamos o SSL se não estiver em localhost, pois o Render exige
  ssl: process.env.DB_HOST === 'localhost' ? false : { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('🐘 PostgreSQL conectado com sucesso!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};