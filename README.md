# 🎓 API Escolar - Sistema de Gerenciamento Escolar

> Sistema Backend completo para gerenciamento de responsáveis e alunos com autenticação JWT e controle de acesso por roles.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-Latest-blueviolet.svg)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

---

## 👨‍💻 Autor

**João Antônio Alves** - Matrícula: 20200069549

---

## 📋 Sobre o Projeto

Este projeto é uma API RESTful desenvolvida para gerenciar:
- ✅ Cadastro e autenticação de responsáveis
- ✅ Gerenciamento de alunos vinculados a responsáveis
- ✅ Sistema de permissões (roles): `user` e `admin`
- ✅ Autenticação segura com JWT (JSON Web Tokens)
- ✅ Relacionamento entre entidades (Responsavel → Alunos)

### 🎯 Objetivo

Demonstrar a comunicação eficiente entre **Backend** e **Banco de Dados** utilizando as melhores práticas de desenvolvimento, segurança e arquitetura REST.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Descrição |
|------------|-----------|
| **Node.js** | Ambiente de execução JavaScript |
| **Express** | Framework web minimalista |
| **Prisma ORM** | Interface moderna para banco de dados |
| **MongoDB** | Banco de dados NoSQL |
| **JWT** | Autenticação por tokens |
| **Bcrypt** | Criptografia de senhas |
| **Nodemon** | Hot reload em desenvolvimento |

---

## 📁 Estrutura do Projeto

```
api-escolar/
├── middlewares/
│   ├── auth.js          # Middleware de autenticação JWT
│   └── admin.js         # Middleware de autorização admin
├── routes/
│   ├── public.js        # Rotas públicas (cadastro, login)
│   └── private.js       # Rotas privadas (CRUD de alunos, admin)
├── prisma/
│   ├── schema.prisma    # Modelo de dados
│   └── seed.js          # Script de dados iniciais
├── .env                 # Variáveis de ambiente (não versionado)
├── .gitignore          # Arquivos ignorados pelo Git
├── index.js            # Ponto de entrada da aplicação
├── package.json        # Dependências do projeto
└── README.md           # Documentação
```

---

## 🛠️ Instalação e Configuração

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) ou MongoDB local

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/joaogoes067/api-escolar.git
cd api-escolar
```

### Passo 2: Instalar Dependências

```bash
npm install
```

**Ou instale manualmente as dependências principais:**

```bash
npm install express @prisma/client bcrypt jsonwebtoken dotenv mongodb
npm install prisma nodemon express-validator --save-dev
```

### Passo 3: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mongodb+srv://SEU_USUARIO:SUA_SENHA@cluster0.xxxxx.mongodb.net/escola?retryWrites=true&w=majority"
JWT_SECRET="sua_chave_secreta_super_segura_aqui"
```

⚠️ **Importante:** 
- Substitua `SEU_USUARIO` e `SUA_SENHA` pelas credenciais do seu MongoDB Atlas
- Gere uma chave JWT_SECRET forte (pode usar: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### Passo 4: Inicializar o Prisma

```bash
npx prisma init
```

### Passo 5: Sincronizar o Banco de Dados

```bash
npx prisma db push
npx prisma generate
```

### Passo 5 alternativo
Instalar Dependências Essenciais (Express, Prisma, Segurança):
    Este é o comando que instala TUDO que a API precisa para funcionar.
    npm install express @prisma/client 
    npm install bcrypt 
    npm install jsonwebtoken 
    npm install dotenv
    npm install mongodb 
    npm install prisma --save-dev
    npm install express-validator 
    npm install nodemon --save-dev

### Passo 6: Carregar Dados Iniciais (Seed)

Execute o script para criar usuários de teste:

```bash
node prisma/seed.js
```

**Usuários criados:**
- **Admin:** `admin@escola.com` / `admin123` (role: admin)
- **Maria:** `maria@email.com` / `senha123` (role: user)

### Passo 7: Iniciar o Servidor

```bash
npm start
```

Ou para desenvolvimento com hot reload:

```bash
npm run dev
```

O servidor estará rodando em: **http://localhost:3000**

---

## 🔐 Sistema de Autenticação e Autorização

### Roles (Papéis)

| Role | Permissões |
|------|-----------|
| **user** | Gerenciar apenas seus próprios alunos, ver próprio perfil |
| **admin** | Acesso total: listar todos os responsáveis e alunos do sistema |

### Fluxo de Autenticação

1. **Cadastro:** `POST /cadastro` (público)
2. **Login:** `POST /login` → Recebe um token JWT
3. **Rotas Privadas:** Enviar token no header: `Authorization: Bearer SEU_TOKEN`

---

## 📡 Endpoints da API

### 🌐 Rotas Públicas

#### 1. Página Inicial
```http
GET /
```

#### 2. Cadastrar Responsável
```http
POST /cadastro
Content-Type: application/json

{
  "nomeResponsavel": "Maria Silva",
  "email": "maria@email.com",
  "password": "senha123"
}
```

#### 3. Login
```http
POST /login
Content-Type: application/json

{
  "email": "maria@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "responsavel": {
    "id": "...",
    "nomeResponsavel": "Maria Silva",
    "email": "maria@email.com",
    "role": "user"
  }
}
```

---

### 🔒 Rotas Privadas - Responsável

> Requer header: `Authorization: Bearer TOKEN`

#### 4. Ver Próprio Perfil
```http
GET /meu-perfil
Authorization: Bearer TOKEN
```

#### 5. Deletar Própria Conta
```http
DELETE /deletar-cadastro
Authorization: Bearer TOKEN
```

---

### 👨‍🎓 Rotas Privadas - Alunos

#### 6. Cadastrar Aluno
```http
POST /aluno
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "nomeAluno": "João Silva",
  "idade": 10,
  "serie": "5º ano"
}
```

#### 7. Listar Meus Alunos
```http
GET /meus-alunos
Authorization: Bearer TOKEN
```

#### 8. Buscar Aluno Específico
```http
GET /aluno/:id
Authorization: Bearer TOKEN
```

#### 9. Atualizar Aluno
```http
PUT /aluno/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "nomeAluno": "João Pedro Silva",
  "idade": 11,
  "serie": "6º ano"
}
```

#### 10. Deletar Aluno
```http
DELETE /aluno/:id
Authorization: Bearer TOKEN
```

---

### 👑 Rotas de Administrador

> Requer header: `Authorization: Bearer TOKEN_ADMIN`

#### 11. Listar Todos os Responsáveis
```http
GET /list-responsaveis
Authorization: Bearer TOKEN_ADMIN
```

**Erro se não for admin (403):**
```json
{
  "message": "Acesso negado. Apenas administradores podem acessar esta rota."
}
```

#### 12. Buscar Responsável por ID
```http
GET /responsavel/:id
Authorization: Bearer TOKEN_ADMIN
```

#### 13. Listar Todos os Alunos
```http
GET /list-alunos
Authorization: Bearer TOKEN_ADMIN
```

---

## 🧪 Guia de Testes

### Ferramenta Recomendada
- [Thunder Client](https://www.thunderclient.com/) (extensão do VS Code)
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)

### Cenário A: Usuário Comum (Maria)

| Passo | Método | Endpoint | Body | Objetivo |
|-------|--------|----------|------|----------|
| 1 | POST | `/login` | `{"email": "maria@email.com", "password": "senha123"}` | Obter token de Maria |
| 2 | POST | `/aluno` | `{"nomeAluno": "João Silva", "idade": 10, "serie": "5º ano"}` | Cadastrar aluno |
| 3 | GET | `/meu-perfil` | - | Ver perfil e alunos vinculados |
| 4 | GET | `/meus-alunos` | - | Listar alunos de Maria |

### Cenário B: Administrador

| Passo | Método | Endpoint | Body | Resultado Esperado |
|-------|--------|----------|------|-------------------|
| 1 | POST | `/login` | `{"email": "admin@escola.com", "password": "admin123"}` | Token de admin |
| 2 | GET | `/list-responsaveis` | - | ✅ 200 OK - Lista completa |
| 3 | GET | `/list-alunos` | - | ✅ 200 OK - Todos os alunos |

### Cenário C: Teste de Autorização Negada

| Passo | Método | Endpoint | Token | Resultado Esperado |
|-------|--------|----------|-------|-------------------|
| 1 | POST | `/login` | - | Login como Maria |
| 2 | GET | `/list-responsaveis` | Token de Maria | ❌ 403 Forbidden |

---

## 📊 Modelo de Dados (Prisma Schema)

```prisma
model Responsavel {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  nomeResponsavel String
  email           String   @unique
  password        String
  role            String   @default("user")
  alunos          Aluno[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Aluno {
  id            String      @id @default(auto()) @map("_id") @db.ObjectId
  nomeAluno     String
  idade         Int?
  serie         String?
  responsavelId String      @db.ObjectId
  responsavel   Responsavel @relation(fields: [responsavelId], references: [id], onDelete: Cascade)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

**Relacionamento:**
- Um responsável pode ter **vários alunos** (1:N)
- Ao deletar um responsável, seus alunos são **deletados automaticamente** (CASCADE)

---

## 🔒 Segurança Implementada

✅ **Criptografia de senhas** com Bcrypt (salt rounds: 10)  
✅ **Autenticação JWT** com expiração de 2 horas  
✅ **Autorização por roles** (user/admin)  
✅ **Validação de campos** obrigatórios  
✅ **Proteção de rotas** com middlewares  
✅ **Senhas nunca retornadas** nas respostas da API  

---

## 📝 Scripts Disponíveis

```json
{
  "start": "node index.js",
  "dev": "nodemon index.js",
  "seed": "node prisma/seed.js",
  "prisma:generate": "npx prisma generate",
  "prisma:push": "npx prisma db push"
}
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Erro: "Invalid DATABASE_URL"
Verifique se a URL do MongoDB no `.env` está correta.

### Erro: "JWT_SECRET is not defined"
Certifique-se de que o `.env` contém a variável `JWT_SECRET`.

### Porta 3000 já está em uso
Mude a porta no `index.js`:
```javascript
const PORTA = 3001; // ou outra porta disponível
```

---

## 📚 Recursos Adicionais

- [Documentação do Express](https://expressjs.com/)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do JWT](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte da disciplina de Desenvolvimento Web Backend.

---

## 🤝 Contribuições

Contribuições, issues e sugestões são bem-vindas!

---

## 📞 Contato

**João Antônio Alves**  
📧 Email: [Seu email aqui]  
🔗 GitHub: [@joaogoes067](https://github.com/joaogoes067)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!