/* 动画 demo 第二部分：贪心 / 动态规划 / 回溯 / 分支限界 / 迭代改进 */
(function () {
  const A = window.AlgoLab;

  /* ============ 06 贪心：硬币找零 ============ */
  A.register('greedy', function (ctx, W, H) {
    const DENOMS = [25, 10, 5, 1];
    const TARGET = 63;
    let remain, picked, done, msg;
    function reset() {
      remain = TARGET; picked = []; done = false;
      msg = '找零 ' + TARGET + ' 元：每一步都拿「不超过余额的最大面值」，绝不回头';
    }
    reset();

    function step() {
      if (done) return;
      for (let k = 0; k < DENOMS.length; k++) {
        if (DENOMS[k] <= remain) { picked.push(DENOMS[k]); remain -= DENOMS[k]; msg = '余额曾为 ' + (remain + DENOMS[k]) + ' → 贪心选择 ' + DENOMS[k] + '（当前最大面值）'; break; }
      }
      if (remain === 0) { done = true; msg = '完成：' + picked.join(' + ') + '，共 ' + picked.length + ' 枚 ，贪心即最优'; }
    }

    const coinColor = { 25: '#fbbf24', 10: '#94a3b8', 5: '#f87171', 1: '#818cf8' };
    const coinR = { 25: 34, 10: 28, 5: 24, 1: 18 };

    function draw() {
      A.txt(ctx, '贪心法：每步选眼下最划算的 - 硬币找零', W / 2, 34, { size: 16, bold: true });
      A.txt(ctx, '目标 ' + TARGET + ' 元', 170, 110, { size: 14, color: '#9aa6c8' });
      A.mono(ctx, '剩余 ' + remain + ' 元', 170, 150, { size: 26, bold: true, color: remain === 0 ? '#4ade80' : '#fbbf24', align: 'left' });
      DENOMS.forEach(function (d, k) {
        A.txt(ctx, d + ' 元', 420 + k * 130, 96, { size: 13, color: '#9aa6c8' });
        ctx.fillStyle = coinColor[d]; ctx.globalAlpha = d <= remain || remain === 0 ? 1 : 0.35;
        ctx.beginPath(); ctx.arc(420 + k * 130, 140, coinR[d], 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        A.mono(ctx, String(d), 420 + k * 130, 140, { size: 15, bold: true, color: '#0b1020' });
      });
      A.txt(ctx, '已选硬币（按贪心顺序）：', 120, 236, { size: 13, color: '#9aa6c8', align: 'left' });
      let x = 130;
      picked.forEach(function (d, k) {
        ctx.fillStyle = coinColor[d];
        ctx.beginPath(); ctx.arc(x + coinR[d], 292, coinR[d], 0, Math.PI * 2); ctx.fill();
        A.mono(ctx, String(d), x + coinR[d], 292, { size: 14, bold: true, color: '#0b1020' });
        x += coinR[d] * 2 + 12;
      });
      if (!picked.length) A.txt(ctx, '（还没有）', 240, 292, { size: 13, color: '#4a5578' });
      A.mono(ctx, '硬币数 = ' + picked.length, 170, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, '注意：「夜过吊桥」谜题里贪心会翻车 ，用前先验证贪心性质', 620, 415, { size: 13, color: '#fbbf24', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#fcd34d' });
    }

    return { baseMs: 700, step: step, draw: draw, reset: reset, status: function () { return 'coins=' + picked.length + ' remain=' + remain; }, get done() { return done; } };
  });

  /* ============ 07 动态规划：硬币收集 ============ */
  A.register('dp', function (ctx, W, H) {
    const R = 5, C = 6;
    const coins = [
      [0, 1, 1, 0, 1, 0],
      [1, 0, 0, 1, 0, 1],
      [0, 1, 1, 0, 1, 0],
      [1, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 1, 1]
    ];
    let dp, filled, path, phase, done, msg, cur;
    function reset() {
      dp = Array.from({ length: R }, function () { return Array(C).fill(null); });
      filled = 0; path = []; phase = 'fill'; done = false; cur = null;
      msg = '机器人从左上到右下，只能右/下移动：每格最优 = 本格硬币 + max(上格, 左格)';
    }
    reset();

    function step() {
      if (done) return;
      if (phase === 'fill') {
        const r = Math.floor(filled / C), c = filled % C;
        const up = r > 0 ? dp[r - 1][c] : -1, lf = c > 0 ? dp[r][c - 1] : -1;
        dp[r][c] = coins[r][c] + Math.max(up < 0 ? 0 : up, lf < 0 ? 0 : lf);
        if (r === 0 && c === 0) dp[0][0] = coins[0][0];
        cur = [r, c];
        filled++;
        msg = '填表 dp[' + r + '][' + c + '] = ' + dp[r][c] + '（查上面和左面的台账，不重算）';
        if (filled === R * C) { phase = 'trace'; cur = [R - 1, C - 1]; path.push([R - 1, C - 1]); msg = '填表完成，最优值 ' + dp[R - 1][C - 1] + '；从终点回溯最优路径'; }
      } else {
        const r = cur[0], c = cur[1];
        if (r === 0 && c === 0) { done = true; path.reverse(); msg = '最优路径共收集 ' + dp[R - 1][C - 1] + ' 枚硬币 ，指数枚举变 30 次加法'; return; }
        const up = r > 0 ? dp[r - 1][c] : -1, lf = c > 0 ? dp[r][c - 1] : -1;
        cur = up >= lf ? [r - 1, c] : [r, c - 1];
        path.push(cur);
        msg = '回溯：上格 ' + up + ' vs 左格 ' + lf + ' → 走 ' + (up >= lf ? '上' : '左');
      }
    }

    function draw() {
      const cell = 62, x0 = (W - C * cell) / 2, y0 = 62;
      A.txt(ctx, '动态规划：硬币收集 - 每格答案记进台账，后续直接查表', W / 2, 34, { size: 16, bold: true });
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
        const x = x0 + c * cell, y = y0 + r * cell;
        const isCur = cur && cur[0] === r && cur[1] === c;
        const onPath = phase === 'trace' && path.some(function (p) { return p[0] === r && p[1] === c; });
        ctx.fillStyle = onPath ? 'rgba(74,222,128,.16)' : '#161f45';
        A.rr(ctx, x + 2, y + 2, cell - 4, cell - 4, 8); ctx.fill();
        ctx.strokeStyle = isCur ? '#5eead4' : '#28325f'; ctx.lineWidth = isCur ? 2.5 : 1;
        A.rr(ctx, x + 2, y + 2, cell - 4, cell - 4, 8); ctx.stroke();
        if (coins[r][c]) {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath(); ctx.arc(x + cell / 2, y + cell / 2 - 4, 9, 0, Math.PI * 2); ctx.fill();
        }
        if (dp[r][c] !== null) {
          A.mono(ctx, String(dp[r][c]), x + cell - 14, y + cell - 15, { size: 13, bold: true, color: '#6ee7b7' });
        }
      }
      if (phase === 'trace' && path.length > 1) {
        ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath();
        path.forEach(function (p, k) {
          const x = x0 + p[1] * cell + cell / 2, y = y0 + p[0] * cell + cell / 2;
          if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }
      A.mono(ctx, '填表 ' + filled + '/' + (R * C), 170, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.mono(ctx, 'dp[4][5] = ' + (dp[R - 1][C - 1] === null ? '-' : dp[R - 1][C - 1]), 620, 415, { size: 14, color: '#6ee7b7', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#6ee7b7' });
    }

    return { baseMs: 260, step: step, draw: draw, reset: reset, status: function () { return phase === 'fill' ? 'fill ' + filled + '/30' : 'trace ' + path.length; }, get done() { return done; } };
  });

  /* ============ 08 回溯：N 皇后 ============ */
  A.register('backtrack', function (ctx, W, H) {
    const N = 8;
    let cols, row, done, tries, flash, placed, msg;
    function reset() {
      cols = Array(N).fill(-1); row = 0; done = false; tries = 0; flash = null; placed = 0;
      msg = '逐行放皇后：某行所有列都冲突 → 退回上一行换位置（剪掉整棵子树）';
    }
    reset();

    function safe(r, c) {
      for (let k = 0; k < r; k++) {
        if (cols[k] === c || Math.abs(cols[k] - c) === r - k) return false;
      }
      return true;
    }

    function step() {
      if (done) return;
      tries++;
      let c = cols[row] + 1;
      while (c < N && !safe(row, c)) { flash = { r: row, c: c, ok: false, t0: performance.now() }; c++; tries++; }
      if (c < N) {
        cols[row] = c; placed = row + 1;
        flash = { r: row, c: c, ok: true, t0: performance.now() };
        msg = '第 ' + row + ' 行放在第 ' + c + ' 列，安全 → 进入下一行';
        row++;
        if (row === N) { done = true; msg = '找到解！只尝试了 ' + tries + ' 次放置，远少于 8^8 ≈ 1678 万种摆法'; }
      } else {
        cols[row] = -1; row--;
        flash = null;
        msg = '第 ' + (row + 1) + ' 行无安全列 → 回溯到第 ' + row + ' 行换列';
      }
    }

    function draw(now) {
      const cell = 44, x0 = (W - N * cell) / 2, y0 = 62;
      A.txt(ctx, '回溯：N 皇后 - 冲突即退，早发现早放弃', W / 2, 34, { size: 16, bold: true });
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#1b2550' : '#131b3d';
        ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
      }
      if (flash && now - flash.t0 < 380) {
        ctx.fillStyle = flash.ok ? 'rgba(74,222,128,.45)' : 'rgba(248,113,113,.45)';
        ctx.fillRect(x0 + flash.c * cell, y0 + flash.r * cell, cell, cell);
      }
      for (let r = 0; r < row; r++) {
        if (cols[r] < 0) continue;
        A.txt(ctx, '♛', x0 + cols[r] * cell + cell / 2, y0 + r * cell + cell / 2 + 1, { size: 26, color: '#5eead4' });
      }
      A.mono(ctx, '尝试次数 = ' + tries, 170, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.mono(ctx, '已放置 ' + row + '/' + N + ' 个皇后', 620, 415, { size: 14, color: '#fda4af', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#fda4af' });
    }

    return { baseMs: 90, step: step, draw: draw, reset: reset, status: function () { return 'row ' + Math.min(row, N) + '/8, tries=' + tries; }, get done() { return done; } };
  });

  /* ============ 09 分支限界：0/1 背包 ============ */
  A.register('branchbound', function (ctx, W, H) {
    const CAP = 8;
    const items = [
      { name: 'A', w: 4, v: 40 },
      { name: 'B', w: 3, v: 30 },
      { name: 'C', w: 5, v: 25 },
      { name: 'D', w: 2, v: 10 }
    ];
    const nodes = [];
    let best = 0;
    (function build() {
      function frac(level, w, v) {
        let rem = CAP - w, val = v;
        for (let k = level; k < items.length && rem > 0; k++) {
          if (items[k].w <= rem) { rem -= items[k].w; val += items[k].v; }
          else { val += items[k].v * rem / items[k].w; rem = 0; }
        }
        return val;
      }
      (function dfs(level, w, v, heap, taken) {
        const bound = Math.floor(frac(level, w, v) * 10) / 10;
        const node = { level: level, heap: heap, bound: bound, w: w, v: v, taken: taken, pruned: false, infeasible: false, leaf: false, bestLeaf: false };
        nodes.push(node);
        if (w > CAP) { node.infeasible = true; return; }
        if (bound <= best) { node.pruned = true; return; }
        if (level === items.length) {
          node.leaf = true;
          if (v > best) { best = v; node.bestLeaf = true; }
          return;
        }
        dfs(level + 1, w + items[level].w, v + items[level].v, heap * 2, taken + items[level].name);
        dfs(level + 1, w, v, heap * 2 + 1, taken + '¬' + items[level].name);
      })(0, 0, 0, 1, '');
    })();

    let shown, done, msg;
    function reset() { shown = 0; done = false; msg = '背包容量 ' + CAP + '：每个分支先算「上界」，上界不够高就整枝剪掉'; }
    reset();

    function step() {
      if (done) return;
      const nd = nodes[shown];
      shown++;
      if (nd.infeasible) msg = '节点[' + nd.taken + '] 超重 → 不可行，剪枝';
      else if (nd.pruned) msg = '节点[' + nd.taken + '] 上界 ' + nd.bound + ' ≤ 当前最佳 → 整枝剪掉，不再展开';
      else if (nd.leaf) msg = nd.bestLeaf ? '叶子[' + nd.taken + '] 价值 ' + nd.v + ' → 刷新最佳解！' : '叶子[' + nd.taken + '] 价值 ' + nd.v;
      else msg = '展开节点[' + (nd.taken || '根') + ']：上界 ' + nd.bound + ' > 当前最佳，值得探索';
      if (shown >= nodes.length) { done = true; msg = '搜索结束：最优价值 ' + best + '（A+B），多个分支被上界剪掉'; }
    }

    function pos(nd) {
      const L = nd.level, first = Math.pow(2, L);
      const x = W * ((nd.heap - first + 0.5) / first);
      const y = 96 + L * 78;
      return { x: x, y: y };
    }

    function draw() {
      A.txt(ctx, '分支限界：0/1 背包搜索树 - 上界不够高的分支整枝砍掉', W / 2, 34, { size: 16, bold: true });
      for (let k = 0; k < shown; k++) {
        const nd = nodes[k];
        if (nd.heap === 1) continue;
        const p = pos(nd);
        const pp = pos({ level: nd.level - 1, heap: Math.floor(nd.heap / 2) });
        ctx.strokeStyle = '#2b3668'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(pp.x, pp.y + 16); ctx.lineTo(p.x, p.y - 16); ctx.stroke();
      }
      for (let k = 0; k < shown; k++) {
        const nd = nodes[k];
        const p = pos(nd);
        const dead = nd.pruned || nd.infeasible;
        ctx.fillStyle = nd.bestLeaf ? 'rgba(74,222,128,.95)' : dead ? '#1a2140' : (k === shown - 1 ? 'rgba(251,191,36,.95)' : '#273469');
        ctx.beginPath(); ctx.arc(p.x, p.y, 17, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = dead ? '#3a4470' : '#5eead4'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 17, 0, Math.PI * 2); ctx.stroke();
        A.mono(ctx, String(nd.bound), p.x, p.y, { size: 11, bold: true, color: dead ? '#55608c' : '#0b1020' });
        if (dead) {
          ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(p.x - 9, p.y - 9); ctx.lineTo(p.x + 9, p.y + 9); ctx.moveTo(p.x + 9, p.y - 9); ctx.lineTo(p.x - 9, p.y + 9); ctx.stroke();
        }
        if (nd.level < items.length) {
          A.txt(ctx, items[nd.level].name, p.x, p.y - 26, { size: 11, color: '#9aa6c8' });
        }
      }
      A.mono(ctx, '展开节点 ' + shown + '/' + nodes.length, 170, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.mono(ctx, '当前最佳 = ' + best, 620, 415, { size: 14, color: '#4ade80', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#fdba74' });
    }

    return { baseMs: 800, step: step, draw: draw, reset: reset, status: function () { return 'node ' + shown + '/' + nodes.length + ' best=' + best; }, get done() { return done; } };
  });

  /* ============ 10 迭代改进：爬山法 ============ */
  A.register('iterative', function (ctx, W, H) {
    function g(x, mu, sig, amp) { return amp * Math.exp(-((x - mu) * (x - mu)) / (2 * sig * sig)); }
    function f(x) { return 30 * g(x, 20, 7, 1) + 62 * g(x, 55, 8, 1) + 42 * g(x, 84, 5, 1) + 8; }

    const DX = 2;
    let x, trail, phase, stuckAt, done, msg, foundLocal, foundGlobal;
    function reset() {
      x = 8; trail = [x]; phase = 1; stuckAt = null; done = false; foundLocal = null; foundGlobal = null;
      msg = '从 x=8 出发：每次试探左右两小步，只保留「更高」的改动';
    }
    reset();

    function step() {
      if (done) return;
      if (phase === 1 || phase === 3) {
        const l = f(x - DX), r = f(x + DX), c = f(x);
        if (l > c && l >= r) { x -= DX; trail.push(x); msg = '左移一步：收益 ' + l.toFixed(1) + ' > 当前 ' + c.toFixed(1) + ' → 保留'; }
        else if (r > c) { x += DX; trail.push(x); msg = '右移一步：收益 ' + r.toFixed(1) + ' > 当前 ' + c.toFixed(1) + ' → 保留'; }
        else {
          stuckAt = x;
          if (phase === 1) {
            foundLocal = x; phase = 2;
            msg = '左右都不比现在好 → 卡在局部最优 x=' + x + '！旁边还有更高的主峰';
          } else {
            foundGlobal = x; done = true;
            msg = '第二次爬山登上全局最高峰！多起点重启是躲开局部最优的常用招';
          }
        }
      } else if (phase === 2) {
        phase = 3; x = 40; trail.push(x);
        msg = '重启：换一个新起点 x=40 再爬一次（多起点策略）';
      }
    }

    function draw() {
      A.txt(ctx, '迭代改进：爬山法 - 每次小改一点，只保留变好的', W / 2, 34, { size: 16, bold: true });
      const x0 = 60, x1 = W - 60, y0 = H - 90, top = 76;
      const maxF = 75;
      function px(v) { return x0 + (x1 - x0) * v / 100; }
      function py(v) { return y0 - (y0 - top) * v / maxF; }
      ctx.strokeStyle = '#2b3668'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.stroke();
      ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let v = 0; v <= 100; v += 0.5) {
        const X = px(v), Y = py(f(v));
        if (v === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      trail.forEach(function (t, k) {
        ctx.fillStyle = 'rgba(94,234,212,' + (0.15 + 0.5 * k / trail.length) + ')';
        ctx.beginPath(); ctx.arc(px(t), py(f(t)) - 14, 3, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(px(x), py(f(x)) - 14, 9, 0, Math.PI * 2); ctx.fill();
      A.mono(ctx, f(x).toFixed(1), px(x), py(f(x)) - 34, { size: 12, bold: true, color: '#fbbf24' });
      if (foundLocal !== null) {
        ctx.strokeStyle = '#f87171'; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(px(foundLocal), py(f(foundLocal)) - 22); ctx.lineTo(px(foundLocal), top - 8); ctx.stroke();
        ctx.setLineDash([]);
        A.txt(ctx, '局部最优', px(foundLocal), top - 16, { size: 12, color: '#f87171' });
      }
      if (foundGlobal !== null) {
        ctx.strokeStyle = '#4ade80'; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(px(foundGlobal), py(f(foundGlobal)) - 22); ctx.lineTo(px(foundGlobal), top - 8); ctx.stroke();
        ctx.setLineDash([]);
        A.txt(ctx, '全局最优', px(foundGlobal), top - 16, { size: 12, color: '#4ade80' });
      }
      A.mono(ctx, '当前位置 x=' + x + '  收益=' + f(x).toFixed(1), 170, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, '柠檬水摊设点同理：每次把摊位挪一小步，哪边顾客多就留哪边', 620, 415, { size: 13, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#a5f3fc' });
    }

    return { baseMs: 300, step: step, draw: draw, reset: reset, status: function () { return 'x=' + x + ' f=' + f(x).toFixed(1); }, get done() { return done; } };
  });
})();
