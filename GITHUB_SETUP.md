# Configuração do My Finances no GitHub

Este documento contém instruções para configurar o projeto My Finances em um repositório GitHub e preparar para hospedagem.

## Passos para Configuração

### 1. Download do Código

1. Faça o download de todo o código-fonte como um arquivo ZIP:
   - Clique em "⋮" (três pontos) no menu
   - Selecione "Download as zip"

### 2. Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Clique em "New repository"
3. Nome do repositório: `my-finances` (ou outro nome de sua preferência)
4. Descrição: "Aplicativo de gerenciamento financeiro pessoal com suporte a PWA"
5. Escolha "Public" ou "Private" conforme sua preferência
6. Clique em "Create repository"

### 3. Preparar o Código para o GitHub

Após descompactar o arquivo ZIP, verifique se o package.json tem as seguintes informações:

```json
{
  "name": "my-finances",
  "version": "1.0.0",
  "description": "Aplicativo de gerenciamento financeiro pessoal com suporte a PWA",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
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

### 5. Configuração do Supabase

1. Crie uma conta em [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá para "Settings" > "API" e copie a URL e a chave anônima
4. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```
5. Execute as migrações do banco de dados:
   - Vá para "SQL Editor" no Supabase
   - Cole e execute cada arquivo de migração da pasta `supabase/migrations`

### 6. Hospedagem (Opções)

#### Netlify
1. Crie uma conta em [Netlify](https://netlify.com)
2. Importe o repositório GitHub
3. **Importante:** Não é necessário configurar nada manualmente no Netlify, pois já criamos um arquivo `netlify.toml` que configura:
   - Comando de build: `npm run build`
   - Diretório de publicação: `dist/public`
   - Redirecionamento de todas as rotas para index.html (evita erro 404)

4. Configure as variáveis de ambiente no Netlify:
   - Vá para "Site settings" > "Environment variables"
   - Adicione as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

Se mesmo assim você encontrar o erro 404 "Page not found":
1. Na dashboard do Netlify, vá para "Site settings" > "Build & deploy" > "Post processing"
2. Ative "Asset optimization" se não estiver ativado
3. Em "Redirects", verifique se há um redirecionamento de /* para /index.html com código 200
4. Se não houver, adicione o redirecionamento manualmente

#### Vercel
1. Crie uma conta em [Vercel](https://vercel.com)
2. Importe o repositório GitHub
3. Configure como um projeto React
4. Defina o comando de build: `npm run build`
5. Defina o diretório de saída: `dist/public`
6. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Estrutura de Arquivos Importante

Ao fazer upload para o GitHub, certifique-se de que estes arquivos estão presentes:

- `client/public/` - Contém os arquivos do PWA
- `client/index.html` - Arquivo HTML principal com as meta tags do PWA
- `client/src/` - Código fonte do React
- `supabase/migrations/` - Migrações do banco de dados
- `.env.example` - Exemplo de variáveis de ambiente (não inclua o arquivo .env real)
- `.gitignore` - Arquivos a serem ignorados pelo Git
- `README.md` - Documentação do projeto

## Considerações Finais

- Todos os arquivos PWA estão presentes para permitir instalação em dispositivos móveis
- Para o modo de tela cheia funcionar em iPhones, a aplicação deve ser acessada via HTTPS
- As migrações do Supabase devem ser executadas para configurar o banco de dados corretamente
- Certifique-se de configurar as variáveis de ambiente no serviço de hospedagem