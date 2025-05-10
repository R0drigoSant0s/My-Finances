# Estrutura do Projeto My Finances

Este documento descreve a estrutura de arquivos e diretórios do projeto para facilitar a navegação e entendimento.

## Visão Geral

```
my-finances/
├── client/                 # Código do front-end (React)
│   ├── public/             # Arquivos públicos (PWA)
│   ├── src/                # Código fonte React
│   │   ├── components/     # Componentes React
│   │   │   ├── Finances/   # Componentes específicos do app
│   │   │   └── ui/         # Componentes de UI reutilizáveis
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── lib/            # Utilitários e configurações
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── App.tsx         # Componente principal
│   │   ├── index.css       # Estilos globais
│   │   └── main.tsx        # Ponto de entrada React
│   ├── apple-touch-icon.png # Ícone para iPhone
│   ├── favicon.ico         # Favicon do site
│   ├── icon-192.png        # Ícone PWA 192x192
│   ├── icon-512.png        # Ícone PWA 512x512
│   ├── index.html          # HTML principal
│   └── manifest.json       # Configuração do PWA
├── server/                 # Código do back-end (Express)
│   ├── index.ts            # Ponto de entrada do servidor
│   ├── routes.ts           # Rotas da API
│   ├── storage.ts          # Camada de armazenamento
│   └── vite.ts             # Configuração do Vite para o servidor
├── shared/                 # Código compartilhado
│   └── schema.ts           # Esquemas e tipos
├── .gitignore              # Arquivos ignorados pelo Git
├── README.md               # Documentação principal
├── drizzle.config.ts       # Configuração do Drizzle ORM
├── GITHUB_SETUP.md         # Instruções para configuração no GitHub
├── package.json            # Dependências e scripts
├── PROJECT_STRUCTURE.md    # Este arquivo
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
- `CalendarSection.tsx` - Calendário para visualização de transações
- `types.ts` - Tipos compartilhados entre os componentes

### UI

Os componentes de UI reutilizáveis estão em `client/src/components/ui/` e são baseados na biblioteca ShadcnUI.

## Arquivos PWA

Os seguintes arquivos são essenciais para o funcionamento do PWA:

- `client/index.html` - Contém meta tags para PWA e tela cheia no iPhone
- `client/manifest.json` - Configuração do PWA
- `client/icon-192.png` e `client/icon-512.png` - Ícones para dispositivos
- `client/apple-touch-icon.png` - Ícone específico para iPhone

## Back-end

O back-end é minimalista e focado apenas em servir o front-end:

- `server/index.ts` - Configura e inicia o servidor Express
- `server/routes.ts` - Define as rotas da API
- `server/storage.ts` - Implementa o armazenamento em memória
- `server/vite.ts` - Configura o Vite para servir o front-end durante desenvolvimento

## Configurações

- `tailwind.config.ts` - Configura o Tailwind CSS
- `theme.json` - Define as cores e tema da aplicação
- `tsconfig.json` - Configuração do TypeScript
- `vite.config.ts` - Configuração do Vite para build e desenvolvimento