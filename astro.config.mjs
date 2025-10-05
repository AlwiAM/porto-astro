// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://adammaulana.dev', // Change to your domain
  output: 'server', // Enable API routes
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [sitemap()],
  image: {
    domains: ['images.unsplash.com'],
    remotePatterns: [{
      protocol: 'https'
    }],
  },
});
