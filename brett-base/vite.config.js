import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
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
});
//# sourceMappingURL=vite.config.js.map