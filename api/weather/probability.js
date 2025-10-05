export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Parse request body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { location, date_range, include_ai_insights, dataset_mode } = body || {};

  // Validate required fields
  if (!location || !location.latitude || !location.longitude) {
    res.status(400).json({
      error: 'Missing required parameters: location with latitude and longitude required.'
    });
    return;
  }

  if (!date_range || !date_range.start_date) {
    res.status(400).json({
      error: 'Missing required parameters: date_range with start_date required.'
    });
    return;
  }

  // Generate mock probability values
  const generateCondition = (baseProb, label, threshold, description) => ({
    probability: baseProb + Math.random() * 20 - 10, // Add some variance
    label,
    threshold,
    description
  });

  // Create mock response matching WeatherData interface
  const response = {
    location: {
      latitude: location.latitude,
      longitude: location.longitude,
      city_name: location.city_name || `Location (${location.latitude}, ${location.longitude})`
    },
    date_range: {
      start_date: date_range.start_date,
      end_date: date_range.end_date || date_range.start_date
    },
    probabilities: {
      rain: generateCondition(35, 'Moderate', '>5mm', 'Chance of rainfall'),
      extreme_heat: generateCondition(15, 'Low', '>35°C', 'Risk of extreme heat'),
      high_wind: generateCondition(20, 'Low', '>40km/h', 'Strong wind conditions'),
      cloudy: generateCondition(60, 'High', '>70%', 'Cloud coverage'),
      good_weather: generateCondition(65, 'High', 'Clear skies', 'Favorable conditions'),
      summary: {
        data_points: Math.floor(Math.random() * 500) + 100,
        date_range: `${date_range.start_date} to ${date_range.end_date || date_range.start_date}`,
        location: location.city_name || `(${location.latitude}, ${location.longitude})`,
        risk_level: 'Moderate',
        data_quality: 'Good'
      }
    },
    data_sources: ['Historical Climate Data', 'Weather Stations', 'Satellite Data'],
    analysis_period: `${date_range.start_date} to ${date_range.end_date || date_range.start_date}`,
    dataset_mode: dataset_mode || 'Global'
  };

  // Add AI insights if requested
  if (include_ai_insights) {
    response.ai_insights = `Based on historical data for ${response.location.city_name}, ` +
      `weather conditions during this period typically show moderate variability. ` +
      `The ${response.probabilities.good_weather.probability.toFixed(1)}% chance of good weather ` +
      `suggests favorable conditions, though ${response.probabilities.rain.probability.toFixed(1)}% ` +
      `rain probability indicates some precipitation is possible.`;
  }

  res.status(200).json(response);
}
