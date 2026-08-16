// DESIGN: "Stadium Broadcast" — Team update feed with featured story,
// category filters, pinned items, and official England badges
import { useState, useMemo } from 'react';
import {
  newsData,
  ASSETS,
  type Bulletin,
  type BulletinCategory,
} from '@/lib/data';
import YouTubeFeed from './YouTubeFeed';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  Calendar,
  ArrowRight,
  Pin,
  Shield,
  Users,
  MapPin,
  Dumbbell,
  Swords,
  Trophy,
  Camera,
  Megaphone,
  CalendarDays,
  Filter,
} from 'lucide-react';

// ---- HELPERS ----

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getCategoryIcon(cat: BulletinCategory) {
  switch (cat) {
    case 'squad': return Users;
    case 'fixtures': return CalendarDays;
    case 'travel': return MapPin;
    case 'training': return Dumbbell;
    case 'matchday': return Swords;
    case 'results': return Trophy;
    case 'media': return Camera;
    case 'announcements': return Megaphone;
    default: return Newspaper;
  }
}

/**
 * Sorts bulletins: pinned first, then newest-first by date.
 */
function sortBulletins(items: Bulletin[]): Bulletin[] {
  return [...items].sort((a, b) => {
    // Pinned items always float to top
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then sort by date descending
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// ---- CATEGORY FILTER PILLS ----

const ALL_CATEGORIES: Array<{ key: BulletinCategory | 'all'; label: string }> = [
  { key: 'all', label: 'All Updates' },
  { key: 'squad', label: 'Squad' },
  { key: 'fixtures', label: 'Fixtures' },
  { key: 'travel', label: 'Travel' },
  { key: 'training', label: 'Training' },
  { key: 'matchday', label: 'Matchday' },
  { key: 'results', label: 'Results' },
  { key: 'media', label: 'Media' },
  { key: 'announcements', label: 'Announcements' },
];

// ---- BACKGROUND IMAGES FOR CARDS ----
const CARD_IMAGES = [
  ASSETS.cricketAction,
  ASSETS.guyanaStadium,
  ASSETS.cricketBall,
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function NewsSection() {
  const [activeCategory, setActiveCategory] = useState<BulletinCategory | 'all'>('all');

  // Separate featured item (first isFeatured bulletin)
  const featured = useMemo(
    () => newsData.bulletins.find((b) => b.isFeatured) ?? null,
    [],
  );

  // Filter and sort remaining bulletins
  const feedItems = useMemo(() => {
    const nonFeatured = newsData.bulletins.filter((b) => b.id !== featured?.id);
    const filtered = activeCategory === 'all'
      ? nonFeatured
      : nonFeatured.filter((b) => b.category === activeCategory);
    return sortBulletins(filtered);
  }, [activeCategory, featured]);

  // Count per category for filter badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: newsData.bulletins.length };
    for (const b of newsData.bulletins) {
      counts[b.category] = (counts[b.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <section id="news" aria-labelledby="news-heading" className="section-slate py-16 sm:py-24 clip-top">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="font-body text-sky text-sm tracking-[0.25em] uppercase mb-2 font-medium">
            Team Updates
          </p>
          <h2 id="news-heading" className="font-display text-navy text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase">
            News &amp; Bulletins
          </h2>
          <div className="w-16 h-1 bg-sky mx-auto mt-3 rounded-full" />
        </motion.div>

        {newsData.bulletins.length > 0 ? (
          <>
            {/* Featured story */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-10"
              >
                <FeaturedStory bulletin={featured} />
              </motion.div>
            )}

            {/* Category filter pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-navy/40" />
                <span className="font-body text-xs text-navy/40 uppercase tracking-wider font-medium">
                  Filter by category
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((cat) => {
                  const count = categoryCounts[cat.key] || 0;
                  if (cat.key !== 'all' && count === 0) return null;
                  const isActive = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      aria-pressed={activeCategory === cat.key}
                      className={`pill text-xs transition-all min-h-[44px] px-3 ${
                        isActive
                          ? 'bg-navy text-white shadow-md'
                          : 'bg-navy/5 text-navy/60 hover:bg-navy/10 hover:text-navy'
                      }`}
                    >
                      {cat.label}
                      {count > 0 && (
                        <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-navy/10 text-navy/40'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Bulletin feed */}
            <AnimatePresence mode="wait">
              {feedItems.length > 0 ? (
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
                >
                  {feedItems.map((item, i) => (
                    <BulletinCard key={item.id} bulletin={item} index={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-filter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <p className="font-body text-navy/40 text-sm">
                    No bulletins in this category yet. Check back closer to the tournament.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Last updated note */}
            <div className="mt-6 text-center">
              <span className="inline-flex items-center gap-1.5 font-body text-xs text-navy/40">
                <Calendar className="w-3 h-3" />
                Last updated: {formatDate(newsData.bulletins[0]?.date || '2026-06-02')}
              </span>
            </div>

            {/* YouTube Feed */}
            <YouTubeFeed />
          </>
        ) : (
          /* Empty state when no bulletins at all */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-5">
              <Newspaper className="w-10 h-10 text-navy/20" />
            </div>
            <h3 className="font-display text-navy text-xl font-semibold mb-2">
              No News Yet
            </h3>
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              News bulletins will appear here as the tournament approaches.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}


// ============================================================
// FEATURED STORY COMPONENT
// ============================================================

function FeaturedStory({ bulletin }: { bulletin: Bulletin }) {
  const catConfig = newsData.categories[bulletin.category];
  const CatIcon = getCategoryIcon(bulletin.category);

  return (
    <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg border border-border bg-white">
      {/* Two-column layout: image takes centre stage */}
      <div className="grid md:grid-cols-2">
        {/* Featured graphic — full prominence */}
        <div className="relative bg-navy flex items-center justify-center p-4 sm:p-6 min-h-[280px] md:min-h-[360px]">
          <img
            src={bulletin.imageUrl || ASSETS.cricketAction}
            alt={bulletin.headline}
            className="w-full h-full object-contain max-h-[320px] md:max-h-[400px] rounded-md"
          />
        </div>

        {/* Text content */}
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/15 text-gold-dark text-[11px] font-body font-semibold uppercase tracking-wider">
              <Pin className="w-3 h-3" />
              Featured
            </span>
            {bulletin.isOfficial && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky/15 text-sky text-[11px] font-body font-semibold uppercase tracking-wider">
                <Shield className="w-3 h-3" />
                Official
              </span>
            )}
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-body font-medium ${catConfig.color}`}>
              <CatIcon className="w-3 h-3" />
              {catConfig.label}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 mb-3">
            <Calendar className="w-3.5 h-3.5 text-navy/30" />
            <time className="font-body text-xs text-navy/50">
              {formatDate(bulletin.date)}
            </time>
          </div>

          {/* Headline */}
          <h3 className="font-display text-navy text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-4">
            {bulletin.headline}
          </h3>

          {/* Summary */}
          <p className="font-body text-navy/70 text-sm sm:text-base leading-relaxed mb-4">
            {bulletin.summary}
          </p>

          {/* Author */}
          {bulletin.author && (
            <p className="font-body text-xs text-navy/40 mb-4">
              By {bulletin.author}
            </p>
          )}

          {/* Link */}
          {bulletin.link && (
            <a
              href={bulletin.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-sm text-sky font-medium hover:text-sky-light transition-colors"
            >
              Read full story <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}


// ============================================================
// BULLETIN CARD COMPONENT
// ============================================================

function BulletinCard({ bulletin, index }: { bulletin: Bulletin; index: number }) {
  const catConfig = newsData.categories[bulletin.category];
  const CatIcon = getCategoryIcon(bulletin.category);
  const bgImage = bulletin.imageUrl || CARD_IMAGES[index % CARD_IMAGES.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="bg-white rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-all group"
    >
      {/* Image header */}
      <div className="h-40 relative overflow-hidden">
        <img
          src={bgImage}
          alt=""
          className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

        {/* Pinned badge */}
        {bulletin.isPinned && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy/80 text-gold text-[10px] font-body font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Pin className="w-2.5 h-2.5" />
              Pinned
            </span>
          </div>
        )}

        {/* Official badge */}
        {bulletin.isOfficial && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky/90 text-white text-[10px] font-body font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Shield className="w-2.5 h-2.5" />
              Official
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category tag + date */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body font-medium ${catConfig.color}`}>
            <CatIcon className="w-3 h-3" />
            {catConfig.label}
          </span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <time className="font-body text-[11px] text-muted-foreground">
              {formatDate(bulletin.date)}
            </time>
          </div>
        </div>

        {/* Headline */}
        <h3 className="font-display text-navy text-base font-semibold leading-snug mb-2">
          {bulletin.headline}
        </h3>

        {/* Summary */}
        <p className="font-body text-sm text-navy/60 leading-relaxed line-clamp-3">
          {bulletin.summary}
        </p>

        {/* Author */}
        {bulletin.author && (
          <p className="font-body text-[11px] text-navy/30 mt-2">
            By {bulletin.author}
          </p>
        )}

        {/* Link */}
        {bulletin.link && (
          <a
            href={bulletin.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 font-body text-sm text-sky font-medium hover:underline"
          >
            Read more <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.article>
  );
}
