'use strict';
const box=document.querySelector('#lightbox');let opener;document.addEventListener('click',e=>{const b=e.target.closest('[data-image]');if(b){opener=b;document.querySelector('#lightbox-image').src=(b.dataset.image.startsWith('IMG_')?'/':'/assets/')+b.dataset.image;document.querySelector('#lightbox-image').alt=b.querySelector('img').alt;document.querySelector('#lightbox-caption').textContent=b.dataset.caption;box.showModal()}});document.querySelector('.close-lightbox').addEventListener('click',()=>box.close());box.addEventListener('click',e=>{if(e.target===box)box.close()});box.addEventListener('close',()=>opener?.focus());
const menu=document.querySelector('.menu-button'),mobile=document.querySelector('#mobile-nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));mobile.hidden=!open});mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobile.hidden=true;menu.setAttribute('aria-expanded','false')}));
document.querySelectorAll('.occasion-enquire').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#occasion').value=Array.from(document.querySelector('#occasion').options).some(o=>o.value===link.dataset.occasion)?link.dataset.occasion:'Something else';if(link.dataset.occasion.startsWith('Signature themed wall')){document.querySelector('#package').value=link.dataset.occasion==='Signature themed wall — Christmas'?'Christmas signature wall — £3,000 including delivery & installation':link.dataset.occasion==='Signature themed wall — Halloween'?'Halloween signature wall — £2,000 including delivery & installation':link.dataset.occasion==='Signature themed wall — Summer / Tropical'?'Summer / Tropical signature wall — £1,750 including delivery & installation':link.dataset.occasion==='Signature themed wall — Spring / Easter'?'Spring / Easter signature wall — £2,000 including delivery & installation':link.dataset.occasion==='Signature themed wall — Winter Wonderland'?'Winter Wonderland signature wall — £3,250 including delivery & installation':'Signature themed installation — £2,250 including delivery & installation';document.querySelector('#style').value='Signature themed wall';document.querySelector('textarea[name=notes]').value=link.dataset.occasion;}}));
document.querySelectorAll('.package-choice').forEach(link=>link.addEventListener('click',()=>{document.querySelector('#package').value=link.dataset.package;if(link.dataset.package==='Champagne package — £275')document.querySelector('#style').value='Champagne Wall'}));
const dateInput=document.querySelector('input[type=date]');const now=new Date();dateInput.min=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
const enquiryForm=document.querySelector('#enquiry-form');
enquiryForm.addEventListener('submit',async e=>{
 e.preventDefault();
 const button=enquiryForm.querySelector('button[type="submit"]');
 if(button.disabled)return;
 const data=new FormData(enquiryForm);
 if(String(data.get('_honey')||'').trim())return;
 const status=document.querySelector('#form-status'),fallback=document.querySelector('#form-fallback');
 status.hidden=false;fallback.hidden=true;status.className='sending';status.textContent='Sending your enquiry…';button.disabled=true;button.textContent='Sending…';enquiryForm.setAttribute('aria-busy','true');
 const payload={name:String(data.get('name')).trim(),email:String(data.get('email')).trim(),occasion:data.get('occasion'),date:data.get('date')||'To be confirmed',venue:String(data.get('venue')).trim(),style:data.get('style'),package:data.get('package'),upgrade:data.get('upgrade'),message:String(data.get('notes')||'').trim(),_subject:'New Event Wall Co enquiry — '+data.get('occasion'),_template:'table',_url:'https://the-event-wall-co.vercel.app/',_honey:''};
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),25000);
 try{
  const response=await fetch('https://formsubmit.co/ajax/theeventwallco@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
  const result=await response.json();
  console.info('Enquiry delivery service:',response.status,result.message||'No status message');
  if(/activat|confirm your email/i.test(result.message||'')){
   status.className='error';status.textContent='Our online form is being connected. Please email us directly for now.';fallback.hidden=false;
  }else{
   if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Delivery service did not accept the enquiry.');
   status.className='success';status.textContent='Thank you — your enquiry has been submitted. We’ll reply to the email address you provided.';enquiryForm.reset();
  }
 }catch{
  status.className='error';status.textContent='We couldn’t confirm your enquiry was sent. Please try again or email us directly.';fallback.hidden=false;
 }finally{
  clearTimeout(timer);button.disabled=false;button.innerHTML='Send my enquiry <span aria-hidden="true">↗︎</span>';enquiryForm.removeAttribute('aria-busy');status.focus();
 }
});
document.querySelector('#year').textContent=now.getFullYear();
