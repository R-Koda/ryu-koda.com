import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';
const source=stripTypeScriptTypes(fs.readFileSync('src/scripts/analytics.ts','utf8')).replace('export function track','function track');
function run(host,choice=null){
 const handlers={},added=[],listeners={};let stored=choice,reloads=0;
 const controls={};for(const key of ['[data-analytics-accept]','[data-analytics-reject]'])controls[key]={addEventListener:(_,fn)=>handlers[key]=fn};
 const panel={hidden:true,querySelector:s=>controls[s]};
 const document={readyState:'complete',title:'Test',referrer:'https://example.com/search?email=private',cookie:'',head:{append:s=>added.push(s)},createElement:()=>({}),querySelector:s=>s==='[data-analytics-panel]'?panel:null,querySelectorAll:()=>[],addEventListener:(type,fn)=>listeners[type]=fn};
 const context={window:{},document,location:{hostname:host,origin:`https://${host}`,pathname:'/blog/test/',search:'?email=private',reload:()=>reloads++},localStorage:{getItem:()=>stored,setItem:(_,v)=>stored=v},URL,Set,Date};
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
