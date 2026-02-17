import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@/components': path.resolve(__dirname, './src/components'),
          '@/pages': path.resolve(__dirname, './src/pages'),
          '@/hooks': path.resolve(__dirname, './src/hooks'),
          '@/lib': path.resolve(__dirname, './src/lib'),
          '@/types': path.resolve(__dirname, './src/types'),
          '@/store': path.resolve(__dirname, './src/store'),
          '@/data': path.resolve(__dirname, './src/data'),
          '@/schemas': path.resolve(__dirname, './src/schemas'),
        }
      }
    };
});
