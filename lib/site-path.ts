declare const __GITHUB_PAGES__: boolean;

const githubPages = typeof __GITHUB_PAGES__ !== 'undefined' && __GITHUB_PAGES__;

export function siteRoute(path: string) {
  if (!githubPages) return path;

  const [, pathname = '/', suffix = ''] = path.match(/^([^?#]*)(.*)$/) ?? [];
  const route = pathname.replace(/^\/+|\/+$/g, '');
  return `/zohra/${route ? `${route}/` : ''}${suffix}`;
}

export function siteAsset(path: string) {
  if (!githubPages || !path.startsWith('/')) return path;
  return `/zohra${path}`;
}
