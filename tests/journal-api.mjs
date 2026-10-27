// In-memory D1 / production handler integration test. No hosted Site is modified.
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {build} from 'esbuild';
import {Miniflare} from 'miniflare';
const bundled=await build({entryPoints:['tests/api-worker.ts'],bundle:true,write:false,format:'esm',platform:'browser',external:['cloudflare:workers']});
const mf=new Miniflare({modules:true,script:bundled.outputFiles[0].text,compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:['DB'],r2Buckets:['BUCKET'],bindings:{JOURNAL_OWNER_EMAIL:'owner@example.invalid'}});
const d1=await mf.getD1Database('DB');
for(const filename of (await readdir('drizzle')).filter(x=>x.endsWith('.sql')).sort()){const sql=await readFile('drizzle/'+filename,'utf8');for(const statement of sql.split('--> statement-breakpoint').map(x=>x.trim()).filter(Boolean))await d1.prepare(statement).run();}
const origin='https://journal.test';
const auth={'oai-authenticated-user-id':'local-qa-editor','oai-authenticated-user-email':'owner@example.invalid'};
const fetch=(url,options)=>mf.dispatchFetch(url,options);
async function call(path,{method='GET',body,headers=auth,expected=200}={}){const r=await fetch(origin+path,{method,headers:{...headers,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});let d;try{d=await r.json();}catch{d=null;}assert.equal(r.status,expected,`${method} ${path}: ${JSON.stringify(d)}`);return d;}
await call('/api/admin/posts',{headers:{},expected:401});
await call('/api/admin/posts',{headers:{'oai-authenticated-user-id':'other','oai-authenticated-user-email':'other@example.invalid'},expected:403});
const initial=await call('/api/admin/posts');assert.equal(initial.posts.filter(p=>p.id.startsWith('legacy-')).length,4);
const feed=await call('/api/journal',{headers:{}});assert(feed.posts.length>=4);
const slug='qa-'+Date.now();const base={title:'動作確認用の記事',slug,category:'THE JOURNEY',visual:'notes',date:'2026-10-24',body:'## 試してみたこと\n\n**本文**の保存を確認。<script>unsafe()</script>',excerpt:'ローカルの動作確認用。',author:'QA',kicker:'QA ONLY',status:'draft'};
await call('/api/admin/posts',{method:'POST',body:{...base,body:''},expected:422});
await call('/api/admin/posts',{method:'POST',body:base,headers:{...auth,origin:'https://other.invalid'},expected:403});
let {post}=await call('/api/admin/posts',{method:'POST',body:base,expected:201});
assert(!(await call('/api/journal',{headers:{}})).posts.some(p=>p.slug===slug));
assert.equal((await fetch(origin+'/journal/'+slug+'/')).status,404);
await call('/api/admin/posts',{method:'POST',body:base,expected:409});
const stale=structuredClone(post);
({post}=await call('/api/admin/posts/'+post.id,{method:'PUT',body:{...post,title:'保存できた記事',status:'published'}}));
assert.equal(post.revision,2);
await call('/api/admin/posts/'+post.id,{method:'PUT',body:{...stale,title:'古い画面からの変更'},expected:409});
assert((await call('/api/journal',{headers:{}})).posts.some(p=>p.slug===slug));
const article=await fetch(origin+'/journal/'+slug+'/');assert.equal(article.status,200);const html=await article.text();assert(html.includes('保存できた記事'));assert(html.includes('&lt;script&gt;unsafe()'));assert(!html.includes('<script>unsafe()'));
await call('/api/admin/posts/'+post.id,{method:'PUT',body:{...post,slug:'a-different-slug'},expected:422});
({post}=await call('/api/admin/posts/'+post.id,{method:'PUT',body:{...post,status:'draft'}}));
assert(!(await call('/api/journal',{headers:{}})).posts.some(p=>p.slug===slug));
assert.equal((await fetch(origin+'/journal/'+slug+'/')).status,404);
const history=await call('/api/admin/posts/'+post.id+'/history');assert.equal(history.revisions.length,3);assert.equal(JSON.parse(history.revisions.at(-1).snapshot).title,base.title);
({post}=await call('/api/admin/posts/'+post.id,{method:'PUT',body:{...post,status:'archived'}}));assert.equal(post.status,'archived');
const restore=JSON.parse(history.revisions.at(-1).snapshot);
({post}=await call('/api/admin/posts/'+post.id,{method:'PUT',body:{...restore,id:post.id,slug:post.slug,revision:post.revision,status:'draft'}}));assert.equal(post.title,base.title);assert.equal(post.revision,5);
await call('/api/admin/posts/'+post.id,{method:'PUT',body:{...post,status:'archived'}});

// Upload persistence, authorization, raster-only validation and draft image isolation.
const photo=await readFile('public/founder.jpeg');
async function upload(bytes=photo,headers=auth,type='image/jpeg'){return fetch(origin+'/api/admin/covers',{method:'POST',headers:{...headers,'content-type':type},body:bytes});}
assert.equal((await upload(photo,{})).status,401);
assert.equal((await upload(photo,{...auth,origin:'https://other.invalid'})).status,403);
assert.equal((await upload(photo,auth,'image/svg+xml')).status,415);
assert.equal((await upload(new TextEncoder().encode('<script>not an image</script>'))).status,422);
assert.equal((await upload(new Uint8Array(8*1024*1024+1))).status,413);
const uploaded=await upload();assert.equal(uploaded.status,201);const {url}=await uploaded.json();assert(url.startsWith('/media/journal/'));
assert.equal((await fetch(origin+url)).status,404);
const ownerImage=await fetch(origin+url,{headers:auth});assert.equal(ownerImage.status,200);assert.equal((await ownerImage.arrayBuffer()).byteLength,photo.byteLength);
await call('/api/admin/posts',{method:'POST',body:{...base,slug:'photo-missing',visual:'photo',cover_image:'/media/journal/'+crypto.randomUUID()+'.jpg',cover_alt:'写真の説明'},expected:422});
await call('/api/admin/posts',{method:'POST',body:{...base,slug:'photo-no-description',visual:'photo',cover_image:url},expected:422});
let {post:photoPost}=await call('/api/admin/posts',{method:'POST',body:{...base,slug:'photo-entry',visual:'photo',cover_image:url,cover_alt:'川沿いを走るShu'},expected:201});
assert.equal((await fetch(origin+url)).status,404);
({post:photoPost}=await call('/api/admin/posts/'+photoPost.id,{method:'PUT',body:{...photoPost,status:'published'}}));
assert.equal((await fetch(origin+url)).status,200);
const photoFeed=(await call('/api/journal',{headers:{}})).posts.find(p=>p.slug==='photo-entry');assert.equal(photoFeed.cover_image,url);assert.equal(photoFeed.cover_alt,'川沿いを走るShu');
assert((await (await fetch(origin+'/journal/photo-entry/')).text()).includes('alt="川沿いを走るShu"'));
({post:photoPost}=await call('/api/admin/posts/'+photoPost.id,{method:'PUT',body:{...photoPost,visual:'logo'}}));
assert.equal((await fetch(origin+url)).status,404);
const photoHistory=await call('/api/admin/posts/'+photoPost.id+'/history');const snapshot=JSON.parse(photoHistory.revisions.find(r=>JSON.parse(r.snapshot).visual==='photo').snapshot);
await call('/api/admin/posts/'+photoPost.id,{method:'PUT',body:{...snapshot,revision:photoPost.revision,status:'published'}});
assert.equal((await fetch(origin+url)).status,200);
console.log('PASS: journal CRUD, auth, revisions, uploads, storage, MIME/size limits, draft photo isolation, listing/unlisting and photo history restoration.');
await mf.dispose();
