// @ts-check

import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["**/node_modules/", "**/dist/", ".git/"],
    },
    tseslint.configs.recommendedTypeChecked,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ["**/*.{js,ts}"],
    },
);
