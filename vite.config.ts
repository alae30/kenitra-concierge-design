import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readdirSync } from "node:fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    rollupOptions: {
      input: {
        accueil: path.resolve(__dirname, "index.html"),
        logement: path.resolve(__dirname, "logement.html"),
        conciergerie: path.resolve(__dirname, "conciergerie.html"),
        reglement: path.resolve(__dirname, "reglement.html"),
        gestion: path.resolve(__dirname, "gestion.html"),
        contact: path.resolve(__dirname, "contact.html"),
        blog: path.resolve(__dirname, "blog.html"),
        ...Object.fromEntries(readdirSync(path.resolve(__dirname, "blog"))
          .filter((file) => file.endsWith(".html"))
          .map((file) => [file, path.resolve(__dirname, "blog", file)])),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
