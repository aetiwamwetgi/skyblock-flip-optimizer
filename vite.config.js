import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/skyblock-flip-optimizer/",
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
