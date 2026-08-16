// Hook to fetch latest videos from England Cricket Over 40s YouTube channel
// Uses YouTube RSS feed via a CORS proxy (or direct if allowed)
// Channel ID: UC5Eg5wr5ZmD5JcfUhxK_nGg
import { useState, useEffect } from 'react';

const CHANNEL_ID = 'UC5Eg5wr5ZmD5JcfUhxK_nGg';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export interface YouTubeVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
}

interface FeedCache {
  videos: YouTubeVideo[];
  fetchedAt: number;
}

let feedCache: FeedCache | null = null;
const CACHE_DURATION = 3600000; // 1 hour

async function fetchYouTubeFeed(maxResults = 4): Promise<YouTubeVideo[]> {
  if (feedCache && Date.now() - feedCache.fetchedAt < CACHE_DURATION) {
    return feedCache.videos.slice(0, maxResults);
  }

  try {
    // Use a public CORS proxy to fetch the RSS feed
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error('Feed fetch failed');
    const text = await res.text();

    // Parse XML
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const entries = xml.querySelectorAll('entry');

    const videos: YouTubeVideo[] = [];
    entries.forEach((entry) => {
      const videoId = entry.querySelector('yt\\:videoId, videoId')?.textContent || '';
      const title = entry.querySelector('title')?.textContent || '';
      const published = entry.querySelector('published')?.textContent || '';
      
      if (videoId) {
        videos.push({
          id: videoId,
          title,
          published,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${videoId}`,
        });
      }
    });

    feedCache = { videos, fetchedAt: Date.now() };
    return videos.slice(0, maxResults);
  } catch {
    return [];
  }
}

export function useYouTubeFeed(maxResults = 4) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchYouTubeFeed(maxResults).then((data) => {
      setVideos(data);
      setLoading(false);
    });
  }, [maxResults]);

  return { videos, loading };
}
