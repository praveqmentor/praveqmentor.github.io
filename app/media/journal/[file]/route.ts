import {publishedGitCover as serveCover} from '../../../../lib/journal-publication';
export async function GET(request:Request,{params}:{params:Promise<{file:string}>}){try{return await serveCover((await params).file);}catch{return new Response('写真を読み込めませんでした。',{status:500,headers:{'Cache-Control':'no-store'}});}}
