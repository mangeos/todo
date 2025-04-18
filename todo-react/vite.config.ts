import { reactRouter } from "@react-router/dev/vite";

import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
   server: {
    port: 3000, // Du kan välja vilken port du vill köra på
  },
  build: {
    outDir: 'build', // Den här inställningen säkerställer att byggda filer hamnar i ./build-mappen
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [reactRouter(), tsconfigPaths()],
});
