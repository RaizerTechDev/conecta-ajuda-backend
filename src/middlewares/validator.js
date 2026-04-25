const validator = (schema) => {
  return (req, res, next) => {
    if (!schema) {
      console.error("❌ ERRO CRÍTICO: Você esqueceu de passar o Schema na rota!");
      return res.status(500).json({ error: 'Erro interno na validação da rota.' });
    }    
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ 
        errors: error.details.map(detail => detail.message) 
      });
    }

    next();
  };
};

module.exports = validator;