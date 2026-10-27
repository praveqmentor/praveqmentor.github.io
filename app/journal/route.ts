import journal from '../../content/journal.html?raw';
export async function GET(){return new Response(journal,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});}
