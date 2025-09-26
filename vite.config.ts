import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import svgr from "vite-plugin-svgr"

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 5173,
    host: true, // Listen on all addresses
    proxy: {
      "/api": {
        target: "http://localhost:3333",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  preview: {
    port: 5173,
    host: true,
  },
})
