import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

import pkg from './package.json'

export default  {
  input: 'src/index.ts',
  output: {file: 'es/index.js', format: 'es'},
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
    }),
    json(),
    babel()
  ]
}
