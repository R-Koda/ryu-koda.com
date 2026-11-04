import { getCollection } from "astro:content";
import { sampleSlugs as samples } from "./seo.mjs";
export async function journalPosts() {
  return (await getCollection("blog"))
    .filter((p) => !samples.has(p.id))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
