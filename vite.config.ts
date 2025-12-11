import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Ładujemy zmienne środowiskowe (w tym API_KEY z Netlify)
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Przekazujemy klucz API do aplikacji w bezpieczny sposób
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  }
})