import { getViteConfig } from 'astro/config';

export default getViteConfig({
  ssr: {
    target: 'node',
  },
});
