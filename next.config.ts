const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default {
  output: isGitHubPages ? 'export' : undefined,
  assetPrefix: isGitHubPages ? '/zohra' : '',
  trailingSlash: false,
};
