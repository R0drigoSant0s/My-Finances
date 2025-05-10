# Configuração do My Finances no GitHub

Este documento contém instruções para configurar o projeto My Finances em um repositório GitHub e preparar para hospedagem.

## Passos para Configuração

### 1. Download do Código

1. Faça o download de todo o código-fonte do Replit como um arquivo ZIP:
   - Clique em "⋮" (três pontos) no Replit
   - Selecione "Download as zip"

### 2. Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Clique em "New repository"
3. Nome do repositório: `my-finances` (ou outro nome de sua preferência)
4. Descrição: "Aplicativo de gerenciamento financeiro pessoal com suporte a PWA"
5. Escolha "Public" ou "Private" conforme sua preferência
6. Clique em "Create repository"

### 3. Preparar o Código para o GitHub

Após descompactar o arquivo ZIP, ajuste o package.json para ter as seguintes informações:

```json
{
  "name": "my-finances",
  "version": "1.0.0",
  "description": "Aplicativo de gerenciamento financeiro pessoal com suporte a PWA",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

### 4. Upload para o GitHub

Execute os comandos a seguir no terminal dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Primeira versão do My Finances"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/my-finances.git
git push -u origin main
```

Substitua `SEU_USUARIO` pelo seu nome de usuário no GitHub.

### 5. Hospedagem (Opções)

#### Vercel
1. Crie uma conta em [Vercel](https://vercel.com)
2. Importe o repositório GitHub
3. Configure como um projeto Node.js
4. Defina o comando de build: `npm run build`
5. Defina o diretório de saída: `dist`

#### Netlify
1. Crie uma conta em [Netlify](https://netlify.com)
2. Importe o repositório GitHub
3. **Importante:** Não é necessário configurar nada manualmente no Netlify, pois já criamos um arquivo `netlify.toml` que configura:
   - Comando de build: `npm run build`
   - Diretório de publicação: `dist`
   - Diretório de funções: `netlify/functions`
   - Redirecionamento de todas as rotas para index.html (evita erro 404)

Se mesmo assim você encontrar o erro 404 "Page not found":
1. Na dashboard do Netlify, vá para "Site settings" > "Build & deploy" > "Post processing"
2. Ative "Asset optimization" se não estiver ativado
3. Em "Redirects", verifique se há um redirecionamento de /* para /index.html com código 200
4. Se não houver, adicione o redirecionamento manualmente

#### GitHub Pages (somente para front-end estático)
Se desejar hospedar apenas o front-end:

1. Ajuste a configuração do Vite para gerar apenas o front-end
2. Configure o GitHub Pages para usar a branch main ou gh-pages

## Estrutura de Arquivos Importante

Ao fazer upload para o GitHub, certifique-se de que estes arquivos estão presentes:

- `client/public/` - Contém os arquivos do PWA
- `client/index.html` - Arquivo HTML principal com as meta tags do PWA
- `client/src/` - Código fonte do React
- `server/` - Código do back-end
- `shared/` - Tipos e esquemas compartilhados
- `.gitignore` - Arquivos a serem ignorados pelo Git
- `README.md` - Documentação do projeto

## Considerações Finais

- Este projeto usa Node.js, então certifique-se de que seu ambiente de hospedagem suporta Node.js
- Todos os arquivos PWA estão presentes para permitir instalação em dispositivos móveis
- Para o modo de tela cheia funcionar em iPhones, a aplicação deve ser acessada via HTTPS