import { createServer } from 'node:http';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const base = '/type_instructor/';
const legacyWorker = await readFile(
  new URL('../fixtures/legacy-service-worker.js', import.meta.url),
);
const legacyHTML =
  '<!doctype html><h1>Legacy build</h1><script>navigator.serviceWorker.register("service-worker.js")</script>';
const contentTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

export async function serveOfflineBuilds() {
  const temporary = await mkdtemp(join(tmpdir(), 'type-instructor-updates-'));
  const current = resolve('dist');
  const next = join(temporary, 'next');
  const broken = join(temporary, 'broken');
  let phase = 'legacy';
  let server;

  try {
    for (const [directory, marker] of [
      [next, 'next'],
      [broken, 'broken'],
    ]) {
      await cp(current, directory, { recursive: true });
      const html = await readFile(join(directory, 'index.html'), 'utf8');
      await writeFile(
        join(directory, 'index.html'),
        html.replace('<html ', `<html data-build="${marker}" `),
      );
      if (directory === broken) {
        await cp(join(current, 'cover-256x256.png'), join(directory, 'missing-precache-asset.png'));
      }
      await execute(process.execPath, ['scripts/build-sw.js', directory]);
    }
    // This file is in the generated manifest, but unavailable during installation.
    await rm(join(broken, 'missing-precache-asset.png'));

    server = createServer(async (request, response) => {
      try {
        const url = new URL(request.url, 'http://localhost');
        if (!url.pathname.startsWith(base)) {
          response.writeHead(404).end();
          return;
        }
        const filename = decodeURIComponent(url.pathname.slice(base.length)) || 'index.html';
        const directory = phase === 'next' ? next : phase === 'broken' ? broken : current;
        const path = resolve(directory, filename);
        if (!path.startsWith(`${directory}${sep}`)) {
          response.writeHead(404).end();
          return;
        }
        const contents =
          phase === 'legacy' && filename === 'service-worker.js'
            ? legacyWorker
            : phase === 'legacy' && filename === 'index.html'
              ? legacyHTML
              : await readFile(path);
        response.writeHead(200, {
          'Content-Type': contentTypes[extname(filename)] || 'application/octet-stream',
          'Cache-Control': 'no-store',
        });
        response.end(contents);
      } catch (error) {
        response.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
      }
    });
    await new Promise((ready, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', ready);
    });

    return {
      url: `http://127.0.0.1:${server.address().port}${base}`,
      select: (value) => {
        phase = value;
      },
      close: async () => {
        const closed = new Promise((done) => server.close(done));
        server.closeAllConnections();
        await closed;
        await rm(temporary, { recursive: true, force: true });
      },
    };
  } catch (error) {
    server?.close();
    server?.closeAllConnections();
    await rm(temporary, { recursive: true, force: true });
    throw error;
  }
}
