import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path"

export default defineConfig({
    plugins: [
        react(),
        viteSingleFile({
            removeViteModuleLoader: true,
            useRecommendedBuildConfig: true,
        }),
    ],
    build: {
        target: "esnext",
        minify: "esbuild",
        cssCodeSplit: false,
    },
    resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
});
//# sourceMappingURL=vite.config.js.map
