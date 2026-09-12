import { copyFile, mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outputDirectory = join(process.cwd(), 'dist', 'client');
const repositoryPath = '/zohra';
const staticRoutes = ['about', 'finds', 'request', 'reviews', 'admin', 'admin/login'];

await rename(join(outputDirectory, 'zohra', '_next'), join(outputDirectory, '_next'));
await rm(join(outputDirectory, 'zohra'), { recursive: true, force: true });

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(file);
    return entry.name.endsWith('.html') ? [file] : [];
  }));
  return nested.flat();
}

for (const file of await htmlFiles(outputDirectory)) {
  let html = await readFile(file, 'utf8');
  for (const route of staticRoutes) {
    const escapedRoute = route.replace('/', '\\/');
    html = html.replace(new RegExp(`(href|src)="/${escapedRoute}(?=[?/\"#])`, 'g'), `$1="${repositoryPath}/${route}/`);
  }
  html = html.replace(/(href|src)="\/(?!zohra\/)/g, `$1="${repositoryPath}/`);
  await writeFile(file, html);
}

for (const route of staticRoutes) {
  const source = join(outputDirectory, `${route}.html`);
  const destination = join(outputDirectory, route);
  await mkdir(destination, { recursive: true });
  await copyFile(source, join(destination, 'index.html'));
}
