'use strict';
const $=s=>document.querySelector(s);
const steps=[
 {
  "label": "01 / ASSESSMENT",
  "title": "4技能を確かめ、<br>あなたの学習計画をつくる。",
  "body": "Week 1は100分の個別診断。Reading・Listening・Writing・Speakingの実力に加え、学習習慣や得意・不得意を確認します。授業終了後、診断結果をもとに個別ロードマップを作成します。",
  "head": "INITIAL ASSESSMENT",
  "rows": [
   [
    "初回授業",
    "100分／4技能と学習習慣を確認"
   ],
   [
    "授業後",
    "目標級・受験予定日・重点領域を整理"
   ],
   [
    "ロードマップ",
    "週間目標と、期間ごとの到達目標を設定"
   ]
  ]
 },
 {
  "label": "02 / WEEKLY MENTORING",
  "title": "今週の課題を決め、<br>実践と見直しを重ねる。",
  "body": "週1回50分、英検過去問を中心にReading・Listening・Writingを指導します。前週の進捗を確認し、演習・解説・弱点分析から、次の一週間に取り組む課題を決めます。",
  "head": "YOUR WEEKLY ROUTINE",
  "rows": [
   [
    "Weekly Focus",
    "毎週、最大2領域を重点的に学習"
   ],
   [
    "Vocabulary",
    "語彙学習は重点領域とは別に継続"
   ],
   [
    "進捗確認",
    "学習方法を見直し、ロードマップを調整"
   ]
  ]
 },
 {
  "label": "03 / SPEAKING PREPARATION",
  "title": "最後の2週間は、<br>Speakingに集中する。",
  "body": "プログラム最終2週間は、週1回50分のSpeaking集中指導。S-CBT形式の演習と模擬面接を通して、回答内容・発音・流暢さ・時間配分を確認し、本番に向けて調整します。",
  "head": "FINAL TWO WEEKS",
  "rows": [
   [
    "実践",
    "S-CBT形式のSpeaking演習・模擬面接"
   ],
   [
    "改善",
    "回答内容・発音・流暢さを確認"
   ],
   [
    "最終調整",
    "時間配分を整え、試験本番に備える"
   ]
  ]
 },
 {
  "label": "04 / S-CBT EXAMINATION",
  "title": "指導を終えたら、<br>決めた日程で受験へ。",
  "body": "最終指導の終了をもってプログラムは完了です。その後、事前に設定した日程で英検S-CBTを受験します。初回受験を見据え、必要な準備をプログラム内で進めます。",
  "head": "PROGRAM COMPLETION & EXAM",
  "rows": [
   [
    "プログラム完了",
    "契約期間の最終指導が終了した時点"
   ],
   [
    "受験時期",
    "原則としてプログラム終了後"
   ],
   [
    "受験料",
    "プラン料金とは別途、受講者が負担"
   ]
  ]
 }
];
function showStep(index){const s=steps[index];$('#program-panel').innerHTML=`<div class="step-description"><span class="step-label">${s.label}</span><h3>${s.title}</h3><p>${s.body}</p></div><div class="step-example"><div class="example-head">${s.head}<span>支援内容</span></div>${s.rows.map(([a,b])=>`<div class="example-row"><span>${a}</span><b>${b}</b></div>`).join('')}</div>`;$('#program-panel').setAttribute('aria-labelledby',`tab-${index}`);document.querySelectorAll('[data-step]').forEach((t,i)=>{t.setAttribute('aria-selected',String(i===index));t.tabIndex=i===index?0:-1;});}
showStep(0);
document.querySelectorAll('[data-step]').forEach((tab,i)=>{tab.addEventListener('click',()=>showStep(i));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%4;else if(e.key==='ArrowLeft')n=(i+3)%4;else if(e.key==='Home')n=0;else if(e.key==='End')n=3;else return;e.preventDefault();showStep(n);$(`#tab-${n}`).focus();});});
const planSelect=$('#program-duration');
function showDuration(){const weeks=Number(planSelect.value);$('#rlw-weeks').textContent=`Week 2–${weeks-2}`;$('#speaking-weeks').textContent=`Week ${weeks-1}–${weeks}`;$('#completion-week').textContent=`Week ${weeks}の最終指導終了時`;$('#duration-status').textContent=`${weeks}週間：初回診断、Week 2から${weeks-2}のRLW指導、最終2週間のSpeaking指導を経て、終了後に受験します。`;}
planSelect.addEventListener('change',showDuration);showDuration();
const menu=$('.menu-toggle'),mobile=$('#mobile-nav');function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','メニューを開く');mobile.hidden=true;}menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(expanded));menu.setAttribute('aria-label',expanded?'メニューを閉じる':'メニューを開く');mobile.hidden=!expanded;});mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});window.matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const dialog=$('#inquiry-dialog'),form=$('#inquiry-form');$('#open-inquiry').addEventListener('click',()=>dialog.showModal());$('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form),name=d.get('name').trim(),message=d.get('message').trim();if(!name||!message){$('#inquiry-status').textContent='お名前とお問い合わせ内容を入力してください。';return;}const body=`PRAVEQ Mentor ご担当者様\n\n${message}\n\nお名前：${name}\nご相談される方：${d.get('role')}\n目標級：${d.get('grade')}\n\nよろしくお願いいたします。`;$('#inquiry-copy').value=body;$('#email-fallback').hidden=false;$('#inquiry-status').textContent='下書きを作成しました。内容を確認し、メールアプリで開くかコピーして送信してください。';$('#open-mail-draft').href=`mailto:praveq.mentor@gmail.com?subject=${encodeURIComponent('PRAVEQ Mentorへのご相談')}&body=${encodeURIComponent(body)}`;});
$('#copy-inquiry').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#inquiry-copy').value);$('#inquiry-status').textContent='本文をコピーしました。宛先を確認して送信してください。';}catch{$('#inquiry-copy').focus();$('#inquiry-copy').select();$('#inquiry-status').textContent='本文を選択しました。コピーしてご利用ください。';}});
