// routes/public.js
const express = require("express");
const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/", (req, res) => {
  res.send("API Escolar - Sistema de Cadastro de Responsáveis e Alunos");
});

// CADASTRO DE RESPONSÁVEL
router.post("/cadastro", async(req, res) => {
  try {
    const { nomeResponsavel, email, password, role } = req.body;

    // Validação dos campos obrigatórios
    if (!nomeResponsavel || !email || !password) {
      return res.status(400).json({
        message: "Campos obrigatórios: nomeResponsavel, email, password"
      });
    }

    // Verifica se o email já está cadastrado
    const responsavelExistente = await prisma.responsavel.findUnique({
      where: { email: email }
    });

    if (responsavelExistente) {
      return res.status(409).json({
        message: "Email já cadastrado no sistema"
      });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Define o role 
    const userRole = role === "admin" ? "admin" : "user";

    // Cria o cadastro do responsável
    const novoResponsavel = await prisma.responsavel.create({
      data: {
        nomeResponsavel,
        email,
        password: hashPassword,
        role: userRole
      }
    });

    // Retorna os dados sem a senha
    res.status(201).json({
      message: "Cadastro realizado com sucesso",
      responsavel: {
        id: novoResponsavel.id,
        nomeResponsavel: novoResponsavel.nomeResponsavel,
        email: novoResponsavel.email,
        role: novoResponsavel.role,
        createdAt: novoResponsavel.createdAt
      }
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

// LOGIN
router.post('/login', async(req, res) => {
  try {
    const { email, password } = req.body;

    // Validação dos campos
    if (!email || !password) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios"
      });
    }

    // Busca o responsável pelo email
    const responsavel = await prisma.responsavel.findUnique({ 
      where: { email: email }
    });

    if (!responsavel) {
      return res.status(404).json({
        message: "Responsável não encontrado"
      });
    }

    // Verifica a senha
    const isMatch = await bcrypt.compare(password, responsavel.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Senha inválida"
      });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: responsavel.id, email: responsavel.email, role: responsavel.role }, 
      JWT_SECRET, 
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      responsavel: {
        id: responsavel.id,
        nomeResponsavel: responsavel.nomeResponsavel,
        email: responsavel.email,
        role: responsavel.role
      }
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

module.exports = router;