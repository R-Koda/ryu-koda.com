import {readFile,writeFile,mkdir,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const manifest={};let originalBytes=0,smallBytes=0;
await mkdir('public/article-thumbnails',{recursive:true});
for(const name of await readdir('src/content/blog')){
 const source=await readFile(`src/content/blog/${name}`,'utf8');
 const match=source.match(/^heroImage:\s*["']([^"']+)["']/m);
 if(!match || !match[1].includes('/public/articles/'))continue;
 const file=path.resolve('src/content/blog',match[1]);const input=await readFile(file);
 const slug=name.replace(/\.(md|mdx)$/,'');const variants=[];
 for(const width of [360,640]){
  const bytes=await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:78}).toBuffer();
  const hash=createHash('sha256').update(bytes).digest('hex').slice(0,10);
  const dest=`article-thumbnails/${slug}-${width}-${hash}.webp`;await writeFile(`public/${dest}`,bytes);variants.push({src:`/${dest}`,width,bytes:bytes.length});
 }
 const meta=await sharp(input).metadata();manifest[slug]={variants,width:meta.width,height:meta.height,originalBytes:(await stat(file)).size};
 originalBytes+=input.length;smallBytes+=variants[0].bytes;
}
await writeFile('src/data/article-thumbnails.json',JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({articles:Object.keys(manifest).length,originalBytes,thumbnail360Bytes:smallBytes,reductionPercent:Math.round((1-smallBytes/originalBytes)*100)}));
