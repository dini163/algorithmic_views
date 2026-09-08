/* 批量求解/验证：#118 六骑士 BFS、#120 硬币分发机模拟、#140 n 皇后构造验证 */

/* ---------- #118 六骑士：3×4，黑 {(0,0),(0,1),(0,2)} ↔ 白 {(2,1),(2,2),(2,3)} ---------- */
(function () {
  const R = 3, C = 4;
  const knightD = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  const cellId = (r, c) => r * C + c;
  const start = { B: [0, 1, 2].map(c => cellId(0, c)), W: [1, 2, 3].map(c => cellId(2, c)) };
  const goalB = [1, 2, 3].map(c => cellId(2, c)).sort().join(',');
  const goalW = [0, 1, 2].map(c => cellId(0, c)).sort().join(',');
  const key = s => s.B.slice().sort((a, b) => a - b).join(',') + '|' + s.W.slice().sort((a, b) => a - b).join(',');
  const goalKey = goalB + '|' + goalW;
  const prev = new Map(); // key -> {from, move}
  const q = [start];
  prev.set(key(start), null);
  let found = null;
  while (q.length) {
    const s = q.shift();
    const k = key(s);
    if (k === goalKey) { found = s; break; }
    const occ = {};
    s.B.forEach(x => occ[x] = 'B'); s.W.forEach(x => occ[x] = 'W');
    [['B', s.B], ['W', s.W]].forEach(([color, arr]) => {
      arr.forEach((cell, idx) => {
        const r = Math.floor(cell / C), c = cell % C;
        knightD.forEach(d => {
          const nr = r + d[0], nc = c + d[1];
          if (nr < 0 || nr >= R || nc < 0 || nc >= C) return;
          const ncell = cellId(nr, nc);
          if (occ[ncell]) return;
          const ns = { B: s.B.slice(), W: s.W.slice() };
          ns[color][idx] = ncell;
          const nk = key(ns);
          if (prev.has(nk)) return;
          prev.set(nk, { from: k, move: { color, fr: r, fc: c, tr: nr, tc: nc } });
          q.push(ns);
        });
      });
    });
  }
  if (!found) { console.log('#118 无解?!'); return; }
  const path = [];
  let k = goalKey;
  while (prev.get(k)) { path.unshift(prev.get(k).move); k = prev.get(k).from; }
  console.log('#118 最短解:', path.length, '步');
  path.forEach((m, i) => console.log('  ' + (i + 1) + '. ' + m.color + ' (' + m.fr + ',' + m.fc + ') -> (' + m.tr + ',' + m.tc + ')'));
  console.log('  states:', prev.size);
})();

/* ---------- #120 硬币分发机：n=6 模拟 ---------- */
(function () {
  function sim(n) {
    const boxes = [n]; const ops = [];
    while (true) {
      const i = boxes.findIndex(v => v >= 2);
      if (i < 0) break;
      boxes[i] -= 2;
      boxes[i + 1] = (boxes[i + 1] || 0) + 1;
      ops.push(i);
      while (boxes[boxes.length - 1] === 0) boxes.pop();
    }
    return { boxes, ops };
  }
  const r = sim(6);
  console.log('#120 n=6:', JSON.stringify(r.boxes), 'ops=' + r.ops.length, '顺序=' + r.ops.join(','));
  const pop = (6).toString(2).split('').filter(x => x === '1').length;
  console.log('  n - popcount =', 6 - pop, '; 二进制', (6).toString(2));
})();

/* ---------- #140 n 皇后构造序列验证 ---------- */
(function () {
  function ok(cols) {
    const n = cols.length;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (cols[i] === cols[j]) return '列冲突 ' + i + ',' + j;
      if (Math.abs(cols[i] - cols[j]) === j - i) return '对角线冲突 (' + i + ',' + cols[i] + ') vs (' + j + ',' + cols[j] + ')';
    }
    return null;
  }
  function construct(n) {
    const evens = [], odds = [];
    for (let i = 2; i <= n; i += 2) evens.push(i);
    for (let i = 1; i <= n; i += 2) odds.push(i);
    const m = n % 6;
    let cols;
    if (m === 2) {
      /* 奇数组相邻对互换：(1,3)->(3,1), (5,7)->(7,5)… */
      const o2 = [];
      for (let i = 0; i < odds.length; i += 2) { o2.push(odds[i + 1]); if (odds[i] !== undefined) o2.push(odds[i]); }
      cols = evens.concat(o2.filter(x => x !== undefined));
    } else if (m === 3) {
      /* 偶数 2 移到尾；奇数 1,3 移到尾 */
      const e2 = evens.slice(1).concat([2]);
      const o2 = odds.slice(2).concat([1, 3]);
      cols = e2.concat(o2);
    } else {
      cols = evens.concat(odds);
    }
    return cols.map(x => x - 1); // 0-indexed
  }
  [4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 20, 100].forEach(n => {
    const cols = construct(n);
    const err = ok(cols);
    console.log('#140 n=' + n + ' (mod6=' + (n % 6) + '): ' + (err ? 'FAIL ' + err : 'OK [' + cols.map(x => x + 1).join(',') + (n > 15 ? '…' : '') + ']'));
  });
})();

/* ---------- #61 对角线上的棋子 n=4 验证 ---------- */
(function () {
  /* 棋子列 0..3 在行 0..3；每步任选两枚各下移一格；目标全到行 3 */
  const pos = [0, 0, 0, 0]; // pos[c] = 棋子 c 所在行（初始对角线 (c,c)）—— 初始 pos[c]=c
  for (let c = 0; c < 4; c++) pos[c] = c;
  const moves = [
    [0, 1], [0, 1], [0, 2]
  ];
  moves.forEach((pair, i) => {
    pair.forEach(c => pos[c]++);
    console.log('#61 第' + (i + 1) + '轮: 移动列 ' + pair.join('&') + ' → 位置 ' + pos.join(','));
  });
  console.log('  全到底边行3?', pos.every(p => p === 3) ? 'OK' : 'FAIL');
})();
