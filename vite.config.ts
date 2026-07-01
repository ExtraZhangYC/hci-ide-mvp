import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// base 用相对路径：打包后 Electron 以 file:// 加载 dist/index.html 才能解析资源
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
}));
