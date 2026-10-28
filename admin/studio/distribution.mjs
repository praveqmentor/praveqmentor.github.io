// Private sidecar drafts; public projection deliberately excludes all draft text.
export const CHANNELS=['note','x_short','x_article'];
export const STATES=['draft','ready','published'];
export const SITE='https://praveqmentor.com';
export const codepoints=s=>Array.from(String(s||'')).length;
export function trackedURL(slug,source,target='article'){
 const u=new URL(target==='article'?'/journal/'+encodeURIComponent(slug)+'/':'/',SITE);
 u.search=new URLSearchParams({utm_source:source,utm_medium:'social',utm_campaign:'journal',utm_content:slug});
 if(target!=='article')u.hash=target==='program'?'program':'consultation';
 return u.href;
}
export function publicationURL(value,channel){
 if(!value)return '';
 try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port)return null;
 const valid=channel==='note'?u.hostname==='note.com'&&/^\/[a-zA-Z0-9_-]+\/n\/n[a-zA-Z0-9]+\/?$/.test(u.pathname):['x.com','twitter.com'].includes(u.hostname)&&/^\/[a-zA-Z0-9_]{1,15}\/status\/\d+\/?$/.test(u.pathname);
 if(!valid)return null;u.search='';u.hash='';return u.href;
 }catch{return null;}
}
export function emptyDistribution(post){return {version:1,post_id:post.id,revision:0,source_revision:post.revision,updated_at:null,channels:Object.fromEntries(CHANNELS.map(c=>[c,{title:'',body:'',invitation:'',status:'draft',published_url:''}]))};}
export function validateDistribution(raw,id){
 if(!raw||raw.version!==1||raw.post_id!==id||!Number.isInteger(raw.revision)||raw.revision<0||!Number.isInteger(raw.source_revision)||raw.source_revision<1)throw Error('配信下書きの形式を確認してください。');
 const data={version:1,post_id:id,revision:raw.revision,source_revision:raw.source_revision,updated_at:raw.updated_at||null,channels:{}};
 for(const c of CHANNELS){const v=raw.channels?.[c];if(!v||!STATES.includes(v.status))throw Error('配信状態を選んでください。');
 const p={};for(const field of ['title','body','invitation']){if(typeof v[field]!=='string'||v[field].length>(field==='body'?65000:2000))throw Error('配信下書きの文字数を確認してください。');p[field]=v[field];}
 p.status=v.status;p.published_url=publicationURL(v.published_url,c);if(p.published_url===null)throw Error(c==='note'?'noteの記事URLを入力してください。':'Xの投稿URLを入力してください。');
 if(p.status!=='draft'&&!p.body.trim())throw Error('準備完了・公開済みにする前に本文を入力してください。');
 if(c==='note'&&p.status!=='draft'&&!p.title.trim())throw Error('noteのタイトルを入力してください。');
 if(c!=='note'&&p.status!=='draft'&&xWeight(p.body)>280)throw Error('Xの本文が通常投稿の280カウントを超えています。');
 if(p.status==='published'&&!p.published_url)throw Error('公開済みにするには公開先URLが必要です。');data.channels[c]=p;
 }return data;
}
// Conservative counter: all non-ASCII count as two; each http(s) URL is 23.
// Emoji sequences may be over-counted. Final authority is the X composer.
export function xWeight(text){return String(text||'').normalize('NFC').split(/(https?:\/\/[^\s]+)/g).reduce((sum,s)=>sum+(/^https?:\/\//.test(s)?23:Array.from(s).reduce((n,c)=>n+(c.codePointAt(0)<=0x7f?1:2),0)),0);}
export function generateChannel(post,channel,insight=''){
 const p={title:'',body:'',invitation:'',status:'draft',published_url:''};
 if(channel==='note'){p.title=post.title;p.body=post.body;p.invitation='この考え方を、実際の学びの支援でどう形にするか。高校生向け英検2級・準1級メンタリングの内容は、PRAVEQのサイトにまとめています。\n'+trackedURL(post.slug,'note','program')+'\n\nご自身の場合を一緒に整理したい方は、CONTACTから無料相談へ。\n'+trackedURL(post.slug,'note','contact');}
 else{const paragraph=String(post.body).split(/\n\s*\n/).find(s=>!/^\s*#/.test(s))||post.excerpt; p.body=insight.trim()||paragraph||'';if(channel==='x_article')p.body+='\n\n考えたことをJournalに残しました。\n'+trackedURL(post.slug,'x');}
 return p;
}
export function publicLinks(raw){const links={};for(const c of CHANNELS){const p=raw?.channels?.[c];const url=publicationURL(p?.published_url,c);if(p?.status==='published'&&url)links[c]=url;}return links;}
