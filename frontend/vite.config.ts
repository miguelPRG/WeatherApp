import { defineConfig } from "vitest/config"; // ⚠️ mudar a importação
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: true,
    watch: { usePolling: true },
    hmr: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setupTests.ts",
  },
  build: {
    minify: "esbuild",
    sourcemap: false,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: { manualChunks: { react: ["react", "react-dom"] } },
    },
  },
});
