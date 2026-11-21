/* SAEED v47 — normalize ONLY the vivid-blue side dots to surrounding muted-dot opacity.
   Does not modify layout, typography, images, services, brand colors or QR destination. */
(function(){
'use strict';
const prev=window.SaeedHQ31;
if(!prev?.preparePDF || !prev?.loadPage) throw Error('SAEED approved v46 is required');
const PDF_W=419.5276,PDF_H=595.2756;
const DOTS=[
[27.2,454.2],[43.1,454.3],[59.2,454.3],
[27.3,477.9],[43.0,478.0],[59.2,478.0],
[27.0,501.0],[43.1,500.9],[59.0,501.0],
[27.1,523.7],[43.2,523.5],[59.1,523.6],
[1623,523.8],[1639,523.8],[1655,524],
[1623,2249.2],[1638.9,2249.7],[1655.4,2249.5],
[28,2254],[45,2254],[61.5,2254],
[28,2280],[45,2280],[62.8,2280]
];
function circ(x,y,r){
 const k=.5522847498307936, v=n=>Number(n.toFixed(4));
 return v(x+r)+' '+v(y)+' m\n'+
 v(x+r)+' '+v(y+k*r)+' '+v(x+k*r)+' '+v(y+r)+' '+v(x)+' '+v(y+r)+' c\n'+
 v(x-k*r)+' '+v(y+r)+' '+v(x-r)+' '+v(y+k*r)+' '+v(x-r)+' '+v(y)+' c\n'+
 v(x-r)+' '+v(y-k*r)+' '+v(x-k*r)+' '+v(y-r)+' '+v(x)+' '+v(y-r)+' c\n'+
 v(x+k*r)+' '+v(y-r)+' '+v(x+r)+' '+v(y-k*r)+' '+v(x+r)+' '+v(y)+' c\nh f\n';
}
const VECTORS='q\n'+DOTS.map(([px,py])=>{
 const x=px/4, y=PDF_H-py/4;
 return '1 1 1 rg\n'+circ(x,y,1.35)+'.57 .69 .76 rg\n'+circ(x,y,.47);
}).join('')+'Q\n';
const encoder=new TextEncoder();
function appendPageStream(old){
 const decoded=new TextDecoder('latin1').decode(old);
 const pageStart=decoded.lastIndexOf('\n4 0 obj\n');
 if(pageStart<0) throw Error('Missing approved PDF front-page object');
 const close=decoded.indexOf('\nendobj',pageStart);
 if(close<0 || close-pageStart>18000) throw Error('Invalid front-page PDF object');
 const original=decoded.slice(pageStart+'\n4 0 obj\n'.length,close);
 if(!original.includes('/Type/Page')||!original.includes('/Contents[')) throw Error('Unexpected PDF front page');
 const newer=original.replace(/\/Contents\[([^\]]+)\]/,(_,contents)=>'/Contents['+contents+' 151 0 R]');
 if(newer===original||!newer.includes('151 0 R')) throw Error('Cannot add fade overlay');
 const trailer=/startxref\s+(\d+)\s+%%EOF\s*$/.exec(decoded.slice(-500));
 if(!trailer)throw Error('PDF trailer is unavailable');
 const parts=[old],offsets={};let length=old.length;
 const add=t=>{const a=typeof t==='string'?encoder.encode(t):t;parts.push(a);length+=a.length};
 const obj=(id,body)=>{offsets[id]=length;add(id+' 0 obj\n'+body+'\nendobj\n')};
 add('\n');obj(4,newer);
 obj(151,'<</Length '+encoder.encode(VECTORS).length+'>>\nstream\n'+VECTORS+'endstream');
 const xref=length,offset=id=>String(offsets[id]).padStart(10,'0')+' 00000 n \n';
 add('xref\n4 1\n'+offset(4)+'151 1\n'+offset(151)+
  'trailer\n<</Size 152/Root 1 0 R/Prev '+trailer[1]+'>>\nstartxref\n'+xref+'\n%%EOF\n');
 return new Blob(parts,{type:'application/pdf'});
}
let pdfPromise=null,frontPromise=null;
function preparePDF(){
 if(!pdfPromise)pdfPromise=(async()=>{
  const oldUrl=await prev.preparePDF();
  const data=new Uint8Array(await(await fetch(oldUrl)).arrayBuffer());
  return URL.createObjectURL(appendPageStream(data));
 })().catch(e=>{pdfPromise=null;throw e});
 return pdfPromise;
}
function fadeBrightDots(canvas,band=false){
 const w=canvas.width,h=canvas.height,ctx=canvas.getContext('2d',{willReadFrequently:true});
 const data=ctx.getImageData(0,0,w,h).data,checked=new Uint8Array(w*h);
 const candidates=[];
 const bright=(i)=>{
  const k=i*4,r=data[k],g=data[k+1],b=data[k+2];
  return b-r>82 && b-g>39 && r<215 && b>180;
 };
 const relevant=(x,y)=>{
  const nx=x/w,ny=band ? (y/h)*.2237619 : y/h;
  return (nx<.055 || nx>.947) &&
    ((ny>.177&&ny<.245)||(ny>.923&&ny<.977));
 };
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  if(!relevant(x,y))continue;
  const index=y*w+x;
  if(checked[index]||!bright(index))continue;
  let stack=[index],count=0,sx=0,sy=0;checked[index]=1;
  while(stack.length&&count<300){
   const v=stack.pop(),xx=v%w,yy=(v/w)|0;
   count++;sx+=xx;sy+=yy;
   for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){
    if(!i&&!j)continue;
    const nx=xx+i,ny=yy+j,k=ny*w+nx;
    if(nx<0||nx>=w||ny<0||ny>=h||checked[k]||!relevant(nx,ny)||!bright(k))continue;
    checked[k]=1;stack.push(k);
   }
  }
  if(count>=1 && count<Math.max(16,90*(w/1679)**2))candidates.push([sx/count,sy/count]);
 }
 const scale=w/1679;
 for(const [x,y] of candidates){
  ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(x,y,Math.max(1.35,5.4*scale),0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#91b0c2';ctx.beginPath();ctx.arc(x,y,Math.max(.47,1.88*scale),0,Math.PI*2);ctx.fill();
 }
 return candidates.length;
}
async function patchedImage(src,isBand){
 const bmp=await createImageBitmap(await(await fetch(src)).blob());
 const canvas=document.createElement('canvas');canvas.width=bmp.width;canvas.height=bmp.height;
 canvas.getContext('2d').drawImage(bmp,0,0);bmp.close();
 fadeBrightDots(canvas,isBand);
 const blob=await new Promise((yes,no)=>canvas.toBlob(b=>b?yes(b):no(Error('dot preview failed')),'image/png'));
 return URL.createObjectURL(blob);
}
function loadPage(n){
 if(n!==0)return prev.loadPage(n);
 if(!frontPromise)frontPromise=(async()=>{
  const src=await prev.loadPage(0);
  return patchedImage(src,false);
 })().catch(e=>{frontPromise=null;throw e});
 return frontPromise;
}
window.SaeedHQ31={preparePDF,loadPage};
async function onBandLoad(ev){
 const band=ev.target;
 if(!band||band.id!=='saeed-v37-clean-top-band')return;
 if(band.dataset.dotsV47)return;
 band.dataset.dotsV47='processing';
 try{
  const url=await patchedImage(band.src,true);
  band.src=url;
  band.dataset.dotsV47='done';
 }catch(e){delete band.dataset.dotsV47;console.warn('SAEED dots: top band',e)}
}
document.addEventListener('load',onBandLoad,true);
})();