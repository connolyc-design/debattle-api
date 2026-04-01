export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const projRes = await fetch('https://api.deepgram.com/v1/projects', {
      headers: { 'Authorization': `Token ${process.env.DEEPGRAM_KEY}` }
    });
    const projData = await projRes.json();
    console.log('Projects response:', JSON.stringify(projData));

    if (!projData.projects || projData.projects.length === 0) {
      return res.status(500).json({ error: 'No projects found', detail: projData });
    }

    const projectId = projData.projects[0].project_id;
    console.log('Project ID:', projectId);

    const tokenRes = await fetch(`https://api.deepgram.com/v1/projects/${projectId}/keys`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment: 'temp-browser-key',
        scopes: ['usage:write', 'listen:realtime'],
        time_to_live_in_seconds: 60
      })
    });
    const tokenData = await tokenRes.json();
    console.log('Token response:', JSON.stringify(tokenData));

    if (!tokenData.key) {
      return res.status(500).json({ error: 'Failed to create key', detail: tokenData });
    }

    res.status(200).json({ key: tokenData.key });
  } catch (err) {
    console.error('Transcribe proxy error:', err);
    res.status(500).json({ error: 'Proxy error', detail: err.message });
  }
}
