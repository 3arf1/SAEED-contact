/* SAEED v33 — approved copy and typography only; keep original layout. */
(function(){
'use strict';
const W=405,H=627,S=3;
const slots={
cta_ar:[0,0,87.33,18.67],cta_en:[0,56,93.67,13.33],
heading_ar:[0,96,102,21],heading_en:[0,159,135,20],
services_ar:[0,219,47,13.33],services_en:[0,259,57.67,13.33],
about_ar:[0,299,57,17],about_en:[0,350,62.67,13.33],
pdf_ar:[0,390,53.33,16.33],pdf_en:[0,439,66.33,13.33],
"100":[0,479,35.67,12.33],"150":[0,516,34.67,12.33],
"200":[0,553,38,12.33],"250":[0,590,37,12.33]
};
const literal={
cta_ar:"عرض الخدمات",cta_en:"View Services",
heading_ar:"دليل الخدمات",heading_en:"Services guide",
services_ar:"الخدمات",services_en:"Services",
about_ar:"عن المركز",about_en:"About us",
pdf_ar:"عرض PDF",pdf_en:"View PDF"
};
function toBytes(s){const binary=atob(s),b=new Uint8Array(binary.length);for(let i=0;i<b.length;i++)b[i]=binary.charCodeAt(i);return b}
function inkSprite(bytes){
if(bytes.length!==Math.ceil(W*H/8))throw Error('SAEED type asset mismatch');
const c=document.createElement('canvas');c.width=W;c.height=H;const ctx=c.getContext('2d',{willReadFrequently:true}),im=ctx.createImageData(W,H);
for(let i=0;i<W*H;i++){const j=i*4,ink=(bytes[i>>3]>>(7-(i&7)))&1;im.data[j+3]=ink?255:0}
ctx.putImageData(im,0,0);return c
}
function glyph(key,src){
const item=slots[key];if(!item)return document.createTextNode(literal[key]||key);
const g=document.createElement('span');
g.className='saeed-typography-glyph';
g.setAttribute('role','img');g.setAttribute('aria-label',literal[key]||key+'%');
g.style.display='inline-block';g.style.verticalAlign='middle';g.style.flex='none';
g.style.width=item[2]+'px';g.style.height=item[3]+'px';
g.style.backgroundImage='url("'+src+'")';
g.style.backgroundRepeat='no-repeat';
g.style.backgroundSize=(W/S)+'px '+(H/S)+'px';
g.style.backgroundPosition='0px -'+(item[1]/S)+'px';
return g;
}
function apply(canvas){
const src=canvas.toDataURL('image/png');
const style=document.createElement('style');
style.textContent='html[data-theme="dark"] .saeed-typography-glyph{filter:invert(1)}'+
'html[data-theme="light"] .saeed-typography-glyph{filter:none}'+
'#flyer-viewer .flyer-tabs button[aria-pressed="true"] .saeed-typography-glyph{filter:invert(1)!important}';
document.head.append(style);
for(const [key,lang] of [['cta_ar','ar'],['cta_en','en']]){
 const el=document.querySelector('.flyer-card .flyer-caption img.word.'+lang);
 if(!el)continue;
 const q=slots[key],w=Math.round(q[2]*S),h=Math.round(q[3]*S);
 const c=document.createElement('canvas');c.width=w;c.height=h;
 c.getContext('2d').drawImage(canvas,0,q[1],w,h,0,0,w,h);
 el.src=c.toDataURL('image/png');
 el.alt=literal[key];el.width=Math.round(q[2]);el.height=Math.round(q[3]);
 el.style.width=q[2]+'px';el.style.height=q[3]+'px';
}
const configs=[
['#flyer-heading','heading'],
['.flyer-tabs button[data-flyer-page="0"]','services'],
['.flyer-tabs button[data-flyer-page="1"]','about'],
['#flyer-download','pdf']
];
for(const [selector,k] of configs){
const root=document.querySelector(selector);
if(!root)continue;
for(const lang of ['ar','en']){
const slot=root.querySelector('.flyer-'+lang);
if(slot)slot.replaceChildren(glyph(k+'_'+lang,src));
}
}
const zoom=document.getElementById('flyer-scale');
if(zoom){
 const render=()=>{const m=zoom.textContent.trim().match(/^(100|150|200|250)%$/);if(m)zoom.replaceChildren(glyph(m[1],src))};
 new MutationObserver(render).observe(zoom,{childList:true,characterData:true,subtree:true});render();
}
}
async function run(){
const r=await fetch('/ui-glyphs-v33.b64?v=33',{cache:'force-cache'});
if(!r.ok)throw Error('SAEED typography HTTP '+r.status);
const encoded=(await r.text()).trim();
if(encoded.length!==7556)throw Error('SAEED typography asset length');
let hash=0;for(const c of encoded)hash=(Math.imul(hash,31)+c.charCodeAt(0))>>>0;
if(hash!==4140033896)throw Error('SAEED typography asset checksum');
const b=toBytes(encoded);
const stream=new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate'));
const raw=new Uint8Array(await new Response(stream).arrayBuffer());
apply(inkSprite(raw));
}
run().catch(e=>console.warn('SAEED: original copy preserved if typography asset unavailable',e));
})();