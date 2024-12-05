import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'

import pkg from './package.json'

const external = ['@zeainc/zea-engine']

const plugins = [
  json(),
  resolve({
    browser: true,
    dedupe: ['@zeainc'],
  }), // so Rollup can find `ms`
  commonjs(), // so Rollup can convert `ms` to an ES module
  typescript(), // so Rollup can convert TypeScript to JavaScript
]
const isProduction = !process.env.ROLLUP_WATCH

if (isProduction) {
  plugins.push(terser())
}

const sourcemap = true

export default [
  // Browser-friendly UMD build.
  {
    input: 'src/index.ts',
    external,
    output: {
      name: 'zeaUx',
      file: pkg.browser,
      format: 'umd',
      sourcemap,
      globals: {
        '@zeainc/zea-engine': 'zeaEngine',
      },
    },
    plugins,
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',
    external,
    plugins,
    output: [
      { file: pkg.main, format: 'cjs', sourcemap },
      { file: pkg.module, format: 'es', sourcemap },
    ],
  },

  {
    input: 'src/index.ts',
    output: [{ file: pkg.types, format: 'es' }],
    plugins: [dts()],
  },
]
