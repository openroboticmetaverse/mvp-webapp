import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {    // <-- this object is added
    port: 8000,
    watch: {
      usePolling: true,
    }
  },
  plugins: [vue()],
})
