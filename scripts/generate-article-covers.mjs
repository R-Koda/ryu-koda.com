import sharp from 'sharp';
import fs from 'node:fs/promises';
const specs = [
 {slug:'mac-finder-batch-rename', color:'#ffedac', kicker:'Mac / Finder', lines:['ファイル名、','まとめて変更。'], sub:'追加アプリなしで、やってみた。', label:'IMG_001 → desk_001', image:'finder-after-detail.jpg'},
 {slug:'usb-c-cable-comparison', color:'#dcebdc', kicker:'USB-C / 公式仕様を比較', lines:['同じ形でも、','できることは違う。'], sub:'充電・転送・映像を見比べる。', label:'3製品の仕様比較 / 実機未検証', image:'usb-spec.jpg'},
 {slug:'css-popout-drawer', color:'#e8dff5', kicker:'HTML + CSS', lines:['ひきだしから、','ひょこっと。'], sub:'自分のサイトにも、小さな遊びを。', label:'動くデモ + 全コード付き', image:'drawer-blog-detail.jpg'},
];
for(const s of specs){
 const svg=`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#fffdf8"/><rect x="22" y="22" width="1156" height="586" rx="20" fill="white" stroke="#34434d" stroke-width="3"/><path d="M55 90 L470 85" stroke="${s.color}" stroke-width="40"/><g fill="#34434d" font-family="Hiragino Sans, sans-serif"><text x="58" y="99" font-size="23">${s.kicker}</text><text x="58" y="222" font-size="48" font-weight="700">${s.lines[0]}</text><text x="58" y="296" font-size="48" font-weight="700">${s.lines[1]}</text><text x="60" y="364" font-size="24">${s.sub}</text><rect x="55" y="422" width="485" height="65" rx="8" fill="${s.color}"/><text x="75" y="464" font-size="23">${s.label}</text><text x="60" y="565" font-size="29" letter-spacing="4">りゅうのらぼ</text><text x="945" y="565" font-size="19">ryu-koda.com</text></g><rect x="581" y="69" width="557" height="444" rx="12" fill="${s.color}"/><rect x="573" y="61" width="557" height="444" rx="12" fill="#f7f9fb" stroke="#34434d" stroke-width="2"/></svg>`;
 const shot=await sharp(`public/articles/${s.slug}/${s.image}`).resize(525,412,{fit:'contain',background:'#f7f9fb'}).toBuffer();
 await sharp(Buffer.from(svg)).composite([{input:shot,left:589,top:77}]).webp({quality:90}).toFile(`public/articles/${s.slug}/cover.webp`);
}
