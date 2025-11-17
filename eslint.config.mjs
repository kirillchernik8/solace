import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import eslintNextPlugin from '@next/eslint-plugin-next'

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    plugins: {
      next: eslintNextPlugin,
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
  ]),
])

export default eslintConfig
