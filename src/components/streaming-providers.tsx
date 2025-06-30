import { getWatchProviders } from '@/lib/tmdb';
import Image from 'next/image';

export default async function StreamingProviders({
  mediaType,
  id,
}: {
  mediaType: string;
  id: number;
}) {
  const providers = await getWatchProviders(mediaType, id);

  if (!providers || Object.keys(providers).length === 0) {
    return (
      <div className="mt-2">
        <p className="text-sm text-muted-foreground">
          No streaming information available
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h4 className="text-sm font-medium mb-2">Available on:</h4>
      <div className="flex flex-wrap gap-2">
        {providers.map((provider) => (
          <div
            key={provider.provider_id}
            className="flex items-center gap-1 bg-muted rounded-full px-2 py-1"
            title={provider.provider_name}
          >
            <div className="relative w-5 h-5 rounded-full overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                width={192}
                height={288}
                className="object-cover"
              />
            </div>
            <span className="text-xs">{provider.provider_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
