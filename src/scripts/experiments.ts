const NS = 'http://www.w3.org/2000/svg';
const snippets: Record<string,string> = {
 magnets: `// 磁石への方向に力を加え、摩擦で減速\nconst distance = Math.hypot(dx, dy);\nconst force = polarity * strength / Math.max(1600, distance ** 2);\nvx += dx / distance * force * dt;\nvy += dy / distance * force * dt;\nvx *= Math.exp(-3 * dt);`,
 chain: `// 前の動きが終わってから次へ\nawait ball.animate(path, timing).finished;\nfor (const domino of dominoes) {\n  await domino.animate(fall, timing).finished;\n}\nawait drawer.animate(open, timing).finished;`,
 buttons: `// 押下中は沈む。離すと素材ごとの形で戻る\nbutton.style.transform = pressedShape;\nbutton.animate([\n  { transform: pressedShape },\n  { transform: overshootShape },\n  { transform: 'none' }\n], { duration, easing: 'ease-out' });`,
 cables: `// 入力と出力の正しい組だけを接続\nconst pair = [firstPort, secondPort].sort().join(':');\nif (validPairs.has(pair)) {\n  connected.add(pair);\n  drawCable(firstPort, secondPort);\n}\nmonitorOn = videoConnected && powerConnected;`,
 study: `// 光源が右へ動くと、影は左へ伸びる\nshadow.setAttribute('cx', 350 - lightX * 0.65);\nshadow.setAttribute('rx', 65 + Math.abs(lightX) * 0.3);\nbeam.setAttribute('opacity', lampOn ? 0.26 : 0);`,
 letters: `// 重力で落下。積み木の重なりを小さい軸から解消\nvy += gravity * dt;\nx += vx * dt;\ny += vy * dt;\nif (overlapX > 0 && overlapY > 0) {\n  resolveAlongSmallestAxis(a, b);\n}\n// 床では跳ね返り、少しずつ止まる`,
};
document.querySelectorAll<HTMLElement>('[data-experiment]').forEach(root => {
 const kind = root.dataset.experiment!;
 const q = <T extends Element = HTMLElement>(s:string) => root.querySelector<T>(s)!;
 const status = (text:string) => q('[data-status]').textContent = text;
 const code = q('[data-code]'); code.textContent = snippets[kind];
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const svg = root.querySelector('svg');
 const make = (name:string, attrs:Record<string,string|number>, parent:Element) => {const el=document.createElementNS(NS,name);for(const [key,value] of Object.entries(attrs)) el.setAttribute(key,String(value));parent.append(el);return el;};
 const point = (e:PointerEvent) => {const matrix=svg?.getScreenCTM();return matrix ? new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse()):new DOMPoint();};
 const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
 // Frames run only while this experiment is on screen and the document is visible.
 const loop=(step:(dt:number)=>void)=>{
  let frame=0,last=0,visible=false;
  const tick=(now:number)=>{const dt=Math.min((now-last)/1000||1/60,.025);last=now;step(dt);frame=requestAnimationFrame(tick);};
  const sync=()=>{cancelAnimationFrame(frame);frame=0;last=0;if(visible&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick);};
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();}).observe(root);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 };
 if(kind==='magnets') {
  let mx=320,my=160,held:number|null=null;
  const magnet=q<SVGGElement>('[data-magnet]');
  const particles=Array.from({length:9},(_,i)=>{const el=make('g',{},q('[data-particles]'));make('rect',{x:-19,y:-14,width:38,height:28,rx:6,fill:['#dce7f5','#fff0bc','#e8dff5'][i%3],stroke:'#354550','stroke-width':1.5},el);make('path',{d:'M-9-4h18M-9 3h12',stroke:'#80919b','stroke-width':2},el);return {x:75+(i%3)*225,y:65+Math.floor(i/3)*105,vx:0,vy:0,el};});
  const draw=()=>{magnet.setAttribute('transform',`translate(${mx} ${my})`);particles.forEach(p=>p.el.setAttribute('transform',`translate(${p.x} ${p.y})`));};
  const step=(dt:number)=>{
   const strength=Number(q<HTMLInputElement>('[data-strength]').value)*17000;
   const polarity=Number(q<HTMLInputElement>('input[name=polarity]:checked').value);
   particles.forEach(p=>{const dx=mx-p.x,dy=my-p.y,d=Math.hypot(dx,dy)||1;const f=polarity*strength/Math.max(1600,d*d);p.vx+=(dx/d*f)*dt;p.vy+=(dy/d*f)*dt;p.vx*=Math.exp(-3*dt);p.vy*=Math.exp(-3*dt);p.x+=p.vx*dt;p.y+=p.vy*dt;
    const nd=Math.hypot(p.x-mx,p.y-my);if(nd<64){const nx=(p.x-mx)/(nd||1),ny=(p.y-my)/(nd||1);p.x=mx+nx*64;p.y=my+ny*64;p.vx*=.4;p.vy*=.4;}
    p.x=clamp(p.x,23,617);p.y=clamp(p.y,22,314);
   });draw();
  };
  const update=()=>{draw();if(reduced.matches){for(let i=0;i<100;i++)step(.025);} };
  magnet.addEventListener('pointerdown',(e:PointerEvent)=>{if(held!==null)return;held=e.pointerId;magnet.setPointerCapture(held);});
  magnet.addEventListener('pointermove',(e:PointerEvent)=>{if(held!==e.pointerId)return;const p=point(e);mx=clamp(p.x,45,595);my=clamp(p.y,45,285);update();});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])magnet.addEventListener(event,()=>{held=null;});
  magnet.addEventListener('keydown',(e:KeyboardEvent)=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();mx=clamp(mx+(e.key==='ArrowRight'?20:e.key==='ArrowLeft'?-20:0),45,595);my=clamp(my+(e.key==='ArrowDown'?20:e.key==='ArrowUp'?-20:0),45,285);update();});
  q('[data-reset]').addEventListener('click',()=>{mx=320;my=160;particles.forEach((p,i)=>Object.assign(p,{x:75+i%3*225,y:65+Math.floor(i/3)*105,vx:0,vy:0}));draw();status('小物を並べ直しました。');});
  root.querySelectorAll('input').forEach(input=>input.addEventListener('input',()=>{update();status(q<HTMLInputElement>('input[name=polarity]:checked').value==='1'?'引きよせています。':'反発しています。');}));draw();loop(step);
 }
 if(kind==='chain') {
  let generation=0;const run=q<HTMLButtonElement>('[data-run]');let animations:Animation[]=[];
  const reset=()=>{generation++;animations.forEach(a=>a.cancel());animations=[];run.disabled=false;status('準備できました。');};
  q('[data-reset]').addEventListener('click',reset);
  run.addEventListener('click',async()=>{
   reset();const token=generation;run.disabled=true;
   const duration=60000/Number(q<HTMLInputElement>('[data-speed]').value);
   const animate=async(el:Element,keys:Keyframe[],factor=1)=>{if(token!==generation)throw new Error('cancelled');const a=el.animate(keys,{duration:reduced.matches?1:duration*factor,fill:'forwards',easing:'ease-in'});animations.push(a);await a.finished;if(token!==generation)throw new Error('cancelled');};
   try {
    status('玉が転がります。');await animate(q('[data-ball]'),[{transform:'translate(0,0) rotate(0)'},{transform:'translate(210px,88px) rotate(270deg)'}],1.5);
    status('ドミノが倒れます。');for(const domino of root.querySelectorAll('[data-domino]'))await animate(domino,[{transform:'rotate(0)'},{transform:'rotate(64deg)'}],.24);
    status('引き出しが開きます。');await animate(q('[data-chain-drawer]'),[{transform:'translateY(0)'},{transform:'translateY(43px)'}],.65);
    await animate(q('[data-hello]'),[{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],.5);status('こんにちは！ 連鎖がつながりました。');
   } catch { /* Reset cancels the active sequence. */ } finally {if(token===generation)run.disabled=false;}
  });
 }
 if(kind==='buttons') {
  root.querySelectorAll<HTMLButtonElement>('[data-material]').forEach(button=>{
   let animation:Animation|undefined;let pressed=false;let shape='none';
   const down=()=>{if(pressed)return;pressed=true;animation?.cancel();const depth=Number(q<HTMLInputElement>('[data-depth]').value);const type=button.dataset.material;shape=reduced.matches?'none':`translateY(${depth}px) scale(${type==='jelly'?1.12:type==='rubber'?1.05:1},${type==='jelly'?.82:type==='rubber'?.9:1})`;button.style.transform=shape;button.style.filter='brightness(.96)';status(`${button.textContent?.replace('↓','').trim()}を押しています。`);};
   const up=()=>{if(!pressed)return;pressed=false;button.style.transform='none';button.style.filter='';if(!reduced.matches){animation=button.animate([{transform:shape},{transform:button.dataset.material==='jelly'?'translateY(-5px) scale(.94,1.1)':'translateY(-2px)'},{transform:'none'}],{duration:Number(q<HTMLInputElement>('[data-duration]').value),easing:'cubic-bezier(.2,.7,.3,1)'});}status('離しました。押し心地をくらべてみてください。');};
   button.addEventListener('pointerdown',e=>{if(e.button!==0)return;button.setPointerCapture(e.pointerId);down();});['pointerup','pointercancel','lostpointercapture','blur'].forEach(event=>button.addEventListener(event,up));
   button.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();down();}});button.addEventListener('keyup',up);
  });
 }
 if(kind==='cables') {
  let selected:string|null=null;const connected=new Set<string>();
  const points:Record<string,[number,number]>={'pc-video':[205,120],monitor:[425,105],'pc-power':[205,159],charger:[455,273]};
  const valid=new Set(['monitor:pc-video','charger:pc-power']);
  const draw=()=>{
   q('[data-wires]').replaceChildren();connected.forEach(pair=>{const [a,b]=pair.split(':'),[ax,ay]=points[a],[bx,by]=points[b];make('path',{d:`M${ax} ${ay} C${ax-80} ${ay+70},${bx+80} ${by+70},${bx} ${by}`,fill:'none',stroke:pair.includes('monitor')?'#6f8da3':'#a38460','stroke-width':6,'stroke-linecap':'round'},q('[data-wires]'));});
   const power=connected.has('charger:pc-power'),on=power&&connected.has('monitor:pc-video');q('[data-power]').setAttribute('fill',power?'#6caa7a':'#929a9b');q('[data-monitor]').setAttribute('fill',on?'#8db5a6':'#44515a');q('[data-screen-text]').textContent=on?'Hello, lab!':'OFF';
   root.querySelectorAll<HTMLButtonElement>('[data-port]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.port===selected)));
  };
  root.querySelectorAll<HTMLButtonElement>('[data-port]').forEach(button=>button.addEventListener('click',()=>{const port=button.dataset.port!;if(!selected){selected=port;status('次に、接続先の端子を選んでください。');}else if(selected===port){selected=null;status('選択を解除しました。');}else{const pair=[selected,port].sort().join(':');if(valid.has(pair)){connected.add(pair);status(connected.size===2?'接続完了！ 画面と電源が入りました。':'つながりました。残りのケーブルも接続しましょう。');}else status('その組み合わせではつながりません。映像同士、電源同士を選びます。');selected=null;}draw();}));
  Object.entries(points).forEach(([port,[cx,cy]])=>{
   const socket=make('circle',{cx,cy,r:12,fill:'#fff',stroke:'#526c86','stroke-width':3,'data-socket':port},q('[data-sockets]'));
   let pointer:number|null=null,preview:SVGElement|null=null;
   socket.addEventListener('pointerdown',(e:PointerEvent)=>{if(pointer!==null)return;pointer=e.pointerId;socket.setPointerCapture(pointer);preview=make('path',{fill:'none',stroke:'#95a8b6','stroke-width':5,'stroke-dasharray':'5 5','pointer-events':'none'},q('[data-wires]'));});
   socket.addEventListener('pointermove',(e:PointerEvent)=>{if(pointer!==e.pointerId||!preview)return;const p=point(e);preview.setAttribute('d',`M${cx} ${cy} Q${cx} ${p.y} ${p.x} ${p.y}`);});
   socket.addEventListener('pointerup',(e:PointerEvent)=>{if(pointer!==e.pointerId)return;const p=point(e);const target=Object.entries(points).find(([id,[x,y]])=>id!==port&&Math.hypot(p.x-x,p.y-y)<30);pointer=null;preview?.remove();preview=null;socket.releasePointerCapture(e.pointerId);if(target){const pair=[port,target[0]].sort().join(':');if(valid.has(pair)){connected.add(pair);status(connected.size===2?'接続完了！ 画面と電源が入りました。':'カチッ。端子につながりました。');}else status('端子の種類が違います。映像同士、電源同士をつなぎます。');}else status('ケーブルを接続先の丸い端子まで動かしてください。');selected=null;draw();});
   ['pointercancel','lostpointercapture'].forEach(event=>socket.addEventListener(event,()=>{pointer=null;preview?.remove();preview=null;}));
  });
  q('[data-reset]').addEventListener('click',()=>{connected.clear();selected=null;draw();status('ケーブルを外しました。');});draw();
 }
 if(kind==='study') {
  let night=false,lamp=true;
  const draw=()=>{const x=Number(q<HTMLInputElement>('[data-light-x]').value),opening=Number(q<HTMLInputElement>('[data-blinds-open]').value);q('[data-wall]').setAttribute('fill',night?'#293a4c':'#f5f1e7');q('[data-sky]').setAttribute('fill',night?'#425d7b':'#b9dbea');q('[data-sun]').setAttribute('fill',night?'#f5efd3':'#ffe5a0');q('[data-sun]').setAttribute('r',night?'15':'22');q('[data-blinds]').setAttribute('transform',`translate(0 ${32*opening/100}) scale(1 ${1-opening/100*.92})`);q('[data-lamp]').setAttribute('transform',`translate(${x} 0)`);q('[data-light-beam]').setAttribute('transform',`translate(${x} 0)`);q('[data-light-beam]').setAttribute('opacity',lamp?(night?'.45':'.26'):'0');q('[data-study-shadow]').setAttribute('cx',String(350-x*.65));q('[data-study-shadow]').setAttribute('rx',String(65+Math.abs(x)*.3));q('[data-study-shadow]').setAttribute('opacity',lamp?'.25':night?'.05':'.12');q('[data-desk]').setAttribute('fill',q<HTMLSelectElement>('[data-desk-color]').value);q('[data-night]').textContent=night?'昼にする':'夜にする';q('[data-night]').setAttribute('aria-pressed',String(night));q('[data-lamp-toggle]').textContent=lamp?'ランプを消す':'ランプをつける';q('[data-lamp-toggle]').setAttribute('aria-pressed',String(lamp));};
  q('[data-night]').addEventListener('click',()=>{night=!night;draw();status(night?'夜の書斎です。':'昼の書斎です。');});q('[data-lamp-toggle]').addEventListener('click',()=>{lamp=!lamp;draw();status(lamp?'ランプをつけました。':'ランプを消しました。');});root.querySelectorAll('input,select').forEach(el=>el.addEventListener('input',draw));draw();
 }
 if(kind==='letters') {
  type Block={x:number;y:number;vx:number;vy:number;el:SVGElement;held:boolean};let blocks:Block[]=[];
  const render=()=>blocks.forEach(b=>b.el.setAttribute('transform',`translate(${b.x} ${b.y})`));
  const step=(dt:number)=>{
   blocks.forEach(b=>{if(b.held)return;b.vy+=1000*dt;b.vx*=Math.exp(-1.4*dt);b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<25||b.x>615){b.x=clamp(b.x,25,615);b.vx*=-.45;}if(b.y>320){b.y=320;b.vy=Math.abs(b.vy)>45?-b.vy*.25:0;b.vx*=.9;}if(b.y<25){b.y=25;b.vy=Math.abs(b.vy);}});
   for(let pass=0;pass<4;pass++)for(let i=0;i<blocks.length;i++)for(let j=i+1;j<blocks.length;j++){
    const a=blocks[i],b=blocks[j],dx=b.x-a.x,dy=b.y-a.y,ox=48-Math.abs(dx),oy=48-Math.abs(dy);if(ox<=0||oy<=0||(a.held&&b.held))continue;
    const wa=a.held?0:b.held?1:.5,wb=b.held?0:a.held?1:.5;
    if(ox<oy){const dir=dx>=0?1:-1;a.x-=dir*ox*wa;b.x+=dir*ox*wb;if(!a.held)a.vx*=.4;if(!b.held)b.vx*=.4;}
    else {const dir=dy>=0?1:-1;a.y-=dir*oy*wa;b.y+=dir*oy*wb;if(!a.held)a.vy=0;if(!b.held)b.vy=0;}
   }blocks.forEach(b=>{b.x=clamp(b.x,25,615);b.y=clamp(b.y,25,320);});render();
  };
  const drop=()=>{const text=Array.from(q<HTMLInputElement>('#toy-words').value.trim()).slice(0,16);if(!text.length){status('落とす言葉を入力してください。');return;}q('[data-blocks]').replaceChildren();blocks=[];text.forEach((letter,i)=>{
   const el=make('g',{'data-block':'',tabindex:0,role:'button','aria-label':`${letter}の積み木。矢印キーで移動`},q('[data-blocks]'));
   make('rect',{x:-23,y:-23,width:46,height:46,rx:7,fill:['#fff0bc','#dce7f5','#e1eee5','#f6dfd7'][i%4],stroke:'#354550','stroke-width':2},el);const t=make('text',{x:0,y:9,'text-anchor':'middle','font-size':25,fill:'#354550','pointer-events':'none'},el);t.textContent=letter;
   const b:Block={x:80+(i%8)*65,y:30+Math.floor(i/8)*60,vx:(i%3-1)*20,vy:0,el,held:false};blocks.push(b);let active:number|null=null,offsetX=0,offsetY=0;
   el.addEventListener('pointerdown',(e:PointerEvent)=>{if(active!==null)return;active=e.pointerId;const p=point(e);offsetX=p.x-b.x;offsetY=p.y-b.y;b.held=true;b.vx=b.vy=0;el.setPointerCapture(active);});el.addEventListener('pointermove',(e:PointerEvent)=>{if(active!==e.pointerId)return;const p=point(e);b.x=clamp(p.x-offsetX,25,615);b.y=clamp(p.y-offsetY,25,320);render();});for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,()=>{active=null;b.held=false;});el.addEventListener('keydown',(e:KeyboardEvent)=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();b.x=clamp(b.x+(e.key==='ArrowRight'?25:e.key==='ArrowLeft'?-25:0),25,615);b.y=clamp(b.y+(e.key==='ArrowDown'?25:e.key==='ArrowUp'?-55:0),25,320);b.vx=b.vy=0;render();});
   });if(reduced.matches)for(let i=0;i<180;i++)step(.025);render();status(`${text.length}文字の積み木を入れました。`);};
  q('[data-drop]').addEventListener('click',drop);q('[data-shake]').addEventListener('click',()=>{blocks.forEach((b,i)=>{b.vx=(i%2?1:-1)*(180+Math.random()*200);b.vy=-200-Math.random()*250;});if(reduced.matches)for(let i=0;i<120;i++)step(.025);status('箱をゆらしました。');});q('[data-reset]').addEventListener('click',()=>{blocks=[];q('[data-blocks]').replaceChildren();status('箱を空にしました。');});drop();loop(step);
 }
});
