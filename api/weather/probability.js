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

  const { location, date, metric } = body || {};

  // Basic validation
  if (!location || !date || !metric) {
    res.status(400).json({
      error: 'Missing required parameters: location, date, and metric are required.'
    });
    return;
  }

  // Convert inputs to lowercase for easier matching
  const lowerLocation = location.toLowerCase();
  const lowerMetric = metric.toLowerCase();

  // Generate probability response based on metric type
  let probability;
  
  if (lowerMetric.includes('rain') || lowerMetric.includes('precipitation')) {
    // Rain probability (0-100%)
    probability = Math.floor(Math.random() * 100);
  } else if (lowerMetric.includes('temp') || lowerMetric.includes('temperature')) {
    // Temperature probability (typically higher confidence)
    probability = Math.floor(Math.random() * 30) + 70; // 70-100%
  } else if (lowerMetric.includes('humidity')) {
    // Humidity probability
    probability = Math.floor(Math.random() * 40) + 60; // 60-100%
  } else if (lowerMetric.includes('wind')) {
    // Wind probability
    probability = Math.floor(Math.random() * 50) + 50; // 50-100%
  } else {
    // Default probability for other metrics
    probability = Math.floor(Math.random() * 80) + 20; // 20-100%
  }

  // Return probability response
  res.status(200).json({
    probability: probability,
    location: location,
    date: date,
    metric: metric,
    message: `Weather probability for ${metric} in ${location} on ${date}: ${probability}%`
  });
}
