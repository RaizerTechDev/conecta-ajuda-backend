const Joi = require('joi');

const schemas = {
  usuario: Joi.object({
    nome: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).optional(),
    tipo: Joi.string().valid('ADMIN', 'DOADOR').optional(),
    centro_id: Joi.number().integer().allow(null).optional(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
  }), 
  
  categoria: Joi.object({
    nome: Joi.string().min(3).required(),
  }),  
  
  necessidade: Joi.object({
    item_nome: Joi.string().required(),
    quantidade_objetivo: Joi.number().integer().required(),
    quantidade_atual: Joi.number().integer().optional(),
    centro_id: Joi.number().integer().required(),
    categoria_nome: Joi.string().required(),
    prioridade: Joi.string().valid('CRITICA', 'ALTA', 'MEDIA', 'BAIXA').required(),
    status: Joi.string().valid('ATIVO', 'CONCLUIDO').optional(),
  }),

  doacao: Joi.object({
    necessidade_id: Joi.number().integer().allow(null).optional(),
    usuario_id: Joi.number().integer().required(),
    quantidade_doada: Joi.number().positive().required(),
    status: Joi.string().valid('PENDENTE', 'ENTREGUE').default('PENDENTE'),

    // Validação condicional: Se não houver necessidade_id, o nome do item avulso é obrigatório
    item_avulso_nome: Joi.string().min(3).when('necessidade_id', {
    is: Joi.not(Joi.exist()), // Se necessidade_id não existir...
    then: Joi.required(),     // ...o nome do item passa a ser obrigatório.
    otherwise: Joi.optional()
  })
  }),
};

module.exports = schemas;