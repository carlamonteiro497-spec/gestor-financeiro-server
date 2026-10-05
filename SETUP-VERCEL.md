# 🚀 Setup Completo - Gestor Financeiro com Vercel

## **PASSO 1: Estrutura de Pastas**

Crie a pasta `/api` na raiz do projeto:

```
gestor-financeiro-server/
├── public/
│   ├── index.html
│   └── dados.json
├── api/
│   ├── auth/
│   │   ├── login.js
│   │   └── callback.js
│   └── sheets/
│       └── data.js
├── package.json
├── vercel.json
└── .env
```

## **PASSO 2: Copiar Arquivos**

1. **Crie a pasta `/api/auth/`**
   - Copie `vercel-login.js` → `api/auth/login.js`
   - Copie `vercel-callback.js` → `api/auth/callback.js`

2. **Crie a pasta `/api/sheets/`**
   - Copie `vercel-sheets-data.js` → `api/sheets/data.js`

## **PASSO 3: Atualizar package.json**

Adicione `"type": "module"` ao seu package.json:

```json
{
  "name": "gestor-financeiro-server",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "googleapis": "^118.0.0",
    "google-auth-library": "^9.0.0"
  }
}
```

## **PASSO 4: Criar vercel.json**

Na raiz do projeto, crie `vercel.json`:

```json
{
  "version": 2,
  "env": [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "SPREADSHEET_ID"
  ],
  "functions": {
    "api/**/*.js": {
      "runtime": "node18.x"
    }
  }
}
```

## **PASSO 5: Configurar .env no Vercel**

No dashboard do Vercel:
1. Vá em **Settings → Environment Variables**
2. Adicione:
   - `GOOGLE_CLIENT_ID`: seu client ID
   - `GOOGLE_CLIENT_SECRET`: seu client secret
   - `SPREADSHEET_ID`: ID da sua planilha

## **PASSO 6: Atualizar Google Cloud Console**

Adicione este redirect URI:
```
https://seu-projeto.vercel.app/api/auth/callback
```

## **PASSO 7: Git Push**

```bash
cd gestor-financeiro-server
git add .
git commit -m "Add Vercel serverless functions for OAuth and Google Sheets"
git push
```

## **PRONTO!** 🎉

Seu app agora terá:
- ✅ OAuth seguro com Google
- ✅ Dados reais da Google Sheets
- ✅ Serverless functions escaláveis
- ✅ Sem gerenciamento de servidor

O Vercel vai fazer deploy automático em 1-2 minutos!
