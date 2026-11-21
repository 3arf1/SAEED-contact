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