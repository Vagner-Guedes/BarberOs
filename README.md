# 💈 BarberOs - Sistema de Gestão para Barbearia

Sistema moderno e completo para gestão de barbearias, desenvolvido com React, TypeScript, Node.js e Tailwind CSS. Permite o gerenciamento de clientes, profissionais, serviços e agendamentos.

---

## ✨ Demonstração

🔗 **Acesse o projeto:** [https://vagner-guedes.github.io/BarberOs/](https://vagner-guedes.github.io/BarberOs/)

---

## 🚀 Tecnologias

### Frontend
- **React (19.x)** – Construção da interface
- **TypeScript (6.x)** – Tipagem estática
- **Vite (8.x)** – Build tool e dev server
- **Tailwind CSS (3.x)** – Estilização utilitária
- **React Router DOM (7.x)** – Roteamento
- **React Hook Form (7.x)** – Formulários
- **Zod (4.x)** – Validação de dados
- **Axios (1.x)** – Requisições HTTP
- **Sonner** – Toast notifications
- **Lucide React** – Ícones
- **Radix UI** – Componentes acessíveis

### Backend
- **Node.js** – Runtime
- **Express** – Framework web
- **Prisma ORM** – Banco de dados
- **PostgreSQL** – Banco de dados
- **JWT** – Autenticação
- **Bcryptjs** – Criptografia de senhas

### DevOps
- **Docker** – Containerização do banco de dados
- **GitHub Pages** – Hospedagem do frontend

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/Vagner-Guedes/BarberOs.git

# Entre no diretório
cd BarberOs

# Instale as dependências do frontend
cd frontend
npm install

# Configure o backend
cd ../backend
npm install
npx prisma generate
npx prisma migrate dev

# Execute o projeto
# Terminal 1 - Backend (porta 3333)
cd backend
npm run dev

# Terminal 2 - Frontend (porta 5173)
cd frontend
npm run dev
```

## 🐳 Docker (Banco de dados)

```bash
# Subir o PostgreSQL com Docker
cd backend
docker-compose up -d

# Verificar containers
docker ps

# Acessar PgAdmin
http://localhost:5050
Email: admin@barberos.com
Senha: admin123

# Conectar ao banco
Host: postgres
Port: 5432
Database: barberos
User: barberos
Password: barberos123
```

## 🌐 Acesso

| Ambiente | URL |
|---------|-----|
| Frontend Local | http://localhost:5173 |
| Backend API | http://localhost:3333 |
| PgAdmin | http://localhost:5050 |
| Produção | https://vagner-guedes.github.io/BarberOs |

## 🔑 Credenciais de Teste

| Email | Senha |
|------|-------|
| admin@barberos.com | 123456 |

## 📁 Estrutura do Projeto

```text
BarberOs/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/api/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── routes/
    │   ├── services/
    │   ├── config/
    │   └── server.ts
    ├── prisma/
    │   └── schema.prisma
    ├── docker-compose.yml
    ├── package.json
    └── .env
```

## 🛠️ Scripts Disponíveis

### Frontend

| Comando | Descrição |
|--------|----------|
| npm run dev | Inicia o servidor de desenvolvimento |
| npm run build | Gera o build de produção |
| npm run preview | Visualiza o build local |
| npm run deploy | Publica no GitHub Pages |
| npm run lint | Executa o ESLint |

### Backend

| Comando | Descrição |
|--------|----------|
| npm run dev | Inicia o servidor com nodemon |
| npm run build | Compila TypeScript |
| npm start | Executa o build |
| npx prisma studio | Abre o Prisma Studio |
| npx prisma migrate dev | Executa migrações |
| npx prisma generate | Gera o Prisma Client |

## 📱 Funcionalidades

### ✅ Implementadas

**Autenticação**
- Login com JWT
- Registro de usuários
- Proteção de rotas
- Persistência de sessão

**Dashboard**
- Cards com métricas
- Gráficos
- Lista de agendamentos
- Clientes recentes

**Clientes**
- CRUD completo
- Busca e filtros
- Validações

**Profissionais**
- CRUD completo
- Busca e filtros

**Serviços**
- CRUD completo
- Formatação de dados

**Agendamentos**
- Calendário semanal
- Criação e edição
- Verificação de disponibilidade

**Notificações**
- Toast feedback
- Mensagens de status

### 🔄 Em desenvolvimento
- Relatórios
- Configurações
- Notificações
- Permissões
- Multi-empresa

## 🎨 Paleta de Cores

| Cor | Código |
|-----|--------|
| Amber | #f59e0b |
| Zinc | #18181b |
| Emerald | #10b981 |
| Violet | #8b5cf6 |
| Rose | #f43f5e |
| Sky | #0ea5e9 |

## 🖥️ Requisitos

- Node.js 18+
- npm 9+
- Docker (opcional)
- PostgreSQL

## 📄 Licença

MIT

## 👨‍💻 Autor

Vagner Guedes  
GitHub: @Vagner-Guedes

## 🙏 Agradecimentos

React  
Vite  
Tailwind CSS  
Prisma  
Lucide Icons

---

## 📌 Observações

Este projeto está em evolução e novas funcionalidades serão adicionadas progressivamente.
