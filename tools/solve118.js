/* #118 六骑士：穷举各种初始布局 + 棋盘方向，找出有解的经典布局并求最短解 */
function bfs(R, C, Bcells, Wcells) {
  const knightD = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  const start = { B: Bcells, W: Wcells };
  const key = s => s.B.slice().sort((a, b) => a - b).join(',') + '|' + s.W.slice().sort((a, b) => a - b).join(',');
  const goalKey = Wcells.slice().sort((a, b) => a - b).join(',') + '|' + Bcells.slice().sort((a, b) => a - b).join(',');
  const prev = new Map();
  const q = [start];
  prev.set(key(start), null);
  while (q.length) {
    const s = q.shift();
    const k = key(s);
    if (k === goalKey) {
      const path = [];
      let kk = k;
      while (prev.get(kk)) { path.unshift(prev.get(kk).move); kk = prev.get(kk).from; }
      return path;
    }
    const occ = {};
    s.B.forEach(x => occ[x] = 1); s.W.forEach(x => occ[x] = 1);
    [['B', s.B], ['W', s.W]].forEach(function (cw) {
      const color = cw[0], arr = cw[1];
      arr.forEach(function (cell, idx) {
        const r = Math.floor(cell / C), c = cell % C;
        knightD.forEach(function (d) {
          const nr = r + d[0], nc = c + d[1];
          if (nr < 0 || nr >= R || nc < 0 || nc >= C) return;
          const ncell = nr * C + nc;
          if (occ[ncell]) return;
          const ns = { B: s.B.slice(), W: s.W.slice() };
          ns[color][idx] = ncell;
          const nk = key(ns);
          if (prev.has(nk)) return;
          prev.set(nk, { from: k, move: { color: color, fr: r, fc: c, tr: nr, tc: nc } });
          q.push(ns);
        });
      });
    });
  }
  return null;
}
const id = (r, c, C) => r * C + c;
const variants = [
  ['3x4 黑上012/白下123', 3, 4, [0, 1, 2].map(c => id(0, c, 4)), [1, 2, 3].map(c => id(2, c, 4))],
  ['3x4 黑上012/白下012', 3, 4, [0, 1, 2].map(c => id(0, c, 4)), [0, 1, 2].map(c => id(2, c, 4))],
  ['3x4 黑上123/白下012', 3, 4, [1, 2, 3].map(c => id(0, c, 4)), [0, 1, 2].map(c => id(2, c, 4))],
  ['3x4 黑上123/白下123', 3, 4, [1, 2, 3].map(c => id(0, c, 4)), [1, 2, 3].map(c => id(2, c, 4))],
  ['4x3 黑上/白下', 4, 3, [0, 1, 2].map(c => id(0, c, 3)), [0, 1, 2].map(c => id(3, c, 3))],
];
variants.forEach(function (v) {
  const path = bfs(v[1], v[2], v[3], v[4]);
  console.log(v[0] + ': ' + (path ? '有解 ' + path.length + ' 步' : '无解'));
  if (path && path.length <= 40) {
    path.forEach(function (m, i) { console.log('   ' + (i + 1) + '. ' + m.color + ' (' + m.fr + ',' + m.fc + ')->(' + m.tr + ',' + m.tc + ')'); });
  }
});
