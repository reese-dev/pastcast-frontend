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

  // Convert message to lowercase for easier matching
  const lowerMessage = message.toLowerCase();

  // Check for Paris wedding query
  if (lowerMessage.includes('wedding') && lowerMessage.includes('paris') && lowerMessage.includes('may')) {
    res.status(200).json({
      response: 'The average temperature in Paris in May for weddings is around 17°C to 20°C with mild rainfall.'
    });
    return;
  }

  // Check for general temperature query
  if (lowerMessage.includes('temperature')) {
    res.status(200).json({
      response: 'The average temperature is 22°C.'
    });
    return;
  }

  // Default response for unrecognized queries
  res.status(200).json({
    response: `Sorry, I don't have weather data for: ${message}`
  });
}
