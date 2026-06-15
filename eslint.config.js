import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.strict,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react-hooks/rules-of-hooks": "error", // Ensures hooks are called correctly
      "react-hooks/exhaustive-deps": "error", // Enforces correct dependency arrays

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // Ignore unused args starting with _
          caughtErrors: "none", // Ignore unused errors in catch blocks
        },
      ],
      "@typescript-eslint/no-explicit-any": "error", // Disallow `any`
      "@typescript-eslint/no-non-null-assertion": "error", // Disallow `!` non-null assertions

      "no-console": "error",
      "no-empty": "off",

      "import/order": "off",
    },
  }
);
