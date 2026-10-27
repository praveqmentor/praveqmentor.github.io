// Isolated test Worker: the production API handlers, routed without a network server.
import {uploadCover,serveCover} from '../lib/journal-images';
import {GET as feed} from '../app/api/journal/route';
import {GET as list,POST as create} from '../app/api/admin/posts/route';
import {GET as get,PUT as update} from '../app/api/admin/posts/[id]/route';
import {GET as history} from '../app/api/admin/posts/[id]/history/route';
import {GET as article} from '../app/journal/[slug]/route';
export default {async fetch(request:Request){const p=new URL(request.url).pathname;if(p==='/api/admin/covers')return uploadCover(request);if(p.startsWith('/media/journal/'))return serveCover(request,p.slice('/media/journal/'.length));if(p==='/api/journal')return feed();if(p==='/api/admin/posts')return request.method==='POST'?create(request):list(request);let m;if(m=p.match(/^\/api\/admin\/posts\/([^/]+)\/history$/))return history(request,{params:Promise.resolve({id:m[1]})});if(m=p.match(/^\/api\/admin\/posts\/([^/]+)$/))return request.method==='PUT'?update(request,{params:Promise.resolve({id:m[1]})}):get(request,{params:Promise.resolve({id:m[1]})});if(m=p.match(/^\/journal\/([^/]+)\/$/))return article(request,{params:Promise.resolve({slug:m[1]})});return new Response('Not found',{status:404});}};
