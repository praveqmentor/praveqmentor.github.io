import {publicPosts,responseError} from '../../lib/journal-store';
const origin='https://praveqmentor.com';
export const dynamic='force-dynamic';
export async function GET(){try{const paths=['/','/journal/',...(await publicPosts()).map(p=>'/journal/'+encodeURIComponent(p.slug)+'/')];return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(path=>'<url><loc>'+origin+path+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'no-store'}});}catch(e){return responseError(e);}}
