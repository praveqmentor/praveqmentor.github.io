import {owner,historyFor,responseError} from '../../../../../../lib/journal-store';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){try{owner(request);return Response.json({revisions:await historyFor((await params).id)},{headers:{'Cache-Control':'no-store'}});}catch(e){return responseError(e);}}
