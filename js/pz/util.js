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
