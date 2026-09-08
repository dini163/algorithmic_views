/* #89 n=2 BFS：求 48 步解并输出走法序列（供改造 #89 演示用） */
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
const N = 5;
function keyOf(b) { let s = ''; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) s += b[r][c]; return s; }
function movesOf(s) {
  // s: string of 25 chars
  const out = [];
  for (let i = 0; i < 25; i++) {
    const v = s[i];
    if (v === '_') continue;
    const r = (i / N) | 0, c = i % N;
    const dirs = v === 'W' ? [[0, 1], [1, 0]] : [[0, -1], [-1, 0]];
    for (const [dr, dc] of dirs) {
      const r1 = r + dr, c1 = c + dc;
      if (r1 < 0 || r1 >= N || c1 < 0 || c1 >= N) continue;
      const j1 = r1 * N + c1;
      if (s[j1] === '_') out.push([i, j1, 0]);
      else if (s[j1] !== v) {
        const r2 = r + 2 * dr, c2 = c + 2 * dc;
        if (r2 < 0 || r2 >= N || c2 < 0 || c2 >= N) continue;
        const j2 = r2 * N + c2;
        if (s[j2] === '_') out.push([i, j2, 1]);
      }
    }
  }
  return out;
}
function applyMv(s, m) {
  const a = s.split('');
  a[m[1]] = a[m[0]]; a[m[0]] = '_';
  return a.join('');
}
const start = keyOf(initBoard(2));
const goal = keyOf(goalBoard(2));
console.log('start:', start); console.log('goal :', goal);
const prev = new Map();
prev.set(start, null);
let q = [start];
let head = 0, found = false;
const t0 = Date.now();
while (head < q.length) {
  const cur = q[head++];
  if (cur === goal) { found = true; break; }
  for (const m of movesOf(cur)) {
    const ns = applyMv(cur, m);
    if (!prev.has(ns)) {
      prev.set(ns, cur + '|' + m[0] + ',' + m[1] + ',' + m[2]);
      q.push(ns);
    }
  }
  if (head % 500000 === 0) console.log('...expanded', head, 'seen', prev.size, ((Date.now() - t0) / 1000).toFixed(1) + 's');
}
console.log('done expanded', head, 'seen', prev.size, 'found', found, ((Date.now() - t0) / 1000).toFixed(1) + 's');
if (found) {
  const path = [];
  let k = goal;
  while (prev.get(k)) {
    const [pk, ms] = prev.get(k).split('|');
    path.unshift(ms.split(',').map(Number));
    k = pk;
  }
  console.log('步数:', path.length);
  let b = start;
  path.forEach((m, i) => {
    const fr = (m[0] / N | 0) + ',' + m[0] % N, tr = (m[1] / N | 0) + ',' + m[1] % N;
    const v = b[m[0]];
    b = applyMv(b, m);
    console.log(`${i + 1}: ${v} (${fr})->(${tr}) ${m[2] ? '跳' : '滑'}`);
  });
}
