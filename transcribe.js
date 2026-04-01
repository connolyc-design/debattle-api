export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const response = await fetch('https://api.deepgram.com/v1/projects', {
      headers: { 'Authorization': `Token ${process.env.DEEPGRAM_KEY}` }
    });
    const { projects } = await response.json();
    const projectId = projects[0].project_id;

    const tokenRes = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/keys`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment: 'temp-browser-key',
        scopes: ['usage:write'],
        time_to_live_in_seconds: 60
      })
    });

    const { key } = await tokenRes.json();
    res.status(200).json({ key });
  } catch (err) {
    console.error('Transcribe proxy error:', err);
    res.status(500).json({ error: 'Failed to generate token', detail: err.message });
  }
}
