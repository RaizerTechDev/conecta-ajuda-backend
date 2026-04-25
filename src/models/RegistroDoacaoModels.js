const db = require('../database');

class Doacao {
async create(data) {
  const { necessidade_id, usuario_id, item_avulso_nome, quantidade_doada } = data;

  const query = `
    INSERT INTO registro_doacoes (
      necessidade_id, 
      usuario_id, 
     item_avulso_nome, 
      quantidade_doada, 
     
      status
    )
    VALUES ($1, $2, $3, $4, 'PENDENTE') 
    RETURNING *
  `;
  
  const values = [
    necessidade_id || null, 
    usuario_id, 
    item_avulso_nome || null, 
    quantidade_doada
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
}

  async updateStatus(id, status) {
    // 1. Pega os dados da doação antes de alterar
    const resultado = await db.query('SELECT * FROM registro_doacoes WHERE id = $1', [id]);
    const doacao = resultado.rows[0];

    if (!doacao) return null; 
    
    // 2. Atualiza o status no registro de doações
    const queryUpdate = `UPDATE registro_doacoes SET status = $1 WHERE id = $2 RETURNING *`;
    const { rows } = await db.query(queryUpdate, [status, id]);

    // 3. Se for entregue, incrementa na tabela necessidades
    if (status === 'ENTREGUE') {        
        const qtd = doacao.quantidade_doada || doacao.quantidade; 
        if (doacao.necessidade_id) {
             await db.query(
                'UPDATE necessidades SET quantidade_atual = quantidade_atual + $1 WHERE id = $2',
                [qtd, doacao.necessidade_id]
            );
        } else {
            // CAMINHO B: O item é novo (avulso)
            console.log(`Item avulso recebido: ${doacao.item_avulso_nome}`);
            // Opcional: Aqui você poderia criar a necessidade automaticamente se quisesse
        }
    }  
    return rows[0];
}
    async findAll() {
  const query = `
    SELECT 
        rd.id AS registro_id,
        u.nome AS doador, 
        -- Se item_nome for nulo, mostra o item_avulso_nome
        COALESCE(n.item_nome, rd.item_avulso_nome) AS item_doado,
       
        rd.quantidade_doada, 
        rd.data_intencao,
        rd.status
    FROM registro_doacoes rd
    JOIN usuarios u ON rd.usuario_id = u.id
    -- O LEFT JOIN permite que a doação apareça mesmo sem necessidade_id
    LEFT JOIN necessidades n ON rd.necessidade_id = n.id
    WHERE rd.status = 'PENDENTE' 
    ORDER BY rd.data_intencao DESC;
  `;
  const { rows } = await db.query(query);
  return rows;
}

 async delete(id) {
       await db.query('DELETE FROM registro_doacoes WHERE id = $1', [id]);
      return true;
  }
}

module.exports = new Doacao();