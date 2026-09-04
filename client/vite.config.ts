// Letterbox Vite & TanStack Start Configuration
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  server: {
    port: 8081,
    host: true,
  },
  preview: {
    port: 8081,
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts
    server: { entry: "server" },
  },
});
