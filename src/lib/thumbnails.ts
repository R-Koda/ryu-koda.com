import thumbnails from '../data/article-thumbnails.json';
export function thumbnailAttrs(slug:string,fallback:string,sizes='(max-width: 600px) 100vw, 360px') {
 const image=thumbnails[slug as keyof typeof thumbnails];
 if(!image)return {src:fallback};
 return {src:image.variants[1].src,srcset:image.variants.map(v=>`${v.src} ${v.width}w`).join(', '),sizes};
}
