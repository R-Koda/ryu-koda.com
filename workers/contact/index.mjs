import { EmailMessage } from 'cloudflare:email';
import { handleContact } from './handler.mjs';
export default {
  fetch(request, env) {
    return handleContact(request, env, {
      send: (from, to, raw) => env.EMAIL.send(new EmailMessage(from, to, raw)),
      verify: (body) => fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {method:'POST', body}),
    });
  },
};
