const AUTH='praveq.git.auth.v1',ATTEMPT='praveq.git.attempt.v1',DRAFT='praveq.git.draft.v1';
export function sessionState(storage,now=()=>Date.now()){
 const get=(key,maxAge)=>{try{const value=JSON.parse(storage.getItem(key));if(!value||now()-value.at>maxAge||value.at>now()){storage.removeItem(key);return null;}return value.data;}catch{storage.removeItem(key);return null;}};
 const put=(key,data)=>storage.setItem(key,JSON.stringify({at:now(),data}));
 return {auth:()=>get(AUTH,3600000),setAuth:token=>put(AUTH,{token}),clearAuth:()=>storage.removeItem(AUTH),attempt:()=>get(ATTEMPT,600000),setAttempt:data=>put(ATTEMPT,data),clearAttempt:()=>storage.removeItem(ATTEMPT),draft:()=>get(DRAFT,86400000),setDraft:data=>put(DRAFT,data),clearDraft:()=>storage.removeItem(DRAFT)};
}
