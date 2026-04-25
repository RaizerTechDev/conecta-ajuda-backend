const db = require('../database');

class Categoria {
  async findAll() {
    const { rows } = await db.query('SELECT * FROM categorias');
    return rows;
  }

  // async create(nome) {
  //   const { rows } = await db.query(
  //     'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
  //     [nome]
  //   );
  //   return rows[0];
  // }
}

module.exports = new Categoria();