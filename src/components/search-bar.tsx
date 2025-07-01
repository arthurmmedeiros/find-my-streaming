'use client';

import { useState, useTransition, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
}

export default function SearchBar({
  initialQuery = '',
  className,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set('query', query.trim());
    } else {
      params.delete('query');
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className={className}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Search for movies or TV shows..."
            className="pl-10 h-12 text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isPending}
          />
        </div>
        <Button type="submit" size="lg" disabled={isPending || !query.trim()}>
          {isPending ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </form>
  );
}
