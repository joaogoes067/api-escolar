// routes/private.js
const express = require("express");
const { PrismaClient } = require('@prisma/client');
const adminAuth = require("../middlewares/admin.js");

const router = express.Router();
const prisma = new PrismaClient();

// ========== ROTAS DE RESPONSÁVEL ==========
// VER PRÓPRIO PERFIL
router.get('/meu-perfil', async(req, res) => {
  try {
    const userId = req.userId;

    const responsavel = await prisma.responsavel.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nomeResponsavel: true,
        email: true,
        role: true,
        alunos: {
          select: {
            id: true,
            nomeAluno: true,
            idade: true,
            serie: true,
            createdAt: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });

    if (!responsavel) {
      return res.status(404).json({
        message: "Responsável não encontrado"
      });
    }

    res.status(200).json({
      message: "Perfil do responsável",
      responsavel
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Falha no servidor" });
  }
});

// DELETAR PRÓPRIO CADASTRO (deleta também os alunos vinculados)
router.delete('/deletar-cadastro', async(req, res) => {
  try {
    const userId = req.userId;

    await prisma.responsavel.delete({
      where: { id: userId }
    });

    res.status(200).json({
      message: "Cadastro deletado com sucesso"
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Falha no servidor" });
  }
});

// ========== ROTAS DE ALUNOS ==========
// CADASTRAR ALUNO (vinculado ao responsável logado)
router.post('/aluno', async(req, res) => {
  try {
    const userId = req.userId;
    const { nomeAluno, idade, serie } = req.body;

    if (!nomeAluno) {
      return res.status(400).json({
        message: "O campo nomeAluno é obrigatório"
      });
    }

    const novoAluno = await prisma.aluno.create({
      data: {
        nomeAluno,
        idade: idade || null,
        serie: serie || null,
        responsavelId: userId
      }
    });

    res.status(201).json({
      message: "Aluno cadastrado com sucesso",
      aluno: novoAluno
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// LISTAR MEUS ALUNOS
router.get('/meus-alunos', async(req, res) => {
  try {
    const userId = req.userId;

    const alunos = await prisma.aluno.findMany({
      where: { responsavelId: userId },
      select: {
        id: true,
        nomeAluno: true,
        idade: true,
        serie: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      message: "Lista de alunos do responsável",
      total: alunos.length,
      alunos
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Falha no servidor" });
  }
});

// DELETAR ALUNO
router.delete('/aluno/:id', async(req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Verifica se o aluno pertence ao responsável logado
    const aluno = await prisma.aluno.findFirst({
      where: { 
        id: id,
        responsavelId: userId 
      }
    });

    if (!aluno) {
      return res.status(404).json({
        message: "Aluno não encontrado ou você não tem permissão para deletá-lo"
      });
    }

    await prisma.aluno.delete({
      where: { id: id }
    });

    res.status(200).json({
      message: "Aluno deletado com sucesso"
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Falha no servidor" });
  }
});

// ========== ROTAS DE ADMIN ==========
// LISTAR TODOS OS RESPONSÁVEIS (APENAS ADMIN)
router.get('/list-responsaveis', adminAuth, async(req, res) => {
  try {
    const responsaveis = await prisma.responsavel.findMany({
      select: {
        id: true,
        nomeResponsavel: true,
        email: true,
        role: true,
        alunos: {
          select: {
            id: true,
            nomeAluno: true,
            idade: true,
            serie: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      message: "Todos os responsáveis listados",
      total: responsaveis.length,
      responsaveis
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Falha no servidor" });
  }
});

// LISTAR TODOS OS ALUNOS (APENAS ADMIN)
router.get('/list-alunos', adminAuth, async(req, res) => {
  try {
    const alunos = await prisma.aluno.findMany({
      select: {
        id: true,
        nomeAluno: true,
        idade: true,
        serie: true,
        responsavel: {
          select: {
            id: true,
            nomeResponsavel: true,
            email: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(200).json({
      message: "Todos os alunos listados",
      total: alunos.length,
      alunos
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Falha no servidor" });
  }
});

module.exports = router;

