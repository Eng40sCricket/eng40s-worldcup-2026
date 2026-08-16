// Weather badge for fixture cards — shows temp and conditions for match day
import type { DayForecast } from '@/hooks/useWeather';
import { Cloud, Droplets } from 'lucide-react';

interface WeatherBadgeProps {
  forecast: DayForecast | null;
  loading?: boolean;
  compact?: boolean;
}

export default function WeatherBadge({ forecast, loading = false, compact = false }: WeatherBadgeProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-sky/5 border border-sky/10 animate-pulse">
        <Cloud className="w-3.5 h-3.5 text-sky/40" />
        <span className="font-body text-[10px] text-navy/30">Loading...</span>
      </div>
    );
  }

  if (!forecast) {
    return null; // No forecast available (match too far out)
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-sky/5 border border-sky/10" title={`${forecast.label}, ${forecast.tempMax}°C`}>
        <span className="text-sm leading-none">{forecast.icon}</span>
        <span className="font-body text-[10px] font-semibold text-navy/70">{forecast.tempMax}°C</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-sky/5 to-sky/10 border border-sky/15">
      <span className="text-lg leading-none" aria-hidden="true">{forecast.icon}</span>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-display text-sm font-bold text-navy">{forecast.tempMax}°C</span>
          <span className="font-body text-[10px] text-navy/40">/ {forecast.tempMin}°C</span>
        </div>
        <span className="font-body text-[10px] text-navy/60 leading-tight block">{forecast.label}</span>
      </div>
      {forecast.precipProbability > 30 && (
        <div className="flex items-center gap-0.5 ml-auto" title="Chance of rain">
          <Droplets className="w-3 h-3 text-sky" />
          <span className="font-body text-[10px] font-semibold text-sky">{forecast.precipProbability}%</span>
        </div>
      )}
    </div>
  );
}

