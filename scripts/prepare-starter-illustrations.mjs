import fs from 'node:fs/promises';
import sharp from 'sharp';
const {assets} = JSON.parse(await fs.readFile('editorial/publications/starter-illustration-prompts.json','utf8'));
for(const asset of assets){
  await sharp(asset.source).resize(1200,630,{fit:'cover',position:'centre'}).webp({quality:85}).toFile(asset.output);
  console.log(asset.output, (await fs.stat(asset.output)).size);
}
