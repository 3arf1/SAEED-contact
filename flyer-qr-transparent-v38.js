/* SAEED v38: remove the white QR plate from the A5 flyer only.
   QR remains vector/sharp, same permanent URL; services, logo, images and layout remain unchanged. */
(function(){
'use strict';
const previous=window.SaeedHQ31;if(!previous?.preparePDF||!previous?.loadPage)throw Error('Missing approved v37 flyer');
const qr='11111110110110100011001111111\n10000010100111101111101000001\n10111010101111000001101011101\n10111010101111101011001011101\n10111010111011100111001011101\n10000010011000110011101000001\n11111110101010101010101111111\n00000000111110111111000000000\n01101011001111100100101011111\n10110001110010111100111000101\n00101110110000010000100001011\n01100000011110000110111010010\n11000010111001101101101100000\n00010001100101110000111100011\n01001011111011000000011100111\n00001101011001010110010100011\n10011111011111100110111001010\n01110101001011110100011000111\n10100010001001100000110110011\n01101101100011110100001000011\n10010110111010100110111111010\n00000000110001101000100010011\n11111110111010000101101010101\n10000010001010110110100010011\n10111010101101101010111111001\n10111010011000011000110011000\n10111010110110011001000110001\n10000010111010101110100100010\n11111110001101110101111010011';const rows=qr.split('\n');
const PAGE_W=419.5276,PAGE_H=595.2756;
const X=47.5,Y=42.2,STEP=2.97,N=29;
const RX=36.1,RY=31.8,RW=111.7,RH=109.8,FACE='#f6f7f7';
let pdfPromise=null,backPromise=null;
function overlayStream(){
 const commands=['q\n.964706 .968627 .968627 rg\n',RX+' '+RY+' '+RW+' '+RH+' re f\n','0 0 0 rg\n'];
 for(let r=0;r<rows.length;r++)for(let c=0;c<rows[r].length;c++){
  if(rows[r][c]==='1') commands.push((X+c*STEP).toFixed(3)+' '+(Y+(N-r-1)*STEP).toFixed(3)+' '+(STEP+.025).toFixed(3)+' '+(STEP+.025).toFixed(3)+' re\n');
 }
 commands.push('f\nQ\n');return commands.join('');
}
function amend(base) {
 const decoder=new TextDecoder(),encoder=new TextEncoder();
 if(decoder.decode(base.slice(0,7))!=='%PDF-1.')throw Error('Not a PDF');
 const tail=decoder.decode(base.slice(-20000));
 const found=[...tail.matchAll(/13 0 obj\s*([\s\S]*?)\s*endobj/g)];
 if(!found.length)throw Error('Cannot identify approved back page');
 const old=found[found.length-1][1];
 const updated=old.replace(/\/Contents\[([^\]]+)\]/,(_,a)=>'/Contents['+a+' 147 0 R]');
 if(updated===old||!updated.includes('147 0 R'))throw Error('PDF page contents not found');
 const end=tail.match(/startxref\s+(\d+)\s+%%EOF\s*$/);if(!end)throw Error('PDF trailer missing');
 const prev=Number(end[1]),parts=[base],offsets={},encode=s=>encoder.encode(s);let length=base.length;
 const add=s=>{const b=typeof s==='string'?encode(s):s;parts.push(b);length+=b.length};
 const obj=(id,body)=>{offsets[id]=length;add(id+' 0 obj\n'+body+'\nendobj\n')};
 const stream=overlayStream();
 add('\n');obj(13,updated);obj(147,'<</Length '+encode(stream).length+'>>\nstream\n'+stream+'endstream');
 const start=length,entry=id=>String(offsets[id]).padStart(10,'0')+' 00000 n \n';
 add('xref\n13 1\n'+entry(13)+'147 1\n'+entry(147)+'trailer\n<</Size 148/Root 1 0 R/Prev '+prev+'>>\nstartxref\n'+start+'\n%%EOF\n');
 return new Blob(parts,{type:'application/pdf'});
}
function preparePDF(){
 if(!pdfPromise)pdfPromise=(async()=>{const url=await previous.preparePDF();const b=new Uint8Array(await(await fetch(url)).arrayBuffer());return URL.createObjectURL(amend(b))})().catch(e=>{pdfPromise=null;throw e});
 return pdfPromise;
}
function loadPage(page){
 if(page!==1)return previous.loadPage(page);
 if(!backPromise)backPromise=(async()=>{
  const source=await previous.loadPage(1),blob=await(await fetch(source)).blob(),bmp=await createImageBitmap(blob);
  const canvas=document.createElement('canvas');canvas.width=bmp.width;canvas.height=bmp.height;const ctx=canvas.getContext('2d',{alpha:false});
  ctx.drawImage(bmp,0,0);bmp.close();
  const sx=canvas.width/PAGE_W,sy=canvas.height/PAGE_H;
  ctx.fillStyle=FACE;ctx.fillRect(RX*sx,(PAGE_H-RY-RH)*sy,RW*sx,RH*sy);
  ctx.fillStyle='#000';
  for(let r=0;r<rows.length;r++)for(let c=0;c<rows[r].length;c++){
   if(rows[r][c]==='1')ctx.fillRect((X+c*STEP)*sx,(PAGE_H-Y-(N-r)*STEP)*sy,(STEP+.03)*sx,(STEP+.03)*sy);
  }
  const out=await new Promise((res,rej)=>canvas.toBlob(v=>v?res(v):rej(Error('PNG encoding failed')),'image/png'));
  return URL.createObjectURL(out);
 })().catch(e=>{backPromise=null;throw e});
 return backPromise;
}
window.SaeedHQ31={preparePDF,loadPage};
})();