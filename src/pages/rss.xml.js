import { experiments } from '../data/experiments';
import { guides } from '../data/experiment-guides';
import { journalPosts } from '../lib/posts';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = await journalPosts();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: [...posts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`,
		})), ...experiments.map(e => ({title: guides[e.slug].seoTitle, description: guides[e.slug].description, pubDate: new Date(e.pubDate), link: `/playground/${e.slug}/`}))].sort((a,b) => new Date(b.pubDate) - new Date(a.pubDate)),
	});
}
