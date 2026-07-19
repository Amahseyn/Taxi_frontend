import { defineConfig } from "vitest/config";
import path from "path";

// Next.js allows JSX inside .js files; tell Vite/esbuild to parse .js as JSX too.
function jsxForJs() {
  return {
    name: "jsx-for-js",
    async transform(code, id) {
      if (!id.match(/src\/.*\.js$/) || id.includes(".test.") || id.includes(".spec.")) return null;
      const { transform } = await import("esbuild");
      const result = await transform(code, { loader: "jsx", jsx: "automatic" });
      return { code: result.code, map: result.map };
    },
  };
}

export default defineConfig({
  plugins: [jsxForJs()],
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.js"],
    include: ["src/**/*.{test,spec}.{js,jsx}"],
    css: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".jsx"],
  },
});
