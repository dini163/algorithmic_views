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
const d=PZ.defs.find(function(x){return x.g==='o'&&x.no===1;});
const M=PZ.wrapModel(PZ.engines[d.e].build(d.p),d);
console.log('engine:',d.e,'steps:',M.steps,'baseMs:',M.baseMs);
for(let k=0;k<=M.steps;k++)console.log(' k='+k+' label: '+M.label(k));
