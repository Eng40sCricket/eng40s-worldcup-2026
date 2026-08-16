// Hard-coded latest videos from England Cricket Over 40s YouTube channel
// Channel ID: UC5Eg5wr5ZmD5JcfUhxK_nGg
// To refresh: ask Manus to update the video list from the RSS feed

export interface YouTubeVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
  url: string;
}

// Latest videos as of 16 August 2026
const LATEST_VIDEOS: YouTubeVideo[] = [
  {
    id: 'ESTuxZOclUE',
    title: 'Jayden Levitt — 2 massive sixes v Wales',
    published: '2026-08-15',
    thumbnail: 'https://i.ytimg.com/vi/ESTuxZOclUE/mqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=ESTuxZOclUE',
  },
  {
    id: 'Y5_94KF7yQg',
    title: 'Highlights — England v Wales Triple Crown 2026',
    published: '2026-08-12',
    thumbnail: 'https://i.ytimg.com/vi/Y5_94KF7yQg/mqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Y5_94KF7yQg',
  },
  {
    id: 'Jf9KzhoV2Q0',
    title: 'England O40s v Worcester O40s 2026',
    published: '2026-08-11',
    thumbnail: 'https://i.ytimg.com/vi/Jf9KzhoV2Q0/mqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=Jf9KzhoV2Q0',
  },
  {
    id: '2lEGp5i1mG0',
    title: 'Jackson Thompson 100 v Wales Dragons',
    published: '2026-08-07',
    thumbnail: 'https://i.ytimg.com/vi/2lEGp5i1mG0/mqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=2lEGp5i1mG0',
  },
];

export function useYouTubeFeed(maxResults = 4) {
  const videos = LATEST_VIDEOS.slice(0, maxResults);
  return { videos, loading: false };
}
