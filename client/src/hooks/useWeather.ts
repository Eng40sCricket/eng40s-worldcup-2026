// Hook to fetch weather forecast for Georgetown, Guyana using Open-Meteo (free, no API key)
// Georgetown coordinates: 6.8013° N, 58.1551° W
import { useState, useEffect } from 'react';

const GEORGETOWN_LAT = 6.8013;
const GEORGETOWN_LON = -58.1551;

// WMO Weather interpretation codes → simple descriptions
const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear', icon: '☀️' },
  1: { label: 'Mostly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Heavy Drizzle', icon: '🌧️' },
  56: { label: 'Freezing Drizzle', icon: '🌧️' },
  57: { label: 'Freezing Drizzle', icon: '🌧️' },
  61: { label: 'Light Rain', icon: '🌦️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  66: { label: 'Freezing Rain', icon: '🌧️' },
  67: { label: 'Freezing Rain', icon: '🌧️' },
  71: { label: 'Light Snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '🌨️' },
  75: { label: 'Heavy Snow', icon: '🌨️' },
  77: { label: 'Snow Grains', icon: '🌨️' },
  80: { label: 'Light Showers', icon: '🌦️' },
  81: { label: 'Showers', icon: '🌧️' },
  82: { label: 'Heavy Showers', icon: '🌧️' },
  85: { label: 'Snow Showers', icon: '🌨️' },
  86: { label: 'Snow Showers', icon: '🌨️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm', icon: '⛈️' },
  99: { label: 'Thunderstorm', icon: '⛈️' },
};

export interface DayForecast {
  date: string; // YYYY-MM-DD
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  label: string;
  icon: string;
  precipProbability: number;
}

interface WeatherCache {
  data: DayForecast[];
  fetchedAt: number;
}

let weatherCache: WeatherCache | null = null;
const CACHE_DURATION = 3600000; // 1 hour

async function fetchForecast(): Promise<DayForecast[]> {
  // Check cache
  if (weatherCache && Date.now() - weatherCache.fetchedAt < CACHE_DURATION) {
    return weatherCache.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${GEORGETOWN_LAT}&longitude=${GEORGETOWN_LON}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&timezone=America/Guyana&forecast_days=16`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    const json = await res.json();

    const forecasts: DayForecast[] = json.daily.time.map((date: string, i: number) => {
      const code = json.daily.weathercode[i];
      const wmo = WMO_CODES[code] || { label: 'Unknown', icon: '🌡️' };
      return {
        date,
        tempMax: Math.round(json.daily.temperature_2m_max[i]),
        tempMin: Math.round(json.daily.temperature_2m_min[i]),
        weatherCode: code,
        label: wmo.label,
        icon: wmo.icon,
        precipProbability: json.daily.precipitation_probability_max[i] ?? 0,
      };
    });

    weatherCache = { data: forecasts, fetchedAt: Date.now() };
    return forecasts;
  } catch {
    return [];
  }
}

export function useWeather() {
  const [forecasts, setForecasts] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForecast().then((data) => {
      setForecasts(data);
      setLoading(false);
    });
  }, []);

  const getForecastForDate = (dateStr: string): DayForecast | null => {
    // dateStr format: "2026-10-17" or similar
    return forecasts.find((f) => f.date === dateStr) || null;
  };

  return { forecasts, loading, getForecastForDate };
}
