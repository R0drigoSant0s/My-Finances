# My Finances - Aplicativo de Gerenciamento Financeiro Pessoal

Uma aplicação web moderna e intuitiva para gerenciamento de finanças pessoais, com suporte a PWA para dispositivos móveis.

## Funcionalidades

- Cadastro de receitas, despesas e investimentos
- Gerenciamento de orçamentos
- Visualização por mês
- Dashboard financeiro com resumo das finanças
- Suporte a PWA para instalação em dispositivos móveis

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- Express
- Tailwind CSS
- Lucide React (ícones)
- PWA (Progressive Web App)

## Como Executar o Projeto

### Pré-requisitos
- Node.js 18 ou superior
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/my-finances.git
cd my-finances
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse o aplicativo:
Abra o navegador e acesse `http://localhost:5000`

## Recursos do PWA

O aplicativo está configurado como Progressive Web App (PWA), permitindo que seja instalado em dispositivos móveis e desktops. Em iPhones, ele suporta modo de tela cheia quando adicionado à tela inicial.

## Estrutura do Projeto

```
my-finances/
├── client/            # Front-end em React
│   ├── public/        # Arquivos públicos (ícones PWA, manifest)
│   └── src/           # Código fonte do React
├── server/            # Back-end em Express
├── shared/            # Código compartilhado entre front e back
└── README.md          # Este arquivo
```

## Recursos Futuros

- Sincronização com serviços bancários
- Exportação de relatórios
- Análise de gastos com gráficos avançados
- Metas financeiras

## Deploy

Para fazer o deploy no Netlify ou Vercel, siga as instruções no arquivo GITHUB_SETUP.md.

### Instruções Específicas para Netlify

Este projeto já vem com as configurações necessárias para o deploy no Netlify:

1. O arquivo `netlify.toml` configura:
   - O comando de build (`npm run build`)
   - O diretório de publicação (`dist`)
   - As funções serverless (`netlify/functions`)
   - Redirecionamento de todas as rotas para o arquivo index.html para evitar erros 404

2. Se você encontrar erro "Page not found" (404):
   - Verifique se o redirecionamento está sendo aplicado corretamente
   - No painel do Netlify, vá para Site settings > Build & deploy > Post processing > Redirects
   - Confirme que existe um redirecionamento de /* para /index.html com status 200