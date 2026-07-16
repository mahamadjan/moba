import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'moba.kg',
    short_name: 'moba.kg',
    description: 'Лучшие смартфоны Кыргызстана',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#FFD400',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
  }
}
