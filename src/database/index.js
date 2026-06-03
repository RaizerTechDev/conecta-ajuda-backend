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

// FUNÇÃO AUTOMÁTICA PARA CRIAR SUAS TABELAS OFICIAIS
const inicializarTabelas = async () => {
  try {
    console.log("🛠️ Verificando estrutura de tabelas do Conecta Ajuda...");

    // 1. Centros de Distribuição e Categorias (Tabelas Base)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS centros_distribuicao (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        endereco TEXT NOT NULL,
        cidade VARCHAR(50) NOT NULL,
        telefone VARCHAR(20),
        responsavel VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categorias (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL
      );
    `);

    // 2. Usuários e Necessidades (Dependem das tabelas acima)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(250) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        tipo VARCHAR(20) CHECK (tipo IN ('ADMIN', 'DOADOR')) DEFAULT 'DOADOR',
        centro_id INTEGER REFERENCES centros_distribuicao(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS necessidades (
        id SERIAL PRIMARY KEY,
        centro_id INTEGER REFERENCES centros_distribuicao(id) ON DELETE CASCADE,
        categoria_id INTEGER REFERENCES categorias(id),
        item_nome VARCHAR(100) NOT NULL,
        quantidade_objetivo INTEGER NOT NULL,
        quantidade_atual INTEGER DEFAULT 0,
        prioridade VARCHAR(10) CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA')),
        status VARCHAR(20) DEFAULT 'ATIVO',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Registro de Doações (Depende de Usuários e Necessidades)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS registro_doacoes (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id), 
        necessidade_id INTEGER REFERENCES necessidades(id), 
        item_avulso_nome VARCHAR(250),
        quantidade_doada INTEGER NOT NULL, 
        status VARCHAR(20) CHECK (status IN ('PENDENTE', 'ENTREGUE', 'CANCELADO')) DEFAULT 'PENDENTE',
        data_intencao TIMESTAMP DEFAULT CURRENT_TIMESTAMP     
      );
    `);

    // 4. Popula dados iniciais de teste apenas se o banco estiver zerado
    const resultadoCentros = await pool.query("SELECT COUNT(*) FROM centros_distribuicao");
    if (parseInt(resultadoCentros.rows[0].count) === 0) {
      console.log("🌱 Banco vazio detectado. Inserindo dados de teste...");
      
      await pool.query(`
        INSERT INTO centros_distribuicao (nome, endereco, cidade, telefone, responsavel) VALUES 
        ('Ginásio Municipal Central', 'Rua das Flores, 123', 'Gaspar', '47 9999-0001', 'Rafael Raizer'),
        ('Igreja Matriz - Salão Paroquial', 'Praça da Matriz, s/n', 'Gaspar', '47 9999-0002', 'Carlos Souza');
      `);

      await pool.query(`
        INSERT INTO categorias (nome) VALUES ('Alimentos'), ('Higiene Pessoal'), ('Limpeza');
      `);

      await pool.query(`
        INSERT INTO usuarios (nome, email, senha, tipo, centro_id) VALUES 
        ('Rafael Raizer', 'rafael@admin.com', 'admin123', 'ADMIN', 1),
        ('Carlos Souza', 'carlos@admin.com', 'admin123', 'ADMIN', 2),
        ('Marcia Raizer', 'marcinha@gmail.com', 'doador123', 'DOADOR', NULL);
      `);

      await pool.query(`
        INSERT INTO necessidades (centro_id, categoria_id, item_nome, quantidade_objetivo, quantidade_atual, prioridade) VALUES 
        (1, 1, 'Cestas Básicas', 100, 85, 'BAIXA'), 
        (2, 2, 'Kits de Higiene', 200, 30, 'CRITICA'), 
        (1, 3, 'Sabão em Pó', 50, 10, 'ALTA');
      `);

      // Ajustado com os IDs 3 (Marcia) e 1 e 2 (Necessidades válidas) para evitar erro de Foreign Key
      await pool.query(`
        INSERT INTO registro_doacoes (usuario_id, necessidade_id, quantidade_doada, status) VALUES 
        (3, 1, 5, 'PENDENTE'), 
        (3, 2, 10, 'ENTREGUE');
      `);
      
      console.log("✅ Dados de teste inseridos com sucesso!");
    }

    console.log("🚀 Todas as tabelas estão prontas e sincronizadas!");
  } catch (err) {
    console.error("❌ Erro ao inicializar tabelas no banco de dados:", err);
  }
};

// Executa a inicialização de forma assíncrona
inicializarTabelas();

module.exports = {
  query: (text, params) => pool.query(text, params),
};