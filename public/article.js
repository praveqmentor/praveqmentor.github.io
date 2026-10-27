'use strict';
const b=document.querySelector('.copy-article');
if(b)b.addEventListener('click',async()=>{const status=document.querySelector('.copy-status');try{await navigator.clipboard.writeText(location.origin+location.pathname);status.textContent='コピーしました';}catch{status.textContent='URLを選択してコピーしてください';const input=document.createElement('input');input.value=location.origin+location.pathname;input.setAttribute('aria-label','記事のURL');input.style.maxWidth='200px';b.parentElement.append(input);input.focus();input.select();}});
