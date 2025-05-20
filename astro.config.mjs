// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import clerk from '@clerk/astro';
import { dark } from '@clerk/themes';
import node from '@astrojs/node';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: true,
    port: 4321,
  },
  integrations: [react(), clerk(), mdx()],
  devToolbar: {
    enabled: false,
  },
  adapter: node({
    mode: 'standalone',
  }),
  env: {
    schema: {
      PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
      CLERK_SECRET_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
      }),
      CLERK_SIGN_IN_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
      CLERK_SIGN_IN_FORCE_REDIRECT_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
      CLERK_SIGN_UP_FORCE_REDIRECT_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
      CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
      CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
      GEMINI_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
      }),
      TURSO_AUTH_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
      }),
      TURSO_DATABASE_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
      }),
      SITE_URL: envField.string({
        context: 'server',
        access: 'public',
        optional: false,
      }),
    },
    validateSecrets: true,
  },
});
