import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-minify'
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

import pkg from './package.json'

const overrideTsConfig = {
  compilerOptions: {
    declaration: true
  }
};

export default [
  //es
  {
    input: 'src/index.ts',
    output: {file: 'es/index.js', format: 'es'},
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      typescript({
        tsconfig: "tsconfig.json",
        tsconfigOverride: overrideTsConfig
      }),
      json(),
      babel()
    ]
  },
  //umd
  {
    input: 'src/index.ts',
    output: {file: 'umd/mdel.js', format: 'umd', name: 'mdel', exports: 'named'},
    plugins: [
      typescript({
        tsconfig: "tsconfig.json"
      }),
      json(),
      babel({
        exclude: 'node_modules/**'
      }),
      minify({umd: './umd/mdel.min.js'}),
    ]
  }
]
