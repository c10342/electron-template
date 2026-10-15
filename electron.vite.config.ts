import { resolve } from "path";
import { defineConfig } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import fs from "fs";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const input: Record<string, string> = {};

const pagesDir = path.resolve(import.meta.dirname, "src/renderer/pages");
const pages = fs.readdirSync(pagesDir);

pages.forEach((page) => {
  input[page] = path.resolve(pagesDir, page, "index.html");
});

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@share": resolve("src/share")
      }
    },
    build: {
      rolldownOptions: {
        output: {
          format: "es",
          entryFileNames: "index.mjs"
        }
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        "@share": resolve("src/share")
      }
    },
    build: {
      rolldownOptions: {
        output: {
          format: "cjs",
          entryFileNames: "index.js"
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer"),
        "@share": resolve("src/share")
      }
    },
    build: {
      rolldownOptions: {
        input: input
      }
    },
    plugins: [
      vue(),
      vueJsx({}),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  }
});
