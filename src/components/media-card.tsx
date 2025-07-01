import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Film, Tv, Calendar } from 'lucide-react';

import { IMAGE_SIZES } from '@/lib/config';
import StreamingProviders from '@/components/streaming-providers';
import { tmdbApi } from '@/lib/tmdb.api';
import { isMovie, SearchResult } from '@/types';

interface MediaCardProps {
  item: SearchResult;
}

export default function MediaCard({ item }: MediaCardProps) {
  const title = isMovie(item) ? item.title : item.name;
  const releaseDate = isMovie(item) ? item.release_date : item.first_air_date;
  const posterUrl = tmdbApi.getImageUrl(
    item.poster_path,
    IMAGE_SIZES.POSTER.MEDIUM
  );

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'Unknown';
    }
    try {
      return new Date(dateString).getFullYear().toString();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[2/3] w-full bg-muted">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-lg line-clamp-2 flex-1">{title}</h3>
          <Badge variant="secondary" className="shrink-0">
            {item.media_type === 'tv' ? (
              <>
                <Tv className="h-3 w-3 mr-1" />
                TV
              </>
            ) : (
              <>
                <Film className="h-3 w-3 mr-1" />
                Movie
              </>
            )}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(releaseDate)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <StreamingProviders mediaType={item.media_type} id={item.id} />
      </CardContent>
    </Card>
  );
}
