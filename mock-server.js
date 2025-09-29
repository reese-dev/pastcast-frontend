const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function estimateExtremeHeatProbability(location, dataset_mode) {
  const name = (location?.city_name || '').toLowerCase();
  const lat = Number(location?.latitude) || 0;

  // India threshold: >40°C considered extreme
  const isIndiaMode = dataset_mode === 'IMD' || /india|bengaluru|bangalore|rayasandra|karnataka/.test(name);

  // Special-case Bengaluru/Rayasandra: historically rare >40°C
  if (/(bengaluru|bangalore|rayasandra)/.test(name)) {
    return 0.7; // <1%
  }

  // Heuristic by latitude (very rough):
  // - Equatorial/tropics often hot but >40°C still uncommon in many humid regions
  // - Interior arid belts more likely; we don't have that signal here, so stay conservative
  let base = 5.0;
  if (Math.abs(lat) < 10) base = 3.0;
  else if (Math.abs(lat) < 20) base = 6.0;
  else if (Math.abs(lat) < 30) base = 8.0;
  else base = 10.0;

  // Slightly lower if using IMD and likely coastal/southern India without city hint
  if (isIndiaMode && lat >= 8 && lat <= 15) base -= 3.0;

  return clamp(base, 0, 100);
}

function recalcGoodWeather(rainPct, heatPct, windPct, cloudyPct) {
  // Simple composite: lower rain/heat/wind/cloud -> higher good weather
  const penalty = rainPct * 0.45 + heatPct * 0.30 + windPct * 0.15 + cloudyPct * 0.10;
  const score = clamp(100 - penalty, 0, 100);
  return score;
}

function buildWeatherData(body) {
  const { location, date_range, dataset_mode } = body;
  const cityName = location?.city_name || 'Selected Location';
  const extremeHeat = estimateExtremeHeatProbability(location, dataset_mode);
  const rain = 42.3;
  const wind = 12.5;
  const cloudy = 51.2;
  const goodWeather = recalcGoodWeather(rain, extremeHeat, wind, cloudy);
  return {
    location: {
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
      city_name: cityName
    },
    date_range: {
      start_date: date_range?.start_date || '2024-01-01',
      end_date: date_range?.end_date || date_range?.start_date || '2024-01-01'
    },
    probabilities: {
      rain: {
        probability: rain,
        label: 'Rain Probability',
        threshold: '≥ 1 mm/day',
        description: 'Chance of precipitation exceeding 1 mm/day'
      },
      extreme_heat: {
        probability: extremeHeat,
        label: 'Extreme Heat',
        threshold: '40°C',
        description: 'Probability of daily max temperature exceeding threshold'
      },
      high_wind: {
        probability: wind,
        label: 'High Wind',
        threshold: '> 20 km/h',
        description: 'Probability of wind speeds above 20 km/h'
      },
      cloudy: {
        probability: cloudy,
        label: 'Cloudy',
        threshold: '> 70% cloud cover',
        description: 'Probability of high cloud cover conditions'
      },
      good_weather: {
        probability: Number(goodWeather.toFixed(1)),
        label: 'Good Weather',
        threshold: 'Composite score',
        description: 'Overall chance of favorable conditions'
      },
      summary: {
        data_points: 3650,
        date_range: '2005-2024',
        location: cityName,
        risk_level: 'Moderate',
        data_quality: 'High'
      }
    },
    ai_insights: `Based on historical patterns for ${cityName}, the selected period shows moderate rain risk with low-to-moderate extreme heat probability.`,
    data_sources: dataset_mode === 'IMD' ? ['IMD'] : dataset_mode === 'Global' ? ['NASA', 'NOAA'] : ['IMD', 'NASA', 'NOAA'],
    analysis_period: 'Last 20 years',
    dataset_mode: dataset_mode || 'Combined'
  };
}

app.post('/weather/probability', (req, res) => {
  return res.json(buildWeatherData(req.body || {}));
});

app.post('/weather/compare', (req, res) => {
  const { locations = [], date_range, dataset_mode } = req.body || {};
  const comparison_results = locations.slice(0, 3).map((loc) => buildWeatherData({ location: loc, date_range, dataset_mode }));
  return res.json({ comparison_results });
});

app.post('/ai/chat', (req, res) => {
  const message = (req.body?.message || '').toString();
  if (!message.trim()) {
    return res.json({ response: 'Please provide a location, date, and metric (e.g., rain %, temp °C).' });
  }
  return res.json({ response: `For your query: "${message}", typical rain probability is 35–50% and max temp around 28–34°C. (Mock response)` });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Mock backend listening on http://localhost:${PORT}`);
});


