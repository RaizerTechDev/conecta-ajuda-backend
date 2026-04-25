const CategoriaModels = require('../models/CategoriaModels');

class CategoriasController {
  async index(req, res) {
    const categorias = await CategoriaModels.findAll();
    return res.status(200).json({
      categorias, rows: categorias.length
      });
  }

  // async store(req, res) {
  //   try {
    
  //   const { nome } = req.body;
  //   const novaCategoria = await CategoriaModels.create(nome);
  //      res.status(201).json({
  //   mensagem: "Categoria criado com sucesso",
  //   categoria:  novaCategoria
  //   }) 
  //   } catch (err) {
  //     return res.status(500).json({ error: 'Erro ao criar categoria' });
  //   }}
  }

module.exports = new CategoriasController();

