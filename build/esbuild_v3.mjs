import esbuild from 'esbuild';
import esbuildSvelte from 'esbuild-svelte';
import sveltePreprocess from 'svelte-preprocess';
import http from 'http';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;

console.time('build');

await esbuild
  .build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    minify: false,
    sourcemap: false,
    outfile: './dist/build/main.js',
    target: 'firefox84',
    format: 'esm',
    watch: argv.watch
      ? {
          onRebuild(error, result) {
            if (error) console.error('watch build failed:', error);
            else console.log('watch build succeeded:', result);
          },
        }
      : false,
    plugins: [
      esbuildSvelte({
        preprocess: sveltePreprocess({
          sourceMap: false,
          typescript: {
            compilerOptions: {
              target: 'es2020',
              module: 'es2020',
            },
          },
        }),
      }),
    ],
  })
  .then(() => console.timeEnd('build'))
  .catch((err) => {
    console.log('err', err);
    process.exit(1);
  });

if (!argv.serve) process.exit(0);

esbuild
  .serve(
    {
      servedir: 'dist',
      host: '0.0.0.0',
      port: 5555,
    },
    {
      entryPoints: ['src/main.ts'],
      bundle: true,
      minify: false,
      sourcemap: false,
      outfile: './dist/build/main.js',
      target: 'firefox84',
      format: 'esm',
      watch: argv.watch
        ? {
            onRebuild(error, result) {
              if (error) console.error('watch build failed:', error);
              else console.log('watch build succeeded:', result);
            },
          }
        : false,
      plugins: [
        esbuildSvelte({
          preprocess: sveltePreprocess({
            sourceMap: false,
            typescript: {
              compilerOptions: {
                target: 'es2020',
                module: 'es2020',
              },
            },
          }),
        }),
      ],
    }
  )
  .then((result) => {
    // The result tells us where esbuild's local server is
    const { host, port } = result;

    // Then start a proxy server on port 3000
    http
      .createServer((req, res) => {
        const options = {
          hostname: host,
          port: port,
          path: req.url,
          method: req.method,
          headers: req.headers,
        };

        // Forward each incoming request to esbuild
        const proxyReq = http.request(options, (proxyRes) => {
          // If esbuild returns "not found", send a custom 404 page
          if (proxyRes.statusCode === 404) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>A custom 404 page</h1>');
            return;
          }

          // Otherwise, forward the response from esbuild to the client
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res, { end: true });
        });

        // Forward the body of the request to esbuild
        req.pipe(proxyReq, { end: true });
      })
      .listen(port);
    console.log(`Serving app at http://${host}:${port}`);
  })
  .catch((err) => {
    console.log('err', err);
    process.exit(1);
  });
