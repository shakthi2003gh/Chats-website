import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "src/[name].js",
        chunkFileNames: "src/[name].js",
        assetFileNames: ({ name }) => {
          if (name && name.endsWith(".css")) return "src/[name][extname]";

          return "assets/[name][extname]";
        },
      },
    },
  },
});
