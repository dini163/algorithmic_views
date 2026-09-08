/* 诊断 o1：逐步列出相邻帧中未配对的图形元素（rr/recto/circle/line） */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const gsapStub = { to: function(){return{kill(){},play(){},pause(){},timeScale(){}};}, delayedCall: function(){return{kill(){},play(){},pause(){},timeScale(){}};} };
const win = { gsap: gsapStub, devicePixelRatio: 1, addEventListener: function(){} };
const winProxy = new Proxy(win, { set: function(t,k,v){ t[k]=v; sandbox[k]=v; return true; } });
const sandbox = { window: winProxy, gsap: gsapStub, console: console, Math: Math, performance:{now:function(){return 0;}}, requestAnimationFrame:function(){}, document:{getElementById:function(){return null;}}, IntersectionObserver:function(){return{observe:function(){}};}, setTimeout:setTimeout, clearTimeout:clearTimeout };
vm.createContext(sandbox);
['core.js','util.js','engines.js','desc.js','idea.js','data_o.js','data_a.js','data_b.js','data_c.js','extra1.js','extra2.js']
  .forEach(function(f){ vm.runInContext('(function () {\n'+fs.readFileSync(path.join(root,'js/pz/'+f),'utf8')+'\n})();', sandbox, {filename:f}); });
const PZ = sandbox.PZ;
const d = PZ.defs.find(function(x){return x.g==='o'&&x.no===1;});
const M = PZ.engines[d.e].build(d.p);
const frames = M._frames, matches = M._matches;
function sig(it){ if(it.t==='txt')return it.t+'|'+it.s+'|'+it.size+'|'+it.color+'|'+(it.mono?1:0); if(it.t==='circle')return it.t+'|'+Math.round(it.r)+'|'+(it.fill||'')+'|'+(it.stroke||''); if(it.t==='line')return it.t+'|'+(it.stroke||'')+'|'+it.lw; if(it.t==='rr')return it.t+'|'+Math.round(it.w)+'x'+Math.round(it.h)+'|'+(it.fill||''); return it.t+'|'+(it.stroke||'')+'|'+Math.round(it.w||0)+'x'+Math.round(it.h||0); }
function posOf(it){ return it.t==='line'?[(it.x1+it.x2)/2,(it.y1+it.y2)/2]:[it.x,it.y]; }
console.log('frames:', frames.length);
frames.forEach(function(f,i){
  const gfx = f.filter(function(it){return it.t!=='txt'&&it.t!=='raw';}).length;
  const txt = f.length - gfx;
  console.log('frame '+i+': gfx='+gfx+' txt='+txt);
});
for (let i = 1; i < frames.length; i++) {
  const pr = matches[i];
  const gone = pr.filter(function(p){return p.b===-1;}).map(function(p){return frames[i-1][p.a];});
  const born = pr.filter(function(p){return p.a===-1;}).map(function(p){return frames[i][p.b];});
  const gGone = gone.filter(function(it){return it.t!=='txt'&&it.t!=='raw';});
  const gBorn = born.filter(function(it){return it.t!=='txt'&&it.t!=='raw';});
  console.log('--- step '+i+' -> '+(i+1)+'  gone gfx: '+gGone.map(function(it){return it.t+'@'+Math.round(posOf(it)[0])+','+Math.round(posOf(it)[1])+' '+(it.fill||it.stroke||'');}).join(' ; '));
  console.log('    born gfx: '+gBorn.map(function(it){return it.t+'@'+Math.round(posOf(it)[0])+','+Math.round(posOf(it)[1])+' '+(it.fill||it.stroke||'');}).join(' ; '));
  console.log('    gone txt: '+gone.filter(function(it){return it.t==='txt';}).map(function(it){return '"'+it.s+'"'+it.color;}).join(' ; '));
  console.log('    born txt: '+born.filter(function(it){return it.t==='txt';}).map(function(it){return '"'+it.s+'"'+it.color;}).join(' ; '));
}
