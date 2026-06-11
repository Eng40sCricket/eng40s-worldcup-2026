// DESIGN: "Stadium Broadcast" — Tournament Schedule section
// Renders the full IMC itinerary as a timeline with day grouping, event-type icons, and highlight rows
// Source: IMC Newsletter #2, February 2026
import { useState, useMemo } from 'react';
import { scheduleData, ASSETS, type ScheduleEvent, type ScheduleEventType } from '@/lib/data';
import { motion } from 'framer-motion';
import {
  Calendar,
  Trophy,
  Palmtree,
  Dumbbell,
  Users,
  Plane,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  Info,
  ExternalLink,
} from 'lucide-react';

// ---- Event type config ----
const EVENT_TYPE_CONFIG: Record<ScheduleEventType, {
  icon: typeof Calendar;
  label: string;
  rowClass: string;
  iconClass: string;
  dotClass: string;
}> = {
  match: {
    icon: Trophy,
    label: 'Match Day',
    rowClass: 'bg-white border-navy/10',
    iconClass: 'text-sky',
    dotClass: 'bg-sky',
  },
  ceremony: {
    icon: Star,
    label: 'Ceremony',
    rowClass: 'bg-gold/8 border-gold/20',
    iconClass: 'text-gold-dark',
    dotClass: 'bg-gold',
  },
  rest: {
    icon: Palmtree,
    label: 'Rest Day',
    rowClass: 'bg-emerald-50 border-emerald-200/40',
    iconClass: 'text-emerald-600',
    dotClass: 'bg-emerald-500',
  },
  practice: {
    icon: Dumbbell,
    label: 'Practice',
    rowClass: 'bg-violet-50/50 border-violet-200/30',
    iconClass: 'text-violet-500',
    dotClass: 'bg-violet-400',
  },
  meeting: {
    icon: Users,
    label: 'Meeting',
    rowClass: 'bg-amber-50/50 border-amber-200/30',
    iconClass: 'text-amber-600',
    dotClass: 'bg-amber-500',
  },
  travel: {
    icon: Plane,
    label: 'Travel',
    rowClass: 'bg-gray-50 border-gray-200/40',
    iconClass: 'text-gray-500',
    dotClass: 'bg-gray-400',
  },
};

// ---- Date formatting ----
function formatScheduleDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatFullDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// ---- Filter type ----
type ScheduleFilter = 'all' | 'match' | 'ceremony' | 'rest';

export default function ScheduleSection() {
  const [filter, setFilter] = useState<ScheduleFilter>('all');
  const [showVenues, setShowVenues] = useState(false);

  const hasEvents = scheduleData.events.length > 0;

  // Group events by date
  const groupedEvents = useMemo(() => {
    let events = [...scheduleData.events];
    if (filter === 'match') {
      events = events.filter((e) => e.eventType === 'match');
    } else if (filter === 'ceremony') {
      events = events.filter((e) => e.eventType === 'ceremony' || e.eventType === 'meeting');
    } else if (filter === 'rest') {
      events = events.filter((e) => e.eventType === 'rest' || e.eventType === 'practice' || e.eventType === 'travel');
    }

    const map = new Map<string, ScheduleEvent[]>();
    events.forEach((e) => {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    });
    return map;
  }, [filter]);

  // Stats
  const matchDays = scheduleData.events.filter((e) => e.eventType === 'match').length;
  const restDays = scheduleData.events.filter((e) => e.eventType === 'rest').length;
  const totalDays = new Set(scheduleData.events.map((e) => e.date)).size;

  const filters: { label: string; value: ScheduleFilter; count: number }[] = [
    { label: 'Full Itinerary', value: 'all', count: scheduleData.events.length },
    { label: 'Match Days', value: 'match', count: matchDays },
    { label: 'Ceremonies & Meetings', value: 'ceremony', count: scheduleData.events.filter((e) => e.eventType === 'ceremony' || e.eventType === 'meeting').length },
    { label: 'Rest & Travel', value: 'rest', count: restDays + scheduleData.events.filter((e) => e.eventType === 'practice' || e.eventType === 'travel').length },
  ];

  if (!hasEvents) return null;

  return (
    <section id="schedule" aria-labelledby="schedule-heading" className="section-white py-16 sm:py-24">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          {/* IMC Logo */}
          <div className="flex justify-center mb-4">
            <img
              src={ASSETS.imcLogo}
              alt="IMC O40s World Cup 2026 Guyana"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
            />
          </div>

          <h2 id="schedule-heading" className="font-display text-navy text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase">
            {scheduleData.title}
          </h2>
          <div className="w-16 h-1 bg-sky mx-auto mt-3 rounded-full" />
          <p className="font-body text-muted-foreground text-sm mt-3 max-w-lg mx-auto">
            {scheduleData.subtitle}
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6">
            <div className="text-center">
              <span className="font-display text-navy text-2xl font-bold">{totalDays}</span>
              <span className="block font-body text-navy/40 text-xs uppercase tracking-wider">Days</span>
            </div>
            <div className="w-px h-10 bg-navy/10" />
            <div className="text-center">
              <span className="font-display text-sky text-2xl font-bold">{matchDays}</span>
              <span className="block font-body text-navy/40 text-xs uppercase tracking-wider">Match Days</span>
            </div>
            <div className="w-px h-10 bg-navy/10" />
            <div className="text-center">
              <span className="font-display text-emerald-600 text-2xl font-bold">{restDays}</span>
              <span className="block font-body text-navy/40 text-xs uppercase tracking-wider">Rest Days</span>
            </div>
            <div className="w-px h-10 bg-navy/10" />
            <div className="text-center">
              <span className="font-display text-gold-dark text-2xl font-bold">11</span>
              <span className="block font-body text-navy/40 text-xs uppercase tracking-wider">Venues</span>
            </div>
          </div>
        </motion.div>

        {/* Filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={`font-body text-xs px-4 py-2 rounded-full transition-all min-h-[44px] ${
                filter === f.value
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-navy/8 text-navy/60 hover:bg-navy/15'
              }`}
            >
              {f.label}
              <span className={`ml-1.5 text-[10px] ${filter === f.value ? 'text-white/60' : 'text-navy/30'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-navy/10" />

            {Array.from(groupedEvents.entries()).map(([date, events], groupIdx) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: groupIdx * 0.05 }}
                className="relative mb-6 last:mb-0"
              >
                {/* Date header */}
                <div className="flex items-center gap-3 mb-2 relative">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-navy text-white shrink-0">
                    <span className="font-display text-xs sm:text-sm font-bold leading-none">
                      {formatScheduleDate(date).split(' ')[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-navy text-sm sm:text-base font-semibold">
                      {formatFullDate(date)}
                    </p>
                    <p className="font-body text-navy/40 text-xs">
                      {events.length} event{events.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Events for this date */}
                <div className="ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-2">
                  {events.map((event) => {
                    const cfg = EVENT_TYPE_CONFIG[event.eventType];
                    const Icon = cfg.icon;
                    const Wrapper = event.link ? 'a' : 'div';
                    const wrapperProps = event.link
                      ? { href: event.link, target: '_blank', rel: 'noopener noreferrer' }
                      : {};

                    return (
                      <Wrapper
                        key={event.id}
                        {...wrapperProps}
                        className={`relative block rounded-lg border p-3 sm:p-4 transition-all ${cfg.rowClass} ${
                          event.isHighlight ? 'ring-1 ring-sky/30 shadow-sm' : ''
                        } ${event.link ? 'cursor-pointer hover:shadow-md hover:scale-[1.01] group' : ''}`}
                      >
                        {/* Highlight indicator */}
                        {event.isHighlight && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-sky" />
                        )}

                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`shrink-0 mt-0.5 ${cfg.iconClass}`}>
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className={`font-display text-sm sm:text-base font-semibold ${
                                event.isHighlight ? 'text-navy' : 'text-navy/80'
                              }`}>
                                {event.event}
                              </h4>
                              {event.isHighlight && (
                                <span className="pill text-[10px] bg-sky/15 text-sky">Key Event</span>
                              )}
                            </div>

                            {event.description && (
                              <p className="font-body text-xs text-navy/50 mt-0.5">{event.description}</p>
                            )}
                          </div>

                          {/* Time or Link indicator */}
                          {event.time && (
                            <div className="shrink-0 flex items-center gap-1 text-navy/50">
                              <Clock className="w-3 h-3" />
                              <span className="font-body text-xs font-medium">{event.time}</span>
                            </div>
                          )}
                          {event.link && !event.time && (
                            <div className="shrink-0 flex items-center gap-1 text-emerald-600/60 group-hover:text-emerald-600">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </Wrapper>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Source attribution */}
        <div className="text-center mt-8">
          <p className="font-body text-xs text-navy/30 flex items-center justify-center gap-1">
            <Info className="w-3 h-3" />
            Source: {scheduleData.source}
          </p>
        </div>

        {/* Venues toggle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <button
            onClick={() => setShowVenues(!showVenues)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-lg bg-navy/5 hover:bg-navy/8 transition-colors min-h-[48px]"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky" />
              <span className="font-display text-navy text-base sm:text-lg font-semibold">
                Tournament Venues
              </span>
              <span className="pill text-[10px] bg-sky/15 text-sky">{scheduleData.venueInfo.length}</span>
            </div>
            {showVenues ? (
              <ChevronUp className="w-5 h-5 text-navy/40" />
            ) : (
              <ChevronDown className="w-5 h-5 text-navy/40" />
            )}
          </button>

          {showVenues && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-3 grid gap-3 sm:grid-cols-2"
            >
              {scheduleData.venueInfo.map((venue) => (
                <div
                  key={venue.name}
                  className="rounded-lg border border-navy/10 bg-white p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-sky shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-display text-navy text-sm font-semibold">{venue.name}</h4>
                      <p className="font-body text-xs text-navy/40 mt-0.5">{venue.location}</p>
                      <p className="font-body text-xs text-navy/60 mt-1.5 leading-relaxed">{venue.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
