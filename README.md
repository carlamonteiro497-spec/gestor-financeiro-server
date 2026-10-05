# 💰 Gestor Financeiro - Servidor Local

Aplicação para gerenciar suas finanças usando Google Sheets como banco de dados!

## 🚀 Como Configurar

### 1. Instalar Node.js
Baixe e instale o Node.js em: https://nodejs.org/
(Escolha a versão LTS - mais estável)

### 2. Clonar/Copiar o Projeto
Você já tem a pasta `gestor-financeiro-server` com todos os arquivos!

### 3. Instalar Dependências
Abra o terminal/PowerShell e execute:

```bash
cd gestor-financeiro-server
npm install
```

Isso vai instalar todas as bibliotecas necessárias.

### 4. Configurar Credenciais Google

**A. Você já tem o Client ID:**
```
255340364435-1lhb6me45l305vq0jqellsv9v31r0d98.apps.googleusercontent.com
```

**B. Agora precisa do Client Secret:**
1. Volta pro Google Cloud Console
2. Na esquerda, clica em **"Credenciais"**
3. Clica no seu Cliente Web (chamado "Gestor Financeiro")
4. Copia o **Client Secret**
5. Cola no arquivo `.env` (substitua `sua_secret_aqui`)

**C. Arquivo `.env` deve ficar assim:**
```
PORT=3000
GOOGLE_CLIENT_ID=255340364435-1lhb6me45l305vq0jqellsv9v31r0d98.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_secret_aqui
REDIRECT_URL=http://localhost:3000/auth/callback
SPREADSHEET_ID=1sKNjQB-QwyxiPtw6c2ilDMdN5RVx74Xh
```

### 5. Iniciar o Servidor

No terminal, execute:
```bash
npm start
```

Você vai ver:
```
🚀 Servidor rodando em http://localhost:3000
📊 Abra http://localhost:3000 no seu navegador
```

### 6. Usar o App

1. Abre o navegador em `http://localhost:3000`
2. Clica em "📊 Conectar"
3. Seleciona sua conta Google
4. Autoriza o acesso
5. ✅ Pronto! Os dados aparecem automaticamente!

---

## 📋 Arquivos do Projeto

```
gestor-financeiro-server/
├── server.js           ← Servidor Express (lógica)
├── package.json        ← Dependências
├── .env                ← Variáveis de ambiente (GUARDADO!)
└── public/
    └── index.html      ← Interface do app
```

---

## 🔄 Como Atualizar os Dados

Toda vez que você editar sua planilha Google Sheets:
1. É só **recarregar a página** (F5 ou Ctrl+R)
2. O app puxa os dados novos automaticamente!

---

## 🚀 Depois - Subir pro Vercel

Quando quiser publicar na internet:

1. Cria uma conta em https://vercel.com
2. Conecta seu GitHub
3. Faz push do projeto pro GitHub
4. Vercel detecta e sobe automaticamente
5. Atualiza as URLs no Google Cloud Console

---

## ❓ Dúvidas

**P: Preciso deixar o terminal aberto?**
R: Sim! Enquanto o servidor está rodando no terminal, o app funciona.

**P: Funciona offline?**
R: Não, precisa estar conectado na internet (para acessar Google Sheets).

**P: Posso fechar o terminal?**
R: Não, o app para de funcionar. Pra parar, clica `Ctrl+C`.

---

## 🎯 Próximos Passos

1. Configure o arquivo `.env` com seu Client Secret
2. Execute `npm install`
3. Execute `npm start`
4. Acesse `http://localhost:3000`
5. Conecte e aproveite! 🚀
