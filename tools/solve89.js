/* #89 纸牌交换求解器：BFS 求 n=1 的最短解，验证"先中间列再逐行"的结构 */
function initBoard(n) {
  const N = 2 * n + 1, b = [];
  for (let r = 0; r < N; r++) {
    const row = [];
    for (let c = 0; c < N; c++) {
      if (r === n && c === n) row.push('_');
      else {
        const w = c <= (r < n ? n : n - (r === n ? 0 : -1)) && c < (r === n ? n : n + (r < n ? 1 : 0));
        row.push(w ? 'W' : 'B');
      }
    }
    b.push(row);
  }
  return b;
}
function goalBoard(n) {
  const N = 2 * n + 1, b = [];
  for (let r = 0; r < N; r++) {
    const row = [];
    for (let c = 0; c < N; c++) {
      if (r === n && c === n) row.push('_');
      else row.push(c < (r < n ? n + 1 : n) ? 'B' : 'W');
    }
    b.push(row);
  }
  return b;
}
function key(b) { return b.map(r => r.join('')).join('/'); }
/* W: 右/下；B: 左/上；可滑入相邻空格或跳过 1 个反色 */
function moves(b, n) {
  const N = 2 * n + 1, out = [];
  const dirs = { W: [[0, 1], [1, 0]], B: [[0, -1], [-1, 0]] };
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const v = b[r][c];
    if (v !== 'W' && v !== 'B') continue;
    for (const [dr, dc] of dirs[v]) {
      const r1 = r + dr, c1 = c + dc;
      if (r1 < 0 || r1 >= N || c1 < 0 || c1 >= N) continue;
      if (b[r1][c1] === '_') out.push({ fr: r, fc: c, tr: r1, tc: c1, jump: false });
      else if (b[r1][c1] !== v) {
        const r2 = r + 2 * dr, c2 = c + 2 * dc;
        if (r2 >= 0 && r2 < N && c2 >= 0 && c2 < N && b[r2][c2] === '_')
          out.push({ fr: r, fc: c, tr: r2, tc: c2, jump: true });
      }
    }
  }
  return out;
}
function apply(b, m) {
  const nb = b.map(r => r.slice());
  nb[m.tr][m.tc] = nb[m.fr][m.fc]; nb[m.fr][m.fc] = '_';
  return nb;
}
function bfs(n) {
  const start = initBoard(n), goal = key(goalBoard(n));
  const prev = new Map(); prev.set(key(start), null);
  const q = [start];
  while (q.length) {
    const cur = q.shift();
    const ck = key(cur);
    if (ck === goal) {
      const path = [];
      let k = ck;
      while (prev.get(k)) { path.unshift(prev.get(k).m); k = prev.get(k).pk; }
      return path;
    }
    for (const m of moves(cur, n)) {
      const nb = apply(cur, m), nk = key(nb);
      if (!prev.has(nk)) { prev.set(nk, { pk: ck, m }); q.push(nb); }
    }
  }
  return null;
}
for (const n of [1]) {
  const path = bfs(n);
  console.log('n=' + n, '最短步数:', path ? path.length : '无解', ' 公式 2n(n+1)(n+2)=' + 2 * n * (n + 1) * (n + 2));
  if (path) {
    let b = initBoard(n);
    console.log('初始:'); b.forEach(r => console.log('  ' + r.join(' ')));
    path.forEach((m, i) => {
      b = apply(b, m);
      console.log(`第${i + 1}步: ${b[m.tr][m.tc]} (${m.fr},${m.fc})->(${m.tr},${m.tc}) ${m.jump ? '跳' : '滑'}`);
      b.forEach(r => console.log('  ' + r.join(' ')));
    });
  }
}
