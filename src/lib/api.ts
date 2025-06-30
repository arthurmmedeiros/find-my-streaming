import { SearchResult } from '@/types';

// Mock API function - replace with your actual API implementation
export async function searchStreamingServices(
  query: string
): Promise<SearchResult[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data - replace with actual API call
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: query,
      type: 'movie',
      year: '2023',
      poster: 'https://via.placeholder.com/300x450',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      rating: '8.5',
      duration: '2h 15m',
      streamingServices: [
        {
          id: 'netflix',
          name: 'Netflix',
          link: 'https://netflix.com',
          price: 'Subscription',
        },
        {
          id: 'amazon-prime',
          name: 'Prime Video',
          link: 'https://primevideo.com',
          price: 'Subscription',
        },
        {
          id: 'disney-plus',
          name: 'Disney+',
          link: 'https://disneyplus.com',
          price: '$7.99',
        },
      ],
    },
    {
      id: '2',
      title: `${query} - The Series`,
      type: 'series',
      year: '2022',
      poster: 'https://via.placeholder.com/300x450',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      rating: '9.0',
      streamingServices: [
        {
          id: 'hbo-max',
          name: 'HBO Max',
          link: 'https://hbomax.com',
          price: 'Subscription',
        },
        {
          id: 'hulu',
          name: 'Hulu',
          link: 'https://hulu.com',
          price: '$5.99',
        },
      ],
    },
  ];

  // In a real implementation, you would:
  // 1. Make an API call to your backend or a streaming availability API
  // 2. Transform the response to match the SearchResult interface
  // 3. Handle errors appropriately

  return mockResults;
}
