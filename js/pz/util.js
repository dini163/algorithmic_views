/* 谜题库辅助绘图：文字行 / 数字方块行 / 网格 / 脚本化过河 */
(function () {
  const H = window.PZ.H;
  const U = (window.PZ.U = {});

  /* 多行居中文字 rows: [ [text,size,color,bold], ... ] */
  U.lines = function (ctx, W, rows, y0, gap) {
    y0 = y0 || 56; gap = gap || 26;
    rows.forEach(function (r, i) {
      H.txt(ctx, r[0], W / 2, y0 + i * gap, { size: r[1] || 15, color: r[2] || '#dfe6f8', bold: r[3] });
    });
  };

  /* 一排方块（数字/字母）返回左上角 x0；hot: 高亮下标数组 */
  U.row = function (ctx, W, y, arr, hot, colorOf) {
    const n = arr.length, tw = Math.min(42, (W - 80) / Math.max(n, 1));
    const x0 = (W - tw * n) / 2;
    arr.forEach(function (v, i) {
      const isHot = hot && hot.indexOf(i) >= 0;
      ctx.fillStyle = isHot ? 'rgba(251,191,36,.92)' : (colorOf ? colorOf(v) : '#273469');
      H.rr(ctx, x0 + i * tw + 2, y, tw - 4, 34, 5); ctx.fill();
      H.txt(ctx, String(v), x0 + i * tw + tw / 2, y + 17, { size: Math.min(14, tw * 0.42), bold: true, color: isHot ? '#0b1020' : '#e8ecf8' });
    });
    return x0;
  };

  /* 网格 rows: 二维数组；opt: {checker, max, cellColor(r,c,v), txtColor(r,c,v), y0} */
  U.grid = function (ctx, W, Hh, rows, opt) {
    opt = opt || {};
    const R = rows.length, C = rows[0].length;
    const cell = Math.min((W - 260) / C, (Hh - 100) / R, opt.max || 40);
    const x0 = (W - cell * C) / 2, y0 = opt.y0 !== undefined ? opt.y0 : (Hh - cell * R) / 2 - 4;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const v = rows[r][c];
      ctx.fillStyle = opt.checker && (r + c) % 2 ? '#101736' : '#1b2450';
      if (opt.cellColor) { const cc = opt.cellColor(r, c, v); if (cc) ctx.fillStyle = cc; }
      H.rr(ctx, x0 + c * cell + 1.5, y0 + r * cell + 1.5, cell - 3, cell - 3, 4); ctx.fill();
      if (v !== '' && v != null) H.txt(ctx, String(v), x0 + c * cell + cell / 2, y0 + r * cell + cell / 2,
        { size: Math.min(15, cell * 0.45), bold: true, color: opt.txtColor ? opt.txtColor(r, c, v) : '#e8ecf8' });
    }
    return { x0: x0, y0: y0, cell: cell };
  };

  /* 数轴：positions 标注点，marks 特殊标记 */
  U.axis = function (ctx, W, y, min, max, pts, marks) {
    const x0 = 70, x1 = W - 70;
    H.line(ctx, x0, y, x1, y, '#39437a', 2);
    const px = function (v) { return x0 + (x1 - x0) * (v - min) / (max - min); };
    (pts || []).forEach(function (v) { H.line(ctx, px(v), y - 4, px(v), y + 4, '#8fa0c8', 1.5); H.mono(ctx, String(v), px(v), y + 16, { size: 10, color: '#8fa0c8' }); });
    (marks || []).forEach(function (m) {
      H.circle(ctx, px(m.v), y - 14, 7, m.color || '#fbbf24');
      if (m.label) H.txt(ctx, m.label, px(m.v), y - 30, { size: 11, bold: true, color: m.color || '#fbbf24' });
    });
  };

  /* 脚本化过河：items [{id,label,color}]，seq: 每渡乘客 id 数组（交替方向） */
  U.riverSeq = function (items, seq) {
    const steps = [{ cap: '初始：全部在左岸' }];
    seq.forEach(function (who, i) {
      steps.push({ cap: '第 ' + (i + 1) + ' 渡 ' + (i % 2 === 0 ? '→ 去右岸' : '← 回左岸') + '：' + who.join('、') + (who.length === 0 ? '（空船）' : '') });
    });
    steps.forEach(function (st, k) {
      st.fn = function (ctx, W, Hh) {
        const L = [], R = [];
        items.forEach(function (x) { L.push(x.id); });
        let side = 'L';
        for (let i = 0; i < k; i++) {
          const from = i % 2 === 0 ? L : R, to = i % 2 === 0 ? R : L;
          seq[i].forEach(function (id) { const at = from.indexOf(id); if (at >= 0) from.splice(at, 1); to.push(id); });
          side = i % 2 === 0 ? 'R' : 'L';
        }
        H.txt(ctx, '左岸', 75, 300, { size: 12, color: '#8fa0c8' });
        H.txt(ctx, '右岸', W - 75, 300, { size: 12, color: '#8fa0c8' });
        ctx.fillStyle = '#123252'; ctx.fillRect(0, 205, W, 70);
        ctx.fillStyle = '#1d3a2a'; ctx.fillRect(0, 205, 155, 70); ctx.fillRect(W - 155, 205, 155, 70);
        function drawSide(ids, sx) {
          ids.forEach(function (id, i) {
            const it = items.find(function (x) { return x.id === id; });
            const x = sx + (i % 5) * 29 + 16, y = 224 + Math.floor(i / 5) * 30;
            H.circle(ctx, x, y, 11, it.color);
            H.txt(ctx, it.label, x, y, { size: 9, bold: true, color: '#0b1020' });
          });
        }
        drawSide(L, 12); drawSide(R, W - 147);
        const bx = side === 'L' ? 175 : W - 219;
        ctx.fillStyle = '#6b4a2b'; H.rr(ctx, bx, 234, 44, 14, 6); ctx.fill();
      };
    });
    return steps;
  };

  /* 硬币堆：arr 为每堆枚数（0 = 空位）；hot: 高亮堆下标 */
  U.coins = function (ctx, W, y, arr, hot) {
    const gap = Math.min(84, (W - 100) / Math.max(arr.length, 1));
    const x0 = (W - gap * (arr.length - 1)) / 2;
    arr.forEach(function (n, i) {
      const x = x0 + i * gap, isHot = hot && hot.indexOf(i) >= 0;
      if (isHot) H.glow(ctx, '#fbbf24', 8);
      for (let k2 = 0; k2 < n; k2++) H.circle(ctx, x, y - k2 * 15, 6.5, '#fbbf24');
      if (isHot) H.noglow(ctx);
      H.mono(ctx, String(n), x, y + 18, { size: 11, bold: true, color: isHot ? '#fbbf24' : '#8fa0c8' });
    });
  };

  /* 棍子/条带：len 为长度标签；hot 高亮 */
  U.sticks = function (ctx, W, y, lens, hot) {
    const k2 = Math.min(4.4, (W - 180) / lens.length);
    const x0 = (W - k2 * lens.length) / 2;
    lens.forEach(function (l, i) {
      const isHot = hot && hot.indexOf(i) >= 0;
      ctx.fillStyle = isHot ? '#fbbf24' : '#3b55a6';
      H.rr(ctx, x0 + i * k2 + 2, y - 6, k2 - 4, 12, 5); ctx.fill();
      H.mono(ctx, String(l), x0 + i * k2 + k2 / 2, y + 20, { size: 11, bold: true, color: isHot ? '#fbbf24' : '#8fa0c8' });
    });
  };

  /* 数字表格 + 行和/列和；hlRow / hlCol 整行/整列高亮（变号动画） */
  U.tableSum = function (ctx, W, Hh, M, opt) {
    opt = opt || {};
    const R = M.length, C = M[0].length;
    const cell = Math.min((W - 300) / C, (Hh - 150) / R, 52);
    const x0 = (W - cell * C) / 2 - 20, y0 = 52;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const hl = (opt.hlRow === r) || (opt.hlCol === c);
      ctx.fillStyle = hl ? 'rgba(251,191,36,.9)' : '#273469';
      H.rr(ctx, x0 + c * cell + 1.5, y0 + r * cell + 1.5, cell - 3, cell - 3, 4); ctx.fill();
      H.mono(ctx, String(M[r][c]), x0 + c * cell + cell / 2, y0 + r * cell + cell / 2,
        { size: 13, bold: true, color: hl ? '#0b1020' : (M[r][c] < 0 ? '#f87171' : '#e8ecf8') });
    }
    const sumCol = '#8fa0c8';
    for (let r = 0; r < R; r++) {
      let s = 0; M[r].forEach(function (v) { s += v; });
      H.mono(ctx, String(s), x0 + C * cell + 20, y0 + r * cell + cell / 2, { size: 12, bold: true, color: opt.hlRow === r ? '#fbbf24' : (s < 0 ? '#f87171' : '#4ade80') });
    }
    for (let c = 0; c < C; c++) {
      let s = 0; for (let r = 0; r < R; r++) s += M[r][c];
      H.mono(ctx, String(s), x0 + c * cell + cell / 2, y0 + R * cell + 16, { size: 12, bold: true, color: opt.hlCol === c ? '#fbbf24' : (s < 0 ? '#f87171' : '#4ade80') });
    }
    H.txt(ctx, '行和', x0 + C * cell + 20, y0 - 14, { size: 10, color: sumCol });
    H.txt(ctx, '列和', x0 - 26, y0 + R * cell + 16, { size: 10, color: sumCol });
  };

  /* 开关 / 灯泡排：states '0'/'1'，hot 为刚切换的下标 */
  U.lamps = function (ctx, W, y, states, hot) {
    states = Array.isArray(states) ? states : String(states).split('');
    const n = states.length, gap = Math.min(64, (W - 120) / Math.max(n, 1));
    const x0 = (W - gap * (n - 1)) / 2;
    states.forEach(function (s, i) {
      const x = x0 + i * gap, on = s === '1', isHot = hot === i;
      if (on) H.glow(ctx, '#fbbf24', isHot ? 14 : 8);
      H.circle(ctx, x, y, 13, on ? '#fbbf24' : '#141c3e', on ? '#fde68a' : '#39437a');
      if (on) H.noglow(ctx);
      H.mono(ctx, s, x, y + 30, { size: 11, bold: true, color: isHot ? '#fbbf24' : '#8fa0c8' });
    });
  };

  /* 街道网格 + 房子 + 中位数摊点 + 曼哈顿折线 */
  U.street = function (ctx, W, Hh, houses, opt) {
    opt = opt || {};
    const G = opt.g || 5, cell = Math.min((W - 300) / (G - 1), (Hh - 140) / (G - 1), 52);
    const x0 = W / 2 - cell * (G - 1) / 2 - 30, y0 = 56;
    const px = function (c) { return x0 + c * cell; }, py = function (r) { return y0 + r * cell; };
    for (let i = 0; i < G; i++) {
      H.line(ctx, x0, py(i), x0 + (G - 1) * cell, py(i), '#2b3668', 1.5);
      H.line(ctx, px(i), y0, px(i), y0 + (G - 1) * cell, '#2b3668', 1.5);
    }
    houses.forEach(function (h) {
      H.circle(ctx, px(h[1]), py(h[0]), 9, '#7dd3fc');
      H.txt(ctx, '🏠', px(h[1]), py(h[0]), { size: 11 });
    });
    if (opt.med) {
      const mx = px(opt.med[1]), my = py(opt.med[0]);
      if (opt.paths) houses.forEach(function (h) {
        H.line(ctx, px(h[1]), py(h[0]), px(h[1]), my, 'rgba(251,191,36,.55)', 2);
        H.line(ctx, px(h[1]), my, mx, my, 'rgba(251,191,36,.55)', 2);
      });
      H.glow(ctx, '#4ade80', 12);
      H.circle(ctx, mx, my, 11, '#4ade80');
      H.noglow(ctx);
      H.txt(ctx, '摊', mx, my, { size: 10, bold: true, color: '#0b1020' });
    }
  };

  /* 方块搭建：第 n 层菱形（1, 9, 25…） */
  U.blocks = function (ctx, W, Hh, n, hotRing) {
    const cs = Math.min(24, 190 / (2 * n - 1));
    const cx = W / 2, cy = 150;
    for (let r = 0; r < 2 * n - 1; r++) {
      const w = r < n ? r + 1 : 2 * n - 1 - r;
      for (let c = 0; c < w; c++) {
        const ring = Math.max(Math.abs(r - (n - 1)), Math.abs(c - (w - 1) / 2));
        ctx.fillStyle = hotRing ? (ring === hotRing - 1 ? '#fbbf24' : '#273469') : '#3b55a6';
        H.rr(ctx, cx + (c - (w - 1) / 2) * cs - cs / 2 + 0.5, cy + (r - (n - 1)) * cs - cs / 2 + 0.5, cs - 1.5, cs - 1.5, 3); ctx.fill();
      }
    }
  };

  /* 棋盘染色 + 棋子：pieces [{r,c,label,color}] */
  U.checker = function (ctx, W, Hh, R, C, pieces, marks) {
    const cell = Math.min((W - 280) / C, (Hh - 130) / R, 44);
    const x0 = (W - cell * C) / 2, y0 = 46;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      ctx.fillStyle = (r + c) % 2 ? '#101736' : '#1e2a56';
      H.rr(ctx, x0 + c * cell + 1, y0 + r * cell + 1, cell - 2, cell - 2, 3); ctx.fill();
    }
    (marks || []).forEach(function (m) {
      ctx.fillStyle = m.color;
      H.rr(ctx, x0 + m.c * cell + 1, y0 + m.r * cell + 1, cell - 2, cell - 2, 3); ctx.fill();
    });
    (pieces || []).forEach(function (pc) {
      const x = x0 + pc.c * cell + cell / 2, y = y0 + pc.r * cell + cell / 2;
      H.glow(ctx, pc.color || '#fbbf24', 8);
      H.circle(ctx, x, y, cell * 0.32, pc.color || '#fbbf24');
      H.noglow(ctx);
      H.txt(ctx, pc.label, x, y, { size: cell * 0.3, bold: true, color: '#0b1020' });
    });
  };

  /* 圆桌：labels 按圆周分布；colors 每座底色；links [[i,j,color],…] 仇敌/朋友连线 */
  U.roundTable = function (ctx, W, Hh, labels, colors, links) {
    const n = labels.length, cx = W / 2, cy = 150, R = 100;
    H.circle(ctx, cx, cy, 44, null, '#39437a');
    const pt = function (i) { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; };
    (links || []).forEach(function (l) {
      const a = pt(l[0]), b = pt(l[1]);
      H.line(ctx, a[0], a[1], b[0], b[1], l[2] || '#f87171', 2);
    });
    labels.forEach(function (lb, i) {
      const a = pt(i);
      H.circle(ctx, a[0], a[1], 15, colors ? colors[i] : '#273469', '#5eead4');
      H.txt(ctx, lb, a[0], a[1], { size: 11, bold: true });
    });
  };

  /* n 皇后布局（cols[r] = 列号） */
  U.queens = function (ctx, W, Hh, cols) {
    const n = cols.length;
    const cell = Math.min((W - 300) / n, (Hh - 120) / n, 30);
    const x0 = (W - cell * n) / 2, y0 = 40;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      ctx.fillStyle = (r + c) % 2 ? '#121a3a' : '#182148';
      H.rr(ctx, x0 + c * cell + 1, y0 + r * cell + 1, cell - 2, cell - 2, 2); ctx.fill();
    }
    cols.forEach(function (c, r) {
      if (c < 0) return;
      H.txt(ctx, '♛', x0 + c * cell + cell / 2, y0 + r * cell + cell / 2, { size: cell * 0.55, color: '#5eead4' });
    });
  };

  /* 字母/数字一字排开：hot 下标高亮 */
  U.word = function (ctx, W, y, chars, hot, colorOf) {
    const n = chars.length, tw = Math.min(40, (W - 100) / Math.max(n, 1));
    const x0 = (W - tw * n) / 2;
    chars.forEach(function (ch, i) {
      const isHot = hot && hot.indexOf(i) >= 0;
      ctx.fillStyle = isHot ? 'rgba(251,191,36,.92)' : (colorOf ? colorOf(ch, i) : '#273469');
      H.rr(ctx, x0 + i * tw + 2, y, tw - 4, 32, 5); ctx.fill();
      H.txt(ctx, String(ch), x0 + i * tw + tw / 2, y + 16, { size: 13, bold: true, color: isHot ? '#0b1020' : '#e8ecf8' });
    });
    return x0;
  };

  /* 人物圆圈行（名人/帽子等社交谜题） */
  U.people = function (ctx, W, y, labels, state) {
    const n = labels.length, gap = Math.min(70, (W - 120) / Math.max(n - 1, 1));
    const x0 = (W - gap * (n - 1)) / 2;
    labels.forEach(function (lb, i) {
      const x = x0 + i * gap;
      const s = (state && state[i]) || {};
      H.circle(ctx, x, y, 18, s.out ? '#131a38' : (s.color || '#273469'), s.out ? '#39437a' : '#5eead4');
      H.txt(ctx, lb, x, y, { size: 13, bold: true, color: s.out ? '#39437a' : '#e8ecf8' });
      if (s.tag) H.txt(ctx, s.tag, x, y + 34, { size: 11, bold: true, color: '#fbbf24' });
      if (s.out) { H.line(ctx, x - 14, y - 14, x + 14, y + 14, '#f87171', 2); }
    });
  };
})();
