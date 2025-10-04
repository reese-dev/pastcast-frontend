export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Ensure request body is parsed correctly in Vercel serverless function
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { message } = body || {};

  // Basic validation (matches your frontend expectations)
  if (!message || !message.trim()) {
    res.status(200).json({
      response: 'Please provide a location, date, and metric (e.g., rain %, temp °C).'
    });
    return;
  }

  // Mock response (replace with real logic later)
  res.status(200).json({
    response: `Mock response for your query: ${message}`
  });
}
