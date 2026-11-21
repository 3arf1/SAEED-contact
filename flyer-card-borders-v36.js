/* SAEED v36: restore complete rounded borders to ALL service cards, front and back.
   Exact vector overlay for browser flyer and same PDF drawing paths in print.
   Preserves all original text, branding, QR, images and gallery functionality. */
(function(){
'use strict';
const preceding=window.SaeedHQ31;
if(!preceding||!preceding.preparePDF||!preceding.loadPage){console.error('Missing approved v34 flyer');return;}
const PW=419.5276,PH=595.2756, stroke=[.783,.828,.854], lineWidth=.63;
const cards=[[[20.65,136.6,186.8,61.80000000000001,6.65],[213.2,136.6,186.85,61.80000000000001,6.65],[20.65,204.7,186.8,61.85000000000002,6.65],[213.2,204.7,186.85,61.85000000000002,6.65],[20.65,273.2,186.8,61.900000000000034,6.65],[213.2,273.2,186.85,61.900000000000034,6.65],[20.65,341.8,186.8,61.849999999999966,6.65],[213.2,341.8,186.85,61.849999999999966,6.65],[20.65,410.45,186.8,61.94999999999999,6.65],[213.2,410.45,186.85,61.94999999999999,6.65],[20.65,478.85,186.8,61.799999999999955,6.65],[213.2,478.85,186.85,61.799999999999955,6.65]],[[24.65,325.45,120.6,106.65,7.65],[150.85,325.45,120.6,106.65,7.65],[276.95,325.45,120.6,106.65,7.65],[24.65,447.45,372.25,121.05,8.25]]];
const page4="<</Type/Page/MediaBox[0 0 419.5276 595.2756]/Rotate 0/Resources 3 0 R/Parent 2 0 R/Contents[8 0 R 17 0 R 19 0 R 21 0 R 23 0 R 25 0 R 27 0 R 29 0 R 31 0 R 33 0 R 35 0 R 47 0 R 49 0 R 51 0 R 53 0 R 55 0 R 57 0 R 59 0 R 61 0 R 63 0 R 65 0 R 69 0 R 72 0 R 76 0 R 77 0 R 78 0 R 79 0 R 80 0 R 92 0 R 96 0 R 112 0 R 131 0 R 132 0 R 140 0 R 144 0 R]>>";
const page13="<</Type/Page/Contents[36 0 R 9 0 R 37 0 R 39 0 R 41 0 R 43 0 R 45 0 R 70 0 R 71 0 R 86 0 R 114 0 R 116 0 R 118 0 R 120 0 R 122 0 R 123 0 R 124 0 R 125 0 R 136 0 R 137 0 R 139 0 R 141 0 R 142 0 R 145 0 R]/Resources<</Font 10 0 R/ProcSet[/PDF/Text/ImageB/ImageC/ImageI]/XObject<</FormXob.bbb8cc5c5a1868905e9394627b47fad6 12 0 R/fzImg0 38 0 R/fzImg1 40 0 R/fzImg2 42 0 R/fzImg3 44 0 R/fzFrm0 85 0 R/fzImg4 113 0 R/fzFrm1 115 0 R/fzImg5 117 0 R/fzImg6 119 0 R/fzImg7 121 0 R/fzFrm2 135 0 R/Slogan32 138 0 R>>>>/MediaBox[0 0 419.5276 595.2756]/Rotate 0/Parent 2 0 R>>";
let pdfPromise=null;
function borders(page){
 let s='q\n'+stroke.map(v=>v.toFixed(3)).join(' ')+' RG\n'+lineWidth.toFixed(3)+' w\n1 J 1 j\n';
 const k=.5522847498307936;
 for(const [x,top,w,h,r] of cards[page]){
   const y=PH-top-h,xr=x+w,yr=y+h,c=k*r;
   const f=v=>v.toFixed(3);
   s+=f(x+r)+' '+f(y)+' m\n'+f(xr-r)+' '+f(y)+' l\n'+
     f(xr-r+c)+' '+f(y)+' '+f(xr)+' '+f(y+r-c)+' '+f(xr)+' '+f(y+r)+' c\n'+
     f(xr)+' '+f(yr-r)+' l\n'+f(xr)+' '+f(yr-r+c)+' '+f(xr-r+c)+' '+f(yr)+' '+f(xr-r)+' '+f(yr)+' c\n'+
     f(x+r)+' '+f(yr)+' l\n'+f(x+r-c)+' '+f(yr)+' '+f(x)+' '+f(yr-r+c)+' '+f(x)+' '+f(yr-r)+' c\n'+
     f(x)+' '+f(y+r)+' l\n'+f(x)+' '+f(y+r-c)+' '+f(x+r-c)+' '+f(y)+' '+f(x+r)+' '+f(y)+' c\nh S\n';
 }
 return s+'Q\n';
}
function appendBorders(old){
 if(old.length!==14978471)throw Error('Unexpected flyer PDF edition; refusing unsafe update');
 const tail=new TextDecoder().decode(old.slice(-1000));
 const m=/startxref\s+(\d+)\s+%%EOF\s*$/.exec(tail);
 if(!m)throw Error('Unexpected flyer PDF trailer');
 const prev=Number(m[1]),encoder=new TextEncoder(),pieces=[old],offsets={};let offset=old.length;
 function add(value){const b=typeof value==='string'?encoder.encode(value):value;pieces.push(b);offset+=b.length;}
 function obj(num,body){offsets[num]=offset;add(num+' 0 obj\n'+body+'\nendobj\n');}
 function streamobj(num,body){const b=encoder.encode(body);offsets[num]=offset;add(num+' 0 obj\n<</Length '+b.length+'>>\nstream\n');add(b);add('endstream\nendobj\n');}
 add('\n');obj(4,page4);obj(13,page13);streamobj(144,borders(0));streamobj(145,borders(1));
 const xref=offset,entry=n=>String(offsets[n]).padStart(10,'0')+' 00000 n \n';
 add('xref\n4 1\n'+entry(4)+'13 1\n'+entry(13)+'144 2\n'+entry(144)+entry(145)+
     'trailer\n<</Size 146/Root 1 0 R/Prev '+prev+'>>\nstartxref\n'+xref+'\n%%EOF\n');
 return URL.createObjectURL(new Blob(pieces,{type:'application/pdf'}));
}
function preparePDF(){
 if(!pdfPromise)pdfPromise=(async()=>{
   const url=await preceding.preparePDF();
   const bytes=new Uint8Array(await(await fetch(url)).arrayBuffer());
   return appendBorders(bytes);
 })().catch(err=>{pdfPromise=null;throw err});
 return pdfPromise;
}
window.SaeedHQ31={loadPage:preceding.loadPage,preparePDF};
function viewerBorderOverlay(){
 const frame=document.getElementById('flyer-page-frame');
 const image=document.getElementById('flyer-page-image');
 if(!frame||!image)return;frame.style.position='relative';
 const ns='http://www.w3.org/2000/svg';
 const layers=cards.map((items,page)=>{
  const svg=document.createElementNS(ns,'svg');svg.id='saeed-v36-card-borders-'+page;
  svg.setAttribute('viewBox','0 0 '+PW+' '+PH);
  svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
  svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5;display:none;overflow:visible';
  for(const [x,y,w,h,r] of items){
    const rect=document.createElementNS(ns,'rect');
    for(const [name,value] of [['x',x],['y',y],['width',w],['height',h],['rx',r],['ry',r],['fill','none'],['stroke','#c8d3da'],['stroke-width',lineWidth],['vector-effect','non-scaling-stroke']])rect.setAttribute(name,String(value));
    svg.appendChild(rect);
  }
  frame.appendChild(svg);return svg;
 });
 function show(){
  const alt=image.alt||'',isBack=alt.includes('الخلفي')||alt.includes('Back');
  const visible=image.style.display!=='none'&&image.complete&&image.naturalWidth>0;
  layers.forEach((layer,i)=>{layer.style.display=visible&&i===(isBack?1:0)?'block':'none';});
 }
 image.addEventListener('load',show);
 new MutationObserver(show).observe(image,{attributes:true,attributeFilter:['alt','style','src']});
 show();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',viewerBorderOverlay,{once:true});
else viewerBorderOverlay();
})();