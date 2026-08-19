/* 谜题动画引擎集：river/jugs/weigh/gridmove/griddp/tour/knight/tiling/flip/arrange/hanoi/timeline/life/queens/geo/board */
(function () {
  const PZ = window.PZ, H = PZ.H, S = PZ.S;

  /* ============ river 过河 ============ */
  PZ.registerEngine('river', {
    build: function (p) {
      const items = p.items; // [{id,label,color}]
      const path = S.bfs(
        { L: items.map(function (x) { return x.id; }), R: [], boat: 'L' },
        function (st) {
          const out = [];
          const side = st[st.boat];
          for (let m = 0; m <= p.cap; m++) {
            const combos = m === 0 ? [[]] : comb(side, m);
            combos.forEach(function (mv) {
              const nst = { L: st.L.slice(), R: st.R.slice(), boat: st.boat === 'L' ? 'R' : 'L' };
              mv.forEach(function (id) { nst[st.boat] = nst[st.boat].filter(function (x) { return x !== id; }); nst[nst.boat].push(id); });
              if (p.valid(nst)) out.push({ next: nst, mv: mv, to: nst.boat });
            });
          }
          return out;
        },
        function (st) { return p.goal ? p.goal(st) : st.R.length === items.length; },
        function (st) { return st.L.join(',') + '|' + st.R.join(',') + '|' + st.boat; }
      ) || [];
      const states = [{ L: items.map(function (x) { return x.id; }), R: [], boat: 'L' }];
      path.forEach(function (mv) {
        const prev = states[states.length - 1];
        const nst = { L: prev.L.slice(), R: prev.R.slice(), boat: prev.boat === 'L' ? 'R' : 'L' };
        mv.mv.forEach(function (id) { nst[prev.boat] = nst[prev.boat].filter(function (x) { return x !== id; }); nst[nst.boat].push(id); });
        states.push(nst);
      });
      return {
        steps: states.length - 1, baseMs: 700,
        label: function (k) { return k === 0 ? '初始：都在左岸' : '第 ' + k + ' 次渡河：' + (path[k - 1].mv.length ? path[k - 1].mv.map(nm).join('+') : '独自返回') + ' → ' + (path[k - 1].to === 'R' ? '右岸' : '左岸'); },
        draw: function (ctx, W, Hh, k) {
          const st = states[Math.min(k, states.length - 1)];
          H.txt(ctx, p.capText || '小船容量 ' + p.cap + ' 人/物', W / 2, 16, { size: 11, color: '#8fa0c8' });
          ctx.fillStyle = '#123252'; ctx.fillRect(0, 208, W, 70);
          ctx.fillStyle = '#1d3a2a'; ctx.fillRect(0, 208, 130, 70); ctx.fillRect(W - 130, 208, 130, 70);
          H.txt(ctx, '左岸', 65, 296, { size: 12, color: '#8fa0c8' }); H.txt(ctx, '右岸', W - 65, 296, { size: 12, color: '#8fa0c8' });
          drawSide(st.L, 14, 'L'); drawSide(st.R, W - 126, 'R');
          // 船
          const bx = st.boat === 'L' ? 150 : W - 190;
          ctx.fillStyle = '#6b4a2b'; H.rr(ctx, bx, 236, 44, 14, 6); ctx.fill();
          function drawSide(ids, x0) {
            ids.forEach(function (id, i) {
              const it = items.find(function (x) { return x.id === id; });
              const x = x0 + (i % 4) * 30 + 15, y = 226 + Math.floor(i / 4) * 30;
              H.circle(ctx, x, y, 11, it.color); H.txt(ctx, it.label, x, y, { size: 10, bold: true, color: '#0b1020' });
            });
          }
        }
      };
      function nm(id) { return items.find(function (x) { return x.id === id; }).label; }
      function comb(a, m) {
        if (m === 1) return a.map(function (x) { return [x]; });
        const out = [];
        for (let i = 0; i < a.length; i++) comb(a.slice(i + 1), m - 1).forEach(function (c) { out.push([a[i]].concat(c)); });
        return out;
      }
    }
  });

  /* ============ jugs 水壶 ============ */
  PZ.registerEngine('jugs', {
    build: function (p) {
      const caps = p.caps;
      const path = S.bfs(p.init, function (st) {
        const out = [];
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
          if (i === j || st[i] === 0 || st[j] === caps[j]) continue;
          const q = Math.min(st[i], caps[j] - st[j]);
          const nx = st.slice(); nx[i] -= q; nx[j] += q;
          out.push({ next: nx, mv: (i + 1) + '→' + (j + 1) + ' 壶, 倒 ' + q + ' 升' });
        }
        return out;
      }, function (st) { return st[0] === p.goal[0] && st[1] === p.goal[1] && st[2] === p.goal[2]; },
      function (st) { return st.join(','); });
      const states = [p.init];
      (path || []).forEach(function (m) {
        const prev = states[states.length - 1]; const mm = m.mv.split(' ')[0].split('→'); const q = parseInt(m.mv.split('倒 ')[1]);
        const nx = prev.slice(); nx[mm[0] - 1] -= q; nx[mm[1] - 1] += q; states.push(nx);
      });
      return {
        steps: states.length - 1, baseMs: 700,
        label: function (k) { return k === 0 ? '初始 ' + states[0].join(',') : '第 ' + k + ' 步：' + path[k - 1].mv + ' → [' + states[k] + ']'; },
        draw: function (ctx, W, Hh, k) {
          const st = states[Math.min(k, states.length - 1)];
          for (let i = 0; i < 3; i++) {
            const x = 150 + i * 150, bw = 90, bh = 200, y0 = 260;
            ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2;
            ctx.strokeRect(x - bw / 2, y0 - bh, bw, bh);
            const h = bh * st[i] / caps[i];
            ctx.fillStyle = 'rgba(125,211,252,.75)';
            ctx.fillRect(x - bw / 2 + 2, y0 - h, bw - 4, h);
            H.mono(ctx, st[i] + '/' + caps[i], x, y0 + 18, { size: 13, bold: true, color: '#7dd3fc' });
          }
          H.txt(ctx, '目标：' + p.goal.join(', '), W / 2, 300, { size: 12, color: '#8fa0c8' });
        }
      };
    }
  });

  /* ============ weigh 天平 ============ */
  PZ.registerEngine('weigh', {
    build: function (p) {
      const steps = p.steps;
      return {
        steps: steps.length, baseMs: 1100,
        label: function (k) { return k === 0 ? '共 ' + p.n + ' 枚硬币，准备称重' : steps[k - 1].note; },
        draw: function (ctx, W, Hh, k) {
          H.txt(ctx, p.title || ('找出假币（' + p.n + ' 枚）'), W / 2, 18, { size: 12, color: '#8fa0c8' });
          const cx = W / 2, cy = 90;
          H.line(ctx, cx, 40, cx, cy, '#8fa0c8', 3);
          const done = Math.min(k, steps.length);
          const cur = done > 0 ? steps[done - 1] : null;
          const tilt = cur ? (cur.res === '<' ? -0.18 : cur.res === '>' ? 0.18 : 0) : 0;
          const ax = cx - Math.cos(tilt) * 150, ay = cy + Math.sin(tilt) * 60;
          const bx2 = cx + Math.cos(tilt) * 150, by2 = cy - Math.sin(tilt) * 60;
          H.line(ctx, ax, ay, bx2, by2, '#8fa0c8', 3);
          H.line(ctx, ax, ay, ax, ay + 40, '#55608c', 1.5); H.line(ctx, bx2, by2, bx2, by2 + 40, '#55608c', 1.5);
          H.rr(ctx, ax - 70, ay + 40, 140, 10, 4); ctx.fillStyle = '#273469'; ctx.fill();
          H.rr(ctx, bx2 - 70, by2 + 40, 140, 10, 4); ctx.fill();
          if (cur) {
            cur.L.forEach(function (c, i) { coin(ctx, ax - 60 + (i % 7) * 20, ay + 32 - Math.floor(i / 7) * 16, c); });
            cur.R.forEach(function (c, i) { coin(ctx, bx2 - 60 + (i % 7) * 20, by2 + 32 - Math.floor(i / 7) * 16, c); });
            H.txt(ctx, cur.res === '=' ? '平衡' : (cur.res === '<' ? '左轻' : '左重'), cx, cy + 96, { size: 14, bold: true, color: '#fbbf24' });
          }
          H.txt(ctx, cur ? cur.note : '点击播放开始称重', W / 2, 300, { size: 12, color: '#dfe6f8' });
          function coin(ctx, x, y, label) { H.circle(ctx, x, y, 8, '#fbbf24'); H.mono(ctx, String(label), x, y, { size: 9, bold: true, color: '#0b1020' }); }
        }
      };
    }
  });

  /* ============ gridmove 棋盘走子 ============ */
  PZ.registerEngine('gridmove', {
    build: function (p) {
      const moves = p.moves || [];
      return {
        steps: moves.length, baseMs: p.baseMs || 500,
        label: function (k) { return k === 0 ? (p.cap0 || '初始布局') : (moves[k - 1].cap || ('第 ' + k + ' 步')); },
        draw: function (ctx, W, Hh, k) {
          const cell = Math.min((W - 200) / p.cols, (Hh - 70) / p.rows);
          const x0 = (W - cell * p.cols) / 2, y0 = 40;
          for (let r = 0; r < p.rows; r++) for (let c = 0; c < p.cols; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#182148' : '#121a3a';
            ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
            ctx.strokeStyle = '#232c56'; ctx.strokeRect(x0 + c * cell, y0 + r * cell, cell, cell);
          }
          (p.walls || []).forEach(function (w) {
            ctx.fillStyle = '#05070f'; ctx.fillRect(x0 + w[1] * cell + 1, y0 + w[0] * cell + 1, cell - 2, cell - 2);
          });
          // 累计位置
          const pos = {};
          p.pieces.forEach(function (pc) { pos[pc.id] = { r: pc.r, c: pc.c }; });
          const trail = [];
          for (let i = 0; i < k; i++) {
            const m = moves[i];
            if (m.r !== undefined) pos[m.id] = { r: m.r, c: m.c };
            else { pos[m.id].r += m.dr; pos[m.id].c += m.dc; }
            trail.push({ id: m.id, r: pos[m.id].r, c: pos[m.id].c });
          }
          if (p.trail) trail.forEach(function (t, i) {
            H.circle(ctx, x0 + t.c * cell + cell / 2, y0 + t.r * cell + cell / 2, 3, 'rgba(94,234,212,' + (0.15 + 0.5 * i / trail.length) + ')');
          });
          p.pieces.forEach(function (pc) {
            const q = pos[pc.id];
            H.circle(ctx, x0 + q.c * cell + cell / 2, y0 + q.r * cell + cell / 2, cell * 0.34, pc.color);
            H.txt(ctx, pc.label, x0 + q.c * cell + cell / 2, y0 + q.r * cell + cell / 2, { size: cell * 0.34, bold: true, color: '#0b1020' });
          });
          H.txt(ctx, p.cap || '', W / 2, Hh - 14, { size: 11, color: '#8fa0c8' });
        }
      };
    }
  });

  /* ============ griddp 网格 DP ============ */
  PZ.registerEngine('griddp', {
    build: function (p) {
      const R = p.rows, C = p.cols, val = p.val;
      const dp = [], from = [];
      for (let r = 0; r < R; r++) { dp.push(Array(C).fill(null)); from.push(Array(C).fill(null)); }
      const order = [];
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) order.push([r, c]);
      order.forEach(function (rc) {
        const r = rc[0], c = rc[1];
        if (p.blocked && p.blocked.some(function (b) { return b[0] === r && b[1] === c; })) { dp[r][c] = p.mode === 'count' ? 0 : -Infinity; return; }
        const up = r > 0 ? dp[r - 1][c] : (p.mode === 'count' ? 0 : -Infinity);
        const lf = c > 0 ? dp[r][c - 1] : (p.mode === 'count' ? 0 : -Infinity);
        if (r === 0 && c === 0) { dp[0][0] = val(0, 0); return; }
        if (p.mode === 'count') { dp[r][c] = (up < 0 ? 0 : up) + (lf < 0 ? 0 : lf); if (r === 0) dp[r][c] = lf; if (c === 0) dp[r][c] = up; from[r][c] = (r === 0) ? 'L' : (c === 0) ? 'U' : (up >= lf ? 'U' : 'L'); }
        else {
          const bu = r > 0 ? dp[r - 1][c] : -Infinity, bl = c > 0 ? dp[r][c - 1] : -Infinity;
          if (bu === -Infinity && bl === -Infinity) { dp[r][c] = -Infinity; return; }
          dp[r][c] = val(r, c) + Math.max(bu === -Infinity ? -Infinity : bu, bl === -Infinity ? -Infinity : bl);
          from[r][c] = bu >= bl ? 'U' : 'L';
        }
      });
      // 路径
      const path = [];
      if (p.showPath !== false) {
        let r = R - 1, c = C - 1;
        while (!(r === 0 && c === 0)) { path.push([r, c]); if (from[r][c] === 'U') r--; else c--; }
        path.push([0, 0]); path.reverse();
      }
      const fillSteps = R * C;
      return {
        steps: fillSteps + path.length, baseMs: 120,
        label: function (k) { return k <= fillSteps ? '填表 ' + k + '/' + fillSteps : '回溯最优路径 ' + (k - fillSteps) + '/' + path.length; },
        draw: function (ctx, W, Hh, k) {
          const cell = Math.min((W - 120) / C, (Hh - 90) / R);
          const x0 = (W - cell * C) / 2, y0 = 40;
          const filled = Math.min(k, fillSteps);
          for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
            const idx = r * C + c;
            const x = x0 + c * cell, y = y0 + r * cell;
            ctx.fillStyle = '#161f45'; H.rr(ctx, x + 2, y + 2, cell - 4, cell - 4, 5); ctx.fill();
            if (p.blocked && p.blocked.some(function (b) { return b[0] === r && b[1] === c; })) {
              ctx.fillStyle = '#05070f'; H.rr(ctx, x + 2, y + 2, cell - 4, cell - 4, 5); ctx.fill();
              H.txt(ctx, '×', x + cell / 2, y + cell / 2, { color: '#f87171', bold: true });
              continue;
            }
            if (p.coins && val(r, c)) H.circle(ctx, x + cell / 2, y + cell / 2 - 3, 6, '#fbbf24');
            if (p.showVals) H.mono(ctx, String(val(r, c)), x + cell / 2, y + cell / 2, { size: 13, bold: true });
            if (idx < filled && dp[r][c] !== null && dp[r][c] !== -Infinity) {
              H.mono(ctx, String(dp[r][c]), x + cell - 12, y + cell - 12, { size: 11, bold: true, color: '#6ee7b7' });
            }
          }
          if (k > fillSteps) {
            const m = k - fillSteps;
            ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2.5; ctx.beginPath();
            for (let i = 0; i < m && i < path.length; i++) {
              const x = x0 + path[i][1] * cell + cell / 2, y = y0 + path[i][0] * cell + cell / 2;
              if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
          H.txt(ctx, (p.mode === 'count' ? '路径计数 DP：每格 = 上 + 左' : '每格最优 = 值 + max(上, 左)') + '，答案 ' + dp[R - 1][C - 1], W / 2, Hh - 14, { size: 11, color: '#6ee7b7' });
        }
      };
    }
  });

  /* ============ tour 图遍历 ============ */
  PZ.registerEngine('tour', {
    build: function (p) {
      let seq = p.seq;
      if (!seq && p.euler) seq = hierholzer(p.nodes.length, p.edges);
      if (!seq && p.ham) seq = hamilton(p.nodes.length, p.edges);
      seq = seq || [];
      return {
        steps: Math.max(seq.length - 1, 1), baseMs: 450,
        label: function (k) { return '已走 ' + k + ' 条边' + (k >= seq.length - 1 ? '，' + (p.endNote || '完成') : ''); },
        draw: function (ctx, W, Hh, k) {
          p.edges.forEach(function (e) {
            H.line(ctx, p.nodes[e[0]].x * W, p.nodes[e[0]].y * Hh, p.nodes[e[1]].x * W, p.nodes[e[1]].y * Hh, '#2b3668', 1.5);
          });
          ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 3; ctx.beginPath();
          for (let i = 0; i <= Math.min(k, seq.length - 1); i++) {
            const n = p.nodes[seq[i]];
            if (i === 0) ctx.moveTo(n.x * W, n.y * Hh); else ctx.lineTo(n.x * W, n.y * Hh);
          }
          ctx.stroke();
          p.nodes.forEach(function (n, i) {
            const visited = seq.slice(0, k + 1).indexOf(i) >= 0;
            H.circle(ctx, n.x * W, n.y * Hh, 13, visited ? '#5eead4' : '#273469', '#5eead4');
            H.txt(ctx, n.label || String(i), n.x * W, n.y * Hh, { size: 10, bold: true, color: visited ? '#0b1020' : '#dfe6f8' });
          });
          H.txt(ctx, p.cap || '', W / 2, Hh - 12, { size: 11, color: '#8fa0c8' });
        }
      };
      function hierholzer(n, edges) {
        const adj = Array.from({ length: n }, function () { return []; });
        edges.forEach(function (e, i) { adj[e[0]].push([e[1], i]); adj[e[1]].push([e[0], i]); });
        const used = new Set(); const stack = [p.start || 0]; const path = [];
        while (stack.length) {
          const v = stack[stack.length - 1];
          let moved = false;
          for (const e of adj[v]) { if (!used.has(e[1])) { used.add(e[1]); stack.push(e[0]); moved = true; break; } }
          if (!moved) path.push(stack.pop());
        }
        return path.reverse();
      }
      function hamilton(n, edges) {
        const adj = Array.from({ length: n }, function () { return []; });
        edges.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
        const vis = new Set([p.start || 0]); const path = [p.start || 0];
        (function dfs() {
          if (path.length === n) return true;
          const v = path[path.length - 1];
          for (const w of adj[v]) { if (!vis.has(w)) { vis.add(w); path.push(w); if (dfs()) return true; path.pop(); vis.delete(w); } }
          return false;
        })();
        return path.length === n ? path : null;
      }
    }
  });

  /* ============ knight 马在棋盘 ============ */
  PZ.registerEngine('knight', {
    build: function (p) {
      const N = p.n || 5;
      const dirs = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
      let seq = null;
      if (p.mode === 'tour') {
        const board = Array.from({ length: N }, function () { return Array(N).fill(0); });
        const path = [p.start || [0, 0]];
        board[path[0][0]][path[0][1]] = 1;
        (function dfs() {
          if (path.length === N * N) return true;
          const r = path[path.length - 1][0], c = path[path.length - 1][1];
          const opts = [];
          dirs.forEach(function (d) {
            const nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < N && nc >= 0 && nc < N && !board[nr][nc]) {
              let deg = 0;
              dirs.forEach(function (d2) { const a = nr + d2[0], b = nc + d2[1]; if (a >= 0 && a < N && b >= 0 && b < N && !board[a][b]) deg++; });
              opts.push([deg, nr, nc]);
            }
          });
          opts.sort(function (a, b) { return a[0] - b[0]; });
          for (const o of opts) { board[o[1]][o[2]] = 1; path.push([o[1], o[2]]); if (dfs()) return true; path.pop(); board[o[1]][o[2]] = 0; }
          return false;
        })();
        seq = path;
      } else {
        // BFS 最短路径
        const start = p.start || [0, 0], goal = p.goal || [N - 1, N - 1];
        const prev = {}; const q = [start]; const seen = new Set([start.join(',')]);
        while (q.length) {
          const cur = q.shift();
          if (cur[0] === goal[0] && cur[1] === goal[1]) break;
          dirs.forEach(function (d) {
            const nr = cur[0] + d[0], nc = cur[1] + d[1];
            if (nr >= 0 && nr < N && nc >= 0 && nc < N && !seen.has(nr + ',' + nc)) { seen.add(nr + ',' + nc); prev[nr + ',' + nc] = cur; q.push([nr, nc]); }
          });
        }
        seq = []; let cur = goal;
        while (cur) { seq.unshift(cur); cur = prev[cur.join(',')]; }
      }
      return {
        steps: seq.length - 1, baseMs: 300,
        label: function (k) { return (p.mode === 'tour' ? '巡游第 ' : '跳跃第 ') + k + '/' + (seq.length - 1) + ' 步'; },
        draw: function (ctx, W, Hh, k) {
          const cell = Math.min((Hh - 60) / N, (W - 240) / N);
          const x0 = (W - cell * N) / 2, y0 = 34;
          for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#182148' : '#121a3a';
            ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
          }
          ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2.5; ctx.beginPath();
          for (let i = 0; i <= k; i++) {
            const x = x0 + seq[i][1] * cell + cell / 2, y = y0 + seq[i][0] * cell + cell / 2;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
          for (let i = 0; i <= k; i++) H.mono(ctx, String(i + 1), x0 + seq[i][1] * cell + cell / 2, y0 + seq[i][0] * cell + cell / 2, { size: 10, color: i === k ? '#fbbf24' : '#8fa0c8', bold: true });
          const hx = x0 + seq[k][1] * cell + cell / 2, hy = y0 + seq[k][0] * cell + cell / 2;
          H.circle(ctx, hx, hy, cell * 0.3, '#fbbf24'); H.txt(ctx, '♞', hx, hy + 1, { size: cell * 0.4, color: '#0b1020' });
          H.txt(ctx, p.cap || '', W / 2, Hh - 12, { size: 11, color: '#8fa0c8' });
        }
      };
    }
  });

  /* ============ tiling 铺砖 ============ */
  PZ.registerEngine('tiling', {
    build: function (p) {
      const N = p.n || 8;
      const placements = [];
      if (p.type === 'tromino') {
        (function tile(size, r, c, mr, mc) {
          if (size === 2) {
            const cells = [];
            for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if (!(r + i === mr && c + j === mc)) cells.push([r + i, c + j]);
            placements.push(cells); return;
          }
          const h = size / 2;
          const qm = (mr < r + h ? 0 : 2) + (mc < c + h ? 0 : 1);
          const cen = [[r + h - 1, c + h - 1], [r + h - 1, c + h], [r + h, c + h - 1], [r + h, c + h]];
          const mid = []; for (let q = 0; q < 4; q++) if (q !== qm) mid.push(cen[q]);
          placements.push(mid);
          for (let q = 0; q < 4; q++) {
            const nr = r + (q >= 2 ? h : 0), nc = c + (q % 2 ? h : 0);
            tile(h, nr, nc, q === qm ? mr : cen[q][0], q === qm ? mc : cen[q][1]);
          }
        })(N, 0, 0, p.miss[0], p.miss[1]);
      } else {
        // domino 回溯铺满
        const B = Array.from({ length: N }, function () { return Array(p.m || N).fill(false); });
        (p.miss || []).forEach(function (m) { B[m[0]][m[1]] = true; });
        (function dfs() {
          let r = -1, c = -1;
          outer: for (let i = 0; i < N; i++) for (let j = 0; j < (p.m || N); j++) if (!B[i][j]) { r = i; c = j; break outer; }
          if (r < 0) return true;
          const tryP = [[r, c, r, c + 1], [r, c, r + 1, c]];
          for (const t of tryP) {
            if (t[2] < N && t[3] < (p.m || N) && !B[t[0]][t[1]] && !B[t[2]][t[3]]) {
              B[t[0]][t[1]] = B[t[2]][t[3]] = true;
              placements.push([[t[0], t[1]], [t[2], t[3]]]);
              if (dfs()) return true;
              placements.pop(); B[t[0]][t[1]] = B[t[2]][t[3]] = false;
            }
          }
          return false;
        })();
      }
      return {
        steps: placements.length, baseMs: 200,
        label: function (k) { return '放置 ' + k + '/' + placements.length + (k >= placements.length ? (p.endNote || ' 铺满！') : ''); },
        draw: function (ctx, W, Hh, k) {
          const M = p.m || N;
          const cell = Math.min((Hh - 70) / N, (W - 200) / M);
          const x0 = (W - cell * M) / 2, y0 = 36;
          for (let r = 0; r < N; r++) for (let c = 0; c < M; c++) {
            ctx.strokeStyle = '#232c56'; ctx.strokeRect(x0 + c * cell, y0 + r * cell, cell, cell);
          }
          (p.miss || []).forEach(function (m) {
            ctx.fillStyle = '#05070f'; ctx.fillRect(x0 + m[1] * cell + 1, y0 + m[0] * cell + 1, cell - 2, cell - 2);
            H.txt(ctx, '×', x0 + m[1] * cell + cell / 2, y0 + m[0] * cell + cell / 2, { color: '#f87171', bold: true });
          });
          for (let i = 0; i < Math.min(k, placements.length); i++) {
            ctx.fillStyle = H.PAL[i % 10];
            placements[i].forEach(function (cc) { H.rr(ctx, x0 + cc[1] * cell + 2, y0 + cc[0] * cell + 2, cell - 4, cell - 4, 5); ctx.fill(); });
          }
          H.txt(ctx, p.cap || '', W / 2, Hh - 12, { size: 11, color: '#8fa0c8' });
        }
      };
    }
  });

  /* ============ flip 翻转 ============ */
  PZ.registerEngine('flip', {
    build: function (p) {
      const ops = p.ops; // 每步: {at:[idx...], cap}
      return {
        steps: ops.length, baseMs: 500,
        label: function (k) { return k === 0 ? (p.cap0 || '初始状态') : ops[k - 1].cap; },
        draw: function (ctx, W, Hh, k) {
          const st = p.init.slice();
          for (let i = 0; i < k; i++) ops[i].at.forEach(function (idx) { st[idx] = p.toggle ? p.toggle(st[idx], idx) : 1 - st[idx]; });
          const n = st.length;
          const cols = p.cols || n;
          const rows = Math.ceil(n / cols);
          const cell = Math.min((W - 120) / cols, (Hh - 100) / rows, 52);
          const x0 = (W - cell * cols) / 2, y0 = (Hh - cell * rows) / 2;
          const last = k > 0 ? ops[k - 1].at : [];
          st.forEach(function (v, i) {
            const x = x0 + (i % cols) * cell + cell / 2, y = y0 + Math.floor(i / cols) * cell + cell / 2;
            const hot = last.indexOf(i) >= 0;
            if (p.kind === 'cup') {
              ctx.fillStyle = v ? '#7dd3fc' : '#273469';
              H.rr(ctx, x - cell * 0.32, y - cell * 0.3 + (v ? 0 : cell * 0.18), cell * 0.64, cell * 0.5, 6); ctx.fill();
            } else {
              H.circle(ctx, x, y, cell * 0.36, v ? '#fbbf24' : '#273469', hot ? '#f87171' : '#39437a');
              if (p.labels) H.txt(ctx, p.labels[i], x, y, { size: 10, bold: true, color: v ? '#0b1020' : '#8fa0c8' });
            }
            if (hot) { H.circle(ctx, x, y, cell * 0.46, null, '#f87171'); }
          });
          H.txt(ctx, p.cap || '', W / 2, Hh - 12, { size: 11, color: '#8fa0c8' });
        }
      };
    }
  });

  /* ============ arrange 数组操作 ============ */
  PZ.registerEngine('arrange', {
    build: function (p) {
      const ops = p.ops;
      return {
        steps: ops.length, baseMs: p.baseMs || 400,
        label: function (k) { return k === 0 ? (p.cap0 || '初始') : (ops[k - 1].cap || opText(ops[k - 1])); },
        draw: function (ctx, W, Hh, k) {
          const a = p.init.slice();
          for (let i = 0; i < k; i++) apply(a, ops[i]);
          const n = a.length;
          const tw = Math.min(56, (W - 80) / Math.max(n, 1));
          const x0 = (W - tw * n) / 2, y = 140;
          const last = k > 0 ? ops[k - 1] : null;
          a.forEach(function (v, i) {
            const hot = last && last.hl && last.hl.indexOf(i) >= 0;
            ctx.fillStyle = hot ? 'rgba(251,191,36,.9)' : (p.colorOf ? p.colorOf(v) : '#273469');
            H.rr(ctx, x0 + i * tw + 2, y, tw - 4, 52, 6); ctx.fill();
            H.txt(ctx, p.textOf ? p.textOf(v) : String(v), x0 + i * tw + tw / 2, y + 26, { size: Math.min(15, tw * 0.4), bold: true, color: p.dark ? '#0b1020' : '#e8ecf8' });
          });
          if (p.pointer && last && last.ptr) last.ptr.forEach(function (q, i2) {
            H.txt(ctx, q[1], x0 + q[0] * tw + tw / 2, y + 74, { size: 12, bold: true, color: H.PAL[i2] });
          });
          H.txt(ctx, p.cap || '', W / 2, Hh - 14, { size: 11, color: '#8fa0c8' });
          if (p.extra) p.extra(ctx, W, Hh, a, k);
        }
      };
      function opText(o) { return o.t + '(' + (o.i !== undefined ? o.i : '') + (o.j !== undefined ? ',' + o.j : '') + ')'; }
      function apply(a, o) {
        if (o.t === 'swap') { const t = a[o.i]; a[o.i] = a[o.j]; a[o.j] = t; }
        else if (o.t === 'rev') { let i = o.i, j = o.j; while (i < j) { const t = a[i]; a[i] = a[j]; a[j] = t; i++; j--; } }
        else if (o.t === 'mov') { const v = a.splice(o.i, 1)[0]; a.splice(o.j, 0, v); }
        else if (o.t === 'del') a.splice(o.i, 1);
        else if (o.t === 'ins') a.splice(o.i, 0, o.v);
        else if (o.t === 'set') a[o.i] = o.v;
      }
    }
  });

  /* ============ hanoi 汉诺塔 ============ */
  PZ.registerEngine('hanoi', {
    build: function (p) {
      const P = p.pegs || 3, N = p.n || 3;
      let moves = p.moves;
      if (!moves) {
        moves = [];
        (function gen(m, f, t, a) { if (!m) return; gen(m - 1, f, a, t); moves.push({ d: m, f: f, t: t }); gen(m - 1, a, t, f); })(N, 0, P - 1, 1);
      }
      return {
        steps: moves.length, baseMs: 400,
        label: function (k) { return k === 0 ? N + ' 层塔在 A 柱' : '第 ' + k + ' 步：' + moves[k - 1].d + '号盘 ' + 'ABCD'[moves[k - 1].f] + '→' + 'ABCD'[moves[k - 1].t]; },
        draw: function (ctx, W, Hh, k) {
          const pegs = Array.from({ length: P }, function () { return []; });
          for (let d = N; d >= 1; d--) pegs[0].push(d);
          for (let i = 0; i < k; i++) { pegs[moves[i].t].push(moves[i].d); pegs[moves[i].f].pop(); }
          const baseY = Hh - 60, dh = Math.min(26, (Hh - 130) / N);
          for (let pi = 0; pi < P; pi++) {
            const x = W * (pi + 0.5) / P;
            H.line(ctx, x, baseY, x, baseY - N * dh - 20, '#39437a', 5);
            H.line(ctx, x - 70, baseY + 6, x + 70, baseY + 6, '#39437a', 3);
            H.txt(ctx, 'ABCD'[pi], x, baseY + 24, { size: 12, color: '#8fa0c8' });
            pegs[pi].forEach(function (d, si) {
              const w = 30 + d * (110 / N);
              ctx.fillStyle = H.PAL[(d - 1) % 10];
              H.rr(ctx, x - w / 2, baseY - (si + 1) * dh + 3, w, dh - 5, 5); ctx.fill();
            });
          }
          H.txt(ctx, p.cap || ('共 ' + moves.length + ' 步'), W / 2, 20, { size: 11, color: '#8fa0c8' });
        }
      };
    }
  });

  /* ============ timeline 时间轴 ============ */
  PZ.registerEngine('timeline', {
    build: function (p) {
      const segs = p.segs; // {who, start, dur, label, color}
      const total = p.total;
      return {
        steps: segs.length, baseMs: 900,
        label: function (k) { return k === 0 ? '总时限 ' + total + ' 分钟' : segs[k - 1].label; },
        draw: function (ctx, W, Hh, k) {
          const x0 = 70, x1 = W - 40, y0 = 60;
          H.line(ctx, x0, y0 - 20, x0, y0 + segs.length * 34 + 10, '#39437a', 2);
          for (let t = 0; t <= total; t += 5) {
            const x = x0 + (x1 - x0) * t / total;
            H.line(ctx, x, y0 - 14, x, y0 - 8, '#39437a', 1);
            H.mono(ctx, String(t), x, y0 - 24, { size: 9, color: '#8fa0c8' });
          }
          for (let i = 0; i < Math.min(k, segs.length); i++) {
            const s = segs[i], y = y0 + i * 34;
            const x = x0 + (x1 - x0) * s.start / total, w = (x1 - x0) * s.dur / total;
            ctx.fillStyle = s.color || H.PAL[i % 10];
            H.rr(ctx, x, y, w, 20, 6); ctx.fill();
            H.txt(ctx, s.who, x0 - 8, y + 10, { size: 10, color: '#dfe6f8', align: 'right' });
            H.mono(ctx, s.dur + '\'', x + w / 2, y + 10, { size: 10, bold: true, color: '#0b1020' });
          }
          H.txt(ctx, p.cap || '', W / 2, Hh - 14, { size: 11, color: '#8fa0c8' });
        }
      };
    }
  });

  /* ============ life 细胞自动机 ============ */
  PZ.registerEngine('life', {
    build: function (p) {
      const gens = p.gens;
      return {
        steps: gens.length - 1, baseMs: 600,
        label: function (k) { return '第 ' + k + ' 代'; },
        draw: function (ctx, W, Hh, k) {
          const g = gens[Math.min(k, gens.length - 1)];
          const R = g.length, C = g[0].length;
          const cell = Math.min((W - 160) / C, (Hh - 80) / R);
          const x0 = (W - cell * C) / 2, y0 = 40;
          for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
            ctx.strokeStyle = '#232c56'; ctx.strokeRect(x0 + c * cell, y0 + r * cell, cell, cell);
            if (g[r][c]) { ctx.fillStyle = p.color || H.PAL[(g[r][c] - 1) % 10]; H.rr(ctx, x0 + c * cell + 2, y0 + r * cell + 2, cell - 4, cell - 4, 4); ctx.fill(); }
          }
          H.txt(ctx, p.cap || '', W / 2, Hh - 12, { size: 11, color: '#8fa0c8' });
        }
      };
    }
  });

  /* ============ queens N 皇后 ============ */
  PZ.registerEngine('queens', {
    build: function (p) {
      const N = p.n || 8;
      const frames = [];
      const cols = Array(N).fill(-1);
      (function dfs(row) {
        if (frames.length > (p.maxFrames || 400)) return;
        if (row === N) { frames.push({ cols: cols.slice(), done: true }); return; }
        for (let c = 0; c < N; c++) {
          let ok = true;
          for (let k = 0; k < row; k++) if (cols[k] === c || Math.abs(cols[k] - c) === row - k) { ok = false; break; }
          frames.push({ cols: cols.slice(), row: row, c: c, ok: ok });
          if (ok) { cols[row] = c; dfs(row + 1); cols[row] = -1; if (frames.length && frames[frames.length - 1].done && !p.all) return; }
        }
      })(0);
      return {
        steps: frames.length - 1, baseMs: 60,
        label: function (k) { const f = frames[k]; return f.done ? '找到解！' : (f.ok ? '放置于行' + f.row : '行' + f.row + '列' + f.c + '冲突'); },
        draw: function (ctx, W, Hh, k) {
          const f = frames[Math.min(k, frames.length - 1)];
          const cell = Math.min((Hh - 60) / N, (W - 200) / N);
          const x0 = (W - cell * N) / 2, y0 = 34;
          for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
            ctx.fillStyle = (r + c) % 2 ? '#121a3a' : '#182148';
            ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
          }
          for (let r = 0; r < N; r++) if (f.cols[r] >= 0 && r < (f.row === undefined ? N : f.row)) {
            H.txt(ctx, '♛', x0 + f.cols[r] * cell + cell / 2, y0 + r * cell + cell / 2, { size: cell * 0.6, color: '#5eead4' });
          }
          if (f.row !== undefined && !f.done) {
            ctx.fillStyle = f.ok ? 'rgba(74,222,128,.5)' : 'rgba(248,113,113,.5)';
            ctx.fillRect(x0 + f.c * cell, y0 + f.row * cell, cell, cell);
          }
          H.txt(ctx, p.cap || '', W / 2, Hh - 12, { size: 11, color: '#8fa0c8' });
        }
      };
    }
  });

  /* ============ geo 几何自定义 ============ */
  PZ.registerEngine('geo', {
    build: function (p) {
      return {
        steps: p.steps.length - 1, baseMs: p.baseMs || 800,
        label: function (k) { return p.steps[k].cap; },
        draw: function (ctx, W, Hh, k) { p.steps[Math.min(k, p.steps.length - 1)].fn(ctx, W, Hh); }
      };
    }
  });

  /* ============ board 黑板推导 ============ */
  PZ.registerEngine('board', {
    build: function (p) {
      return {
        steps: p.steps.length - 1, baseMs: p.baseMs || 800,
        label: function (k) { return p.steps[k].cap; },
        draw: function (ctx, W, Hh, k) {
          const st = p.steps[Math.min(k, p.steps.length - 1)];
          if (st.fn) st.fn(ctx, W, Hh);
          H.txt(ctx, st.cap, W / 2, Hh - 14, { size: 12, color: '#5eead4' });
        }
      };
    }
  });
})();
