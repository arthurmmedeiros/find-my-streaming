export interface StreamingService {
  id: string;
  name: string;
  link: string;
  price?: string;
  quality?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'movie' | 'series' | 'episode';
  year?: string;
  poster?: string;
  description?: string;
  rating?: string;
  duration?: string;
  streamingServices?: StreamingService[];
}
