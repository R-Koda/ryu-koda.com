import sharp from 'sharp';
import fs from 'node:fs/promises';
const entries = [
  {slug:'making-everyday-interesting',color:'#e8dff5',label:'つくる楽しさ',lines:['つくってみると、','日常はもう少し','おもしろい。']},
  {slug:'joy-of-choosing-gadgets',color:'#dcebdc',label:'道具を選ぶ楽しさ',lines:['ガジェットは、','買う前に吟味するのが','いちばんおもしろい。']},
  {slug:'a-place-for-curiosity',color:'#ffedac',label:'この場所のこと',lines:['好奇心の','置き場所としての、','りゅうのらぼ。']},
];
for (const e of entries) {
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#fffdf8"/><rect x="22" y="22" width="1156" height="586" rx="20" fill="white" stroke="#34434d" stroke-width="3"/><rect x="66" y="62" width="360" height="54" rx="8" fill="${e.color}"/><g font-family="Hiragino Sans, sans-serif" fill="#34434d"><text x="86" y="98" font-size="26">${e.label}</text>${e.lines.map((line,i)=>`<text x="72" y="${220+i*91}" font-size="65" font-weight="600">${line}</text>`).join('')}<path d="M72 439 H1080" stroke="${e.color}" stroke-width="12"/><text x="72" y="554" font-size="30" letter-spacing="4">りゅうのらぼ</text><text x="930" y="554" font-size="22">ryu-koda.com</text></g></svg>`;
  await fs.mkdir(`public/articles/${e.slug}`,{recursive:true});
  await sharp(Buffer.from(svg)).webp({quality:90}).toFile(`public/articles/${e.slug}/cover.webp`);
}
