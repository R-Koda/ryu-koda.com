export const snippets: Record<string,string> = {
 magnets: `// 磁石への方向に力を加え、摩擦で減速\nconst distance = Math.hypot(dx, dy);\nconst force = polarity * strength / Math.max(1600, distance ** 2);\nvx += dx / distance * force * dt;\nvy += dy / distance * force * dt;\nvx *= Math.exp(-3 * dt);`,
 chain: `// 前の動きが終わってから次へ\nawait ball.animate(path, timing).finished;\nfor (const domino of dominoes) {\n  await domino.animate(fall, timing).finished;\n}\nawait drawer.animate(open, timing).finished;`,
 buttons: `// 押下中は沈む。離すと素材ごとの形で戻る\nbutton.style.transform = pressedShape;\nbutton.animate([\n  { transform: pressedShape },\n  { transform: overshootShape },\n  { transform: 'none' }\n], { duration, easing: 'ease-out' });`,
 cables: `// 入力と出力の正しい組だけを接続\nconst pair = [firstPort, secondPort].sort().join(':');\nif (validPairs.has(pair)) {\n  connected.add(pair);\n  drawCable(firstPort, secondPort);\n}\nmonitorOn = videoConnected && powerConnected;`,
 study: `// 光源が右へ動くと、影は左へ伸びる\nshadow.setAttribute('cx', 350 - lightX * 0.65);\nshadow.setAttribute('rx', 65 + Math.abs(lightX) * 0.3);\nbeam.setAttribute('opacity', lampOn ? 0.26 : 0);`,
 letters: `// 重力で落下。積み木の重なりを小さい軸から解消\nvy += gravity * dt;\nx += vx * dt;\ny += vy * dt;\nif (overlapX > 0 && overlapY > 0) {\n  resolveAlongSmallestAxis(a, b);\n}\n// 床では跳ね返り、少しずつ止まる`,
};
