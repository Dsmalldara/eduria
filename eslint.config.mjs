import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**", 
      "out/**",
      "dist/**",
      "build/**",
      // Prisma generated files - NEVER lint these
      "lib/generated/**",
      "prisma/generated/**",
      "**/generated/**",
      "**/*.generated.*",
      // More specific Prisma patterns
      "**/runtime/**",
      "**/library.d.ts",
      "**/@prisma/**",
      "**/prisma/client/**",
      // Any file with 'prisma' in the path that's generated
      "**/prisma/**/runtime/**",
      "**/prisma/**/library.d.ts"
    ]
  },
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      // Add these rules to handle Prisma-generated code
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off"
    }
  }
];

export default eslintConfig;