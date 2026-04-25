module.exports = (req, res, next) => {
  // O authMiddleware já validou o token e salvou req.userTipo
  if (req.userTipo === 'ADMIN') {
    return next(); // É admin? Pode passar para o próximo passo.
  }

  // Se não for ADMIN, barramos aqui mesmo
  return res.status(403).json({ 
    error: 'Acesso negado. Esta operação exige perfil de administrador.' 
  });
};