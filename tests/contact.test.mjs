import test from 'node:test';
import assert from 'node:assert/strict';
import {handleContact} from '../workers/contact/handler.mjs';
const payload = {name:'テスト',email:'reader@example.com',category:'その他',message:'お問い合わせテスト',consent:true,token:'token'};
const env = {TURNSTILE_SECRET:'test-secret',CONTACT_TO:'owner@example.com',CONTACT_LIMIT:{limit:async()=>({success:true})}};
const request = (body=payload, origin='https://ryu-koda.com') => new Request('https://ryu-koda.com/api/contact',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
const verify = async()=>Response.json({success:true,hostname:'ryu-koda.com',action:'contact'});
test('validated submission sends only to configured recipient, with visitor Reply-To',async()=>{
 let sent;
 const response=await handleContact(request({...payload,to:'attacker@example.com'}),env,{verify,send:async(...args)=>{sent=args;}});
 assert.equal(response.status,200); assert.equal(sent[1],'owner@example.com'); assert.match(sent[2],/Reply-To: reader@example.com/); assert.doesNotMatch(sent[2],/attacker/);
});
test('invalid input and foreign origin never send',async()=>{
 let sent=0;const services={verify,send:async()=>sent++};
 for (const change of [{email:'reader@example.com\r\nBcc:x@example.com'},{consent:false},{website:'spam'},{message:'x'.repeat(5001)},{category:'invalid'}]) assert.equal((await handleContact(request({...payload,...change}),env,services)).status,400);
 assert.equal((await handleContact(request(payload,'https://example.com'),env,services)).status,403); assert.equal(sent,0);
});
test('Turnstile failures and hostname/action mismatch never send',async()=>{
 for(const result of [{success:false},{success:true,hostname:'example.com',action:'contact'},{success:true,hostname:'ryu-koda.com',action:'other'}]){
  const response=await handleContact(request(),env,{verify:async()=>Response.json(result),send:async()=>assert.fail('must not send')}); assert.equal(response.status,400);
 }
});
test('delivery errors return failure, rate limits stop sends',async()=>{
 assert.equal((await handleContact(request(),env,{verify,send:async()=>{throw Error('delivery');}})).status,502);
 assert.equal((await handleContact(request(),{...env,CONTACT_LIMIT:{limit:async()=>({success:false})}},{})).status,429);
});
test('oversized requests and missing configuration fail closed',async()=>{
 assert.equal((await handleContact(request({...payload,message:'x'.repeat(25000)}),env,{})).status,413);
 assert.equal((await handleContact(request(),{},{})).status,503);
});
test('shared reporting categories use the same verified, fixed-recipient delivery',async()=>{
 for(const category of ['セキュリティの報告','Solo Researcherへのお問い合わせ']) {
  let recipient;
  const response=await handleContact(request({...payload,category,message:'対象サイト: solo-researcher.com\n\nテスト'}),env,{verify,send:async(_from,to)=>{recipient=to;}});
  assert.equal(response.status,200); assert.equal(recipient,env.CONTACT_TO);
 }
});
