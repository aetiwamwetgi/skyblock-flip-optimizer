import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "/" per deploy su Vercel (o qualsiasi host che serve dalla radice).
// Se invece pubblichi su GitHub Pages con repo "skyblock-flip-optimizer",
// rimetti base: "/skyblock-flip-optimizer/".
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 5173,
    proxy: {
      "/hapi": {
        target: "https://api.hypixel.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hapi/, ""),
      },
    },
  },
});
