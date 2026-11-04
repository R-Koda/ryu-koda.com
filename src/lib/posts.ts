import { getCollection } from "astro:content";
const samples = new Set([
  "first-post",
  "second-post",
  "third-post",
  "markdown-style-guide",
  "using-mdx",
]);
export async function journalPosts() {
  return (await getCollection("blog"))
    .filter((p) => !samples.has(p.id))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
