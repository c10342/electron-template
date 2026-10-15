import eslintConfig from "@electron-toolkit/eslint-config";
import tseslint from "@electron-toolkit/eslint-config-ts";
import pluginVue from "eslint-plugin-vue";
import { withVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default withVueTs(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/out/**",
      "**/*.log*",
      "src/renderer/auto-imports.d.ts",
      "src/renderer/components.d.ts"
    ]
  },
  eslintConfig,
  tseslint.configs.base,
  pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,
  {
    rules: {
      "vue/require-default-prop": "off",
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  skipFormatting
);
