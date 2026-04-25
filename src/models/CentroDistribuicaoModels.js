const db = require('../database');

class CentroDistribuicao {
  async findAll() {
  const query = `
    SELECT 
      c.id,
      c.nome AS centro_nome, 
      c.endereco, 
      c.cidade, 
      c.telefone,

      STRING_AGG(u.nome, ', ') AS administradores_responsaveis,
      COUNT(u.id) AS total_voluntarios
    FROM centros_distribuicao c
    LEFT JOIN usuarios u ON u.centro_id = c.id AND u.tipo = 'ADMIN'
    GROUP BY c.id, c.nome, c.endereco, c.cidade, c.telefone
    ORDER BY c.id DESC
  `;
  const { rows } = await db.query(query);
  return rows;
}

 async create({ nome, endereco, cidade, telefone, responsavel }) {
    const query = `
      INSERT INTO centros_distribuicao (nome, endereco, cidade, telefone, responsavel)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [nome, endereco, cidade, telefone, responsavel];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async update(id, { nome, endereco, cidade, telefone, responsavel }) {
    const query = `
      UPDATE centros_distribuicao 
      SET nome = $1, endereco = $2, cidade = $3, telefone = $4, responsavel = $5
      WHERE id = $6 RETURNING *
    `;
    const values = [nome, endereco, cidade, telefone, responsavel, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  }
  
  async delete(id) {
    await db.query('DELETE FROM centros_distribuicao WHERE id = $1', [id]);
    return true;
  }
}

module.exports = new CentroDistribuicao();