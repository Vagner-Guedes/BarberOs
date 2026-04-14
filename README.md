# 💈 BarberOs - Sistema de Gestão para Barbearia

Sistema moderno e completo para gestão de barbearias, desenvolvido com React, TypeScript e Tailwind CSS. Permite o gerenciamento de clientes, profissionais, agendamentos e serviços.

## ✨ Demonstração

🔗 **Acesse o projeto:** [https://vagner-guedes.github.io/BarberOs/](https://vagner-guedes.github.io/BarberOs/)

## 🚀 Tecnologias

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|------------|
| React | 19.x | Biblioteca principal para UI |
| TypeScript | 6.x | Tipagem estática |
| Vite | 8.x | Build tool e dev server |
| Tailwind CSS | 3.x | Framework de CSS utilitário |
| React Router DOM | 7.x | Navegação entre rotas |
| React Hook Form | 7.x | Gerenciamento de formulários |
| Zod | 4.x | Validação de schemas |
| Axios | 1.x | Cliente HTTP |
| Lucide React | 1.x | Biblioteca de ícones |

### UI Components
- **@radix-ui/react-label** - Labels acessíveis
- **@radix-ui/react-slot** - Composición de componentes
- **class-variance-authority** - Variantes de classes
- **clsx** - Utilitário para classes condicionais
- **tailwind-merge** - Merge de classes Tailwind
- **sonner** - Toast notifications

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/Vagner-Guedes/BarberOs.git

# Entre no diretório
cd BarberOs

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

🌐 Acessar
Ambiente	URL
Local	http://localhost:5173
Produção	https://vagner-guedes.github.io/BarberOs
📁 Estrutura do Projeto
text
BarberOs/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── contexts/            # Contextos React
│   ├── hooks/               # Hooks customizados
│   ├── layouts/             # Layouts da aplicação
│   │   └── AppLayout.tsx    # Layout principal com menu
│   ├── lib/                 # Utilitários e helpers
│   ├── mocks/               # Dados mockados
│   ├── pages/               # Páginas da aplicação
│   │   ├── appointments/    # Agendamentos
│   │   ├── auth/            # Autenticação
│   │   │   └── LoginPage.tsx
│   │   ├── clients/         # Clientes
│   │   │   └── ClientsPage.tsx
│   │   ├── dashboard/       # Dashboard
│   │   │   └── DashboardPage.tsx
│   │   ├── professionals/   # Profissionais
│   │   │   └── ProfessionalsPage.tsx
│   │   ├── services/        # Serviços
│   │   │   └── ServicesPage.tsx
│   │   └── settings/        # Configurações
│   │       └── SettingsPage.tsx
│   ├── routes/              # Configuração de rotas
│   │   └── index.tsx
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos do Tailwind
├── public/                  # Arquivos estáticos
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
🛠️ Scripts Disponíveis
Comando	Descrição
npm run dev	Inicia o servidor de desenvolvimento
npm run build	Gera o build de produção
npm run preview	Visualiza o build localmente
npm run deploy	Publica no GitHub Pages
npm run lint	Executa o ESLint
📱 Funcionalidades
✅ Implementadas
✅ Dashboard com métricas e cards informativos

✅ CRUD completo de Clientes (criar, editar, listar, remover, ativar/inativar)

✅ CRUD completo de Profissionais (criar, editar, listar, remover, ativar/inativar)

✅ Busca e filtros por nome, email, telefone

✅ Layout responsivo (Desktop e Mobile)

✅ Tema escuro consistente

✅ Menu lateral com navegação

✅ Formulários com validação

✅ Modais para criação/edição

✅ Deploy automatizado no GitHub Pages

🔄 Em desenvolvimento
🔄 Agendamentos (calendário)

🔄 Serviços com preços

🔄 Configurações da barbearia

🔄 Autenticação completa (JWT)

🔄 Integração com backend API

🔄 Relatórios e gráficos

🎨 Paleta de Cores
Cor	Uso	Código
Amber	Primária, botões, destaques	#f59e0b
Zinc	Fundo principal	#18181b
Emerald	Status ativo, sucesso	#10b981
Violet	Destaques secundários	#8b5cf6
Rose	Alertas, destaques	#f43f5e
Sky	Informações	#0ea5e9
🖥️ Requisitos
Node.js 18.x ou superior

npm 9.x ou superior

📄 Licença
Este projeto está sob a licença MIT.

👨‍💻 Autor
Vagner Guedes

GitHub: @Vagner-Guedes

Projeto: BarberOs

🙏 Agradecimentos
React

Vite

Tailwind CSS

Lucide Icons