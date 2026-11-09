const categories = ['仕事・制作のご相談', '製品レビュー・取材', '記事へのご質問・訂正', 'その他', 'セキュリティの報告', 'Solo Researcherへのお問い合わせ'];
const reply = (status, message) => Response.json({ok: status === 200, message}, {status, headers:{'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'}});
const encode = value => btoa(String.fromCharCode(...new TextEncoder().encode(value)));
export async function handleContact(request, env, services) {
  if (new URL(request.url).pathname !== '/api/contact') return reply(404, 'ページが見つかりません。');
  if (request.method !== 'POST') return reply(405, 'POSTで送信してください。');
  if (request.headers.get('Origin') !== 'https://ryu-koda.com') return reply(403, 'お問い合わせページから送信してください。');
  if (!request.headers.get('Content-Type')?.startsWith('application/json')) return reply(415, '送信形式が正しくありません。');
  if (!env.TURNSTILE_SECRET || !env.CONTACT_TO) return reply(503, 'ただいま受付を停止しています。時間をおいてお試しください。');
  try {
    const limit = await env.CONTACT_LIMIT.limit({key:request.headers.get('CF-Connecting-IP') || 'unknown'});
    if (!limit.success) return reply(429, '送信回数が多いため、1分ほど待ってお試しください。');
    const reader = request.body?.getReader();
    if (!reader) return reply(400, '入力内容を確認してください。');
    const chunks = []; let size = 0;
    while (true) {
      const {done, value} = await reader.read(); if (done) break;
      size += value.length;
      if (size > 24000) { await reader.cancel(); return reply(413, '本文は5,000文字以内で入力してください。'); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) {bytes.set(chunk, offset); offset += chunk.length;}
    let data;
    try {data = JSON.parse(new TextDecoder().decode(bytes));} catch {return reply(400, '入力内容を確認してください。');}
    if (!data || typeof data !== 'object') return reply(400, '入力内容を確認してください。');
    const field = key => typeof data[key] === 'string' ? data[key].trim() : '';
    const name = field('name'), email = field('email'), category = field('category'), message = field('message'), token = field('token');
    if (field('website') || !name || name.length > 80 || /[\r\n]/.test(name) || email.length > 254 || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/.test(email) || !categories.includes(category) || !message || message.length > 5000 || data.consent !== true) return reply(400, '必須項目とメールアドレスを確認してください。');
    if (!token || token.length > 2048) return reply(400, '迷惑送信対策の確認を完了してください。');
    const verification = await services.verify(new URLSearchParams({secret:env.TURNSTILE_SECRET, response:token, remoteip:request.headers.get('CF-Connecting-IP') || ''}));
    const result = await verification.json();
    if (!verification.ok || !result.success || result.hostname !== 'ryu-koda.com' || result.action !== 'contact') return reply(400, '確認の有効期限が切れた可能性があります。再確認して送信してください。');
    const from = 'contact@ryu-koda.com';
    const body = `りゅうのらぼのお問い合わせフォームから届きました。\n\nお名前: ${name}\n返信先: ${email}\n種類: ${category}\n\n${message}\n\n---\nこのメールに返信すると、入力された返信先に送信されます。`;
    const raw = [`From: Ryu Lab <${from}>`, `To: ${env.CONTACT_TO}`, `Reply-To: ${email}`, `Subject: =?UTF-8?B?${encode(`【りゅうのらぼ】${category}`)}?=`, 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', encode(body).match(/.{1,76}/g).join('\r\n')].join('\r\n');
    await services.send(from, env.CONTACT_TO, raw);
    return reply(200, 'お問い合わせを受け付けました。内容を確認して、ご入力のメールアドレスへ返信します。');
  } catch {
    return reply(502, '送信できませんでした。入力内容は残っています。時間をおいて、もう一度お試しください。');
  }
}
