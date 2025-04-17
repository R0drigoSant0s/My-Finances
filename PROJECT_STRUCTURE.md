# Estrutura do Projeto My Finances

Este documento descreve a estrutura de arquivos e diretórios do projeto para facilitar a navegação e entendimento.

## Visão Geral

```
my-finances/
├── client/                 # Código do front-end (React)
│   ├── public/             # Arquivos públicos (PWA)
│   │   ├── apple-touch-icon.png # Ícone para iPhone
│   │   ├── favicon.ico     # Favicon do site
│   │   ├── icon-192.png    # Ícone PWA 192x192
│   │   ├── icon-512.png    # Ícone PWA 512x512
│   │   └── manifest.json   # Configuração do PWA
│   ├── src/                # Código fonte React
│   │   ├── components/     # Componentes React
│   │   │   ├── AuthGuard/  # Componente de proteção de rotas
│   │   │   ├── Finances/   # Componentes específicos do app
│   │   │   └── ui/         # Componentes de UI reutilizáveis
│   │   ├── context/        # Contextos React
│   │   │   └── AuthContext.tsx # Contexto de autenticação
│   │   ├── hooks/          # Hooks personalizados
│   │   │   ├── use-mobile.tsx # Hook para detectar dispositivos móveis
│   │   │   ├── use-toast.ts # Hook para notificações toast
│   │   │   └── useSupabaseData.ts # Hook para dados do Supabase
│   │   ├── lib/            # Utilitários e configurações
│   │   │   ├── api.ts      # Funções de API
│   │   │   ├── queryClient.ts # Configuração do React Query
│   │   │   ├── supabase.ts # Cliente Supabase
│   │   │   └── utils.ts    # Funções utilitárias
│   │   ├── pages/          # Páginas da aplicação
│   │   │   ├── auth.tsx    # Página de autenticação
│   │   │   ├── home.tsx    # Página principal
│   │   │   └── not-found.tsx # Página 404
│   │   ├── App.tsx         # Componente principal
│   │   ├── index.css       # Estilos globais
│   │   └── main.tsx        # Ponto de entrada React
│   └── index.html          # HTML principal
├── supabase/               # Configurações do Supabase
│   └── migrations/         # Migrações do banco de dados
├── .env                    # Variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── _redirects              # Configuração de redirecionamento para Netlify
├── README.md               # Documentação principal
├── GITHUB_SETUP.md         # Instruções para configuração no GitHub
├── PWA_GUIDE.md            # Guia de instalação do PWA
├── PROJECT_STRUCTURE.md    # Este arquivo
├── package.json            # Dependências e scripts
├── netlify.toml            # Configuração do Netlify
├── tailwind.config.ts      # Configuração do Tailwind CSS
├── theme.json              # Configuração de temas
├── tsconfig.json           # Configuração do TypeScript
└── vite.config.ts          # Configuração do Vite
```

## Componentes Principais

### Finances

Os principais componentes da aplicação estão em `client/src/components/Finances/`:

- `index.tsx` - Componente principal que orquestra todo o app
- `FinancialCard.tsx` - Cards de resumo financeiro (saldo, receitas, despesas)
- `BudgetsSection.tsx` - Seção de orçamentos
- `TransactionsSection.tsx` - Seção de transações recentes
- `MonthSelector.tsx` - Seletor de mês
- `NewTransactionModal.tsx` - Modal para adicionar novas transações
- `NewBudgetModal.tsx` - Modal para adicionar novos orçamentos
- `InitialBalanceModal.tsx` - Modal para editar o saldo inicial
- `SettingsModal.tsx` - Modal de configurações
- `TransactionsModal.tsx` - Modal de listagem de transações
- `types.ts` - Tipos compartilhados entre os componentes

### UI

Os componentes de UI reutilizáveis estão em `client/src/components/ui/` e são baseados na biblioteca ShadcnUI, incluindo:

- `button.tsx` - Componente de botão
- `toast.tsx` - Componente de notificação
- `dialog.tsx` - Componente de modal
- `input.tsx` - Componente de entrada de texto
- E muitos outros componentes de UI reutilizáveis

### Autenticação

O sistema de autenticação é implementado usando Supabase:

- `context/AuthContext.tsx` - Contexto de autenticação
- `components/AuthGuard.tsx` - Componente para proteger rotas
- `pages/auth.tsx` - Página de login e registro
- `lib/supabase.ts` - Cliente Supabase e funções de autenticação

## Banco de Dados

O banco de dados é gerenciado pelo Supabase, com as seguintes tabelas:

- `profiles` - Perfis de usuários
- `month_settings` - Configurações mensais (saldo inicial)
- `transactions` - Transações financeiras
- `budgets` - Orçamentos

As migrações do banco de dados estão em `supabase/migrations/`.

## Arquivos PWA

Os seguintes arquivos são essenciais para o funcionamento do PWA:

- `client/index.html` - Contém meta tags para PWA e tela cheia no iPhone
- `client/public/manifest.json` - Configuração do PWA
- `client/public/icon-192.png` e `client/public/icon-512.png` - Ícones para dispositivos
- `client/public/apple-touch-icon.png` - Ícone específico para iPhone

## Configurações

- `tailwind.config.ts` - Configura o Tailwind CSS
- `theme.json` - Define as cores e tema da aplicação
- `tsconfig.json` - Configuração do TypeScript
- `vite.config.ts` - Configuração do Vite para build e desenvolvimento
- `netlify.toml` - Configuração para deploy no Netlify