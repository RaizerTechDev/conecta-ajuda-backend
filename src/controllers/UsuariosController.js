const UsuarioModels = require('../models/UsuarioModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsuariosController {
  async store(req, res) {
    try {
      
      const { nome, email, senha, tipo, centro_id } = req.body;
      const existe = await UsuarioModels.findByEmail(email);
      if (existe) return res.status(400).json({ error: 'E-mail já cadastrado' });

      const senhaHash = await bcrypt.hash(senha, 8);
      const novoUsuario = await UsuarioModels.create({ ...req.body, senha: senhaHash });
      
      res.status(201).json({
    mensagem: "Usuário cadastrado com sucesso",
    usuario:  novoUsuario
    }) 
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
  }

 async login(req, res) { 
    const { email, senha } = req.body;
    try {
      const usuario = await UsuarioModels.findByEmail(email);
      // 1. Verifica se usuário existe
      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }    

      // 2. Verifica se a senha bate usando bcrypt
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      console.log("A SENHA BATE? ", senhaCorreta ? "SIM" : "NÃO");
      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }
      const { id, nome, tipo, centro_id } = usuario;

      

      // 3. Gera o Token JWT   
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo, centro_id: usuario.centro_id }, 
  process.env.AUTH_SECRET, 
  { expiresIn: '1d' }
    );

    return res.json({
      usuario: { id, nome, email, tipo },
      token
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro no servidor ao tentar logar.' });
  }
 }
 async index(req, res) {
  try {
    const usuarios = await UsuarioModels.findAll();
    return res.status(200).json({
      usuarios, rows: usuarios.length
      });
      
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
 }

 // Rota GET /usuarios/:id - Detalhes de um usuário específico
 async show(req, res) {
  try {
    const { id } = req.params;
    console.log("Buscando usuário com ID:", id);
    const usuario = await UsuarioModels.findById(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.json(usuario);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
}

//
async update(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, tipo, centro_id } = req.body;

    const usuarioAtualizado = await UsuarioModels.update(id, {
      nome,
      email,
      tipo,
      centro_id
    });

    if (!usuarioAtualizado) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.json({
      mensagem: "Usuário atualizado e vinculado ao centro!",
      usuario: usuarioAtualizado
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
}

// Rota DELETE /usuarios/:id - Remover um usuário
async delete(req, res) {
  try {
    const { id } = req.params;

    // Verificação de segurança: Só ADMIN apaga
    if (req.userTipo !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem remover usuarios.' });
    }

    const removido = await UsuarioModels.delete(id);

    if (!removido) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.json({ message: 'Usuário removido com sucesso!' });
  } catch (err) {
   // Se o usuário tiver doações vinculadas, o banco pode dar erro de chave estrangeira (FK)
    return res.status(500).json({ 
      error: 'Não é possível remover o usuário!' 
      });
    }
  }

}



module.exports = new UsuariosController();