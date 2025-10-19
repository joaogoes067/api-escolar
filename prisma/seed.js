// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding...');

  // 1. GARANTE QUE OS DADOS ANTIGOS SEJAM APAGADOS 
  await prisma.responsavel.deleteMany();
  await prisma.aluno.deleteMany();
  console.log('Dados antigos limpos.');

  // 2. CRIAÇÃO DO ADMIN
  const senhaAdminHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.responsavel.create({
    data: {
      nomeResponsavel: 'Admin',
      email: 'admin@escola.com',
      password: senhaAdminHash,
      role: 'admin',
    },
  });
  console.log(`Responsável Admin criado com ID: ${admin.id}`);

  // 3. CRIAÇÃO DO RESPONSÁVEL COM ALUNO VINCULADO
  const senhaMariaHash = await bcrypt.hash('senha123', 10);
  const maria = await prisma.responsavel.create({
    data: {
      nomeResponsavel: 'Maria Silva',
      email: 'maria@email.com',
      password: senhaMariaHash,
      role: 'user',
      alunos: {
        create: [
          {
            nomeAluno: 'João Silva',
            idade: 10,
            serie: '5º ano',
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });