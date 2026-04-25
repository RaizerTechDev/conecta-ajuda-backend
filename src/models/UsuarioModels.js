const db = require('../database');

class Usuario {
  // Dentro da class Usuario
  async create({ nome, email, senha, tipo, centro_id }) {
    const query = `
      INSERT INTO usuarios (nome, email, senha, tipo, centro_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, tipo, centro_id
    `;
 const values = [nome, email, senha, tipo || 'DOADOR', centro_id || null];
  const { rows } = await db.query(query, values);
  return rows[0];
}

async findByEmail(email) {
  // O "*" garante que a senha (criptografada) venha para o controller comparar
  const query = 'SELECT * FROM usuarios WHERE email = $1';
  const { rows } = await db.query(query, [email]);
  return rows[0];
}

async findAll() {
  // Buscamos apenas os campos necessários, nunca a senha!
  const query = 'SELECT id, nome, email, tipo, centro_id FROM usuarios ORDER BY tipo ASC';
  const { rows } = await db.query(query);
  return rows;
}

async findById(id) {
  const query = 'SELECT id, nome, email, tipo, centro_id  FROM usuarios WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0]; // Retorna o usuário ou undefined se não encontrar
 }

 async update(id, { nome, email, tipo, centro_id }) {
  const query = `
    UPDATE usuarios 
    SET nome = $1, email = $2, tipo = $3, centro_id = $4
    WHERE id = $5 
    RETURNING id, nome, email, tipo, centro_id
  `;
  const values = [nome, email, tipo, centro_id, id];
  const { rows } = await db.query(query, values);
  return rows[0];
}

async delete(id) {
  // O result contém informações sobre a execução da query
  const result = await db.query('DELETE FROM usuarios WHERE id = $1', [id]);  
  // Retorna true se algo foi deletado (1 ou mais), ou false se nada foi deletado (0)
  return result.rowCount > 0;
  }
}

module.exports = new Usuario();