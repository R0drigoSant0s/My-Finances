#!/bin/bash

# Script para preparar o projeto My Finances para GitHub
# Este script organiza os arquivos e pastas para download

echo "Preparando o projeto My Finances para GitHub..."

# Verificar se diretórios existem
if [ ! -d "client" ] || [ ! -d "server" ]; then
  echo "Erro: Diretórios client ou server não encontrados!"
  exit 1
fi

# Criar diretório temporário para organizar os arquivos
mkdir -p my-finances
mkdir -p my-finances/client
mkdir -p my-finances/server
mkdir -p my-finances/shared
mkdir -p my-finances/netlify/functions

# Copiar arquivos principais
cp -r client/* my-finances/client/
cp -r server/* my-finances/server/
cp -r shared/* my-finances/shared/
cp -r netlify/functions/* my-finances/netlify/functions/

# Copiar arquivos de configuração
cp README.md my-finances/
cp GITHUB_SETUP.md my-finances/
cp PROJECT_STRUCTURE.md my-finances/
cp PWA_GUIDE.md my-finances/
cp drizzle.config.ts my-finances/
cp package.json my-finances/
cp tailwind.config.ts my-finances/
cp theme.json my-finances/
cp tsconfig.json my-finances/
cp vite.config.ts my-finances/
cp netlify.toml my-finances/
cp .gitignore my-finances/

# Criar arquivo .gitignore se não existir
if [ ! -f "my-finances/.gitignore" ]; then
  echo "node_modules" > my-finances/.gitignore
  echo "dist" >> my-finances/.gitignore
  echo ".DS_Store" >> my-finances/.gitignore
  echo "*.log" >> my-finances/.gitignore
  echo ".env" >> my-finances/.gitignore
fi

echo "Projeto preparado na pasta 'my-finances'!"
echo "Você pode compactar esta pasta e fazer o download para criar seu repositório no GitHub."
echo "Siga as instruções em GITHUB_SETUP.md para configurar seu repositório."