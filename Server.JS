require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração OAuth2
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '255340364435-1lhb6me45l305vq0jqellsv9v31r0d98.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URL = process.env.REDIRECT_URL || 'https://gestor-financeiro-server.vercel.app/auth/callback';
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1sKNjQB-QwyxiPtw6c2ilDMdN5RVx74Xh';

const oauth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Armazenar tokens em memória (em produção, usar banco de dados)
let userTokens = {};

// Rota: Gerar URL de login
app.get('/api/auth/login', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    prompt: 'consent'
  });

  res.json({ url: authUrl });
});

// Rota: Callback de autenticação
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    userTokens.access_token = tokens.access_token;

    res.send(`
      <script>
        window.opener.postMessage({ type: 'auth', token: '${tokens.access_token}' }, '*');
        window.close();
      </script>
    `);
  } catch (error) {
    res.status(400).send('Erro na autenticação: ' + error.message);
  }
});

// Rota: Carregar dados do Google Sheets
app.get('/api/sheets/data', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    oauth2Client.setCredentials({ access_token: token });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    // Carregar "Todas Transações"
    const transacoesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Todas Transações'
    });

    // Carregar "Resumo Mensal"
    const resumoResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Resumo Mensal'
    });

    const transacoes = transacoesResponse.data.values || [];
    const resumo = resumoResponse.data.values || [];

    res.json({
      transacoes,
      resumo,
      success: true
    });

  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    res.status(500).json({
      error: 'Erro ao carregar dados: ' + error.message,
      success: false
    });
  }
});

// Servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Abra http://localhost:${PORT} no seu navegador`);
});
