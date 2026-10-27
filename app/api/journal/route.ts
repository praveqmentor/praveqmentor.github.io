import {publicPosts,publicShape,responseError} from '../../../lib/journal-store';
export async function GET(){try{return Response.json({posts:(await publicPosts()).map(publicShape)},{headers:{'Cache-Control':'no-store'}});}catch(e){return responseError(e);}}
