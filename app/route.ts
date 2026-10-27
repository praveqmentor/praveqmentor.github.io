import home from '../content/home.html?raw';
export const dynamic='force-dynamic';
export async function GET(){return new Response(home,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});}
