import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    proxy: {
      "/back": {
        target: "https://963sy.net",
        changeOrigin: true,
      },
    },
  },
});
