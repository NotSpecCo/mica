import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import del from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import esbuild from 'rollup-plugin-esbuild';

const production = !process.env.ROLLUP_WATCH;
const kaios2 = true;

console.log(`Building for KaiOS v${kaios2 ? '2.x' : '3.x'}`);

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: !production,
    format: kaios2 ? 'iife' : 'es',
    name: 'app',
    dir: 'dist/build',
    inlineDynamicImports: kaios2,
  },
  context: 'window',
  plugins: [
    production && del({ targets: 'dist' }),
    copy({
      targets: [
        { src: 'public/*', dest: 'dist' },
        {
          src: 'public/index.html',
          dest: 'dist',
          transform: (contents, filename) =>
            contents
              .toString()
              .replace(
                `<script src="/build/main.js" type="module"></script>`,
                kaios2
                  ? "<script defer src='/build/main.js'></script>"
                  : "<script defer src='/build/main.js' type='module'></script>"
              ),
        },
      ],
    }),
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // esbuild({
    //   target: 'ES2015',
    //   loaders: {
    //     '.js': 'js',
    //     '.ts': 'ts',
    //     '.json': 'json',
    //   },
    // }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'main.css' }),

    babel({
      extensions: ['.js', '.ts', '.mjs', '.html', '.svelte'],
      runtimeHelpers: true,
      exclude: ['node_modules/@babel/**'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { firefox: '48' },
          },
        ],
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        [
          '@babel/plugin-transform-runtime',
          {
            useESModules: true,
          },
        ],
      ],
    }),

    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': !production ? "'development'" : "'production'",
    }),

    json(),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('dist'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    // production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
