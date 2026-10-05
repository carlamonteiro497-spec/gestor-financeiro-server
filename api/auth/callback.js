import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://gestor-financeiro-server.vercel.app/api/auth/callback'
);

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    res.redirect(
      `/?token=${encodeURIComponent(tokens.access_token)}&refresh=${encodeURIComponent(
        tokens.refresh_token || ''
      )}`
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
