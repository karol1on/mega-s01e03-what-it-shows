import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

// The kb as the desk sees it: .svx pages through mdsvex, wrapped in the runbook layout.
export default {
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook: fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url)) } })],
      adapter: adapter({ strict: false }),
      inlineStyleThreshold: Infinity,
      prerender: { entries: ['*', '/kb/incidents/4471', '/kb/incidents/4471-split'], handleHttpError: 'warn' },
    }),
  ],
};
