/* #92 梯形平铺：在三角网格上穷举"3 小三角形梯形砖"的精确覆盖，n=4 与 n=5 */
const H3 = Math.sqrt(3) / 2;
/* 单元三角形 (r,k)：r=0..n-1 行，k=0..2r；k 偶=正立，k 奇=倒立 */
function verts(r, k) {
  const yT = r * H3, yB = (r + 1) * H3, L = -r / 2;
  if (k % 2 === 0) { const m = k / 2, ax = L + m;
    return [[ax, yT], [ax - 0.5, yB], [ax + 0.5, yB]]; }
  const m = (k - 1) / 2;
  return [[L + m, yT], [L + m + 1, yT], [L + m + 0.5, yB]];
}
const pk = p => p.map(v => Number(v).toFixed(3)).join(",");
function edges(r, k) { const v = verts(r, k); return [0,1,2].map(i => [v[i], v[(i+1)%3]].map(pk).sort().join(";")); }
function adj(a, b) { const ea = edges(a[0],a[1]), eb = edges(b[0],b[1]); return ea.some(e => eb.includes(e)); }
function area(tris) { let s = 0; tris.forEach(t => { const v = verts(t[0],t[1]); s += Math.abs((v[1][0]-v[0][0])*(v[2][1]-v[0][1])-(v[2][0]-v[0][0])*(v[1][1]-v[0][1]))/2; }); return s; }
function hull(tris) { // 凸包顶点数（Andrew 单调链）
  const pts = []; tris.forEach(t => verts(t[0],t[1]).forEach(p => pts.push(p)));
  pts.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const cr = (o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lo=[]; for (const p of pts){ while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop(); lo.push(p);}
  const up=[]; for(let i=pts.length-1;i>=0;i--){const p=pts[i]; while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop(); up.push(p);}
  return lo.slice(0,-1).concat(up.slice(0,-1));
}
/* 梯形砖 = 3 个相连三角形且并集为凸四边形 */
function tiles(n) {
  const all = []; for (let r=0;r<n;r++) for (let k=0;k<=2*r;k++) all.push([r,k]);
  const out = [];
  for (let i=0;i<all.length;i++) for (let j=i+1;j<all.length;j++) {
    {}
    for (let l=j+1;l<all.length;l++) {
      const t=[all[i],all[j],all[l]];
      if ([adj(all[i],all[j]),adj(all[j],all[l]),adj(all[i],all[l])].filter(Boolean).length < 2) continue;
      if (hull(t).length===4 && Math.abs(area(t) - 3*H3/2) < 1e-9) out.push(t);
    }
  }
  return out;
}
function solve(n) {
  const region = []; for (let r=1;r<n;r++) for (let k=0;k<=2*r;k++) region.push([r,k]);
  const total = region.length; // n^2-1
  if (total % 3) return null;
  const cand = tiles(n).filter(t => t.every(u => region.some(p=>p[0]===u[0]&&p[1]===u[1])));
  const keyOf = u => u[0]+','+u[1];
  const byCell = {};
  cand.forEach((t,ti) => t.forEach(u => (byCell[keyOf(u)] = byCell[keyOf(u)]||[]).push(ti)));
  const used = new Array(cand.length).fill(false);
  const covered = new Set(), res = [];
  function bt() {
    if (covered.size === total) return true;
    const cell = region.find(u => !covered.has(keyOf(u)));
    for (const ti of (byCell[keyOf(cell)]||[])) {
      if (used[ti]) continue;
      if (cand[ti].some(u => covered.has(keyOf(u)))) continue;
      used[ti]=true; cand[ti].forEach(u=>covered.add(keyOf(u))); res.push(ti);
      if (bt()) return true;
      used[ti]=false; cand[ti].forEach(u=>covered.delete(keyOf(u))); res.pop();
    }
    return false;
  }
  return bt() ? res.map(ti => cand[ti]) : null;
}
[4,5,7].forEach(n => {
  const sol = solve(n);
  console.log('n=' + n + ' region=' + (n*n-1) + ' tiles=' + (sol ? sol.length : 'X'));
  if (sol) sol.forEach((t,i) => console.log('  T' + i + ': ' + t.map(u=>'('+u[0]+','+u[1]+')').join(' ')));
});
