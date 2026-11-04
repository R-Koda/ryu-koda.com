export const sampleSlugs = new Set(['first-post', 'second-post', 'third-post', 'markdown-style-guide', 'using-mdx']);
export function shouldIndex(path) {
  const normalized = path.endsWith('/') || path.endsWith('.html') ? path : `${path}/`;
  return !['/404.html', '/sns/', '/diary/', '/contact/', '/youtube/'].includes(normalized)
    && ![...sampleSlugs].some(slug => normalized === `/blog/${slug}/`);
}
