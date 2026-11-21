/* SAEED v43: approved text-only refinements for PDF and online flyer. */
(function(){
'use strict';
const prev=window.SaeedHQ31;if(!prev?.preparePDF||!prev?.loadPage)throw Error('SAEED v38 required');
const W=419.5276,H=595.2756,patches=[{x:115,y:970,w:1455,h:238,id:'TXT43',obj:149},{x:652,y:2008,w:922,h:227,id:'INF43',obj:150}];
let patchesPromise,pdfPromise,backPromise;
function makePatch(p,i){
 const c=document.createElement('canvas');c.width=p.w;c.height=p.h;
 const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle=i===0?'#ffffff':'#f7f7f7';ctx.fillRect(0,0,p.w,p.h);
 ctx.textAlign='center';ctx.textBaseline='middle';
 const line=(s,y,size,color,ar)=>{
  ctx.fillStyle=color;ctx.direction=ar?'rtl':'ltr';
  let z=size;do{ctx.font=(ar?'normal ':'500 ')+z+'px '+(ar?'"TheSans",Tahoma,Arial,sans-serif':'"Gotham",Arial,sans-serif');if(ctx.measureText(s).width<p.w-54||z<22)break;z--}while(true);
  ctx.fillText(s,p.w/2,y);
 };
 if(i===0){
  line('مركز الشارقة لخدمات المستثمرين (سعيد)',34,48,'#1c1c1c',true);
  line('خطوتك الكاملة لإنجاز معاملاتك بخطوات سلسة واحترافية.',92,48,'#1c1c1c',true);
  line('Your all-in-one solution for completing your transactions',160,38,'#4d6b85',false);
  line('with ease and professionalism.',199,38,'#4d6b85',false);
 }else{
  line('امسح الرمز للفروع وطرق التواصل',52,42,'#1f1f1f',true);
  line('وأوقات العمل.',96,42,'#1f1f1f',true);
  line('Scan the code for branches, contact',154,31,'#6c8799',false);
  line('details, and opening hours.',189,31,'#6c8799',false);
 }
 return c;
}
function images(){if(!patchesPromise)patchesPromise=Promise.resolve().then(()=>patches.map(makePatch));return patchesPromise}
function updatePage(old){
 const matches=[...old.matchAll(/13 0 obj\s*([\s\S]*?)\s*endobj/g)],m=matches[matches.length-1];
 if(!m)throw Error('Back page object missing');
 let s=m[1].replace(/\/Contents\[([^\]]+)\]/,(_,v)=>'/Contents['+v+' 148 0 R]');
 if(!s.includes('148 0 R')||!s.includes('/XObject<<'))throw Error('PDF page unexpected');
 return s.replace('/XObject<<','/XObject<</TXT43 149 0 R /INF43 150 0 R ');
}
function preparePDF(){if(!pdfPromise)pdfPromise=(async()=>{
 const [url,imgs]=await Promise.all([prev.preparePDF(),images()]);
 const bytes=new Uint8Array(await(await fetch(url)).arrayBuffer()),tail=new TextDecoder().decode(bytes.slice(-30000));
 const match=tail.match(/startxref\s+(\d+)\s+%%EOF\s*$/);if(!match)throw Error('PDF trailer missing');
 const page=updatePage(tail),enc=new TextEncoder(),list=[bytes],offs={};let pos=bytes.length;
 const add=a=>{const b=typeof a==='string'?enc.encode(a):a;list.push(b);pos+=b.length};
 const obj=(n,s)=>{offs[n]=pos;add(n+' 0 obj\n'+s+'\nendobj\n')};
 add('\n');obj(13,page);
 const stream=patches.map(p=>{
   const x=p.x/4,y=H-(p.y+p.h)/4,w=p.w/4,h=p.h/4;
   return 'q\n'+w+' 0 0 '+h+' '+x+' '+y+' cm\n/'+p.id+' Do\nQ\n';
 }).join('');
 obj(148,'<</Length '+enc.encode(stream).length+'>>\nstream\n'+stream+'endstream');
 for(let i=0;i<2;i++){
  const p=patches[i],bin=Uint8Array.from(atob(imgs[i].toDataURL('image/jpeg',.98).split(',')[1]),v=>v.charCodeAt(0));
  offs[p.obj]=pos;add(p.obj+' 0 obj\n<</Type/XObject/Subtype/Image/Width '+p.w+'/Height '+p.h+'/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length '+bin.length+'>>\nstream\n');add(bin);add('\nendstream\nendobj\n');
 }
 const start=pos,num=n=>String(offs[n]).padStart(10,'0')+' 00000 n \n';
 add('xref\n13 1\n'+num(13)+'148 3\n'+num(148)+num(149)+num(150)+'trailer\n<</Size 151/Root 1 0 R/Prev '+match[1]+'>>\nstartxref\n'+start+'\n%%EOF\n');
 return URL.createObjectURL(new Blob(list,{type:'application/pdf'}));
})().catch(e=>{pdfPromise=null;throw e});return pdfPromise}
function loadPage(n){if(n!==1)return prev.loadPage(n);
 if(!backPromise)backPromise=(async()=>{
  const [url,imgs]=await Promise.all([prev.loadPage(1),images()]);
  const b=await createImageBitmap(await(await fetch(url)).blob()),c=document.createElement('canvas');
  c.width=b.width;c.height=b.height;
  const g=c.getContext('2d');g.drawImage(b,0,0);b.close();
  for(let i=0;i<2;i++){const p=patches[i];g.drawImage(imgs[i],p.x/(W*4)*c.width,p.y/(H*4)*c.height,p.w/(W*4)*c.width,p.h/(H*4)*c.height)}
  return URL.createObjectURL(await new Promise((r,j)=>c.toBlob(v=>v?r(v):j(Error('PNG failed')),'image/png')));
 })().catch(e=>{backPromise=null;throw e});
 return backPromise}
window.SaeedHQ31={preparePDF,loadPage};
})();