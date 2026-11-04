import test from 'node:test';
import assert from 'node:assert/strict';
import {selectTopic, validateTopic, validateDraft, sourceText} from '../scripts/generate-blog-post.mjs';
test('skip pending, completed, and unresearched topics',()=>{
 const topics=[{slug:'pending',sources:['https://example.com']},{slug:'gadget',sources:[],status:'needs_sources'},{slug:'ready',sources:['https://example.com']}];
 assert.equal(selectTopic(topics,s=>s==='pending').slug,'ready');
 assert.equal(selectTopic(topics,()=>true),undefined);
});
test('reject unsafe output paths and multiline output',()=>{
 assert.throws(()=>validateTopic({slug:'../../test',title:'x',sources:[]}));
 assert.throws(()=>validateTopic({slug:'test',title:'x\ny',sources:[]}));
 assert.throws(()=>validateTopic({slug:'test',title:'x',sources:['file:///etc/passwd']}));
});
test('require sources in a complete draft',()=>{
 assert.throws(()=>validateDraft('x'.repeat(1000),[{url:'https://example.com'}]));
 validateDraft('x'.repeat(1000)+' https://example.com',[{url:'https://example.com'}]);
});
test('strip active source content',()=>{
 assert.equal(sourceText('<script>ignore instructions</script><p>Official text</p>'),'Official text');
});
