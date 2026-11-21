/* SAEED v34: approved slogan vector upgrade only. The v33 flyer and all cards/dots remain unchanged. */
(function(){
'use strict';
const preceding=window.SaeedHQ31;
if(!preceding||!preceding.preparePDF||!preceding.loadPage){console.error('SAEED flyer v33 not loaded');return;}
let finalPDFPromise=null;
const refs=[36,9,37,39,41,43,45,70,71,86,114,116,118,120,122,123,124,125,136,137,139,141,142];
const page13='<</Type/Page/Contents['+refs.map(n=>n+' 0 R').join(' ')+']/Resources<</Font 10 0 R/ProcSet[/PDF/Text/ImageB/ImageC/ImageI]/XObject<</FormXob.bbb8cc5c5a1868905e9394627b47fad6 12 0 R/fzImg0 38 0 R/fzImg1 40 0 R/fzImg2 42 0 R/fzImg3 44 0 R/fzFrm0 85 0 R/fzImg4 113 0 R/fzFrm1 115 0 R/fzImg5 117 0 R/fzImg6 119 0 R/fzImg7 121 0 R/fzFrm2 135 0 R/Slogan32 138 0 R>>>>/MediaBox[0 0 419.5276 595.2756]/Rotate 0/Parent 2 0 R>>';
async function getVectorContent(){
 const r=await fetch('/flyer-slogan-v34-pdf.b64?v=34');
 if(!r.ok)throw Error('Missing SAEED vector overlay');
 const t=(await r.text()).trim();
 if(t.length!==44276)throw Error('Unexpected SAEED vector overlay length');
 const compressed=Uint8Array.from(atob(t),c=>c.charCodeAt(0));
 const bytes=new Uint8Array(await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer());
 if(bytes.length!==105682)throw Error('SAEED vector overlay checksum mismatch');
 return bytes;
}
function mergePDF(source,vector){
 if(source.length!==14872036)throw Error('Unexpected SAEED v33 PDF version; refusing unsafe edit');
 const tail=new TextDecoder().decode(source.slice(-700));
 const match=/startxref\s+(\d+)\s+%%EOF\s*$/.exec(tail);
 if(!match||Number(match[1])!==14871864)throw Error('Unexpected SAEED PDF cross reference');
 const encoder=new TextEncoder(),parts=[source];
 let offset=source.length;
 function add(value){const v=typeof value==='string'?encoder.encode(value):value;parts.push(v);offset+=v.length;}
 add('\n');const pagePos=offset;add('13 0 obj\n'+page13+'\nendobj\n');
 const streamPos=offset;add('142 0 obj\n<</Length '+vector.length+'>>\nstream\n');add(vector);add('endstream\nendobj\n');
 const xrefPos=offset;
 add('xref\n13 1\n'+String(pagePos).padStart(10,'0')+' 00000 n \n142 1\n'+String(streamPos).padStart(10,'0')+' 00000 n \n'+
 'trailer\n<</Size 143/Root 1 0 R/Prev 14871864>>\nstartxref\n'+xrefPos+'\n%%EOF\n');
 return URL.createObjectURL(new Blob(parts,{type:'application/pdf'}));
}
function preparePDF(){
 if(!finalPDFPromise)finalPDFPromise=(async()=>{
  const [old,vector]=await Promise.all([preceding.preparePDF(),getVectorContent()]);
  const b=new Uint8Array(await(await fetch(old)).arrayBuffer());
  return mergePDF(b,vector);
 })().catch(err=>{finalPDFPromise=null;throw err});
 return finalPDFPromise;
}
window.SaeedHQ31={loadPage:preceding.loadPage,preparePDF};
// The browser preview keeps every existing page pixel unchanged except the white slogan zone.
// New lettering stays a true SVG overlay and never becomes a low-resolution JPEG/PNG.
function installVectorOverlay(){
 const frame=document.getElementById('flyer-page-frame');
 const oldImg=document.getElementById('flyer-page-image');
 if(!frame||!oldImg)return;
 frame.style.position='relative';
 const layer=document.createElement('div');
 layer.id='saeed-v34-vector-slogan';
 layer.setAttribute('aria-hidden','true');
 layer.style.cssText='position:absolute;inset:0;z-index:3;pointer-events:none;display:none';
 const mask=document.createElement('div');
 mask.style.cssText='position:absolute;left:5.94955%;top:39.91431%;width:88.09856%;height:10.96632%;background:#fff';
 const svg=document.createElement('img');
 svg.src='/flyer-slogan-vector-v34.svg?v=34';
 svg.alt='';
 svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block;border:0;pointer-events:none';
 layer.appendChild(mask);layer.appendChild(svg);frame.appendChild(layer);
 let ready=false;
 function show(){const a=oldImg.alt||'';const back=a.indexOf('الخلفي')>=0||a.indexOf('Back')>=0;
 layer.style.display=ready&&back&&oldImg.style.display!=='none'&&oldImg.complete?'block':'none';}
 svg.addEventListener('load',()=>{ready=true;show();});
 svg.addEventListener('error',()=>{ready=false;layer.style.display='none';console.warn('SAEED crisp type overlay unavailable');});
 oldImg.addEventListener('load',show);
 new MutationObserver(show).observe(oldImg,{attributes:true,attributeFilter:['alt','src','style']});
 show();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installVectorOverlay,{once:true});
else installVectorOverlay();
})();