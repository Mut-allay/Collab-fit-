/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/setupTests.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@fitspark/shared": path.resolve(__dirname, "../../packages/shared/src"),
      "~": path.resolve(__dirname, "../../node_modules"),
    },
  },
});
