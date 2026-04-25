const NecessidadeModels = require('../models/NecessidadeModels');

class NecessidadesController {
  async index(req, res) {
    try {
      const lista = await NecessidadeModels.findAll();
      return res.json(lista);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao carregar dashboard.' });
    }
  }

  async store(req, res) {
    try {
      // Apenas ADMIN pode incluir novas necessidades críticas no dashboard
      if (req.userTipo !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso restrito ao Administrador.' });
      }

      const item = await NecessidadeModels.create(req.body);
      return res.status(201).json({
        message: "Necessidade registrada com sucesso!",
        item
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao processar inclusão.' });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { centro_id_item } = req.body;

      // Verificação de segurança: Só ADMIN ou o centro responsável atualiza
      if (req.userTipo !== 'ADMIN' && req.userCentroId !== centro_id_item) {
        return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para atualizar este item.' });
      }
      const atualizado = await NecessidadeModels.update(id, req.body);
      return res.json(atualizado);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar item.' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
  
      // Verificação de segurança: Só ADMIN apaga
      if (req.userTipo !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem remover a lista de necessidades.' });
      }
  
      const removido = await NecessidadeModels.delete(id);
  
      if (!removido) {
        return res.status(404).json({ error: 'Necessidade não encontrada.' });
      }
  
      return res.json({ message: 'Necessidade removida com sucesso!' });
    } catch (err) {
      // Se a necessidade tiver doações vinculadas, o banco pode dar erro de chave estrangeira (FK)
      return res.status(500).json({ 
        error: 'Não é possível remover uma necessidade que possui doações vinculadas.' 
        });
      }
    }
}

module.exports = new NecessidadesController();