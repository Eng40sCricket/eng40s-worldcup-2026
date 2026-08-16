// YouTube feed component — displays latest videos from the England Over 40s channel
import { useYouTubeFeed } from '@/hooks/useYouTubeFeed';
import { motion } from 'framer-motion';
import { Play, Youtube, ExternalLink } from 'lucide-react';

export default function YouTubeFeed() {
  const { videos, loading } = useYouTubeFeed(4);

  if (loading) {
    return (
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <Youtube className="w-5 h-5 text-red-600" />
          <h3 className="font-display text-navy text-xl sm:text-2xl font-bold">Latest Videos</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg bg-navy/5 animate-pulse aspect-video" />
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6 }}
      className="mt-12"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-600" />
          <h3 className="font-display text-navy text-xl sm:text-2xl font-bold">Latest Videos</h3>
        </div>
        <a
          href="https://www.youtube.com/channel/UC5Eg5wr5ZmD5JcfUhxK_nGg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-body text-xs text-sky hover:text-sky-light transition-colors font-medium"
        >
          View Channel <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Video grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((video, i) => (
          <motion.a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group rounded-lg overflow-hidden border border-border bg-white shadow-sm hover:shadow-md transition-all"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-navy/20 group-hover:bg-navy/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="p-3">
              <h4 className="font-body text-sm text-navy font-semibold leading-snug line-clamp-2 group-hover:text-sky transition-colors">
                {video.title}
              </h4>
              <p className="font-body text-[10px] text-navy/40 mt-1.5">
                {new Date(video.published).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
