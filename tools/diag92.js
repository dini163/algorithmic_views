const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
const gsapStub={to:function(){return{kill(){},play(){},pause(){},timeScale(){}};},delayedCall:function(){return{kill(){},play(){},pause(){},timeScale(){}};}};
const win={gsap:gsapStub,devicePixelRatio:1,addEventListener:function(){}};
const winProxy=new Proxy(win,{set:function(t,k,v){t[k]=v;sandbox[k]=v;return true;}});
const sandbox={window:winProxy,gsap:gsapStub,console:console,Math:Math,performance:{now:function(){return 0;}},requestAnimationFrame:function(){},document:{getElementById:function(){return null;}},IntersectionObserver:function(){return{observe:function(){}};},setTimeout:setTimeout,clearTimeout:clearTimeout};
vm.createContext(sandbox);
['core.js','util.js','engines.js','desc.js','idea.js','data_o.js','data_a.js','data_b.js','data_c.js','extra1.js','extra2.js']
 .forEach(function(f){vm.runInContext('(function () {\n'+fs.readFileSync(path.join(root,'js/pz/'+f),'utf8')+'\n})();',sandbox,{filename:f});});
const PZ=sandbox.PZ;
const d=PZ.defs.find(x=>x.g==='c'&&x.no===92);
const M=PZ.engines[d.e].build(d.p);
console.log('engine:',d.e,'steps:',M.steps);
M._frames.forEach(function(f,i){
  const kinds={};f.forEach(it=>{kinds[it.t]=(kinds[it.t]||0)+1;});
  console.log('frame',i,JSON.stringify(kinds));
});
/* 帧间多边形配对：同 pts 数 + 质心重合 → 原位换色；其余新生/离场 */
for(let i=1;i<M._frames.length;i++){
  const A=M._frames[i-1],B=M._frames[i];
  const pa=A.filter(x=>x.t==='poly'),pb=B.filter(x=>x.t==='poly');
  let matched=0;const used={};
  pb.forEach(b=>{pa.forEach((a,ai)=>{if(used[ai]||a.pts.length!==b.pts.length)return;
    const ca=a.pts.reduce((s,p)=>[s[0]+p[0],s[1]+p[1]],[0,0]).map(v=>v/a.pts.length);
    const cb=b.pts.reduce((s,p)=>[s[0]+p[0],s[1]+p[1]],[0,0]).map(v=>v/b.pts.length);
    if(Math.abs(ca[0]-cb[0])<0.5&&Math.abs(ca[1]-cb[1])<0.5){used[ai]=1;matched++;}});});
  console.log('step',i,'-> poly:',pa.length,'->',pb.length,'in-place matched:',matched);
}
