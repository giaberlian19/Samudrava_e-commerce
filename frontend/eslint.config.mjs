import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Menggabungkan aturan Next.js, TypeScript, dan daftar direktori yang diabaikan.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Mengganti daftar ignore bawaan dengan direktori hasil build dan file generated.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
