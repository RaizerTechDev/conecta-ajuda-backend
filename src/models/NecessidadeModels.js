const db = require('../database');

class Necessidade {


async findAll() {
  const query = `
    SELECT 
        n.id AS necessidade_id,
        c.nome AS centro_distribuicao_nome, 
        cat.nome AS categorias,
        n.item_nome,
        n.quantidade_atual,
        n.quantidade_objetivo,
        n.status,
        ROUND((n.quantidade_atual::DECIMAL / n.quantidade_objetivo::DECIMAL) * 100, 2) AS porcentagem_concluida,
        n.prioridade,
        (
          SELECT STRING_AGG(u.nome, ', ') 
          FROM usuarios u 
          WHERE u.centro_id = c.id AND u.tipo = 'ADMIN'
        ) AS administradores_responsafeis
    FROM necessidades n
    JOIN centros_distribuicao c ON n.centro_id = c.id
    JOIN categorias cat ON n.categoria_id = cat.id
    ORDER BY 
        CASE 
            WHEN n.status = 'ATIVO' THEN 1 
            ELSE 2 
        END ASC,
        CASE n.prioridade 
            WHEN 'CRITICA' THEN 1 
            WHEN 'ALTA'    THEN 2 
            WHEN 'MEDIA'   THEN 3 
            WHEN 'BAIXA'   THEN 4 
            ELSE 5
        END ASC,
        n.item_nome ASC;
  `;
  const { rows } = await db.query(query);
  return rows;
}

  async create(data) {
    const { item_nome, quantidade_objetivo, quantidade_atual, centro_id, categoria_nome, prioridade, status } = data;

    // 1. Lógica Dinâmica de Categoria
    // Tenta encontrar a categoria pelo nome ou cria uma nova
    let catQuery = await db.query('SELECT id FROM categorias WHERE LOWER(nome) = LOWER($1)', [categoria_nome]);
    let categoria_id;

    // Se a categoria já existe, usa o ID existente, caso contrário, cria uma nova categoria e usa seu ID
    if (catQuery.rows.length > 0) {
      categoria_id = catQuery.rows[0].id;
    // Se a categoria não existe, cria uma nova e pega o ID retornado
    } else {
      const newCat = await db.query('INSERT INTO categorias (nome) VALUES ($1) RETURNING id', [categoria_nome]);
      categoria_id = newCat.rows[0].id;
    }

    // 2. Insere a necessidade com o ID (novo ou existente)
    const query = `
      INSERT INTO necessidades (item_nome, quantidade_objetivo, quantidade_atual, centro_id, categoria_id, prioridade, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;
    const values = [item_nome, quantidade_objetivo, quantidade_atual || 0, centro_id, categoria_id, prioridade, status || 'ATIVO'];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async update(id, data) {
  const { item_nome, quantidade_objetivo, quantidade_atual, prioridade, status, categoria_nome } = data;

  const novoStatus = Number(quantidade_atual) >= Number(quantidade_objetivo) ? 'CONCLUIDO' : 'ATIVO';

  try {
    // 1. Lógica de Categoria (Igual ao Create)
    // Usamos TRIM e LOWER para garantir a comparação
    let catQuery = await db.query(
      'SELECT id FROM categorias WHERE LOWER(TRIM(nome)) = LOWER(TRIM($1))', 
      [categoria_nome]
    );
    console.log("Categoria ID encontrada:", catQuery.rows[0]?.id);
    
    let categoria_id;

    if (catQuery.rows.length > 0) {
      categoria_id = catQuery.rows[0].id;
    } else {
      // Se o admin editou o nome da categoria para algo que não existe, cria na hora
      const newCat = await db.query(
        'INSERT INTO categorias (nome) VALUES (TRIM($1)) RETURNING id', 
        [categoria_nome]
      );
      categoria_id = newCat.rows[0].id;
    }

    // 2. Executa o Update na tabela necessidades
    // IMPORTANTE: Verifique se o nome da coluna no banco é categoria_id
    const query = `
      UPDATE necessidades 
      SET item_nome = $1, 
          quantidade_objetivo = $2, 
          quantidade_atual = $3, 
          prioridade = $4, 
          status = $5, 
          categoria_id = $6
      WHERE id = $7 
      RETURNING *
    `;
    
    const values = [
      item_nome, 
      quantidade_objetivo, 
      quantidade_atual, 
      prioridade, 
      novoStatus, 
      categoria_id, 
      id
    ];

    const { rows } = await db.query(query, values);
    
    if (rows.length === 0) {
        throw new Error("Necessidade não encontrada para atualizar.");
    }

    return rows[0];
  } catch (error) {
    console.error("Erro no Update do Model:", error);
    throw error;
  }
}

   async delete(id) {
    
  // Em vez de apagar, apenas "esconde" a necessidade
  const query = "UPDATE necessidades SET status = 'CONCLUIDO' WHERE id = $1 RETURNING id";
  const { rows } = await db.query(query, [id]);
  return rows.length > 0;
}
  }

module.exports = new Necessidade();