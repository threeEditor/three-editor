import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from 'fs';

const aceEditorResolver = {
  name: 'ace-editor-resolver',
  resolveId(id: string) {
      if (id === 'ace-editor') {
          return path.resolve(__dirname, 'node_modules/ace-builds/src-min-nomodule/ace.js');
      }
      return null;
  },
  load(id: string) {
      if (id === path.resolve(__dirname, 'node_modules/ace-builds/src-min-nomodule/ace.js')) {
          return fs.readFileSync(id, 'utf-8');
      }
      return null;
  },
};
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    aceEditorResolver,
  ],
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
