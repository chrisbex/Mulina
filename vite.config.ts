import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Bezpieczne przekazanie klucza API
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Zapobieganie błędom w bibliotekach, które mogą odwoływać się do process.env
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        API_KEY: JSON.stringify(env.API_KEY)
      }
    },
  }
})