// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://adammaulana.dev', // Change to your domain
  output: 'server', // Enable API routes
  adapter: vercel({
    webAnalytics: {
      enabled: true
    }
  }),
  integrations: [sitemap()],
  image: {
    domains: ['images.unsplash.com'],
    remotePatterns: [{
      protocol: 'https'
    }],
  },
});
