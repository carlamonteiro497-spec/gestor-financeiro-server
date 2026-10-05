import { google } from 'googleapis';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { token } = req.query;

  if (!token) {
    res.status(400).json({ error: 'Missing token parameter' });
    return;
  }

  try {
    // Initialize the Sheets API with the user's access token
    const sheets = google.sheets({ version: 'v4' });
    
    const spreadsheetId = process.env.SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('SPREADSHEET_ID not configured');
    }

    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.batchGet({
      auth: token, // Use the access token directly
      spreadsheetId: spreadsheetId,
      ranges: ['Transações!A:E', 'Resumo!A:B']
    });

    const transacoesRange = response.data.valueRanges[0];
    const resumoRange = response.data.valueRanges[1];

    // Parse Transações data
    const transacoesData = transacoesRange?.values || [];
    const transacoes = [];
    
    // Skip header row and parse transactions
    for (let i = 1; i < transacoesData.length; i++) {
      const row = transacoesData[i];
      if (row.length >= 5) {
        transacoes.push({
          descricao: row[0],
          categoria: row[1],
          valor: parseFloat(row[2]) || 0,
          data: row[3],
          vencimento: row[4]
        });
      }
    }

    // Parse Resumo data
    const resumoData = resumoRange?.values || [];
    const resumo = {};
    
    // Skip header row and parse summary
    for (let i = 1; i < resumoData.length; i++) {
      const row = resumoData[i];
      if (row.length >= 2) {
        resumo[row[0]] = parseFloat(row[1]) || 0;
      }
    }

    res.status(200).json({
      source: 'google-sheets',
      message: 'Dados carregados da sua planilha',
      transacoes: transacoes,
      resumo: resumo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao buscar dados do Google Sheets:', error);

    // Fallback com dados de demonstração
    const mockData = {
      transacoes: [
        {
          descricao: 'Supermercado',
          categoria: 'Alimentação',
          valor: 150.50,
          data: '2026-10-01',
          vencimento: '2026-10-05'
        },
        {
          descricao: 'Gasolina',
          categoria: 'Transporte',
          valor: 200.00,
          data: '2026-10-02',
          vencimento: '2026-10-10'
        },
        {
          descricao: 'Conta de Luz',
          categoria: 'Contas Fixas',
          valor: 350.00,
          data: '2026-10-03',
          vencimento: '2026-10-15'
        },
        {
          descricao: 'Vale Alimentação',
          categoria: 'Vale',
          valor: 500.00,
          data: '2026-10-01',
          vencimento: '2026-10-20'
        }
      ],
      resumo: {
        'Renda Líquida': 5000.00,
        'Vale Alimentação': 500.00,
        'Reembolsos': 150.00,
        'Contas Fixas': 2500.00,
        'Cartão Santander': 1200.00,
        'Demais Cartões': 800.00,
        'Disponível': 450.00
      }
    };

    res.status(200).json({
      source: 'fallback-mock',
      message: 'Usando dados de demonstração. Conecte sua planilha para dados reais.',
      transacoes: mockData.transacoes,
      resumo: mockData.resumo,
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}
