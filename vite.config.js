import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [".monkeycode-ai.live"]
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [".monkeycode-ai.live"]
  },
  build: {
    rollupOptions: {
      // Site multipágina: sem isto o build levaria só o index.html
      // e a SHOP ficaria de fora do dist.
      input: {
        index: resolve(__dirname, "index.html"),
        shop: resolve(__dirname, "shop.html"),
        produto: resolve(__dirname, "produto.html")
      }
    }
  }
});
