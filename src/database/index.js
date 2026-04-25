require('dotenv').config();
const { Pool } = require('pg');

// Verifica se a URL do banco aponta para o computador local
const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Se for local, ssl = false. Se for Render, ativa o SSL.
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('🐘 PostgreSQL conectado com sucesso!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};