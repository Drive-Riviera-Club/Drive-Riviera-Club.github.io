import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName =
  process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';

const isRootPagesRepository =
  repositoryName.toLowerCase() === 'drive-riviera-club.github.io';

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS
    ? isRootPagesRepository
      ? '/'
      : `/${repositoryName}/`
    : '/',
});
