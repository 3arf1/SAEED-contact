/* SAEED v37 — original clean card borders + seamless copper/blue wave.
   No services, text, logos, QR or layout changes. Wraps approved v36 and is version-checked. */
(function(){
'use strict';
const preceding=window.SaeedHQ31;
if(!preceding||!preceding.preparePDF)throw Error('SAEED flyer v36 missing');
const PAGE4="<</Type/Page/MediaBox[0 0 419.5276 595.2756]/Rotate 0/Resources 3 0 R/Parent 2 0 R/Contents[8 0 R 17 0 R 19 0 R 21 0 R 23 0 R 25 0 R 27 0 R 29 0 R 31 0 R 33 0 R 35 0 R 47 0 R 49 0 R 51 0 R 53 0 R 55 0 R 57 0 R 59 0 R 61 0 R 63 0 R 65 0 R 69 0 R 72 0 R 76 0 R 77 0 R 78 0 R 79 0 R 80 0 R 92 0 R 96 0 R 112 0 R 131 0 R 132 0 R]>>";
const PAGE13="<</Type/Page/Contents[36 0 R 9 0 R 37 0 R 39 0 R 41 0 R 43 0 R 45 0 R 70 0 R 71 0 R 86 0 R 114 0 R 116 0 R 118 0 R 120 0 R 122 0 R 123 0 R 124 0 R 125 0 R 136 0 R 137 0 R 139 0 R 142 0 R]/Resources<</Font 10 0 R/ProcSet[/PDF/Text/ImageB/ImageC/ImageI]/XObject<</FormXob.bbb8cc5c5a1868905e9394627b47fad6 12 0 R/fzImg0 38 0 R/fzImg1 40 0 R/fzImg2 42 0 R/fzImg3 44 0 R/fzFrm0 85 0 R/fzImg4 113 0 R/fzFrm1 115 0 R/fzImg5 117 0 R/fzImg6 119 0 R/fzImg7 121 0 R/fzFrm2 135 0 R/Slogan32 138 0 R>>>>/MediaBox[0 0 419.5276 595.2756]/Rotate 0/Parent 2 0 R>>";
const FORM_HEAD="<</Type/XObject/Subtype/Form/BBox[0 0 419.5276 595.2756]/Matrix[1 0 0 1 0 0]/Resources<</Font 126 0 R/ProcSet[/PDF/Text/ImageB/ImageC/ImageI]/XObject<</FormXob.4b9c8e28b3fc654b82195f875d34b2bd 128 0 R>>>>/Length 1104>>";
const WAVE="1 0 0 1 0 0 cm  BT /F1 12 Tf 14.4 TL ET\nq\n.499438 0 0 -0.499812 0 595.2761 cm\n1 1 1 rg\nn 0 0 840 222 re f*\nn 40 222 800 32 re f*\n.72549 .509804 .301961 rg\nn 550 0 m 563 0 l 480 43 416 97 401 146 c 395 163 402 180 430 190 c 399 181 392 159 399 137 c 420 85 481 36 550 0 c h\nf*\n.72549 .509804 .301961 rg\nn 56 249 m 230 185 361 178 433 194 c 340 193 208 201 56 249 c h\nf*\n.282353 .462745 .572549 rg\nn 433 194 m 567 196 655 242 735 236 c 782 234 814 222 840 207 c 840 212 l 789 253 730 263 666 245 c 576 216 518 197 433 194 c h\nf*\nq\nn 561 0 m 840 0 l 840 208 l 751 260 664 222 544 202 c 499 194 461 190 430 190 c 408 178 400 160 405 145 c 419 95 482 42 561 0 c h W* n\n1 0 0 -1 404 251.1185 cm\nq\n436 0 0 318.1185 0 0 cm\n/FormXob.4b9c8e28b3fc654b82195f875d34b2bd Do\nQ\nQ\n1 1 1 RG\n1.3 w\nn 430 190 m 461 190 499 194 544 202 c 664 222 751 260 840 208 c\nS\n1 1 1 rg\nn 0 1142 840 49 re f*\nn 40 1132 760 13 re f*\n.282353 .462745 .572549 rg\nn 0 1160 m 123 1187 235 1184 400 1160 c 280 1186 239 1191 0 1191 c h\nf*\n.72549 .509804 .301961 rg\nn 245 1191 m 450 1155 613 1135 840 1160 c 656 1145 505 1166 361 1191 c h\nf*\nQ\n \n";
const FILE_SIZE=14984371, EXPECTED_SHA="ed1509911587dea0a9ce48b61b2336a7a66d16a14383f35cb7da21f9ddef1292";
const EXPECTED_TOP_SIZE=249018;
let pdfPromise=null,previewPromises=[null,null],topUrlPromise=null;

function pdfPatch(base){
  if(base.length!==FILE_SIZE)throw Error('SAEED v36 file size mismatch');
  const tail=new TextDecoder().decode(base.slice(-1300));
  const m=/startxref\s+(\d+)\s+%%EOF\s*$/.exec(tail);
  if(!m||Number(m[1])!==14984199)throw Error('Unexpected SAEED v36 PDF trailer');
  const encoder=new TextEncoder(), chunks=[base], offsets={};let offset=base.length;
  function add(value){const bytes=typeof value==='string'?encoder.encode(value):value;chunks.push(bytes);offset+=bytes.length;}
  function obj(n,body){offsets[n]=offset;add(n+' 0 obj\n'+body+'\nendobj\n');}
  add('\n');obj(4,PAGE4);obj(13,PAGE13);
  offsets[129]=offset;
  add('129 0 obj\n'+FORM_HEAD+'\nstream\n');add(WAVE);add('endstream\nendobj\n');
  const startxref=offset, line=n=>String(offsets[n]).padStart(10,'0')+' 00000 n \n';
  add('xref\n4 1\n'+line(4)+'13 1\n'+line(13)+'129 1\n'+line(129)+
      'trailer\n<</Size 146/Root 1 0 R/Prev 14984199>>\nstartxref\n'+startxref+'\n%%EOF\n');
  return new Blob(chunks,{type:'application/pdf'});
}
function preparePDF(){
 if(!pdfPromise)pdfPromise=(async()=>{
  const old=await preceding.preparePDF();
  const bytes=new Uint8Array(await(await fetch(old)).arrayBuffer());
  const final=pdfPatch(bytes);
  if(window.crypto?.subtle){
    const b=await final.arrayBuffer(),digest=await crypto.subtle.digest('SHA-256',b);
    const sha=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');
    if(sha!==EXPECTED_SHA)throw Error('SAEED print PDF checksum verification failed');
  }
  return URL.createObjectURL(final);
 })().catch(err=>{pdfPromise=null;throw err});
 return pdfPromise;
}
async function fetchB64(path,len,sha){
 const r=await fetch(path);if(!r.ok)throw Error('Missing flyer preview '+path);
 const t=(await r.text()).trim();
 const arr=Uint8Array.from(atob(t),c=>c.charCodeAt(0));
 if(arr.length!==len)throw Error('Incorrect flyer preview size '+path);
 if(sha&&window.crypto?.subtle){
   const b=await crypto.subtle.digest('SHA-256',arr),actual=Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
   if(actual!==sha)throw Error('Flyer preview checksum mismatch '+path);
 }
 return URL.createObjectURL(new Blob([arr],{type:'image/webp'}));
}
function loadPage(p){
 if(p!==0&&p!==1)return Promise.reject(Error('Unknown flyer page'));
 if(!previewPromises[p]){
   previewPromises[p]=fetchB64(p===0?'/flyer-v31-front.b64?v=31':'/flyer-v31-back.b64?v=31',
    p===0?483150:505776,
    p===0?'50c492c63ba06ea61ddd2120573c7c1b4130bf79952ec76bce007c0722aa9999':'80a79b0279a5561421b5b479360440293c73f0f3aa903a35feee3587f6994f2e')
    .catch(e=>{previewPromises[p]=null;throw e});
 }
 return previewPromises[p];
}
function topBand(){
 if(!topUrlPromise)topUrlPromise=fetchB64('/flyer-top-clean-v37.webp.b64?v=37',EXPECTED_TOP_SIZE,null)
  .catch(e=>{topUrlPromise=null;throw e});
 return topUrlPromise;
}
window.SaeedHQ31={preparePDF,loadPage};
function installViewer(){
 const frame=document.getElementById('flyer-page-frame');
 const originalImage=document.getElementById('flyer-page-image');
 if(!frame||!originalImage)return;
 const style=document.createElement('style');
 style.id='saeed-v37-suppress-old-card-borders';
 style.textContent='svg[id^="saeed-v36-card-borders-"]{display:none!important;}';
 document.head.appendChild(style);
 frame.style.position='relative';
 const band=document.createElement('img');
 band.id='saeed-v37-clean-top-band';
 band.setAttribute('aria-hidden','true');band.alt='';
 band.style.cssText='position:absolute;left:0;top:0;width:100%;height:22.376190%;object-fit:fill;z-index:7;display:none;pointer-events:none;border:0;';
 frame.appendChild(band);
 let ready=false;
 function update(){
   const alt=originalImage.alt||'',back=alt.includes('الخلفي')||alt.includes('Back');
   band.style.display=ready&&!back&&originalImage.style.display!=='none'&&originalImage.complete?'block':'none';
 }
 topBand().then(url=>{band.src=url;},e=>console.warn('SAEED top photo/wave preview',e));
 band.addEventListener('load',()=>{ready=true;update()});
 band.addEventListener('error',()=>{ready=false;update()});
 originalImage.addEventListener('load',update);
 new MutationObserver(update).observe(originalImage,{attributes:true,attributeFilter:['alt','src','style']});
 update();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installViewer,{once:true});
else installViewer();
})();