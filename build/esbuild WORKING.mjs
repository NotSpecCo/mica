import esbuild from 'esbuild';
import esbuildSvelte from 'esbuild-svelte';
import sveltePreprocess from 'svelte-preprocess';
import http from 'http';
import babel from 'esbuild-plugin-babel';

console.log('### start');

esbuild
  .build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: './dist/build/main.js',
    target: 'es6',
    format: 'iife',
    // watch: {
    //   onRebuild(error, result) {
    //     if (error) console.error('watch build failed:', error);
    //     else console.log('watch build succeeded:', result);
    //   },
    // },
    plugins: [
      esbuildSvelte({
        preprocess: sveltePreprocess({
          sourceMap: false,
          typescript: {
            // tsconfigFile: './tsconfig.json',
            // compilerOptions: {
            //   target: 'es6',
            //   module: 'es6',
            // },
          },
          babel: {
            include: ['*.js'],
            exclude: ['node_modules/@babel/**', '*.ts'],
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    ie: '11',
                  },
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
          },
        }),
      }),
      babel({
        filter: /.*(js|svelte|html)$/,
        config: {
          // extensions: ['.js', '.ts', '.mjs', '.html', '.svelte'],
          // runtimeHelpers: true,
          exclude: ['node_modules/@babel/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  ie: '11',
                },
              },
            ],
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-transform-for-of',
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: true,
              },
            ],
          ],
        },
      }),
    ],
  })
  .catch((err) => {
    console.log('err', err);
    process.exit(1);
  });
// esbuild
//   .serve(
//     {
//       servedir: 'dist',
//       // host: '127.0.0.0',
//       port: 5557,
//     },
//     {
//       entryPoints: ['src/main.ts'],
//       bundle: true,
//       outfile: './dist/build/main.js',
//       target: 'firefox55',
//       // format: 'iife',
//       // watch: {
//       //   onRebuild(error, result) {
//       //     if (error) console.error('watch build failed:', error);
//       //     else console.log('watch build succeeded:', result);
//       //   },
//       // },
//       plugins: [
//         esbuildSvelte({
//           preprocess: sveltePreprocess({
//             sourceMap: false,
//             typescript: {
//               compilerOptions: {
//                 target: 'ES2020',
//                 module: 'ES2020',
//               },
//             },
//           }),
//         }),
//       ],
//     }
//   )
//   .then((result) => {
//     // The result tells us where esbuild's local server is
//     const { host, port } = result;
//     console.log('#######', host, port);

//     // Then start a proxy server on port 3000
//     http
//       .createServer((req, res) => {
//         const options = {
//           hostname: host,
//           port: port,
//           path: req.url,
//           method: req.method,
//           headers: req.headers,
//         };

//         // Forward each incoming request to esbuild
//         const proxyReq = http.request(options, (proxyRes) => {
//           // If esbuild returns "not found", send a custom 404 page
//           if (proxyRes.statusCode === 404) {
//             res.writeHead(404, { 'Content-Type': 'text/html' });
//             res.end('<h1>A custom 404 page</h1>');
//             return;
//           }

//           // Otherwise, forward the response from esbuild to the client
//           res.writeHead(proxyRes.statusCode, proxyRes.headers);
//           proxyRes.pipe(res, { end: true });
//         });

//         // Forward the body of the request to esbuild
//         req.pipe(proxyReq, { end: true });
//       })
//       .listen(3000);
//   })
//   .catch((err) => {
//     console.log('err', err);
//     process.exit(1);
//   });
