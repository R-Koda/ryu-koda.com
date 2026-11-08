import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';
const source=stripTypeScriptTypes(fs.readFileSync('src/scripts/analytics.ts','utf8')).replace('export function track','function track');
function run(host,choice=null,exclude=false){
 const handlers={},added=[],listeners={};let stored=choice,reloads=0;const storage={'ryu-analytics-consent-v1':choice,'ryu-analytics-exclude-v1':String(exclude)};
 const controls={};for(const key of ['[data-analytics-accept]','[data-analytics-reject]','[data-analytics-exclude]','[data-analytics-close]'])controls[key]={setAttribute:()=>{},addEventListener:(_,fn)=>handlers[key]=fn};
 const panel={hidden:true,querySelector:s=>controls[s]};
 const document={readyState:'complete',title:'Test',referrer:'https://example.com/search?email=private',cookie:'',head:{append:s=>added.push(s)},createElement:()=>({dataset:{}}),querySelector:s=>s==='[data-analytics-panel]'?panel:null,querySelectorAll:()=>[],addEventListener:(type,fn)=>listeners[type]=fn};
 const context={window:{},document,location:{hostname:host,origin:`https://${host}`,pathname:'/blog/test/',search:'?email=private',reload:()=>reloads++},localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},URL,Set,Date};
 vm.createContext(context);vm.runInContext(source,context);
 return {context,added,handlers,panel,listeners,reloads:()=>reloads};
}
for(const host of ['localhost','127.0.0.1','preview.ryu-koda.pages.dev','qb.ryu-koda.com']){const r=run(host,'granted');assert.equal(r.added.length,0);}
const r=run('ryu-koda.com');assert.equal(r.added.length,0);assert.equal(r.panel.hidden,false);
vm.runInContext("track('contact_success')",r.context);assert.equal(r.context.window.dataLayer,undefined);
r.handlers['[data-analytics-reject]']();assert.equal(r.added.length,0);
r.handlers['[data-analytics-accept]']();assert.equal(r.added.length,1);assert.equal(r.context.window['ga-disable-G-RJXC50ZSJL'],false);
r.handlers['[data-analytics-accept]']();assert.equal(r.added.length,1);
vm.runInContext("track('contact_success')",r.context);
const payload=JSON.stringify(r.context.window.dataLayer);assert.ok(!payload.includes('private'));assert.ok(payload.includes('contact_success'));assert.ok(payload.includes('ad_personalization'));assert.ok(payload.includes('denied'));
const before=r.context.window.dataLayer.length;r.handlers['[data-analytics-reject]']();vm.runInContext("track('contact_success')",r.context);assert.equal(r.context.window.dataLayer.length,before);assert.equal(r.reloads(),1);
const contact=fs.readFileSync('src/pages/contact.astro','utf8');assert.match(contact,/if \(response.ok\) \{ track\("contact_success"\); form.reset\(\); \}/);
console.log('PASS: no pre-consent/preview collection, consent transitions, single loader, URL minimization, success-only contact event.');

const own=run('ryu-koda.com','granted',true);assert.equal(own.added.length,0);assert.equal(own.panel.hidden,true);own.handlers['[data-analytics-accept]']();assert.equal(own.added.length,0);vm.runInContext("track('page_view')",own.context);assert.equal(own.context.window.dataLayer,undefined);
const head=fs.readFileSync('src/components/BaseHead.astro','utf8').match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
for(const exclude of [true,false]){const x=run('ryu-koda.com','denied',exclude);vm.runInContext("(()=>{"+head+"})()",x.context);assert.equal(x.added.length,exclude?0:1);}
console.log('PASS: owner exclusion blocks GA4 (including consent re-acceptance) and Cloudflare loaders; ordinary visitors still measured.');

const toggle=run('ryu-koda.com','granted');toggle.handlers['[data-analytics-exclude]']();assert.equal(toggle.reloads(),1);const count=toggle.context.window.dataLayer.length;vm.runInContext("track('page_view')",toggle.context);assert.equal(toggle.context.window.dataLayer.length,count);
console.log('PASS: exclusion control reloads and stops further events.');
