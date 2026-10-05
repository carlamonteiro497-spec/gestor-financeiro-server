import { google } from 'googleapis';

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://gestor-financeiro-server.vercel.app/api/auth/callback'
    );

    oauth2Client.setCredentials({ access_token: token });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

    // Buscar "Todas Transações"
    const transacoesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Todas Transações'
    });

    // Buscar "Resumo Mensal"
    const resumoResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
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
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
}
