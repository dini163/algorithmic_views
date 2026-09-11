/* 谜题动画引擎集（GSAP 补间版）：
   river/jugs/weigh/gridmove/griddp/tour/knight/prince/tiling/flip/arrange/hanoi/timeline/life/queens/geo/board
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

  /* ============ prince 王子之旅 ============
     王子只有三种走法：→ 右移一格、↓ 下移一格、↖ 左上斜移一格。
     构造：上半螺旋（c>r，收在 (n−1,n) 格）→ ↓ 踏进主对角线右下角 →
           连走 ↖ 退回左上角 → ↓ 进入下半螺旋（r>c），任意 n>1 都能每格恰好走一次。
     演示逐步铺开真实路线：落点、步号、按走法着色的箭头连线，
     右侧同步显示完整走法序列、三段结构进度与本步做法说明。 */
  const PR_DIRS = [[0, 1, '→', '右移一格', '#7dd3fc'], [1, 0, '↓', '下移一格', '#4ade80'], [-1, -1, '↖', '左上斜移一格', '#fbbf24']];
  const PR_PHASE = ['① 上半螺旋（c > r）', '② 主对角线（连走 ↖）', '③ 下半螺旋（r > c）'];
  const PR_PCOL = ['#5eead4', '#f0abfc', '#818cf8'];
  const PR_PCAP = [
    '阶段 ①：上半螺旋——在 c > r 的格子里穿行，最后必须收在主对角线右下角的上方',
    '阶段 ②：主对角线——连走 ↖，从右下角一路退回左上角',
    '阶段 ③：下半螺旋——在 r > c 的格子里穿行，走到无路可走即为终点'
  ];

  function withA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  /* 上、下三角各搜一条哈密顿路径，再用主对角线把两段串成完整巡游 */
  function princeTour(N) {
    const cnt = N * (N - 1) / 2;
    function ham(region, start, endAt) {
      const vis = {}, path = [start];
      vis[start[0] + ',' + start[1]] = 1;
      const hit = function () { return !endAt || (path[cnt - 1][0] === endAt[0] && path[cnt - 1][1] === endAt[1]); };
      (function dfs() {
        if (path.length === cnt) return hit();
        const cur = path[path.length - 1];
        for (let d = 0; d < 3; d++) {
          const a = cur[0] + PR_DIRS[d][0], b = cur[1] + PR_DIRS[d][1];
          if (a < 0 || a >= N || b < 0 || b >= N || !region(a, b) || vis[a + ',' + b]) continue;
          vis[a + ',' + b] = 1; path.push([a, b]);
          if (dfs()) return true;
          path.pop(); delete vis[a + ',' + b];
        }
        return false;
      })();
      return path.length === cnt && hit() ? path.slice() : null;
    }
    /* 下半段固定从 (1,0) 起：主对角线走完停在 (0,0)，↓ 一步正好落到这里 */
    const low = ham(function (r, c) { return r > c; }, [1, 0], null);
    if (!low) return null;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (c <= r) continue;
      /* 上半段必须收在 (n−2,n−1)，才能 ↓ 踏进主对角线的右下角 */
      const up = ham(function (a, b) { return b > a; }, [r, c], [N - 2, N - 1]);
      if (!up) continue;
      const seq = up.concat([[N - 1, N - 1]]);
      for (let i = N - 2; i >= 0; i--) seq.push([i, i]);
      return seq.concat(low);
    }
    return null;
  }

  PZ.registerEngine('prince', {
    tour: princeTour,          /* 供独立校验脚本复用：tools/check_prince.js */
    build: function (p) {
      const N = p.n || 6;
      const seq = p.seq || princeTour(N) || [[0, 0]];
      const TOT = seq.length, NMV = TOT - 1;
      const ORD = {};                                   /* 'r,c' → 该格是第几格（0 起） */
      seq.forEach(function (q, i) { ORD[q[0] + ',' + q[1]] = i; });
      const MV = [];                                    /* MV[i]：第 i 格 → 第 i+1 格用的是哪种走法 */
      for (let i = 1; i < TOT; i++) {
        const dr = seq[i][0] - seq[i - 1][0], dc = seq[i][1] - seq[i - 1][1];
        MV.push(PR_DIRS.findIndex(function (d) { return d[0] === dr && d[1] === dc; }));
      }
      const ph = seq.map(function (q) { return q[1] > q[0] ? 0 : (q[0] === q[1] ? 1 : 2); });
      const pcnt = [0, 0, 0];
      ph.forEach(function (x) { pcnt[x]++; });
      const poff = [0, pcnt[0], pcnt[0] + pcnt[1]];     /* 三段在路线里的起始格号 */
      const TINT = PR_DIRS.map(function (d) { return withA(d[4], 0.2); });
      const rc = function (q) { return '(' + (q[0] + 1) + ',' + (q[1] + 1) + ')'; };
      return {
        steps: NMV + 2, baseMs: p.baseMs || 400, ease: 'power2.out',
        label: function (k) {
          if (k === 0) return '起点就位：王子站在第 1 格 ' + rc(seq[0]);
          if (k <= NMV) {
            const d = PR_DIRS[MV[k - 1]];
            return '第 ' + k + '/' + NMV + ' 步 ' + d[2] + ' ' + d[3] + '：' + rc(seq[k - 1]) + ' → ' + rc(seq[k]) + '（已覆盖 ' + (k + 1) + '/' + TOT + ' 格）';
          }
          if (k === NMV + 1) return '三段拼接：' + pcnt[0] + ' + ' + pcnt[1] + ' + ' + pcnt[2] + ' = ' + TOT + ' 格，每格恰好一次';
          return '答案：任意 n > 1 都有解（构造法 O(n²)，不用回溯搜索）✓';
        },
        draw: function (ctx, W, Hh, k, pp, now) {
          const walked = Math.min(k, NMV);              /* 已落定的走法数 */
          const moving = k >= 1 && k <= NMV;            /* 正在走第 k 步 */
          const extra = k - NMV;                        /* 1 = 分段总览，2 = 结论 */
          const cov = Math.min(walked + 1, TOT);
          const curPh = ph[Math.min(walked, TOT - 1)];
          const cell = Math.min((Hh - 104) / N, 226 / N, 40);
          const bw = cell * N, x0 = 26, y0 = 36;
          const cxf = function (c) { return x0 + c * cell + cell / 2; };
          const cyf = function (r) { return y0 + r * cell + cell / 2; };

          /* 顶部：三种走法图例（与轨迹同色）+ 目标 */
          H.txt(ctx, '王子走法', x0, 16, { size: 11, color: '#8fa0c8', align: 'left' });
          [96, 178, 260].forEach(function (lx, i) {
            H.txt(ctx, PR_DIRS[i][2] + ' ' + PR_DIRS[i][3], lx, 16, { size: 11.5, bold: true, color: PR_DIRS[i][4], align: 'left' });
          });
          H.txt(ctx, '目标：' + N + '×' + N + ' = ' + TOT + ' 格，每格恰好走一次', 616, 16, { size: 11, color: '#8fa0c8', align: 'right' });

          /* 棋盘：主对角线是构造骨架，额外染一层；走过的格按“怎么走进来的”着色 */
          for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
            const bx = x0 + c * cell, by = y0 + r * cell;
            ctx.fillStyle = (r + c) % 2 ? '#121a3a' : '#182148';
            ctx.fillRect(bx, by, cell, cell);
            if (r === c) { ctx.fillStyle = 'rgba(240,171,252,.07)'; ctx.fillRect(bx, by, cell, cell); }
            const i = ORD[r + ',' + c];
            if (i !== undefined && i <= walked) {
              ctx.fillStyle = i === 0 ? withA(PR_PCOL[0], 0.24) : TINT[MV[i - 1]];
              ctx.fillRect(bx, by, cell, cell);
            }
            ctx.strokeStyle = '#232c56'; ctx.lineWidth = 1;
            ctx.strokeRect(bx + 0.5, by + 0.5, cell - 1, cell - 1);
          }

          /* 收尾帧：三段区域整体染色，让“螺旋 + 对角线 + 螺旋”一眼看清 */
          if (extra >= 1) {
            const a = 0.16 * (extra === 1 ? pp : 1);
            for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
              ctx.fillStyle = withA(PR_PCOL[ph[ORD[r + ',' + c]]], a);
              ctx.fillRect(x0 + c * cell, y0 + r * cell, cell, cell);
            }
          }

          /* 轨迹：每步一条按走法着色的箭头连线，当前这一步随补间生长 */
          for (let i = 1; i <= walked; i++) {
            const d = PR_DIRS[MV[i - 1]];
            const cur = moving && i === walked, t = cur ? pp : 1;
            const a = seq[i - 1], b = seq[i];
            const ax = cxf(a[1]), ay = cyf(a[0]);
            const dx = cxf(b[1]) - ax, dy = cyf(b[0]) - ay;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const ux = dx / len, uy = dy / len, pad = cell * 0.3;
            const sx = ax + ux * pad, sy = ay + uy * pad;
            const ex = sx + ux * Math.max(0, len - pad * 2) * t, ey = sy + uy * Math.max(0, len - pad * 2) * t;
            if (cur) H.glow(ctx, d[4], 9);
            H.line(ctx, sx, sy, ex, ey, d[4], cur ? 3.4 : 2.6);
            if (t > 0.9) {
              const ang = Math.atan2(uy, ux), hs = Math.min(6, cell * 0.17);
              ctx.beginPath();
              ctx.moveTo(ex, ey);
              ctx.lineTo(ex - hs * Math.cos(ang - 0.45), ey - hs * Math.sin(ang - 0.45));
              ctx.lineTo(ex - hs * Math.cos(ang + 0.45), ey - hs * Math.sin(ang + 0.45));
              ctx.closePath();
              ctx.fillStyle = d[4]; ctx.fill();
            }
            if (cur) H.noglow(ctx);
          }

          /* 步号：走过的每格都标出它是第几格，刚离开的格子淡入 */
          for (let i = 0; i < walked; i++) {
            ctx.globalAlpha = (moving && i === walked - 1) ? H.clamp01(pp * 1.8) : 1;
            H.mono(ctx, String(i + 1), cxf(seq[i][1]), cyf(seq[i][0]),
              { size: Math.min(11.5, cell * 0.31), bold: true, color: '#e8ecf8' });
            ctx.globalAlpha = 1;
          }

          /* 王子：按当前走法从上格平滑滑到落点 */
          let px = cxf(seq[0][1]), py = cyf(seq[0][0]), sc = 1;
          if (walked === 0) sc = 0.5 + 0.5 * H.pop(pp);
          else if (moving) {
            px = H.lerp(cxf(seq[walked - 1][1]), cxf(seq[walked][1]), pp);
            py = H.lerp(cyf(seq[walked - 1][0]), cyf(seq[walked][0]), pp);
          } else { px = cxf(seq[walked][1]); py = cyf(seq[walked][0]); }
          const rad = cell * 0.34 * sc;
          H.glow(ctx, '#f0abfc', 14);
          H.circle(ctx, px, py, rad, '#f0abfc', '#fdf4ff');
          H.noglow(ctx);
          H.mono(ctx, String(walked + 1), px, py + 0.5, { size: Math.min(11.5, rad * 1.05), bold: true, color: '#2b0f33' });

          /* 当前走法的方向符号 + 落点脉冲 */
          if (moving) {
            const d = PR_DIRS[MV[walked - 1]], b = seq[walked];
            H.txt(ctx, d[2], b[1] === N - 1 ? px - rad - 10 : px + rad + 10, b[0] === 0 ? py + rad + 8 : py - rad - 8,
              { size: 15, bold: true, color: d[4] });
            if (pp > 0.7) {
              ctx.globalAlpha = (1 - pp) * 3.2;
              H.circle(ctx, cxf(b[1]), cyf(b[0]), cell * (0.3 + 0.42 * (pp - 0.7) / 0.3), null, d[4]);
              ctx.globalAlpha = 1;
            }
          }
          if (extra === 2) {
            ctx.save();
            ctx.globalAlpha = pp;
            H.glow(ctx, '#4ade80', 16);
            ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2;
            ctx.strokeRect(x0 - 3.5, y0 - 3.5, bw + 7, bw + 7);
            H.noglow(ctx);
            ctx.restore();
          }

          /* 进度条 + 计数 */
          ctx.fillStyle = '#141c3e'; H.rr(ctx, x0, 272, bw, 6, 3); ctx.fill();
          if (walked > 0) {
            ctx.fillStyle = extra === 2 ? '#4ade80' : '#5eead4';
            H.rr(ctx, x0, 272, bw * walked / NMV, 6, 3); ctx.fill();
          }
          H.txt(ctx, '第 ' + walked + ' / ' + NMV + ' 步　·　覆盖 ' + cov + ' / ' + TOT + ' 格', x0 + bw / 2, 290,
            { size: 11.5, bold: true, color: '#dfe6f8' });

          /* 右侧面板：完整走法序列（35 步一格不落） */
          const PX = 274, PW = 342;
          H.txt(ctx, '完整走法序列 · 共 ' + NMV + ' 步', PX, 40, { size: 11, color: '#8fa0c8', align: 'left' });
          const per = Math.max(6, Math.floor(PW / 22)), sw = PW / per, sh = 19;
          for (let m = 0; m < NMV; m++) {
            const d = PR_DIRS[MV[m]];
            const sx = PX + (m % per) * sw, sy = 52 + Math.floor(m / per) * (sh + 5);
            const cur = moving && m === walked - 1, done = m < walked;
            const s = cur ? 0.7 + 0.3 * H.pop(pp) : 1, w2 = (sw - 4) * s, h2 = sh * s;
            if (cur) H.glow(ctx, d[4], 10);
            ctx.fillStyle = cur ? d[4] : (done ? withA(d[4], 0.2) : '#141c3e');
            H.rr(ctx, sx + 2 + ((sw - 4) - w2) / 2, sy + (sh - h2) / 2, w2, h2, 4); ctx.fill();
            if (cur) H.noglow(ctx);
            H.txt(ctx, d[2], sx + sw / 2, sy + sh / 2 + 0.5,
              { size: 12, bold: true, color: cur ? '#0b1020' : (done ? d[4] : '#39437a') });
          }
          let py2 = 52 + Math.ceil(NMV / per) * (sh + 5) + 2;
          H.line(ctx, PX, py2, PX + PW, py2, '#232c56', 1);

          /* 三段结构：当前在哪一段、每段已走过多少格 */
          for (let i = 0; i < 3; i++) {
            const yy = py2 + 18 + i * 23;
            const dn = Math.max(0, Math.min(pcnt[i], cov - poff[i])), act = extra >= 1 || curPh === i;
            H.circle(ctx, PX + 5, yy, 4.5, PR_PCOL[i]);
            H.txt(ctx, PR_PHASE[i], PX + 16, yy, { size: 11.5, bold: act, color: act ? '#e8ecf8' : '#6f7ea6', align: 'left' });
            H.txt(ctx, dn + '/' + pcnt[i] + ' 格', PX + PW, yy, { size: 11, color: dn >= pcnt[i] ? PR_PCOL[i] : '#8fa0c8', align: 'right' });
            ctx.fillStyle = '#141c3e'; H.rr(ctx, PX + 16, yy + 9, PW - 16, 3, 1.5); ctx.fill();
            if (dn > 0) { ctx.fillStyle = PR_PCOL[i]; H.rr(ctx, PX + 16, yy + 9, (PW - 16) * dn / pcnt[i], 3, 1.5); ctx.fill(); }
          }
          py2 = py2 + 18 + 3 * 23 + 1;
          H.line(ctx, PX, py2, PX + PW, py2, '#232c56', 1);

          /* 本步做法：这一步用了哪种走法、从哪格到哪格 */
          H.txt(ctx, '本步做法', PX, py2 + 16, { size: 10, color: '#8fa0c8', align: 'left' });
          let big = '起点就位', bigCol = PR_PCOL[0], sub = '王子站在第 1 格 ' + rc(seq[0]) + '，等待第一步';
          if (moving) {
            const d = PR_DIRS[MV[walked - 1]];
            big = d[2] + ' ' + d[3]; bigCol = d[4];
            sub = '第 ' + walked + ' 步：' + rc(seq[walked - 1]) + ' → ' + rc(seq[walked]);
          } else if (extra === 1) {
            big = '三段拼接完成'; bigCol = '#5eead4';
            sub = pcnt[0] + ' + ' + pcnt[1] + ' + ' + pcnt[2] + ' = ' + TOT + ' 格，一格不多一格不少';
          } else if (extra === 2) {
            big = '构造成立 ✓'; bigCol = '#4ade80';
            sub = '任意 n > 1 照此构造，O(n²) 直接给出整条路线';
          }
          H.txt(ctx, big, PX, py2 + 38, { size: 16, bold: true, color: bigCol, align: 'left' });
          H.txt(ctx, sub, PX, py2 + 60, { size: 11, color: '#dfe6f8', align: 'left' });

          /* 底部：阶段解说 / 结论 */
          let cap = '王子从第 1 格出发，每步只能 →、↓ 或 ↖ 走一格，要把 ' + TOT + ' 格各走一次', capCol = '#5eead4';
          if (moving) { cap = PR_PCAP[curPh]; capCol = PR_PCOL[curPh]; }
          if (k === NMV) { cap = '第 ' + NMV + ' 步落定：' + TOT + ' 格全部走完，每格恰好一次 ✓'; capCol = '#4ade80'; }
          if (extra === 1) { cap = '整条路线 = ① 上半螺旋 ' + pcnt[0] + ' 格 → ② 主对角线 ' + pcnt[1] + ' 格 → ③ 下半螺旋 ' + pcnt[2] + ' 格'; capCol = '#5eead4'; }
          if (extra === 2) { cap = '答案：任意 n > 1 都能这样构造 → 每格恰好走一次 ✓'; capCol = '#4ade80'; }
          H.txt(ctx, cap, W / 2, 316, { size: 12.5, bold: true, color: capCol });
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
          const isEmpty = function (v) { return p.isEmpty ? p.isEmpty(v) : (v === '_' || v === '' || v === null || v === undefined); };
          /* 槽位底板：位置永远静止——只有内容（数字/棋子）在槽位间移动，方块不动 */
          ctx.fillStyle = p.slotColor || '#131a38';
          for (let si = 0; si < a.length; si++) { H.rr(ctx, x0 + si * tw + 2, y, tw - 4, 52, 6); ctx.fill(); }
          a.forEach(function (v, i) {
            if (isEmpty(v)) return;   /* 空位只留底板，绝不参与移动动画 */
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
            ctx.save();
            ctx.translate(x, y + 26 + lift);
            ctx.scale(s, s);
            /* 方块填充色始终只表达内容本身；移动/高亮状态改用描边圈表示，避免变色混乱 */
            ctx.fillStyle = p.colorOf ? p.colorOf(v) : '#273469';
            H.rr(ctx, -tw / 2 + 2, -26, tw - 4, 52, 6); ctx.fill();
            if (hot || moving || isNew) {
              ctx.strokeStyle = p.accentColor || '#fbbf24';
              ctx.lineWidth = 3;
              H.rr(ctx, -tw / 2 + 1, -27, tw - 2, 54, 7); ctx.stroke();
            }
            H.txt(ctx, p.textOf ? p.textOf(v) : String(v), 0, 0, { size: Math.min(15, tw * 0.4), bold: true, color: p.dark ? '#0b1020' : '#e8ecf8' });
            ctx.restore();
          });
          /* 被删除的元素淡出坠落（空值不画） */
          if (last && last.t === 'del' && pp < 1) {
            const di = last.i;
            const v = prev[di];
            if (!isEmpty(v)) {
              const px = (W - tw * prev.length) / 2 + di * tw + tw / 2;
              ctx.globalAlpha = 1 - pp;
              ctx.fillStyle = p.colorOf ? p.colorOf(v) : '#273469';
              H.rr(ctx, px - tw / 2 + 2, y + pp * 40, tw - 4, 52, 6); ctx.fill();
              H.txt(ctx, p.textOf ? p.textOf(v) : String(v), px, y + 26 + pp * 40, { size: Math.min(15, tw * 0.4), bold: true, color: '#e8ecf8' });
              ctx.globalAlpha = 1;
            }
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
        label: function (k) {
          if (k === 0) return '总时限 ' + total + ' 分钟';
          const s = segs[k - 1];
          return s.label || ('第 ' + k + ' 段：' + s.who + '（' + s.start + ' → ' + (s.start + s.dur) + '，历时 ' + s.dur + '）');
        },
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
            /* 试探格：边框随补间脉冲（填充不变，只表达棋盘底色） */
            const pulse = 0.5 + 0.5 * pp;
            ctx.strokeStyle = f.ok ? '#4ade80' : '#f87171';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.45 + 0.55 * pulse;
            H.rr(ctx, x0 + f.c * cell + 2, y0 + f.row * cell + 2, cell - 4, cell - 4, 4);
            ctx.stroke();
            ctx.globalAlpha = 1;
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

  /* ============ fillgrid 静态盘填数（幻方类） ============
     与 queens 同一绘制范式：每帧原样重绘整个棋盘，格子永不参与任何过渡动画；
     只有本步新填的数字做缩放入位（仅文字动），新填格给绿色描边（不动填充）。
     行/列和在填满时直接静态出现，验证帧全部染绿。 */
  PZ.registerEngine('fillgrid', {
    build: function (p) {
      const R = p.rows, C = p.cols;
      const frames = [{ cap: p.introCap, note: p.introNote, vals: [] }];
      const acc = [];
      p.place.forEach(function (pl) {
        pl.cells.forEach(function (cell) { acc.push(cell); });
        frames.push({ cap: pl.cap, note: pl.note, vals: acc.slice(), just: pl.cells.map(function (c) { return c[0] + ',' + c[1]; }) });
      });
      frames.push({ cap: p.verifyCap, note: p.verifyNote, vals: acc.slice(), verify: true });
      return {
        steps: frames.length - 1, baseMs: p.baseMs || 750, ease: 'power2.inOut',
        label: function (k) { return frames[Math.min(k, frames.length - 1)].cap || ''; },
        draw: function (ctx, W, Hh, k, pp) {
          const f = frames[Math.min(k, frames.length - 1)];
          const cell = Math.min((W - 260) / C, (Hh - 110) / R, 46);
          const x0 = (W - cell * C) / 2 - 20, y0 = (Hh - cell * R) / 2 - 14;
          /* 棋盘格：每帧原样重绘，永不参与任何动画（同 #140 皇后棋盘） */
          for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
            ctx.fillStyle = '#1b2450';
            H.rr(ctx, x0 + c * cell + 1.5, y0 + r * cell + 1.5, cell - 3, cell - 3, 4); ctx.fill();
          }
          const map = {};
          (f.vals || []).forEach(function (v) { map[v[0] + ',' + v[1]] = v[2]; });
          const just = {};
          (f.just || []).forEach(function (j) { just[j] = 1; });
          /* 已就位数字静态绘制；本步新填数字仅文字缩放入位 + 绿描边淡入 */
          for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
            const v = map[r + ',' + c];
            if (v === undefined) continue;
            const isJust = !!just[r + ',' + c];
            const color = (f.verify || isJust) ? '#4ade80' : '#dfe6f8';
            const cx = x0 + c * cell + cell / 2, cy = y0 + r * cell + cell / 2;
            const size = Math.min(15, cell * 0.45);
            if (isJust) {
              ctx.save();
              ctx.translate(cx, cy);
              const s = H.pop(pp);
              ctx.scale(s, s);
              H.txt(ctx, String(v), 0, 0, { size: size, bold: true, color: color });
              ctx.restore();
              ctx.save();
              ctx.globalAlpha = 0.3 + 0.7 * pp;
              ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2.5;
              H.rr(ctx, x0 + c * cell + 2.5, y0 + r * cell + 2.5, cell - 5, cell - 5, 4); ctx.stroke();
              ctx.restore();
            } else {
              H.txt(ctx, String(v), cx, cy, { size: size, bold: true, color: color });
            }
          }
          /* 行和：填满的行右侧直接静态出现（无过渡动画） */
          for (let r = 0; r < R; r++) {
            let s = 0, full = true;
            for (let c = 0; c < C; c++) { const v = map[r + ',' + c]; if (v === undefined) { full = false; break; } s += v; }
            if (full) H.mono(ctx, '= ' + s, x0 + C * cell + 30, y0 + r * cell + cell / 2, { size: 13, bold: true, color: s === 15 ? '#4ade80' : '#f87171' });
          }
          /* 验证帧：底部列和 */
          if (f.verify) {
            for (let c = 0; c < C; c++) {
              let s = 0;
              for (let r = 0; r < R; r++) s += map[r + ',' + c];
              H.mono(ctx, String(s), x0 + c * cell + cell / 2, y0 + R * cell + 16, { size: 12, bold: true, color: s === 15 ? '#4ade80' : '#f87171' });
            }
          }
          /* 注解行：固定位置瞬时切换 */
          if (f.note) H.txt(ctx, f.note, W / 2, y0 + R * cell + (f.verify ? 40 : 34), { size: 13, bold: true, color: f.verify ? '#4ade80' : '#8fa0c8' });
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
    let pendRR = null, pathPts = null, pathArc = null, pathClosed = false;
    const noop = function () {};
    const proxy = new Proxy({}, {
      get: function (t, k) {
        if (k === 'fillRect') return function (x, y, w, h) { items.push({ t: 'rr', x: x, y: y, w: w, h: h, r: 3, fill: state.fill }); };
        if (k === 'strokeRect') return function (x, y, w, h) { items.push({ t: 'recto', x: x, y: y, w: w, h: h, stroke: state.stroke, lw: state.lw }); };
        if (k === 'fillText' || k === 'strokeText') return function (s, x, y) { items.push({ t: 'raw', s: String(s), x: x, y: y, font: state.font, fill: state.fill, align: state.align, baseline: state.baseline }); };
        if (k === 'beginPath') return function () { pathPts = []; pathArc = null; pendRR = null; pathClosed = false; };
        if (k === 'moveTo' || k === 'lineTo') return function (x, y) { if (pathPts) pathPts.push([x, y]); };
        if (k === 'closePath') return function () { pathClosed = true; };
        if (k === 'arc') return function (x, y, r) { pathArc = { x: x, y: y, r: r }; };
        /* 注意：fill/stroke 后 pathPts 不置空（canvas 语义：路径保留到下一次 beginPath），
           因此"同一路径先 fill 再 stroke"能分别录成填充多边形 + 描边多边形 */
        if (k === 'fill') return function () {
          if (pendRR) { items.push({ t: 'rr', x: pendRR.x, y: pendRR.y, w: pendRR.w, h: pendRR.h, r: pendRR.r, fill: state.fill }); pendRR = null; }
          else if (pathArc) { items.push({ t: 'circle', x: pathArc.x, y: pathArc.y, r: pathArc.r, fill: state.fill, stroke: null }); pathArc = null; }
          else if (pathPts && pathPts.length >= 3) { items.push({ t: 'poly', pts: pathPts.slice(), fill: state.fill }); }
        };
        if (k === 'stroke') return function () {
          if (pendRR) { items.push({ t: 'recto', x: pendRR.x, y: pendRR.y, w: pendRR.w, h: pendRR.h, stroke: state.stroke, lw: state.lw }); pendRR = null; }
          else if (pathArc) { items.push({ t: 'circle', x: pathArc.x, y: pathArc.y, r: pathArc.r, fill: null, stroke: state.stroke }); pathArc = null; }
          else if (pathPts && pathPts.length >= 3) { items.push({ t: 'poly', pts: pathPts.slice(), fill: null, stroke: state.stroke, lw: state.lw, closed: pathClosed }); }
          else if (pathPts && pathPts.length === 2) {
            const a = pathPts[0], b = pathPts[1];
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
    /* 临时接管 H 助手，捕获语义元素；U.lines 产生的多行注解打 note 标 */
    let noteFlag = false;
    const oTxt = H.txt, oMono = H.mono, oCircle = H.circle, oLine = H.line, oRR = H.rr;
    const UU = window.PZ.U || {};
    const oULines = UU.lines;
    if (oULines) UU.lines = function (c, W, rows, y0, gap) {
      noteFlag = true;
      try { oULines(c, W, rows, y0, gap); } finally { noteFlag = false; }
    };
    H.txt = function (c, s, x, y, o) { o = o || {}; items.push({ t: 'txt', s: String(s), x: x, y: y, size: o.size || 12, bold: !!o.bold, color: o.color || '#dfe6f8', align: o.align, baseline: o.baseline, mono: false, note: noteFlag || undefined }); };
    H.mono = function (c, s, x, y, o) { o = o || {}; items.push({ t: 'txt', s: String(s), x: x, y: y, size: o.size || 12, bold: !!o.bold, color: o.color || '#dfe6f8', align: o.align, baseline: o.baseline, mono: true, note: noteFlag || undefined }); };
    H.circle = function (c, x, y, r, fill, stroke) { items.push({ t: 'circle', x: x, y: y, r: r, fill: fill || null, stroke: stroke || null }); };
    H.line = function (c, x1, y1, x2, y2, color, w) { items.push({ t: 'line', x1: x1, y1: y1, x2: x2, y2: y2, stroke: color || '#39437a', lw: w || 1.5 }); };
    H.rr = function (c, x, y, w, h, r) { pendRR = { x: x, y: y, w: w, h: h, r: r }; };
    try { if (st.fn) st.fn(proxy, TW0, TH0); }
    finally {
      H.txt = oTxt; H.mono = oMono; H.circle = oCircle; H.line = oLine; H.rr = oRR;
      if (oULines) UU.lines = oULines;
    }
    if (withCap && st.cap) items.push({ t: 'txt', s: st.cap, x: TW0 / 2, y: TH0 - 14, size: 12, color: '#5eead4', mono: false, cap: true });
    return items;
  }

  function itSig(it) {
    if (it.t === 'txt') return it.t + '|' + it.s + '|' + it.size + '|' + it.color + '|' + (it.mono ? 1 : 0);
    if (it.t === 'circle') return it.t + '|' + Math.round(it.r) + '|' + (it.fill || '') + '|' + (it.stroke || '');
    if (it.t === 'line') return it.t + '|' + (it.stroke || '') + '|' + it.lw;
    if (it.t === 'rr') return it.t + '|' + Math.round(it.w) + 'x' + Math.round(it.h) + '|' + (it.fill || '');
    if (it.t === 'poly') return it.t + '|' + it.pts.length + '|' + (it.fill || '') + '|' + (it.stroke || '');
    return it.t + '|' + (it.stroke || '') + '|' + Math.round(it.w || 0) + 'x' + Math.round(it.h || 0);
  }
  function polyC(it) {
    let sx = 0, sy = 0;
    it.pts.forEach(function (p) { sx += p[0]; sy += p[1]; });
    return [sx / it.pts.length, sy / it.pts.length];
  }
  function itPos(it) {
    if (it.t === 'poly') return polyC(it);
    return it.t === 'line' ? [(it.x1 + it.x2) / 2, (it.y1 + it.y2) / 2] : [it.x, it.y];
  }

  /* 几何距离：同类型图形的位置/尺寸差异（用于"原位换色"配对，越小越重合） */
  function geoDist(a, b) {
    if (a.t !== b.t) return Infinity;
    if (a.t === 'poly') {
      if (a.pts.length !== b.pts.length) return Infinity;
      const ca = polyC(a), cb = polyC(b);
      return Math.max(Math.abs(ca[0] - cb[0]), Math.abs(ca[1] - cb[1]));
    }
    if (a.t === 'rr' || a.t === 'recto') return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs((a.w || 0) - (b.w || 0)), Math.abs((a.h || 0) - (b.h || 0)));
    if (a.t === 'circle') return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs((a.r || 0) - (b.r || 0)));
    if (a.t === 'line') return Math.max(Math.abs(a.x1 - b.x1), Math.abs(a.y1 - b.y1), Math.abs(a.x2 - b.x2), Math.abs(a.y2 - b.y2));
    return Infinity;
  }

  /* 配对：同签名元素「按距离升序」全局贪心配对 ——
     先把完全重合（距离 0）的孪生元素全部锁死，再逐次配次近的。
     这样静态元素永远配到自己的原位孪生，绝不会因为遍历顺序被别的同类元素
     "抢走"从而被迫做远端补间滑动（那正是棋盘无关格子乱闪的根因）；
     而真正移动的元素（同签名的唯一候补）依旧会正常配到对方，保留滑动动画。
     剩下的才是新生/消失，交由 morph 做原位换色配对。 */
  function matchItems(A, B) {
    const pairs = [], usedA = {}, usedB = {}, bySig = {}, posA = [];
    A.forEach(function (it, i) {
      posA[i] = itPos(it);
      const s = itSig(it);
      if (s) (bySig[s] = bySig[s] || []).push(i);
    });
    const cand = [];
    B.forEach(function (b, j) {
      const s = itSig(b); if (!s) return;
      const list = bySig[s]; if (!list) return;
      const pb = itPos(b);
      for (let ci = 0; ci < list.length; ci++) {
        const i = list[ci], pa = posA[i];
        const dx = pa[0] - pb[0], dy = pa[1] - pb[1];
        cand.push({ i: i, j: j, d: dx * dx + dy * dy });
      }
    });
    cand.sort(function (x, y) { return x.d - y.d; });
    for (let ci = 0; ci < cand.length; ci++) {
      const c = cand[ci];
      if (usedA[c.i] || usedB[c.j]) continue;
      usedA[c.i] = 1; usedB[c.j] = 1; pairs.push({ a: c.i, b: c.j });
    }
    B.forEach(function (_, j) { if (!usedB[j]) pairs.push({ a: -1, b: j }); });
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
    } else if (it.t === 'poly') {
      ctx.beginPath();
      it.pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
      if (it.closed !== false) ctx.closePath();
      if (it.fill) { ctx.fillStyle = it.fill; ctx.fill(); }
      if (it.stroke) { ctx.strokeStyle = it.stroke; ctx.lineWidth = it.lw || 1; ctx.stroke(); }
    } else if (it.t === 'raw') {
      ctx.font = it.font; ctx.fillStyle = it.fill; ctx.textAlign = it.align; ctx.textBaseline = it.baseline;
      ctx.fillText(it.s, it.x, it.y);
    }
  }

  /* 两个同类元素间的插值副本 */
  function lerpItem(a, b, t) {
    const it = { t: b.t, s: b.s, size: b.size, bold: b.bold, color: b.color, align: b.align, baseline: b.baseline, mono: b.mono, fill: b.fill, stroke: b.stroke, lw: b.lw, closed: b.closed, r: H.lerp(a.r || 0, b.r || 0, t), w: H.lerp(a.w || 0, b.w || 0, t), h: H.lerp(a.h || 0, b.h || 0, t) };
    if (b.t === 'poly') {
      if (a.t === 'poly' && a.pts.length === b.pts.length) {
        it.pts = b.pts.map(function (p, i) { return [H.lerp(a.pts[i][0], p[0], t), H.lerp(a.pts[i][1], p[1], t)]; });
      } else it.pts = b.pts.map(function (p) { return [p[0], p[1]]; });
      return it;
    }
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
    /* 纯文字帧升级：整帧没有图形元素时，继承最近图形帧的完整场景（方块/字母/网格/场景标签全保留，
       仅剔除上一帧的注解行），并把自己的注解行整体搬入画面中最大的竖向空白区，
       空白不够时垫半透明底板——每一步都是"完整图形场景 + 文字叠加说明"，
       文字永不独占画面、也不压住图形 */
    function isGfx(it) { return it.t !== 'txt' && it.t !== 'raw'; }
    for (let fi = 0; fi < frames.length; fi++) {
      if (frames[fi].some(isGfx)) continue;
      let src = -1, fj;
      for (fj = fi - 1; fj >= 0; fj--) if (frames[fj].some(isGfx)) { src = fj; break; }
      if (src < 0) for (fj = fi + 1; fj < frames.length; fj++) if (frames[fj].some(isGfx)) { src = fj; break; }
      if (src < 0) continue;
      const scene = frames[src].filter(function (it) { return !it.cap && !it.note; });
      let notes = frames[fi].filter(function (it) { return !it.cap; });
      const capIt = frames[fi].filter(function (it) { return it.cap; });
      /* 场景元素占用的竖直区间（估算半高） */
      const iv = scene.map(function (it) {
        const p = itPos(it); let hh = 14;
        if (it.t === 'rr' || it.t === 'recto') hh = (it.h || 30) / 2 + 4;
        else if (it.t === 'circle') hh = it.r + 4;
        else if (it.t === 'txt') hh = (it.size || 12) * 0.8 + 3;
        else if (it.t === 'line') hh = Math.abs(it.y2 - it.y1) / 2 + 5;
        return [p[1] - hh, p[1] + hh];
      }).sort(function (a, b) { return a[0] - b[0]; });
      const TOP = 24, BOT = TH0 - 38;
      const merged = [];
      iv.forEach(function (r) {
        const c = [Math.max(r[0], TOP), Math.min(r[1], BOT)];
        if (c[1] <= c[0]) return;
        const last = merged[merged.length - 1];
        if (last && c[0] <= last[1] + 8) last[1] = Math.max(last[1], c[1]);
        else merged.push(c);
      });
      const gaps = []; let cur = TOP;
      merged.forEach(function (m) { if (m[0] > cur) gaps.push([cur, m[0]]); cur = Math.max(cur, m[1]); });
      if (BOT > cur) gaps.push([cur, BOT]);
      let best = null;
      gaps.forEach(function (g) { if (!best || g[1] - g[0] > best[1] - best[0]) best = g; });
      let backdrop = null;
      if (notes.length && best) {
        let nMin = Infinity, nMax = -Infinity;
        notes.forEach(function (n) { nMin = Math.min(nMin, n.y); nMax = Math.max(nMax, n.y); });
        const need = (nMax - nMin) + 30;
        const dy = (best[0] + best[1]) / 2 - (nMin + nMax) / 2;
        notes = notes.map(function (n) {
          const c = { t: n.t };
          for (const kk in n) c[kk] = n[kk];
          c.y = n.y + dy;
          return c;
        });
        if (best[1] - best[0] < need) {
          /* 空白不足：垫半透明底板保证可读 */
          backdrop = { t: 'rr', x: 64, y: nMin + dy - 17, w: TW0 - 128, h: need - 8, r: 8, fill: 'rgba(8,11,22,0.88)', note: true };
        }
      }
      frames[fi] = scene.concat(backdrop ? [backdrop] : [], notes, capIt);
    }
    const exact = frames.map(function (f, i) { return i === 0 ? null : matchItems(frames[i - 1], f); });
    /* 文字松散配对：位置相近的未配对文字两两结对（字幕只配字幕），
       过渡时旧文字原位淡出、新文字原位淡入——图例/注解切换不再闪没 */
    const morph = frames.map(function (f, i) {
      if (i === 0) return null;
      const A = frames[i - 1], B = f, pairs = [], usedB = {};
      const freeA = exact[i].filter(function (pr) { return pr.b === -1; }).map(function (pr) { return pr.a; });
      const freeB = exact[i].filter(function (pr) { return pr.a === -1; }).map(function (pr) { return pr.b; });
      freeA.forEach(function (ai) {
        const a = A[ai];
        if (a.t !== 'txt' && !a.cap) return;
        let best = -1, bd = Infinity;
        const pa = itPos(a);
        freeB.forEach(function (bj) {
          if (usedB[bj]) return;
          const b = B[bj];
          if (b.t !== 'txt' && !b.cap) return;
          if (!!a.cap !== !!b.cap) return;
          const pb = itPos(b);
          const d = (pa[0] - pb[0]) * (pa[0] - pb[0]) + (pa[1] - pb[1]) * (pa[1] - pb[1]);
          if (d < bd) { bd = d; best = bj; }
        });
        if (best >= 0 && (a.cap || bd <= 3600)) { usedB[best] = 1; pairs.push({ a: ai, b: best }); }
      });
      /* 图形原位配对：几何完全重合但样式变化的图形（格子底色/描边/圆点换色、高亮出现）
         两两结对——过渡时原地换色，位置尺寸纹丝不动（方块绝不跟着内容动） */
      freeA.forEach(function (ai) {
        const a = A[ai];
        if (a.t === 'txt' || a.t === 'raw' || a.cap || a.note) return;
        let best = -1, bd = Infinity;
        freeB.forEach(function (bj) {
          if (usedB[bj]) return;
          const d = geoDist(a, B[bj]);
          if (d < bd) { bd = d; best = bj; }
        });
        if (best >= 0 && bd <= 3) { usedB[best] = 1; pairs.push({ a: ai, b: best }); }
      });
      return pairs;
    });
    return {
      steps: p.steps.length - 1, baseMs: p.baseMs || 800, ease: 'power2.inOut',
      /* 供 tools/flicker_audit.js 做连续性审计（生产绘制不读取） */
      _frames: frames, _matches: exact,
      label: function (k) { return p.steps[k].cap; },
      draw: function (ctx, W, Hh, k, pp, now) {
        const i = Math.min(k, frames.length - 1);
        /* 稳态：只画当前帧全量元素，干净无残影 */
        if (i === 0 || pp >= 1) {
          frames[i].forEach(function (it) { drawItem(ctx, it, 1, { s: 1 }); });
          return;
        }
        const A = frames[i - 1], B = frames[i];
        const mA = {}, mB = {};
        (morph[i] || []).forEach(function (pr) { mA[pr.a] = pr.b; mB[pr.b] = pr.a; });
        /* 第一遍：离场元素前半程干净淡出（微缩下沉），绝不残留 */
        exact[i].forEach(function (pr) {
          if (pr.a < 0 || pr.b >= 0 || mA[pr.a] !== undefined) return;
          const out = H.clamp01(pp / 0.55);
          ctx.save();
          ctx.globalAlpha = (1 - out) * 0.95;
          drawItem(ctx, A[pr.a], 1, { s: 1 - out * 0.12 });
          ctx.restore();
        });
        /* 第二遍：配对滑动 / 文字原位交叉淡化 / 新元素后半程错峰弹入 */
        exact[i].forEach(function (pr) {
          if (pr.a >= 0 && pr.b >= 0) {
            const it = lerpItem(A[pr.a], B[pr.b], pp);
            drawItem(ctx, it, pp, { s: 1 });
          } else if (pr.a >= 0 && mA[pr.a] !== undefined) {
            const aIt = A[pr.a];
            if (aIt.t === 'txt' || aIt.cap) {
              /* 旧文字：原位淡出 */
              ctx.save(); ctx.globalAlpha = (1 - pp) * 0.9;
              drawItem(ctx, aIt, 1, { s: 1 });
              ctx.restore();
            }
            /* 图形原位换色：旧样式直接不画（瞬间切换，零动画） */
          } else if (pr.b >= 0) {
            const b = B[pr.b];
            if (mB[pr.b] !== undefined) {
              if (b.t === 'txt' || b.cap) {
                /* 新文字：原位淡入（微微上浮就位） */
                const nb = { t: b.t };
                for (const key in b) nb[key] = b[key];
                nb.y2 = b.y - 4 * (1 - pp);
                ctx.save(); ctx.globalAlpha = pp;
                drawItem(ctx, nb, 1, { s: 1 });
                ctx.restore();
              } else {
                /* 图形原位换色：直接画新样式，位置尺寸颜色全程静止无动画 */
                drawItem(ctx, b, 1, { s: 1 });
              }
            } else {
              /* 全新元素：后半程按位置错峰弹入 + 光晕 */
              const pb = itPos(b);
              const local = H.clamp01(pp * 1.6 - 0.25 - (pb[0] + pb[1]) / (TW0 + TH0) * 0.4);
              if (local <= 0) return;
              ctx.save();
              ctx.globalAlpha = Math.min(1, local * 1.6);
              if (local < 1) H.glow(ctx, b.color || b.fill || b.stroke || '#5eead4', 8);
              drawItem(ctx, b, local, { s: 0.85 + 0.15 * H.pop(local) });
              if (local < 1) H.noglow(ctx);
              ctx.restore();
            }
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
