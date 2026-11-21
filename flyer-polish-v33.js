/* SAEED v33: approved flyer contrast and corner-dot alignment only. */
(function flyerPolishV33(){
'use strict';
if(!window.SaeedHQ31)throw Error('SAEED v32 flyer prerequisite is unavailable');
const original=window.SaeedHQ31;
const PW=419.5276,PH=595.2756;
const patterns=[
  [[4.25,20.5,112,571,[6.9,12.25,17.6]],[400.1,417.8,129.5,571,[403.6,408.95,414.3]]],
  [[4.25,20.5,241.5,564.7,[6.9,12.25,17.6]],[400.1,417.8,241.5,564.7,[403.6,408.95,414.3]]]
];
const baseBlue=[104,128,146],blueText=[71,99,122];
const content0=[8,17,19,21,23,25,27,29,31,33,35,47,49,51,53,55,57,59,61,63,65,69,72,76,77,78,79,80,92,96,112,131,132];
const content1=[36,9,37,39,41,43,45,70,71,86,114,116,118,120,122,123,124,125,136,137,139];
let maskPromise=null,frontPage=null,backPage=null,polishedPDF=null;
function dotsPDF(page){
 let s='';const r=.49,k=.5522847498*r;
 for(const [x0,x1,y0,y1,cols] of patterns[page]){
  s+=`q 1 1 1 rg ${x0.toFixed(3)} ${(PH-y1).toFixed(3)} ${(x1-x0).toFixed(3)} ${(y1-y0).toFixed(3)} re f Q\n`;
  const step=5.38,rows=Math.floor((y1-y0)/step)+1;
  for(let i=0;i<rows;i++){
   const y=y0+i*step,dist=Math.min(y-y0,y1-y);
   const fade=.28+.58*Math.max(0,1-Math.min(dist,70)/70),yc=PH-y;
   for(let j=0;j<3;j++){
    const x=cols[j],f=fade*(j===1?1:.85);
    const rgb=baseBlue.map(v=>((255-(255-v)*f)/255).toFixed(5)).join(' ');
    s+=`q ${rgb} rg ${(x+r).toFixed(3)} ${yc.toFixed(3)} m `+
    `${(x+r).toFixed(3)} ${(yc+k).toFixed(3)} ${(x+k).toFixed(3)} ${(yc+r).toFixed(3)} ${x.toFixed(3)} ${(yc+r).toFixed(3)} c `+
    `${(x-k).toFixed(3)} ${(yc+r).toFixed(3)} ${(x-r).toFixed(3)} ${(yc+k).toFixed(3)} ${(x-r).toFixed(3)} ${yc.toFixed(3)} c `+
    `${(x-r).toFixed(3)} ${(yc-k).toFixed(3)} ${(x-k).toFixed(3)} ${(yc-r).toFixed(3)} ${x.toFixed(3)} ${(yc-r).toFixed(3)} c `+
    `${(x+k).toFixed(3)} ${(yc-r).toFixed(3)} ${(x+r).toFixed(3)} ${(yc-k).toFixed(3)} ${(x+r).toFixed(3)} ${yc.toFixed(3)} c f Q\n`;
   }
  }
 }
 return s;
}
const sloganPDF='q 1 1 1 rg 24.96 292.3956 369.6 65.28 re f Q\n'+
'q 24.96 326.2756 369.6 31.4 re W n 0 0 0 rg 369.6 0 0 65.28 24.96 292.3956 cm /Slogan32 Do Q\n'+
'q 24.96 292.3956 369.6 33.88 re W n .278 .388 .478 rg 369.6 0 0 65.28 24.96 292.3956 cm /Slogan32 Do Q\n';
function composePDF(base){
 if(base.length!==14661066)throw Error('Unexpected base PDF version: '+base.length);
 const tail=new TextDecoder().decode(base.slice(-700));
 if(!/startxref\s+14660845\s+%%EOF\s*$/.test(tail))throw Error('Unexpected v32 PDF version; refusing unsafe patch');
 const encoder=new TextEncoder(),chunks=[base],offsets={};let offset=base.length;
 function add(v){const b=encoder.encode(v);chunks.push(b);offset+=b.length;}
 function obj(n,body){offsets[n]=offset;add(n+' 0 obj\n'+body+'\nendobj\n');}
 function stream(n,body){offsets[n]=offset;add(n+' 0 obj\n<</Length '+encoder.encode(body).length+'>>\nstream\n'+body+'endstream\nendobj\n');}
 const refs=items=>items.map(x=>x+' 0 R').join(' ');
 const page0='<</Type/Page/MediaBox[0 0 419.5276 595.2756]/Rotate 0/Resources 3 0 R/Parent 2 0 R/Contents['+refs([...content0,140])+']>>';
 const page1='<</Type/Page/Contents['+refs([...content1,141])+']/Resources<</Font 10 0 R/ProcSet[/PDF/Text/ImageB/ImageC/ImageI]/XObject<</FormXob.bbb8cc5c5a1868905e9394627b47fad6 12 0 R/fzImg0 38 0 R/fzImg1 40 0 R/fzImg2 42 0 R/fzImg3 44 0 R/fzFrm0 85 0 R/fzImg4 113 0 R/fzFrm1 115 0 R/fzImg5 117 0 R/fzImg6 119 0 R/fzImg7 121 0 R/fzFrm2 135 0 R/Slogan32 138 0 R>>>>/MediaBox[0 0 419.5276 595.2756]/Rotate 0/Parent 2 0 R>>';
 add('\n');obj(4,page0);obj(13,page1);stream(140,dotsPDF(0));stream(141,dotsPDF(1)+sloganPDF);
 const startxref=offset,line=n=>String(offsets[n]).padStart(10,'0')+' 00000 n \n';
 add('xref\n4 1\n'+line(4)+'13 1\n'+line(13)+'140 2\n'+line(140)+line(141)+
     'trailer\n<</Size 142/Root 1 0 R/Prev 14660845>>\nstartxref\n'+startxref+'\n%%EOF\n');
 return URL.createObjectURL(new Blob(chunks,{type:'application/pdf'}));
}
async function sloganCanvas(){
 if(!maskPromise)maskPromise=(async()=>{
  const r=await fetch('/flyer-v32-slogan-mask.b64?v=32');
  if(!r.ok)throw Error('Missing approved text mask');
  const encoded=(await r.text()).trim();const b=Uint8Array.from(atob(encoded),c=>c.charCodeAt(0));
  const raw=new Uint8Array(await new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer());
  const MW=1540,MH=272,ROW=193;
  if(raw.length!==ROW*MH)throw Error('Invalid v32 slogan mask');
  const canvas=document.createElement('canvas');canvas.width=MW;canvas.height=MH;
  const ctx=canvas.getContext('2d'),im=ctx.createImageData(MW,MH);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
   const ink=(raw[y*ROW+(x>>3)]>>(7-(x&7)))&1,i=4*(y*MW+x);
   const rgb=ink?(237.6+y*65.28/MH<269?[0,0,0]:blueText):[255,255,255];
   im.data[i]=rgb[0];im.data[i+1]=rgb[1];im.data[i+2]=rgb[2];im.data[i+3]=255;
  }
  ctx.putImageData(im,0,0);return canvas;
 })().catch(err=>{maskPromise=null;throw err});
 return maskPromise;
}
function drawDots(ctx,page,sw,sh){
 const sx=sw/PW,sy=sh/PH;
 for(const [x0,x1,y0,y1,cols] of patterns[page]){
  ctx.fillStyle='#fff';ctx.fillRect(x0*sx,y0*sy,(x1-x0)*sx,(y1-y0)*sy);
  const step=5.38, rows=Math.floor((y1-y0)/step)+1;
  for(let i=0;i<rows;i++){
   const y=y0+i*step,dist=Math.min(y-y0,y1-y),fade=.28+.58*Math.max(0,1-Math.min(dist,70)/70);
   for(let j=0;j<3;j++){
    const x=cols[j],f=fade*(j===1?1:.85);
    const color=baseBlue.map(v=>Math.round(255-(255-v)*f));
    ctx.fillStyle='rgb('+color.join(',')+')';
    ctx.beginPath();ctx.ellipse(x*sx,y*sy,.49*sx,.49*sy,0,0,Math.PI*2);ctx.fill();
   }
  }
 }
}
async function loadPage(page){
 if(page!==0&&page!==1)throw Error('Unknown flyer page');
 if(page===0&&frontPage)return frontPage;
 if(page===1&&backPage)return backPage;
 const work=(async()=>{
  const url=await original.loadPage(page),img=new Image();img.src=url;await img.decode();
  const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
  const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
  drawDots(ctx,page,canvas.width,canvas.height);
  if(page===1){
   const strip=await sloganCanvas();
   ctx.drawImage(strip,24.96/PW*canvas.width,237.6/PH*canvas.height,369.6/PW*canvas.width,65.28/PH*canvas.height);
  }
  const result=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Could not render flyer preview')),'image/png'));
  return URL.createObjectURL(result);
 })();
 if(page===0)frontPage=work;else backPage=work;
 return work.catch(e=>{if(page===0)frontPage=null;else backPage=null;throw e});
}
function preparePDF(){
 if(!polishedPDF)polishedPDF=(async()=>{
  const url=await original.preparePDF();
  const bytes=new Uint8Array(await(await fetch(url)).arrayBuffer());
  return composePDF(bytes);
 })().catch(e=>{polishedPDF=null;throw e});
 return polishedPDF;
}
window.SaeedHQ31={loadPage,preparePDF};
})();
