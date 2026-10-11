/* SPDX-License-Identifier: GPL-3.0-only */
// Review requests only. This site never publishes submissions automatically.
const REVIEW_QUEUE='https://github.com/ChanceTheMaker/smklab/issues/new';
const dialog=document.querySelector('#submit-dialog');
let opener=null;
for(const button of document.querySelectorAll('[data-submit]'))button.addEventListener('click',()=>{opener=button;dialog.showModal();});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>opener?.focus());
for(const button of document.querySelectorAll('.voice-picker button'))button.addEventListener('click',()=>{
 const voice=button.dataset.voice;
 document.querySelector('.hero-art').dataset.voice=voice;
 for(const b of document.querySelectorAll('.voice-picker button'))b.setAttribute('aria-pressed',String(b===button));
 document.getElementById('hero-felucca').hidden=voice!=='felucca';
 document.getElementById('hero-sloop').hidden=voice!=='sloop';
 document.querySelector('#hero-caption').textContent=voice==='sloop'?'02 / SLOOP SMK':'01 / FELUCCA SMK';
});
const form=document.querySelector('#submission-form');
function validWebUrl(input){input.setCustomValidity('');if(!input.value)return true;try{const u=new URL(input.value);if(!['https:','http:'].includes(u.protocol)||u.username||u.password)throw Error();}catch{input.setCustomValidity('Enter an http:// or https:// website URL without embedded credentials.');return false;}return true;}
for(const input of form.querySelectorAll('input[type=url]'))input.addEventListener('input',()=>input.setCustomValidity(''));
form.addEventListener('submit',event=>{
 event.preventDefault();
 for(const input of form.querySelectorAll('input[type=url]'))validWebUrl(input);
 if(!form.reportValidity())return;
 const data=Object.fromEntries(new FormData(form));
 const body=['## SMK Lab site submission','','**Project:** '+data.name,'**Website:** '+data.website,'**Type:** '+data.category,'**Hardware:** '+data.hardware,'**Status:** '+data.status,'**Source:** '+(data.source||'Not provided'),'','### About the project',data.description,'','---','Submitted for review for the SMK Lab directory. This is a listing request, not a firmware issue.'].join('\n');
 const url=new URL(REVIEW_QUEUE);url.searchParams.set('title','[SMK Lab submission] '+data.name);url.searchParams.set('body',body);
 const link=document.createElement('a');link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';link.click();
 document.querySelector('#submission-status').textContent='Your GitHub request opened in a new tab. Review it and click Submit new issue there to send it. Nothing is listed until it is approved.';
});
