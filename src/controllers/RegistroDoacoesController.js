const RegistroDoacaoModels = require('../models/RegistroDoacaoModels');

class RegistroDoacoesController {
  async store(req, res) {
    try {
      const doacao = await RegistroDoacaoModels.create(req.body);
      return res.status(201).json(doacao);
    } catch (err) {
       return res.status(500).json({ error: 'Erro ao registrar doação.' });
    }
  }

  async update(req, res) {
    try {
      if (req.userTipo !== 'ADMIN') return res.status(403).json({ error: 'Acesso negado.' });
      
      const { id } = req.params;
      const { status } = req.body; // 'ENTREGUE'
      const atualizada = await RegistroDoacaoModels.updateStatus(id, status);
      return res.json(atualizada);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao confirmar entrega.' });
    }
  }

  async index(req, res) {
    try {
    //   if (req.userTipo !== 'ADMIN') return res.status(403).json({ error: 'Acesso negado.' });
      const doacoes = await RegistroDoacaoModels.findAll();
      return res.json(doacoes);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao listar doações.' });
    }
  }

   async delete(req, res) {
    try {
      const { id } = req.params;
  
      // Verificação de segurança: Só ADMIN apaga
      if (req.userTipo !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem remover doações.' });
      }
  
      const removido = await DoacaoModels.delete(id);
  
      if (!removido) {
        return res.status(404).json({ error: 'Doação não encontrada.' });
      }
  
      return res.json({ message: 'Doação removida com sucesso!' });
    } catch (err) {
      // Se o centro tiver doações vinculadas, o banco pode dar erro de chave estrangeira (FK)
      return res.status(500).json({ 
        error: 'Não é possível remover uma doação que possui necessidades ou doações vinculadas.' 
        });
      }
    }
}

module.exports = new RegistroDoacoesController();