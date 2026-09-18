/* 工程实践 · 14 题动画演示（独立页面 prac.html，分组 'p'，编号 p1..p14）
   去重说明：字符串旋转 ≡ 本站"数组循环移位"、最大子数组和 ≡ 本站"子数组之和的最大值"、
   二分搜索正确性 ≡ 本站概览二分搜索，均不收录；哨兵技巧并入 p5 代码调优。
   绘图沿用家族语言：顶部细图例行 + 左侧可视化 + 右侧发丝分隔要点栏 + 底部字幕（引擎自动）。 */
(function () {
  var H = PZ.H, U = PZ.U, D = PZ.def, g = 'p';

  /* ---------------- 共享绘图助手（640×330 画布） ---------------- */
  var M = {};
  var FAINT = '#6b7699', DIM = '#8fa0c8', TEAL = '#5eead4', AMBER = '#fbbf24',
      GREEN = '#4ade80', RED = '#f87171', TXT = '#dbe4f8';

  /* 顶部图例行：items [{sw:'line'|'dot'|'box', color, txt}] + 右侧目标文字 */
  M.legend = function (ctx, items, goal) {
    var x = 46;
    items.forEach(function (it) {
      if (it.sw === 'line') H.line(ctx, x, 16, x + 20, 16, it.color, 3.5);
      else if (it.sw === 'dot') H.circle(ctx, x + 5, 16, 5, it.color, null);
      else { ctx.fillStyle = it.color; H.rr(ctx, x - 1, 9, 13, 13, 3); ctx.fill(); }
      H.txt(ctx, it.txt, x + 26, 16, { size: 10.5, color: DIM, align: 'left' });
      x += 32 + it.txt.length * 11.5;
    });
    if (goal) H.txt(ctx, goal, 624, 16, { size: 10.5, color: FAINT, align: 'right' });
  };

  /* 右侧要点栏：发丝分隔的扁平均色区块。sections [{t:标题, c:标题色, rows:[[文字,颜色,加粗],…]}] */
  M.note = function (ctx, sections, x0, y0, w) {
    x0 = x0 || 372; y0 = y0 || 40; w = w || 252;
    var y = y0;
    sections.forEach(function (s, i) {
      if (i) { H.line(ctx, x0, y - 11, x0 + w, y - 11, 'rgba(148,163,184,.18)', 1); }
      H.circle(ctx, x0 + 3, y + 2, 3, s.c || DIM);
      H.txt(ctx, s.t, x0 + 12, y + 2, { size: 11, bold: true, color: s.c || DIM, align: 'left' });
      y += 20;
      (s.rows || []).forEach(function (r) {
        if (typeof r === 'string') r = [r];
        H.txt(ctx, r[0], x0 + 2, y, { size: r[3] || 11, color: r[1] || TXT, bold: !!r[2], align: 'left' });
        y += 18;
      });
      y += 14;
    });
  };

  /* 一排方块：vals 文本数组；o {x,y,tw,th,hot:[…],color(i,v),ring(i,v),txt(i,v),labels:[…]} */
  M.chips = function (ctx, vals, o) {
    o = o || {};
    var tw = o.tw || 34, th = o.th || 34, x = o.x || 46, y = o.y || 60;
    vals.forEach(function (v, i) {
      var xx = x + i * (tw + 4);
      ctx.fillStyle = (o.color && o.color(i, v)) || '#273469';
      H.rr(ctx, xx, y, tw, th, 5); ctx.fill();
      var rg = o.ring && o.ring(i, v);
      if (rg) { ctx.strokeStyle = rg; ctx.lineWidth = 2.5; H.rr(ctx, xx - 1, y - 1, tw + 2, th + 2, 6); ctx.stroke(); }
      H.txt(ctx, String(v), xx + tw / 2, y + th / 2, { size: o.size || Math.min(14, tw * 0.42), bold: true, color: (o.txt && o.txt(i, v)) || '#e8ecf8' });
      if (o.labels && o.labels[i] != null)
        H.mono(ctx, String(o.labels[i]), xx + tw / 2, y + th + 13, { size: 10, color: FAINT });
    });
    return { x: x, y: y, tw: tw, th: th };
  };

  /* 网格：rows 二维数组（'' 为空格）；o {x,y,cs,checker,fill(r,c,v),ring(r,c,v),txt(r,c,v),size} */
  M.grid = function (ctx, rows, o) {
    o = o || {};
    var cs = o.cs || 26, x0 = o.x || 46, y0 = o.y || 40;
    for (var r = 0; r < rows.length; r++) for (var c = 0; c < rows[r].length; c++) {
      var v = rows[r][c], x = x0 + c * cs, y = y0 + r * cs;
      ctx.fillStyle = (o.fill && o.fill(r, c, v)) || (o.checker && (r + c) % 2 ? '#182148' : '#121a3a');
      H.rr(ctx, x + 1, y + 1, cs - 2, cs - 2, 3); ctx.fill();
      var rg = o.ring && o.ring(r, c, v);
      if (rg) { ctx.strokeStyle = rg; ctx.lineWidth = 2; H.rr(ctx, x + 1.5, y + 1.5, cs - 3, cs - 3, 4); ctx.stroke(); }
      if (v !== '' && v != null)
        H.txt(ctx, String(v), x + cs / 2, y + cs / 2, { size: o.size || Math.min(13, cs * 0.5), bold: true, color: (o.txt && o.txt(r, c, v)) || '#e8ecf8' });
    }
    return { x0: x0, y0: y0, cs: cs };
  };

  /* 折线图：series [{pts:[[x,y]…],color,dash}]；hl 高亮折线点；xlab/ylab 轴标签 */
  M.chart = function (ctx, o) {
    var x = o.x, y = o.y, w = o.w, h = o.h;
    H.line(ctx, x, y + h, x + w, y + h, '#39437a', 1.5);
    H.line(ctx, x, y, x, y + h, '#39437a', 1.5);
    (o.grid || []).forEach(function (gv) {
      var gy = y + h - h * gv;
      H.line(ctx, x, gy, x + w, gy, 'rgba(148,163,184,.12)', 1);
      if (o.ymax != null) H.mono(ctx, String(Math.round(o.ymax * gv)), x - 12, gy, { size: 9, color: FAINT });
    });
    (o.series || []).forEach(function (s) {
      if (!s.pts || s.pts.length < 2) return;
      ctx.strokeStyle = s.color; ctx.lineWidth = s.lw || 2;
      if (s.dash) ctx.setLineDash(s.dash);
      ctx.beginPath();
      s.pts.forEach(function (p, i) { if (i) ctx.lineTo(x + p[0] * w, y + h - p[1] * h); else ctx.moveTo(x + p[0] * w, y + h - p[1] * h); });
      ctx.stroke(); ctx.setLineDash([]);
      if (s.dots) s.pts.forEach(function (p) { H.circle(ctx, x + p[0] * w, y + h - p[1] * h, 3, s.color, null); });
    });
    (o.hl || []).forEach(function (p) { H.circle(ctx, x + p[0] * w, y + h - p[1] * h, 4.5, AMBER, '#0b1020'); });
    (o.xlab || []).forEach(function (p) { H.txt(ctx, p[2], x + p[0] * w, y + h + 14, { size: 10, color: FAINT }); });
    if (o.title) H.txt(ctx, o.title, x + w / 2, y - 14, { size: 11, bold: true, color: DIM });
  };

  /* 水平条：条目 [{label,v,color}]，按 vmax 归一化 */
  M.bars = function (ctx, items, o) {
    o = o || {};
    var x = o.x || 100, y = o.y || 60, w = o.w || 200, bh = o.bh || 16, gap = o.gap || 26;
    var vmax = o.vmax || Math.max.apply(null, items.map(function (it) { return it.v; })) || 1;
    items.forEach(function (it, i) {
      H.txt(ctx, it.label, x - 8, y + i * gap + bh / 2, { size: 11, color: DIM, align: 'right' });
      ctx.fillStyle = 'rgba(148,163,184,.16)';
      H.rr(ctx, x, y + i * gap, w, bh, 4); ctx.fill();
      ctx.fillStyle = it.color || TEAL;
      H.rr(ctx, x, y + i * gap, Math.max(3, w * it.v / vmax), bh, 4); ctx.fill();
      H.mono(ctx, String(it.v), x + w + 12, y + i * gap + bh / 2, { size: 11, bold: true, color: it.color || TXT, align: 'left' });
    });
  };

  /* 代码块：等宽字体逐行 */
  M.code = function (ctx, lines, x, y, o) {
    o = o || {};
    lines.forEach(function (l, i) {
      if (typeof l === 'string') l = [l];
      H.mono(ctx, l[0], x, y + i * (o.gap || 18), { size: o.size || 12, color: l[1] || '#a5b4d8', align: 'left', bold: !!l[2] });
    });
  };

  /* 箭头（水平/竖直） */
  M.arrow = function (ctx, x1, y1, x2, y2, color, w) {
    H.line(ctx, x1, y1, x2, y2, color, w || 2);
    var a = Math.atan2(y2 - y1, x2 - x1);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 8 * Math.cos(a - 0.4), y2 - 8 * Math.sin(a - 0.4));
    ctx.lineTo(x2 - 8 * Math.cos(a + 0.4), y2 - 8 * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
  };

  /* 完全二叉树视图：vals 按层序画成树；o {x,y,dx,dy,r,fill(i,v),ring(i,v),txt(i,v)}，返回节点坐标 */
  M.tree = function (ctx, vals, o) {
    o = o || {};
    var x = o.x || 140, y = o.y || 168, dx = o.dx || 55, dy = o.dy || 52, r = o.r || 14;
    var P = [[0, 0], [-1, 1], [1, 1], [-1.5, 2], [-0.5, 2], [0.5, 2], [1.5, 2]];
    var pos = vals.map(function (v, i) { return [x + P[i][0] * dx, y + P[i][1] * dy]; });
    for (var i = 1; i < vals.length; i++) {
      var p = pos[Math.floor((i - 1) / 2)];
      H.line(ctx, p[0], p[1], pos[i][0], pos[i][1], '#39437a', 1.5);
    }
    vals.forEach(function (v, i) {
      ctx.fillStyle = (o.fill && o.fill(i, v)) || '#12244a';
      ctx.beginPath(); ctx.arc(pos[i][0], pos[i][1], r, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = (o.ring && o.ring(i, v)) || '#39437a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(pos[i][0], pos[i][1], r, 0, 6.2832); ctx.stroke();
      H.txt(ctx, String(v), pos[i][0], pos[i][1], { size: 11, bold: true, color: (o.txt && o.txt(i, v)) || '#e8ecf8' });
    });
    return pos;
  };

  /* ============ 第一辑 数据与表示（p1..p3） ============ */

  D({ g: g, no: 1, title: '位图排序', e: 'board',
    strat: '位图：每个整数 1 个比特，两遍线性扫描完成排序',
    plain: '不比较数字，而是"点名"：给每个可能的值开一个格子，读到就标记，最后按格子顺序收号，自然有序。',
    p: { steps: [
      { cap: '问题：把 1000 万个 [0,10^7) 内无重复整数排序输出，内存只有约 1MB —— 比较排序要 O(n log n) 次比较，数据装不进内存还得外排', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '输入流' }, { sw: 'box', color: TEAL, txt: '位图' }, { sw: 'box', color: GREEN, txt: '有序输出' }], '范围 [0,10) 的小例子');
        M.chips(ctx, [5, 1, 8, 3, 9, 0], { x: 46, y: 70, tw: 30 });
        M.note(ctx, [
          { t: '约束', c: RED, rows: [['10^7 个无重复整数', TXT, 1], ['值域 [0, 10^7)', TXT, 0], ['内存上限约 1MB', TXT, 0]] },
          { t: '朴素', c: DIM, rows: [['比较排序 O(n log n)', TXT, 0], ['装不进内存 → 外排多趟读写', TXT, 0]] }
        ]);
      } },
      { cap: '位图：开一个与值域等长的比特数组，1 个整数占 1 比特 —— 10^7 bit ≈ 1.25MB，刚好装下，初值全 0', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '输入流' }, { sw: 'box', color: TEAL, txt: '位图' }, { sw: 'box', color: GREEN, txt: '有序输出' }], '1 bit / 整数');
        M.chips(ctx, [5, 1, 8, 3, 9, 0], { x: 46, y: 60, tw: 30 });
        M.chips(ctx, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], { x: 46, y: 140, tw: 30, color: function () { return '#182148'; }, txt: function () { return DIM; } });
        H.txt(ctx, 'bit:  0   1   2   3   4   5   6   7   8   9', 46, 128, { size: 10, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '位图', c: TEAL, rows: [['存在性只需 1 bit', TXT, 1], ['10^7 bit ≈ 1.25MB', TXT, 0], ['无重复 → 不会计数溢出', TXT, 0]] }
        ]);
      } },
      { cap: '读入遍：每读一个数就置位它的比特 —— 读到 5，bit[5] = 1，单步 O(1)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '输入流' }, { sw: 'box', color: TEAL, txt: '位图' }, { sw: 'box', color: GREEN, txt: '有序输出' }], '读入 = 置位');
        M.chips(ctx, [5, 1, 8, 3, 9, 0], { x: 46, y: 60, tw: 30, ring: function (i) { return i === 0 ? GREEN : null; } });
        M.chips(ctx, [0, 0, 0, 0, 0, 1, 0, 0, 0, 0], { x: 46, y: 140, tw: 30, color: function (i, v) { return v ? TEAL : '#182148'; }, txt: function (i, v) { return v ? '#0c1830' : DIM; } });
        M.arrow(ctx, 61, 96, 211, 134, GREEN, 2);
        M.note(ctx, [
          { t: '读入遍', c: TEAL, rows: [['for x in input:', '#a5b4d8', 0], ['  set(bit, x)', '#a5b4d8', 0], ['无比较、无移动', TXT, 0]] }
        ]);
      } },
      { cap: '继续读入 1, 8, 3, 9, 0 并逐一置位 —— 整遍读入 O(n)，只做"标记"这一件事', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '输入流' }, { sw: 'box', color: TEAL, txt: '位图' }, { sw: 'box', color: GREEN, txt: '有序输出' }], '读入完成');
        M.chips(ctx, [5, 1, 8, 3, 9, 0], { x: 46, y: 60, tw: 30, color: function () { return '#1e3a34'; } });
        M.chips(ctx, [1, 1, 0, 1, 0, 1, 0, 0, 1, 1], { x: 46, y: 140, tw: 30, color: function (i, v) { return v ? TEAL : '#182148'; }, txt: function (i, v) { return v ? '#0c1830' : DIM; } });
        M.note(ctx, [
          { t: '位图状态', c: TEAL, rows: [['置位 {0,1,3,5,8,9}', TXT, 1], ['写入共 n 次 O(1)', TXT, 0]] }
        ]);
      } },
      { cap: '输出遍：从低位到高位扫描比特，是 1 就输出下标 —— 扫描顺序天然是升序，无需任何比较', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '输入流' }, { sw: 'box', color: TEAL, txt: '位图' }, { sw: 'box', color: GREEN, txt: '有序输出' }], '输出 = 扫位');
        M.chips(ctx, [1, 1, 0, 1, 0, 1, 0, 0, 1, 1], { x: 46, y: 60, tw: 30, color: function (i, v) { return v ? TEAL : '#182148'; }, txt: function (i, v) { return v ? '#0c1830' : DIM; } });
        M.chips(ctx, [0, 1, 3, 5, 8, 9], { x: 46, y: 150, tw: 30, color: function () { return GREEN; }, txt: function () { return '#0c1830'; } });
        M.arrow(ctx, 61, 96, 61, 144, GREEN, 2);
        M.arrow(ctx, 211, 96, 163, 144, GREEN, 2);
        M.note(ctx, [
          { t: '输出遍', c: GREEN, rows: [['for i in 0..n-1:', '#a5b4d8', 0], ['  if bit[i]: emit i', '#a5b4d8', 0], ['升序自动成立', TXT, 1]] }
        ]);
      } },
      { cap: '算账：外排要多趟磁盘归并，位图只读写各一遍 —— 时间 O(n)、空间 n/8 字节，用空间换掉全部比较', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '外排趟数' }, { sw: 'box', color: GREEN, txt: '位图趟数' }], '复杂度对比');
        M.bars(ctx, [
          { label: '外部归并', v: 6, color: RED },
          { label: '位图两遍', v: 2, color: GREEN }
        ], { x: 120, y: 80, w: 180, bh: 18, gap: 34 });
        H.txt(ctx, '磁盘趟数（示意）', 210, 62, { size: 11, bold: true, color: DIM });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['时间 O(n)，零比较', TXT, 1], ['空间 n/8 字节', TXT, 0], ['前提：有界值域 + 无重复', TXT, 0]] }
        ]);
      } }
    ] } });

  D({ g: g, no: 2, title: '变位词分组', e: 'board',
    strat: '规范签名：字母排序作签名，按签名哈希分组',
    plain: '给每个单词拍一张"字母排序照"，照片相同的就是同一族变位词，按照片归堆即可。',
    p: { steps: [
      { cap: '问题：字典里 n 个单词，找出所有互为变位词的组（字母相同、顺序不同，如 care / race / acre）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '字典词' }, { sw: 'box', color: TEAL, txt: '签名' }, { sw: 'box', color: AMBER, txt: '分组' }], '两两比较？太慢');
        M.chips(ctx, ['care', 'race', 'acre', 'stop', 'pots', 'tops'], { x: 46, y: 80, tw: 46, th: 26, size: 11 });
        M.note(ctx, [
          { t: '问题', c: RED, rows: [['变位词 = 字母多重集相同', TXT, 1], ['输出所有等价组', TXT, 0]] },
          { t: '朴素', c: DIM, rows: [['两两比较 O(n²·L)', TXT, 0], ['n=10^5 词即 10^10 对', TXT, 0]] }
        ]);
      } },
      { cap: '签名：把单词的字母排序得到规范形 —— care、race、acre 的签名都是 acer', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '字典词' }, { sw: 'box', color: TEAL, txt: '签名' }, { sw: 'box', color: AMBER, txt: '分组' }], 'sign(w) = sort(w)');
        M.chips(ctx, ['care', 'race', 'acre', 'stop', 'pots', 'tops'], { x: 46, y: 60, tw: 46, th: 26, size: 11 });
        M.chips(ctx, ['acer', 'acer', 'acer', 'opst', 'opst', 'opst'], { x: 46, y: 120, tw: 46, th: 24, size: 11, color: function () { return TEAL; }, txt: function () { return '#0c1830'; } });
        M.note(ctx, [
          { t: '签名', c: TEAL, rows: [['字母排序 = 规范形', TXT, 1], ['变位词 ⟺ 签名相同', TXT, 1], ['单签名 O(L log L)', TXT, 0]] }
        ]);
      } },
      { cap: '按签名分组：同签名进同桶 —— 一次哈希遍历，acer 桶与 opst 桶各自成形', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '字典词' }, { sw: 'box', color: TEAL, txt: '签名' }, { sw: 'box', color: AMBER, txt: '分组' }], '哈希分桶');
        M.chips(ctx, ['care', 'race', 'acre', 'stop', 'pots', 'tops'], { x: 46, y: 60, tw: 46, th: 26, size: 11, color: function (i) { return i < 3 ? '#1e3a34' : '#3a2f14'; } });
        M.chips(ctx, ['acer', 'acer', 'acer', 'opst', 'opst', 'opst'], { x: 46, y: 120, tw: 46, th: 24, size: 11, color: function (i) { return i < 3 ? TEAL : AMBER; }, txt: function () { return '#0c1830'; } });
        M.note(ctx, [
          { t: '分桶', c: AMBER, rows: [['map[sign].push(w)', '#a5b4d8', 0], ['一遍 O(总字符数)', TXT, 1]] }
        ]);
      } },
      { cap: '输出各桶：{care, race, acre} 与 {stop, pots, tops} —— 每个桶就是一组变位词', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: 'acer 桶' }, { sw: 'box', color: AMBER, txt: 'opst 桶' }], '分组完成');
        M.chips(ctx, ['care', 'race', 'acre'], { x: 46, y: 70, tw: 46, th: 26, size: 11, color: function () { return TEAL; }, txt: function () { return '#0c1830'; } });
        M.chips(ctx, ['stop', 'pots', 'tops'], { x: 46, y: 130, tw: 46, th: 26, size: 11, color: function () { return AMBER; }, txt: function () { return '#2a1c04'; } });
        M.note(ctx, [
          { t: '输出', c: GREEN, rows: [['桶内即等价类', TXT, 1], ['单元素桶 = 无变位词', TXT, 0]] }
        ]);
      } },
      { cap: '复杂度：签名 O(L log L)/词 + 哈希一遍 O(总字符)，把 O(n²) 的对比较降成线性', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: ' pairwise' }, { sw: 'box', color: GREEN, txt: '签名分组' }], '量级对比');
        M.bars(ctx, [
          { label: '两两比较', v: 100, color: RED },
          { label: '签名分组', v: 8, color: GREEN }
        ], { x: 120, y: 80, w: 180, bh: 18, gap: 34 });
        H.txt(ctx, '相对代价（示意）', 210, 62, { size: 11, bold: true, color: DIM });
        M.note(ctx, [
          { t: '要点', c: GREEN, rows: [['等价类问题先找规范形', TXT, 1], ['签名把比较变查表', TXT, 0]] }
        ]);
      } }
    ] } });

  D({ g: g, no: 3, title: '表驱动编程', e: 'board',
    strat: '表驱动：知识进表、代码只剩一次查表',
    plain: '把"前几个月共多少天"从分支里挪进一张表，代码就只剩一行查表加法。',
    p: { steps: [
      { cap: '问题：把"月/日"换成"一年中的第几天"（3 月 1 日 = 平年第 60 天）—— 朴素写法是 12 层 switch 分支', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '分支硬编码' }, { sw: 'box', color: TEAL, txt: '数据表' }], '逻辑 vs 数据');
        M.code(ctx, [
          ['switch (m) {', '#a5b4d8'],
          ['  case 1: return d;', '#a5b4d8'],
          ['  case 2: return 31 + d;', '#a5b4d8'],
          ['  case 3: return 59 + d;', '#a5b4d8'],
          ['  ... 12 个分支', RED],
          ['  闰月再翻倍？', RED]
        ], 46, 70);
        M.note(ctx, [
          { t: '坏味道', c: RED, rows: [['知识硬编码在分支里', TXT, 1], ['改规则 = 改代码', TXT, 0]] }
        ]);
      } },
      { cap: '表一：months[12] 存每月天数 —— 把领域知识从代码搬进数据', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: 'months 表' }], '数据即知识');
        H.txt(ctx, 'm:    1   2   3   4   5   6   7   8   9  10  11  12', 46, 70, { size: 10, color: FAINT, align: 'left' });
        M.grid(ctx, [[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]], { x: 46, y: 80, cs: 26, size: 11 });
        M.note(ctx, [
          { t: '表一', c: TEAL, rows: [['months[m] = 当月天数', TXT, 1], ['一张表替代 12 分支', TXT, 0]] }
        ]);
      } },
      { cap: '表二：cum[m] = 前 m−1 个月总天数，预计算一次 —— 分支里的加法被提前算完存好', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: 'months' }, { sw: 'box', color: AMBER, txt: 'cum 累计表' }], '预计算');
        M.grid(ctx, [
          [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
          [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
        ], { x: 46, y: 80, cs: 26, size: 11, fill: function (r) { return r ? '#3a2f14' : '#12244a'; } });
        H.txt(ctx, '上：months   下：cum（前 m−1 月总天数）', 46, 148, { size: 10, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '表二', c: AMBER, rows: [['cum[m] = Σ months[1..m-1]', '#a5b4d8', 0], ['启动时算一次 O(12)', TXT, 0]] }
        ]);
      } },
      { cap: '查表：doy = cum[m] + d —— 3 月 1 日 = cum[3] + 1 = 59 + 1 = 60，一次访问 O(1)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: 'cum 累计表' }, { sw: 'box', color: GREEN, txt: '命中' }], 'O(1) 查表');
        M.grid(ctx, [
          [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
        ], { x: 46, y: 80, cs: 26, size: 11, fill: function () { return '#3a2f14'; }, ring: function (r, c) { return c === 2 ? AMBER : null; } });
        M.code(ctx, [
          ['doy = cum[m] + d', TEAL, 1],
          ['doy(3, 1) = cum[3] + 1', TXT],
          ['          = 59 + 1 = 60', GREEN, 1]
        ], 46, 150);
        M.note(ctx, [
          { t: '查表', c: GREEN, rows: [['代码只剩一行加法', TXT, 1], ['无分支、无循环', TXT, 0]] }
        ]);
      } },
      { cap: '闰年？换一张 cum_leap 表即可 —— 代码一行不改，规则的变化落在数据上', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: 'cum 平年' }, { sw: 'box', color: TEAL, txt: 'cum_leap 闰年' }], '换表不换码');
        M.grid(ctx, [
          [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
          [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
        ], { x: 46, y: 80, cs: 26, size: 11, fill: function (r) { return r ? '#1e3a34' : '#3a2f14'; }, ring: function (r, c) { return c === 2 ? (r ? TEAL : AMBER) : null; } });
        H.txt(ctx, '上：平年 cum   下：闰年 cum_leap（3 月起 +1）', 46, 148, { size: 10, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '表驱动', c: TEAL, rows: [['规则变 → 换表', TXT, 1], ['代码零改动', TXT, 1], ['税率/日历/配置同理', TXT, 0]] }
        ]);
      } }
    ] } });

  /* ============ 第二辑 性能与设计（p4..p6） ============ */

  D({ g: g, no: 4, title: '粗略估算与 72 法则', e: 'board',
    strat: '72 法则：翻倍期数 ≈ 72 ÷ 百分增速',
    plain: '想知道多少期翻一倍，不必解指数：拿 72 除以百分增速，一口心算就够。',
    p: { steps: [
      { cap: '心算底座：先记住几个基本数 —— 2^10 ≈ 10^3、一年 ≈ π×10^7 秒、1MB = 2^20 B', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '基本数' }], '量感先行');
        M.code(ctx, [
          ['2^10 = 1024 ≈ 10^3', TEAL, 1],
          ['1 年 ≈ 3.15×10^7 s ≈ π×10^7', TEAL, 1],
          ['1MB = 2^20 B ≈ 10^6 B', TEAL, 1],
          ['', TXT],
          ['量级对了，决策就对了', DIM]
        ], 46, 80, { gap: 24 });
        M.note(ctx, [
          { t: '为何要背', c: DIM, rows: [['估算是设计的第一道闸', TXT, 1], ['先排错量级再谈精度', TXT, 0]] }
        ]);
      } },
      { cap: '72 法则：每期增长 r%，翻倍约需 72 ÷ r 期 —— 分子取 72 是因为它约数多、好心算', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '72 法则' }], 't ≈ 72 / r');
        H.txt(ctx, 't 翻倍 ≈ 72 ÷ r%', 200, 100, { size: 22, bold: true, color: AMBER });
        M.code(ctx, [
          ['来源：t = ln2 / ln(1+r)', '#a5b4d8'],
          ['小 r 时 ln(1+r) ≈ r', '#a5b4d8'],
          ['t ≈ 0.693/r → 取 72/r%', '#a5b4d8']
        ], 46, 150, { gap: 20 });
        M.note(ctx, [
          { t: '适用', c: AMBER, rows: [['r 在个位数百分比最准', TXT, 1], ['r 很大时误差上升', TXT, 0]] }
        ]);
      } },
      { cap: '例：某容量每期涨 8% —— 72 ÷ 8 = 9 期翻倍；指数曲线上第 9 期恰好穿过 2 倍线', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '1.08^t' }, { sw: 'dot', color: AMBER, txt: '翻倍点' }], 'r = 8%');
        var pts = [], k = Math.pow(1.08, 12);
        for (var t = 0; t <= 12; t++) pts.push([t / 12, Math.pow(1.08, t) / k]);
        M.chart(ctx, {
          x: 60, y: 60, w: 260, h: 160, ymax: 3, grid: [0.333, 0.667, 1],
          series: [{ pts: pts, color: TEAL, dots: true }],
          hl: [[9 / 12, Math.pow(1.08, 9) / k]],
          xlab: [[0, 0, '0 期'], [0.75, 0, '9 期'], [1, 0, '12 期']],
          title: '容量增长曲线（归一）'
        });
        M.note(ctx, [
          { t: '心算', c: AMBER, rows: [['72 ÷ 8 = 9 期', TXT, 1], ['曲线验证：第 9 期 ≈ 2 倍', TXT, 0]] }
        ]);
      } },
      { cap: '校验：1.08^9 = 1.999 —— 与精确解 ln2/ln1.08 ≈ 9.006 相差不到 0.1%，估算足够用', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: '校验通过' }], '误差 < 0.1%');
        M.code(ctx, [
          ['72 / 8        = 9', AMBER, 1],
          ['ln2 / ln1.08  = 9.006', '#a5b4d8'],
          ['1.08^9        = 1.999', GREEN, 1]
        ], 46, 90, { gap: 26 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['心算一步 vs 对数表', TXT, 1], ['决策层面两者等价', TXT, 0]] }
        ]);
      } },
      { cap: '用途：面试估算、容量规划、通胀与人口预测 —— 先用量级淘汰错误选项，再决定是否要精确算', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '应用场景' }], '估算文化');
        M.note(ctx, [
          { t: '场景', c: TEAL, rows: [['容量：按增速估耗尽期', TXT, 0], ['金融：通胀翻倍年数', TXT, 0], ['面试：密西西比河流量?', TXT, 0]] },
          { t: '纪律', c: AMBER, rows: [['先量级后精度', TXT, 1], ['估算要写出假设', TXT, 0]] }
        ], 46, 50, 300);
      } }
    ] } });

  D({ g: g, no: 5, title: '代码调优与哨兵', e: 'board',
    strat: '哨兵：把目标种在末尾，用循环后一次判断换掉循环内 n 次边界检查',
    plain: '在数组末尾放一个"哨兵"，循环碰到它自然停，每轮就少问一句"越界了吗"。',
    p: { steps: [
      { cap: '问题：在数组 a 中找 x —— 朴素线性查找的循环里写着两个条件：边界 i < n 与取值 a[i] != x，每轮要比 2 次', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '数组 a' }, { sw: 'box', color: AMBER, txt: '哨兵' }], '线性查找');
        M.chips(ctx, [4, 7, 2, 9, 3], { x: 46, y: 70, tw: 34 });
        M.code(ctx, [
          ['i = 0;', '#a5b4d8'],
          ['while (i < n && a[i] != x)', RED, 1],
          ['  i++;', '#a5b4d8']
        ], 46, 140);
        M.note(ctx, [
          { t: '朴素循环', c: RED, rows: [['每轮 2 个条件', TXT, 1], ['边界 + 取值', TXT, 0]] },
          { t: '目标', c: DIM, rows: [['查找 x = 3', TXT, 0]] }
        ]);
      } },
      { cap: '算账：n=5 时边界检查跑 6 次、取值检查至多 6 次 —— 一半的比较只在回答"越界了吗"', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '边界检查' }, { sw: 'box', color: AMBER, txt: '取值检查' }], '比较次数');
        M.chips(ctx, [4, 7, 2, 9, 3], { x: 46, y: 56, tw: 34, ring: function (i) { return i === 4 ? GREEN : null; } });
        M.bars(ctx, [
          { label: '边界 i<n', v: 6, color: RED },
          { label: '取值 a[i]!=x', v: 6, color: AMBER }
        ], { x: 130, y: 126, w: 160, bh: 16, gap: 28 });
        H.txt(ctx, 'n=5 一趟查找的比较（最坏）', 210, 110, { size: 11, bold: true, color: DIM });
        M.note(ctx, [
          { t: '浪费', c: RED, rows: [['边界检查每轮都跑', TXT, 1], ['真正有用只在最后一次', TXT, 0]] }
        ]);
      } },
      { cap: '哨兵：先把 x 写进 a[n] 作哨兵，循环缩成单条件 while (a[i] != x) i++ —— 必然停住，最坏停在哨兵', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '数组 a' }, { sw: 'box', color: AMBER, txt: '哨兵 a[n]' }], '每轮 1 次比较');
        M.chips(ctx, [4, 7, 2, 9, 3, 3], { x: 46, y: 70, tw: 34, color: function (i) { return i === 5 ? '#3a2f14' : '#273469'; }, ring: function (i) { return i === 5 ? AMBER : null; }, labels: [0, 1, 2, 3, 4, 'n'] });
        M.code(ctx, [
          ['a[n] = x;', AMBER, 1],
          ['while (a[i] != x)', TEAL, 1],
          ['  i++;', '#a5b4d8']
        ], 46, 150);
        M.note(ctx, [
          { t: '哨兵', c: AMBER, rows: [['把目标种在末尾', TXT, 1], ['循环必然自行停住', TXT, 1], ['每轮只剩 1 次比较', TXT, 0]] }
        ]);
      } },
      { cap: '判读：停在下标 i == n 说明撞哨兵 = 不存在；i < n 才是真命中 —— 循环后一次判断换掉循环内 n 次边界检查', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: '真命中' }, { sw: 'box', color: RED, txt: '撞哨兵' }], '事后判读');
        M.chips(ctx, [4, 7, 2, 9, 3, 3], { x: 46, y: 56, tw: 30, color: function (i) { return i === 5 ? '#3a2f14' : '#273469'; }, ring: function (i) { return i === 4 ? GREEN : null; } });
        H.txt(ctx, '情形 A：i = 4 < n → 命中 a[4]', 46, 106, { size: 10.5, color: GREEN, align: 'left' });
        M.chips(ctx, [4, 7, 2, 9, 3, 6], { x: 46, y: 126, tw: 30, color: function (i) { return i === 5 ? '#3a2f14' : '#273469'; }, ring: function (i) { return i === 5 ? RED : null; } });
        H.txt(ctx, '情形 B：i = 5 = n → 撞哨兵，不存在', 46, 176, { size: 10.5, color: RED, align: 'left' });
        M.code(ctx, [['if (i == n) 不存在; else 命中', TXT]], 46, 206, { size: 11 });
        M.note(ctx, [
          { t: '判读', c: GREEN, rows: [['循环后 1 次判断', TXT, 1], ['换掉循环内 n 次边界', TXT, 1]] }
        ]);
      } },
      { cap: '调优账本：每轮比较 2 → 1；调优纪律：先度量找热点、循环不变量外提、哨兵只删检查不改语义', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '朴素' }, { sw: 'box', color: GREEN, txt: '哨兵' }], '比较/轮');
        M.bars(ctx, [
          { label: '朴素双条件', v: 2, color: RED },
          { label: '哨兵单条件', v: 1, color: GREEN }
        ], { x: 150, y: 80, w: 150, bh: 18, gap: 34 });
        H.txt(ctx, '每轮比较次数', 225, 62, { size: 11, bold: true, color: DIM });
        M.note(ctx, [
          { t: '调优纪律', c: TEAL, rows: [['先度量再动热点', TXT, 1], ['不变量外提出循环', TXT, 0], ['预计算、以空间换时间', TXT, 0]] },
          { t: '哨兵家族', c: DIM, rows: [['字符串 \\0、链表尾节点', TXT, 0]] }
        ]);
      } }
    ] } });

  D({ g: g, no: 6, title: '空间压缩', e: 'board',
    strat: '表示服务于数据形状：稠密小值域用位图，有序稀疏用差值 + 变长整数',
    plain: '同一份数据换一种"记法"就能省几个数量级：有序就记差值，数小就少用字节。',
    p: { steps: [
      { cap: '问题：存有序稀疏整数集 {3,7,8,9,240,241,242} —— 朴素每个 int32，共 7 × 4 = 28 字节', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '原值' }, { sw: 'box', color: TEAL, txt: '位图' }, { sw: 'box', color: GREEN, txt: '差值+变长' }], '7 个有序数');
        M.chips(ctx, [3, 7, 8, 9, 240, 241, 242], { x: 46, y: 80, tw: 40, th: 30, size: 12 });
        M.note(ctx, [
          { t: '朴素', c: DIM, rows: [['int32 × 7 = 28 B', TXT, 1], ['不管稀疏还是稠密', TXT, 0]] },
          { t: '问题', c: TEAL, rows: [['能否更少字节？', TXT, 0]] }
        ]);
      } },
      { cap: '候选一位图：按值域 [0,242] 每位 1 bit → 243 bit ≈ 31 B —— 稀疏且值域宽时，位图反而输给原值', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: AMBER, txt: '有值的位置' }], '243 bit ≈ 31 B');
        M.chart(ctx, {
          x: 60, y: 90, w: 260, h: 60,
          series: [{ pts: [[0, 0.5], [1, 0.5]], color: '#39437a' }],
          hl: [[3 / 242, 0.5], [7 / 242, 0.5], [8 / 242, 0.5], [9 / 242, 0.5], [240 / 242, 0.5], [241 / 242, 0.5], [1, 0.5]],
          xlab: [[0, 0, '0'], [1, 0, '242']],
          title: '值域 0..242，只有 7 个点'
        });
        M.note(ctx, [
          { t: '位图', c: RED, rows: [['空间 = 值域，不是个数', TXT, 1], ['稠密小值域才是主场', TXT, 0]] }
        ]);
      } },
      { cap: '候选二差值：有序就存相邻差 3,4,1,1,231,1,1 —— 成簇使差多为 1，只有 231 是例外', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '原值' }, { sw: 'box', color: TEAL, txt: '差值 delta' }], '相邻作差');
        M.chips(ctx, [3, 7, 8, 9, 240, 241, 242], { x: 46, y: 60, tw: 36, th: 26, size: 11 });
        M.chips(ctx, [3, 4, 1, 1, 231, 1, 1], { x: 46, y: 130, tw: 36, th: 26, size: 11, color: function (i, v) { return v > 100 ? '#3a2f14' : '#1e3a34'; }, txt: function (i, v) { return v > 100 ? AMBER : TEAL; } });
        H.txt(ctx, '上：原值   下：delta 差值', 46, 180, { size: 10, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '差值', c: TEAL, rows: [['有序 → 差比原值小', TXT, 1], ['成簇 → 差多为 1', TXT, 0]] }
        ]);
      } },
      { cap: '变长整数打包：每 7 位一组、最高位作延续标志 —— 小差 1 字节、231 占 2 字节，共 8 字节', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: 'varint 字节' }], '共 8 B');
        M.chips(ctx, ['03', '04', '01', '01', 'E7', '01', '01', '01'], { x: 46, y: 80, tw: 32, th: 28, size: 11, color: function (i) { return i === 4 ? '#3a2f14' : '#1e3a34'; }, txt: function (i) { return i === 4 ? AMBER : TEAL; } });
        H.txt(ctx, '231 → 两字节 E7 01', 208, 126, { size: 10, color: AMBER });
        M.code(ctx, [['每 7 位一组，最高位 = 还有后续', TXT]], 46, 156, { size: 11 });
        M.note(ctx, [
          { t: 'varint', c: TEAL, rows: [['小数字用更少字节', TXT, 1], ['Protobuf/SQLite 同款', TXT, 0]] }
        ]);
      } },
      { cap: '对比：原值 28 B / 位图 31 B / 差值+变长 8 B —— 先看数据形状（稠密？有序？值域？）再选表示', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '原值' }, { sw: 'box', color: AMBER, txt: '位图' }, { sw: 'box', color: GREEN, txt: '差值+变长' }], '占用字节');
        M.bars(ctx, [
          { label: '原值 int32', v: 28, color: RED },
          { label: '位图', v: 31, color: AMBER },
          { label: '差值+变长', v: 8, color: GREEN }
        ], { x: 140, y: 70, w: 160, bh: 16, gap: 30 });
        H.txt(ctx, '占用字节', 220, 54, { size: 11, bold: true, color: DIM });
        M.note(ctx, [
          { t: '选表示', c: GREEN, rows: [['稠密小值域 → 位图', TXT, 0], ['有序稀疏 → 差值', TXT, 0], ['小数值 → 变长整数', TXT, 0]] }
        ]);
      } }
    ] } });

  /* ============ 第三辑 排序与取样（p7..p8） ============ */

  D({ g: g, no: 7, title: '插入排序与快速排序', e: 'board',
    strat: '各取所长：小表/近序用插入，大表用快排，混合是工程常态',
    plain: '理牌式插入适合小而近序的数组；分治式快排适合大数组；标准库把两者焊在一起。',
    p: { steps: [
      { cap: '两把排序主力：插入排序在小表/近序时最佳 O(n)；快速排序期望 O(n log n) 且原地', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '插入排序' }, { sw: 'box', color: AMBER, txt: '快速排序' }], '各有所长');
        M.chips(ctx, [5, 2, 8, 1, 9, 3], { x: 46, y: 80, tw: 34 });
        M.note(ctx, [
          { t: '插入', c: TEAL, rows: [['最佳 O(n) 最坏 O(n²)', TXT, 0], ['小 n / 近序时赢', TXT, 1]] },
          { t: '快排', c: AMBER, rows: [['期望 O(n log n)', TXT, 0], ['原地分区', TXT, 0]] }
        ]);
      } },
      { cap: '插入排序：前缀是理好的牌 —— 插入 2：与 [5] 比较，5 右移一位，2 落位成 [2,5]', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: '有序前缀' }, { sw: 'box', color: TEAL, txt: '待插入' }], '插入 2');
        M.chips(ctx, [5, 2, 8, 1, 9, 3], { x: 46, y: 60, tw: 34, color: function (i) { return i === 0 ? '#1e3a34' : '#273469'; }, ring: function (i) { return i === 1 ? TEAL : null; } });
        M.arrow(ctx, 101, 96, 63, 122, TEAL, 2);
        M.chips(ctx, [2, 5], { x: 46, y: 126, tw: 34, color: function () { return '#1e3a34'; } });
        H.txt(ctx, '前缀 [5] → 插入 2 → [2,5]', 46, 184, { size: 10.5, color: DIM, align: 'left' });
        M.note(ctx, [
          { t: '插入', c: TEAL, rows: [['代价 = 移动次数', TXT, 0], ['近序 → 移动很少', TXT, 1]] }
        ]);
      } },
      { cap: '快排分区：选 pivot = 3，L 从左 R 从右扫，错位就交换 —— 5 与 1 逆序，先换过来', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: 'pivot' }, { sw: 'box', color: RED, txt: '交换对' }], 'partition');
        M.chips(ctx, [5, 2, 8, 1, 9, 3], { x: 46, y: 70, tw: 34, ring: function (i) { return i === 5 ? AMBER : null; }, labels: ['L', null, null, null, 'R', 'pivot'] });
        M.arrow(ctx, 63, 130, 177, 130, RED, 2);
        H.txt(ctx, '5 与 1 逆序 → 交换', 120, 150, { size: 10.5, color: RED, align: 'left' });
        M.note(ctx, [
          { t: '分区', c: AMBER, rows: [['a[L]>pivot 且 a[R]<pivot', '#a5b4d8', 0], ['则交换这一对', TXT, 0], ['一趟 O(n)', TXT, 1]] }
        ]);
      } },
      { cap: 'pivot 归位：分区后 [1,2] 3 [8,5,9] —— 3 一次pass落到最终位置，两边递归，期望深度 log n', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: '左/右子段' }, { sw: 'box', color: AMBER, txt: 'pivot 归位' }], '递归两边');
        M.chips(ctx, [1, 2], { x: 46, y: 80, tw: 34, color: function () { return '#12244a'; } });
        M.chips(ctx, [3], { x: 126, y: 80, tw: 34, color: function () { return '#3a2f14'; }, txt: function () { return AMBER; } });
        M.chips(ctx, [8, 5, 9], { x: 168, y: 80, tw: 34, color: function () { return '#12244a'; } });
        H.txt(ctx, '[1,2] < 3 < [8,5,9]', 46, 140, { size: 11, color: DIM, align: 'left' });
        M.code(ctx, [['quicksort(lo, p-1); quicksort(p+1, hi);', '#a5b4d8']], 46, 172, { size: 11 });
        M.note(ctx, [
          { t: '递归', c: AMBER, rows: [['pivot 位置即最终位置', TXT, 1], ['期望深度 O(log n)', TXT, 0]] }
        ]);
      } },
      { cap: '工程选择：小块或近序切插入；快排加随机 pivot 防对抗 O(n²) —— 标准库排序几乎都是两者混合', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '插入·近序' }, { sw: 'box', color: RED, txt: '插入·逆序' }, { sw: 'box', color: GREEN, txt: '快排·期望' }], 'n=6 示意');
        M.bars(ctx, [
          { label: '插入·近序', v: 7, color: TEAL },
          { label: '插入·逆序', v: 36, color: RED },
          { label: '快排·期望', v: 16, color: GREEN }
        ], { x: 150, y: 66, w: 150, bh: 14, gap: 26 });
        H.txt(ctx, '比较次数（n=6 示意）', 225, 50, { size: 11, bold: true, color: DIM });
        M.note(ctx, [
          { t: '混合', c: GREEN, rows: [['小塊切插入排序', TXT, 1], ['随机 pivot 防最坏', TXT, 0]] }
        ]);
      } }
    ] } });

  D({ g: g, no: 8, title: 'Floyd 随机取样', e: 'board',
    strat: 'Floyd：j 从 n−m+1 到 n 抽 randint(1,j)，重复就改放 j —— m 轮定长、均匀、无重试',
    plain: '抽奖不"重抽"：抽到重复号就按规则换成另一个号，每人只抽一次，公平且有界。',
    p: { steps: [
      { cap: '问题：从 1..n=10 中均匀、无放回抽 m=3 个 —— 朴素"抽到重复就重抽"重试次数无界', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '候选池' }, { sw: 'box', color: TEAL, txt: '样本集 S' }], '均匀无放回');
        M.chips(ctx, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], { x: 46, y: 80, tw: 26, th: 26, size: 10 });
        M.note(ctx, [
          { t: '朴素', c: RED, rows: [['重复即弃、重抽', TXT, 0], ['重试次数无界', TXT, 1]] },
          { t: '要求', c: DIM, rows: [['每个 m-子集等概率', TXT, 0]] }
        ]);
      } },
      { cap: 'Floyd：j 从 n−m+1=8 起到 10：抽 t = randint(1, j) 放入集合 S —— j=8 抽得 t=3，S={3}', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '候选池' }, { sw: 'box', color: TEAL, txt: 'S' }], 'j = 8');
        M.chips(ctx, [1, 2, 3, 4, 5, 6, 7, 8], { x: 46, y: 60, tw: 26, th: 26, size: 10, ring: function (i) { return i === 2 ? TEAL : null; } });
        H.txt(ctx, 't = randint(1, 8) = 3', 46, 110, { size: 11, color: TEAL, align: 'left' });
        M.chips(ctx, [3], { x: 46, y: 130, tw: 30, color: function () { return TEAL; }, txt: function () { return '#0c1830'; } });
        H.txt(ctx, 'S = {3}', 86, 145, { size: 11, color: DIM, align: 'left' });
        M.note(ctx, [
          { t: '循环', c: TEAL, rows: [['for j = n−m+1 .. n', '#a5b4d8', 0], ['t = randint(1, j)', '#a5b4d8', 0], ['恰好 m 轮', TXT, 1]] }
        ]);
      } },
      { cap: '撞车规则：j=9 抽得 t=3 已在 S → 改放 j 本身（9）—— 正是这条规则保证了均匀性', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '重复 t' }, { sw: 'box', color: AMBER, txt: '改放 j' }], 'j = 9');
        M.chips(ctx, [1, 2, 3, 4, 5, 6, 7, 8, 9], { x: 46, y: 60, tw: 26, th: 26, size: 10, ring: function (i) { return i === 2 ? RED : null; } });
        H.txt(ctx, 't = randint(1, 9) = 3 重复！', 46, 110, { size: 11, color: RED, align: 'left' });
        M.chips(ctx, [3, 9], { x: 46, y: 130, tw: 30, color: function (i) { return i ? AMBER : TEAL; }, txt: function () { return '#0c1830'; } });
        M.note(ctx, [
          { t: '撞车', c: AMBER, rows: [['t ∈ S → 放入 j', TXT, 1], ['集合大小必 +1', TXT, 1], ['无重试循环', TXT, 0]] }
        ]);
      } },
      { cap: 'j=10 抽得 t=7 不重复 → 直接入集，S={3,9,7} 完成：m 轮循环、恰 m 个元素、零拒绝', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: '样本 S' }], 'j = 10');
        M.chips(ctx, [3, 9, 7], { x: 46, y: 80, tw: 34, color: function () { return GREEN; }, txt: function () { return '#0c1830'; } });
        H.txt(ctx, 'S = {3, 9, 7}', 46, 140, { size: 12, bold: true, color: GREEN, align: 'left' });
        M.note(ctx, [
          { t: '完成', c: GREEN, rows: [['循环 m 轮', TXT, 1], ['|S| = m 恒成立', TXT, 1]] }
        ]);
      } },
      { cap: '为何均匀：不变量"处理完 j 后 S 是 1..j 的均匀 (j−n+m)-样本"可归纳证明；流式未知 n 改用蓄水池抽样', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '不变量' }], '归纳证明');
        M.code(ctx, [
          ['不变量：处理完 j 后', DIM],
          ['S 是 1..j 的均匀 (j−(n−m))-样本', TEAL, 1],
          ['j = n 时：1..n 的均匀 m-子集', GREEN, 1]
        ], 46, 80, { gap: 24 });
        M.note(ctx, [
          { t: '家族', c: DIM, rows: [['流式未知 n → 蓄水池', TXT, 0], ['带权 → A-Res', TXT, 0]] },
          { t: '用途', c: TEAL, rows: [['压测采样 / 抽奖', TXT, 0]] }
        ]);
      } }
    ] } });

  /* ============ 第四辑 结构与文本（p9..p11） ============ */

  D({ g: g, no: 9, title: '堆与堆排序', e: 'board',
    strat: '二叉堆：数组存完全二叉树，只维护父≥子的弱序，根永远是极值',
    plain: '不排全队，只维护一张"锦标赛对阵表"：每层只记小组赢家，最大值永远在顶端。',
    p: { steps: [
      { cap: '问题：动态集合上反复"取当前最大 / top-k" —— 排序再取是一次性 O(n log n)，逐次线性扫是每次 O(n)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '数据流' }, { sw: 'box', color: TEAL, txt: '堆' }], '动态取极值');
        M.chips(ctx, [4, 9, 2, 7, '…'], { x: 46, y: 80, tw: 32, th: 28, size: 11 });
        M.note(ctx, [
          { t: '朴素', c: RED, rows: [['排序再取：一次性', TXT, 0], ['线性扫：每次 O(n)', TXT, 0]] },
          { t: '堆', c: TEAL, rows: [['插入/取极值 O(log n)', TXT, 1]] }
        ]);
      } },
      { cap: '表示：完全二叉树存进数组 —— 节点 i 的孩子在 2i+1 / 2i+2，零指针开销', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '数组视图' }, { sw: 'dot', color: TEAL, txt: '树视图' }], '孩子 = 2i+1 / 2i+2');
        M.chips(ctx, [9, 7, 6, 5, 3, 2], { x: 46, y: 52, tw: 32, th: 26, size: 11, labels: [0, 1, 2, 3, 4, 5] });
        M.tree(ctx, [9, 7, 6, 5, 3, 2], { x: 140, y: 168, ring: function () { return TEAL; } });
        M.note(ctx, [
          { t: '表示', c: TEAL, rows: [['层序 = 数组序', TXT, 1], ['无指针、缓存友好', TXT, 0]] }
        ]);
      } },
      { cap: '堆性质：父 ≥ 子；被破坏就 sift-down —— 与较大的孩子交换，逐层下沉直到恢复', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '破坏点' }, { sw: 'box', color: AMBER, txt: '较大孩子' }], 'sift-down');
        var pos = M.tree(ctx, [4, 9, 6, 5, 3, 2], { x: 140, y: 120, ring: function (i) { return i === 0 ? RED : i === 1 ? AMBER : null; } });
        M.arrow(ctx, pos[0][0] + 8, pos[0][1] + 12, pos[1][0] - 4, pos[1][1] - 12, RED, 2);
        M.note(ctx, [
          { t: '下沉', c: RED, rows: [['4 < 孩子 9、6', TXT, 0], ['与较大者 9 交换', TXT, 1], ['逐层直到父 ≥ 子', TXT, 0]] }
        ]);
      } },
      { cap: '建堆：从最后一个非叶节点往根依次 sift-down（①idx2 ②idx1 ③idx0）—— 总代价 O(n)，不是 O(n log n)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '①' }, { sw: 'box', color: AMBER, txt: '②' }, { sw: 'box', color: GREEN, txt: '③' }], '自底向上');
        M.chips(ctx, [4, 9, 6, 5, 3, 2], { x: 46, y: 80, tw: 34, labels: ['③', '②', '①', null, null, null], ring: function (i) { return i === 2 ? TEAL : i === 1 ? AMBER : i === 0 ? GREEN : null; } });
        M.note(ctx, [
          { t: 'O(n) 直觉', c: GREEN, rows: [['越靠底节点越多', TXT, 0], ['但下沉深度越浅', TXT, 0], ['级数求和 = O(n)', TXT, 1]] }
        ]);
      } },
      { cap: '堆排序：根最大换到末尾、堆缩一再 sift-down，重复 —— 原地 O(n log n)；top-k 只维护大小 k 的堆', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: '剩余堆' }, { sw: 'box', color: GREEN, txt: '已排序尾' }], '原地');
        M.chips(ctx, [5, 2, 3, 6, 7, 9], { x: 46, y: 80, tw: 34, labels: [0, 1, 2, 3, 4, 5], color: function (i) { return i < 3 ? '#12244a' : GREEN; }, txt: function (i) { return i < 3 ? '#e8ecf8' : '#0c1830'; } });
        M.note(ctx, [
          { t: '堆排序', c: GREEN, rows: [['取根 = 当前最大', TXT, 1], ['原地、O(n log n)', TXT, 0]] },
          { t: 'top-k', c: TEAL, rows: [['大小 k 的小根堆', TXT, 0], ['O(n log k)、空间 O(k)', TXT, 0]] }
        ]);
      } }
    ] } });

  D({ g: g, no: 10, title: '词频统计', e: 'board',
    strat: '哈希计数：count[w]++ 一遍过；top-k 用大小 k 的小根堆，不全表排序',
    plain: '不把所有选票按名字排序：给每个候选开一个箱子，读一张票投一个 token，最后数箱子报前几。',
    p: { steps: [
      { cap: '问题：统计文章中每个词的出现次数并输出前 k 高频 —— 把全部单词排序 O(N log N) 是杀鸡用牛刀', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '文章词流' }], 'N 个词');
        M.chips(ctx, ['the', 'quick', 'brown', 'fox', 'the', 'quick', 'the'], { x: 46, y: 80, tw: 44, th: 24, size: 10 });
        M.note(ctx, [
          { t: '目标', c: TEAL, rows: [['每词计数 + top-k', TXT, 1]] },
          { t: '朴素', c: RED, rows: [['全排序 O(N log N)', TXT, 0], ['只要计数，不要全序', TXT, 0]] }
        ]);
      } },
      { cap: '哈希计数：逐词读入 count[w]++ —— 第 5 个词 the 再次命中，计数升为 2', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '词流' }, { sw: 'box', color: TEAL, txt: '计数表' }], 'count[w]++');
        M.chips(ctx, ['the', 'quick', 'brown', 'fox', 'the', 'quick', 'the'], { x: 46, y: 52, tw: 44, th: 22, size: 10, ring: function (i) { return i === 4 ? TEAL : null; } });
        M.grid(ctx, [['the', '2'], ['quick', '1'], ['brown', '1'], ['fox', '1']], { x: 46, y: 100, cs: 46, size: 10, fill: function (r, c) { return c ? '#1e3a34' : '#12244a'; }, txt: function (r, c) { return c ? TXT : TEAL; }, ring: function (r, c) { return r === 0 && c === 1 ? TEAL : null; } });
        M.note(ctx, [
          { t: '一遍过', c: TEAL, rows: [['O(N) 总词数', TXT, 1], ['无排序、无回溯', TXT, 0]] }
        ]);
      } },
      { cap: '全表：the 3、quick 2、brown 1、fox 1 —— 内存只与不同词数 D 成正比，与文章长度 N 无关', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '计数表' }], 'D 个不同词');
        M.grid(ctx, [['the', '3'], ['quick', '2'], ['brown', '1'], ['fox', '1']], { x: 46, y: 70, cs: 46, size: 10, fill: function (r, c) { return c ? '#1e3a34' : '#12244a'; }, txt: function (r, c) { return c ? TXT : TEAL; }, ring: function (r, c) { return r === 0 && c === 1 ? AMBER : null; } });
        M.note(ctx, [
          { t: '空间', c: TEAL, rows: [['O(D) 不同词数', TXT, 1], ['与 N 无关', TXT, 0]] }
        ]);
      } },
      { cap: 'top-k（k=2）：维护大小 2 的小根堆扫表一遍 —— the 3、quick 2 入选，不必全表排序 O(D log k)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: 'top-2' }, { sw: 'box', color: '#39437a', txt: '落选' }], '小根堆 k=2');
        M.bars(ctx, [
          { label: 'the', v: 3, color: AMBER },
          { label: 'quick', v: 2, color: AMBER },
          { label: 'brown', v: 1, color: '#39437a' },
          { label: 'fox', v: 1, color: '#39437a' }
        ], { x: 110, y: 70, w: 150, bh: 14, gap: 26 });
        M.note(ctx, [
          { t: '规则', c: AMBER, rows: [['新计数 > 堆顶才入', TXT, 1], ['入堆即弹堆顶', TXT, 0], ['O(D log k)', TXT, 0]] }
        ]);
      } },
      { cap: '工程：MapReduce wordcount = 把这份计数分片再合并；流式 top-k（heavy hitters）用 Misra-Gries 以精度换空间', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '工程谱系' }], '同款思想');
        M.note(ctx, [
          { t: '分布式', c: TEAL, rows: [['各分片本地计数', TXT, 0], ['merge 时计数相加', TXT, 0]] },
          { t: '流式', c: AMBER, rows: [['Misra-Gries / CM Sketch', TXT, 0], ['有界空间、近似答案', TXT, 0]] },
          { t: '本体', c: GREEN, rows: [['哈希计数一遍过', TXT, 1]] }
        ], 46, 50, 300);
      } }
    ] } });

  D({ g: g, no: 11, title: 'Markov 链文本生成', e: 'board',
    strat: 'k 阶 Markov：统计每个状态的后续词表，随机游走生成"像而非抄"的文本',
    plain: '不背整句，只背"哪句后面常接哪句"，就能接出不是原文、却像原文的新句子。',
    p: { steps: [
      { cap: '问题：生成一段指定长度、"读起来像原文"的文本 —— 既不能纯随机，也不能照抄', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '随机' }, { sw: 'box', color: DIM, txt: '照抄' }, { sw: 'box', color: TEAL, txt: 'Markov' }], '三选一');
        M.code(ctx, [
          ['纯随机: fox the the jump night', RED],
          ['照抄:   the more we study ...', DIM],
          ['Markov: 像而非抄 ✓', TEAL, 1]
        ], 46, 90, { gap: 26 });
        M.note(ctx, [
          { t: '目标', c: TEAL, rows: [['局部像、整体新', TXT, 1]] }
        ]);
      } },
      { cap: '建模型（阶=2）：状态 = 前 2 个词，扫原文一遍记录后续词表 —— "the more" 出现 2 次，后续都是 we', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '原文' }, { sw: 'box', color: TEAL, txt: '状态→后续' }], 'order = 2');
        M.chips(ctx, ['the', 'more', 'we', 'study', 'the', 'more', 'we', 'know'], { x: 46, y: 52, tw: 36, th: 22, size: 9 });
        M.code(ctx, [
          ['the more → we, we', TEAL],
          ['more we  → study, know', TEAL],
          ['we study → the', TEAL],
          ['study the → more', TEAL]
        ], 46, 110, { gap: 20 });
        M.note(ctx, [
          { t: '建表', c: TEAL, rows: [['扫原文一遍 O(N)', TXT, 1], ['状态 = 前 k 个词', TXT, 0]] }
        ]);
      } },
      { cap: '生成：从 "the more" 出发随机选后续 we，窗口滑到 "more we" 继续选 —— 走到 know 收束', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '生成链' }, { sw: 'box', color: AMBER, txt: '收束' }], '随机游走');
        M.chips(ctx, ['the'], { x: 46, y: 70, tw: 40, th: 24, size: 10 });
        M.chips(ctx, ['more'], { x: 100, y: 70, tw: 40, th: 24, size: 10 });
        M.chips(ctx, ['we'], { x: 154, y: 70, tw: 40, th: 24, size: 10 });
        M.chips(ctx, ['study'], { x: 208, y: 70, tw: 40, th: 24, size: 10 });
        M.arrow(ctx, 88, 82, 98, 82, DIM, 2);
        M.arrow(ctx, 142, 82, 152, 82, DIM, 2);
        M.arrow(ctx, 196, 82, 206, 82, DIM, 2);
        M.arrow(ctx, 228, 96, 66, 146, DIM, 2);
        M.chips(ctx, ['the'], { x: 46, y: 150, tw: 40, th: 24, size: 10 });
        M.chips(ctx, ['more'], { x: 100, y: 150, tw: 40, th: 24, size: 10 });
        M.chips(ctx, ['we'], { x: 154, y: 150, tw: 40, th: 24, size: 10 });
        M.chips(ctx, ['know'], { x: 208, y: 150, tw: 40, th: 24, size: 10, ring: function () { return AMBER; } });
        M.arrow(ctx, 88, 162, 98, 162, DIM, 2);
        M.arrow(ctx, 142, 162, 152, 162, DIM, 2);
        M.arrow(ctx, 196, 162, 206, 162, DIM, 2);
        M.note(ctx, [
          { t: '游走', c: TEAL, rows: [['随机选一个后续', TXT, 1], ['窗口滑动一格', TXT, 0], ['无后续即收束', TXT, 0]] }
        ]);
      } },
      { cap: '阶 k 是旋钮：k=0 词沙拉、k=1 啰嗦重复、k=2 读起来像原文；k 太大则趋近照抄', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: 'k=0' }, { sw: 'box', color: AMBER, txt: 'k=1' }, { sw: 'box', color: TEAL, txt: 'k=2' }], '旋钮');
        M.code(ctx, [
          ['k=0: night fox jump the the', RED],
          ['k=1: we we we study study', AMBER],
          ['k=2: the more we know the more', TEAL, 1]
        ], 46, 90, { gap: 26 });
        M.note(ctx, [
          { t: '取舍', c: AMBER, rows: [['k 大 = 更像但更抄', TXT, 1], ['k 小 = 更自由更碎', TXT, 0]] }
        ]);
      } },
      { cap: '谱系：n-gram 语言模型、输入法/代码补全的下一个词预测都是这一族 —— 只是把表换成了神经网络', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '谱系' }], 'P(下一词 | 上下文)');
        M.note(ctx, [
          { t: '同源', c: TEAL, rows: [['n-gram 语言模型', TXT, 0], ['输入法 / 代码补全', TXT, 0]] },
          { t: '今天', c: GREEN, rows: [['神经网络替代表', TXT, 1], ['问题仍是条件概率', TXT, 0]] }
        ], 46, 60, 300);
      } }
    ] } });

  /* ============ 第五辑 方法与正确性（p12..p14） ============ */

  D({ g: g, no: 12, title: '循环不变量与正确性', e: 'board',
    strat: '循环不变量：循环前写下一句"每轮都不变"的命题，初始化/保持/终止三步证明',
    plain: '像给循环种一句"checkpoint"：进循环时成立、每轮保持、退出时直接交出答案。',
    p: { steps: [
      { cap: '问题：如何相信这段前缀最大值循环是对的？"试了几个用例都过"不是证明 —— 测试只能证有 bug', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '数组 a' }, { sw: 'box', color: GREEN, txt: '运行最大 m' }], '测试 ≠ 证明');
        M.chips(ctx, [4, 9, 2, 7, 5], { x: 46, y: 80, tw: 34 });
        M.note(ctx, [
          { t: '困境', c: RED, rows: [['用例只能证伪', TXT, 1], ['off-by-one 容易漏过', TXT, 0]] },
          { t: '出路', c: TEAL, rows: [['给循环一个不变量', TXT, 0]] }
        ]);
      } },
      { cap: '不变量：第 i 轮后 m = max(a[0..i]) —— 先写命题再写循环，它是循环的"契约"', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '不变量' }], '契约先行');
        M.code(ctx, [
          ['不变量: m = max(a[0..i])', TEAL, 1],
          ['for i = 1..n-1:', '#a5b4d8'],
          ['  m = max(m, a[i])', '#a5b4d8']
        ], 46, 90, { gap: 24 });
        M.note(ctx, [
          { t: '契约', c: TEAL, rows: [['先命题、后代码', TXT, 1], ['每轮循环前都成立', TXT, 0]] }
        ]);
      } },
      { cap: '三步证明 ① 初始化：循环前 i=0、m=a[0] 成立 ② 保持：设轮前成立，则 m=max(m,a[i]) 后仍成立', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: '前缀 0..i' }, { sw: 'box', color: GREEN, txt: 'm' }], 'i = 2');
        M.chips(ctx, [4, 9, 2, 7, 5], { x: 46, y: 60, tw: 34, color: function (i) { return i <= 2 ? '#1e3a34' : '#273469'; } });
        M.arrow(ctx, 120, 96, 63, 124, TEAL, 2);
        M.chips(ctx, [9], { x: 46, y: 130, tw: 34, color: function () { return GREEN; }, txt: function () { return '#0c1830'; } });
        H.txt(ctx, 'm = max(4,9,2) = 9', 90, 147, { size: 11, color: DIM, align: 'left' });
        M.note(ctx, [
          { t: '① 初始化', c: TEAL, rows: [['i=0: m=a[0] 成立', TXT, 0]] },
          { t: '② 保持', c: TEAL, rows: [['轮前真 → 轮后真', TXT, 1]] }
        ]);
      } },
      { cap: '三步证明 ③ 终止：循环结束 i = n−1，不变量直接交出后置条件 m = max(a[0..n−1])', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: '全数组' }, { sw: 'box', color: GREEN, txt: '后置条件' }], 'i = n−1');
        M.chips(ctx, [4, 9, 2, 7, 5], { x: 46, y: 60, tw: 34, color: function () { return '#1e3a34'; } });
        M.chips(ctx, [9], { x: 46, y: 120, tw: 34, color: function () { return GREEN; }, txt: function () { return '#0c1830'; } });
        M.code(ctx, [
          ['循环终止 → i = n−1', '#a5b4d8'],
          ['不变量交出 m = max(全部)', GREEN, 1]
        ], 46, 180, { gap: 20 });
        M.note(ctx, [
          { t: '③ 终止', c: GREEN, rows: [['不变量 + 终止条件', TXT, 1], ['= 后置条件', TXT, 1]] }
        ]);
      } },
      { cap: '反例：边界写成 i < n−1 —— 不变量仍"真"，但终止时不再交出后置条件；第三步当场抓住 off-by-one', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '漏掉元素' }], 'off-by-one');
        M.chips(ctx, [4, 9, 2, 7, 5], { x: 46, y: 60, tw: 34, color: function (i) { return i <= 3 ? '#1e3a34' : '#273469'; }, ring: function (i) { return i === 4 ? RED : null; } });
        M.code(ctx, [
          ['for i = 1..n−2:  // off-by-one', RED, 1],
          ['终止: i = n−2，a[4] 未入 m', '#a5b4d8'],
          ['不变量真 ≠ 后置条件', RED, 1]
        ], 46, 130, { gap: 20 });
        M.note(ctx, [
          { t: '抓住', c: RED, rows: [['第三步暴露边界错', TXT, 1]] },
          { t: '机械化', c: TEAL, rows: [['assert(不变量) 种进循环', TXT, 0]] }
        ]);
      } }
    ] } });

  D({ g: g, no: 13, title: '脚手架与差分测试', e: 'board',
    strat: '脚手架：生成器 + 被测 + 暴力 oracle + 比较器，让机器替你出百万个用例',
    plain: '像质检流水线：随机进料、两台机器并行加工（快实现 vs 慢但对的暴力），输出不一致当场扣下。',
    p: { steps: [
      { cap: '问题：快排写完了，怎么测？手挑几个用例（有序/逆序/含重复）盖不住边界与坏运气', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '手写用例' }], '覆盖不足');
        M.chips(ctx, ['有序', '逆序', '含重复'], { x: 46, y: 80, tw: 52, th: 26, size: 11 });
        M.note(ctx, [
          { t: '手写三缺', c: RED, rows: [['数量少', TXT, 0], ['边界想不到', TXT, 1], ['失败难复现', TXT, 0]] }
        ]);
      } },
      { cap: '脚手架三件：生成器随机造输入、oracle（暴力法）给标准答案、比较器逐一对账 —— 循环跑百万轮', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '脚手架' }], '差分测试');
        M.chips(ctx, ['生成器'], { x: 46, y: 70, tw: 80, th: 30, size: 11 });
        M.chips(ctx, ['被测实现'], { x: 170, y: 48, tw: 80, th: 30, size: 11, color: function () { return '#1e3a34'; } });
        M.chips(ctx, ['暴力 oracle'], { x: 170, y: 112, tw: 80, th: 30, size: 11, color: function () { return '#12244a'; } });
        M.chips(ctx, ['比较器'], { x: 288, y: 80, tw: 76, th: 30, size: 11, color: function () { return '#3a2f14'; } });
        M.arrow(ctx, 128, 80, 168, 64, DIM, 2);
        M.arrow(ctx, 128, 90, 168, 126, DIM, 2);
        M.arrow(ctx, 252, 64, 286, 92, DIM, 2);
        M.arrow(ctx, 252, 126, 286, 98, DIM, 2);
        M.note(ctx, [
          { t: 'oracle', c: TEAL, rows: [['可以慢、必须显然对', TXT, 1], ['插入排序/暴力枚举', TXT, 0]] },
          { t: '循环', c: AMBER, rows: [['百万轮随机对账', TXT, 0]] }
        ]);
      } },
      { cap: '跑一轮：输入 [5,2,9,2] → 快排给 [2,2,5,9]、暴力排序也给 [2,2,5,9] → 一致，下一轮', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '输入' }, { sw: 'box', color: GREEN, txt: '一致 ✓' }], '第 t 轮');
        M.chips(ctx, [5, 2, 9, 2], { x: 100, y: 52, tw: 34 });
        H.txt(ctx, '被测 →', 46, 127, { size: 10, color: DIM, align: 'left' });
        M.chips(ctx, [2, 2, 5, 9], { x: 100, y: 110, tw: 34, color: function () { return '#1e3a34'; } });
        H.txt(ctx, 'oracle →', 46, 177, { size: 10, color: DIM, align: 'left' });
        M.chips(ctx, [2, 2, 5, 9], { x: 100, y: 160, tw: 34, color: function () { return '#12244a'; } });
        H.txt(ctx, '一致 ✓', 262, 145, { size: 12, bold: true, color: GREEN, align: 'left' });
        M.note(ctx, [
          { t: '对账', c: GREEN, rows: [['逐一比较输出', TXT, 1], ['一致即过本轮', TXT, 0]] }
        ]);
      } },
      { cap: '抓住 bug：某轮两边输出不一致 —— 脚手架当场留存最小失败用例，复现与回归一步到位', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '不一致' }], '留存用例');
        M.chips(ctx, [3, 3, 3, 2], { x: 100, y: 52, tw: 34 });
        H.txt(ctx, '被测 →', 46, 127, { size: 10, color: DIM, align: 'left' });
        M.chips(ctx, [3, 2, 3, 3], { x: 100, y: 110, tw: 34, ring: function () { return RED; } });
        H.txt(ctx, 'oracle →', 46, 177, { size: 10, color: DIM, align: 'left' });
        M.chips(ctx, [2, 3, 3, 3], { x: 100, y: 160, tw: 34, ring: function () { return TEAL; } });
        H.txt(ctx, '不一致 → 留存此用例', 46, 216, { size: 11, bold: true, color: RED, align: 'left' });
        M.note(ctx, [
          { t: '留存', c: RED, rows: [['最小失败用例', TXT, 1], ['进回归套件', TXT, 0]] }
        ]);
      } },
      { cap: '断言：在前置/不变量/后置处种 assert（分区不丢不重、pivot 归位），开发期 fail-fast；脚手架 + 断言 = 双保险', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: 'assert' }], '定位到行');
        M.code(ctx, [
          ['assert(lo <= hi);', '#a5b4d8'],
          ['assert(p in [lo, hi]); // pivot 归位', TEAL],
          ['assert(cnt == n);    // 不丢不重', TEAL]
        ], 46, 90, { gap: 24 });
        M.note(ctx, [
          { t: '分工', c: TEAL, rows: [['脚手架答"哪例错"', TXT, 1], ['断言答"哪行错"', TXT, 1]] },
          { t: '成本', c: DIM, rows: [['assert 仅开发期', TXT, 0]] }
        ]);
      } }
    ] } });

  D({ g: g, no: 14, title: '攻击层级与性能阶梯', e: 'board',
    strat: '攻击层级：问题定义 > 算法 > 数据结构 > 代码调优 > 硬件，越上层收益越大',
    plain: '性能不够别先抠代码：更大的收益藏在更上层——先问问题本身能不能改。',
    p: { steps: [
      { cap: '问题：程序慢了从哪下手？直接钻进代码调优，常常捡了芝麻丢了西瓜', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '五层阶梯' }], '先选层再动手');
        M.note(ctx, [
          { t: '五层', c: TEAL, rows: [['L1 问题定义', TXT, 0], ['L2 算法设计', TXT, 0], ['L3 数据结构', TXT, 0], ['L4 代码调优', TXT, 0], ['L5 硬件', TXT, 0]] },
          { t: '陷阱', c: RED, rows: [['直接钻 L4', TXT, 1]] }
        ], 46, 46, 300);
      } },
      { cap: 'L1 重定义问题：用户其实只要"前 10 名"而非全排序 —— 改一句需求，复杂度降一档', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '全排序' }, { sw: 'box', color: GREEN, txt: '只要 top-10' }], '改需求');
        M.bars(ctx, [
          { label: '全排序', v: 100, color: RED },
          { label: '只要 top-10', v: 35, color: GREEN }
        ], { x: 140, y: 80, w: 160, bh: 18, gap: 34 });
        H.txt(ctx, '同一份数据的代价', 220, 62, { size: 11, bold: true, color: DIM });
        M.note(ctx, [
          { t: 'L1', c: GREEN, rows: [['先问"真正要什么"', TXT, 1], ['需求是最贵的开关', TXT, 0]] }
        ]);
      } },
      { cap: 'L2/L3 换算法与数据结构：O(n²) → O(n log n) → O(n)，线性扫 → 哈希查，每层一个量级', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: 'O(n²)' }, { sw: 'box', color: AMBER, txt: 'O(n log n)' }, { sw: 'box', color: TEAL, txt: 'O(n)' }, { sw: 'box', color: GREEN, txt: 'O(1)' }], '量级跳');
        M.bars(ctx, [
          { label: 'O(n²)', v: 100, color: RED },
          { label: 'O(n log n)', v: 30, color: AMBER },
          { label: 'O(n)', v: 10, color: TEAL },
          { label: '哈希 O(1)', v: 2, color: GREEN }
        ], { x: 150, y: 64, w: 150, bh: 13, gap: 24 });
        M.note(ctx, [
          { t: 'L2/L3', c: TEAL, rows: [['算法换档 = 量级', TXT, 1], ['表示/结构同层', TXT, 0]] }
        ]);
      } },
      { cap: 'L4/L5 代码调优与硬件：哨兵/外提是几个百分点到几倍；加核加内存几倍 —— 但上限已被上层锁定', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '典型倍率' }], '上层定上限');
        M.code(ctx, [
          ['L1 问题定义   ~1000×', GREEN, 1],
          ['L2 算法设计    ~100×', TEAL, 1],
          ['L3 数据结构     ~10×', AMBER, 1],
          ['L4 代码调优      ~2×', DIM],
          ['L5 硬件          ~4×', DIM]
        ], 60, 70, { gap: 26 });
        M.note(ctx, [
          { t: 'L4/L5', c: DIM, rows: [['倍数级、非量级', TXT, 1], ['Amdahl: 只加速可并行部分', TXT, 0]] }
        ]);
      } },
      { cap: '顺序纪律：自顶向下逐层攻击、层间度量；上层红利吃尽才下探 —— p4 估算、p5 调优、p6 表示在这一页汇成总纲', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '自顶向下' }], '总纲');
        M.arrow(ctx, 120, 60, 120, 200, TEAL, 2.5);
        H.txt(ctx, 'L1 → L5 逐层下探', 136, 130, { size: 11, color: DIM, align: 'left' });
        M.note(ctx, [
          { t: '纪律', c: TEAL, rows: [['先上层后下层', TXT, 1], ['层间度量、达标即停', TXT, 0]] },
          { t: '本库互参', c: GREEN, rows: [['p4 估算定"要不要"', TXT, 0], ['p5/p6 是下层工具', TXT, 0]] }
        ]);
      } }
    ] } });
})();
