import {owner,checkWrite,payload,adminPosts,savePost,responseError} from '../../../../lib/journal-store';
export async function GET(request:Request){try{owner(request);return Response.json({posts:await adminPosts()},{headers:{'Cache-Control':'no-store'}});}catch(e){return responseError(e);}}
export async function POST(request:Request){try{const u=checkWrite(request);return Response.json({post:await savePost(await payload(request),u.id)},{status:201,headers:{'Cache-Control':'no-store'}});}catch(e){return responseError(e);}}
