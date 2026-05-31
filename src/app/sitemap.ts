import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sarkarai-os.in';
  const routes = [
    '',
    '/about',
    '/chat',
    '/citizen',
    '/officer',
    '/admin',
    '/orchestration',
    '/analytics',
    '/notifications',
    '/settings'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
