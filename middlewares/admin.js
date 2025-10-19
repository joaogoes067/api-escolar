// middlewares/admin.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminAuth = async (req, res, next) => {
  try {
    const userId = req.userId; // Vem do middleware auth.js

    // Busca o responsável no banco
    const responsavel = await prisma.responsavel.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    // Verifica se existe e se é admin
    if (!responsavel || responsavel.role !== 'admin') {
      return res.status(403).json({
        message: "Acesso negado. Apenas administradores podem acessar esta rota."
      });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Erro ao verificar permissões"
    });
  }
};

module.exports = adminAuth;


