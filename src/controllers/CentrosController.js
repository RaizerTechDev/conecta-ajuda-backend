const CentroDistribuicaoModels = require('../models/CentroDistribuicaoModels');

class CentrosController {
      async store(req, res) {
    try {
      const novoCentro = await CentroDistribuicaoModels.create(req.body);
      return res.status(201).json(novoCentro);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao criar centro de distribuição.' });
    }
  }  

  async index(req, res) {
    try {
      const centros = await CentroDistribuicaoModels.findAll();
      return res.json(centros);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao listar centros.' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const centroAtualizado = await CentroDistribuicaoModels.update(id, req.body);
      
      if (!centroAtualizado) {
        return res.status(404).json({ error: 'Centro não encontrado.' });
      }

      return res.json(centroAtualizado);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar centro.' });
    }
  }

  async delete(req, res) {
  try {
    const { id } = req.params;

    // Verificação de segurança: Só ADMIN apaga
    if (req.userTipo !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem remover centros.' });
    }

    const removido = await CentroDistribuicaoModels.delete(id);

    if (!removido) {
      return res.status(404).json({ error: 'Centro de distribuição não encontrado.' });
    }

    return res.json({ message: 'Centro de distribuição removido com sucesso!' });
  } catch (err) {
    // Se o centro tiver doações vinculadas, o banco pode dar erro de chave estrangeira (FK)
    return res.status(500).json({ 
      error: 'Não é possível remover um centro que possui necessidades ou doações vinculadas.' 
      });
    }
  }
}

module.exports = new CentrosController();