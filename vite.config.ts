import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = process.env.VITE_REPOSITORY_NAME || process.env.GITHUB_REPOSITORY?.split('/')[1] || 'Car_Dealership-JEVG';

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? `/${repositoryName}/` : '/',
});
