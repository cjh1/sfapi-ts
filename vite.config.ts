import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/sfapi/index.ts"),
      name: "sfapi",
      fileName: "sfapi",
    },
    rollupOptions: {
      output: [
        // The default ending for UMD is cjs, how this causes problems (CORS)
        // when serving with unpkg so add a copy with js ending.
        {
          format: "umd",
          name: "sfapi",
          entryFileNames: "sfapi.umd.js",
        },
        {
          format: "umd",
          name: "sfapi",
        },
        {
          format: "esm",
          name: "sfapi",
          entryFileNames: "sfapi.js",
        },
      ],
    },
  },
  plugins: [dts()],
});
