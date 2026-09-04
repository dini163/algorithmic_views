/* 谜题动画引擎集（GSAP 补间版）：
   river/jugs/weigh/gridmove/griddp/tour/knight/tiling/flip/arrange/hanoi/timeline/life/queens/geo/board
   绘制签名：draw(ctx, W, Hh, k, p, now)
   k = 已完成的离散步数；p = 第 k 步的补间进度（0→1，GSAP 缓动后），引擎据此在两态之间插值 */
(function () {
  const PZ = window.PZ, H = PZ.H, S = PZ.S;

  /* 二次贝塞尔插值：t=0 在 a，t=1 在 b，ctrl 为控制点（制造飞行弧线） */
  function qpt(a, b, ctrl, t) {
    const u = 1 - t;
    return {
      x: u * u * a.x + 2 * u * t * ctrl.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * ctrl.y + t * t * b.y
    };
  }

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

      function slotXY(side, i) {
        const x0 = side === 'L' ? 14 : W0 - 126;
        return { x: x0 + (i % 4) * 30 + 15, y: 226 + Math.floor(i / 4) * 30 };
      }
      const W0 = 640; /* 逻辑画布宽（谜题页固定） */

      return {
        steps: states.length - 1, baseMs: 700, ease: 'power2.inOut',
        label: function (k) { return k === 0 ? '初始：都在左岸' : '第 ' + k + ' 次渡河：' + (path[k - 1].mv.length ? path[k - 1].mv.map(nm).join('+') : '独自返回') + ' → ' + (path[k - 1].to === 'R' ? '右岸' : '左岸'); },
        draw: function (ctx, W, Hh, k, pp, now) {
          const st = states[Math.min(k, states.length - 1)];
          const prev = states[Math.max(0, k - 1)];
          const moving = k > 0 ? path[k - 1].mv : [];
          H.txt(ctx, p.capText || '小船容量 ' + p.cap + ' 人/物', W / 2, 16, { size: 11, color: '#8fa0c8' });
          /* 水面：微波纹动画 */
          ctx.fillStyle = '#123252'; ctx.fillRect(0, 208, W, 70);
          ctx.strokeStyle = 'rgba(125,211,252,0.22)'; ctx.lineWidth = 1.5;
          for (let wI = 0; wI < 3; wI++) {
            ctx.beginPath();
            for (let x = 132; x <= W - 132; x += 8) {
              const y = 222 + wI * 18 + Math.sin(x * 0.05 + now * 0.002 + wI * 2) * 2.5;
              if (x === 132) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
          ctx.fillStyle = '#1d3a2a'; ctx.fillRect(0, 208, 130, 70); ctx.fillRect(W - 130, 208, 130, 70);
          H.txt(ctx, '左岸', 65, 296, { size: 12, color: '#8fa0c8' }); H.txt(ctx, '右岸', W - 65, 296, { size: 12, color: '#8fa0c8' });

          /* 船：两岸位置间滑动 + 上下浮动 + 光晕 */
          const bx = H.lerp(prev.boat === 'L' ? 150 : W - 190, st.boat === 'L' ? 150 : W - 190, pp);
          const by = 236 + Math.sin(now * 0.004) * 2;
          H.glow(ctx, '#7dd3fc', 10);
          ctx.fillStyle = '#8a5f36'; H.rr(ctx, bx, by, 44, 14, 6); ctx.fill();
          H.noglow(ctx);
          ctx.strokeStyle = 'rgba(125,211,252,.5)'; ctx.lineWidth = 1; H.rr(ctx, bx, by, 44, 14, 6); ctx.stroke();

          /* 乘客：不动的按槽位，渡河中的沿弧线飞行 */
          items.forEach(function (it) {
            const inPrev = prev.L.indexOf(it.id) >= 0 ? 'L' : 'R';
            const inCur = st.L.indexOf(it.id) >= 0 ? 'L' : 'R';
            const isMoving = moving.indexOf(it.id) >= 0 && k > 0;
            let x, y;
            if (isMoving) {
              const a = slotXY(inPrev, prev[inPrev].indexOf(it.id));
              const b = slotXY(inCur, st[inCur].indexOf(it.id));
              const q = qpt(a, b, { x: (a.x + b.x) / 2, y: 150 }, pp);
              x = q.x; y = q.y;
              H.glow(ctx, it.color, 16);
            } else {
              const arr = inCur === 'L' ? st.L : st.R;
              const q = slotXY(inCur, arr.indexOf(it.id));
              x = q.x; y = q.y;
            }
            H.circle(ctx, x, y, 11, it.color);
            if (isMoving) H.noglow(ctx);
            H.txt(ctx, it.label, x, y, { size: 10, bold: true, color: '#0b1020' });
          });
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
        steps: states.length - 1, baseMs: 700, ease: 'power2.inOut',
        label: function (k) { return k === 0 ? '初始 ' + states[0].join(',') : '第 ' + k + ' 步：' + path[k - 1].mv + ' → [' + states[k] + ']'; },
        draw: function (ctx, W, Hh, k, pp, now) {
          const prev = states[Math.max(0, k - 1)];
          const st = states[Math.min(k, states.length - 1)];
          /* 解析当前步的倒水动作 */
          let pour = null;
          if (k > 0) {
            const mm = path[k - 1].mv.split(' ')[0].split('→');
            pour = { i: mm[0] - 1, j: mm[1] - 1 };
          }
          for (let i = 0; i < 3; i++) {
            const x = 150 + i * 150, bw = 90, bh = 200, y0 = 260;
            const lv = H.lerp(prev[i], st[i], pp);        /* 液面连续升降 */
            const h = bh * lv / caps[i];
            const filling = pour && pour.j === i;
            const draining = pour && pour.i === i;
            ctx.strokeStyle = (filling || draining) ? '#7dd3fc' : '#5eead4';
            ctx.lineWidth = 2;
            ctx.strokeRect(x - bw / 2, y0 - bh, bw, bh);
            if (filling) { H.glow(ctx, '#7dd3fc', 12); }
            ctx.fillStyle = 'rgba(125,211,252,.75)';
            ctx.fillRect(x - bw / 2 + 2, y0 - h, bw - 4, h);
            H.noglow(ctx);
            /* 液面高光线 */
            if (h > 3) {
              ctx.strokeStyle = 'rgba(224,247,255,.7)'; ctx.lineWidth = 1.5;
              ctx.beginPath(); ctx.moveTo(x - bw / 2 + 3, y0 - h); ctx.lineTo(x + bw / 2 - 3, y0 - h); ctx.stroke();
            }
            H.mono(ctx, st[i] + '/' + caps[i], x, y0 + 18, { size: 13, bold: true, color: '#7dd3fc' });
          }
          /* 倒水水流：抛物线 + 流动虚线 */
          if (pour && pp < 1) {
            const x1 = 150 + pour.i * 150, x2 = 150 + pour.j * 150, yTop = 34;
            H.glow(ctx, '#7dd3fc', 8);
            ctx.strokeStyle = 'rgba(125,211,252,.9)'; ctx.lineWidth = 2.5;
            ctx.setLineDash([6, 7]); ctx.lineDashOffset = -now * 0.03;
            ctx.beginPath();
            ctx.moveTo(x1, 60);
            ctx.quadraticCurveTo((x1 + x2) / 2, yTop, x2, 60);
            ctx.stroke();
            ctx.setLineDash([]);
            H.noglow(ctx);
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
      function tiltOf(idx) {
        if (idx <= 0) return 0;
        const c = steps[idx - 1];
        return c.res === '<' ? -0.18 : c.res === '>' ? 0.18 : 0;
      }
      return {
        steps: steps.length, baseMs: 1100, ease: 'power2.inOut',
        label: function (k) { return k === 0 ? '共 ' + p.n + ' 枚硬币，准备称重' : steps[k - 1].note; },
        draw: function (ctx, W, Hh, k, pp, now) {
          H.txt(ctx, p.title || ('找出假币（' + p.n + ' 枚）'), W / 2, 18, { size: 12, color: '#8fa0c8' });
          const cx = W / 2, cy = 90;
          H.line(ctx, cx, 40, cx, cy, '#8fa0c8', 3);
          /* 倾斜角：从上一步缓动到当前步，附带阻尼摆动 */
          const tilt = H.lerp(tiltOf(k - 1), tiltOf(k), pp) + Math.sin(pp * Math.PI * 3) * (1 - pp) * 0.045;
          const ax = cx - Math.cos(tilt) * 150, ay = cy + Math.sin(tilt) * 60;
          const bx2 = cx + Math.cos(tilt) * 150, by2 = cy - Math.sin(tilt) * 60;
          H.line(ctx, ax, ay, bx2, by2, '#8fa0c8', 3);
          H.line(ctx, ax, ay, ax, ay + 40, '#55608c', 1.5); H.line(ctx, bx2, by2, bx2, by2 + 40, '#55608c', 1.5);
          H.rr(ctx, ax - 70, ay + 40, 140, 10, 4); ctx.fillStyle = '#273469'; ctx.fill();
          H.rr(ctx, bx2 - 70, by2 + 40, 140, 10, 4); ctx.fill();
          const done = Math.min(k, steps.length);
          const cur = done > 0 ? steps[done - 1] : null;
          if (cur) {
            cur.L.forEach(function (c, i) { coin(ctx, ax - 60 + (i % 7) * 20, ay + 32 - Math.floor(i / 7) * 16, c); });
            cur.R.forEach(function (c, i) { coin(ctx, bx2 - 60 + (i % 7) * 20, by2 + 32 - Math.floor(i / 7) * 16, c); });
            /* 结果文字随补间淡入 */
            ctx.globalAlpha = pp;
            H.txt(ctx, cur.res === '=' ? '平衡' : (cur.res === '<' ? '左轻' : '左重'), cx, cy + 96, { size: 14, bold: true, color: '#fbbf24' });
            ctx.globalAlpha = 1;
          }
          H.txt(ctx, cur ? cur.note : '点击播放开始称重', W / 2, 300, { size: 12, color: '#dfe6f8' });
          function coin(ctx, x, y, label) {
            H.glow(ctx, '#fbbf24', 6);
            H.circle(ctx, x, y, 8, '#fbbf24');
            H.noglow(ctx);
            H.mono(ctx, String(label), x, y, { size: 9, bold: true, color: '#0b1020' });
          }
        }
      };
    }
  });

  /* ============ gridmove 棋盘走子 ============ */
  PZ.registerEngine('gridmove', {
    build: function (p) {
      const moves = p.moves || [];
      /* 重放前 m 步后的棋子位置 */
      function posAt(m) {
        const pos = {};
        p.pieces.forEach(function (pc) { pos[pc.id] = { r: pc.r, c: pc.c }; });
        for (let i = 0; i < m && i < moves.length; i++) {
          const mv = moves[i];
          if (mv.r !== undefined) pos[mv.id] = { r: mv.r, c: mv.c };
          else { pos[mv.id].r += mv.dr; pos[mv.id].c += mv.dc; }
        }
        return pos;
      }
      return {
        steps: moves.length, baseMs: p.baseMs || 500, ease: 'power2.out',
        label: function (k) { return k === 0 ? (p.cap0 || '初始布局') : (moves[k - 1].cap || ('第 ' + k + ' 步')); },
        draw: function (ctx, W, Hh, k, pp, now) {
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
          const curPos = posAt(k);
          const prevPos = posAt(k - 1);
          const movedId = k > 0 ? moves[k - 1].id : null;
          /* 轨迹渐亮 */
          if (p.trail) {
            const trail = [];
            const tp = posAt(0);
            for (let i = 0; i < k; i++) {
              const m = moves[i];
              if (m.r !== undefined) tp[m.id] = { r: m.r, c: m.c };
              else { tp[m.id].r += m.dr; tp[m.id].c += m.dc; }
              trail.push({ id: m.id, r: tp[m.id].r, c: tp[m.id].c });
            }
            trail.forEach(function (t, i) {
              H.circle(ctx, x0 + t.c * cell + cell / 2, y0 + t.r * cell + cell / 2, 3, 'rgba(94,234,212,' + (0.15 + 0.5 * i / trail.length) + ')');
            });
          }
          p.pieces.forEach(function (pc) {
            const q = curPos[pc.id];
            let x = x0 + q.c * cell + cell / 2, y = y0 + q.r * cell + cell / 2;
            const isMoving = pc.id === movedId && k > 0;
            if (isMoving) {
              const pq = prevPos[pc.id];
              const a = { x: x0 + pq.c * cell + cell / 2, y: y0 + pq.r * cell + cell / 2 };
              const b = { x: x, y: y };
              const qd = qpt(a, b, { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - cell * 0.55 }, pp);
              x = qd.x; y = qd.y;
              H.glow(ctx, pc.color, 16);
            }
            H.circle(ctx, x, y, cell * 0.34, pc.color);
            if (isMoving) H.noglow(ctx);
            H.txt(ctx, pc.label, x, y, { size: cell * 0.34, bold: true, color: '#0b1020' });
            /* 落点脉冲圈 */
            if (isMoving && pp > 0.75) {
              const rr2 = cell * (0.34 + 0.3 * (pp - 0.75) / 0.25);
              ctx.globalAlpha = (1 - pp) * 2.4;
              H.circle(ctx, x0 + q.c * cell + cell / 2, y0 + q.r * cell + cell / 2, rr2, null, pc.color);
              ctx.globalAlpha = 1;
            }
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
        if (r === 0 && c === 0) { dp[0][0] = p.mode === 'count' ? 1 : val(0, 0); return; }
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
        steps: fillSteps + path.length, baseMs: 120, ease: 'power2.out',
        label: function (k) { return k <= fillSteps ? '填表 ' + k + '/' + fillSteps : '回溯最优路径 ' + (k - fillSteps) + '/' + path.length; },
        draw: function (ctx, W, Hh, k, pp, now) {
          const cell = Math.min((W - 120) / C, (Hh - 90) / R);
          const x0 = (W - cell * C) / 2, y0 = 40;
          const filled = Math.min(k, fillSteps);
          const newest = filled - 1; /* 刚填入的格子 */
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
              /* 最新格：数值弹出 + 光晕 */
              if (idx === newest && k <= fillSteps) {
                const s = H.pop(pp);
                ctx.globalAlpha = Math.min(1, pp * 2);
                H.glow(ctx, '#6ee7b7', 10);
                ctx.save();
                ctx.translate(x + cell - 12, y + cell - 12);
                ctx.scale(s, s);
                H.mono(ctx, String(dp[r][c]), 0, 0, { size: 11, bold: true, color: '#6ee7b7' });
                ctx.restore();
                H.noglow(ctx);
                ctx.globalAlpha = 1;
                ctx.strokeStyle = '#6ee7b7'; ctx.lineWidth = 1.5;
                H.rr(ctx, x + 2, y + 2, cell - 4, cell - 4, 5); ctx.stroke();
              } else {
                H.mono(ctx, String(dp[r][c]), x + cell - 12, y + cell - 12, { size: 11, bold: true, color: '#6ee7b7' });
              }
            }
          }
          if (k > fillSteps) {
            /* 回溯路径：整段 + 当前段按补间生长，端点光标发光 */
            const m = k - fillSteps;
            ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2.5;
            H.glow(ctx, '#4ade80', 8);
            ctx.beginPath();
            let endX = 0, endY = 0;
            for (let i = 0; i < m && i < path.length; i++) {
              const x = x0 + path[i][1] * cell + cell / 2, y = y0 + path[i][0] * cell + cell / 2;
              if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
              endX = x; endY = y;
            }
            if (m < path.length) {
              const a = path[m - 1], b = path[m];
              const ax = x0 + a[1] * cell + cell / 2, ay = y0 + a[0] * cell + cell / 2;
              const bx = x0 + b[1] * cell + cell / 2, by = y0 + b[0] * cell + cell / 2;
              endX = H.lerp(ax, bx, pp); endY = H.lerp(ay, by, pp);
              ctx.lineTo(endX, endY);
            }
            ctx.stroke();
            H.noglow(ctx);
            H.circle(ctx, endX, endY, 5, '#4ade80');
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
        steps: Math.max(seq.length - 1, 1), baseMs: 450, ease: 'power2.inOut',
        label: function (k) { return '已走 ' + k + ' 条边' + (k >= seq.length - 1 ? '，' + (p.endNote || '完成') : ''); },
        draw: function (ctx, W, Hh, k, pp, now) {
          p.edges.forEach(function (e) {
            H.line(ctx, p.nodes[e[0]].x * W, p.nodes[e[0]].y * Hh, p.nodes[e[1]].x * W, p.nodes[e[1]].y * Hh, '#2b3668', 1.5);
          });
          /* 已走路径（发光） */
          ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 3;
          H.glow(ctx, '#5eead4', 8);
          ctx.beginPath();
          for (let i = 0; i <= Math.min(k, seq.length - 1); i++) {
            const n = p.nodes[seq[i]];
            if (i === 0) ctx.moveTo(n.x * W, n.y * Hh); else ctx.lineTo(n.x * W, n.y * Hh);
          }
          ctx.stroke();
          H.noglow(ctx);
          /* 当前边上的行走光标 */
          if (k > 0 && k < seq.length && pp < 1) {
            const a = p.nodes[seq[k - 1]], b = p.nodes[seq[k]];
            const x = H.lerp(a.x, b.x, pp) * W, y = H.lerp(a.y, b.y, pp) * Hh;
            H.glow(ctx, '#fbbf24', 14);
            H.circle(ctx, x, y, 6, '#fbbf24');
            H.noglow(ctx);
          }
          p.nodes.forEach(function (n, i) {
            const visIdx = seq.indexOf(i);
            const visited = visIdx >= 0 && visIdx <= k;
            const justVisited = visIdx === k && k > 0;
            const r = justVisited ? 13 * H.pop(pp) : 13;
            if (justVisited) H.glow(ctx, '#5eead4', 12);
            H.circle(ctx, n.x * W, n.y * Hh, r, visited ? '#5eead4' : '#273469', '#5eead4');
            if (justVisited) H.noglow(ctx);
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
        steps: seq.length - 1, baseMs: 300, ease: 'power2.out',
        label: function (k) { return (p.mode === 'tour' ? '巡游第 ' : '跳跃第 ') + k + '/' + (seq.length - 1) + ' 步'; },
        draw: function (ctx, W, Hh, k, pp, now) {
          const cell = Math.min((Hh - 60) / N, (W - 240) / N);
          const x0 = (W - cell * N) / 2, y0 = 34;
          for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#182148' : '#121a3a';
            ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
          }
          /* 已跳轨迹（发光） */
          ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2.5;
          H.glow(ctx, '#5eead4', 6);
          ctx.beginPath();
          for (let i = 0; i < k; i++) {
            const x = x0 + seq[i][1] * cell + cell / 2, y = y0 + seq[i][0] * cell + cell / 2;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
          H.noglow(ctx);
          for (let i = 0; i < k; i++) H.mono(ctx, String(i + 1), x0 + seq[i][1] * cell + cell / 2, y0 + seq[i][0] * cell + cell / 2, { size: 10, color: '#8fa0c8', bold: true });
          /* 马：抛物线跳跃（抬升 + 落点脉冲） */
          const ka = Math.max(0, k - 1);
          const ax = x0 + seq[ka][1] * cell + cell / 2, ay = y0 + seq[ka][0] * cell + cell / 2;
          const bx = x0 + seq[k][1] * cell + cell / 2, by = y0 + seq[k][0] * cell + cell / 2;
          const hop = k > 0 ? Math.sin(pp * Math.PI) * cell * 0.5 : 0;
          const hx = H.lerp(ax, bx, pp), hy = H.lerp(ay, by, pp) - hop;
          H.glow(ctx, '#fbbf24', 14);
          H.circle(ctx, hx, hy, cell * 0.3, '#fbbf24');
          H.noglow(ctx);
          H.txt(ctx, '♞', hx, hy + 1, { size: cell * 0.4, color: '#0b1020' });
          if (k > 0 && pp > 0.8) {
            ctx.globalAlpha = (1 - pp) * 4;
            H.circle(ctx, bx, by, cell * (0.3 + 0.35 * (pp - 0.8) / 0.2), null, '#fbbf24');
            ctx.globalAlpha = 1;
          }
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
        steps: placements.length, baseMs: 200, ease: 'power2.out',
        label: function (k) { return '放置 ' + k + '/' + placements.length + (k >= placements.length ? (p.endNote || ' 铺满！') : ''); },
        draw: function (ctx, W, Hh, k, pp, now) {
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
            const isNew = i === k - 1;
            const s = isNew ? H.pop(pp) : 1;
            const col = H.PAL[i % 10];
            if (isNew) H.glow(ctx, col, 10);
            ctx.fillStyle = col;
            /* 新骨牌从质心弹出 */
            const pl = placements[i];
            let cr = 0, cc = 0;
            pl.forEach(function (q) { cr += q[0]; cc += q[1]; });
            cr /= pl.length; cc /= pl.length;
            const cx = x0 + (cc + 0.5) * cell, cy = y0 + (cr + 0.5) * cell;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(s, s);
            ctx.translate(-cx, -cy);
            pl.forEach(function (q) { H.rr(ctx, x0 + q[1] * cell + 2, y0 + q[0] * cell + 2, cell - 4, cell - 4, 5); ctx.fill(); });
            ctx.restore();
            if (isNew) H.noglow(ctx);
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
        steps: ops.length, baseMs: 500, ease: 'power2.inOut',
        label: function (k) { return k === 0 ? (p.cap0 || '初始状态') : ops[k - 1].cap; },
        draw: function (ctx, W, Hh, k, pp, now) {
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
              /* 杯子：被操作的杯子上浮翻涌 */
              const lift = hot ? Math.sin(pp * Math.PI) * cell * 0.16 : 0;
              ctx.fillStyle = v ? '#7dd3fc' : '#273469';
              if (hot) H.glow(ctx, '#7dd3fc', 10);
              H.rr(ctx, x - cell * 0.32, y - cell * 0.3 + (v ? 0 : cell * 0.18) - lift, cell * 0.64, cell * 0.5, 6); ctx.fill();
              if (hot) H.noglow(ctx);
            } else {
              /* 硬币：绕纵轴翻转，前半程显示旧面、后半程显示新面 */
              if (hot) {
                const sx = Math.max(0.06, Math.abs(Math.cos(pp * Math.PI)));
                const showNew = pp >= 0.5;
                const val = showNew ? v : (p.toggle ? v : 1 - v);
                ctx.save();
                ctx.translate(x, y);
                ctx.scale(sx, 1);
                H.glow(ctx, '#fbbf24', 12);
                H.circle(ctx, 0, 0, cell * 0.36, val ? '#fbbf24' : '#273469', '#f87171');
                H.noglow(ctx);
                if (p.labels) H.txt(ctx, p.labels[i], 0, 0, { size: 10, bold: true, color: val ? '#0b1020' : '#8fa0c8' });
                ctx.restore();
              } else {
                H.circle(ctx, x, y, cell * 0.36, v ? '#fbbf24' : '#273469', '#39437a');
                if (p.labels) H.txt(ctx, p.labels[i], x, y, { size: 10, bold: true, color: v ? '#0b1020' : '#8fa0c8' });
              }
            }
            if (hot && pp > 0.85) {
              ctx.globalAlpha = (1 - pp) * 5;
              H.circle(ctx, x, y, cell * 0.5, null, '#f87171');
              ctx.globalAlpha = 1;
            }
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
      /* 重放前 m 步得到数组快照 */
      function arrAt(m) {
        const a = p.init.slice();
        for (let i = 0; i < m && i < ops.length; i++) apply(a, ops[i]);
        return a;
      }
      return {
        steps: ops.length, baseMs: p.baseMs || 400, ease: 'power2.inOut',
        label: function (k) { return k === 0 ? (p.cap0 || '初始') : (ops[k - 1].cap || opText(ops[k - 1])); },
        draw: function (ctx, W, Hh, k, pp, now) {
          const prev = arrAt(k - 1);
          const a = arrAt(k);
          const n = Math.max(a.length, prev.length);
          const tw = Math.min(56, (W - 80) / Math.max(n, 1));
          const x0 = (W - tw * a.length) / 2, y = 140;
          const last = k > 0 ? ops[k - 1] : null;
          /* 映射：新数组每个位置的值来自旧数组哪个位置（用于滑动补间） */
          const fromIdx = mapOp(last, prev.length, a.length);
          a.forEach(function (v, i) {
            const src = fromIdx ? fromIdx[i] : i;
            const moving = fromIdx && src !== i && src >= 0 && src < prev.length;
            let x = x0 + i * tw + tw / 2;
            let lift = 0;
            if (moving) {
              const srcX = (W - tw * prev.length) / 2 + src * tw + tw / 2;
              x = H.lerp(srcX, x, pp);
              lift = -Math.sin(pp * Math.PI) * 34;
            }
            const isNew = fromIdx && src === -1;
            const s = isNew ? H.pop(pp) : 1;
            const hot = last && last.hl && last.hl.indexOf(i) >= 0;
            if (moving || isNew) H.glow(ctx, '#fbbf24', 10);
            ctx.save();
            ctx.translate(x, y + 26 + lift);
            ctx.scale(s, s);
            ctx.fillStyle = (hot || moving || isNew) ? 'rgba(251,191,36,.9)' : (p.colorOf ? p.colorOf(v) : '#273469');
            H.rr(ctx, -tw / 2 + 2, -26, tw - 4, 52, 6); ctx.fill();
            H.txt(ctx, p.textOf ? p.textOf(v) : String(v), 0, 0, { size: Math.min(15, tw * 0.4), bold: true, color: p.dark ? '#0b1020' : '#e8ecf8' });
            ctx.restore();
            if (moving || isNew) H.noglow(ctx);
          });
          /* 被删除的元素淡出坠落 */
          if (last && last.t === 'del' && pp < 1) {
            const di = last.i;
            const v = prev[di];
            const px = (W - tw * prev.length) / 2 + di * tw + tw / 2;
            ctx.globalAlpha = 1 - pp;
            ctx.fillStyle = p.colorOf ? p.colorOf(v) : '#273469';
            H.rr(ctx, px - tw / 2 + 2, y + pp * 40, tw - 4, 52, 6); ctx.fill();
            H.txt(ctx, p.textOf ? p.textOf(v) : String(v), px, y + 26 + pp * 40, { size: Math.min(15, tw * 0.4), bold: true, color: '#e8ecf8' });
            ctx.globalAlpha = 1;
          }
          if (p.pointer && last && last.ptr) {
            ctx.globalAlpha = pp;
            last.ptr.forEach(function (q, i2) {
              H.txt(ctx, q[1], x0 + q[0] * tw + tw / 2, y + 74, { size: 12, bold: true, color: H.PAL[i2] });
            });
            ctx.globalAlpha = 1;
          }
          H.txt(ctx, p.cap || '', W / 2, Hh - 14, { size: 11, color: '#8fa0c8' });
          if (p.extra) p.extra(ctx, W, Hh, a, k);
        }
      };
      /* 由操作类型得出 新下标 → 旧下标 的映射；-1 表示新值 */
      function mapOp(o, prevLen, curLen) {
        if (!o) return null;
        const m = [];
        if (o.t === 'swap') {
          for (let i = 0; i < curLen; i++) m[i] = i;
          m[o.i] = o.j; m[o.j] = o.i;
        } else if (o.t === 'rev') {
          for (let i = 0; i < curLen; i++) m[i] = (i >= o.i && i <= o.j) ? (o.i + o.j - i) : i;
        } else if (o.t === 'mov') {
          for (let i = 0; i < curLen; i++) {
            if (i === o.j) m[i] = o.i;
            else if (o.i < o.j && i > o.i && i <= o.j) m[i] = i - 1;
            else if (o.i > o.j && i >= o.j && i < o.i) m[i] = i + 1;
            else m[i] = i;
          }
        } else if (o.t === 'del') {
          for (let i = 0; i < curLen; i++) m[i] = i >= o.i ? i + 1 : i;
        } else if (o.t === 'ins') {
          for (let i = 0; i < curLen; i++) m[i] = i === o.i ? -1 : (i > o.i ? i - 1 : i);
        } else if (o.t === 'set') {
          for (let i = 0; i < curLen; i++) m[i] = i;
          m[o.i] = -1; /* set 视为新值弹出 */
        } else {
          for (let i = 0; i < curLen; i++) m[i] = i;
        }
        return m;
      }
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
        steps: moves.length, baseMs: 400, ease: 'power2.inOut',
        label: function (k) { return k === 0 ? N + ' 层塔在 A 柱' : '第 ' + k + ' 步：' + moves[k - 1].d + '号盘 ' + 'ABCD'[moves[k - 1].f] + '→' + 'ABCD'[moves[k - 1].t]; },
        draw: function (ctx, W, Hh, k, pp, now) {
          const pegs = Array.from({ length: P }, function () { return []; });
          for (let d = N; d >= 1; d--) pegs[0].push(d);
          for (let i = 0; i < k; i++) { pegs[moves[i].t].push(moves[i].d); pegs[moves[i].f].pop(); }
          const baseY = Hh - 60, dh = Math.min(26, (Hh - 130) / N);
          const mv = k > 0 ? moves[k - 1] : null;
          const pegX = function (pi) { return W * (pi + 0.5) / P; };
          for (let pi = 0; pi < P; pi++) {
            const x = pegX(pi);
            H.line(ctx, x, baseY, x, baseY - N * dh - 20, '#39437a', 5);
            H.line(ctx, x - 70, baseY + 6, x + 70, baseY + 6, '#39437a', 3);
            H.txt(ctx, 'ABCD'[pi], x, baseY + 24, { size: 12, color: '#8fa0c8' });
            pegs[pi].forEach(function (d, si) {
              if (mv && pi === mv.t && si === pegs[pi].length - 1 && d === mv.d && pp < 1) return; /* 飞行中的盘不画在柱上 */
              drawDisk(d, x, baseY - (si + 1) * dh + dh / 2, false);
            });
          }
          /* 当前盘：升起 → 平移 → 落下，三段式飞行 */
          if (mv && pp < 1) {
            const fx = pegX(mv.f), tx = pegX(mv.t);
            const fromTop = pegs[mv.f].length;
            const toTop = pegs[mv.t].length - 1;
            const topY = baseY - N * dh - 34;
            const fy = baseY - (fromTop + 1) * dh + dh / 2;
            const ty = baseY - (toTop + 1) * dh + dh / 2;
            let x, y;
            if (pp < 0.28) { x = fx; y = H.lerp(fy, topY, pp / 0.28); }
            else if (pp < 0.72) { x = H.lerp(fx, tx, (pp - 0.28) / 0.44); y = topY; }
            else { x = tx; y = H.lerp(topY, ty, (pp - 0.72) / 0.28); }
            drawDisk(mv.d, x, y, true);
          }
          H.txt(ctx, p.cap || ('共 ' + moves.length + ' 步'), W / 2, 20, { size: 11, color: '#8fa0c8' });

          function drawDisk(d, x, y, flying) {
            const w = 30 + d * (110 / N);
            const col = H.PAL[(d - 1) % 10];
            if (flying) H.glow(ctx, col, 16);
            ctx.fillStyle = col;
            H.rr(ctx, x - w / 2, y - dh / 2 + 3, w, dh - 5, 5); ctx.fill();
            if (flying) H.noglow(ctx);
          }
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
        steps: segs.length, baseMs: 900, ease: 'power3.out',
        label: function (k) { return k === 0 ? '总时限 ' + total + ' 分钟' : segs[k - 1].label; },
        draw: function (ctx, W, Hh, k, pp, now) {
          const x0 = 70, x1 = W - 40, y0 = 60;
          H.line(ctx, x0, y0 - 20, x0, y0 + segs.length * 34 + 10, '#39437a', 2);
          for (let t = 0; t <= total; t += 5) {
            const x = x0 + (x1 - x0) * t / total;
            H.line(ctx, x, y0 - 14, x, y0 - 8, '#39437a', 1);
            H.mono(ctx, String(t), x, y0 - 24, { size: 9, color: '#8fa0c8' });
          }
          for (let i = 0; i < Math.min(k, segs.length); i++) {
            const s = segs[i], y = y0 + i * 34;
            const x = x0 + (x1 - x0) * s.start / total;
            const wFull = (x1 - x0) * s.dur / total;
            const isNew = i === k - 1;
            const w = isNew ? wFull * pp : wFull;   /* 新任务条从左到右生长 */
            const col = s.color || H.PAL[i % 10];
            if (isNew) H.glow(ctx, col, 12);
            ctx.fillStyle = col;
            H.rr(ctx, x, y, Math.max(w, 2), 20, 6); ctx.fill();
            if (isNew) {
              H.noglow(ctx);
              H.circle(ctx, x + w, y + 10, 4, '#ffffff'); /* 生长端点的亮头 */
            }
            H.txt(ctx, s.who, x0 - 8, y + 10, { size: 10, color: '#dfe6f8', align: 'right' });
            if (!isNew || pp > 0.6) H.mono(ctx, s.dur + '\'', x + wFull / 2, y + 10, { size: 10, bold: true, color: '#0b1020' });
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
        steps: gens.length - 1, baseMs: 600, ease: 'power2.out',
        label: function (k) { return '第 ' + k + ' 代'; },
        draw: function (ctx, W, Hh, k, pp, now) {
          const g = gens[Math.min(k, gens.length - 1)];
          const prevG = gens[Math.max(0, k - 1)];
          const R = g.length, C = g[0].length;
          const cell = Math.min((W - 160) / C, (Hh - 80) / R);
          const x0 = (W - cell * C) / 2, y0 = 40;
          for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
            ctx.strokeStyle = '#232c56'; ctx.strokeRect(x0 + c * cell, y0 + r * cell, cell, cell);
            const v = g[r][c], pv = prevG[r][c];
            if (v && k > 0 && !pv) {
              /* 新生细胞：弹出 + 光晕 */
              const s = H.pop(pp);
              const col = p.color || H.PAL[(v - 1) % 10];
              H.glow(ctx, col, 8);
              ctx.fillStyle = col;
              ctx.save();
              ctx.translate(x0 + c * cell + cell / 2, y0 + r * cell + cell / 2);
              ctx.scale(s, s);
              H.rr(ctx, -cell / 2 + 2, -cell / 2 + 2, cell - 4, cell - 4, 4); ctx.fill();
              ctx.restore();
              H.noglow(ctx);
            } else if (v) {
              ctx.fillStyle = p.color || H.PAL[(v - 1) % 10];
              if (k > 0 && pv) ctx.globalAlpha = 0.72 + 0.28 * pp;
              H.rr(ctx, x0 + c * cell + 2, y0 + r * cell + 2, cell - 4, cell - 4, 4); ctx.fill();
              ctx.globalAlpha = 1;
            } else if (k > 0 && pv) {
              /* 死亡：残影淡出 */
              ctx.globalAlpha = (1 - pp) * 0.45;
              ctx.fillStyle = p.color || H.PAL[(pv - 1) % 10];
              H.rr(ctx, x0 + c * cell + 2, y0 + r * cell + 2, cell - 4, cell - 4, 4); ctx.fill();
              ctx.globalAlpha = 1;
            }
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
        steps: frames.length - 1, baseMs: 60, ease: 'power1.out',
        label: function (k) { const f = frames[k]; return f.done ? '找到解！' : (f.ok ? '放置于行' + f.row : '行' + f.row + '列' + f.c + '冲突'); },
        draw: function (ctx, W, Hh, k, pp, now) {
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
            /* 试探格：随补间脉冲 */
            const pulse = 0.5 + 0.5 * pp;
            ctx.fillStyle = f.ok ? ('rgba(74,222,128,' + (0.3 + 0.3 * pulse) + ')') : ('rgba(248,113,113,' + (0.3 + 0.3 * pulse) + ')');
            ctx.fillRect(x0 + f.c * cell, y0 + f.row * cell, cell, cell);
            if (f.ok && pp > 0.5) {
              H.glow(ctx, '#4ade80', 10);
              H.txt(ctx, '♛', x0 + f.c * cell + cell / 2, y0 + f.row * cell + cell / 2, { size: cell * 0.6 * H.pop((pp - 0.5) * 2), color: '#4ade80' });
              H.noglow(ctx);
            }
          }
          if (f.done) {
            /* 成功：整盘皇后泛光 */
            H.glow(ctx, '#5eead4', 12);
            for (let r = 0; r < N; r++) if (f.cols[r] >= 0) {
              H.txt(ctx, '♛', x0 + f.cols[r] * cell + cell / 2, y0 + r * cell + cell / 2, { size: cell * 0.6, color: '#5eead4' });
            }
            H.noglow(ctx);
          }
          H.txt(ctx, p.cap || '', W / 2, Hh - 12, { size: 11, color: '#8fa0c8' });
        }
      };
    }
  });

  /* ============ board/geo 共享：元素级录制 + 语义补间 ============
     每一步的绘制被录制为语义元素（文字/圆角矩形/圆/线段）；
     相邻两步元素配对：同元素滑动过渡、新元素发光弹出、消失元素下沉淡出——
     让每一步都有真实的过程动画，且未变化元素绝不闪烁 */
  const TW0 = 640, TH0 = 330;

  function recordStep(st, withCap) {
    const items = [];
    const state = { fill: '#1b2450', stroke: '#39437a', lw: 1.5, font: '12px sans-serif', align: 'center', baseline: 'middle' };
    let pendRR = null, pathPts = null, pathArc = null;
    const noop = function () {};
    const proxy = new Proxy({}, {
      get: function (t, k) {
        if (k === 'fillRect') return function (x, y, w, h) { items.push({ t: 'rr', x: x, y: y, w: w, h: h, r: 3, fill: state.fill }); };
        if (k === 'strokeRect') return function (x, y, w, h) { items.push({ t: 'recto', x: x, y: y, w: w, h: h, stroke: state.stroke, lw: state.lw }); };
        if (k === 'fillText' || k === 'strokeText') return function (s, x, y) { items.push({ t: 'raw', s: String(s), x: x, y: y, font: state.font, fill: state.fill, align: state.align, baseline: state.baseline }); };
        if (k === 'beginPath') return function () { pathPts = []; pathArc = null; pendRR = null; };
        if (k === 'moveTo' || k === 'lineTo') return function (x, y) { if (pathPts) pathPts.push([x, y]); };
        if (k === 'arc') return function (x, y, r) { pathArc = { x: x, y: y, r: r }; };
        if (k === 'fill') return function () {
          if (pendRR) { items.push({ t: 'rr', x: pendRR.x, y: pendRR.y, w: pendRR.w, h: pendRR.h, r: pendRR.r, fill: state.fill }); pendRR = null; }
          else if (pathArc) { items.push({ t: 'circle', x: pathArc.x, y: pathArc.y, r: pathArc.r, fill: state.fill, stroke: null }); pathArc = null; }
        };
        if (k === 'stroke') return function () {
          if (pathArc) { items.push({ t: 'circle', x: pathArc.x, y: pathArc.y, r: pathArc.r, fill: null, stroke: state.stroke }); pathArc = null; }
          else if (pathPts && pathPts.length >= 2) {
            const a = pathPts[0], b = pathPts[pathPts.length - 1];
            items.push({ t: 'line', x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: state.stroke, lw: state.lw });
          }
        };
        return noop;
      },
      set: function (t, k, v) {
        if (k === 'fillStyle') state.fill = v;
        else if (k === 'strokeStyle') state.stroke = v;
        else if (k === 'lineWidth') state.lw = v;
        else if (k === 'font') state.font = v;
        else if (k === 'textAlign') state.align = v;
        else if (k === 'textBaseline') state.baseline = v;
        return true;
      }
    });
    /* 临时接管 H 助手，捕获语义元素 */
    const oTxt = H.txt, oMono = H.mono, oCircle = H.circle, oLine = H.line, oRR = H.rr;
    H.txt = function (c, s, x, y, o) { o = o || {}; items.push({ t: 'txt', s: String(s), x: x, y: y, size: o.size || 12, bold: !!o.bold, color: o.color || '#dfe6f8', align: o.align, baseline: o.baseline, mono: false }); };
    H.mono = function (c, s, x, y, o) { o = o || {}; items.push({ t: 'txt', s: String(s), x: x, y: y, size: o.size || 12, bold: !!o.bold, color: o.color || '#dfe6f8', align: o.align, baseline: o.baseline, mono: true }); };
    H.circle = function (c, x, y, r, fill, stroke) { items.push({ t: 'circle', x: x, y: y, r: r, fill: fill || null, stroke: stroke || null }); };
    H.line = function (c, x1, y1, x2, y2, color, w) { items.push({ t: 'line', x1: x1, y1: y1, x2: x2, y2: y2, stroke: color || '#39437a', lw: w || 1.5 }); };
    H.rr = function (c, x, y, w, h, r) { pendRR = { x: x, y: y, w: w, h: h, r: r }; };
    try { if (st.fn) st.fn(proxy, TW0, TH0); }
    finally { H.txt = oTxt; H.mono = oMono; H.circle = oCircle; H.line = oLine; H.rr = oRR; }
    if (withCap && st.cap) items.push({ t: 'txt', s: st.cap, x: TW0 / 2, y: TH0 - 14, size: 12, color: '#5eead4', mono: false, cap: true });
    return items;
  }

  function itSig(it) {
    if (it.t === 'txt') return it.t + '|' + it.s + '|' + it.size + '|' + it.color + '|' + (it.mono ? 1 : 0);
    if (it.t === 'circle') return it.t + '|' + Math.round(it.r) + '|' + (it.fill || '') + '|' + (it.stroke || '');
    if (it.t === 'line') return it.t + '|' + (it.stroke || '') + '|' + it.lw;
    if (it.t === 'rr') return it.t + '|' + Math.round(it.w) + 'x' + Math.round(it.h) + '|' + (it.fill || '');
    return it.t + '|' + (it.stroke || '') + '|' + Math.round(it.w || 0) + 'x' + Math.round(it.h || 0);
  }
  function itPos(it) { return it.t === 'line' ? [(it.x1 + it.x2) / 2, (it.y1 + it.y2) / 2] : [it.x, it.y]; }

  /* 配对：同签名元素就近匹配（滑动），剩下的是新生/消失 */
  function matchItems(A, B) {
    const pairs = [], usedA = {}, bySig = {};
    A.forEach(function (it, i) { const s = itSig(it); (bySig[s] = bySig[s] || []).push(i); });
    B.forEach(function (b, j) {
      const cands = bySig[itSig(b)];
      let bi = -1, bd = Infinity;
      if (cands) {
        const pb = itPos(b);
        for (let ci = 0; ci < cands.length; ci++) {
          const i = cands[ci];
          if (usedA[i]) continue;
          const pa = itPos(A[i]);
          const d = (pa[0] - pb[0]) * (pa[0] - pb[0]) + (pa[1] - pb[1]) * (pa[1] - pb[1]);
          if (d < bd) { bd = d; bi = i; }
        }
      }
      if (bi >= 0) { usedA[bi] = 1; pairs.push({ a: bi, b: j }); }
      else pairs.push({ a: -1, b: j });
    });
    A.forEach(function (_, i) { if (!usedA[i]) pairs.push({ a: i, b: -1 }); });
    return pairs;
  }

  /* 单元素绘制（x2/scale 用于插值与弹出） */
  function drawItem(ctx, it, pp, mode) {
    if (it.t === 'txt') {
      const o = { size: it.size, bold: it.bold, color: it.color, align: it.align, baseline: it.baseline };
      if (mode.s !== 1) {
        ctx.save(); ctx.translate(it.x2 !== undefined ? it.x2 : it.x, it.y2 !== undefined ? it.y2 : it.y);
        ctx.scale(mode.s, mode.s);
        (it.mono ? H.mono : H.txt)(ctx, it.s, 0, 0, o);
        ctx.restore();
      } else (it.mono ? H.mono : H.txt)(ctx, it.s, it.x2 !== undefined ? it.x2 : it.x, it.y2 !== undefined ? it.y2 : it.y, o);
    } else if (it.t === 'circle') {
      const r = (it.r2 !== undefined ? it.r2 : it.r) * mode.s;
      H.circle(ctx, it.x2 !== undefined ? it.x2 : it.x, it.y2 !== undefined ? it.y2 : it.y, r, it.fill, it.stroke);
    } else if (it.t === 'line') {
      H.line(ctx, it.x1, it.y1, it.x2, it.y2, it.stroke, it.lw);
    } else if (it.t === 'rr') {
      ctx.fillStyle = it.fill;
      H.rr(ctx, it.x, it.y, it.w * mode.s, it.h * mode.s, it.r);
      ctx.fill();
    } else if (it.t === 'recto') {
      ctx.strokeStyle = it.stroke; ctx.lineWidth = it.lw;
      ctx.strokeRect(it.x, it.y, it.w, it.h);
    } else if (it.t === 'raw') {
      ctx.font = it.font; ctx.fillStyle = it.fill; ctx.textAlign = it.align; ctx.textBaseline = it.baseline;
      ctx.fillText(it.s, it.x, it.y);
    }
  }

  /* 两个同类元素间的插值副本 */
  function lerpItem(a, b, t) {
    const it = { t: b.t, s: b.s, size: b.size, bold: b.bold, color: b.color, align: b.align, baseline: b.baseline, mono: b.mono, fill: b.fill, stroke: b.stroke, lw: b.lw, r: H.lerp(a.r || 0, b.r || 0, t), w: H.lerp(a.w || 0, b.w || 0, t), h: H.lerp(a.h || 0, b.h || 0, t) };
    if (b.t === 'line') {
      it.x1 = H.lerp(a.x1, b.x1, t); it.y1 = H.lerp(a.y1, b.y1, t);
      it.x2 = H.lerp(a.x2, b.x2, t); it.y2 = H.lerp(a.y2, b.y2, t);
    } else {
      it.x = H.lerp(a.x, b.x, t); it.y = H.lerp(a.y, b.y, t);
    }
    return it;
  }

  function makeFrameEngine(p, withCap) {
    const frames = p.steps.map(function (st) { return recordStep(st, withCap); });
    const matches = frames.map(function (f, i) { return i === 0 ? null : matchItems(frames[i - 1], f); });
    return {
      steps: p.steps.length - 1, baseMs: p.baseMs || 800, ease: 'power2.inOut',
      label: function (k) { return p.steps[k].cap; },
      draw: function (ctx, W, Hh, k, pp, now) {
        const i = Math.min(k, frames.length - 1);
        /* 稳态：直接画当前步全部元素 */
        if (i === 0 || pp >= 1) {
          frames[i].forEach(function (it) { drawItem(ctx, it, 1, { s: 1 }); });
          return;
        }
        const A = frames[i - 1], B = frames[i];
        matches[i].forEach(function (pr) {
          if (pr.a >= 0 && pr.b >= 0) {
            /* 同元素：位置/尺寸滑动，字幕类微微上浮 */
            const it = lerpItem(A[pr.a], B[pr.b], pp);
            drawItem(ctx, it, pp, { s: 1 });
          } else if (pr.b >= 0) {
            /* 新元素：按位置错峰弹出 + 光晕 */
            const b = B[pr.b];
            const pb = itPos(b);
            const local = H.clamp01(pp * 1.5 - (pb[0] + pb[1]) / (TW0 + TH0) * 0.5);
            if (local <= 0) return;
            ctx.save();
            ctx.globalAlpha = Math.min(1, local * 1.6);
            if (local < 1) H.glow(ctx, b.color || b.fill || b.stroke || '#5eead4', 10);
            drawItem(ctx, b, local, { s: 0.6 + 0.4 * H.pop(local) });
            if (local < 1) H.noglow(ctx);
            ctx.restore();
          } else {
            /* 消失元素：下沉 + 淡出 */
            const a = A[pr.a];
            const gone = { t: a.t };
            for (const key in a) gone[key] = a[key];
            if (gone.t !== 'line') gone.y2 = a.y + pp * 12;
            ctx.save();
            ctx.globalAlpha = (1 - pp) * 0.85;
            drawItem(ctx, gone, 1, { s: 1 - pp * 0.15 });
            ctx.restore();
          }
        });
      }
    };
  }

  /* ============ geo 几何自定义 ============ */
  PZ.registerEngine('geo', { build: function (p) { return makeFrameEngine(p, false); } });

  /* ============ board 黑板推导 ============ */
  PZ.registerEngine('board', { build: function (p) { return makeFrameEngine(p, true); } });
})();
