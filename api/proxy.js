export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { cpf } = req.query;

  if (!cpf) {
    return res.status(400).json({ error: 'CPF obrigatório' });
  }

  try {
    const response = await fetch(
      `https://proxy-ativo.vercel.app/api/proxy?cpf=${cpf}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(10000)
      }
    );

    if (!response.ok) {
      throw new Error(`API retornou status ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({ error: error.message || 'Erro ao consultar API' });
  }
}
