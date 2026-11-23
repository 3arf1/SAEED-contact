/* SAEED v46: add approved bilingual center name, space QR-caption words. Text areas only. */
(function(){
'use strict';
const prev=window.SaeedHQ31;if(!prev?.preparePDF||!prev?.loadPage)throw Error('SAEED v38 required');
const W=419.5276,H=595.2756,patches=[{x:115,y:970,w:1455,h:238,id:'TXT43',obj:149},{x:652,y:2008,w:922,h:227,id:'INF43',obj:150}];
let patchesPromise,pdfPromise,backPromise;
let captionFontPromise;
function loadCaptionFonts(){
 if(!captionFontPromise)captionFontPromise=Promise.all([
   new FontFace('SaeedFlyerAR','url(data:font/woff2;base64,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) format("woff2")').load(),
   new FontFace('SaeedFlyerEN','url(data:font/woff2;base64,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) format("woff2")').load()
 ]).then(faces=>{faces.forEach(f=>document.fonts.add(f));});
 return captionFontPromise;
}
function makePatch(p,i){
 const c=document.createElement('canvas');c.width=p.w;c.height=p.h;
 const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle=i===0?'#ffffff':'#f7f7f7';ctx.fillRect(0,0,p.w,p.h);
 ctx.textAlign='center';ctx.textBaseline='middle';
 const line=(s,y,size,color,ar)=>{
  ctx.fillStyle=color;ctx.direction=ar?'rtl':'ltr';
  const selectedFont=i===1?(ar?'"SaeedFlyerAR"':'"SaeedFlyerEN"'):(ar?'"TheSans"':'"Gotham"');
  let z=size;do{ctx.font=(ar?'normal ':'500 ')+z+'px '+selectedFont+',Tahoma,Arial,sans-serif';if(ctx.measureText(s).width<p.w-54||z<22)break;z--}while(true);
  ctx.fillText(s,p.w/2,y);
 };
 if(i===0){
  line('مركز الشارقة لخدمات المستثمرين (سعيد)',34,42,'#1c1c1c',true);
  line('خطوتك الكاملة لإنجاز معاملاتك بخطوات سلسة واحترافية.',86,42,'#1c1c1c',true);
  line('Sharjah Investors Services Center (SAEED)',139,34,'#4d6b85',false);
  line('Your all-in-one solution for completing your transactions',182,32,'#4d6b85',false);
  line('with ease and professionalism.',218,32,'#4d6b85',false);
 }else{
  line('امسح الرمز للفروع وطرق',38,42,'#1f1f1f',true);
  line('التواصل وأوقات العمل.',110,42,'#1f1f1f',true);
  line('Scan the code for branches, contact',165,29,'#6c8799',false);
  line('details, and opening hours.',199,29,'#6c8799',false);
 }
 return c;
}
function images(){if(!patchesPromise)patchesPromise=loadCaptionFonts().then(()=>patches.map(makePatch)).catch(e=>{patchesPromise=null;throw e});return patchesPromise}
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