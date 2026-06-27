export default async function handler(req: any, res: any) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=38.7223&longitude=-9.1393&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FLondon&forecast_days=16`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
  } catch (_) {
    // fall through to mock
  }

  return res.json(getMockLisbonWeather());
}

function getMockLisbonWeather() {
  const codes = [0, 0, 1, 1, 2, 0, 1, 0, 2, 0, 0, 1, 0, 0, 1, 0];
  const maxT = [26.5, 27.8, 28.2, 26.0, 28.5, 29.3, 30.1, 29.5, 28.0, 27.4, 26.5, 27.9, 28.8, 29.9, 31.2, 30.5];
  const minT = [16.2, 16.8, 17.5, 16.0, 17.2, 18.1, 18.9, 18.2, 17.5, 17.0, 16.5, 17.1, 17.8, 18.5, 19.2, 18.8];
  const now = new Date();
  const time: string[] = [];
  const weather_code: number[] = [];
  const temperature_2m_max: number[] = [];
  const temperature_2m_min: number[] = [];

  for (let i = 0; i < 16; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    time.push(d.toISOString().slice(0, 10));
    weather_code.push(codes[i % codes.length]);
    temperature_2m_max.push(maxT[i % maxT.length]);
    temperature_2m_min.push(minT[i % minT.length]);
  }

  return { daily: { time, weather_code, temperature_2m_max, temperature_2m_min } };
}
