import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CalendarDays,
  Calculator,
  CloudRain,
  CloudSun,
  Droplets,
  Info,
  Loader2,
  MapPin,
  RefreshCw,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from 'lucide-react';

const EVENT_START = '2026-10-15';
const EVENT_END = '2026-11-01';
const TIMEZONE = 'America/Guyana';
const REFRESH_INTERVAL = 60 * 60 * 1000;
const HEAT_PROTOCOL = { planningWatch: 31, drinksBreaks: 32, cessation: 36 } as const;

const LOCATIONS = {
  georgetown: {
    name: 'Georgetown',
    descriptor: 'Georgetown, Guyana',
    latitude: 6.8013,
    longitude: -58.1551,
  },
  berbice: {
    name: 'Berbice',
    descriptor: 'Berbice · New Amsterdam, Guyana',
    latitude: 6.2486,
    longitude: -57.5171,
  },
} as const;

type LocationKey = keyof typeof LOCATIONS;
type ForecastMap = Partial<Record<LocationKey, ForecastResponse>>;
type AvailabilityStatus = 'available' | 'future' | 'expired' | 'unavailable';
type HeatLevel = 'clear' | 'amber' | 'red' | 'pending';
type RainRisk = 'low' | 'watch' | 'likely' | 'high';

interface ForecastResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    wind_gusts_10m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
  };
}

interface HourlyEntry {
  time: string;
  temperature: number;
  humidity: number;
  apparent: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
}

interface Availability {
  status: AvailabilityStatus;
  entries: HourlyEntry[];
  bounds: { start: string; end: string } | null;
}

interface HeatStatus {
  level: HeatLevel;
  label: string;
  maximum: number | null;
  title: string;
  copy: string;
}

interface RainPeriod {
  start: HourlyEntry;
  end: HourlyEntry;
  hours: HourlyEntry[];
}

const EVENT_DATES = buildDateRange(EVENT_START, EVENT_END);

const HOURLY_VARIABLES = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'precipitation_probability',
  'precipitation',
  'weather_code',
].join(',');

const DAILY_VARIABLES = ['sunrise', 'sunset'].join(',');

const CONDITION_LABELS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Slight rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Heavy rain showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Heavy thunderstorm',
};

function buildDateRange(start: string, end: string) {
  const dates: string[] = [];
  const cursor = new Date(`${start}T12:00:00Z`);
  const finalDate = new Date(`${end}T12:00:00Z`);
  while (cursor <= finalDate) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

function formatDateLong(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}

function formatDateShort(date: string) {
  const dateObject = new Date(`${date}T12:00:00Z`);
  return {
    weekday: new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' }).format(dateObject),
    day: new Intl.DateTimeFormat('en-GB', { day: 'numeric', timeZone: 'UTC' }).format(dateObject),
    month: new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' }).format(dateObject),
  };
}

function formatHour(time: string | undefined) {
  return time ? time.slice(11, 16) : '—';
}

function formatUpdated(date: Date | null) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIMEZONE,
  }).format(date).replace(',', ' ·');
}

function guyanaToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function wetBulbTemperature(temperature: number, relativeHumidity: number) {
  const humidity = Math.min(100, Math.max(1, relativeHumidity));
  return (
    temperature * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659)) +
    Math.atan(temperature + humidity) -
    Math.atan(humidity - 1.676331) +
    0.00391838 * Math.pow(humidity, 1.5) * Math.atan(0.023101 * humidity) -
    4.686035
  );
}

function windCardinal(direction: number) {
  const labels = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return labels[Math.round(direction / 22.5) % 16];
}

function precipitationRisk(entry: HourlyEntry) {
  if (entry.precipitationProbability >= 70 || entry.precipitation >= 2) {
    return { level: 'high' as RainRisk, label: 'High', likely: true };
  }
  if (entry.precipitationProbability >= 50 || entry.precipitation >= 0.2) {
    return { level: 'likely' as RainRisk, label: 'Likely', likely: true };
  }
  if (entry.precipitationProbability >= 30) {
    return { level: 'watch' as RainRisk, label: 'Watch', likely: false };
  }
  return { level: 'low' as RainRisk, label: 'Low', likely: false };
}

function likelyRainPeriods(entries: HourlyEntry[]): RainPeriod[] {
  const periods: RainPeriod[] = [];
  let current: RainPeriod | null = null;

  entries.forEach((entry) => {
    if (precipitationRisk(entry).likely) {
      if (!current) {
        current = { start: entry, end: entry, hours: [entry] };
      } else {
        current.end = entry;
        current.hours.push(entry);
      }
    } else if (current) {
      periods.push(current);
      current = null;
    }
  });

  if (current) periods.push(current);
  return periods;
}

function estimatedCessation(time: string) {
  const ending = new Date(`${time}:00Z`);
  ending.setUTCHours(ending.getUTCHours() + 1);
  const next = ending.toISOString();
  const nextDay = next.slice(0, 10) !== time.slice(0, 10);
  return `${next.slice(11, 16)}${nextDay ? ' next day' : ''}`;
}

function describeRainPeriod(period: RainPeriod) {
  return `${formatHour(period.start.time)}–${estimatedCessation(period.end.time)}`;
}

function heatProtocolStatus(entries: HourlyEntry[]): HeatStatus {
  const temperatures = entries.map((entry) => entry.temperature).filter(Number.isFinite);
  const maximum = temperatures.length ? Math.max(...temperatures) : null;

  if (maximum === null) {
    return {
      level: 'pending',
      label: 'Forecast pending',
      maximum: null,
      title: 'Awaiting hourly forecast',
      copy: 'No protocol status can be issued until live hourly forecast data is available for this date.',
    };
  }

  if (maximum > HEAT_PROTOCOL.cessation) {
    return {
      level: 'red',
      label: 'Red · cessation risk',
      maximum,
      title: 'Forecast exceeds the cessation threshold',
      copy: `Forecast maximum air temperature is ${maximum.toFixed(1)}°C, above the IMC 36°C cessation threshold. If the nominated smartphone app records above 36°C at the match location, play must cease immediately.`,
    };
  }

  if (maximum >= HEAT_PROTOCOL.cessation) {
    return {
      level: 'amber',
      label: 'Amber · at 36°C',
      maximum,
      title: 'At the cessation threshold',
      copy: `Forecast maximum air temperature is ${maximum.toFixed(1)}°C. Umpires should schedule three drinks breaks per innings; any nominated-app reading above 36°C requires immediate cessation of play.`,
    };
  }

  if (maximum >= HEAT_PROTOCOL.drinksBreaks) {
    return {
      level: 'amber',
      label: 'Amber · drinks protocol',
      maximum,
      title: 'Three drinks breaks per innings required',
      copy: `Forecast maximum air temperature is ${maximum.toFixed(1)}°C, meeting the IMC 32°C forecast threshold. The umpires shall schedule three drinks breaks per innings instead of two.`,
    };
  }

  if (maximum >= HEAT_PROTOCOL.planningWatch) {
    return {
      level: 'amber',
      label: 'Amber · heat watch',
      maximum,
      title: 'Approaching the drinks-break threshold',
      copy: `Forecast maximum air temperature is ${maximum.toFixed(1)}°C, within 1°C of the 32°C drinks-break trigger. This is a planning watch, not an IMC trigger; continue to monitor the forecast.`,
    };
  }

  return {
    level: 'clear',
    label: 'No heat alert',
    maximum,
    title: 'No IMC heat trigger forecast',
    copy: `Forecast maximum air temperature is ${maximum.toFixed(1)}°C, below the 32°C drinks-break threshold.`,
  };
}

function hourlyEntries(data: ForecastResponse | undefined, date: string) {
  if (!data?.hourly?.time) return [];
  return data.hourly.time.reduce<HourlyEntry[]>((entries, time, index) => {
    if (time.startsWith(date)) {
      entries.push({
        time,
        temperature: data.hourly.temperature_2m[index],
        humidity: data.hourly.relative_humidity_2m[index],
        apparent: data.hourly.apparent_temperature[index],
        windSpeed: data.hourly.wind_speed_10m[index],
        windDirection: data.hourly.wind_direction_10m[index],
        windGusts: data.hourly.wind_gusts_10m[index],
        precipitationProbability: data.hourly.precipitation_probability[index] ?? 0,
        precipitation: data.hourly.precipitation[index] ?? 0,
        weatherCode: data.hourly.weather_code[index],
      });
    }
    return entries;
  }, []);
}

function forecastBounds(data: ForecastResponse | undefined) {
  if (!data?.hourly?.time?.length) return null;
  const times = data.hourly.time;
  return { start: times[0].slice(0, 10), end: times[times.length - 1].slice(0, 10) };
}

function availabilityForDate(data: ForecastResponse | undefined, date: string): Availability {
  const entries = hourlyEntries(data, date);
  if (entries.length) return { status: 'available', entries, bounds: forecastBounds(data) };

  const bounds = forecastBounds(data);
  if (date < guyanaToday()) return { status: 'expired', entries: [], bounds };
  if (!bounds) return { status: 'unavailable', entries: [], bounds };
  if (date > bounds.end) return { status: 'future', entries: [], bounds };
  if (date < bounds.start) return { status: 'expired', entries: [], bounds };
  return { status: 'unavailable', entries: [], bounds };
}

function dailyForDate(data: ForecastResponse | undefined, date: string) {
  if (!data?.daily?.time) return null;
  const index = data.daily.time.indexOf(date);
  if (index < 0) return null;
  return { sunrise: data.daily.sunrise[index], sunset: data.daily.sunset[index] };
}

function availabilityCopy(availability: Availability) {
  if (availability.status === 'future') {
    const horizon = availability.bounds ? ` The current provider window ends ${formatDateLong(availability.bounds.end)}.` : '';
    return {
      title: 'Forecast not published yet',
      message: `Open-Meteo has not issued hourly forecast data for this tournament date.${horizon} This view will populate automatically as the date enters the live forecast window.`,
    };
  }
  if (availability.status === 'expired') {
    return {
      title: 'Live forecast window has passed',
      message: 'This is a live planning dashboard and does not replace past dates with historical weather data.',
    };
  }
  return {
    title: 'Forecast currently unavailable',
    message: 'The weather provider did not return a full hourly forecast for this date. Refresh shortly; the dashboard does not estimate missing weather.',
  };
}

function rainRiskClass(level: RainRisk) {
  return {
    low: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700',
    watch: 'border-amber-500/25 bg-amber-500/10 text-amber-700',
    likely: 'border-orange-500/25 bg-orange-500/10 text-orange-700',
    high: 'border-red-500/25 bg-red-500/10 text-red-700',
  }[level];
}

function heatClass(level: HeatLevel) {
  return {
    clear: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-800',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-900',
    red: 'border-red-500/30 bg-red-500/10 text-red-900',
    pending: 'border-navy/15 bg-navy/[0.03] text-navy/70',
  }[level];
}

async function fetchForecast(location: (typeof LOCATIONS)[LocationKey]) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: TIMEZONE,
    forecast_days: '16',
    hourly: HOURLY_VARIABLES,
    daily: DAILY_VARIABLES,
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Weather provider returned ${response.status}`);
  const data = (await response.json()) as ForecastResponse;
  if (!data.hourly?.time?.length || !data.daily?.time?.length) throw new Error('Weather provider returned no hourly forecast data');
  return data;
}

export default function WeatherDashboardSection() {
  const [locationKey, setLocationKey] = useState<LocationKey>('georgetown');
  const [selectedDate, setSelectedDate] = useState(EVENT_START);
  const [forecasts, setForecasts] = useState<ForecastMap>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [calculatorTemperature, setCalculatorTemperature] = useState('');
  const [calculatorHumidity, setCalculatorHumidity] = useState('');
  const refreshInFlight = useRef(false);

  const refreshForecast = useCallback(async () => {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;
    setLoading(true);

    try {
      const requests = (Object.keys(LOCATIONS) as LocationKey[]).map(async (key) => ({
        key,
        data: await fetchForecast(LOCATIONS[key]),
      }));
      const settled = await Promise.allSettled(requests);
      const next: ForecastMap = {};
      const nextErrors: string[] = [];

      settled.forEach((result) => {
        if (result.status === 'fulfilled') {
          next[result.value.key] = result.value.data;
        } else {
          nextErrors.push(result.reason instanceof Error ? result.reason.message : 'Weather provider request failed');
        }
      });

      if (Object.keys(next).length) {
        setForecasts((previous) => ({ ...previous, ...next }));
        setLastUpdated(new Date());
      }
      setErrors(nextErrors);
    } finally {
      refreshInFlight.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshForecast();
    const interval = window.setInterval(() => void refreshForecast(), REFRESH_INTERVAL);
    return () => window.clearInterval(interval);
  }, [refreshForecast]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const isStale = !lastUpdated || Date.now() - lastUpdated.getTime() >= REFRESH_INTERVAL;
      if (!document.hidden && isStale) void refreshForecast();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [lastUpdated, refreshForecast]);

  const forecast = forecasts[locationKey];
  const availability = useMemo(() => availabilityForDate(forecast, selectedDate), [forecast, selectedDate]);
  const daily = useMemo(() => dailyForDate(forecast, selectedDate), [forecast, selectedDate]);
  const heat = useMemo(() => heatProtocolStatus(availability.entries), [availability.entries]);
  const rainPeriods = useMemo(() => likelyRainPeriods(availability.entries), [availability.entries]);
  const selectedLocation = LOCATIONS[locationKey];
  const reference = availability.entries[0];
  const maxRainChance = availability.entries.length
    ? Math.max(...availability.entries.map((entry) => entry.precipitationProbability))
    : null;
  const totalRain = availability.entries.reduce((sum, entry) => sum + entry.precipitation, 0);
  const wetBulb = reference ? wetBulbTemperature(reference.temperature, reference.humidity) : null;
  const calculatorTemp = Number(calculatorTemperature);
  const calculatorRh = Number(calculatorHumidity);
  const calculatorValid = calculatorTemperature.trim() !== '' && calculatorHumidity.trim() !== ''
    && Number.isFinite(calculatorTemp) && Number.isFinite(calculatorRh)
    && calculatorTemp >= -20 && calculatorTemp <= 60 && calculatorRh >= 1 && calculatorRh <= 100;
  const calculatedWetBulb = calculatorValid ? wetBulbTemperature(calculatorTemp, calculatorRh) : null;

  const prefillCalculator = () => {
    if (!reference) return;
    setCalculatorTemperature(reference.temperature.toFixed(1));
    setCalculatorHumidity(String(Math.round(reference.humidity)));
  };

  const forecastWindow = availability.bounds
    ? `Open-Meteo currently provides hourly forecasts through ${formatDateLong(availability.bounds.end)}. Dates beyond that date stay clearly marked until the provider publishes them.`
    : 'Live provider availability will appear after the first successful forecast update.';
  const rainSummary = !rainPeriods.length
    ? 'No likely rain period'
    : rainPeriods.length === 1
      ? describeRainPeriod(rainPeriods[0])
      : `${rainPeriods.length} likely periods`;
  const rainDetail = !rainPeriods.length
    ? 'No hourly forecast reaches the likely-rain threshold (50% chance or 0.2 mm).'
    : rainPeriods.length === 1
      ? `Likely onset ${formatHour(rainPeriods[0].start.time)} · cessation c. ${estimatedCessation(rainPeriods[0].end.time)} · peak chance ${Math.max(...rainPeriods[0].hours.map((entry) => entry.precipitationProbability))}%`
      : rainPeriods.map(describeRainPeriod).join('; ');

  return (
    <section id="weather" aria-labelledby="weather-heading" className="section-slate py-16 sm:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky/20 bg-sky/10 px-3 py-1.5 text-sky">
            <CloudSun className="h-4 w-4" aria-hidden="true" />
            <span className="font-body text-xs font-semibold uppercase tracking-[0.16em]">Live planning data</span>
          </div>
          <h2 id="weather-heading" className="font-display text-3xl font-bold tracking-wide text-navy uppercase sm:text-4xl md:text-5xl">
            Guyana Weather Centre
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-sky" />
          <p className="mx-auto mt-4 max-w-3xl font-body text-sm leading-relaxed text-navy/65 sm:text-base">
            Hourly operational forecasts for Georgetown and Berbice, with rainfall windows, wet-bulb planning data and the IMC extreme-heat protocol indicators.
          </p>
        </motion.div>

        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-4 rounded-xl border border-navy/10 bg-white/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-2" role="group" aria-label="Forecast location">
            {(Object.keys(LOCATIONS) as LocationKey[]).map((key) => {
              const active = locationKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLocationKey(key)}
                  aria-pressed={active}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-md px-3 py-2 font-body text-sm font-semibold transition-colors ${
                    active ? 'bg-navy text-white shadow-sm' : 'bg-navy/5 text-navy/65 hover:bg-navy/10 hover:text-navy'
                  }`}
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {LOCATIONS[key].name}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 font-body text-xs text-navy/55" role="status">
              {loading ? <Loader2 className="h-4 w-4 animate-spin text-sky" aria-hidden="true" /> : <span className={`h-2.5 w-2.5 rounded-full ${lastUpdated ? 'bg-emerald-500' : 'bg-red-500'}`} aria-hidden="true" />}
              <span>{loading ? 'Refreshing live forecast…' : lastUpdated ? `Updated ${formatUpdated(lastUpdated)} GMT−4` : 'Live forecast unavailable'}</span>
            </div>
            <button
              type="button"
              onClick={() => void refreshForecast()}
              disabled={loading}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-sky/25 bg-sky/10 px-3 py-2 font-body text-sm font-semibold text-sky transition-colors hover:bg-sky/15 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-6xl overflow-x-auto pb-1" aria-label="Tournament forecast date selector">
          <div className="flex min-w-max gap-2">
            {EVENT_DATES.map((date) => {
              const details = formatDateShort(date);
              const dateAvailability = availabilityForDate(forecast, date);
              const dateHeat = dateAvailability.status === 'available' ? heatProtocolStatus(dateAvailability.entries) : null;
              const active = date === selectedDate;
              const alertClass = dateHeat?.level === 'red' ? 'border-red-500/60' : dateHeat?.level === 'amber' ? 'border-amber-500/60' : 'border-navy/10';
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  aria-pressed={active}
                  className={`relative min-h-16 w-[68px] rounded-lg border px-2 py-2 text-center transition-all ${
                    active ? 'border-navy bg-navy text-white shadow-md' : `bg-white text-navy hover:border-sky/45 ${alertClass}`
                  }`}
                >
                  <span className={`block font-body text-[10px] uppercase tracking-wide ${active ? 'text-white/65' : 'text-navy/45'}`}>{details.weekday}</span>
                  <span className="block font-display text-xl font-bold leading-none">{details.day}</span>
                  <span className={`block font-body text-[10px] ${active ? 'text-white/70' : 'text-navy/50'}`}>{details.month}</span>
                  {dateAvailability.status === 'available' && dateHeat?.level === 'amber' && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" aria-label="Heat watch" />}
                  {dateAvailability.status === 'available' && dateHeat?.level === 'red' && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" aria-label="Heat cessation risk" />}
                </button>
              );
            })}
          </div>
        </div>

        {availability.status !== 'available' ? (
          <div className="mx-auto mt-6 max-w-6xl rounded-xl border border-navy/10 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky/10 text-sky">
                <Info className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-navy">{availabilityCopy(availability).title}</h3>
                <p className="mt-2 max-w-3xl font-body text-sm leading-relaxed text-navy/65">{availabilityCopy(availability).message}</p>
                <p className="mt-4 font-body text-xs leading-relaxed text-navy/45">{forecastWindow}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto mt-6 grid max-w-6xl gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-sky">{selectedLocation.descriptor}</p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">{formatDateLong(selectedDate)}</h3>
                    <p className="mt-1 font-body text-sm text-navy/55">{CONDITION_LABELS[reference.weatherCode] ?? 'Forecast conditions'} · first hourly reading at {formatHour(reference.time)}</p>
                  </div>
                  <div className="rounded-lg bg-sky/10 px-3 py-2 text-right">
                    <span className="block font-body text-[10px] font-semibold uppercase tracking-wider text-sky">Humidity</span>
                    <strong className="font-display text-2xl text-navy">{Math.round(reference.humidity)}%</strong>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard label="Air temperature" value={`${Math.round(reference.temperature)}°C`} detail="2m forecast level" icon={<Thermometer className="h-4 w-4" />} />
                  <MetricCard label="Feels like" value={`${Math.round(reference.apparent)}°C`} detail="Apparent temperature" icon={<CloudSun className="h-4 w-4" />} />
                  <MetricCard label="Wet bulb" value={`${wetBulb?.toFixed(1)}°C`} detail="Calculated planning value" icon={<Droplets className="h-4 w-4" />} />
                  <MetricCard label="Wind" value={`${windCardinal(reference.windDirection)} ${Math.round(reference.windSpeed)}`} suffix="km/h" detail={`Gusts ${Math.round(reference.windGusts)} km/h`} icon={<Wind className="h-4 w-4" />} />
                </div>

                <div className="mt-5 grid gap-3 border-t border-navy/8 pt-5 sm:grid-cols-3">
                  <div className="rounded-lg bg-navy/[0.035] p-3">
                    <div className="flex items-center gap-2 text-sky"><CloudRain className="h-4 w-4" /><span className="font-body text-xs font-semibold uppercase tracking-wider">Rain risk</span></div>
                    <strong className="mt-1 block font-display text-2xl text-navy">{maxRainChance}%</strong>
                    <span className="font-body text-xs text-navy/50">Daily peak probability · {totalRain.toFixed(1)} mm forecast</span>
                  </div>
                  <div className="rounded-lg bg-navy/[0.035] p-3">
                    <div className="flex items-center gap-2 text-sky"><Sunrise className="h-4 w-4" /><span className="font-body text-xs font-semibold uppercase tracking-wider">Sunrise</span></div>
                    <strong className="mt-1 block font-display text-2xl text-navy">{formatHour(daily?.sunrise)}</strong>
                    <span className="font-body text-xs text-navy/50">Guyana local time</span>
                  </div>
                  <div className="rounded-lg bg-navy/[0.035] p-3">
                    <div className="flex items-center gap-2 text-sky"><Sunset className="h-4 w-4" /><span className="font-body text-xs font-semibold uppercase tracking-wider">Sunset</span></div>
                    <strong className="mt-1 block font-display text-2xl text-navy">{formatHour(daily?.sunset)}</strong>
                    <span className="font-body text-xs text-navy/50">Guyana local time</span>
                  </div>
                </div>
              </div>

              <aside className={`rounded-xl border p-5 sm:p-6 ${heatClass(heat.level)}`} aria-live="polite">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <div>
                    <span className="font-body text-xs font-bold uppercase tracking-[0.14em]">IMC extreme heat protocol</span>
                    <h3 className="mt-1 font-display text-xl font-bold">{heat.title}</h3>
                    <p className="mt-2 font-body text-sm leading-relaxed">{heat.copy}</p>
                  </div>
                </div>
                <div className="mt-4 border-t border-current/15 pt-4">
                  <span className="font-body text-xs uppercase tracking-wider">Forecast daily maximum</span>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <strong className="font-display text-3xl font-bold">{heat.maximum?.toFixed(1)}°C</strong>
                    <span className="rounded-full border border-current/20 px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-wide">{heat.label}</span>
                  </div>
                </div>
                <p className="mt-4 border-t border-current/15 pt-4 font-body text-xs leading-relaxed opacity-80">
                  Planning information only. The nominated match-location smartphone app, appointed officials and Competition Committee determine any drinks breaks, cessation, resumption or cancellation.
                </p>
              </aside>
            </div>

            <div className="mx-auto mt-4 grid max-w-6xl gap-4 lg:grid-cols-[1fr_1.3fr]">
              <div className="rounded-xl border border-sky/20 bg-sky/5 p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sky"><CloudRain className="h-5 w-5" /><span className="font-body text-xs font-bold uppercase tracking-[0.14em]">Likely rain period</span></div>
                <h3 className="mt-2 font-display text-3xl font-bold text-navy">{rainSummary}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy/65">{rainDetail}</p>
                <p className="mt-4 font-body text-xs leading-relaxed text-navy/45">Likely indicates an hourly rain chance of at least 50% or forecast precipitation of at least 0.2 mm. Onset and cessation are approximate forecast windows, not observed rain times.</p>
              </div>

              <div className="rounded-xl border border-navy/10 bg-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <Calculator className="mt-0.5 h-5 w-5 shrink-0 text-sky" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-body text-xs font-bold uppercase tracking-[0.14em] text-sky">Wet-bulb calculator</p>
                        <h3 className="mt-1 font-display text-xl font-bold text-navy">Calculate an indicative wet-bulb temperature</h3>
                      </div>
                      <button type="button" onClick={prefillCalculator} className="min-h-10 rounded-md bg-navy/5 px-3 py-2 font-body text-xs font-semibold text-navy/70 hover:bg-navy/10" disabled={!reference}>
                        Use selected forecast
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <label className="block font-body text-xs font-semibold text-navy/70">
                        Air temperature (°C)
                        <input type="number" min="-20" max="60" step="0.1" value={calculatorTemperature} onChange={(event) => setCalculatorTemperature(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-md border border-navy/15 bg-white px-3 font-body text-base text-navy shadow-sm focus:border-sky" />
                      </label>
                      <label className="block font-body text-xs font-semibold text-navy/70">
                        Relative humidity (%)
                        <input type="number" min="1" max="100" step="1" value={calculatorHumidity} onChange={(event) => setCalculatorHumidity(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-md border border-navy/15 bg-white px-3 font-body text-base text-navy shadow-sm focus:border-sky" />
                      </label>
                    </div>
                    <div className={`mt-4 rounded-lg border p-3 ${calculatorValid ? 'border-sky/20 bg-sky/5' : 'border-navy/10 bg-navy/[0.025]'}`}>
                      <span className="font-body text-xs uppercase tracking-wider text-navy/50">Estimated wet-bulb temperature</span>
                      <strong className="ml-3 font-display text-3xl text-navy">{calculatedWetBulb ? `${calculatedWetBulb.toFixed(1)}°C` : '—'}</strong>
                      <p className="mt-1 font-body text-xs text-navy/55">{calculatorValid ? `Based on ${calculatorTemp.toFixed(1)}°C air temperature and ${calculatorRh.toFixed(0)}% relative humidity.` : 'Enter air temperature from −20 to 60°C and relative humidity from 1 to 100%.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-4 max-w-6xl overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
              <div className="flex flex-col gap-2 border-b border-navy/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-navy">Hourly forecast · {selectedLocation.name}</h3>
                  <p className="mt-0.5 font-body text-xs text-navy/50">{availability.entries.length} hourly forecasts returned for {formatDateLong(selectedDate)}.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 font-body text-xs text-navy/45"><CalendarDays className="h-3.5 w-3.5" /> Times shown in Guyana local time</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[1040px] w-full border-collapse text-left">
                  <thead className="bg-navy text-white">
                    <tr className="font-body text-[11px] uppercase tracking-wider text-white/70">
                      <th scope="col" className="px-4 py-3 font-semibold">Time</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Condition</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Air</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Feels</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Wet bulb</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Wind</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Gust</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Rain</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Chance</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/7">
                    {availability.entries.map((entry) => {
                      const risk = precipitationRisk(entry);
                      return (
                        <tr key={entry.time} className={risk.likely ? 'bg-sky/[0.035]' : 'hover:bg-navy/[0.02]'}>
                          <td className="px-4 py-3 font-display text-base font-semibold text-navy">{formatHour(entry.time)}</td>
                          <td className="px-4 py-3 font-body text-sm text-navy/70">{CONDITION_LABELS[entry.weatherCode] ?? 'Forecast conditions'}</td>
                          <td className="px-4 py-3 font-display text-base font-semibold text-navy">{Math.round(entry.temperature)}°C</td>
                          <td className="px-4 py-3 font-body text-sm font-semibold text-navy/75">{Math.round(entry.apparent)}°C</td>
                          <td className="px-4 py-3 font-body text-sm font-semibold text-navy/75">{wetBulbTemperature(entry.temperature, entry.humidity).toFixed(1)}°C</td>
                          <td className="px-4 py-3 font-body text-sm text-navy/75">{windCardinal(entry.windDirection)} {Math.round(entry.windSpeed)} km/h</td>
                          <td className="px-4 py-3 font-body text-sm text-navy/75">{Math.round(entry.windGusts)} km/h</td>
                          <td className="px-4 py-3 font-body text-sm text-navy/75">{entry.precipitation.toFixed(1)} mm</td>
                          <td className="px-4 py-3 font-body text-sm font-semibold text-navy/75">{entry.precipitationProbability}%</td>
                          <td className="px-4 py-3"><span className={`inline-flex rounded-full border px-2.5 py-1 font-body text-[11px] font-bold uppercase tracking-wide ${rainRiskClass(risk.level)}`}>{risk.label}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-navy/8 px-5 py-3 sm:px-6">
                <p className="font-body text-xs leading-relaxed text-navy/45">Wet-bulb values are calculated from forecast air temperature and relative humidity using the Stull approximation. Open-Meteo forecast data is refreshed hourly and is provided for planning purposes.</p>
              </div>
            </div>
          </>
        )}

        {errors.length > 0 && (
          <p className="mx-auto mt-4 max-w-6xl font-body text-xs text-amber-700" role="status">
            One location may be temporarily unavailable. The latest successful forecast remains visible; refresh again shortly.
          </p>
        )}
        <p className="mx-auto mt-5 max-w-6xl font-body text-xs leading-relaxed text-navy/40">{forecastWindow}</p>
      </div>
    </section>
  );
}

function MetricCard({ label, value, detail, icon, suffix }: { label: string; value: string; detail: string; icon: React.ReactNode; suffix?: string }) {
  return (
    <div className="rounded-lg border border-navy/8 bg-navy/[0.025] p-3">
      <div className="flex items-center gap-2 text-sky">
        {icon}
        <span className="font-body text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <strong className="mt-1 block font-display text-2xl font-bold text-navy">{value}{suffix && <span className="ml-1 font-body text-xs font-semibold text-navy/55">{suffix}</span>}</strong>
      <span className="font-body text-xs text-navy/50">{detail}</span>
    </div>
  );
}
