import { securityForm } from './security-form.mjs';
import { EmailMessage } from 'cloudflare:email';
import { handleContact } from './handler.mjs';
export default {
  fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path === '/security-contact' || path === '/security-contact/') {
      if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed', {status:405});
      return new Response(request.method === 'HEAD' ? null : securityForm, {headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY','Strict-Transport-Security':'max-age=2592000'}});
    }
    if (path === '/.well-known/security.txt') return new Response('Contact: https://ryu-koda.com/security-contact/\nExpires: 2027-05-09T00:00:00Z\nPreferred-Languages: ja, en\nCanonical: https://ryu-koda.com/.well-known/security.txt\n', {headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=3600','Strict-Transport-Security':'max-age=2592000'}});
    return handleContact(request, env, {
      send: (from, to, raw) => env.EMAIL.send(new EmailMessage(from, to, raw)),
      verify: (body) => fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {method:'POST', body}),
    });
  },
};
