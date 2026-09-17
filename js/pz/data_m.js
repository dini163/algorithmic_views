/* 面试算法 · 59 题动画演示（独立页面 bop.html，分组 'm'，编号 m1..m59）
   去重说明：1.3 一摞烙饼的排序 ≡ 本站 #84 煎饼排序、4.6 桶中取黑白球 ≡ 本站 #50 最后一个球，均不收录。
   绘图沿用家族语言：顶部细图例行 + 左侧可视化 + 右侧发丝分隔要点栏 + 底部字幕（引擎自动）。 */
(function () {
  var H = PZ.H, U = PZ.U, D = PZ.def, g = 'm';

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

  /* ============ 第一辑 游戏与策略（m1..m17） ============ */

  /* m1 · 让 CPU 占用率曲线听你指挥 */
  D({ g: g, no: 1, title: 'CPU 占用率曲线', e: 'board', strat: '占空比·模拟',
    plain: '写一个死循环程序让 CPU 占用率 100% 很容易；要让占用率按指定的波形（如 50% 正弦波）变化，关键是控制"忙一段、歇一段"的占空比：在每个固定周期里，忙的时间占比就是这个周期的占用率。把周期取得足够短（几十毫秒），任务管理器采样看到的就是平滑曲线。',
    p: { steps: [
      { cap: '目标：让任务管理器的 CPU 曲线画出我们指定的波形（半周期正弦）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: 'CPU 占用率' }], '目标：波形听你指挥');
        M.chart(ctx, { x: 56, y: 46, w: 280, h: 190, ymax: 100, grid: [0.5, 1],
          series: [{ pts: (function () { var a = []; for (var i = 0; i <= 40; i++) a.push([i / 40, 0.5 + 0.5 * Math.sin(i / 40 * Math.PI * 2)]); return a; })(), color: TEAL, lw: 2.5 }] });
        M.note(ctx, [
          { t: '任务管理器', rows: [['横轴时间、纵轴占用率', DIM], ['一条随时间起伏的曲线', DIM]] },
          { t: '要求', c: AMBER, rows: [['曲线形状由我们的程序决定', TXT, true], ['想画正弦就出正弦', DIM]] }
        ]);
      } },
      { cap: '起点很容易：一个死循环就能把占用率顶到 100%', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: RED, txt: '100% 满载' }], '先复现最简单的 100%');
        M.chart(ctx, { x: 56, y: 46, w: 280, h: 190, ymax: 100, grid: [0.5, 1],
          series: [{ pts: [[0, 1], [1, 1]], color: RED, lw: 2.5 }] });
        M.code(ctx, [['while (true)', '#a5b4d8'], ['    ;  // 空转', '#8fa0c8']], 66, 268, { size: 12 });
        M.note(ctx, [
          { t: '死循环 = 满载', c: RED, rows: [['CPU 一刻不停执行指令', TXT], ['占用率恒为 100%', TXT, true]] },
          { t: '问题', c: AMBER, rows: [['想降到 50%？想让曲线波动？', DIM], ['光靠忙是不够的', DIM]] }
        ]);
      } },
      { cap: '原理：一个周期内"忙 busy 毫秒 + 睡 sleep 毫秒"，占用率 = busy / (busy + sleep)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '忙（计算）' }, { sw: 'box', color: '#273469', txt: '睡（Sleep）' }], '占空比决定占用率');
        /* 两条时间轴：1:1 → 50%；3:1 → 75% */
        function band(y, busy, sleep, label, pct) {
          var x = 56, unit = 240 / (busy + sleep);
          for (var k = 0; k < 4; k++) {
            ctx.fillStyle = AMBER; H.rr(ctx, x + k * (busy + sleep) * unit, y, busy * unit - 2, 20, 3); ctx.fill();
            ctx.fillStyle = '#273469'; H.rr(ctx, x + k * (busy + sleep) * unit + busy * unit, y, sleep * unit - 2, 20, 3); ctx.fill();
          }
          H.txt(ctx, label, x - 8, y + 10, { size: 11, color: DIM, align: 'right' });
          H.txt(ctx, pct, x + 252, y + 10, { size: 12, bold: true, color: GREEN, align: 'left' });
        }
        H.txt(ctx, '时间 →', 300, 40, { size: 10, color: FAINT });
        band(60, 10, 10, 'busy:sleep = 1:1', '50%');
        band(110, 30, 10, 'busy:sleep = 3:1', '75%');
        band(160, 10, 30, 'busy:sleep = 1:3', '25%');
        M.code(ctx, [['while (true) {', '#a5b4d8'], ['  busyWork(BUSY_MS);', AMBER], ['  Sleep(SLEEP_MS);', '#7dd3fc'], ['}', '#a5b4d8']], 66, 216, { size: 11.5 });
        M.note(ctx, [
          { t: '占空比', c: TEAL, rows: [['占用率 = busy / (busy+sleep)', TXT, true], ['周期足够短（≈40ms）', DIM], ['采样就看不到毛刺', DIM]] },
          { t: '画曲线', c: AMBER, rows: [['每个周期查一次正弦表', DIM], ['按目标值动态调 busy 时长', TXT, true]] }
        ]);
      } },
      { cap: '完整方案：周期 40ms，busy 时长 = 40 × (0.5 + 0.5·sin(t))，曲线如愿出现 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '实测占用率' }, { sw: 'line', color: AMBER, txt: '目标正弦' }], '结论：波形完全可控');
        M.chart(ctx, { x: 56, y: 46, w: 280, h: 190, ymax: 100, grid: [0.5, 1],
          series: [
            { pts: (function () { var a = []; for (var i = 0; i <= 40; i++) a.push([i / 40, 0.5 + 0.5 * Math.sin(i / 40 * Math.PI * 2)]); return a; })(), color: AMBER, lw: 1.5, dash: [5, 4] },
            { pts: (function () { var a = []; for (var i = 0; i <= 40; i++) { var v = 0.5 + 0.5 * Math.sin(i / 40 * Math.PI * 2); a.push([i / 40, v + (i % 3 === 0 ? 0.03 : -0.02)]); } return a; })(), color: TEAL, lw: 2.5 }
          ] });
        M.code(ctx, [['SPAN = 40ms;', '#8fa0c8'], ['busy = SPAN * (0.5+0.5*sin(t));', AMBER], ['Sleep(SPAN - busy);', '#7dd3fc']], 66, 262, { size: 11.5 });
        M.note(ctx, [
          { t: '答案', c: GREEN, rows: [['忙/睡占空比 = 占用率', TXT, true], ['按正弦表调占空比', DIM], ['即可画出任意波形 ✓', GREEN, true]] },
          { t: '延伸', rows: [['多核时代还能指定核心', DIM], ['（SetThreadAffinityMask）', DIM]] }
        ]);
      } }
    ] } });

  /* m2 · 中国象棋将帅问题 */
  D({ g: g, no: 2, title: '中国象棋将帅问题', e: 'board', strat: '位运算·枚举',
    plain: '将、帅各自只能在九宫 3×3 = 9 个位置里走，且不能面对面（同一列）。用 4 个二进制位就能装下 0..8 的位置编号，一个字节变量 i 的低 4 位存帅、高 4 位存将，i 从 0 数到 80 即枚举全部 81 种组合；过滤掉同列的 9 种，剩 54 种合法。全程只用一个变量，是位运算的招牌练习题。',
    p: { steps: [
      { cap: '局面：将与帅只能在各自九宫（3×3）内移动，且不能"面对面"（同一列）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: AMBER, txt: '将' }, { sw: 'dot', color: TEAL, txt: '帅' }, { sw: 'line', color: RED, txt: '同列 = 违规' }], '目标：数出全部合法位置对');
        /* 两个九宫上下排列 */
        function palace(y0, color, label) {
          for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
            ctx.fillStyle = (r + c) % 2 ? '#182148' : '#121a3a';
            H.rr(ctx, 120 + c * 34 + 1, y0 + r * 34 + 1, 32, 32, 4); ctx.fill();
          }
          ctx.strokeStyle = '#39437a'; ctx.lineWidth = 1.2;
          H.rr(ctx, 120, y0, 102, 102, 6); ctx.stroke();
          H.txt(ctx, label, 100, y0 + 51, { size: 12, bold: true, color: color, align: 'right' });
        }
        palace(40, AMBER, '将');
        palace(182, TEAL, '帅');
        H.line(ctx, 171, 142, 171, 182, 'rgba(148,163,184,.35)', 1.5);
        M.note(ctx, [
          { t: '规则', c: RED, rows: [['将帅同列即"照面"，违规', TXT, true], ['各自活动范围只有 9 格', DIM]] },
          { t: '问', c: AMBER, rows: [['合法的位置组合有多少种？', TXT], ['只许用一个变量！', RED, true]] }
        ], 372, 60);
      } },
      { cap: '朴素想法：双重循环 9×9 = 81 种组合，同列的 9 种非法 → 81 − 9 = 54 种', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: '合法' }, { sw: 'box', color: '#3d2145', txt: '同列违规' }], '9×9 = 81 种组合');
        for (var j = 0; j < 3; j++) for (var s = 0; s < 3; s++) {
          var ok = j !== s;
          ctx.fillStyle = ok ? '#1e3a34' : '#3d2145';
          H.rr(ctx, 60 + s * 62, 52 + j * 62, 56, 56, 6); ctx.fill();
          H.txt(ctx, '将' + j + ' 帅' + s, 60 + s * 62 + 28, 52 + j * 62 + 22, { size: 11, bold: true, color: ok ? GREEN : RED });
          H.txt(ctx, ok ? '✓' : '同列', 60 + s * 62 + 28, 52 + j * 62 + 40, { size: 10, color: ok ? DIM : RED });
        }
        M.code(ctx, [['for (i = 0; i < 81; i++)', '#a5b4d8'], ['  if (将(i) != 帅(i))', '#a5b4d8'], ['    输出合法组合;', GREEN]], 280, 258, { size: 11.5 });
        M.note(ctx, [
          { t: '组合总数', rows: [['9 × 9 = 81 种', TXT, true]] },
          { t: '违规', c: RED, rows: [['同列：00、11、22 … 共 9 种', TXT]] },
          { t: '合法', c: GREEN, rows: [['81 − 9 = 54 种', GREEN, true]] },
          { t: '难点', c: AMBER, rows: [['题目限制只能用一个变量', TXT], ['双重循环要两个 → 不行', RED]] }
        ], 372, 46);
      } },
      { cap: '位技巧：一个字节 i，低 4 位存帅、高 4 位存将 —— i & 15 取帅，i >> 4 取将', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '一个字节 i' }], '一个变量装下两个位置');
        /* 字节位格 */
        for (var b = 7; b >= 0; b--) {
          var x = 70 + (7 - b) * 30;
          ctx.fillStyle = b < 4 ? '#1e3a34' : '#12244a';
          H.rr(ctx, x, 60, 26, 34, 4); ctx.fill();
          H.mono(ctx, String((81 >> b) & 1), x + 13, 77, { size: 13, bold: true, color: b < 4 ? GREEN : TEAL });
          H.mono(ctx, 'b' + b, x + 13, 108, { size: 9, color: FAINT });
        }
        H.txt(ctx, '高 4 位：将', 145, 48, { size: 11, color: TEAL });
        H.txt(ctx, '低 4 位：帅', 265, 48, { size: 11, color: GREEN });
        M.code(ctx, [
          ['#define SET(i, v)  …', '#8fa0c8'],
          ['i 从 0 数到 80：', TXT],
          ['  将 = i / 9,  帅 = i % 9', '#7dd3fc'],
          ['  即 i = 将*9 + 帅 一一对应', AMBER]
        ], 70, 146, { size: 12 });
        M.note(ctx, [
          { t: '为什么 4 位够', rows: [['位置编号 0..8 < 15', DIM], ['4 个二进制位装得下', TXT, true]] },
          { t: '编码', c: AMBER, rows: [['i = 将×9 + 帅', TXT, true], ['0..80 恰好遍历全部组合', DIM]] }
        ], 372, 60);
      } },
      { cap: '单变量枚举：i 从 0 到 80，i%9 == i/9 即同列违规 → 合法组合 54 种 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '合法 54 种' }, { sw: 'line', color: RED, txt: '同列 9 种' }], '答案：54');
        M.code(ctx, [
          ['BYTE i = 81;', TXT],
          ['while (i--)', TXT],
          ['  if (i / 9 == i % 9)', RED],
          ['    continue;   // 同列违规', RED],
          ['  else', GREEN],
          ['    输出 (将 = i/9, 帅 = i%9);', GREEN]
        ], 60, 64, { size: 13, gap: 22 });
        H.txt(ctx, '81 种组合', 150, 240, { size: 12, color: DIM });
        M.arrow(ctx, 200, 240, 236, 240, AMBER, 2);
        H.txt(ctx, '滤掉 9 种同列', 300, 240, { size: 12, color: RED });
        M.arrow(ctx, 366, 240, 402, 240, AMBER, 2);
        H.txt(ctx, '剩 54 种 ✓', 460, 240, { size: 12, bold: true, color: GREEN });
        M.note(ctx, [
          { t: '答案', c: GREEN, rows: [['合法位置对共 54 种', GREEN, true], ['全程只用一个变量 i', TXT, true]] },
          { t: '要点', rows: [['位运算把两个 0..8 的状态', DIM], ['压进一个整数，枚举即遍历', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m3 · 买书问题 */
  D({ g: g, no: 3, title: '买书问题', e: 'board', strat: '动态规划·贪心陷阱',
    plain: '一本书 25 元，一起买的不同种类越多折扣越大：2 本 5%、3 本 10%、4 本 20%、5 本 25%（同种多本按原价拆到别的组）。买一批书怎么分组最省钱？直觉的"每轮都凑满 5 本"贪心在 8 本（5 种 + 3 种多一本）时翻车：5+3 要 161.25 元，4+4 只要 160 元 —— 因为 4 本档 80% 的性价比（每本 20）比 5 本档 75%（每本 18.75）差得不够多、被 3 本档 90% 拖了后腿。正确答案要用动态规划按"各卷剩余本数"逐层决策。',
    p: { steps: [
      { cap: '折扣规则：一组里不同种类越多折扣越大（2 本 5%、3 本 10%、4 本 20%、5 本 25%），单本 25 元', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '一组（种类数决定折扣）' }], '目标：总花费最少');
        M.bars(ctx, [
          { label: '2 本', v: 5, color: '#7dd3fc' },
          { label: '3 本', v: 10, color: TEAL },
          { label: '4 本', v: 20, color: AMBER },
          { label: '5 本', v: 25, color: GREEN }
        ], { x: 110, y: 56, w: 170, bh: 18, gap: 36, vmax: 25 });
        H.txt(ctx, '折扣 %', 292, 42, { size: 10, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '规则', c: AMBER, rows: [['一组内每种书最多 1 本', TXT, true], ['组的大小 = 不同种类数', DIM], ['折扣按组大小给：5→25%', DIM]] },
          { t: '问', rows: [['买一批书（可能同种多本）', DIM], ['如何分组总价最低？', TXT, true]] }
        ], 372, 52);
      } },
      { cap: '例：5 种书共买 10 本（每种 2 本）—— 直觉贪心：每轮凑满 5 种 → 5+5 = 187.5 元', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#3b55a6', txt: '书' }, { sw: 'box', color: GREEN, txt: '一组' }], '例：每种 2 本，共 10 本');
        var colors = ['#7dd3fc', '#a3e635', '#f0abfc', '#fdba74', '#e879f9'];
        for (var k = 0; k < 10; k++) {
          ctx.fillStyle = '#273469';
          H.rr(ctx, 46 + k * 30, 56, 26, 40, 4); ctx.fill();
          ctx.fillStyle = colors[k % 5];
          H.rr(ctx, 46 + k * 30 + 8, 62, 10, 28, 2); ctx.fill();
        }
        H.txt(ctx, 'A B C D E A B C D E（颜色 = 种类）', 196, 116, { size: 10.5, color: FAINT });
        ctx.strokeStyle = GREEN; ctx.lineWidth = 2.5;
        H.rr(ctx, 44, 52, 148, 48, 8); ctx.stroke();
        H.rr(ctx, 194, 52, 148, 48, 8); ctx.stroke();
        H.txt(ctx, '第 1 组 5 种 −25%', 118, 146, { size: 11, bold: true, color: GREEN });
        H.txt(ctx, '第 2 组 5 种 −25%', 268, 146, { size: 11, bold: true, color: GREEN });
        M.code(ctx, [['两组都是 5 种：', TXT], ['2 × (5×25×0.75) = 187.5 元', GREEN, true], ['本例贪心恰好也是最优 ✓', DIM]], 60, 182, { size: 12.5, gap: 22 });
        M.note(ctx, [
          { t: '贪心策略', c: GREEN, rows: [['每轮凑出最大组（5 种）', TXT], ['本例恰好也是最优', DIM]] },
          { t: '但是…', c: AMBER, rows: [['贪心永远对吗？', TXT, true], ['看 8 本的反例 →', AMBER]] }
        ], 372, 56);
      } },
      { cap: '贪心翻车现场：买 8 本（5 种全有 + 其中 3 种多一本）—— 贪心 5+3 = 161.25 元', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '贪心 5+3' }, { sw: 'box', color: GREEN, txt: '更优 4+4' }], '反例：8 本 = 5+3');
        function scheme(y, sizes, color, costTxt) {
          var x = 110;
          H.txt(ctx, sizes.join('+'), 96, y + 24, { size: 12, bold: true, color: color, align: 'right' });
          sizes.forEach(function (s) {
            var disc = { 5: 25, 4: 20, 3: 10 }[s];
            ctx.strokeStyle = color; ctx.lineWidth = 2;
            H.rr(ctx, x, y, s * 30 - 6, 48, 8); ctx.stroke();
            for (var i2 = 0; i2 < s; i2++) { ctx.fillStyle = '#273469'; H.rr(ctx, x + 6 + i2 * 30, y + 8, 20, 32, 3); ctx.fill(); }
            H.txt(ctx, s + ' 种 −' + disc + '%', x + (s * 30 - 6) / 2, y + 62, { size: 10.5, color: DIM });
            x += s * 30 + 10;
          });
          H.txt(ctx, costTxt, 322, y + 24, { size: 12.5, bold: true, color: color, align: 'left' });
        }
        scheme(52, [5, 3], RED, '= 93.75 + 67.5');
        scheme(152, [4, 4], GREEN, '= 80 + 80');
        M.code(ctx, [
          ['贪心 5+3：5×25×0.75 + 3×25×0.90', TXT],
          ['        = 93.75 + 67.50 = 161.25', RED],
          ['更优 4+4：2 × (4×25×0.80) = 160', GREEN],
          ['160 < 161.25 → 贪心失败', AMBER, true]
        ], 46, 244, { size: 11.5, gap: 21 });
        M.note(ctx, [
          { t: '贪心账', c: RED, rows: [['5 种组：93.75 元', TXT], ['3 种组：67.50 元', TXT], ['合计 161.25 元', RED, true]] },
          { t: '4+4 账', c: GREEN, rows: [['两组各 4 种：80+80', TXT], ['合计 160 元 < 161.25', GREEN, true], ['贪心不是最优！', AMBER, true]] }
        ], 372, 44);
      } },
      { cap: '为什么翻车：比每本均价 —— 5 本档 18.75、4 本档 20、3 本档 22.5；贪心的尾巴落在最贵的 3 本档', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: '每本均价' }], '性价比表');
        M.bars(ctx, [
          { label: '5 本档', v: 18.75, color: GREEN },
          { label: '4 本档', v: 20, color: TEAL },
          { label: '3 本档', v: 22.5, color: AMBER },
          { label: '2 本档', v: 23.75, color: RED }
        ], { x: 110, y: 56, w: 180, bh: 18, gap: 34, vmax: 25 });
        H.txt(ctx, '元/本（越短越便宜）', 296, 42, { size: 10, color: FAINT, align: 'left' });
        M.code(ctx, [
          ['贪心 5+3 = 18.75×5 + 22.5×3', TXT],
          ['更优 4+4 = 20×4 + 20×4', TXT],
          ['5+3 → 161.25；4+4 → 160 ✓', GREEN],
          ['规则：尽量凑 5，但避免剩下 3 本档尾巴', AMBER]
        ], 46, 214, { size: 11.5, gap: 22 });
        M.note(ctx, [
          { t: '坑在哪', c: AMBER, rows: [['3 本档折扣(10%)太浅', TXT], ['与 4 本档(20%)差距过大', TXT, true], ['尾巴落 3 本档就亏', RED]] },
          { t: '直觉修正', c: TEAL, rows: [['宁可把 5+3 拆成 4+4', TXT], ['但一般情形要 DP 才能稳', DIM]] }
        ], 372, 48);
      } },
      { cap: 'DP 方案：状态 = 各"剩余本数"的种类统计，每步枚举下一组大小，取最小值 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: 'DP 状态' }, { sw: 'line', color: GREEN, txt: '最优决策' }], '答案：DP 而非贪心');
        M.code(ctx, [
          ['F(y1,y2,y3,y4,y5)  // 还有 yi 种书剩 i 本', TXT],
          ['  = min over k∈{5,4,3,2,1}:', AMBER],
          ['    k 种组的折后价', TEAL],
          ['  + F(减去这 k 本后的状态)', TEAL]
        ], 46, 52, { size: 12, gap: 22 });
        H.circle(ctx, 150, 180, 22, '#273469', TEAL);
        H.txt(ctx, '状态', 150, 180, { size: 11, bold: true });
        [0, 1, 2].forEach(function (i2) {
          var x2 = 250 + i2 * 70, y2 = 160 + (i2 === 1 ? 40 : 0);
          H.line(ctx, 172, 180, x2 - 18, y2, 'rgba(148,163,184,.4)', 1.5);
          H.circle(ctx, x2, y2, 18, i2 === 1 ? '#1e3a34' : '#273469', i2 === 1 ? GREEN : '#39437a');
          H.mono(ctx, ['5 本', '4 本', '3 本'][i2], x2, y2, { size: 9.5, bold: true, color: i2 === 1 ? GREEN : DIM });
        });
        H.txt(ctx, '每步枚举组大小 k，取"本组折后价 + 子问题最优"最小者', 46, 240, { size: 11.5, color: DIM, align: 'left' });
        H.txt(ctx, '状态数 = 各剩余本数组合数（可记忆化），远小于全排列', 46, 262, { size: 11.5, color: DIM, align: 'left' });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['贪心不总最优（5+3 翻车）', RED, true], ['DP 按状态全局权衡 ✓', GREEN, true]] },
          { t: '复杂度', rows: [['贪心：O(n) 但可能错', DIM], ['DP：状态×5 转移，正确', TXT, true]] }
        ], 372, 60);
      } }
    ] } });

  /* m4 · 快速找出故障机器 */
  D({ g: g, no: 4, title: '快速找出故障机器', e: 'board', strat: '编码·一次称重',
    plain: 'N 台机器里有一台出了故障，它造的产品每件 9 克（正常 10 克）。用一台能读数的秤，最少称几次找出它？逐台称要 N−1 次；聪明的办法是把"机器编号"编码进重量：从第 k 台取 k 件，全部一起称一次，比标准重量少了几克，故障机就是第几台。',
    p: { steps: [
      { cap: '10 台机器，其中 1 台故障（产品 9 克/件，正常 10 克/件），秤能显示读数', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: '#3b55a6', txt: '正常机器' }, { sw: 'dot', color: RED, txt: '故障机（未知哪台）' }], '目标：称量次数最少');
        for (var i = 0; i < 10; i++) {
          var x = 46 + (i % 5) * 62, y = 56 + Math.floor(i / 5) * 74;
          ctx.fillStyle = '#273469'; H.rr(ctx, x, y, 54, 60, 6); ctx.fill();
          ctx.strokeStyle = '#39437a'; ctx.lineWidth = 1.2; H.rr(ctx, x, y, 54, 60, 6); ctx.stroke();
          H.mono(ctx, 'M' + (i + 1), x + 27, y + 22, { size: 13, bold: true, color: TEAL });
          H.txt(ctx, '?', x + 27, y + 44, { size: 12, color: FAINT });
        }
        M.note(ctx, [
          { t: '已知', rows: [['正常产品 10 克/件', TXT], ['故障机产品 9 克/件', TXT], ['故障机只有 1 台', DIM]] },
          { t: '工具', c: AMBER, rows: [['一台可读数的秤', TXT, true], ['（不是天平！能看克数）', DIM]] }
        ], 372, 56);
      } },
      { cap: '笨办法：一台一台称 —— 最坏要称 9 次才能锁定故障机', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: RED, txt: '逐台排查' }], '最坏 9 次');
        for (var i = 0; i < 9; i++) {
          var y = 48 + i * 24;
          H.mono(ctx, '第 ' + (i + 1) + ' 次：称 M' + (i + 1), 130, y, { size: 11, color: i === 8 ? GREEN : DIM, align: 'left' });
          H.txt(ctx, i === 8 ? '← 最坏到第 9 台才找到' : '10 克 → 正常，排除', 290, y, { size: 10.5, color: i === 8 ? GREEN : FAINT, align: 'left' });
        }
        M.note(ctx, [
          { t: '逐台称', c: RED, rows: [['前 9 台都正常 → 第 10 台故障', DIM], ['最坏 9 次称量', RED, true]] },
          { t: '能 1 次吗？', c: AMBER, rows: [['关键：让每次称重', DIM], ['带上"编号信息"', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '编码法：从第 k 台取 k 件产品（共 1+2+…+10 = 55 件）一起放上秤', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '取出 k 件' }], '只称 1 次');
        for (var i = 0; i < 10; i++) {
          var x = 46 + (i % 5) * 62, y = 50 + Math.floor(i / 5) * 88;
          ctx.fillStyle = '#273469'; H.rr(ctx, x, y, 54, 44, 6); ctx.fill();
          H.mono(ctx, 'M' + (i + 1), x + 27, y + 14, { size: 11, bold: true, color: TEAL });
          H.txt(ctx, '取 ' + (i + 1) + ' 件', x + 27, y + 32, { size: 10, bold: true, color: AMBER });
        }
        /* 秤 */
        ctx.fillStyle = '#12244a'; H.rr(ctx, 90, 240, 200, 46, 8); ctx.fill();
        ctx.strokeStyle = TEAL; ctx.lineWidth = 1.5; H.rr(ctx, 90, 240, 200, 46, 8); ctx.stroke();
        H.mono(ctx, '55 件一起称 → 读数 R', 190, 263, { size: 12, bold: true, color: GREEN });
        M.note(ctx, [
          { t: '编码思想', c: TEAL, rows: [['第 k 台贡献 k 件', TXT, true], ['若 M3 故障 → 恰少 3 克', TXT], ['重量差 = 机器编号', AMBER, true]] },
          { t: '标准重', rows: [['1+2+…+10 = 55 件', DIM], ['全正常应重 550 克', DIM]] }
        ], 372, 56);
      } },
      { cap: '答案：称 1 次。少 d 克 → 第 d 台故障（每件轻 1 克，第 d 台恰好贡献 d 件）✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '1 次定位' }], '答案：1 次');
        M.code(ctx, [
          ['取件：M1→1, M2→2, …, M10→10', TXT],
          ['全正常：55 件 × 10 克 = 550 克', DIM],
          ['实际读数 R = 550 − d', AMBER],
          ['故障机 = 第 d 台 ✓', GREEN]
        ], 46, 56, { size: 13, gap: 26 });
        /* 示例：M7 故障 */
        H.txt(ctx, '示例：若 M7 故障', 46, 186, { size: 12, bold: true, color: TXT, align: 'left' });
        ctx.fillStyle = '#3d2145'; H.rr(ctx, 46, 200, 280, 44, 8); ctx.fill();
        H.mono(ctx, 'R = 550 − 7 = 543 克 → d = 7 → M7', 186, 222, { size: 12, bold: true, color: RED });
        M.arrow(ctx, 186, 252, 186, 274, GREEN, 2);
        H.txt(ctx, '每台贡献的件数互不相同 → 差值唯一对应编号', 46, 288, { size: 11.5, color: GREEN, align: 'left' });
        M.note(ctx, [
          { t: '答案', c: GREEN, rows: [['只称 1 次', GREEN, true], ['差几克就是第几台', TXT, true]] },
          { t: '推广', rows: [['N 台同理：取 1..N 件', DIM], ['差 d 克 → 第 d 台', DIM], ['（与本站 #11 假币堆同思想）', FAINT]] }
        ], 372, 56);
      } }
    ] } });

  /* m5 · 饮料供货 */
  D({ g: g, no: 5, title: '饮料供货', e: 'board', strat: '动态规划·完全背包',
    plain: '货舱体积 V 有限，每种饮料 i 有体积 vi、幸福度 Hi、最多供货 Bi 瓶，怎么装让总幸福度最大？这是多重背包：DP 状态 f(i, x) = 前 i 种饮料装进体积 x 的最大幸福度，转移时枚举第 i 种装 0..Bi 瓶；若不限瓶数就退化成完全背包，转移更简单。',
    p: { steps: [
      { cap: '例：体积上限 V = 5；饮料 A(体积1,幸福3)、B(体积2,幸福7)、C(体积3,幸福9)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#7dd3fc', txt: 'A' }, { sw: 'box', color: '#a3e635', txt: 'B' }, { sw: 'box', color: '#f0abfc', txt: 'C' }], '目标：幸福度总和最大');
        var rows = [
          ['饮料', '体积 vi', '幸福 Hi', '上限 Bi'],
          ['A', '1', '3', '∞'],
          ['B', '2', '7', '∞'],
          ['C', '3', '9', '∞']
        ];
        rows.forEach(function (rw, r) {
          rw.forEach(function (v, c) {
            var head = r === 0;
            ctx.fillStyle = head ? '#12244a' : (r % 2 ? '#1b2450' : '#161e42');
            H.rr(ctx, 56 + c * 74, 52 + r * 40, 70, 36, 5); ctx.fill();
            H.txt(ctx, v, 56 + c * 74 + 35, 52 + r * 40 + 18, { size: head ? 11 : 13, bold: true, color: head ? DIM : (c === 0 ? ['#7dd3fc', '#a3e635', '#f0abfc'][r - 1] : TXT) });
          });
        });
        M.note(ctx, [
          { t: '约束', c: AMBER, rows: [['总体积 ≤ V = 5', TXT, true], ['每种可无限拿（完全背包）', DIM]] },
          { t: '目标', c: GREEN, rows: [['总幸福度最大', TXT, true], ['装哪些、各装几瓶？', DIM]] }
        ], 372, 60);
      } },
      { cap: 'DP 状态：f(x) = 体积恰好用到 x 时的最大幸福度；对每种饮料枚举"拿或不拿一瓶"', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: 'f(x) 表' }], '状态：体积 → 最大幸福');
        M.code(ctx, [
          ['f(0..V) 初始为 −∞，f(0) = 0', TXT],
          ['for 每种饮料 i:', AMBER],
          ['  for x = vi .. V:      // 正序 = 可重复拿', TEAL],
          ['    f(x) = max(f(x), f(x−vi) + Hi)', GREEN]
        ], 46, 48, { size: 12, gap: 24 });
        H.txt(ctx, '正序扫描 → 同一瓶饮料可被拿多次（完全背包特征）', 46, 168, { size: 11, color: FAINT, align: 'left' });
        H.txt(ctx, '若 01 背包（每种 1 瓶）则要倒序扫描 —— 顺序即语义', 46, 190, { size: 11, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '转移含义', rows: [['体积 x 的最优 =', DIM], ['「不拿 i」f(x)', TXT], ['「拿一瓶 i」f(x−vi)+Hi', TXT], ['两者取大', GREEN, true]] },
          { t: '多重背包', c: AMBER, rows: [['有上限 Bi：再加一维枚举', DIM], ['拿 0..Bi 瓶，或二进制拆分', DIM]] }
        ], 372, 44);
      } },
      { cap: '逐格填表：x=1→3(A)，x=2→7(B)，x=3→9(C)，x=4→14(B+B)，x=5→17(B+B+A)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: '已填' }, { sw: 'box', color: AMBER, txt: '本步' }], '填 f(0..5)');
        var f = [0, 3, 7, 9, 14, 17], how = ['—', 'A', 'B', 'C', 'B+B', 'B+B+A'];
        for (var x = 0; x <= 5; x++) {
          var hl = x === 5;
          ctx.fillStyle = hl ? 'rgba(251,191,36,.16)' : '#1e3a34';
          H.rr(ctx, 46 + x * 56, 56, 52, 64, 6); ctx.fill();
          if (hl) { ctx.strokeStyle = AMBER; ctx.lineWidth = 2.5; H.rr(ctx, 45, 55, 54, 66, 7); ctx.stroke(); }
          H.mono(ctx, 'f(' + x + ')', 46 + x * 56 + 26, 72, { size: 11, color: DIM });
          H.mono(ctx, String(f[x]), 46 + x * 56 + 26, 96, { size: 16, bold: true, color: hl ? AMBER : GREEN });
          H.txt(ctx, how[x], 46 + x * 56 + 26, 136, { size: 10.5, color: FAINT });
        }
        M.code(ctx, [
          ['f(5) 的三个候选：', TXT],
          ['  f(4)+A = 14+3 = 17 ✓', GREEN],
          ['  f(3)+B = 9+7 = 16', DIM],
          ['  f(2)+C = 7+9 = 16', DIM],
          ['max = 17（B+B+A）', GREEN]
        ], 46, 182, { size: 11.5, gap: 21 });
        M.note(ctx, [
          { t: '读表', c: GREEN, rows: [['最优 = max f(0..V)', TXT, true], ['本例 f(5) = 17', GREEN, true], ['方案：B+B+A', DIM]] },
          { t: '回溯方案', rows: [['记录每格由谁转移而来', DIM], ['从 f(V) 倒推即得选法', DIM]] }
        ], 372, 52);
      } },
      { cap: '答案：DP 表 f(V) 即最大幸福度；复杂度 O(种类数 × V × 瓶数上限)，伪多项式 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: 'DP 最优' }], '答案：f(V)');
        M.code(ctx, [
          ['完全背包：O(M × V)', GREEN, true],
          ['多重背包：O(M × V × B) 或二进制拆分', TXT],
          ['  拆成 1,2,4,…,2^k 份 → O(M × V × logB)', TEAL],
          ['贪心按"幸福/体积"排序：不保证最优', RED]
        ], 46, 56, { size: 12.5, gap: 28 });
        H.txt(ctx, '为什么不能按"幸福密度"贪心：密度高的未必能凑满剩余体积，', 46, 196, { size: 11, color: DIM, align: 'left' });
        H.txt(ctx, '留下的零头可能装不进任何瓶子 —— 局部最优 ≠ 全局最优，背包必须 DP', 46, 218, { size: 11, color: RED, align: 'left' });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['背包族必须 DP', GREEN, true], ['密度贪心会漏组合', RED]] },
          { t: '工程映射', rows: [['装柜/带宽分配/预算采购', DIM], ['全是同一张 DP 表', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m6 · 光影切割问题 */
  D({ g: g, no: 6, title: '光影切割问题', e: 'board', strat: '递推·平面分割',
    plain: '舞台上 n 条光线（直线）两两相交且无三线共点，把平面切成几块？每新增一条线，它与前面 k−1 条线有 k−1 个交点，被切成 k 段，每段把原来的一块一分为二 → 块数 +k。于是 R(n) = R(n−1) + n，累加得 R(n) = 1 + n(n+1)/2。若问的是线段交点数，则是 C(n,2) = n(n−1)/2。',
    p: { steps: [
      { cap: '问题：n 条直线（光线）两两相交、无三线共点，把平面分成多少块？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '光线（直线）' }], '目标：块数 R(n)');
        /* 2 条线示意 */
        H.line(ctx, 60, 60, 300, 220, TEAL, 2.5);
        H.line(ctx, 60, 220, 300, 60, TEAL, 2.5);
        H.circle(ctx, 180, 140, 4, AMBER, null);
        H.txt(ctx, 'R(2) = 4 块', 180, 250, { size: 12, bold: true, color: GREEN });
        M.note(ctx, [
          { t: '约定', rows: [['任意两条恰交 1 点', TXT], ['任意三条不共点', TXT], ['直线无限延伸', DIM]] },
          { t: '问', c: AMBER, rows: [['n 条线 → 多少块？', TXT, true], ['找 R(n) 的闭式', DIM]] }
        ], 372, 60);
      } },
      { cap: '递推关键：第 k 条线与前面 k−1 条有 k−1 个交点，自身被切成 k 段', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: '#39437a', txt: '已有 2 条线' }, { sw: 'line', color: AMBER, txt: '第 3 条新线' }, { sw: 'dot', color: RED, txt: '交点' }], '新线被切成 3 段');
        H.line(ctx, 50, 80, 320, 200, '#39437a', 2);
        H.line(ctx, 50, 200, 320, 80, '#39437a', 2);
        H.line(ctx, 40, 110, 330, 170, AMBER, 3);
        H.circle(ctx, 118, 126, 4.5, RED, null);
        H.circle(ctx, 246, 152, 4.5, RED, null);
        H.txt(ctx, '2 个交点 → 新线被切成 3 段 → 块数 +3', 185, 284, { size: 12, bold: true, color: AMBER });
        M.note(ctx, [
          { t: '每一段的作用', c: TEAL, rows: [['把穿过的那一块', TXT], ['一分为二 → 块数 +1', TXT, true]] },
          { t: '所以', c: AMBER, rows: [['k−1 个交点 → 切成 k 段', TXT], ['块数 +k', AMBER, true], ['R(k) = R(k−1) + k', GREEN, true]] }
        ], 372, 60);
      } },
      { cap: '逐条加线看块数：R(1)=2 → R(2)=4 → R(3)=7 → R(4)=11（每次 +k）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: 'R(n)' }], '递推：+2, +3, +4 …');
        var R = [1, 2, 4, 7, 11];
        for (var n = 0; n <= 4; n++) {
          var x = 46 + n * 62;
          ctx.fillStyle = n === 4 ? 'rgba(251,191,36,.16)' : '#1e3a34';
          H.rr(ctx, x, 60, 56, 56, 6); ctx.fill();
          H.mono(ctx, 'n=' + n, x + 28, 76, { size: 10.5, color: DIM });
          H.mono(ctx, String(R[n]), x + 28, 98, { size: 17, bold: true, color: n === 4 ? AMBER : GREEN });
          if (n > 0) M.arrow(ctx, x - 24, 88, x - 4, 88, '#39437a', 2);
          if (n > 0) H.mono(ctx, '+' + n, x - 14, 74, { size: 9.5, color: FAINT });
        }
        M.code(ctx, [
          ['R(n) = 1 + (1+2+…+n)', TXT],
          ['     = 1 + n(n+1)/2', GREEN, true],
          ['验证：n=4 → 1+10 = 11 ✓', DIM]
        ], 56, 168, { size: 13, gap: 24 });
        M.note(ctx, [
          { t: '闭式', c: GREEN, rows: [['R(n) = 1 + n(n+1)/2', GREEN, true], ['O(1) 直接算', DIM]] },
          { t: '姊妹题', c: AMBER, rows: [['n 条线段最多几个交点？', TXT], ['C(n,2) = n(n−1)/2', TXT, true], ['（每两条贡献 1 个交点）', DIM]] }
        ], 372, 56);
      } },
      { cap: '答案：R(n) = 1 + n(n+1)/2；交点数最多 C(n,2) —— 都是 O(1) 闭式 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '闭式解' }], '答案：O(1)');
        M.code(ctx, [
          ['块数：R(n) = 1 + n(n+1)/2', GREEN, true],
          ['交点：C(n,2) = n(n−1)/2', TEAL, true],
          ['', '#000'],
          ['朴素模拟：逐条画线数块 → O(n²) 还要处理精度', RED],
          ['递推闭式：一行公式 → O(1)', GREEN]
        ], 46, 64, { size: 13, gap: 26 });
        /* 迷你增长曲线 */
        M.chart(ctx, { x: 76, y: 210, w: 220, h: 70,
          series: [{ pts: [[0, 0], [0.25, 3 / 11], [0.5, 7 / 15], [0.75, 11 / 15], [1, 1]], color: TEAL, lw: 2, dots: true }],
          xlab: [[0, 0, 'n=0'], [0.5, 0, 'n=2'], [1, 0, 'n=4']] });
        M.note(ctx, [
          { t: '要点', c: TEAL, rows: [['增量分析：第 k 条贡献 +k', TXT, true], ['累加即得二次闭式', DIM]] },
          { t: '同款', rows: [['与本站概览 o10 切馅饼同源', DIM], ['（直线分平面）', FAINT]] }
        ], 372, 60);
      } }
    ] } });

  /* m7 · 小飞的电梯调度算法 */
  D({ g: g, no: 7, title: '小飞的电梯调度算法', e: 'board', strat: '中位数·逐层递推',
    plain: '电梯从 1 层出发载着所有人上行，停在某一层 k 让大家下电梯后各自爬楼梯到目标层，停在哪层让所有人爬的楼层总和最少？逐层算代价要 O(N²)；其实代价函数是凸的：从 k 层改停 k+1 层，k 层及以下的人多爬 1 层、k+1 层及以上的人少爬 1 层 —— 当"上面的人数 ≥ 下面的人数"时继续上行不会更差，最优层就是人数分布的"中位层"。',
    p: { steps: [
      { cap: '楼有 N 层，电梯只停一次（第 k 层），所有人从 k 层爬楼梯到各自目标层', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: '#7dd3fc', txt: '乘客目标层' }, { sw: 'box', color: AMBER, txt: '停靠层 k' }], '目标：爬楼总和最小');
        /* 楼层条 */
        var ppl = [0, 1, 2, 3, 1, 2, 1]; /* 1..7 层人数（1 层上电梯） */
        for (var f = 7; f >= 2; f--) {
          var y = 44 + (7 - f) * 32;
          H.txt(ctx, f + 'F', 40, y + 12, { size: 11, color: DIM, align: 'right' });
          H.line(ctx, 52, y + 24, 300, y + 24, 'rgba(148,163,184,.15)', 1);
          for (var i = 0; i < ppl[f - 1]; i++) {
            H.circle(ctx, 66 + i * 26, y + 12, 9, '#123252', '#7dd3fc');
            H.txt(ctx, '人', 66 + i * 26, y + 12, { size: 8, color: '#7dd3fc' });
          }
          H.mono(ctx, ppl[f - 1] + ' 人', 286, y + 12, { size: 10.5, color: FAINT });
        }
        H.txt(ctx, '1F 电梯出发', 40, 232, { size: 11, bold: true, color: TEAL, align: 'left' });
        M.note(ctx, [
          { t: '规则', rows: [['电梯上行只停 1 次', TXT, true], ['下电梯后走楼梯', DIM], ['爬 1 层 = 1 单位代价', DIM]] },
          { t: '问', c: AMBER, rows: [['停哪层总代价最小？', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '朴素：对每个 k 逐人累加 |目标层 − k|，O(N²) —— 本例算出 k=4 时总和最小', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: '代价 C(k)' }, { sw: 'box', color: AMBER, txt: '最小' }], '逐层硬算');
        var C = { 2: 12, 3: 8, 4: 7, 5: 8, 6: 11, 7: 16 };
        Object.keys(C).forEach(function (k, i2) {
          var x = 46 + i2 * 52;
          var best = C[k] === 7;
          ctx.fillStyle = best ? 'rgba(251,191,36,.16)' : '#1e3a34';
          H.rr(ctx, x, 60, 48, 60, 6); ctx.fill();
          if (best) { ctx.strokeStyle = AMBER; ctx.lineWidth = 2.5; H.rr(ctx, x - 1, 59, 50, 62, 7); ctx.stroke(); }
          H.mono(ctx, 'k=' + k, x + 24, 76, { size: 10.5, color: DIM });
          H.mono(ctx, String(C[k]), x + 24, 100, { size: 16, bold: true, color: best ? AMBER : TXT });
        });
        M.code(ctx, [
          ['C(k) = Σ 人数[f] × |f − k|', TXT],
          ['对 k=2..7 逐个算 → 取最小', DIM],
          ['本例 C(4) = 7 最小 ✓', GREEN]
        ], 56, 164, { size: 12.5, gap: 24 });
        M.note(ctx, [
          { t: '复杂度', c: RED, rows: [['每层都要扫一遍人数', DIM], ['O(N²)（人多楼高就慢）', RED, true]] },
          { t: '观察', c: TEAL, rows: [['C(k) 是先降后升的凸函数', TXT, true], ['最优点在"人数中位"处', DIM]] }
        ], 372, 56);
      } },
      { cap: '增量分析：停靠从 k 改到 k+1 —— 下面的人各多爬 1 层，上面的人各少爬 1 层', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#123252', txt: 'k 及以下' }, { sw: 'box', color: '#1e3a34', txt: 'k+1 及以上' }], '代价变化 = 下 − 上');
        /* 楼层分界示意 */
        for (var f = 7; f >= 2; f--) {
          var y = 44 + (7 - f) * 30, up = f >= 5;
          ctx.fillStyle = up ? '#1e3a34' : '#123252';
          H.rr(ctx, 60, y, 220, 26, 5); ctx.fill();
          H.txt(ctx, f + 'F', 44, y + 13, { size: 10.5, color: DIM, align: 'right' });
          H.txt(ctx, up ? '−1 层/人' : '+1 层/人', 268, y + 13, { size: 10, bold: true, color: up ? GREEN : RED, align: 'right' });
        }
        H.line(ctx, 60, 44 + 3 * 30 - 2, 280, 44 + 3 * 30 - 2, AMBER, 2);
        H.txt(ctx, 'k=4 → k=5 的分界', 300, 132, { size: 10.5, bold: true, color: AMBER, align: 'left' });
        M.code(ctx, [['ΔC = (k 及以下人数) − (k+1 及以上人数)', TXT], ['ΔC < 0 → 上行更好；ΔC ≥ 0 → 停住', GREEN]], 46, 246, { size: 12, gap: 22 });
        M.note(ctx, [
          { t: '判定', c: AMBER, rows: [['下面人多 → 该上行', TXT], ['上面人多 → 该停/下行', TXT], ['平衡点 = 中位层', GREEN, true]] },
          { t: '复杂度', c: TEAL, rows: [['人数前缀和预处理 O(N)', DIM], ['扫描一次 O(N) 找平衡', DIM]] }
        ], 372, 56);
      } },
      { cap: '答案：最优停靠层 = 人数分布的中位层；O(N) 一次扫描即可，无需逐层硬算 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: 'O(N) 中位层' }], '答案：中位层');
        M.code(ctx, [
          ['nBelow = 0, nAbove = 总人数', TXT],
          ['k = 2', TXT],
          ['while (nAbove > nBelow):   // 上行还能变好', AMBER],
          ['  nBelow += 人数[k]; nAbove −= 人数[k]; k++', TXT],
          ['最优层 = k', GREEN]
        ], 46, 56, { size: 12.5, gap: 26 });
        H.txt(ctx, '本例：人数 1,2,3,1,2,1（2..7 层），总 10 人；k=3 时下 3 上 7 仍该上，k=4 时下 6 上 4 → 停 4F ✓', 46, 216, { size: 11, color: TXT, align: 'left' });
        H.txt(ctx, '与"柠檬水摊选址"（本站概览 o13）同为中位数模型', 46, 240, { size: 11.5, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['C(k) 凸 → 中位层最优', GREEN, true], ['O(N²) 硬算 → O(N) 扫描', TXT]] },
          { t: '变体', rows: [['两座楼梯/两部电梯时', DIM], ['代价权重变了，模型不变', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m8 · 高效率地安排见面会 */
  D({ g: g, no: 8, title: '高效率地安排见面会', e: 'board', strat: '二部图匹配·回溯',
    plain: 'N 位应聘者，每人给出若干可参加的时间段，要求每人恰好安排一个时间段且互不冲突 —— 这是二部图匹配。朴素做法按顺序硬分配，遇到"某人的所有时段都被占"就死局；正确姿势是回溯：分配失败时让占用者"改嫁"到别的空时段，腾出位置（增广路思想），或者干脆跑一遍匈牙利算法。',
    p: { steps: [
      { cap: '4 位应聘者各报若干可行时段：给每人定一个时段，且两人不能撞在同一时段', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: TEAL, txt: '应聘者' }, { sw: 'dot', color: AMBER, txt: '时间段' }, { sw: 'line', color: '#39437a', txt: '可行' }], '目标：人人有段、段段最多 1 人');
        var P = [[70, 70], [70, 130], [70, 190], [70, 250]], T = [[290, 70], [290, 130], [290, 190], [290, 250]];
        var E = [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [3, 0], [3, 3]];
        E.forEach(function (e) { H.line(ctx, P[e[0]][0] + 16, P[e[0]][1], T[e[1]][0] - 16, T[e[1]][1], '#39437a', 1.5); });
        P.forEach(function (p, i) { H.circle(ctx, p[0], p[1], 16, '#273469', TEAL); H.txt(ctx, 'P' + (i + 1), p[0], p[1], { size: 11, bold: true }); });
        T.forEach(function (t, i) { H.circle(ctx, t[0], t[1], 16, '#12244a', AMBER); H.mono(ctx, 'T' + (i + 1), t[0], t[1], { size: 10, bold: true, color: AMBER }); });
        M.note(ctx, [
          { t: '建模', c: TEAL, rows: [['左：应聘者，右：时间段', TXT], ['可行 = 连一条边', TXT], ['二部图！', AMBER, true]] },
          { t: '要求', rows: [['完美匹配：每人都配上', DIM], ['每段最多 1 人', DIM]] }
        ], 372, 60);
      } },
      { cap: '顺序分配：P1→T1，P2→T2；轮到 P3 想要 T2 —— 被 P2 占了，怎么办？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '已分配' }, { sw: 'line', color: RED, txt: 'P3 想要但被占' }], '冲突：T2 被占');
        var P = [[70, 70], [70, 130], [70, 190], [70, 250]], T = [[290, 70], [290, 130], [290, 190], [290, 250]];
        H.line(ctx, 86, 70, 274, 70, GREEN, 2.5);
        H.line(ctx, 86, 130, 274, 130, GREEN, 2.5);
        H.line(ctx, 86, 190, 274, 130, RED, 2.5);
        H.txt(ctx, '✗', 180, 152, { size: 14, bold: true, color: RED });
        P.forEach(function (p, i) { H.circle(ctx, p[0], p[1], 16, i === 2 ? '#3d2145' : '#273469', i === 2 ? RED : TEAL); H.txt(ctx, 'P' + (i + 1), p[0], p[1], { size: 11, bold: true }); });
        T.forEach(function (t, i) { H.circle(ctx, t[0], t[1], 16, '#12244a', AMBER); H.mono(ctx, 'T' + (i + 1), t[0], t[1], { size: 10, bold: true, color: AMBER }); });
        H.txt(ctx, 'P3 可行段 {T2,T3}；它先看 T2 → 被 P2 占用', 46, 288, { size: 11.5, color: RED, align: 'left' });
        M.note(ctx, [
          { t: '现状', c: RED, rows: [['P1→T1 ✓  P2→T2 ✓', TXT], ['P3 想要的 T2 被占', RED, true]] },
          { t: '关键问法', c: AMBER, rows: [['占用者 P2 能不能', TXT], ['挪到别的空段去？', TXT, true], ['→ 递归问 P2', DIM]] }
        ], 372, 60);
      } },
      { cap: '增广路 DFS：问 P2 能否改嫁 → P2 还有边到 T3（空闲）→ 找到增广路 P3–T2–P2–T3', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '现有匹配' }, { sw: 'line', color: AMBER, txt: '增广路' }], '交替路：未匹→已匹→未匹');
        var P = [[70, 70], [70, 130], [70, 190], [70, 250]], T = [[290, 70], [290, 130], [290, 190], [290, 250]];
        H.line(ctx, 86, 70, 274, 70, GREEN, 2.5);
        H.line(ctx, 86, 130, 274, 130, GREEN, 2.5);
        /* 增广路：P3 -T2(未匹配边)- P2 -T3(未匹配边) */
        ctx.strokeStyle = AMBER; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(86, 190); ctx.lineTo(274, 130); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(86, 130); ctx.lineTo(274, 190); ctx.stroke();
        ctx.setLineDash([]);
        P.forEach(function (p, i) { H.circle(ctx, p[0], p[1], 16, i === 2 || i === 1 ? '#1e3a34' : '#273469', i === 2 || i === 1 ? AMBER : TEAL); H.txt(ctx, 'P' + (i + 1), p[0], p[1], { size: 11, bold: true }); });
        T.forEach(function (t, i) { H.circle(ctx, t[0], t[1], 16, '#12244a', i === 2 ? AMBER : AMBER); H.mono(ctx, 'T' + (i + 1), t[0], t[1], { size: 10, bold: true, color: AMBER }); });
        H.txt(ctx, '增广路：P3 →T2（未匹）→ P2 →T3（未匹，空闲）', 46, 288, { size: 11.5, bold: true, color: AMBER, align: 'left' });
        M.note(ctx, [
          { t: '增广路', c: AMBER, rows: [['从未匹配点 P3 出发', TXT], ['未匹边→已匹边交替走', TXT, true], ['终点 T3 空闲', TXT]] },
          { t: '翻转操作', c: GREEN, rows: [['沿路把边"匹↔未匹"互换', TXT], ['匹配数净增 1 ✓', GREEN, true]] }
        ], 372, 60);
      } },
      { cap: '沿增广路翻转：P2 改到 T3、P3 拿 T2 —— 匹配数 +1，P4→T4 收尾，全员安排完毕 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '最终匹配' }], '翻转后：完美匹配');
        var P = [[70, 70], [70, 130], [70, 190], [70, 250]], T = [[290, 70], [290, 130], [290, 190], [290, 250]];
        H.line(ctx, 86, 70, 274, 70, GREEN, 2.5);
        H.line(ctx, 86, 130, 274, 190, GREEN, 2.5);
        H.line(ctx, 86, 190, 274, 130, GREEN, 2.5);
        H.line(ctx, 86, 250, 274, 250, GREEN, 2.5);
        P.forEach(function (p, i) { H.circle(ctx, p[0], p[1], 16, '#1e3a34', TEAL); H.txt(ctx, 'P' + (i + 1), p[0], p[1], { size: 11, bold: true }); });
        T.forEach(function (t, i) { H.circle(ctx, t[0], t[1], 16, '#12244a', AMBER); H.mono(ctx, 'T' + (i + 1), t[0], t[1], { size: 10, bold: true, color: AMBER }); });
        H.txt(ctx, 'P1→T1  P2→T3  P3→T2  P4→T4 ✓', 180, 288, { size: 12, bold: true, color: GREEN });
        M.note(ctx, [
          { t: '结果', c: GREEN, rows: [['4 人全部安排、零冲突', GREEN, true], ['翻转只动了 P2/P3 两条边', DIM]] },
          { t: '这就是', rows: [['匈牙利算法的核心操作', TXT, true], ['逐人找增广路直到配满', DIM]] }
        ], 372, 60);
      } },
      { cap: '答案：跑匈牙利算法（逐人找增广路），O(V×E) 得到最大匹配；能配满即安排成功 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '匹配边' }], '答案：匈牙利算法');
        M.code(ctx, [
          ['for 每位应聘者 P:', AMBER],
          ['  尝试给 P 找一条增广路：', TXT],
          ['    DFS 遍历 P 的可行时段 T', TEAL],
          ['    T 空闲 → 直接配上', GREEN],
          ['    T 被占 → 递归让占用者改嫁', TEAL],
          ['全部配上 → 安排成功 ✓', GREEN]
        ], 46, 52, { size: 12.5, gap: 25 });
        H.txt(ctx, '最坏 O(N×E)：每人一次 DFS，每条边至多被扫常数次', 46, 232, { size: 11.5, color: DIM, align: 'left' });
        H.txt(ctx, '贪心/顺序分配无回溯 → 可能漏掉可行解', 46, 254, { size: 11.5, color: RED, align: 'left' });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['安排见面会 = 二部图匹配', TXT, true], ['匈牙利算法 O(V×E)', GREEN, true]] },
          { t: '同款问题', rows: [['任务↔机器、课↔教室', DIM], ['简历↔面试槽位', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m9 · 双线程高效下载 */
  D({ g: g, no: 9, title: '双线程高效下载', e: 'board', strat: '动态规划·均分',
    plain: 'n 个文件、两个下载线程，文件必须整个下完，怎么分配让两个线程几乎同时收工（总耗时 = 较忙线程的耗时最小）？等价于把数组分成两组使和之差最小 —— 子集和 DP：f(i, s) = 前 i 个文件能否让 A 线程恰好背 s 的耗时；在 s ≤ 总和/2 里找可达的最大 s，即最均衡的分法。',
    p: { steps: [
      { cap: '5 个文件耗时 [2,5,3,4,1]，两个线程分头下载；总耗时 = 较慢线程的耗时', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '线程 A' }, { sw: 'box', color: AMBER, txt: '线程 B' }], '目标：两线程同时收工');
        M.chips(ctx, [2, 5, 3, 4, 1], { x: 56, y: 66, tw: 46, th: 46, labels: ['f1', 'f2', 'f3', 'f4', 'f5'] });
        H.txt(ctx, '文件耗时（分钟）', 56, 48, { size: 11, color: DIM, align: 'left' });
        H.txt(ctx, '总和 = 15 → 理想情况每线程 7.5，实际取整 → 最优 8', 56, 156, { size: 11.5, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '规则', rows: [['文件不可切开', TXT, true], ['两线程并行下载', DIM]] },
          { t: '目标', c: GREEN, rows: [['min max(A 和, B 和)', GREEN, true], ['= 两组和之差最小', DIM]] }
        ], 372, 60);
      } },
      { cap: 'DP：f(s) = A 线程能否恰好背出耗时和 s（可达性背包）；B 拿剩下的', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: 'f 表' }], '子集和可达性');
        M.code(ctx, [
          ['f(0) = true，其余 false', TXT],
          ['for 每个文件 t:          // 01 背包，倒序', AMBER],
          ['  for s = sum/2  downto  t:', TEAL],
          ['    f(s) |= f(s − t)', GREEN]
        ], 46, 48, { size: 12, gap: 24 });
        H.txt(ctx, '扫完后从 ⌊sum/2⌋ = 7 往下找第一个 f(s) = true 的 s', 46, 168, { size: 11.5, color: TXT, align: 'left' });
        H.txt(ctx, 'A 背 s，B 背 sum − s，差 = |sum − 2s| 最小', 46, 190, { size: 11.5, color: DIM, align: 'left' });
        M.note(ctx, [
          { t: '为什么倒序', c: AMBER, rows: [['每个文件只能用一次', TXT], ['倒序防止本轮重复选', TXT, true], ['（01 背包标准写法）', DIM]] },
          { t: '范围', rows: [['s 只需扫到 sum/2', DIM], ['另一半对称', DIM]] }
        ], 372, 48);
      } },
      { cap: '填表示意：依次放入 2,5,3,4,1 —— 可达和集合不断扩大', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: '可达 s' }, { sw: 'box', color: AMBER, txt: '本步新增' }], 'f 表逐轮扩张');
        var stages = [
          { lab: '放入 2', set: [0, 2] },
          { lab: '放入 5', set: [0, 2, 5, 7] },
          { lab: '放入 3', set: [0, 2, 3, 5, 7] },
          { lab: '放入 4,1', set: [0, 1, 2, 3, 4, 5, 6, 7] }
        ];
        stages.forEach(function (st, r) {
          H.txt(ctx, st.lab, 96, 60 + r * 48, { size: 11, bold: true, color: DIM, align: 'right' });
          for (var s = 0; s <= 7; s++) {
            var on = st.set.indexOf(s) >= 0;
            var isNew = r > 0 && st.set.indexOf(s) >= 0 && stages[r - 1].set.indexOf(s) < 0;
            ctx.fillStyle = isNew ? 'rgba(251,191,36,.2)' : (on ? '#1e3a34' : '#141a38');
            H.rr(ctx, 110 + s * 30, 44 + r * 48, 26, 30, 4); ctx.fill();
            if (on) H.mono(ctx, String(s), 110 + s * 30 + 13, 59 + r * 48, { size: 10.5, bold: true, color: isNew ? AMBER : GREEN });
          }
        });
        H.txt(ctx, '列 = A 线程耗时和 s（0..7）；亮格 = 可达', 110, 262, { size: 10.5, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '结果', c: GREEN, rows: [['s = 7 可达 ✓', GREEN, true], ['A 背 7，B 背 8', TXT, true], ['差 = 1（最小可能）', DIM]] },
          { t: '一组解', rows: [['A: 2+5 = 7', TXT], ['B: 3+4+1 = 8', TXT]] }
        ], 372, 56);
      } },
      { cap: '答案：A=[2,5]=7，B=[3,4,1]=8，最长 8 分钟收工；DP 复杂度 O(n × sum) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: 'A：7' }, { sw: 'box', color: AMBER, txt: 'B：8' }], '答案：8 分钟');
        /* 两条时间线 */
        function lane(y, items, color, total) {
          var x = 56, unit = 22;
          items.forEach(function (t) {
            ctx.fillStyle = color; H.rr(ctx, x, y, t * unit - 3, 26, 4); ctx.fill();
            H.mono(ctx, String(t), x + (t * unit - 3) / 2, y + 13, { size: 10.5, bold: true, color: '#0b1020' });
            x += t * unit;
          });
          H.mono(ctx, '= ' + total, x + 10, y + 13, { size: 12, bold: true, color: color, align: 'left' });
        }
        H.txt(ctx, 'A', 40, 73, { size: 12, bold: true, color: TEAL, align: 'right' });
        H.txt(ctx, 'B', 40, 121, { size: 12, bold: true, color: AMBER, align: 'right' });
        lane(60, [2, 5], '#2dd4bf', 7);
        lane(108, [3, 4, 1], AMBER, 8);
        H.line(ctx, 56 + 8 * 22, 44, 56 + 8 * 22, 150, GREEN, 2);
        H.txt(ctx, '8 分钟同时收工', 56 + 8 * 22 + 8, 150, { size: 11, bold: true, color: GREEN, align: 'left' });
        M.code(ctx, [
          ['贪心（大文件优先给空闲线程）：不保证最优', RED],
          ['子集和 DP：O(n × sum/2) 精确最优 ✓', GREEN]
        ], 46, 200, { size: 12, gap: 24 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['最优 = 最接近 sum/2 的', TXT], ['可达子集和', TXT, true], ['本例 7 vs 8，差 1 ✓', GREEN]] },
          { t: '同款', rows: [['与本站 #113 等分/分堆问题', DIM], ['同一张可达性 DP 表', DIM]] }
        ], 372, 48);
      } }
    ] } });

  /* m10 · NIM（1）一排石头的游戏 */
  D({ g: g, no: 10, title: 'NIM（1）一排石头', e: 'board', strat: '博弈·必败态',
    plain: '一排 N 个石头，两人轮流取，每次取 1..M 个，取走最后一个的赢。必败态（轮到你必输）恰是 (M+1) 的倍数：你取 k 个，对方就取 M+1−k 个，把倍数关系一直保持到最后。所以 N 不是 (M+1) 倍数时先手必胜——第一步取 N mod (M+1) 个，把必败态丢给对方。',
    p: { steps: [
      { cap: '一排 N=10 个石头，每次取 1..M=3 个，取走最后一个的赢；先手有必胜策略吗？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#3b55a6', txt: '石头' }], '目标：判断先手必胜？');
        M.chips(ctx, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], { x: 46, y: 70, tw: 30, th: 40, txt: function () { return '#3b55a6'; } });
        H.txt(ctx, '共 10 个 · 每轮可取 1~3 个', 196, 52, { size: 11, color: DIM });
        M.note(ctx, [
          { t: '规则', rows: [['轮流取，每次 1..M 个', TXT], ['取走最后一个者胜', TXT, true]] },
          { t: '问', c: AMBER, rows: [['先手必胜还是必败？', TXT, true], ['找出必胜第一步', DIM]] }
        ], 372, 60);
      } },
      { cap: '关键小局面：剩 M+1=4 个且轮到你 → 必败。你取 k，对方取 4−k 正好取完', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '必败态（轮到你）' }], '4 个 = 死局');
        M.chips(ctx, [1, 1, 1, 1], { x: 60, y: 60, tw: 40, th: 46, color: function () { return '#3d2145'; } });
        M.code(ctx, [
          ['你取 k (1..3)：', TXT],
          ['  对方取 4−k (1..3)：', AMBER],
          ['  恰好取完 → 对方赢', RED],
          ['剩 4 的倍数轮到你 = 必败', RED, true]
        ], 60, 150, { size: 12.5, gap: 24 });
        M.note(ctx, [
          { t: '为什么', c: RED, rows: [['你取 k，对方补 4−k', TXT], ['每轮净减 4', TXT, true], ['倍数关系不变', DIM]] },
          { t: '推广', c: AMBER, rows: [['必败态 = (M+1) 的倍数', AMBER, true]] }
        ], 372, 56);
      } },
      { cap: '从 0 递推标记 P(必败)/N(必胜)：能一步走到 P 的是 N，全走到 N 的是 P', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: 'N 必胜' }, { sw: 'box', color: RED, txt: 'P 必败' }], 'P/N 表（M=3）');
        for (var n = 0; n <= 10; n++) {
          var isP = n % 4 === 0;
          ctx.fillStyle = isP ? '#3d2145' : '#1e3a34';
          H.rr(ctx, 46 + n * 30, 60, 26, 44, 5); ctx.fill();
          H.mono(ctx, String(n), 46 + n * 30 + 13, 74, { size: 11, color: DIM });
          H.txt(ctx, isP ? 'P' : 'N', 46 + n * 30 + 13, 92, { size: 14, bold: true, color: isP ? RED : GREEN });
        }
        M.code(ctx, [['P: 0,4,8 …（4 的倍数）', RED], ['N: 其余（可一步走到 P）', GREEN]], 46, 150, { size: 12, gap: 22 });
        M.note(ctx, [
          { t: '递推', c: TEAL, rows: [['0 是 P（无石可取）', TXT], ['能到 P → N', TXT], ['只能到 N → P', TXT]] },
          { t: '结果', c: AMBER, rows: [['P 恰为 (M+1) 倍数', AMBER, true]] }
        ], 372, 56);
      } },
      { cap: '答案：10 不是 4 的倍数 → 先手胜；第一步取 10 mod 4 = 2 个，留 8 给对方，之后每轮凑 4 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '先手策略' }], '答案：先手胜');
        M.code(ctx, [
          ['N % (M+1) != 0 → 先手胜', GREEN, true],
          ['第一步取 N mod (M+1) 个', TXT],
          ['本例：10 mod 4 = 2 → 留 8', AMBER],
          ['之后对方取 k，我取 4−k', TXT],
          ['始终把 4 的倍数留给对方 ✓', GREEN]
        ], 46, 56, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['必败态 = (M+1) 倍数', GREEN, true], ['先手凑倍数即胜', TXT]] },
          { t: '同款', rows: [['巴什博弈 Bash game', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m11 · NIM（2）"拈"游戏分析 */
  D({ g: g, no: 11, title: 'NIM（2）"拈"游戏', e: 'board', strat: '博弈·异或和',
    plain: '多堆石头，每次从某一堆取任意多个（至少 1 个），取走最后一个的赢。Sprague-Grundy 定理给出干净判据：局面必胜当且仅当各堆数量的异或和 ≠ 0。异或为 0 时任何走法都会打破平衡；异或非 0 时总存在一步把它打回 0，把必败态留给对方。',
    p: { steps: [
      { cap: '三堆石头 [3,4,5]：每次从一堆取任意个，取走最后一个的赢；先手必胜吗？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#3b55a6', txt: '石头堆' }], '目标：判断胜负');
        [3, 4, 5].forEach(function (p, i) {
          for (var k = 0; k < p; k++) { ctx.fillStyle = '#273469'; H.rr(ctx, 70 + i * 90, 150 - k * 34, 40, 30, 5); ctx.fill(); }
          H.txt(ctx, '堆' + (i + 1) + ' = ' + p, 90 + i * 90, 176, { size: 12, bold: true, color: TEAL });
        });
        M.note(ctx, [
          { t: '规则', rows: [['每次从一堆取 ≥1 个', TXT], ['取走最后一个者胜', TXT, true]] },
          { t: '问', c: AMBER, rows: [['先手必胜？', TXT, true], ['若胜，第一步怎么取？', DIM]] }
        ], 372, 60);
      } },
      { cap: '判据：各堆异或和 X = 3⊕45 = 011⊕100⊕101 = 010 = 2 ≠ 0 → 先手必胜', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: '二进制' }], '异或和 ≠ 0');
        M.code(ctx, [
          ['  3 = 0 1 1', TXT],
          ['  4 = 1 0 0', TXT],
          ['  5 = 1 0 1', TEAL],
          ['  ⊕ = 0 1 0  = 2', AMBER, true],
          ['X ≠ 0 → 先手必胜', GREEN, true]
        ], 60, 56, { size: 14, gap: 26 });
        M.note(ctx, [
          { t: '异或和', c: TEAL, rows: [['按位不进位加法', TXT], ['X=0 平衡(必败)', TXT, true], ['X≠0 不平衡(必胜)', GREEN]] },
          { t: '直觉', rows: [['把每堆写成二进制', DIM], ['看每列 1 的奇偶', DIM]] }
        ], 372, 56);
      } },
      { cap: '找平衡步：对每堆 p，若 p⊕X < p 则可把 p 取成 p⊕X；3⊕2=1<3 → 把堆1 从 3 取成 1', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '本步取走' }], '把 X 打回 0');
        M.code(ctx, [
          ['X = 2', TXT],
          ['堆1: 32=1 <3 ✓ 取到 1', GREEN],
          ['堆2: 4⊕2=6 >4 ✗', DIM],
          ['堆3: 5⊕2=7 >5 ✗', DIM],
          ['新局面 [1,4,5]: 1⊕4⊕5=0 ✓', AMBER, true]
        ], 56, 56, { size: 12.5, gap: 25 });
        ctx.fillStyle = '#273469'; H.rr(ctx, 70, 150, 40, 30, 5); ctx.fill();
        H.txt(ctx, '堆1→1', 90, 196, { size: 11, bold: true, color: GREEN });
        M.note(ctx, [
          { t: '平衡步', c: AMBER, rows: [['取后异或和归 0', TXT, true], ['把必败态丢给对方', TXT]] },
          { t: '存在性', c: TEAL, rows: [['X≠0 时最高位必有', DIM], ['某堆该位为 1，可减', DIM]] }
        ], 372, 56);
      } },
      { cap: '答案：X≠0 先手胜，策略是每步把异或和打回 0；X=0 的局面任何走法都必败 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '必胜策略' }], '答案：异或判据');
        M.code(ctx, [
          ['X = p1p2⊕…⊕pk', TXT],
          ['X = 0 → 必败（轮到你）', RED, true],
          ['X ≠ 0 → 必胜', GREEN, true],
          ['必胜步：取某堆使 X 归 0', TXT],
          ['对方破坏 → 我再归 0', DIM],
          ['直到取完最后一个 ✓', GREEN]
        ], 46, 52, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['NIM 和 = 异或', GREEN, true], ['Sprague-Grundy 基石', TXT]] },
          { t: '推广', rows: [['任意公平组合游戏', DIM], ['都可算 Grundy 数异或', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m12 · NIM（3）两堆石头的游戏 */
  D({ g: g, no: 12, title: 'NIM（3）两堆石头', e: 'board', strat: '博弈·威佐夫',
    plain: '两堆石头，每次可以从一堆取任意个、或从两堆同时取相同个数，取光者赢。必败态是威佐夫对 (a_k, b_k) = (⌊kφ, ⌊kφ⌋+k)，其中 φ=(1+√5)/2≈1.618 是黄金比（Beatty 定理保证 a、b 恰好不重不漏地覆盖所有正整数）。',
    p: { steps: [
      { cap: '规则：两堆 (a,b)，每次从一堆取任意个、或两堆同取相同个数，取光者胜', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#3b55a6', txt: '两堆' }], '目标：找必败态');
        for (var k = 0; k < 5; k++) { ctx.fillStyle = '#273469'; H.rr(ctx, 80, 150 - k * 30, 40, 26, 5); ctx.fill(); }
        for (var k2 = 0; k2 < 3; k2++) { ctx.fillStyle = '#273469'; H.rr(ctx, 180, 150 - k2 * 30, 40, 26, 5); ctx.fill(); }
        H.txt(ctx, '堆A=5', 100, 176, { size: 11, bold: true, color: TEAL });
        H.txt(ctx, '堆B=3', 200, 176, { size: 11, bold: true, color: TEAL });
        M.code(ctx, [['操作①：从一堆取任意', TXT], ['操作②：两堆同取相同', TXT]], 80, 210, { size: 12, gap: 22 });
        M.note(ctx, [
          { t: '规则', rows: [['两种取法', TXT], ['取光者胜', TXT, true]] },
          { t: '问', c: AMBER, rows: [['哪些 (a,b) 是必败态？', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '小必败态枚举：(0,0),(1,2),(3,5),(4,7),(6,10),(8,13)… 差 b−a 依次 0,1,2,3,4,5', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '必败对' }], '威佐夫对');
        [[0, 0], [1, 2], [3, 5], [4, 7], [6, 10], [8, 13]].forEach(function (pr, i) {
          ctx.fillStyle = '#3d2145'; H.rr(ctx, 46 + i * 56, 60, 50, 50, 6); ctx.fill();
          H.mono(ctx, pr[0] + ',' + pr[1], 46 + i * 56 + 25, 78, { size: 12, bold: true, color: RED });
          H.mono(ctx, '差' + (pr[1] - pr[0]), 46 + i * 56 + 25, 96, { size: 9.5, color: FAINT });
        });
        M.note(ctx, [
          { t: '观察', c: TEAL, rows: [['差 k = b−a 递增', TXT], ['每个正整数恰出现一次', TXT, true]] },
          { t: '猜想', c: AMBER, rows: [['有闭式？', TXT]] }
        ], 372, 56);
      } },
      { cap: '闭式：a_k = ⌊kφ⌋, b_k = a_k + k，φ=(1+√5)/2≈1.618（黄金比，Beatty 定理）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '黄金比' }], '威佐夫闭式');
        M.code(ctx, [
          ['φ = (1+√5)/2 ≈ 1.618', AMBER, true],
          ['a_k = ⌊k·φ⌋', TXT],
          ['b_k = a_k + k', TXT],
          ['k=1: (1,2)  k=2: (3,5)', DIM],
          ['k=3: (4,7)  k=4: (6,10)', DIM],
          ['与枚举完全吻合 ✓', GREEN]
        ], 56, 52, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: 'Beatty', c: TEAL, rows: [['⌊kφ⌋ 与 ⌊kφ²⌋ 两序列', DIM], ['不重不漏覆盖正整数', TXT, true]] },
          { t: '所以', c: AMBER, rows: [['a、b 恰各出现一次', TXT]] }
        ], 372, 56);
      } },
      { cap: '判定：设 a≤b，k=b−a；若 a == ⌊kφ 则必败，否则必胜（可一步走到威佐夫对）✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: 'O(1) 判定' }], '答案：威佐夫判据');
        M.code(ctx, [
          ['设 a ≤ b, k = b − a', TXT],
          ['if a == ⌊k·φ⌋ → 必败', RED, true],
          ['else → 必胜', GREEN, true],
          ['例 (5,8): k=3, ⌊3φ⌋=45 → 必胜', DIM],
          ['例 (4,7): k=3, ⌊3φ⌋=4=4 → 必败', AMBER]
        ], 46, 56, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['威佐夫博弈 Wythoff', GREEN, true], ['黄金比藏在必败态里', TXT]] },
          { t: '复杂度', rows: [['O(1) 直接判定', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m13 · 连连看游戏设计 */
  D({ g: g, no: 13, title: '连连看游戏设计', e: 'board', strat: '搜索·转弯数',
    plain: '连连看：两张相同的牌，若能用一条"转弯不超过 2 次"的折线（只经过空格）连通，就能消除。判定可直接枚举 0 折（直连）、1 折（一个拐角）、2 折（两个拐角）三种情形，或做按转弯数分层的 BFS。',
    p: { steps: [
      { cap: '棋盘上两张相同的牌 A，若能用 ≤2 次转弯、只走空格的折线连通即可消除', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '牌 A' }, { sw: 'box', color: '#182148', txt: '空格' }], '目标：判定能否消除');
        M.grid(ctx, [['', '', 'A', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', 'A', '', '', '']],
          { x: 60, y: 50, cs: 40, checker: true, fill: function (r, c, v) { return v === 'A' ? '#1e3a34' : null; }, txt: function (r, c, v) { return v === 'A' ? TEAL : '#e8ecf8'; } });
        M.note(ctx, [
          { t: '规则', rows: [['路径只走空格', TXT], ['转弯 ≤ 2 次', TXT, true], ['端点是两张同牌', DIM]] },
          { t: '问', c: AMBER, rows: [['这对 A 能消吗？', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '0 折：两牌同行或同列，且中间全空 → 直接连', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '0 折直连' }], '情形①');
        M.grid(ctx, [['', 'A', '', 'A', ''], ['', '', '', '', ''], ['', '', '', '', '']],
          { x: 60, y: 60, cs: 40, checker: true, fill: function (r, c, v) { return v === 'A' ? '#1e3a34' : null; }, txt: function (r, c, v) { return v === 'A' ? TEAL : '#e8ecf8'; } });
        H.line(ctx, 100, 80, 220, 80, GREEN, 3);
        H.txt(ctx, '同行、中间全空 → 0 折可连', 160, 200, { size: 12, bold: true, color: GREEN });
        M.note(ctx, [
          { t: '0 折', c: GREEN, rows: [['同行或同列', TXT], ['中间格全为空', TXT, true]] },
          { t: '检测', rows: [['一条直线扫过去', DIM]] }
        ], 372, 60);
      } },
      { cap: '1 折：存在一个空拐角 C，使 A–C 与 C–A 两段都 0 折可连', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '1 折' }, { sw: 'dot', color: AMBER, txt: '拐角 C' }], '情形②');
        M.grid(ctx, [['A', '', '', ''], ['', '', '', ''], ['', '', '', 'A']],
          { x: 60, y: 60, cs: 40, checker: true, fill: function (r, c, v) { return v === 'A' ? '#1e3a34' : null; }, txt: function (r, c, v) { return v === 'A' ? TEAL : '#e8ecf8'; } });
        H.circle(ctx, 220, 80, 6, AMBER, null);
        H.line(ctx, 80, 80, 220, 80, AMBER, 3);
        H.line(ctx, 220, 80, 220, 160, AMBER, 3);
        H.txt(ctx, '拐角 C 必须为空', 200, 200, { size: 12, bold: true, color: AMBER });
        M.note(ctx, [
          { t: '1 折', c: AMBER, rows: [['枚举拐角 C', TXT], ['C 为空且两段直连', TXT, true]] },
          { t: '拐角数', rows: [['只有 2 个候选', DIM]] }
        ], 372, 60);
      } },
      { cap: '2 折：枚举中间一条"通道线"，两个拐角都空、三段都直连；或按转弯数分层 BFS ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '2 折' }], '情形③ + BFS');
        M.grid(ctx, [['A', '', '', ''], ['', 'X', '', ''], ['', '', '', 'A']],
          { x: 60, y: 60, cs: 40, checker: true, fill: function (r, c, v) { return v === 'A' ? '#1e3a34' : (v === 'X' ? '#3d2145' : null); }, txt: function (r, c, v) { return v === 'A' ? TEAL : (v === 'X' ? RED : '#e8ecf8'); } });
        H.line(ctx, 80, 80, 80, 40, TEAL, 3);
        H.line(ctx, 80, 40, 200, 40, TEAL, 3);
        H.line(ctx, 200, 40, 200, 160, TEAL, 3);
        H.txt(ctx, '绕开障碍 X：走外圈通道，2 折', 160, 200, { size: 12, bold: true, color: TEAL });
        M.note(ctx, [
          { t: '2 折', c: TEAL, rows: [['枚举通道行/列', TXT], ['两拐角空、三段直连', TXT, true]] },
          { t: '通用', c: GREEN, rows: [['BFS 按转弯数分层', GREEN, true], ['≤2 层内到达即可消', DIM]] }
        ], 372, 56);
      } }
    ] } });

  /* m14 · 构造数独 */
  D({ g: g, no: 14, title: '构造数独', e: 'board', strat: '构造·拉丁方',
    plain: '不是解数独，而是"造"一个合法数独盘。基础模板：第 r 行第 c 列填 (3·(r mod 3) + ⌊r/3⌋ + c) mod 9 + 1，可直接得到一个行、列、九宫都不重复的合法解；再施加"保持合法的变换"（带内行/列交换、带交换、数字重命名）即可派生海量不同盘面。',
    p: { steps: [
      { cap: '目标：9×9 盘，每行、每列、每个 3×3 宫都是 1..9 的排列', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#182148', txt: '宫' }], '目标：合法盘面');
        for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
          ctx.fillStyle = (r + c) % 2 ? '#182148' : '#121a3a'; H.rr(ctx, 70 + c * 60, 50 + r * 60, 56, 56, 4); ctx.fill();
          ctx.strokeStyle = '#39437a'; ctx.lineWidth = 1; H.rr(ctx, 70 + c * 60, 50 + r * 60, 56, 56, 4); ctx.stroke();
        }
        H.txt(ctx, '9 宫 × 9 格', 160, 250, { size: 12, color: DIM });
        M.note(ctx, [
          { t: '约束', rows: [['行不重复', TXT], ['列不重复', TXT], ['宫不重复', TXT, true]] },
          { t: '问', c: AMBER, rows: [['如何快速造一个？', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '基础模板：grid[r][c] = (3·(r mod 3) + ⌊r/3⌋ + c) mod 9 + 1，一次填出合法盘', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: '模板填数' }], '公式构造');
        var rows = [];
        for (var r = 0; r < 9; r++) { var row = []; for (var c = 0; c < 9; c++) row.push((3 * (r % 3) + Math.floor(r / 3) + c) % 9 + 1); rows.push(row); }
        M.grid(ctx, rows, { x: 46, y: 40, cs: 26, checker: true, size: 11 });
        M.code(ctx, [['v = (3*(r%3) + r/3 + c) % 9 + 1', AMBER]], 300, 300, { size: 11 });
        M.note(ctx, [
          { t: '模板', c: TEAL, rows: [['按行错位的拉丁方', TXT], ['带内再错开 3', TXT, true]] },
          { t: '效果', c: GREEN, rows: [['一次填满且合法', GREEN, true]] }
        ], 372, 56);
      } },
      { cap: '验证：任取一行/一列/一宫，都是 1..9 的排列（无重复）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '行/列/宫 均合法' }], '验证');
        var rows = [];
        for (var r = 0; r < 9; r++) { var row = []; for (var c = 0; c < 9; c++) row.push((3 * (r % 3) + Math.floor(r / 3) + c) % 9 + 1); rows.push(row); }
        M.grid(ctx, rows, { x: 46, y: 40, cs: 26, checker: true, size: 11, ring: function (r, c) { return r === 2 ? GREEN : (c === 5 ? AMBER : null); } });
        H.txt(ctx, '绿=第3行  黄=第6列  均为 1..9 排列', 160, 300, { size: 11, color: DIM });
        M.note(ctx, [
          { t: '验证', c: GREEN, rows: [['行：排列 ✓', TXT], ['列：排列 ✓', TXT], ['宫：排列 ✓', TXT, true]] },
          { t: '原因', rows: [['公式对 c 是 +1 步进', DIM], ['模 9 不重复', DIM]] }
        ], 372, 56);
      } },
      { cap: '派生：带内行/列交换、带(行带/列带)交换、数字重命名 —— 都保持合法，盘面数天文级 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '保持合法的变换' }], '答案：模板+变换');
        M.code(ctx, [
          ['① 同一行带内交换两行', TXT],
          ['② 同一列带内交换两列', TXT],
          ['③ 交换行带 / 列带', TXT],
          ['④ 数字 1..9 重命名', TXT],
          ['以上都不破坏行/列/宫约束', GREEN, true],
          ['模板 × 变换 → 海量合法盘 ✓', AMBER]
        ], 46, 52, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['构造 ≠ 求解', GREEN, true], ['模板+变换即得', TXT]] },
          { t: '规模', rows: [['合法盘总数 ~6.7×10²¹', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m15 · 24点游戏 */
  D({ g: g, no: 15, title: '24点游戏', e: 'board', strat: '搜索·枚举',
    plain: '给 4 个数，用 +−×÷ 和括号凑出 24。搜索空间 = 4 数全排列 × 运算符组合 × 括号结构（5 种二叉树形状）。实用写法是"两两合并"DFS：每次任取两个数、用一个运算符合成一个数，递归到只剩一个数看是否等于 24。经典难题 [3,3,8,8]：8 ÷ (3 − 8÷3) = 24。',
    p: { steps: [
      { cap: '规则：4 个数各用一次，+−×÷ 与括号凑 24；例 [3,3,8,8]', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#3b55a6', txt: '数字' }], '目标：凑 24');
        M.chips(ctx, [3, 3, 8, 8], { x: 70, y: 70, tw: 50, th: 50 });
        H.txt(ctx, '每个数恰好用一次', 170, 150, { size: 11, color: DIM });
        M.note(ctx, [
          { t: '规则', rows: [['+−×÷ 与括号', TXT], ['每数用一次', TXT, true]] },
          { t: '问', c: AMBER, rows: [['[3,3,8,8] 能凑 24 吗？', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '括号结构 = 5 种二叉树形状（4 个叶子的满二叉树）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: TEAL, txt: '数' }, { sw: 'dot', color: AMBER, txt: '运算符' }], '5 种结合方式');
        [60, 130, 200, 270, 340].forEach(function (x, i) {
          H.circle(ctx, x, 70, 6, AMBER, null);
          [[-14, 26], [14, 26]].forEach(function (b, j) { H.line(ctx, x, 70, x + b[0], 70 + b[1], '#39437a', 1.5); H.circle(ctx, x + b[0], 70 + b[1], 5, j < 2 ? TEAL : AMBER, null); });
          H.mono(ctx, 'T' + (i + 1), x, 120, { size: 10, color: FAINT });
        });
        H.txt(ctx, '4 个叶子 = 4 个数，内部节点 = 运算符', 180, 160, { size: 11, color: DIM });
        M.note(ctx, [
          { t: '结构', c: TEAL, rows: [['5 种二叉树形状', TXT, true], ['= 括号加法语义', DIM]] },
          { t: '规模', c: AMBER, rows: [['4!×4³×5 = 7680', DIM], ['可暴力枚举', DIM]] }
        ], 372, 60);
      } },
      { cap: '两两合并 DFS：任取两数用一个运算符合成新数，递归到剩 1 个数判 ==24', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: '当前数集合' }], '合并式搜索');
        M.code(ctx, [
          ['dfs(S):            // S 为数集合', TXT],
          ['  if |S|==1: return S=={24}', GREEN],
          ['  任取 a,b ∈ S, 任取 op:', AMBER],
          ['    dfs(S−{a,b}+{a op b})', TEAL],
          ['除法注意 b≠0；可用分数避免精度', DIM]
        ], 46, 52, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '优点', c: TEAL, rows: [['自动覆盖所有括号', TXT, true], ['不必显式建树', DIM]] },
          { t: '精度', c: AMBER, rows: [['中间值可能是分数', TXT], ['用有理数或容差', DIM]] }
        ], 372, 56);
      } },
      { cap: '答案：[3,3,8,8] → 8 ÷ (3 − 8÷3) = 8 ÷ (1/3) = 24 ✓（中间出现分数 1/3）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '解' }], '答案：24');
        M.code(ctx, [
          ['8 ÷ 3 = 8/3', TXT],
          ['3 − 8/3 = 1/3', AMBER],
          ['8 ÷ (1/3) = 24 ✓', GREEN, true],
          ['即 8 / (3 - 8/3) = 24', GREEN]
        ], 56, 60, { size: 14, gap: 28 });
        M.note(ctx, [
          { t: '难点', c: AMBER, rows: [['必须用到分数中间值', TXT, true], ['整数思维会漏解', RED]] },
          { t: '结论', c: GREEN, rows: [['DFS 两两合并可解', GREEN, true]] }
        ], 372, 60);
      } }
    ] } });

  /* m16 · 俄罗斯方块游戏 */
  D({ g: g, no: 16, title: '俄罗斯方块游戏', e: 'board', strat: '位运算·掩码',
    plain: '用位运算表示棋盘与方块：每一行是一个整数位掩码（1=有格）；方块是 4×4 的位掩码；碰撞 = 方块掩码 & 棋盘掩码 ≠ 0；落定 = 棋盘行 |= 方块行；消行 = 找出全 1 的行并把它上面的行整体下移。旋转可用位旋转或查表。',
    p: { steps: [
      { cap: '棋盘按行存位掩码：每行一个整数，第 c 位 =1 表示该格有方块', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#273469', txt: '占位=1' }], '行位掩码');
        [0, 0, 0, 10, 14, 7].forEach(function (m, r) {
          for (var c = 0; c < 6; c++) {
            var on = (m >> (5 - c)) & 1;
            ctx.fillStyle = on ? '#273469' : '#121a3a'; H.rr(ctx, 60 + c * 30, 50 + r * 30, 26, 26, 4); ctx.fill();
          }
          H.mono(ctx, '0b' + ('000000' + m.toString(2)).slice(-6), 260, 63 + r * 30, { size: 11, color: TEAL, align: 'left' });
        });
        M.note(ctx, [
          { t: '表示', c: TEAL, rows: [['一行 = 一个整数', TXT, true], ['位 = 列', DIM]] },
          { t: '好处', rows: [['碰撞/合并全是位操作', DIM]] }
        ], 372, 60);
      } },
      { cap: '方块也是位掩码（4×4 窗口）；旋转 = 位旋转或查表', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '方块 T' }], '方块掩码 + 旋转');
        [[1, 0], [0, 1], [1, 1], [2, 1]].forEach(function (cc) { ctx.fillStyle = AMBER; H.rr(ctx, 70 + cc[0] * 30, 60 + cc[1] * 30, 26, 26, 4); ctx.fill(); });
        M.arrow(ctx, 180, 100, 220, 100, TEAL, 2);
        [[1, 0], [1, 1], [1, 2], [2, 1]].forEach(function (cc) { ctx.fillStyle = TEAL; H.rr(ctx, 240 + cc[0] * 30, 60 + cc[1] * 30, 26, 26, 4); ctx.fill(); });
        M.code(ctx, [['rotate: 查表 / 位旋转', TXT], ['mask = Σ 1<<(r*4+c)', DIM]], 70, 180, { size: 12, gap: 22 });
        M.note(ctx, [
          { t: '方块', c: AMBER, rows: [['4×4 窗口位掩码', TXT, true], ['4 个旋转态预计算', DIM]] },
          { t: '旋转', rows: [['(r,c)→(c,3−r)', DIM]] }
        ], 372, 60);
      } },
      { cap: '碰撞与落定：碰撞 = (piece & board) ≠ 0；落定 = board 行 |= piece 行', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: RED, txt: '碰撞' }, { sw: 'line', color: GREEN, txt: '落定 OR' }], '位操作判定');
        M.code(ctx, [
          ['if (piece & board) → 碰撞', RED, true],
          ['else 下移一格继续', DIM],
          ['落定：board[r] |= piece[r]', GREEN, true],
          ['一次 AND / 一次 OR 完成', TXT]
        ], 56, 60, { size: 13, gap: 26 });
        M.note(ctx, [
          { t: '碰撞', c: RED, rows: [['按位与非 0 即重叠', TXT, true]] },
          { t: '落定', c: GREEN, rows: [['按位或并入棋盘', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '消行：row == FULL(全1) 即消掉，把上面的行整体下移 —— 也是位/整行操作 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: '满行' }], '消行');
        [6, 15, 10].forEach(function (m, r) {
          var full = m === 15;
          for (var c = 0; c < 4; c++) {
            var on = (m >> (3 - c)) & 1;
            ctx.fillStyle = full ? '#1e3a34' : (on ? '#273469' : '#121a3a'); H.rr(ctx, 70 + c * 30, 60 + r * 30, 26, 26, 4); ctx.fill();
          }
          if (full) { ctx.strokeStyle = GREEN; ctx.lineWidth = 2; H.rr(ctx, 68, 58 + r * 30, 122, 30, 5); ctx.stroke(); }
        });
        M.code(ctx, [['if (row == FULL) 消行', GREEN, true], ['上方行整体下移', TXT]], 70, 180, { size: 12, gap: 22 });
        M.note(ctx, [
          { t: '消行', c: GREEN, rows: [['整行等值比较', TXT, true], ['O(宽) 判定', DIM]] },
          { t: '结论', c: TEAL, rows: [['位掩码让核心循环', TXT], ['极快且无分支', GREEN, true]] }
        ], 372, 60);
      } }
    ] } });

  /* m17 · 挖雷游戏 */
  D({ g: g, no: 17, title: '挖雷游戏', e: 'board', strat: '模拟·邻域计数',
    plain: '扫雷：每个翻开格上的数字 = 它周围 8 格中的地雷数。生成时先随机布雷，再对每格数邻居填数字。推理有两条基本规则：若某数字周围未开格数 == 数字，则这些未开格全是雷；若数字已被已标记的雷满足，则其余未开格全安全。',
    p: { steps: [
      { cap: '布雷后，每格的数字 = 周围 8 格的地雷数', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '雷' }, { sw: 'box', color: '#182148', txt: '空格' }], '目标：生成数字');
        var mines = [[0, 1], [1, 3], [2, 0], [3, 2]];
        for (var r = 0; r < 4; r++) for (var c = 0; c < 5; c++) {
          var isM = mines.some(function (m) { return m[0] === r && m[1] === c; });
          ctx.fillStyle = isM ? '#3d2145' : ((r + c) % 2 ? '#182148' : '#121a3a'); H.rr(ctx, 60 + c * 40, 50 + r * 40, 36, 36, 4); ctx.fill();
          if (isM) H.txt(ctx, '✱', 60 + c * 40 + 18, 50 + r * 40 + 18, { size: 14, bold: true, color: RED });
        }
        M.note(ctx, [
          { t: '生成', rows: [['随机布雷', TXT], ['每格数 8 邻居', TXT, true]] },
          { t: '数字', c: AMBER, rows: [['= 周围雷数', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '对每格统计 8 邻域雷数，填出数字盘', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '数字' }], '邻域计数');
        var mines = [[0, 1], [1, 3], [2, 0], [3, 2]];
        function cnt(r, c) { var n = 0; for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) { if (!dr && !dc) continue; var rr = r + dr, cc = c + dc; if (mines.some(function (m) { return m[0] === rr && m[1] === cc; })) n++; } return n; }
        for (var r = 0; r < 4; r++) for (var c = 0; c < 5; c++) {
          var isM = mines.some(function (m) { return m[0] === r && m[1] === c; });
          ctx.fillStyle = (r + c) % 2 ? '#182148' : '#121a3a'; H.rr(ctx, 60 + c * 40, 50 + r * 40, 36, 36, 4); ctx.fill();
          if (isM) H.txt(ctx, '✱', 60 + c * 40 + 18, 50 + r * 40 + 18, { size: 14, bold: true, color: RED });
          else { var v = cnt(r, c); if (v) H.txt(ctx, String(v), 60 + c * 40 + 18, 50 + r * 40 + 18, { size: 14, bold: true, color: TEAL }); }
        }
        M.note(ctx, [
          { t: '计数', c: TEAL, rows: [['8 邻域遍历', TXT, true], ['O(格数×8)', DIM]] },
          { t: '边界', rows: [['越界跳过', DIM]] }
        ], 372, 60);
      } },
      { cap: '推理①：某数字 == 周围未开格数 → 这些未开格全是雷', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '必是雷' }], '规则①');
        ctx.fillStyle = '#1e3a34'; H.rr(ctx, 80, 70, 40, 40, 5); ctx.fill();
        H.txt(ctx, '1', 100, 90, { size: 16, bold: true, color: TEAL });
        ctx.fillStyle = '#3d2145'; H.rr(ctx, 140, 70, 40, 40, 5); ctx.fill();
        H.txt(ctx, '雷', 160, 90, { size: 13, bold: true, color: RED });
        H.txt(ctx, '数字 1 周围只有 1 个未开格 → 它必是雷', 160, 140, { size: 12, bold: true, color: RED });
        M.note(ctx, [
          { t: '规则①', c: RED, rows: [['未开格数 == 数字', TXT, true], ['→ 全标雷', RED]] },
          { t: '用途', rows: [['确定雷位', DIM]] }
        ], 372, 60);
      } },
      { cap: '推理②：数字已被已标雷满足 → 其余未开格全安全，可翻开 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: '安全可开' }], '规则②');
        ctx.fillStyle = '#1e3a34'; H.rr(ctx, 80, 70, 40, 40, 5); ctx.fill();
        H.txt(ctx, '1', 100, 90, { size: 16, bold: true, color: TEAL });
        ctx.fillStyle = '#3d2145'; H.rr(ctx, 140, 70, 40, 40, 5); ctx.fill();
        H.txt(ctx, '雷✓', 160, 90, { size: 12, bold: true, color: RED });
        ctx.fillStyle = '#1e3a34'; H.rr(ctx, 200, 70, 40, 40, 5); ctx.fill();
        H.txt(ctx, '开', 220, 90, { size: 13, bold: true, color: GREEN });
        H.txt(ctx, '数字 1 已由 1 个标雷满足 → 其余未开格安全', 180, 140, { size: 12, bold: true, color: GREEN });
        M.note(ctx, [
          { t: '规则②', c: GREEN, rows: [['已标雷数 == 数字', TXT, true], ['→ 其余未开格安全', GREEN]] },
          { t: '结论', c: TEAL, rows: [['两条规则交替推进', TXT], ['即扫雷的基本解法', GREEN, true]] }
        ], 372, 60);
      } }
    ] } });
  /* ============ 第二辑 数字与数组（m18..m38） ============ */

  /* m18 · 求二进制数中 1 的个数 */
  D({ g: g, no: 18, title: '二进制中 1 的个数', e: 'board', strat: '位运算·popcount',
    plain: '统计一个整数二进制表示里 1 的个数。最巧的一招：n & (n−1) 会把最低位的那个 1 抹掉，于是循环 n = n & (n−1) 直到 0，循环次数就是 1 的个数——只跟 1 的个数有关，比逐位右移检查更快。另有查表法与 SWAR 并行法。',
    p: { steps: [
      { cap: 'n = 44 = 0b101100：二进制里有几个 1？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '位=1' }, { sw: 'box', color: '#121a3a', txt: '位=0' }], '目标：popcount(44)');
        for (var b = 5; b >= 0; b--) {
          var bit = (44 >> b) & 1;
          ctx.fillStyle = bit ? '#1e3a34' : '#121a3a'; H.rr(ctx, 60 + (5 - b) * 46, 70, 40, 50, 6); ctx.fill();
          H.mono(ctx, String(bit), 60 + (5 - b) * 46 + 20, 90, { size: 18, bold: true, color: bit ? TEAL : FAINT });
          H.mono(ctx, 'b' + b, 60 + (5 - b) * 46 + 20, 132, { size: 9.5, color: FAINT });
        }
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['44 的二进制有几个 1？', TXT, true]] },
          { t: '肉眼', rows: [['1 0 1 1 0 0 → 3 个？4 个？', DIM], ['需要可靠算法', DIM]] }
        ], 372, 60);
      } },
      { cap: 'n & (n−1) 每次抹掉最低位的 1：44→40→36→32→0，共 4 次 → 4 个 1', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '抹掉最低 1' }], 'n &= n−1');
        var seq = [44, 40, 36, 32, 0];
        seq.forEach(function (v, i) {
          ctx.fillStyle = i === 4 ? '#1e3a34' : '#12244a'; H.rr(ctx, 46 + i * 62, 60, 56, 46, 6); ctx.fill();
          H.mono(ctx, String(v), 46 + i * 62 + 28, 76, { size: 13, bold: true, color: i === 4 ? GREEN : TXT });
          H.mono(ctx, '0b' + ('000000' + v.toString(2)).slice(-6), 46 + i * 62 + 28, 94, { size: 9, color: FAINT });
          if (i < 4) M.arrow(ctx, 46 + i * 62 + 56, 83, 46 + (i + 1) * 62 - 2, 83, AMBER, 2);
        });
        M.code(ctx, [['while (n) { n &= n-1; cnt++; }', GREEN, true], ['循环次数 = 1 的个数 = 4', AMBER]], 46, 150, { size: 12.5, gap: 24 });
        M.note(ctx, [
          { t: '原理', c: TEAL, rows: [['n−1 把最低 1 变 0、', TXT], ['其后 0 全变 1', TXT], ['相与即抹掉该 1', TXT, true]] },
          { t: '次数', c: GREEN, rows: [['= popcount = 4 ✓', GREEN, true]] }
        ], 372, 56);
      } },
      { cap: '复杂度：逐位右移 O(位数)；n&(n−1) O(1的个数)；查表/SWAR 可 O(1) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '更快' }], '方法对比');
        M.bars(ctx, [
          { label: '逐位右移', v: 32, color: RED },
          { label: 'n&(n−1)', v: 4, color: AMBER },
          { label: '查表/SWAR', v: 1, color: GREEN }
        ], { x: 130, y: 60, w: 160, bh: 18, gap: 36, vmax: 32 });
        H.txt(ctx, '最坏操作次数（32 位整数）', 296, 46, { size: 10, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['n&(n−1) 只跟 1 的个数有关', GREEN, true], ['稀疏 1 时极快', DIM]] },
          { t: '延伸', rows: [['查表：拆字节累加', DIM], ['SWAR：并行归并位', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m19 · 不要被阶乘吓倒 */
  D({ g: g, no: 19, title: '不要被阶乘吓倒', e: 'board', strat: '数论·因子计数',
    plain: 'N! 末尾有几个 0？0 来自因子 10=2×5，而因子 2 远比 5 多，所以只需数 5 的个数：⌊N/5⌋+⌊N/25⌋+⌊N/125⌋+…。第二问：N! 的二进制最低位 1 在第几位（末尾几个二进制 0）？等于因子 2 的个数 ⌊N/2⌋+⌊N/4⌋+… = N − popcount(N)。',
    p: { steps: [
      { cap: 'N = 100：100! 末尾有几个 0？直接算 100! 天文数字，不可行', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '末尾 0' }], '目标：数 0 的个数');
        H.txt(ctx, '100! = 933262154439…000000…', 180, 70, { size: 13, bold: true, color: TXT });
        H.txt(ctx, '↑ 9 位数起就爆，不能硬算', 180, 96, { size: 11, color: RED });
        M.code(ctx, [['0 来自 10 = 2 × 5', TXT], ['因子 2 的个数 ≫ 因子 5', DIM], ['→ 只需数因子 5 的个数', AMBER, true]], 60, 140, { size: 12.5, gap: 24 });
        M.note(ctx, [
          { t: '关键', c: TEAL, rows: [['每个 0 = 一对 (2,5)', TXT, true], ['2 充足，5 是瓶颈', TXT]] },
          { t: '问', c: AMBER, rows: [['100! 含几个因子 5？', TXT]] }
        ], 372, 60);
      } },
      { cap: '数 5：⌊100/5⌋=20 个贡献一个 5，⌊100/25⌋=4 个再贡献一个 → 20+4 = 24 个 0', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: '⌊N/5^k⌋' }], 'Legendre 公式');
        M.bars(ctx, [
          { label: '⌊100/5⌋', v: 20, color: TEAL },
          { label: '⌊100/25⌋', v: 4, color: AMBER },
          { label: '⌊100/125⌋', v: 0, color: DIM }
        ], { x: 130, y: 56, w: 150, bh: 18, gap: 34, vmax: 20 });
        M.code(ctx, [['zeros = 20 + 4 + 0 = 24', GREEN, true], ['100! 末尾 24 个 0 ✓', GREEN]], 60, 190, { size: 13, gap: 24 });
        M.note(ctx, [
          { t: '公式', c: TEAL, rows: [['Σ ⌊N/5^k⌋', TXT, true], ['25 的倍数额外多一个 5', DIM]] },
          { t: '结果', c: GREEN, rows: [['24 个 0', GREEN, true]] }
        ], 372, 56);
      } },
      { cap: '二进制最低位 1：末尾二进制 0 的个数 = 因子 2 的个数 = N − popcount(N) = 100−3 = 97 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '因子 2 计数' }], '第二问');
        M.code(ctx, [
          ['二进制末尾 0 数 = Σ⌊N/2^k⌋', TXT],
          ['恒等式：Σ⌊N/2^k⌋ = N − popcount(N)', AMBER, true],
          ['N=100: popcount=3', DIM],
          ['→ 100 − 3 = 97', GREEN, true]
        ], 56, 60, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '恒等式', c: TEAL, rows: [['N 的二进制每借一次位', DIM], ['就少一个 1', TXT, true]] },
          { t: '结论', c: GREEN, rows: [['十进制数 5、二进制数 2', TXT], ['都是 Legendre 公式', GREEN, true]] }
        ], 372, 60);
      } }
    ] } });

  /* m20 · 寻找发帖"水王" */
  D({ g: g, no: 20, title: '寻找发帖"水王"', e: 'board', strat: '投票·抵消',
    plain: '论坛里有一个"水王"发帖数超过总数一半。不必统计全部 ID：Boyer-Moore 投票法维护一个候选与计数，遇到相同 ID 计数 +1、不同 −1，计到 0 就换候选；因为水王过半，"不同 ID 两两抵消"后最后剩下的候选必是水王（再扫一遍验证即可）。O(n) 时间 O(1) 空间。',
    p: { steps: [
      { cap: 'ID 流 [3,3,4,3,5,3,3]：水王（过半者）是谁？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: 'ID' }], '目标：找过半 ID');
        M.chips(ctx, [3, 3, 4, 3, 5, 3, 3], { x: 46, y: 70, tw: 40, th: 44 });
        H.txt(ctx, '共 7 帖，水王 > 3.5 帖', 180, 52, { size: 11, color: DIM });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['哪个 ID 过半？', TXT, true]] },
          { t: '限制', rows: [['希望 O(n) 时间 O(1) 空间', DIM], ['不建哈希表', DIM]] }
        ], 372, 60);
      } },
      { cap: '投票：相同 +1、不同 −1，归 0 换候选 —— 扫完候选 = 3', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '候选' }, { sw: 'box', color: '#12244a', txt: '计数' }], 'Boyer-Moore');
        var trace = [['3', 1], ['3', 2], ['4', 1], ['3', 2], ['5', 1], ['3', 2], ['3', 3]];
        trace.forEach(function (t, i) {
          ctx.fillStyle = '#12244a'; H.rr(ctx, 46 + i * 44, 60, 40, 40, 5); ctx.fill();
          H.txt(ctx, '候' + t[0], 46 + i * 44 + 20, 74, { size: 10.5, color: AMBER });
          H.mono(ctx, '×' + t[1], 46 + i * 44 + 20, 90, { size: 11, bold: true, color: TEAL });
        });
        M.code(ctx, [['if 空或同: cand=id, cnt+1', TXT], ['else cnt−1; 若 0 换候选', AMBER], ['最终 cand = 3', GREEN, true]], 46, 140, { size: 12, gap: 23 });
        M.note(ctx, [
          { t: '过程', c: TEAL, rows: [['3,3 累到 2；4 抵到 1', DIM], ['3 回 2；5 抵到 1', DIM], ['3,3 累到 3', DIM]] },
          { t: '候选', c: GREEN, rows: [['= 3', GREEN, true]] }
        ], 372, 56);
      } },
      { cap: '为什么对：非水王互抵、与水王抵后仍剩水王；再扫一遍计数验证 > n/2 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '验证' }], '抵消直觉');
        M.code(ctx, [
          ['水王 > n/2', TXT],
          ['任何"不同 ID 对消"', DIM],
          ['最多消掉一半非水王', DIM],
          ['水王必有剩余 → 候选=水王', GREEN, true],
          ['再扫一遍计数确认 > n/2', AMBER]
        ], 56, 56, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['O(n) 时间 O(1) 空间', GREEN, true], ['投票+验证两遍', TXT]] },
          { t: '推广', rows: [['>n/3 的元素：两个候选', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m21 · 1 的数目 */
  D({ g: g, no: 21, title: '1 的数目', e: 'board', strat: '数位·按位统计',
    plain: '数 1..N 的所有整数里，数字 1 一共出现多少次？按位统计：对每一位把数拆成 high、cur、low 三段（base 为该位权），cur>1 贡献 (high+1)×base，cur==1 贡献 high×base+low+1，cur<1 贡献 high×base；累加所有位即得，O(位数)。',
    p: { steps: [
      { cap: 'N=12：1..12 里数字 1 出现几次？手工数：1,10,11,12 → 共 5 次', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '含 1 的数' }], '目标：count(1, 12)');
        for (var i = 1; i <= 12; i++) {
          var has = String(i).indexOf('1') >= 0;
          ctx.fillStyle = has ? '#1e3a34' : '#121a3a'; H.rr(ctx, 46 + (i - 1) % 6 * 50, 60 + Math.floor((i - 1) / 6) * 50, 44, 42, 5); ctx.fill();
          H.txt(ctx, String(i), 46 + (i - 1) % 6 * 50 + 22, 81 + Math.floor((i - 1) / 6) * 50, { size: 13, bold: has, color: has ? TEAL : FAINT });
        }
        H.txt(ctx, '1(1次) 10(1) 11(2) 12(1) → 共 5 次', 180, 176, { size: 12, bold: true, color: GREEN });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['大 N 不能逐个数', TXT, true], ['要 O(位数) 公式', DIM]] },
          { t: '验证基准', rows: [['N=12 → 5', DIM]] }
        ], 372, 60);
      } },
      { cap: '按位拆 high/cur/low：该位贡献由 cur 与 1 的大小关系决定', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: 'high' }, { sw: 'box', color: AMBER, txt: 'cur' }, { sw: 'box', color: '#1e3a34', txt: 'low' }], '三段拆分');
        M.code(ctx, [
          ['cur > 1: (high+1) × base', TEAL],
          ['cur = 1: high×base + low + 1', AMBER],
          ['cur < 1: high × base', DIM],
          ['base = 该位权(1,10,100…)', TXT]
        ], 56, 60, { size: 13, gap: 26 });
        M.note(ctx, [
          { t: '直觉', c: TEAL, rows: [['cur>1：该位取 1 时', TXT], ['high 可取 0..high 全行', TXT, true]] },
          { t: 'cur=1', rows: [['low 受限只能 0..low', DIM]] }
        ], 372, 60);
      } },
      { cap: '对 N=12 套公式：个位 (high=1,cur=2)→(1+1)×1=2；十位 (high=0,cur=1)→0×10+2+1=3；合 5 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '公式=手工' }], '验证');
        M.code(ctx, [
          ['个位: base=1, high=1, cur=2, low=0', TXT],
          ['  cur>1 → (1+1)×1 = 2', TEAL],
          ['十位: base=10, high=0, cur=1, low=2', TXT],
          ['  cur=1 → 0×10+2+1 = 3', AMBER],
          ['合计 2+3 = 5 ✓', GREEN, true]
        ], 46, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['与手工数 5 一致', GREEN, true], ['O(位数) 适用大 N', TXT]] },
          { t: '推广', rows: [['数任意数字 d 同理', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m22 · 寻找最大的 K 个数 */
  D({ g: g, no: 22, title: '寻找最大的 K 个数', e: 'board', strat: '堆·快速选择',
    plain: '从 N 个数里找最大的 K 个。方法一：维护一个大小 K 的最小堆，扫一遍，比堆顶大就替换堆顶，O(N log K)，适合海量/流数据。方法二：quickselect（快排分区思想）平均 O(N)。方法三：数值范围小可桶计数。',
    p: { steps: [
      { cap: '数组 [5,9,2,7,8,3]，K=3：最大的 3 个是 9,8,7', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '候选' }], '目标：Top-3');
        M.chips(ctx, [5, 9, 2, 7, 8, 3], { x: 56, y: 70, tw: 44, th: 46 });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['N 很大、K 较小时', TXT], ['如何不全部排序？', TXT, true]] },
          { t: '全排序', c: RED, rows: [['O(N log N) 浪费', RED]] }
        ], 372, 60);
      } },
      { cap: '最小堆 size K：扫到比堆顶大就替换；堆里始终是当前最大的 K 个', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: '堆(≤K)' }, { sw: 'line', color: AMBER, txt: '替换堆顶' }], '流式 Top-K');
        var stages = [[5], [5, 9], [5, 9, 2], [7, 9, 5], [9, 8, 7], [9, 8, 7]];
        stages.forEach(function (st, i) {
          H.mono(ctx, 'i=' + i, 60, 60 + i * 34, { size: 10, color: FAINT, align: 'left' });
          st.forEach(function (v, j) {
            ctx.fillStyle = '#1e3a34'; H.rr(ctx, 110 + j * 40, 46 + i * 34, 34, 28, 4); ctx.fill();
            H.mono(ctx, String(v), 110 + j * 40 + 17, 60 + i * 34, { size: 11, bold: true, color: TEAL });
          });
        });
        M.code(ctx, [['比堆顶大 → 替换并下沉', AMBER], ['否则跳过', DIM]], 260, 200, { size: 11.5, gap: 20 });
        M.note(ctx, [
          { t: '不变量', c: TEAL, rows: [['堆中 = 已扫部分', TXT], ['最大的 K 个', TXT, true]] },
          { t: '复杂度', c: GREEN, rows: [['O(N log K)', GREEN, true], ['适合流/海量', DIM]] }
        ], 372, 56);
      } },
      { cap: 'quickselect：按枢轴分区，只递归含第 K 大的一侧，平均 O(N) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: 'quickselect' }], '方法对比');
        M.bars(ctx, [
          { label: '全排序', v: 100, color: RED },
          { label: '最小堆', v: 60, color: AMBER },
          { label: 'quickselect', v: 30, color: GREEN }
        ], { x: 140, y: 60, w: 150, bh: 18, gap: 36, vmax: 100 });
        H.txt(ctx, '相对耗时（N 大 K 小）', 296, 46, { size: 10, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: 'quickselect', c: GREEN, rows: [['分区后只进一侧', TXT, true], ['平均 O(N)', GREEN, true]] },
          { t: '取舍', rows: [['堆：可流式、稳定', DIM], ['qs：内存内最快', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m23 · 精确表达浮点数 */
  D({ g: g, no: 23, title: '精确表达浮点数', e: 'board', strat: '连分数·有理逼近',
    plain: '浮点数在计算机里不精确。如何用一个"分子分母都不大"的分数在给定误差内表达它？用连分数展开：不断取整数部分、再对小数部分取倒数，得到一串渐近分数 p/q，逐个逼近且在同精度下分母最小。经典如 π ≈ 355/113。',
    p: { steps: [
      { cap: '目标：误差 ε 内，找分母最小的分数 p/q 逼近浮点 x', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '实数 x' }, { sw: 'dot', color: AMBER, txt: '分数 p/q' }], '目标：最简逼近');
        H.line(ctx, 60, 120, 320, 120, TEAL, 2.5);
        H.circle(ctx, 240, 120, 6, AMBER, null);
        H.txt(ctx, 'x', 240, 100, { size: 12, bold: true, color: TEAL });
        H.txt(ctx, 'p/q', 240, 146, { size: 12, bold: true, color: AMBER });
        M.note(ctx, [
          { t: '要求', c: AMBER, rows: [['|x − p/q| ≤ ε', TXT, true], ['q 尽量小', TXT]] },
          { t: '难点', rows: [['浮点二进制不精确', DIM], ['不能直接读十进制', DIM]] }
        ], 372, 60);
      } },
      { cap: '连分数展开：x = a0 + 1/(a1 + 1/(a2+…))；π = [3;7,15,1,…]', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: '系数 aᵢ' }], '连分数');
        M.code(ctx, [
          ['π = 3 + 1/(7 + 1/(15 + 1/1…))', TXT],
          ['记作 [3; 7, 15, 1, …]', AMBER, true],
          ['每次：取整 aᵢ，余下取倒数', DIM]
        ], 56, 60, { size: 13, gap: 26 });
        M.note(ctx, [
          { t: '展开', c: TEAL, rows: [['整数部分 → aᵢ', TXT], ['小数部分取倒数继续', TXT, true]] },
          { t: '渐近分数', rows: [['由 aᵢ 递推 p/q', DIM]] }
        ], 372, 60);
      } },
      { cap: '渐近分数逐个逼近：3 → 22/7 → 333/106 → 355/113（误差 <1e-6 且分母最小）✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '逼近收敛' }], '渐近分数');
        M.chart(ctx, { x: 60, y: 60, w: 240, h: 130, series: [{ pts: [[0, 0.9], [0.33, 0.5], [0.66, 0.15], [1, 0.02]], color: TEAL, lw: 2.5, dots: true }], xlab: [[0, 0, '3'], [0.33, 0, '22/7'], [0.66, 0, '333/106'], [1, 0, '355/113']] });
        H.txt(ctx, '纵：|π − p/q| 迅速下降', 180, 46, { size: 10.5, color: FAINT });
        M.note(ctx, [
          { t: '355/113', c: GREEN, rows: [['误差 ≈ 2.7e-7', TXT, true], ['同精度分母最小', GREEN, true]] },
          { t: '结论', c: TEAL, rows: [['连分数给最优有理逼近', TXT]] }
        ], 372, 56);
      } }
    ] } });

  /* m24 · 最大公约数问题 */
  D({ g: g, no: 24, title: '最大公约数问题', e: 'board', strat: '欧几里得·二进制GCD',
    plain: '求 gcd：辗转相除 gcd(a,b)=gcd(b, a mod b)，简洁但取模贵；更相减损/二进制 GCD（Stein）只用减法和移位：都偶则提公因子 2，一偶一奇去掉偶数的 2，都奇则相减变偶，避免取模，对大整数更友好。',
    p: { steps: [
      { cap: 'gcd(48, 18)：辗转相除 48,18 → 18,12 → 12,6 → 6,0 → 6', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: '(a,b)' }], '欧几里得');
        var st = [[48, 18], [18, 12], [12, 6], [6, 0]];
        st.forEach(function (p, i) {
          ctx.fillStyle = i === 3 ? '#1e3a34' : '#12244a'; H.rr(ctx, 46 + i * 78, 60, 70, 44, 6); ctx.fill();
          H.mono(ctx, p[0] + ',' + p[1], 46 + i * 78 + 35, 82, { size: 13, bold: true, color: i === 3 ? GREEN : TXT });
          if (i < 3) M.arrow(ctx, 46 + i * 78 + 70, 82, 46 + (i + 1) * 78 - 2, 82, AMBER, 2);
        });
        M.code(ctx, [['gcd(a,b) = gcd(b, a mod b)', GREEN, true], ['b=0 时 a 即答案', DIM]], 46, 150, { size: 12.5, gap: 24 });
        M.note(ctx, [
          { t: '辗转相除', c: TEAL, rows: [['每步取模', TXT], ['O(log min(a,b))', TXT, true]] },
          { t: '缺点', c: RED, rows: [['大整数取模贵', RED]] }
        ], 372, 56);
      } },
      { cap: '二进制 GCD（Stein）：都偶提 2、一偶去 2、都奇相减 —— 只用减法与移位', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '移位/相减' }], 'Stein 算法');
        M.code(ctx, [
          ['a,b 都偶: 2*gcd(a/2, b/2)', TEAL],
          ['a 偶 b 奇: gcd(a/2, b)', TEAL],
          ['a 奇 b 偶: gcd(a, b/2)', TEAL],
          ['都奇: gcd(|a−b|, min)', AMBER],
          ['全程无取模', GREEN, true]
        ], 56, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '优点', c: GREEN, rows: [['只减法+移位', TXT, true], ['大整数/无除法器友好', DIM]] },
          { t: '复杂度', rows: [['O(log²) 位操作', DIM]] }
        ], 372, 60);
      } },
      { cap: 'gcd(48,18) 用 Stein：都偶→2·gcd(24,9)→2·gcd(12,9)? 逐步得 6 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '同答案' }], '验证');
        M.code(ctx, [
          ['gcd(48,18) 都偶 → 2·gcd(24,9)', TXT],
          ['24 偶 → 2·gcd(12,9)', TXT],
          ['12 偶 → 2·gcd(6,9)', TXT],
          ['6 偶 → 2·gcd(3,9)', TXT],
          ['都奇 → 2·gcd(3,6)→2·gcd(3,3)', DIM],
          ['= 2·3 = 6 ✓', GREEN, true]
        ], 46, 52, { size: 12, gap: 24 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['两法同得 6', GREEN, true], ['按场景选模/移位', TXT]] },
          { t: '延伸', rows: [['lcm = a/gcd*b', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m25 · 找符合条件的整数 */
  D({ g: g, no: 25, title: '找符合条件的整数', e: 'board', strat: '二分答案·单调判定',
    plain: '找满足某条件的最小整数：若判定函数关于 N 单调（如"N! 末尾 0 的个数 ≥ Q"随 N 不减），就可以"二分答案"——先定上下界，再在整数域二分第一个使判定为真的 N。把"搜索答案"转化为"验证答案"。',
    p: { steps: [
      { cap: '例：找最小 N 使 N! 末尾 0 的个数 ≥ Q（Q=6）；zeros(N) 单调不减', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: 'zeros(N)' }], '目标：最小 N');
        M.chart(ctx, { x: 60, y: 50, w: 240, h: 140, ymax: 8, grid: [0.5, 1], series: [{ pts: [[0, 0], [0.2, 0.12], [0.4, 0.25], [0.6, 0.5], [0.8, 0.62], [1, 0.75]], color: TEAL, lw: 2.5 }], xlab: [[0, 0, 'N=0'], [0.5, 0, 'N=15'], [1, 0, 'N=30']] });
        H.txt(ctx, '阶梯单调：只升不降 → 可二分', 180, 40, { size: 10.5, color: FAINT });
        M.note(ctx, [
          { t: '单调性', c: TEAL, rows: [['zeros(N) 不减', TXT, true], ['满足"≥Q"后一直满足', DIM]] },
          { t: '问', c: AMBER, rows: [['最小 N = ?', TXT, true]] }
        ], 372, 56);
      } },
      { cap: '二分：lo=0, hi=5Q；每次取 mid 验证 zeros(mid)≥Q，收缩区间', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: 'mid' }, { sw: 'box', color: '#1e3a34', txt: '可行域' }], '二分答案');
        M.code(ctx, [
          ['lo=0, hi=30', TXT],
          ['mid=15: zeros=3 <6 → lo=16', DIM],
          ['mid=23: zeros=4 <6 → lo=24', DIM],
          ['mid=27: zeros=6 ≥6 → hi=27', AMBER],
          ['… 收敛到 N=25', GREEN, true]
        ], 56, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '套路', c: TEAL, rows: [['答案单调 → 二分', TXT, true], ['验证 O(log N)', DIM]] },
          { t: '复杂度', c: GREEN, rows: [['O(log(上界) × 验证)', GREEN, true]] }
        ], 372, 56);
      } },
      { cap: '验证：zeros(24)=4 <6，zeros(25)=6 ≥6 → 最小 N=25 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '边界' }], '答案：25');
        M.code(ctx, [
          ['zeros(24) = ⌊24/5⌋ = 4 < 6', RED],
          ['zeros(25) = 5 + 1 = 6 ≥ 6', GREEN, true],
          ['→ 最小 N = 25 ✓', GREEN]
        ], 56, 70, { size: 14, gap: 30 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['二分答案 = 搜索转验证', GREEN, true], ['适用一切单调判定', TXT]] },
          { t: '同款', rows: [['最小容量/最小速度', DIM], ['"最大最小"类问题', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m26 · 斐波那契（Fibonacci）数列 */
  D({ g: g, no: 26, title: '斐波那契数列', e: 'board', strat: '矩阵快速幂',
    plain: 'F(n)=F(n−1)+F(n−2)。朴素递归 O(2^n) 大量重复计算；迭代填表 O(n)；最快是矩阵快速幂：[[1,1],[1,0]]^n 的右上角即 F(n)，用快速幂 O(log n)。也有 Binet 闭式但受浮点精度限制。',
    p: { steps: [
      { cap: '递归树大量重复：算 F(6) 时 F(3) 被算 3 次 → O(2^n)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: RED, txt: '重复子问题' }], '朴素递归爆炸');
        function node(x, y, s, hot) { H.circle(ctx, x, y, 14, hot ? '#3d2145' : '#12244a', hot ? RED : '#39437a'); H.txt(ctx, s, x, y, { size: 10, bold: true, color: hot ? RED : TXT }); }
        node(180, 50, 'F6', false);
        node(120, 90, 'F5', false); node(240, 90, 'F4', false);
        node(80, 130, 'F4', true); node(160, 130, 'F3', true); node(210, 130, 'F3', true); node(280, 130, 'F2', false);
        H.line(ctx, 180, 64, 120, 76, '#39437a', 1.5); H.line(ctx, 180, 64, 240, 76, '#39437a', 1.5);
        H.line(ctx, 120, 104, 80, 116, '#39437a', 1.5); H.line(ctx, 120, 104, 160, 116, '#39437a', 1.5);
        H.line(ctx, 240, 104, 210, 116, '#39437a', 1.5); H.line(ctx, 240, 104, 280, 116, '#39437a', 1.5);
        H.txt(ctx, 'F4、F3 被重复计算', 180, 170, { size: 12, bold: true, color: RED });
        M.note(ctx, [
          { t: '问题', c: RED, rows: [['递归 O(2^n)', RED, true], ['子问题指数重复', DIM]] },
          { t: '出路', c: AMBER, rows: [['记忆化/迭代/矩阵', TXT]] }
        ], 372, 60);
      } },
      { cap: '迭代：只保留前两项滚动填表 O(n)；F: 1,1,2,3,5,8,13,…', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#1e3a34', txt: 'F(i)' }], '迭代 O(n)');
        var F = [1, 1, 2, 3, 5, 8, 13, 21];
        F.forEach(function (v, i) {
          ctx.fillStyle = '#1e3a34'; H.rr(ctx, 46 + i * 40, 60, 36, 44, 5); ctx.fill();
          H.mono(ctx, String(v), 46 + i * 40 + 18, 78, { size: 12, bold: true, color: TEAL });
          H.mono(ctx, 'F' + (i + 1), 46 + i * 40 + 18, 94, { size: 9, color: FAINT });
        });
        M.code(ctx, [['a,b = 1,1; 循环 b,a+b', GREEN, true], ['O(n) 时间 O(1) 空间', DIM]], 46, 150, { size: 12.5, gap: 24 });
        M.note(ctx, [
          { t: '迭代', c: GREEN, rows: [['滚动两个变量', TXT, true], ['O(n)', GREEN, true]] },
          { t: '还能更快？', c: AMBER, rows: [['O(log n) →', AMBER]] }
        ], 372, 56);
      } },
      { cap: '矩阵快速幂：[[1,1],[1,0]]^n 右上角 = F(n)，快速幂 O(log n) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '矩阵幂' }], 'O(log n)');
        M.code(ctx, [
          ['| F(n+1)  F(n)   |   | 1 1 |^n', TXT],
          ['| F(n)    F(n−1) | = | 1 0 |', TXT],
          ['快速幂：平方+乘，O(log n)', AMBER, true],
          ['n=1e18 也只要 ~60 次矩阵乘', GREEN]
        ], 56, 60, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['递归 2^n → 迭代 n', TXT], ['→ 矩阵 log n', GREEN, true]] },
          { t: '闭式', rows: [['Binet 公式有精度限', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m27 · 寻找数组中的最大值和最小值 */
  D({ g: g, no: 27, title: '最大值与最小值', e: 'board', strat: '成对比较',
    plain: '同时找数组的最大值和最小值。朴素各扫一遍要 2n 次比较；成对处理更省：每次取两个数先互比，大的只跟当前 max 比、小的只跟当前 min 比，每两个数只需 3 次比较，共约 1.5n 次。',
    p: { steps: [
      { cap: '数组 [4,9,2,7,5,8]：同时求 max 与 min', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '元素' }], '目标：max & min');
        M.chips(ctx, [4, 9, 2, 7, 5, 8], { x: 56, y: 70, tw: 44, th: 46 });
        M.note(ctx, [
          { t: '朴素', c: RED, rows: [['扫一遍求 max：n−1 次', DIM], ['再扫一遍求 min：n−1 次', DIM], ['共 ≈2n 次比较', RED, true]] },
          { t: '问', c: AMBER, rows: [['能更少吗？', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '成对处理：两数先互比，大的比 max、小的比 min —— 每对 3 次比较', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '对内比' }, { sw: 'line', color: GREEN, txt: '比 max' }, { sw: 'line', color: TEAL, txt: '比 min' }], '每对 3 次');
        var pairs = [[4, 9], [2, 7], [5, 8]];
        pairs.forEach(function (p, i) {
          var x = 60 + i * 100;
          ctx.fillStyle = '#12244a'; H.rr(ctx, x, 60, 36, 40, 5); ctx.fill(); H.mono(ctx, String(p[0]), x + 18, 80, { size: 13, bold: true });
          ctx.fillStyle = '#12244a'; H.rr(ctx, x + 44, 60, 36, 40, 5); ctx.fill(); H.mono(ctx, String(p[1]), x + 62, 80, { size: 13, bold: true });
          H.line(ctx, x + 36, 80, x + 44, 80, AMBER, 2.5);
          H.txt(ctx, '大→max 小→min', x + 40, 122, { size: 10, color: DIM });
        });
        M.note(ctx, [
          { t: '每对', c: TEAL, rows: [['1 次对内比', TXT], ['1 次比 max', TXT], ['1 次比 min', TXT, true]] },
          { t: '合计', c: GREEN, rows: [['3 × n/2 = 1.5n', GREEN, true]] }
        ], 372, 56);
      } },
      { cap: '比较次数：朴素 2n vs 成对 1.5n —— 省 25% ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '成对更省' }], '复杂度对比');
        M.bars(ctx, [
          { label: '朴素 2n', v: 200, color: RED },
          { label: '成对 1.5n', v: 150, color: GREEN }
        ], { x: 140, y: 70, w: 160, bh: 22, gap: 40, vmax: 200 });
        H.txt(ctx, '比较次数（n 个元素）', 306, 56, { size: 10, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['1.5n < 2n', GREEN, true], ['且仍是单遍 O(n)', TXT]] },
          { t: '下界', rows: [['同时求 max+min 至少', DIM], ['⌈3n/2⌉−2 次比较', DIM]] }
        ], 372, 60);
      } }
    ] } });
  /* m28 · 寻找最近点对 */
  D({ g: g, no: 28, title: '寻找最近点对', e: 'board', strat: '分治·扫描条',
    plain: '平面上 n 个点找距离最近的一对。暴力 O(n²)；分治 O(n log n)：按 x 排序后从中线分开递归得两侧最小距离 δ，合并时只需检查中线左右宽 δ 的竖条内、按 y 排序后每个点最多与后面 7 个点的距离。',
    p: { steps: [
      { cap: '平面上若干点：找距离最近的一对；暴力两两比 O(n²)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: TEAL, txt: '点' }, { sw: 'line', color: AMBER, txt: '最近对' }], '目标：最近点对');
        var pts = [[80, 70], [150, 110], [110, 180], [230, 80], [260, 170], [200, 140]];
        pts.forEach(function (p) { H.circle(ctx, p[0], p[1], 5, TEAL, null); });
        H.line(ctx, 230, 80, 200, 140, 'rgba(148,163,184,.3)', 1);
        H.line(ctx, 150, 110, 200, 140, 'rgba(148,163,184,.3)', 1);
        H.line(ctx, 200, 140, 260, 170, AMBER, 2.5);
        M.note(ctx, [
          { t: '暴力', c: RED, rows: [['C(n,2) 对全比', RED, true], ['O(n²) 点多了慢', DIM]] },
          { t: '问', c: AMBER, rows: [['能 O(n log n) 吗？', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '分治：按 x 排序、中线分左右递归，得 δL、δR，δ = min', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: '#39437a', txt: '中线' }, { sw: 'dot', color: TEAL, txt: '点' }], '递归两侧');
        var pts = [[80, 70], [150, 110], [110, 180], [230, 80], [260, 170], [200, 140]];
        pts.forEach(function (p) { H.circle(ctx, p[0], p[1], 5, TEAL, null); });
        H.line(ctx, 180, 40, 180, 220, '#39437a', 2);
        H.txt(ctx, 'δL', 120, 220, { size: 12, bold: true, color: TEAL });
        H.txt(ctx, 'δR', 240, 220, { size: 12, bold: true, color: TEAL });
        M.code(ctx, [['δ = min(δL, δR)', GREEN, true], ['但最近对可能跨中线！', AMBER]], 60, 250, { size: 12, gap: 22 });
        M.note(ctx, [
          { t: '递归', c: TEAL, rows: [['左右各得最小距离', TXT], ['取 δ = min', TXT, true]] },
          { t: '遗漏', c: AMBER, rows: [['跨中线的对怎么办', TXT]] }
        ], 372, 56);
      } },
      { cap: '合并：只看中线±δ 竖条，按 y 扫、每点比后面 ≤7 个 → 总 O(n log n) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: 'rgba(251,191,36,.14)', txt: '竖条 ±δ' }], '关键合并');
        ctx.fillStyle = 'rgba(251,191,36,.12)'; H.rr(ctx, 150, 40, 60, 180, 4); ctx.fill();
        H.line(ctx, 180, 40, 180, 220, '#39437a', 2);
        var pts = [[80, 70], [150, 110], [110, 180], [230, 80], [260, 170], [200, 140]];
        pts.forEach(function (p) { H.circle(ctx, p[0], p[1], 5, p[0] > 150 && p[0] < 210 ? AMBER : TEAL, null); });
        M.code(ctx, [['竖条内按 y 排序', TXT], ['每点只需比后面 ≤7 个', AMBER, true], ['合并 O(n) → 总 O(n log n)', GREEN, true]], 250, 90, { size: 12, gap: 23 });
        M.note(ctx, [
          { t: '为什么 7', c: TEAL, rows: [['δ×2δ 矩形内最多', DIM], ['8 个点互距 ≥δ', TXT, true]] },
          { t: '结论', c: GREEN, rows: [['分治 O(n log n)', GREEN, true]] }
        ], 372, 56);
      } }
    ] } });

  /* m29 · 快速寻找满足条件的两个数 */
  D({ g: g, no: 29, title: '和为定值的两个数', e: 'board', strat: '双指针·哈希',
    plain: '在数组中找两个数使和等于给定 target。排序后双指针从两端向中间夹：和大了右指针左移、和小了左指针右移，O(n log n)；或用哈希表一遍扫：对每个 x 查 target−x 是否已出现，O(n)。',
    p: { steps: [
      { cap: '数组 [3,7,1,9,4,6]，target=10：哪两个数和为 10？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '元素' }], '目标：两数和=10');
        M.chips(ctx, [3, 7, 1, 9, 4, 6], { x: 56, y: 70, tw: 44, th: 46 });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['找 a+b = 10', TXT, true]] },
          { t: '暴力', c: RED, rows: [['两两枚举 O(n²)', RED]] }
        ], 372, 60);
      } },
      { cap: '排序后双指针夹逼：和小→左移右、和大→右移左，直到相遇', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: GREEN, txt: '左指针' }, { sw: 'dot', color: AMBER, txt: '右指针' }], '排序+夹逼');
        var s = [1, 3, 4, 6, 7, 9];
        M.chips(ctx, s, { x: 56, y: 60, tw: 44, th: 44 });
        H.circle(ctx, 78, 46, 6, GREEN, null); H.circle(ctx, 298, 46, 6, AMBER, null);
        M.code(ctx, [
          ['1+9=10 ✓ 直接命中', GREEN, true],
          ['若和<10: 左指针右移', DIM],
          ['若和>10: 右指针左移', DIM]
        ], 56, 150, { size: 12.5, gap: 23 });
        M.note(ctx, [
          { t: '单调性', c: TEAL, rows: [['排序后和随指针', TXT], ['单调变化 → 可夹逼', TXT, true]] },
          { t: '复杂度', c: GREEN, rows: [['O(n log n)（排序主导）', GREEN, true]] }
        ], 372, 56);
      } },
      { cap: '哈希法：一遍扫，对每个 x 查 target−x 是否已在表里 → O(n) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: '哈希表' }], 'O(n) 一遍');
        M.code(ctx, [
          ['for x in arr:', AMBER],
          ['  if (target−x) in set: 命中', GREEN, true],
          ['  set.add(x)', TXT],
          ['本例：扫到 9 时 10−9=1 已在', DIM]
        ], 56, 60, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '哈希', c: GREEN, rows: [['O(n) 时间 O(n) 空间', GREEN, true], ['不需排序', DIM]] },
          { t: '取舍', rows: [['双指针省空间', DIM], ['哈希省时间', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m30 · 子数组的最大乘积 */
  D({ g: g, no: 30, title: '子数组的最大乘积', e: 'board', strat: 'DP·最大最小双状态',
    plain: '求连续子数组的最大乘积。与最大子和不同，负数×负数会变正，所以必须同时维护"以当前结尾的最大积"和"最小积"两个状态：遇到负数时两者先交换再乘当前值，全局取最大积的最大值。O(n)。',
    p: { steps: [
      { cap: '数组 [2,3,−2,4]：最大乘积子数组 = [2,3] = 6', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '元素' }], '目标：最大乘积');
        M.chips(ctx, [2, 3, -2, 4], { x: 66, y: 70, tw: 50, th: 50 });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['连续子数组乘积最大', TXT, true]] },
          { t: '难点', c: RED, rows: [['负数会让符号翻转', RED, true], ['不能只存最大', DIM]] }
        ], 372, 60);
      } },
      { cap: '双状态：maxEnd/minEnd 同步滚动；遇负数先交换两者再乘', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: 'maxEnd' }, { sw: 'line', color: RED, txt: 'minEnd' }], '双状态 DP');
        M.code(ctx, [
          ['若 a[i] < 0: swap(maxEnd, minEnd)', AMBER, true],
          ['maxEnd = max(a[i], maxEnd*a[i])', GREEN],
          ['minEnd = min(a[i], minEnd*a[i])', RED],
          ['ans = max(ans, maxEnd)', TXT]
        ], 56, 60, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '为什么交换', c: TEAL, rows: [['负数把最大变最小', TXT], ['最小变最大', TXT, true]] },
          { t: '两状态', rows: [['缺一不可', DIM]] }
        ], 372, 60);
      } },
      { cap: '例 [−2,3,−4]：负负得正 → 全数组乘积 24 才是最大 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '答案 24' }], '负负得正');
        M.chips(ctx, [-2, 3, -4], { x: 76, y: 60, tw: 54, th: 54 });
        M.code(ctx, [
          ['(−2)×3×(−4) = 24', GREEN, true],
          ['只存"最大"会在 −2 处断掉', RED],
          ['minEnd 保留了翻盘机会', AMBER]
        ], 66, 160, { size: 12.5, gap: 24 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['最大+最小双状态', GREEN, true], ['O(n) 单遍', TXT]] },
          { t: '同款', rows: [['与最大子和 Kadane 同族', DIM]] }
        ], 372, 56);
      } }
    ] } });

  /* m31 · 求数组的子数组之和的最大值 */
  D({ g: g, no: 31, title: '子数组之和的最大值', e: 'board', strat: 'Kadane·DP',
    plain: '求连续子数组的最大和（最大子段和）。Kadane：扫一遍维护"以当前结尾的最大和" cur = max(a[i], cur+a[i])，全局取 max；cur 变负就重启（负的 cur 只会拖累后面）。O(n)，优于暴力 O(n²) 与分治 O(n log n)。',
    p: { steps: [
      { cap: '数组 [−2,1,−3,4,−1,2,1,−5,4]：最大子段 [4,−1,2,1] = 6', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '元素' }, { sw: 'box', color: GREEN, txt: '最优子段' }], '目标：最大子段和');
        M.chips(ctx, [-2, 1, -3, 4, -1, 2, 1, -5, 4], { x: 46, y: 70, tw: 34, th: 42, color: function (i) { return i >= 3 && i <= 6 ? '#1e3a34' : '#121a3a'; }, ring: function (i) { return i >= 3 && i <= 6 ? GREEN : null; } });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['连续子数组和最大', TXT, true]] },
          { t: '暴力', c: RED, rows: [['O(n²) 枚举起止', RED]] }
        ], 372, 60);
      } },
      { cap: 'Kadane：cur = max(a[i], cur+a[i])；global 取历史最大', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: 'cur' }, { sw: 'line', color: AMBER, txt: 'global' }], '单遍 DP');
        M.code(ctx, [
          ['cur = 0, best = −∞', TXT],
          ['for x in a:', AMBER],
          ['  cur = max(x, cur + x)', GREEN, true],
          ['  best = max(best, cur)', TXT],
          ['本例 best = 6', GREEN]
        ], 56, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '含义', c: TEAL, rows: [['cur = 以 i 结尾的最大和', TXT, true], ['要么接续要么重启', DIM]] },
          { t: '复杂度', c: GREEN, rows: [['O(n) 单遍', GREEN, true]] }
        ], 372, 56);
      } },
      { cap: '为什么 cur 变负就重启：负的 cur 加到后面只会更小，不如从当前重新开始 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: RED, txt: '负 cur 拖累' }], '重启直觉');
        M.code(ctx, [
          ['cur < 0 时 cur + x < x', RED, true],
          ['→ 不如直接 cur = x 重启', AMBER],
          ['等价于 max(x, cur+x) 自动处理', DIM],
          ['对比：暴力 O(n²)、分治 O(n log n)', DIM],
          ['Kadane O(n) 最优 ✓', GREEN]
        ], 46, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['Kadane O(n)', GREEN, true], ['最大子段和经典', TXT]] },
          { t: '推广', rows: [['二维版见下一题', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m32 · 子数组之和的最大值（二维） */
  D({ g: g, no: 32, title: '最大子矩阵和（二维）', e: 'board', strat: '行压缩·Kadane',
    plain: '二维矩阵里求子矩阵的最大和。把若干行"压缩"成一行（列方向累加），就化成一维最大子段和：枚举上、下边界 O(n²)，对每个边界组合跑一次 Kadane O(n)，总 O(n³)。',
    p: { steps: [
      { cap: '矩阵：求和最大的子矩阵（连续若干行×连续若干列）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#182148', txt: '矩阵' }, { sw: 'box', color: GREEN, txt: '最优子矩阵' }], '目标：最大子矩阵');
        var mtx = [[0, -2, -7, 0], [9, 2, -6, 2], [-4, 1, -4, 1], [-1, 8, 0, -2]];
        M.grid(ctx, mtx, { x: 60, y: 50, cs: 40, checker: true, fill: function (r, c) { return (r >= 1 && r <= 3 && c >= 0 && c <= 1) ? '#1e3a34' : null; }, ring: function (r, c) { return (r >= 1 && r <= 3 && c >= 0 && c <= 1) ? GREEN : null; } });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['最大子矩阵和', TXT, true]] },
          { t: '暴力', c: RED, rows: [['枚举四边 O(n⁴)+求和', RED]] }
        ], 372, 60);
      } },
      { cap: '行压缩：固定上边界，把下边界以下的列逐列累加成一维数组', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '压缩成一维' }], '降维');
        var mtx = [[0, -2, -7, 0], [9, 2, -6, 2], [-4, 1, -4, 1], [-1, 8, 0, -2]];
        M.grid(ctx, mtx, { x: 50, y: 40, cs: 34, checker: true, size: 11 });
        M.arrow(ctx, 200, 110, 240, 110, AMBER, 2);
        M.chips(ctx, [4, 11, -10, 1], { x: 250, y: 90, tw: 36, th: 40, size: 12 });
        H.txt(ctx, '行1..3 列和 → 一维', 268, 76, { size: 10.5, color: DIM });
        M.note(ctx, [
          { t: '压缩', c: TEAL, rows: [['列方向累加', TXT, true], ['子矩阵 → 子段', TXT]] },
          { t: '然后', c: AMBER, rows: [['对一维跑 Kadane', TXT]] }
        ], 372, 56);
      } },
      { cap: '枚举上下边界 O(n²) × Kadane O(n) = O(n³)；本例最大子矩阵和 = 15 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: 'O(n³)' }], '答案：15');
        M.code(ctx, [
          ['for top in 0..n:', AMBER],
          ['  colSum 清零', TXT],
          ['  for bottom in top..n:', AMBER],
          ['    colSum += 行 bottom', TXT],
          ['    Kadane(colSum) 更新答案', GREEN, true],
          ['本例 = 15', GREEN]
        ], 46, 52, { size: 12, gap: 24 });
        M.note(ctx, [
          { t: '复杂度', c: GREEN, rows: [['O(n³)', GREEN, true], ['比暴力 O(n⁴+) 快', TXT]] },
          { t: '思想', c: TEAL, rows: [['降维：二维→一维', TXT, true]] }
        ], 372, 60);
      } }
    ] } });

  /* m33 · 求数组中最长递增子序列 */
  D({ g: g, no: 33, title: '最长递增子序列', e: 'board', strat: 'DP·tails二分',
    plain: '求最长递增子序列 LIS（不要求连续）。O(n²) DP：f(i)=1+max{f(j): j<i, a[j]<a[i]}。O(n log n)：维护 tails 数组，tails[k] = 长度为 k+1 的递增子序列的最小结尾；对每个 x 在 tails 上二分找第一个 ≥x 的位置替换（更大则追加），tails 长度即 LIS。',
    p: { steps: [
      { cap: '数组 [10,9,2,5,3,7,101,18]：LIS 长度 = 4（如 2,3,7,101）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '元素' }, { sw: 'box', color: GREEN, txt: '一个 LIS' }], '目标：LIS 长度');
        M.chips(ctx, [10, 9, 2, 5, 3, 7, 101, 18], { x: 46, y: 70, tw: 36, th: 44, color: function (i, v) { return [2, 3, 7, 101].indexOf(v) >= 0 ? '#1e3a34' : '#121a3a'; }, ring: function (i, v) { return [2, 3, 7, 101].indexOf(v) >= 0 ? GREEN : null; } });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['最长递增子序列', TXT, true], ['（不必连续）', DIM]] },
          { t: 'O(n²)', c: RED, rows: [['f(i) 看所有 j<i', RED]] }
        ], 372, 60);
      } },
      { cap: 'tails[k]=长度 k+1 的最小结尾；对每个 x 二分找第一个 ≥x 替换或追加', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: 'tails' }], 'patience 维护');
        var stages = [[10], [9], [2], [2, 5], [2, 3], [2, 3, 7], [2, 3, 7, 101], [2, 3, 7, 18]];
        stages.forEach(function (st, r) {
          H.mono(ctx, 'x=' + [10, 9, 2, 5, 3, 7, 101, 18][r], 60, 52 + r * 26, { size: 10, color: FAINT, align: 'left' });
          st.forEach(function (v, c) {
            ctx.fillStyle = '#12244a'; H.rr(ctx, 110 + c * 40, 40 + r * 26, 34, 22, 4); ctx.fill();
            H.mono(ctx, String(v), 110 + c * 40 + 17, 51 + r * 26, { size: 10.5, bold: true, color: TEAL });
          });
        });
        M.note(ctx, [
          { t: '不变量', c: TEAL, rows: [['tails 始终递增', TXT, true], ['故可二分', DIM]] },
          { t: '操作', c: AMBER, rows: [['x 替换第一个 ≥x', TXT], ['更大则追加', TXT]] }
        ], 372, 48);
      } },
      { cap: 'tails 长度 = LIS = 4；每步二分 O(log n) → 总 O(n log n) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: 'O(n log n)' }], '答案：4');
        M.code(ctx, [
          ['最终 tails = [2,3,7,18]', TXT],
          ['长度 = 4 = LIS ✓', GREEN, true],
          ['注意 tails 本身不一定真 LIS', DIM],
          ['但长度正确', DIM],
          ['O(n²) → O(n log n)', GREEN]
        ], 56, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['tails+二分 O(n log n)', GREEN, true]] },
          { t: ' caveat', rows: [['要输出具体序列需记录', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m34 · 数组循环移位 */
  D({ g: g, no: 34, title: '数组循环移位', e: 'board', strat: '三次反转',
    plain: '数组循环右移 K 位。三次反转法 O(n) 时间 O(1) 空间：先整体反转，再反转前 K 个、反转后 n−K 个。也可用额外数组 O(n) 空间，或逐位轮换 O(n) 但常数大。',
    p: { steps: [
      { cap: '[1,2,3,4,5,6] 循环右移 2 位 → [5,6,1,2,3,4]', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '原' }, { sw: 'box', color: GREEN, txt: '移后' }], '目标：右移 2');
        M.chips(ctx, [1, 2, 3, 4, 5, 6], { x: 56, y: 56, tw: 40, th: 40 });
        M.arrow(ctx, 180, 110, 180, 130, AMBER, 2);
        M.chips(ctx, [5, 6, 1, 2, 3, 4], { x: 56, y: 140, tw: 40, th: 40, color: function () { return '#1e3a34'; } });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['O(n) 时间 O(1) 空间', TXT, true]] },
          { t: '额外数组', c: RED, rows: [['O(n) 空间不达标', RED]] }
        ], 372, 60);
      } },
      { cap: '三次反转：整体反 → 前 K 反 → 后 n−K 反', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '反转段' }], '三步');
        var rows = [[1, 2, 3, 4, 5, 6], [6, 5, 4, 3, 2, 1], [5, 6, 4, 3, 2, 1], [5, 6, 1, 2, 3, 4]];
        var labs = ['原', '①整体反', '②前2反', '③后4反'];
        rows.forEach(function (rw, r) {
          H.txt(ctx, labs[r], 40, 56 + r * 44, { size: 10.5, color: DIM, align: 'right' });
          rw.forEach(function (v, c) {
            ctx.fillStyle = r === 3 ? '#1e3a34' : '#121a3a'; H.rr(ctx, 56 + c * 40, 40 + r * 44, 36, 36, 5); ctx.fill();
            H.mono(ctx, String(v), 56 + c * 40 + 18, 58 + r * 44, { size: 12, bold: true, color: r === 3 ? GREEN : TXT });
          });
        });
        M.note(ctx, [
          { t: '步骤', c: TEAL, rows: [['① reverse(0,n−1)', TXT], ['② reverse(0,K−1)', TXT], ['③ reverse(K,n−1)', TXT, true]] },
          { t: '效果', c: GREEN, rows: [['右移 K 位 ✓', GREEN, true]] }
        ], 372, 52);
      } },
      { cap: '复杂度 O(n) 时间 O(1) 空间；对比额外数组 O(n) 空间、逐位轮换常数大 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '三次反转' }], '方法对比');
        M.bars(ctx, [
          { label: '额外数组', v: 100, color: RED },
          { label: '逐位轮换', v: 60, color: AMBER },
          { label: '三次反转', v: 30, color: GREEN }
        ], { x: 140, y: 60, w: 150, bh: 18, gap: 36, vmax: 100 });
        H.txt(ctx, '空间/常数代价（时间均 O(n)）', 296, 46, { size: 10, color: FAINT, align: 'left' });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['三次反转最优', GREEN, true], ['O(n) 时间 O(1) 空间', TXT]] },
          { t: '同款', rows: [['字符串旋转同法', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m35 · 数组分割 */
  D({ g: g, no: 35, title: '数组分割', e: 'board', strat: 'DP·计数背包',
    plain: '把 2n 个数分成两组、每组 n 个，使两组和之差最小。等价于"选 n 个数使其和尽量接近总和一半"。DP：f[c][s] = 能否选 c 个数凑出和 s（01 背包加一维计数），在 c=n 且 s≤sum/2 里找最大可达 s。',
    p: { steps: [
      { cap: '2n 个数分两组、每组 n 个：使两组和之差最小', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: 'A 组' }, { sw: 'box', color: AMBER, txt: 'B 组' }], '目标：差最小');
        M.chips(ctx, [1, 5, 7, 9, 4, 6], { x: 56, y: 70, tw: 42, th: 44 });
        H.txt(ctx, 'sum=32 → 理想各 16', 180, 52, { size: 11, color: DIM });
        M.note(ctx, [
          { t: '约束', rows: [['两组各 n 个', TXT, true], ['不能随便分', DIM]] },
          { t: '问', c: AMBER, rows: [['差最小怎么分？', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '转化：选 n 个数使和尽量接近 sum/2；另一组自动是剩下 n 个', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '接近 sum/2' }], '等价转化');
        M.code(ctx, [
          ['A 组和 s，B 组和 sum−s', TXT],
          ['差 = |sum − 2s|', AMBER],
          ['s 越接近 sum/2 差越小', GREEN, true],
          ['且 |A| = n（计数约束）', TXT]
        ], 56, 60, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '关键', c: TEAL, rows: [['加了"选 n 个"的', TXT], ['计数约束', TXT, true]] },
          { t: '所以', rows: [['普通子集和不够', DIM]] }
        ], 372, 60);
      } },
      { cap: 'DP f[c][s]=选 c 个能否凑和 s（倒序）；取 c=n、s≤sum/2 最大可达 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: 'f[c][s]' }], '计数背包');
        M.code(ctx, [
          ['f[0][0] = true', TXT],
          ['for x in arr:          // 倒序', AMBER],
          ['  for c = n..1, s = sum/2..x:', TEAL],
          ['    f[c][s] |= f[c−1][s−x]', GREEN, true],
          ['答：max s with f[n][s]', GREEN]
        ], 46, 56, { size: 12, gap: 25 });
        M.note(ctx, [
          { t: '复杂度', c: GREEN, rows: [['O(n² · sum)', GREEN, true], ['伪多项式', DIM]] },
          { t: '结论', c: TEAL, rows: [['计数维是关键', TXT, true]] }
        ], 372, 60);
      } }
    ] } });

  /* m36 · 区间重合判断 */
  D({ g: g, no: 36, title: '区间重合判断', e: 'board', strat: '排序合并·扫描',
    plain: '给若干区间和一个目标区间，判断目标是否被这些区间的并覆盖（或统计重叠）。先把区间按左端点排序并合并相交区间，得到不相交的并；再判断目标是否落在某个合并区间内。也可用端点事件+前缀和统计覆盖深度。',
    p: { steps: [
      { cap: '区间集 {[1,3],[2,5],[7,9]} 与目标 [2,4]：目标被覆盖吗？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '给定区间' }, { sw: 'line', color: AMBER, txt: '目标' }], '目标：判断覆盖');
        function iv(y, a, b, color) { H.line(ctx, 60 + a * 30, y, 60 + b * 30, y, color, 5); H.circle(ctx, 60 + a * 30, y, 4, color, null); H.circle(ctx, 60 + b * 30, y, 4, color, null); }
        iv(60, 1, 3, TEAL); iv(90, 2, 5, TEAL); iv(120, 7, 9, TEAL);
        iv(160, 2, 4, AMBER);
        H.txt(ctx, '目标 [2,4]', 60 + 3 * 30, 180, { size: 11, bold: true, color: AMBER });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['目标被并集覆盖？', TXT, true]] },
          { t: '难点', rows: [['区间互相重叠', DIM]] }
        ], 372, 60);
      } },
      { cap: '排序+合并：按左端点排序，相交则并成一个 → 不相交的并 {[1,5],[7,9]}', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '合并后' }], '排序合并');
        function iv(y, a, b, color) { H.line(ctx, 60 + a * 30, y, 60 + b * 30, y, color, 5); }
        iv(60, 1, 3, '#39437a'); iv(86, 2, 5, '#39437a');
        M.arrow(ctx, 160, 100, 160, 120, AMBER, 2);
        iv(130, 1, 5, GREEN); iv(160, 7, 9, GREEN);
        M.code(ctx, [['按左端点排序', TXT], ['cur.right ≥ next.left → 合并', AMBER, true]], 220, 90, { size: 11.5, gap: 21 });
        M.note(ctx, [
          { t: '合并', c: TEAL, rows: [['得到不相交并', TXT, true], ['O(n log n)', DIM]] },
          { t: '本例', rows: [['{[1,5],[7,9]}', GREEN]] }
        ], 372, 56);
      } },
      { cap: '目标 [2,4] ⊆ [1,5] → 被覆盖 ✓；二分/扫描定位 O(log n) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '覆盖成立' }], '答案：覆盖');
        function iv(y, a, b, color) { H.line(ctx, 60 + a * 30, y, 60 + b * 30, y, color, 5); }
        iv(70, 1, 5, GREEN); iv(110, 2, 4, AMBER);
        H.txt(ctx, '[2,4] 落在 [1,5] 内 → 覆盖 ✓', 160, 150, { size: 12, bold: true, color: GREEN });
        M.note(ctx, [
          { t: '判定', c: GREEN, rows: [['目标 ⊆ 某合并区间', TXT, true], ['二分定位 O(log n)', DIM]] },
          { t: '变体', c: TEAL, rows: [['覆盖深度：端点事件+前缀和', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m37 · 程序理解和时间分析 */
  D({ g: g, no: 37, title: '程序理解和时间分析', e: 'board', strat: '计数·级数化简',
    plain: '给一段代码，理解它做什么并精确分析时间复杂度。方法：数基本操作次数，识别循环嵌套与每层迭代数，把总和写成求和再化简（等差/等比/调和级数），最后给大 O。',
    p: { steps: [
      { cap: '双重循环：for i=1..n { for j=1..i { op } } —— 共执行几次 op？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: 'op 次数' }], '目标：数操作');
        M.code(ctx, [
          ['for (i = 1; i <= n; i++)', AMBER],
          ['  for (j = 1; j <= i; j++)', AMBER],
          ['    op();', TEAL]
        ], 56, 60, { size: 13, gap: 26 });
        /* 三角点阵 */
        for (var i = 1; i <= 6; i++) for (var j = 1; j <= i; j++) { H.circle(ctx, 240 + j * 18, 50 + i * 22, 4, TEAL, null); }
        H.txt(ctx, '下三角点阵', 300, 210, { size: 10.5, color: DIM });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['op 总次数？', TXT, true], ['大 O 是？', TXT]] },
          { t: '观察', rows: [['第 i 行执行 i 次', DIM]] }
        ], 372, 60);
      } },
      { cap: '求和：Σ_{i=1..n} i = n(n+1)/2 → O(n²)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '等差级数' }], '化简');
        M.code(ctx, [
          ['T(n) = Σ i  (i=1..n)', TXT],
          ['     = n(n+1)/2', GREEN, true],
          ['     = O(n²)', GREEN]
        ], 56, 70, { size: 14, gap: 28 });
        M.note(ctx, [
          { t: '等差', c: TEAL, rows: [['首尾配对', TXT], ['n(n+1)/2', TXT, true]] },
          { t: '结论', c: GREEN, rows: [['O(n²)', GREEN, true]] }
        ], 372, 60);
      } },
      { cap: '常见级数速查：等差 O(n²)、等比 O(1)/O(n)、调和 Σ1/i = O(log n) → 嵌套常得 O(n log n) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: '#12244a', txt: '级数' }], '速查表');
        M.code(ctx, [
          ['Σ i      = O(n²)   等差', TEAL],
          ['Σ 1/2^i  = O(1)    等比', TEAL],
          ['Σ 1/i    = O(log n) 调和', AMBER],
          ['Σ i·(1/i)= O(n) …', DIM],
          ['外层 n × 内层 log n → O(n log n)', GREEN, true]
        ], 46, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '方法', c: GREEN, rows: [['数操作→写求和', TXT, true], ['→化简→大 O', TXT]] },
          { t: '价值', c: TEAL, rows: [['读代码先估复杂度', DIM]] }
        ], 372, 60);
      } }
    ] } });

  /* m38 · 只考加法的面试题 */
  D({ g: g, no: 38, title: '只考加法的面试题', e: 'board', strat: '数论·连续和',
    plain: '哪些正整数能写成"两个以上连续自然数之和"？答案：除了 2 的幂都可以。因为 k 个连续数（起于 m）之和 = k·m + k(k−1)/2；N 能拆出 ≥2 项当且仅当 N 有大于 1 的奇因子，而 2 的幂没有。',
    p: { steps: [
      { cap: '9 = 4+5 = 2+3+4；15 = 7+8 = 4+5+6 = 1+2+3+4+5 —— 哪些数可以？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '连续段' }], '目标：刻画可拆的 N');
        M.code(ctx, [
          ['9  = 4+5 = 2+3+4', TEAL],
          ['15 = 7+8 = 4+5+6 = 1+..+5', TEAL],
          ['8  = ?  → 拆不出！', RED, true]
        ], 56, 70, { size: 14, gap: 30 });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['哪些 N 可写成', TXT], ['≥2 个连续自然数和？', TXT, true]] },
          { t: '猜想', rows: [['8、16 这类不行？', DIM]] }
        ], 372, 60);
      } },
      { cap: '连续和公式：k 项起于 m → N = k·m + k(k−1)/2；有解 ⇔ N 有奇因子 >1', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '公式' }], '推导');
        M.code(ctx, [
          ['N = m + (m+1) + … + (m+k−1)', TXT],
          ['  = k·m + k(k−1)/2', AMBER, true],
          ['2N = k(2m + k − 1)', TXT],
          ['k 与 (2m+k−1) 一奇一偶', TEAL],
          ['→ N 需有奇因子 >1', GREEN, true]
        ], 46, 52, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '关键', c: TEAL, rows: [['k 与 (2m+k−1)', TXT], ['奇偶性相反', TXT, true]] },
          { t: '所以', rows: [['2N 分解出一个奇因子', DIM]] }
        ], 372, 56);
      } },
      { cap: '结论：N 可拆 ⇔ N 不是 2 的幂；2 的幂无奇因子 >1 故不可拆 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '可拆' }, { sw: 'line', color: RED, txt: '2 的幂不可' }], '答案');
        M.code(ctx, [
          ['N 有奇因子 >1 → 可拆', GREEN, true],
          ['N = 2^t → 无奇因子 → 不可拆', RED, true],
          ['例 8=2³ 不可；9=3² 可', DIM],
          ['构造：取奇因子 d，k=d 或调整', AMBER]
        ], 56, 60, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '结论', c: GREEN, rows: [['除 2 的幂外都可', GREEN, true], ['纯数论刻画', TXT]] },
          { t: '同款', rows: [['因子奇偶性分析', DIM]] }
        ], 372, 60);
      } }
    ] } });
  /* m39 · 字符串移位包含的问题 */
  D({ g: g, no: 39, title: '字符串移位包含', e: 'board', strat: '拼接·子串判定', plain: '判断 s2 能否由 s1 循环移位得到（如 AABCD 移位成 CDAA）。妙招：把 s1 自己拼接自己得 s1s1，则一切移位结果都是它的子串——一次拼接 + 一次子串查找就解决。',
    p: { steps: [
      { cap: 'AABCD 循环移位可得 ABCDA、BCDAA、CDAA… 如何统一判定？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: 's1' }, { sw: 'box', color: AMBER, txt: 's2' }], '目标：s2 是否为 s1 的移位');
        var s1 = ['A','A','B','C','D'], s2 = ['C','D','A','A'];
        H.txt(ctx, 's1 = AABCD', 60, 60, { size: 11, color: DIM, align: 'left' });
        M.chips(ctx, s1, { x: 60, y: 80, tw: 40, th: 40, color: function () { return TEAL; }, txt: function () { return '#0c1830'; }, size: 16 });
        H.txt(ctx, 's2 = CDAA', 60, 150, { size: 11, color: DIM, align: 'left' });
        M.chips(ctx, s2, { x: 60, y: 170, tw: 40, th: 40, color: function () { return AMBER; }, txt: function () { return '#2a1c04'; }, size: 16 });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['s2 能否由 s1', TXT], ['循环移位得到？', TXT, true]] },
          { t: '朴素', rows: [['逐个移位再比较', DIM], ['O(n²)', RED]] }
        ], 372, 70);
      } },
      { cap: '拼接 s1s1 = AABCDAABCD：所有循环移位都是它的子串（CDAA 在其中）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: 's1s1' }, { sw: 'box', color: AMBER, txt: '命中子串' }], '拼接技巧');
        var t = ['A','A','B','C','D','A','A','B','C','D'];
        H.txt(ctx, 's1s1 = AABCDAABCD（命中段亮色）', 36, 92, { size: 11, color: DIM, align: 'left' });
        M.chips(ctx, t, { x: 36, y: 110, tw: 54, th: 46, color: function (i) { return (i >= 3 && i <= 6) ? AMBER : GREEN; }, txt: function (i) { return (i >= 3 && i <= 6) ? '#2a1c04' : '#0c1830'; }, size: 17 });
        M.code(ctx, [
          ['CDAA ⊆ AABCDAABCD → 是移位 ✓', GREEN, true],
          ['移位 k 位 = 取 s1s1[k..k+n−1]', TXT]
        ], 60, 200, { size: 13.5, gap: 28 });
        M.note(ctx, [
          { t: '为什么', c: TEAL, rows: [['环切开拉直 =', TXT], ['自己拼自己', TXT, true]] },
          { t: '查找', rows: [['KMP O(n)', DIM]] }
        ], 372, 60);
      } },
      { cap: '一次拼接 + 一次子串查找即可判定，复杂度 O(n) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '完成' }], '结论');
        M.code(ctx, [
          ['bool shiftIncl(s1, s2):', TXT],
          ['  return len(s1)==len(s2)', TEAL],
          ['      && contains(s1+s1, s2)', TEAL, true],
          ['contains 用 KMP → O(n)', AMBER]
        ], 56, 80, { size: 13.5, gap: 28 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['把"循环"展开成', TXT], ['"线性拼接"', TXT, true]] },
          { t: '同款', rows: [['环形数组问题拉直', DIM]] }
        ], 372, 80);
      } }
    ] } });

  /* m40 · 电话号码对应英语单词 */
  D({ g: g, no: 40, title: '电话号码对应单词', e: 'board', strat: '映射·递归枚举', plain: '电话键盘 2→ABC、3→DEF…9→WXYZ。给一串号码，枚举所有字母组合（或查字典找有意义的单词）。n 位号码共 ∏kᵢ 种组合，递归/迭代逐位展开。',
    p: { steps: [
      { cap: '键盘映射：2→ABC 3→DEF 4→GHI 5→JKL 6→MNO 7→PQRS 8→TUV 9→WXYZ', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '数字→字母' }], '目标：号码 → 字母组合');
        var keys = [['2','ABC'],['3','DEF'],['4','GHI'],['5','JKL'],['6','MNO'],['7','PQRS'],['8','TUV'],['9','WXYZ']];
        keys.forEach(function (k, i) {
          var x = 52 + (i % 4) * 88, y = 76 + Math.floor(i / 4) * 96;
          ctx.fillStyle = '#12244a'; ctx.strokeStyle = TEAL; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.rect(x, y, 76, 80); ctx.fill(); ctx.stroke();
          ctx.fillStyle = AMBER; ctx.font = 'bold 24px ' + H.txt; ctx.textAlign = 'center';
          ctx.fillText(k[0], x + 38, y + 34);
          ctx.fillStyle = TXT; ctx.font = '13px ' + H.txt;
          ctx.fillText(k[1], x + 38, y + 62);
        });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['号码 234 →', TXT], ['哪些字母串？', TXT, true]] },
          { t: '规模', rows: [['n 位共 ∏kᵢ 种', DIM]] }
        ], 420, 80);
      } },
      { cap: '递归枚举：固定前缀→下一位试遍所有字母；234 共 3×3×3 = 27 种', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '枚举树' }], '逐位展开');
        M.code(ctx, [
          ['void gen(i, prefix):', TXT],
          ['  if i == n: 输出 prefix', GREEN],
          ['  else: 第 i 位的每个字母 c', TXT],
          ['          gen(i+1, prefix+c)', TEAL, true]
        ], 46, 56, { size: 12.5, gap: 24 });
        var lvl = [['2','A','D','G'], ['23','AD','AE','AF'], ['234','ADG','ADH','ADI']];
        H.txt(ctx, '第 1 位', 12, 205, { size: 10.5, color: FAINT, align: 'left' });
        M.chips(ctx, lvl[0], { x: 60, y: 190, tw: 44, th: 34, color: function () { return TEAL; }, txt: function () { return '#0c1830'; }, size: 12 });
        H.txt(ctx, '前 2 位', 12, 247, { size: 10.5, color: FAINT, align: 'left' });
        M.chips(ctx, lvl[1], { x: 60, y: 232, tw: 44, th: 34, color: function () { return AMBER; }, txt: function () { return '#2a1c04'; }, size: 12 });
        H.txt(ctx, '前 3 位', 12, 289, { size: 10.5, color: FAINT, align: 'left' });
        M.chips(ctx, lvl[2], { x: 60, y: 274, tw: 52, th: 34, color: function () { return GREEN; }, txt: function () { return '#0c1830'; }, size: 12 });
        M.note(ctx, [
          { t: '计数', c: TEAL, rows: [['234 → 3³=27', TXT, true]] },
          { t: '优化', rows: [['结合字典剪枝：', DIM], ['前缀不在词典就停', DIM]] }
        ], 372, 190);
      } },
      { cap: '迭代版用"进位计数"：总组合数 answer 从 0 数到 ∏kᵢ−1，逐位取模即得字母 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '两种写法' }], '递归 ↔ 迭代');
        M.code(ctx, [
          ['迭代：total = ∏ kᵢ', TXT],
          ['for t in 0..total−1:', TEAL],
          ['  第 i 位 = letter[i][t%kᵢ]', TXT],
          ['  t = ⌊t / kᵢ⌋   // 逐位进位', AMBER, true],
          ['递归直观，迭代省栈', GREEN]
        ], 50, 70, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '本质', c: GREEN, rows: [['混合进制计数', TXT, true], ['每位基数 = kᵢ', TXT]] },
          { t: '应用', rows: [['号码记单词', DIM], ['密码字典生成', DIM]] }
        ], 372, 80);
      } }
    ] } });

  /* m41 · 计算字符串的相似度（编辑距离） */
  D({ g: g, no: 41, title: '字符串相似度', e: 'board', strat: 'DP·编辑距离', plain: '把"修改、插入、删除"各计一次操作，两串间的编辑距离越小越相似，相似度 = 1/(距离+1)。经典 DP：d[i][j] 由左、上、左上三格转移。',
    p: { steps: [
      { cap: '三种操作把 abc → cbc：替换 a→c 一步到位；距离越小越相似', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '替换' }, { sw: 'box', color: TEAL, txt: '插入' }, { sw: 'box', color: RED, txt: '删除' }], '目标：最少操作数');
        M.chips(ctx, ['a','b','c'], { x: 60, y: 80, tw: 46, th: 46, color: function (i) { return i === 0 ? AMBER : DIM; }, txt: function () { return '#2a1c04'; }, size: 18 });
        H.txt(ctx, 'abc', 60, 62, { size: 11, color: DIM, align: 'left' });
        M.arrow(ctx, 220, 104, 280, 104, GREEN, 3);
        M.chips(ctx, ['c','b','c'], { x: 300, y: 80, tw: 46, th: 46, color: function (i) { return i === 0 ? GREEN : DIM; }, txt: function () { return '#0c1830'; }, size: 18 });
        H.txt(ctx, 'cbc', 300, 62, { size: 11, color: DIM, align: 'left' });
        M.code(ctx, [
          ['相似度 = 1 / (距离 + 1)', TEAL, true]
        ], 60, 190, { size: 14, gap: 26 });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['最少几次操作', TXT], ['把 s1 变 s2？', TXT, true]] },
          { t: '例', rows: [['abc→cbc 距离 1', DIM]] }
        ], 372, 80);
      } },
      { cap: 'DP 表：d[i][j] = min(左+1, 上+1, 左上+不等)；abc→cbc 表尾 = 1', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: 'DP 路径' }], '填表');
        var rows = [[0,1,2,3],[1,1,2,3],[2,2,1,2],[3,3,2,1]];
        M.grid(ctx, rows, { x: 80, y: 60, cs: 52, fill: function (r, c) { return (r === 3 && c === 3) ? '#1e3a34' : (r === 0 || c === 0) ? '#12244a' : '#182148'; }, ring: function (r, c) { return (r === 3 && c === 3) ? GREEN : null; }, size: 16 });
        M.code(ctx, [
          ['列头: ∅ a b c  行头: ∅ c b c', DIM],
          ['d[i][j] = min(', TXT],
          ['  d[i−1][j]+1,      // 删除', RED],
          ['  d[i][j−1]+1,      // 插入', TEAL],
          ['  d[i−1][j−1]+cost) // 替换/匹配', AMBER, true]
        ], 320, 60, { size: 12, gap: 22 });
        M.note(ctx, [
          { t: '答案', c: GREEN, rows: [['d[3][3] = 1', GREEN, true]] }
        ], 330, 220);
      } },
      { cap: '编辑距离 O(nm) 填完，相似度 = 1/(1+1) = 0.5；拼写纠错、DNA 比对同源 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '应用' }], '结论');
        M.code(ctx, [
          ['distance(abc, cbc) = 1', GREEN, true],
          ['similarity = 1/(1+1) = 0.5', TEAL],
          ['拼写纠错：取距离最小的候选词', TXT],
          ['DNA：碱基序列比对（插入/突变）', TXT],
          ['空间可滚动数组优化到 O(min(n,m))', DIM]
        ], 50, 70, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['最优子结构：', TXT], ['末尾对齐三选一', TXT, true]] },
          { t: '同款', rows: [['最长公共子序列', DIM]] }
        ], 372, 80);
      } }
    ] } });

  /* m42 · 从无头单链表中删除节点 */
  D({ g: g, no: 42, title: '无头链表删节点', e: 'board', strat: '覆盖·后继替身', plain: '只给待删节点的指针、没有头结点也拿不到前驱，怎么删？把后继的数据覆盖进来，再跳过（删除）后继——用"替身"把 O(n) 找前驱变成 O(1)。尾巴节点无后继，只能特殊处理。',
    p: { steps: [
      { cap: '链 A→B→C→D：只拿到 B 的指针，没有头、找不到前驱 A', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '节点' }, { sw: 'box', color: AMBER, txt: '待删 B' }], '目标：O(1) 删 B');
        var v = ['A','B','C','D'];
        M.chips(ctx, v, { x: 70, y: 110, tw: 64, th: 52, color: function (i) { return i === 1 ? AMBER : TEAL; }, txt: function (i) { return i === 1 ? '#2a1c04' : '#0c1830'; }, size: 18 });
        for (var i = 0; i < 3; i++) M.arrow(ctx, 70 + (i + 1) * 64 + 6, 136, 70 + (i + 1) * 64 + 26, 136, DIM, 2);
        M.code(ctx, [['? → B → C   前驱不可达！', RED, true]], 70, 210, { size: 14, gap: 24 });
        M.note(ctx, [
          { t: '困境', c: RED, rows: [['改 A.next 需找 A', TXT], ['只能从头扫 O(n)', DIM]] },
          { t: '思路', rows: [['能不能不动 A？', AMBER, true]] }
        ], 372, 90);
      } },
      { cap: '把 C 的数据覆盖进 B，再删除 C：效果等同删了 B，O(1)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: '覆盖' }, { sw: 'box', color: RED, txt: '删 C' }], '替身法');
        var v = ['A','B→C','C','D'];
        M.chips(ctx, v, { x: 56, y: 90, tw: 78, th: 52, color: function (i) { return i === 1 ? GREEN : i === 2 ? RED : TEAL; }, txt: function (i) { return i === 2 ? '#2a0c0c' : '#0c1830'; }, size: 14 });
        for (var i = 0; i < 3; i++) M.arrow(ctx, 56 + (i + 1) * 78 + 4, 116, 56 + (i + 1) * 78 + 20, 116, DIM, 2);
        M.code(ctx, [
          ['B.data = B.next.data   // C 的值进 B', GREEN, true],
          ['tmp = B.next; B.next = tmp.next', TXT],
          ['free(tmp)              // 真正被删的是 C', AMBER]
        ], 56, 180, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '结果', c: GREEN, rows: [['A→B(C值)→D', TXT, true], ['序列上"B 没了"', TXT]] },
          { t: '复杂度', rows: [['O(1) 无需前驱', GREEN, true]] }
        ], 400, 90);
      } },
      { cap: '例外：B 是尾节点时无后继可覆盖，仍需 O(n) 找前驱或标记删除 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '边界' }], '尾巴怎么办');
        M.code(ctx, [
          ['if (B.next == NULL):', TXT],
          ['  只能从头找前驱 O(n)', RED],
          ['  或标懒删除、遍历时真删', AMBER],
          ['工程折中：尾删频率低，可接受', DIM],
          ['平均仍是 O(1)', GREEN, true]
        ], 50, 66, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['删不掉自己，', TXT], ['就删掉后继当替身', TXT, true]] },
          { t: '同款', rows: [['LeetCode 237', DIM]] }
        ], 372, 80);
      } }
    ] } });

  /* m43 · 最短摘要的生成 */
  D({ g: g, no: 43, title: '最短摘要生成', e: 'board', strat: '排序·滑动窗口', plain: '搜索引擎要从长文档里截一段同时包含全部关键词的最短文字做摘要。把每个关键词的出现位置收集起来按位置排序，然后滑动窗口：窗口内凑齐所有词就尝试收缩，记录最短的一段。',
    p: { steps: [
      { cap: '文档里三个关键词的位置：{A:2,10} {B:4,7} {C:6,12}，要找含 A、B、C 的最短区间', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: TEAL, txt: 'A' }, { sw: 'dot', color: AMBER, txt: 'B' }, { sw: 'dot', color: RED, txt: 'C' }], '目标：最短全覆盖段');
        var pos = [2, 4, 6, 7, 10, 12], who = ['A','B','C','B','A','C'];
        ctx.strokeStyle = 'rgba(148,163,184,.35)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(50, 150); ctx.lineTo(600, 150); ctx.stroke();
        pos.forEach(function (p, i) {
          var x = 50 + p * 44;
          var col = who[i] === 'A' ? TEAL : who[i] === 'B' ? AMBER : RED;
          ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, 150, 9, 0, 6.283); ctx.fill();
          ctx.fillStyle = col; ctx.font = 'bold 14px ' + H.txt; ctx.textAlign = 'center';
          ctx.fillText(who[i], x, 128);
          ctx.fillStyle = FAINT; ctx.font = '11px ' + H.mono; ctx.fillText(String(p), x, 176);
        });
        M.note(ctx, [
          { t: '收集', c: TEAL, rows: [['每词的所有位置', TXT], ['合成一个表', TXT, true]] },
          { t: '问', rows: [['最短区间含全部词', DIM]] }
        ], 372, 200);
      } },
      { cap: '按位置排序后滑动窗口：右扩到 [2,6] 首次凑齐 A、B、C，再收缩得最短 [2,6]', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: '窗口' }], '双指针');
        var srt = ['2A','4B','6C','7B','10A','12C'];
        M.chips(ctx, srt, { x: 46, y: 96, tw: 88, th: 44, color: function (i) { return i <= 2 ? GREEN : '#182148'; }, ring: function (i) { return i === 2 ? GREEN : null; }, size: 14 });
        M.code(ctx, [
          ['lo=0,hi 右扩直到窗口含全部词', TXT],
          ['再 lo 右缩，缩到刚好还齐 → 记录长度', TEAL, true],
          ['重复扩/缩直到 hi 到头', TXT],
          ['本例：[2,6] 首次凑齐且无法再缩', GREEN, true]
        ], 46, 180, { size: 12, gap: 23 });
        M.note(ctx, [
          { t: '不变量', c: GREEN, rows: [['窗口内词频计数', TXT], ['凑齐才收缩', TXT, true]] },
          { t: '复杂度', rows: [['O(P log P)', DIM]] }
        ], 372, 60);
      } },
      { cap: '最短全覆盖窗口即摘要：P 个位置排序 O(PlogP)，滑动扫描 O(P) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '流程' }], '结论');
        M.code(ctx, [
          ['1. 扫描文档收集 (位置, 关键词)', TXT],
          ['2. 按位置排序 → 一维点列', TXT],
          ['3. 双指针滑窗找最短全覆盖段', TEAL, true],
          ['4. 截取原文对应区间作摘要', GREEN],
          ['总 O(D + P log P)，D=文档长', DIM]
        ], 46, 64, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['二维选择问题', TXT], ['降成一维滑窗', TXT, true]] },
          { t: '同款', rows: [['最小覆盖子串', DIM]] }
        ], 372, 80);
      } }
    ] } });

  /* m44 · 编程判断两个链表是否相交 */
  D({ g: g, no: 44, title: '判断两链表相交', e: 'board', strat: '尾节点·双指针', plain: '两条单链表若相交，交点之后必然共享同一条尾巴。所以比一下尾节点是否同一个即可 O(n+m)；要找出交点，用双指针各走完自己的链再换到对方链上走，步数拉平后必在交点相遇。',
    p: { steps: [
      { cap: 'Y 形结构：A、B 两链若相交，交点后完全重合——尾巴是同一段', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '链 A' }, { sw: 'box', color: AMBER, txt: '链 B' }, { sw: 'box', color: GREEN, txt: '共享尾' }], '目标：判相交');
        var a = ['a1','a2','a3'], b = ['b1'], t = ['c1','c2'];
        M.chips(ctx, a, { x: 46, y: 70, tw: 58, th: 42, color: function () { return TEAL; }, txt: function () { return '#0c1830'; }, size: 13 });
        M.chips(ctx, b, { x: 46, y: 170, tw: 58, th: 42, color: function () { return AMBER; }, txt: function () { return '#2a1c04'; }, size: 13 });
        M.chips(ctx, t, { x: 330, y: 120, tw: 58, th: 42, color: function () { return GREEN; }, txt: function () { return '#0c1830'; }, size: 13 });
        M.arrow(ctx, 226, 91, 324, 133, DIM, 2);
        M.arrow(ctx, 110, 191, 324, 149, DIM, 2);
        M.note(ctx, [
          { t: '观察', c: GREEN, rows: [['单链表每节点', TXT], ['只有一个 next', TXT, true], ['相交必是 Y 形', TXT]] },
          { t: '推论', rows: [['尾节点必相同', AMBER, true]] }
        ], 470, 70, 160);
      } },
      { cap: '判定：各自走到尾比地址，同一即相交，O(n+m)、O(1)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '比尾巴' }], '方法一');
        M.code(ctx, [
          ['pa = headA; while pa.next: pa = pa.next', TXT],
          ['pb = headB; while pb.next: pb = pb.next', TXT],
          ['return pa == pb   // 地址相同即相交', GREEN, true],
          ['时间 O(n+m)，空间 O(1)', AMBER]
        ], 46, 80, { size: 12.5, gap: 27 });
        M.note(ctx, [
          { t: '为什么对', c: TEAL, rows: [['相交 → 共享尾', TXT], ['不相交 → 尾必不同', TXT, true]] },
          { t: '哈希法', rows: [['存 A 全部节点再扫 B', DIM], ['要 O(n) 空间，不如比尾', DIM]] }
        ], 372, 70);
      } },
      { cap: '找交点：pA 走完 A 接 B、pB 走完 B 接 A，路长拉平后恰在交点相遇 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '双指针' }], '方法二·交点');
        M.code(ctx, [
          ['pA = headA, pB = headB', TXT],
          ['同步走：到尾就换到对方头', TEAL],
          ['pA 共走 n+m 步，pB 也是 n+m', TXT],
          ['→ 尾部对齐，同时到达交点', GREEN, true],
          ['不相交则同时变 NULL 退出', DIM]
        ], 46, 64, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '妙处', c: GREEN, rows: [['不用先算长度差', TXT], ['路程自动拉平', TXT, true]] },
          { t: '同款', rows: [['LeetCode 160', DIM]] }
        ], 372, 80);
      } }
    ] } });
  /* m45 · 队列中取最大值操作问题 */
  D({ g: g, no: 45, title: '队列中取最大值', e: 'board', strat: '双栈/单调队列', plain: '设计一个队列，除了 enqueue/dequeue 还要 max() 取当前最大值，三个操作都要 O(1)（均摊）。用"带 max 的双栈"拼队列；滑动窗口最大值则用单调递减双端队列。',
    p: { steps: [
      { cap: '需求：enqueue、dequeue、max 三个操作都要 O(1)，普通队列 max 要 O(n)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '队列' }, { sw: 'box', color: AMBER, txt: '最大值' }], '目标：O(1) max');
        M.chips(ctx, [3, 1, 4, 2], { x: 70, y: 100, tw: 56, th: 48, color: function (i, v) { return v === 4 ? AMBER : '#182148'; }, ring: function (i, v) { return v === 4 ? AMBER : null; }, size: 18 });
        M.code(ctx, [
          ['enqueue(x)  O(1)', TXT],
          ['dequeue()   O(1)', TXT],
          ['max()       O(1) ← 难！', AMBER, true]
        ], 70, 190, { size: 13.5, gap: 26 });
        M.note(ctx, [
          { t: '朴素', c: RED, rows: [['扫一遍 O(n)', DIM]] },
          { t: '思路', rows: [['栈能 O(1) 带 max，', TXT], ['队列=两个栈？', TXT, true]] }
        ], 372, 90);
      } },
      { cap: '双栈法：栈每层记"到目前为止的 max"；队列入 A 栈、出队借 B 栈倒腾，均摊 O(1)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '入队栈 A' }, { sw: 'box', color: GREEN, txt: '出队栈 B' }], '每层附带 max');
        var stk = [['3','3'],['1','3'],['4','4'],['2','4']];
        stk.forEach(function (r, i) {
          var y = 210 - i * 42;
          ctx.fillStyle = '#182148'; ctx.strokeStyle = TEAL; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.rect(70, y - 34, 64, 36); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#e8ecf8'; ctx.font = 'bold 15px ' + H.mono; ctx.textAlign = 'center';
          ctx.fillText(r[0], 102, y - 11);
          ctx.fillStyle = AMBER; ctx.font = '11px ' + H.mono;
          ctx.fillText('max ' + r[1], 176, y - 11);
        });
        H.txt(ctx, '栈 A（底→顶）', 70, 232, { size: 10.5, color: DIM, align: 'left' });
        M.code(ctx, [
          ['push(x): 存 (x, max(x, 栈顶max))', TEAL],
          ['max() = max(A顶max, B顶max)', GREEN, true],
          ['dequeue: B 空则把 A 全倒进 B', TXT],
          ['每元素至多倒一次 → 均摊 O(1)', AMBER]
        ], 260, 80, { size: 12, gap: 24 });
        M.note(ctx, [
          { t: '为什么对', c: TEAL, rows: [['倒栈后顺序恰好', TXT], ['变成出队顺序', TXT, true]] }
        ], 268, 200, 220);
      } },
      { cap: '滑动窗口最大值：单调递减双端队列，新元素进来先淘汰队尾所有比它小的 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: '单调队列' }], '窗口 max O(1)');
        M.chips(ctx, [3, 1, 4, 2, 1, 5], { x: 46, y: 70, tw: 44, th: 40, color: function (i) { return (i >= 1 && i <= 3) ? '#1e3a34' : '#182148'; }, ring: function (i) { return i === 2 ? GREEN : null; }, size: 15 });
        M.code(ctx, [
          ['窗口宽 3 → max 序列: 3,4,4,4,5', TXT],
          ['deque 存下标，保持值递减', TEAL],
          ['新进 x：队尾所有 < x 的先弹出', TXT],
          ['（它们永远没机会当 max 了）', AMBER, true],
          ['队首过期（出窗口）也弹；每元素进出各一次 O(n)', GREEN]
        ], 46, 150, { size: 12, gap: 23 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['淘汰"又小又老"', TXT], ['的候选者', TXT, true]] },
          { t: '同款', rows: [['LeetCode 239', DIM]] }
        ], 372, 70);
      } }
    ] } });

  /* m46 · 求二叉树中节点的最大距离 */
  D({ g: g, no: 46, title: '二叉树最大距离', e: 'board', strat: '树形 DP·直径', plain: '把二叉树看成一个图，求相距最远的两个节点的路径长（树的直径）。递归时每个节点返回"向下最深的叶子距离"，同时用"左深+右深"更新全局最大距离——一趟后序遍历 O(n) 搞定。',
    p: { steps: [
      { cap: '最大距离 = 树中最长的一条路径（树的直径），不一定过根', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '最长路径' }], '目标：树的直径');
        function node(x, y, label, col) { H.circle(ctx, x, y, 16, col || '#273469', DIM); H.txt(ctx, label, x, y + 1, { size: 12, bold: true, color: '#e8ecf8' }); }
        H.line(ctx, 170, 90, 110, 150, GREEN, 3); H.line(ctx, 170, 90, 230, 150, DIM, 2);
        H.line(ctx, 110, 150, 70, 215, GREEN, 3); H.line(ctx, 110, 150, 150, 215, GREEN, 3);
        H.line(ctx, 70, 215, 50, 275, GREEN, 3);
        node(170, 90, 'A'); node(110, 150, 'B', '#1e3a34'); node(230, 150, 'C');
        node(70, 215, 'D', '#1e3a34'); node(150, 215, 'E', '#1e3a34'); node(50, 275, 'F', '#1e3a34');
        M.note(ctx, [
          { t: '例', c: GREEN, rows: [['F→D→B→E', TXT, true], ['长度 3 条边', TXT]] },
          { t: '注意', rows: [['路径未必过根 A', AMBER, true]] }
        ], 372, 80);
      } },
      { cap: '后序递归：返回 depth(向下最深)，顺手用 左深+右深 更新全局直径', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: 'depth 上传' }, { sw: 'line', color: GREEN, txt: '直径候选' }], '一趟遍历');
        M.code(ctx, [
          ['int depth(node):', TXT],
          ['  if !node: return −1', DIM],
          ['  L = depth(left); R = depth(right)', TXT],
          ['  best = max(best, L + R + 2)', GREEN, true],
          ['  return max(L, R) + 1   // 上传深度', TEAL],
          ['best 即最大距离，O(n) 一趟', AMBER]
        ], 46, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '关键', c: TEAL, rows: [['每个节点只管', TXT], ['"经过我的最长路"', TXT, true]] },
          { t: '分解', rows: [['路径必在某个节点', DIM], ['左右各下一段拼成', DIM]] }
        ], 372, 70);
      } },
      { cap: '信息只上传"深度"一个数，直径在递归里就地更新——O(n) 时间 O(树高) 栈 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '结论' }], '树形 DP 模板');
        M.code(ctx, [
          ['上传值：depth（单链信息）', TEAL],
          ['全局量：best = max(L+R+2)', GREEN, true],
          ['避免重复计算：不回头扫子树', TXT],
          ['同款：树的直径、最大路径和、', DIM],
          ['      House Robber III 都是这套', DIM]
        ], 50, 70, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['返回值与目标值', TXT], ['分离设计', TXT, true]] },
          { t: '对比', rows: [['暴力双 DFS 也 O(n)', DIM], ['但递归一趟更优雅', DIM]] }
        ], 372, 80);
      } }
    ] } });

  /* m47 · 重建二叉树 */
  D({ g: g, no: 47, title: '重建二叉树', e: 'board', strat: '分治·前序+中序', plain: '由前序（根左右）和中序（左根右）唯一确定一棵二叉树：前序首元素是根，在中序里找到根就把序列切成左右子树，递归即可。后序+中序同理；前序+后序不行（无法区分单子树方向）。',
    p: { steps: [
      { cap: '前序 a,b,d,e,c,f；中序 d,b,e,a,f,c —— 前序第一个 a 必是根', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '根' }, { sw: 'box', color: TEAL, txt: '左子树' }, { sw: 'box', color: GREEN, txt: '右子树' }], '目标：还原树');
        M.chips(ctx, ['a','b','d','e','c','f'], { x: 46, y: 62, tw: 44, th: 40, color: function (i) { return i === 0 ? AMBER : '#182148'; }, size: 15 });
        H.txt(ctx, '前序 根左右', 46, 46, { size: 10.5, color: DIM, align: 'left' });
        M.chips(ctx, ['d','b','e','a','f','c'], { x: 46, y: 158, tw: 44, th: 40, color: function (i) { return i === 3 ? AMBER : i < 3 ? TEAL : GREEN; }, txt: function (i) { return i === 3 ? '#2a1c04' : i < 3 ? '#0c1830' : '#0c1830'; }, size: 15 });
        H.txt(ctx, '中序 左根右：根把序列切成两半', 46, 142, { size: 10.5, color: DIM, align: 'left' });
        M.note(ctx, [
          { t: '切分', c: TEAL, rows: [['左子树中序 d,b,e', TXT], ['右子树中序 f,c', TXT, true]] },
          { t: '同步', rows: [['前序也按个数切：', DIM], ['b,d,e | c,f', DIM]] }
        ], 372, 70);
      } },
      { cap: '递归：对每个子序列重复"首元素为根、中序切分"，直到序列为空', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '递归' }], '分治');
        M.code(ctx, [
          ['build(pre, ino):', TXT],
          ['  if pre 空: return null', DIM],
          ['  root = pre[0]; k = ino 中 root 位置', AMBER],
          ['  root.L = build(pre[1..k], ino[0..k−1])', TEAL, true],
          ['  root.R = build(pre[k+1..], ino[k+1..])', GREEN, true],
          ['哈希存中序下标 → O(n)', DIM]
        ], 46, 52, { size: 12, gap: 24 });
        M.note(ctx, [
          { t: '本例', c: TEAL, rows: [['左：前 b,d,e', TXT], ['   中 d,b,e → b 根', TXT], ['右：前 c,f', TXT], ['   中 f,c → c 根', TXT, true]] }
        ], 372, 60);
      } },
      { cap: '还原结果：a(b(d,e), c(f,∅))；前序+后序不能唯一确定，必须有中序 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '重建完成' }], '结论');
        function nd(x, y, label) { H.circle(ctx, x, y, 15, '#273469', DIM); H.txt(ctx, label, x, y + 1, { size: 12, bold: true, color: '#e8ecf8' }); }
        H.line(ctx, 160, 80, 105, 140, DIM, 2); H.line(ctx, 160, 80, 215, 140, DIM, 2);
        H.line(ctx, 105, 140, 65, 200, DIM, 2); H.line(ctx, 105, 140, 145, 200, DIM, 2);
        H.line(ctx, 215, 140, 250, 200, DIM, 2);
        nd(160, 80, 'a'); nd(105, 140, 'b'); nd(215, 140, 'c'); nd(65, 200, 'd'); nd(145, 200, 'e'); nd(250, 200, 'f');
        M.code(ctx, [
          ['前序+中序 → 唯一 ✓', GREEN, true],
          ['后序+中序 → 唯一 ✓', GREEN],
          ['前序+后序 → 不唯一 ✗', RED, true],
          ['（单子树时分不清左右）', DIM]
        ], 320, 80, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '复杂度', c: TEAL, rows: [['O(n) 时间', TXT, true], ['O(n) 哈希+栈', TXT]] }
        ], 330, 220);
      } }
    ] } });

  /* m48 · 分层遍历二叉树 */
  D({ g: g, no: 48, title: '分层遍历二叉树', e: 'board', strat: 'BFS·队列/双队列', plain: '按层从上到下、层内从左到右访问二叉树（广度优先）。单队列法：出队一个就把它的孩子入队；要知道"层边界"，可记下每层开头时的队列长度，或用两个队列一层一倒。',
    p: { steps: [
      { cap: '目标：逐层输出 a | b,c | d,e,f —— 深度优先的递归做不到"按层"', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '层序' }], '目标：BFS 分层');
        function nd(x, y, label) { H.circle(ctx, x, y, 15, '#273469', TEAL); H.txt(ctx, label, x, y + 1, { size: 12, bold: true, color: '#e8ecf8' }); }
        H.line(ctx, 170, 80, 110, 145, DIM, 2); H.line(ctx, 170, 80, 230, 145, DIM, 2);
        H.line(ctx, 110, 145, 70, 210, DIM, 2); H.line(ctx, 110, 145, 150, 210, DIM, 2);
        H.line(ctx, 230, 145, 260, 210, DIM, 2);
        nd(170, 80, 'a'); nd(110, 145, 'b'); nd(230, 145, 'c'); nd(70, 210, 'd'); nd(150, 210, 'e'); nd(260, 210, 'f');
        M.code(ctx, [
          ['层 0: a', TEAL],
          ['层 1: b c', TEAL],
          ['层 2: d e f', TEAL, true]
        ], 350, 90, { size: 13.5, gap: 28 });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['DFS 一条道走到黑', TXT], ['无法按层输出', TXT, true]] },
          { t: '工具', rows: [['队列 FIFO', DIM]] }
        ], 452, 160, 172);
      } },
      { cap: '单队列：根入队；每次出队一个、孩子入队；记下每层开头的队长即层边界', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '队列' }, { sw: 'box', color: GREEN, txt: '已输出' }], 'BFS');
        M.chips(ctx, ['d','e','f'], { x: 60, y: 90, tw: 50, th: 42, color: function () { return TEAL; }, txt: function () { return '#0c1830'; }, size: 15 });
        H.txt(ctx, '处理完 b、c 后的队列（恰好是下一层）', 60, 72, { size: 10.5, color: DIM, align: 'left' });
        M.code(ctx, [
          ['q = [root]', TXT],
          ['while q 非空:', TEAL],
          ['  n = len(q)        // 本层个数', AMBER, true],
          ['  循环 n 次：出队、输出、孩子入队', TXT],
          ['  → 每轮外循环恰是一层', GREEN]
        ], 60, 170, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '关键', c: AMBER, rows: [['层初的队长', TXT], ['= 本层节点数', TXT, true]] },
          { t: '双队列法', rows: [['当前层/下层各一队', DIM], ['倒空即换行，等价', DIM]] }
        ], 372, 80);
      } },
      { cap: '每个节点进出队各一次，O(n)；递归版按深度 dfs(node,k) 逐层调用则 O(n×高) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '对比' }], '结论');
        M.code(ctx, [
          ['队列 BFS：O(n)，天然按层', GREEN, true],
          ['递归 dfs(node, k) 打印第 k 层：', TXT],
          ['  每层全树扫一遍 → O(n×高)', AMBER],
          ['应用：最短路径、目录扫描、', DIM],
          ['     家族树辈分输出、网络广播', DIM]
        ], 46, 66, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['FIFO 保证', TXT], ['浅层先于深层', TXT, true]] },
          { t: '扩展', rows: [['锯齿层序：偶层反转', DIM]] }
        ], 372, 80);
      } }
    ] } });

  /* m49 · 程序改错 */
  D({ g: g, no: 49, title: '程序改错', e: 'board', strat: '边界·溢出·指针', plain: '面试常给一段"看起来对"的代码找 bug。高频雷区：无符号数倒着数（永远不为负→死循环）、二分中点相加溢出、数组差一、strcpy 参数顺序、野指针/双重释放。改错的关键是先找不变量、再卡边界。',
    p: { steps: [
      { cap: '雷区①：unsigned 倒计数——i>=0 永远成立，死循环！', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '有 bug' }, { sw: 'box', color: GREEN, txt: '修复' }], '类型陷阱');
        M.code(ctx, [
          ['unsigned i = 10;', RED],
          ['while (i >= 0) {   // 永远为真！', RED, true],
          ['  printf("%u", i); i--;', RED],
          ['}  // i-- 到 0 再减 → 回绕 4294967295', DIM],
          ['', TXT],
          ['修：for (int i = 10; i >= 0; i--)', GREEN, true],
          ['或：do…while (i--); 用有符号/改条件', GREEN]
        ], 46, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '原理', c: RED, rows: [['无符号数没有负', TXT], ['回绕成最大正数', TXT, true]] },
          { t: '预防', rows: [['倒计数用有符号', DIM], ['或 while(i) 先减后用', DIM]] }
        ], 392, 60, 232);
      } },
      { cap: '雷区②：二分 mid=(lo+hi)/2 在 lo+hi 超 int 上限时溢出变负', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '溢出' }, { sw: 'box', color: GREEN, txt: '修复' }], '数值陷阱');
        M.code(ctx, [
          ['int mid = (lo + hi) / 2;   // 可能溢出！', RED, true],
          ['lo=20亿, hi=20亿 → 和超 int32 → 负数', DIM],
          ['', TXT],
          ['int mid = lo + (hi − lo) / 2;  // 安全', GREEN, true],
          ['或：int mid = (lo + hi) >>> 1;  // Java 无符号右移', GREEN]
        ], 46, 70, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '同款', c: AMBER, rows: [['数组差一：i<n 还是 i<=n', TXT], ['strcpy(dst,src) 别写反', TXT, true]] },
          { t: '后果', rows: [['越界写、段错误、', DIM], ['安全漏洞', DIM]] }
        ], 372, 80);
      } },
      { cap: '改错方法论：找不变量 → 卡边界（空/单/满） → 查类型与溢出 → 手动模拟一遍 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '方法论' }], '结论');
        M.code(ctx, [
          ['1. 不变量：循环每轮什么保持成立？', TXT],
          ['2. 边界：n=0、1、最大值各跑一遍脑内', TXT],
          ['3. 类型：无符号？溢出？隐式转换？', TXT],
          ['4. 指针：野指针、双重释放、返回栈地址', TXT],
          ['5. 模拟：拿小例子手动执行验证', TEAL, true]
        ], 46, 66, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['bug 藏在边界', TXT], ['与类型里', TXT, true]] },
          { t: '工程', rows: [['断言/静态分析', DIM], ['单测卡边界用例', DIM]] }
        ], 372, 80);
      } }
    ] } });
  /* m50 · 金刚坐飞机问题 */
  D({ g: g, no: 50, title: '金刚坐飞机', e: 'board', strat: '概率·递归', plain: '100 个座位，第 1 位乘客（金刚）随机乱坐，之后每人对号入座、发现被占就随机挑一个空位。问最后一位乘客坐到自己座位的概率？递推可证：恒为 1/2，与人数无关。',
    p: { steps: [
      { cap: '金刚先乱坐：坐到 1 号→全员正常；坐到 100 号→末位必完；坐其它→问题缩小重演', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: RED, txt: '金刚乱坐' }, { sw: 'box', color: TEAL, txt: '座位' }], '目标：P(末位对号)');
        var seats = [];
        for (var i = 1; i <= 8; i++) seats.push(i === 1 ? '金' : String(i));
        M.chips(ctx, seats, { x: 46, y: 90, tw: 44, th: 42, color: function (i, v) { return v === '金' ? RED : v === '8' ? AMBER : '#182148'; }, txt: function (i, v) { return v === '金' ? '#2a0c0c' : '#e8ecf8'; }, size: 15 });
        H.txt(ctx, '…共 100 座（图中省略），末位乘客盯着 100 号座', 46, 74, { size: 10.5, color: DIM, align: 'left' });
        M.code(ctx, [
          ['金刚坐 1 号 → 人人对号 → 末位 ✓', GREEN],
          ['金刚坐 100 号 → 末位必完 ✗', RED],
          ['金刚坐 k 号 → 2..k−1 正常，第 k 人变"新金刚"', AMBER, true]
        ], 46, 170, { size: 12, gap: 24 });
        M.note(ctx, [
          { t: '关键', c: AMBER, rows: [['问题会"传染"：', TXT], ['被占座的人接手乱坐', TXT, true]] },
          { t: '问', rows: [['P(100) = ?', DIM]] }
        ], 400, 90, 224);
      } },
      { cap: '递推：P(n) = 1/n + (1/n)ΣP(n−k+1)；手算 P(2)=1/2、P(3)=1/2，猜想恒 1/2', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '递推' }], '分类讨论');
        M.code(ctx, [
          ['P(n) = 1/n·1            坐自己座', GREEN],
          ['     + 1/n·0            坐末位座', RED],
          ['     + Σ (1/n)·P(n−k+1)  坐 k 号，问题缩小', AMBER],
          ['P(2) = 1/2；P(3) = 1/3+1/3·1/2+1/3·… = 1/2', TXT],
          ['归纳：若小于 n 的都是 1/2 → P(n) = 1/2', TEAL, true]
        ], 46, 60, { size: 12, gap: 25 });
        M.note(ctx, [
          { t: '巧证', c: GREEN, rows: [['金刚与末位地位对称：', TXT], ['1 号座与 100 号座', TXT], ['谁先被坐定胜负，', TXT, true], ['各 1/2', TXT, true]] },
          { t: '验证', rows: [['蒙特卡洛模拟→ 0.5', DIM]] }
        ], 392, 56, 232);
      } },
      { cap: '答案：无论 2 人还是 100 人，末位对号概率恒为 1/2 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '结论' }], '与 n 无关');
        M.code(ctx, [
          ['P(n) ≡ 1/2  (n ≥ 2)', GREEN, true],
          ['对称性：1 号座和 n 号座', TXT],
          ['被"随机坐中"的机会均等，', TXT],
          ['先被坐中的那个决定成败', TEAL, true],
          ['推广：第 k 位对号概率也可递推', DIM]
        ], 50, 70, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['找到"对称的两座"', TXT], ['把复杂过程坍缩', TXT, true]] },
          { t: '启示', rows: [['概率题先找不变量', DIM]] }
        ], 372, 80);
      } }
    ] } });

  /* m51 · 瓷砖覆盖地板 */
  D({ g: g, no: 51, title: '瓷砖覆盖地板', e: 'board', strat: '递推·斐波那契', plain: '用 1×2 瓷砖盖满 2×n 地板有多少种盖法？看最左端：竖放一块剩 2×(n−1)，横放必成对剩 2×(n−2)——于是 f(n)=f(n−1)+f(n−2)，就是斐波那契。改用 L 形三连块盖 2×n（n 偶）则另有递推。',
    p: { steps: [
      { cap: '2×n 地板 + 1×2 瓷砖：n=1 只有 1 种，n=2 有 2 种（竖竖 / 横横）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '竖放' }, { sw: 'box', color: AMBER, txt: '横放' }], '目标：计数 f(n)');
        H.txt(ctx, 'n=1：1 种', 100, 62, { size: 10.5, color: DIM });
        M.grid(ctx, [['', ''], ['', '']], { x: 60, y: 80, cs: 40, fill: function () { return '#1e3a34'; } });
        H.txt(ctx, 'n=2：竖竖', 200, 62, { size: 10.5, color: DIM });
        M.grid(ctx, [['', '', '', ''], ['', '', '', '']], { x: 160, y: 80, cs: 20, fill: function (r, c) { return c < 2 ? '#1e3a34' : '#182148'; } });
        H.txt(ctx, 'n=2：横横', 200, 140, { size: 10.5, color: DIM });
        M.grid(ctx, [['', '', '', ''], ['', '', '', '']], { x: 160, y: 156, cs: 20, fill: function (r, c) { return r === 0 ? '#3a2f14' : '#4a3c18'; } });
        M.code(ctx, [
          ['f(1)=1  f(2)=2', TXT],
          ['f(3)=3  f(4)=5 …', TEAL]
        ], 280, 90, { size: 13, gap: 26 });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['盖满 2×n 有', TXT], ['多少种方案？', TXT, true]] },
          { t: '思路', rows: [['看最左端怎么放', DIM]] }
        ], 400, 80, 224);
      } },
      { cap: '最左端二选一：竖放→剩 f(n−1)；横放必成对→剩 f(n−2)；f(n)=f(n−1)+f(n−2)', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '竖' }, { sw: 'box', color: AMBER, txt: '横对' }], '分类递推');
        M.grid(ctx, [['','','',''],['','','','']], { x: 56, y: 84, cs: 34, fill: function (r, c) { return c === 0 ? '#1e3a34' : '#182148'; } });
        H.txt(ctx, '竖放 → 2×(n−1)', 56, 170, { size: 11, color: TEAL, align: 'left' });
        M.grid(ctx, [['','','',''],['','','','']], { x: 220, y: 84, cs: 34, fill: function (r, c) { return c < 2 ? (r === 0 ? '#3a2f14' : '#4a3c18') : '#182148'; } });
        H.txt(ctx, '横放成对 → 2×(n−2)', 220, 170, { size: 11, color: AMBER, align: 'left' });
        M.code(ctx, [
          ['f(n) = f(n−1) + f(n−2)', GREEN, true],
          ['= Fib(n+1)：1,2,3,5,8,13…', TEAL]
        ], 56, 210, { size: 13.5, gap: 28 });
        M.note(ctx, [
          { t: '为什么成对', c: AMBER, rows: [['横瓷砖上下必须', TXT], ['叠两块才齐平', TXT, true]] },
          { t: '同款', rows: [['爬楼梯、兔子繁殖', DIM]] }
        ], 400, 80, 224);
      } },
      { cap: '若换 L 形三连块盖 2×n（n 偶）：f(n)=f(n−2)+2g(n−1) 联立辅助序列，仍是线性递推 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '推广' }], '结论');
        M.code(ctx, [
          ['1×2 瓷砖：f(n) = Fib(n+1)', GREEN, true],
          ['L 形三连块（2×n，n 偶）：', TXT],
          ['  f(n)=f(n−2)+2g(n−1)', TEAL],
          ['  g(n)=f(n−1)+g(n−2)  （缺口状态）', TEAL],
          ['f(2)=3, f(4)=11, f(6)=41 …', AMBER],
          ['矩阵快速幂可 O(logn)', DIM]
        ], 46, 60, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['按"最左缺口"', TXT], ['分类→线性递推', TXT, true]] },
          { t: '应用', rows: [['铺砖/拼图计数', DIM], ['统计物理二聚体模型', DIM]] }
        ], 372, 70);
      } }
    ] } });

  /* m52 · 买票找零 */
  D({ g: g, no: 52, title: '买票找零', e: 'board', strat: 'Catalan 数', plain: '2n 人排队买 5 元票，一半持 5 元一半持 10 元，售票处开始时没钱。任何时刻收的 10 元不能超过 5 元（否则找不开），问合法排队方案数——答案恰是 Catalan 数 C(2n,n)/(n+1) 乘两组内部排列。',
    p: { steps: [
      { cap: '持 5 元记 +1、持 10 元记 −1：任何前缀和 ≥ 0 才能随时找零', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '5 元 +1' }, { sw: 'box', color: RED, txt: '10 元 −1' }], '目标：合法序列数');
        M.chips(ctx, ['+1','+1','−1','+1','−1','−1'], { x: 46, y: 96, tw: 64, th: 46, color: function (i, v) { return v === '+1' ? '#1e3a34' : '#3d2145'; }, size: 16 });
        H.txt(ctx, '前缀和：1, 2, 1, 2, 1, 0 —— 全程 ≥ 0 ✓ 合法', 46, 170, { size: 12, color: GREEN, align: 'left' });
        M.chips(ctx, ['−1','+1','+1','−1','+1','−1'], { x: 46, y: 210, tw: 64, th: 46, color: function (i, v) { return v === '+1' ? '#1e3a34' : '#3d2145'; }, ring: function (i) { return i === 0 ? RED : null; }, size: 16 });
        H.txt(ctx, '开头就 −1 → 找不开 ✗', 46, 282, { size: 12, color: RED, align: 'left' });
        M.note(ctx, [
          { t: '转化', c: TEAL, rows: [['排队序列 →', TXT], ['±1 路径不穿横轴', TXT, true]] },
          { t: '规模', rows: [['n 对 5/10 元', DIM]] }
        ], 460, 90, 164);
      } },
      { cap: '反射法：非法路径首次碰到 −1 处翻转前缀，与"多一个 −1"的全排列一一对应', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '合法' }, { sw: 'line', color: RED, txt: '非法↔反射' }], '计数');
        M.code(ctx, [
          ['总数（无限制）：C(2n, n)', TXT],
          ['非法数 = C(2n, n−1)   ← 反射原理', RED],
          ['  首次跌破处翻转前缀：', DIM],
          ['  非法路径 ↔ (n−1)个+1、(n+1)个−1 的全排列', DIM],
          ['合法 = C(2n,n) − C(2n,n−1)', GREEN, true],
          ['     = C(2n,n) / (n+1)  ← Catalan 数', TEAL, true]
        ], 46, 60, { size: 12, gap: 25 });
        M.note(ctx, [
          { t: '例 n=10', c: AMBER, rows: [['Catalan = 16796', TXT, true], ['× 两组内部排列', TXT], ['(10!)² → 总方案', TXT]] },
          { t: '同款', rows: [['括号匹配、栈序列、', DIM], ['凸多边形三角剖分', DIM]] }
        ], 400, 70, 224);
      } },
      { cap: '答案：Catalan(n)×n!×n!；括号匹配、出栈序列、二叉树计数都是同一个数列 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: 'Catalan 家族' }], '结论');
        M.code(ctx, [
          ['Cat(n) = C(2n,n)/(n+1)', GREEN, true],
          ['1, 1, 2, 5, 14, 42, 132, 429, 1430…', TXT],
          ['n 对括号合法匹配数 = Cat(n)', TEAL],
          ['1..n 出栈序列数 = Cat(n)', TEAL],
          ['n+2 边形三角剖分数 = Cat(n)', TEAL],
          ['n 节点不同构 BST 数 = Cat(n)', TEAL]
        ], 46, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['"前缀和≥0"的计数', TXT], ['都是 Catalan', TXT, true]] },
          { t: '递推', rows: [['Cat(n)=ΣCat(i)Cat(n−1−i)', DIM]] }
        ], 392, 70, 232);
      } }
    ] } });

  /* m53 · 点是否在三角形内 */
  D({ g: g, no: 53, title: '点在三角形内', e: 'board', strat: '叉积·同侧法', plain: '判断点 P 是否在三角形 ABC 内：沿 AB、BC、CA 走一圈，若 P 始终在三条边的同一侧（叉积符号一致），就在内部。面积法（三小三角形面积和等于大三角形）与重心坐标法同理。',
    p: { steps: [
      { cap: '直观：P 在内 → 与第三个顶点总在每条边的同侧；叉积符号判同侧', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: GREEN, txt: 'P 在内' }, { sw: 'dot', color: RED, txt: 'Q 在外' }], '目标：判定');
        function tri() {
          ctx.strokeStyle = TEAL; ctx.lineWidth = 2; ctx.beginPath();
          ctx.moveTo(120, 60); ctx.lineTo(60, 220); ctx.lineTo(240, 200); ctx.closePath(); ctx.stroke();
        }
        tri();
        H.txt(ctx, 'A', 120, 48, { size: 13, bold: true, color: TXT });
        H.txt(ctx, 'B', 46, 232, { size: 13, bold: true, color: TXT });
        H.txt(ctx, 'C', 252, 204, { size: 13, bold: true, color: TXT });
        H.circle(ctx, 130, 160, 6, GREEN, null); H.txt(ctx, 'P', 146, 160, { size: 13, bold: true, color: GREEN, align: 'left' });
        H.circle(ctx, 280, 100, 6, RED, null); H.txt(ctx, 'Q', 296, 100, { size: 13, bold: true, color: RED, align: 'left' });
        M.note(ctx, [
          { t: '叉积', c: TEAL, rows: [['cross(AB,AP) 的符号', TXT], ['= P 在 AB 哪一侧', TXT, true]] },
          { t: '判定', rows: [['对三边符号全一致', GREEN, true], ['→ 在内部', TXT]] },
          { t: 'Q', rows: [['对 AC 异侧 → 外', RED]] }
        ], 372, 60);
      } },
      { cap: '面积法同理：S(PAB)+S(PBC)+S(PCA) == S(ABC) 则在内（浮点要留容差）', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '面积法' }], '方法二');
        ctx.strokeStyle = TEAL; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(120, 60); ctx.lineTo(60, 220); ctx.lineTo(240, 200); ctx.closePath(); ctx.stroke();
        [[120,60],[60,220],[240,200]].forEach(function (p) { H.line(ctx, 130, 160, p[0], p[1], AMBER, 1.5); });
        H.circle(ctx, 130, 160, 6, GREEN, null);
        M.code(ctx, [
          ['S = |cross| / 2', TXT],
          ['S(PAB)+S(PBC)+S(PCA)', TEAL],
          ['   == S(ABC) → 在内', GREEN, true],
          ['P 在外时三面积和 > 总面积', RED],
          ['浮点比较要加 eps', DIM]
        ], 300, 80, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '对比', c: AMBER, rows: [['同侧法只用符号，', TXT], ['免开方免容差，', TXT, true], ['工程首选', TXT]] }
        ], 310, 230, 220);
      } },
      { cap: '重心坐标法：P = αA+βB+γC，α,β,γ ≥ 0 且和为 1 即在内；三法都是 O(1) ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '三法' }], '结论');
        M.code(ctx, [
          ['① 同侧法：三叉积符号一致 O(1)', GREEN, true],
          ['② 面积法：三小块面积和==大块 O(1)', TEAL],
          ['③ 重心坐标：α,β,γ≥0 且和=1 O(1)', TEAL],
          ['推广：凸多边形 → 逐边同侧检查', TXT],
          ['任意多边形 → 射线法（奇偶交叉）', AMBER]
        ], 46, 66, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '应用', c: GREEN, rows: [['光栅化像素判定', TXT], ['GIS 点在区域', TXT], ['碰撞检测', TXT, true]] },
          { t: '思想', rows: [['符号比数值稳', DIM]] }
        ], 392, 80, 232);
      } }
    ] } });

  /* m54 · 磁带文件存放优化 */
  D({ g: g, no: 54, title: '磁带文件存放优化', e: 'board', strat: '贪心·交换论证', plain: '磁带上顺序存 n 个文件，读第 i 个要扫过它前面所有长度。最小化平均读取时间：按"访问频率/长度"降序排列。交换相邻逆序对必不变更优——交换论证证明贪心最优。',
    p: { steps: [
      { cap: '磁带只能顺序读：读文件 i 的代价 = 它及其前面所有文件长度之和', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '文件' }], '目标：最小化平均读取时间');
        var v = ['f1', 'f2', 'f3', 'f4'];
        M.chips(ctx, v, { x: 60, y: 90, tw: 70, th: 46, labels: ['L=10', 'L=8', 'L=6', 'L=4'], size: 15 });
        for (var i = 0; i < 3; i++) M.arrow(ctx, 60 + (i + 1) * 70 + 4, 113, 60 + (i + 1) * 70 + 16, 113, DIM, 2);
        M.code(ctx, [
          ['读 f3 要扫过 f1+f2+f3 = 24', TXT],
          ['总代价 = Σ pᵢ × (前缀长度和)', AMBER, true],
          ['pᵢ = 访问频率', DIM]
        ], 60, 200, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['按什么顺序存', TXT], ['平均读取最快？', TXT, true]] },
          { t: '直觉', rows: [['常用又短的靠前', DIM]] }
        ], 400, 90, 224);
      } },
      { cap: '交换论证：相邻逆序对 (A,B) 若 pA/LA < pB/LB，交换后总代价严格下降', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: TEAL, txt: '交换前后' }], '证明');
        M.code(ctx, [
          ['交换前局部代价（S=前缀长度）：', DIM],
          ['…(S+LA)·pA + (S+LA+LB)·pB', TXT],
          ['…(S+LB)·pB + (S+LB+LA)·pA  交换后', TXT],
          ['差值 = LA·pB − LB·pA', AMBER, true],
          ['pA/LA < pB/LB → 差>0 → 交换更优', GREEN, true],
          ['∴ 最优排列按 p/L 降序（比值贪心）', TEAL, true]
        ], 46, 56, { size: 12, gap: 24 });
        M.note(ctx, [
          { t: '例', c: TEAL, rows: [['f1: p=1,L=10 → 0.10', TXT], ['f3: p=5,L=6 → 0.83', TXT, true], ['f3 应排最前', GREEN]] },
          { t: '思想', rows: [['逆序对必可改进', DIM], ['→ 有序即最优', DIM]] }
        ], 400, 60, 224);
      } },
      { cap: '按 pᵢ/Lᵢ 降序存即可，排序 O(nlogn)；同款比值贪心还有调度最小化平均完成时间 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '结论' }], '贪心成立');
        M.code(ctx, [
          ['排序键 = 频率/长度，降序', GREEN, true],
          ['总代价 = Σᵢ pᵢ Σⱼ≤ᵢ Lⱼ 最小', TEAL],
          ['同款：单机调度 min Σ完成时间', TXT],
          ['     按 处理时间/权重 排序（WSPT）', TXT],
          ['磁盘顺序布局、播放列表排序同构', DIM]
        ], 46, 66, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['比值贪心 +', TXT], ['交换论证证明', TXT, true]] },
          { t: '警惕', rows: [['直接按 p 或按 L', DIM], ['贪心都会翻车', DIM]] }
        ], 392, 80, 232);
      } }
    ] } });
  /* m55 · 蚂蚁爬杆 */
  D({ g: g, no: 55, title: '蚂蚁爬杆', e: 'board', strat: '对称·碰头等价', plain: '杆上蚂蚁相向而行、碰头各自回头。妙在"碰头回头"与"碰头互穿"对全局效果完全等价（蚂蚁不可区分）——于是每只蚁都当独自走到底，最短/最长时间一步算出。',
    p: { steps: [
      { cap: '1 米杆上 5 只蚂蚁各自朝一端走，碰头就回头——全部落杆要多久？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'dot', color: TEAL, txt: '→ 向右' }, { sw: 'dot', color: AMBER, txt: '← 向左' }], '目标：最短/最长时间');
        ctx.strokeStyle = DIM; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(50, 120); ctx.lineTo(590, 120); ctx.stroke();
        var ants = [[0.1, 1], [0.3, -1], [0.5, 1], [0.7, -1], [0.9, 1]];
        ants.forEach(function (a) {
          var x = 50 + a[0] * 540, col = a[1] > 0 ? TEAL : AMBER;
          H.circle(ctx, x, 112, 7, col, null);
          M.arrow(ctx, x - 10 * a[1], 96, x + 14 * a[1], 96, col, 2);
        });
        M.code(ctx, [
          ['速度 1 m/s（书中设定 1 厘米/秒等价换算）', DIM],
          ['碰头 → 两只各自回头', TXT],
          ['求：全部落杆的最短 / 最长时间', AMBER, true]
        ], 60, 180, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '直觉陷阱', c: RED, rows: [['碰撞序列指数多', TXT], ['模拟会爆？', TXT, true]] },
          { t: '破局', rows: [['蚂蚁不可区分！', GREEN, true]] }
        ], 372, 80);
      } },
      { cap: '等价变换：碰头回头 = 碰头互穿（身份对调）——每只蚁都当独自走到底', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '互穿等价' }], '关键洞察');
        ctx.strokeStyle = DIM; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(50, 100); ctx.lineTo(590, 100); ctx.stroke();
        H.circle(ctx, 250, 92, 7, TEAL, null); M.arrow(ctx, 236, 76, 264, 76, TEAL, 2);
        H.circle(ctx, 320, 92, 7, AMBER, null); M.arrow(ctx, 334, 76, 306, 76, AMBER, 2);
        H.circle(ctx, 285, 172, 7, TEAL, null); M.arrow(ctx, 271, 188, 299, 188, TEAL, 2);
        H.circle(ctx, 300, 212, 7, TEAL, null); M.arrow(ctx, 286, 228, 314, 228, TEAL, 2);
        H.txt(ctx, '碰头回头（上） ≡ 互穿继续（下）：任意时刻杆上位置集合相同', 60, 265, { size: 11.5, color: GREEN, align: 'left' });
        M.note(ctx, [
          { t: '为什么等价', c: TEAL, rows: [['蚂蚁无身份差异，', TXT], ['"谁在哪个位置"', TXT], ['才是可观测状态', TXT, true]] },
          { t: '推论', rows: [['每只蚁独自走到', DIM], ['某一端，互不干扰', DIM]] }
        ], 392, 70, 232);
      } },
      { cap: '最短 = max(min(x, L−x)) = 0.5m；最长 = max(max(x, L−x)) = 0.9m，一步算完 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '答案' }], '结论');
        M.code(ctx, [
          ['最短：所有蚁都朝最近端走', TXT],
          ['  = max min(xᵢ, L−xᵢ) = 0.5 m', GREEN, true],
          ['最长：最倒霉的那只走全程', TXT],
          ['  = max max(xᵢ, L−xᵢ) = 0.9 m', AMBER, true],
          ['碰撞完全不用模拟！', TEAL]
        ], 46, 66, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['找不可区分对象的', TXT], ['"等价简单过程"', TXT, true]] },
          { t: '同款', rows: [['两球对弹交换速度', DIM], ['粒子碰撞模型', DIM]] }
        ], 372, 80);
      } }
    ] } });

  /* m56 · 三角形测试用例 */
  D({ g: g, no: 56, title: '三角形测试用例', e: 'board', strat: '等价类·边界值', plain: '给"判断三角形类型"的程序设计测试用例：用等价类划分（不等边/等腰/等边/非三角形/非法输入）加边界值（两边之和恰等于第三边）。看似简单，完整覆盖需要十几类用例——测试设计能力的经典考题。',
    p: { steps: [
      { cap: '程序功能：输入三边 → 输出 等边/等腰/不等边/非三角形；用例怎么设计才全？', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: GREEN, txt: '合法' }, { sw: 'box', color: RED, txt: '非法' }], '目标：完整覆盖');
        M.code(ctx, [
          ['classify(a, b, c):', TXT],
          ['  等边 a==b==c', GREEN],
          ['  等腰 恰两边相等', GREEN],
          ['  不等边 三边互异且构成三角形', GREEN],
          ['  非三角形 两边和 ≤ 第三边', RED],
          ['  非法输入 零/负数/非数值/缺参', RED, true]
        ], 46, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '方法', c: TEAL, rows: [['等价类划分：', TXT], ['每类取一个代表', TXT, true]] },
          { t: '再加', rows: [['边界值分析', DIM]] }
        ], 400, 70, 224);
      } },
      { cap: '等价类用例表：每个输出类至少一条，非法输入单独成类', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '用例' }], '等价类表');
        var rows = [
          ['3,4,5', '不等边'],
          ['3,3,4', '等腰(三种位置)'],
          ['3,4,3', '等腰'],
          ['4,3,3', '等腰'],
          ['5,5,5', '等边'],
          ['1,2,3', '非三角形(恰等)'],
          ['1,2,4', '非三角形'],
          ['0,4,5', '非法'],
          ['-1,4,5', '非法']
        ];
        rows.forEach(function (r, i) {
          var x = 46 + (i >= 5 ? 300 : 0), y = 56 + (i % 5) * 52;
          ctx.fillStyle = '#12244a'; H.rr(ctx, x, y, 270, 42, 5); ctx.fill();
          H.txt(ctx, r[0], x + 16, y + 21, { size: 13, bold: true, color: TEAL, align: 'left' });
          H.txt(ctx, '→ ' + r[1], x + 100, y + 21, { size: 12, color: TXT, align: 'left' });
        });
        M.note(ctx, [
          { t: '易漏', c: AMBER, rows: [['等腰要试三种', TXT], ['位置 (a=b, b=c, a=c)', TXT, true]] },
          { t: '边界', rows: [['1,2,3 恰共线 → 非三角形', RED, true]] }
        ], 372, 330 - 60, 252);
      } },
      { cap: '再加边界/异常：恰共线、超大数溢出、浮点边、参数顺序——十几条才算完整 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '清单' }], '结论');
        M.code(ctx, [
          ['✓ 每个输出等价类 ≥ 1 条', GREEN],
          ['✓ 等腰三种位置分开试', GREEN],
          ['✓ 边界：a+b==c（恰共线）', GREEN],
          ['✓ 溢出： INT_MAX 附近三边', GREEN],
          ['✓ 异常：0/负数/非数值/缺参', GREEN],
          ['思想：用例覆盖率 > 用例数量', TEAL, true]
        ], 46, 56, { size: 12.5, gap: 25 });
        M.note(ctx, [
          { t: '背景', c: TEAL, rows: [['1960s 软件测试', TXT], ['经典教材题', TXT, true]] },
          { t: '同款', rows: [['等价类+边界值', DIM], ['适用于一切输入分类问题', DIM]] }
        ], 400, 70, 224);
      } }
    ] } });

  /* m57 · 数独知多少 */
  D({ g: g, no: 57, title: '数独知多少', e: 'board', strat: '候选集·回溯计数', plain: '给定部分填好的数独盘，问它有多少个不同解（唯一解才是一道好题）。用候选集约束传播缩小每格可能值，再按"候选最少优先"回溯枚举计数；唯一解验证与多解检测同源。',
    p: { steps: [
      { cap: '问：这个残盘能延伸出几个完整解？——唯一解才是合格的数独题', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '已知' }, { sw: 'box', color: '#273469', txt: '待填' }], '目标：数解个数');
        var g9 = [
          ['5','3','',''],['7','','','',''],['','','','',''],
          ['','','','','']
        ];
        M.grid(ctx, [['5','3','','6','','','','',''],['6','','7','','','','1','','5'],['','','','1','9','5','','',''],['9','8','','','','','6','',''],['8','','6','','','','3','',''],['4','','3','','','8','','7'],['','6','','5','','','9','',''],['','','4','9','1','','5','',''],['','','','','','7','','3','8']], { x: 46, y: 44, cs: 28, fill: function (r, c, v) { return v ? '#1e3a34' : '#182148'; }, size: 12 });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['解的个数 = ?', TXT, true]] },
          { t: '标准', rows: [['唯一解 → 好题', GREEN], ['多解 → 线索不够', RED]] },
          { t: '规模', rows: [['6.67×10²¹ 个终盘', DIM], ['必须剪枝计数', DIM]] }
        ], 372, 60);
      } },
      { cap: '候选集传播：每格维护可能值集合，行/列/宫出现即剔除；剔到只剩一值就直接定格', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '候选集' }], '约束传播');
        M.code(ctx, [
          ['cand(r,c) = {1..9} − 行已用 − 列已用 − 宫已用', TXT],
          ['|cand|==1 → 直接填（单元传播）', GREEN, true],
          ['|cand|==0 → 矛盾，回溯剪枝', RED, true],
          ['某数字在宫内只剩一格可放 → 也直接定', TEAL]
        ], 46, 60, { size: 12, gap: 25 });
        M.chips(ctx, ['2','7','8'], { x: 80, y: 190, tw: 44, th: 40, color: function (i) { return i === 1 ? GREEN : '#182148'; }, ring: function (i) { return i === 1 ? GREEN : null; }, size: 15 });
        H.txt(ctx, '某空格候选 {2,7,8}，若同行再出现 2、8 → 只剩 7，直接定格', 80, 252, { size: 11, color: DIM, align: 'left' });
        M.note(ctx, [
          { t: '顺序', c: TEAL, rows: [['先传播到不能动，', TXT], ['再选候选最少的格', TXT, true], ['猜值递归（MRV）', TXT]] }
        ], 372, 190);
      } },
      { cap: '回溯计数：count = 0；每找到完整解 count++；count≥2 即可断定非唯一（提前剪枝）✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '计数' }], '结论');
        M.code(ctx, [
          ['int solve(board):', TXT],
          ['  传播到不能动；若有 |cand|=0 返回 0', TXT],
          ['  若盘满 → return 1', GREEN],
          ['  选候选最少格，逐候选值递归求和', TEAL, true],
          ['  count ≥ 2 就可提前退出（只验唯一性）', AMBER],
          ['出题器：挖洞后验证唯一，不唯一就回填', DIM]
        ], 46, 56, { size: 12, gap: 24 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['传播把搜索树', TXT], ['剔到最小再猜', TXT, true]] },
          { t: '同款', rows: [['SAT 求解的单元传播', DIM], ['与 m17 扫雷推理同构', DIM]] }
        ], 392, 70, 232);
      } }
    ] } });

  /* m58 · 数字哑谜和回文 */
  D({ g: g, no: 58, title: '数字哑谜和回文', e: 'board', strat: '进位分析·剪枝', plain: '字母代数字的竖式谜题（如 SEND+MORE=MONEY，每个字母代表不同数字）。暴力枚举 10! 太慢；从进位结构入手：最高位进位必使 M=1、百位进位使 O=0……逐位约束把搜索空间砍到极小。',
    p: { steps: [
      { cap: 'SEND + MORE = MONEY：每个字母一个唯一数字，求各字母的值', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '竖式' }], '目标：字母→数字');
        var l1 = ['','S','E','N','D'], l2 = ['','M','O','R','E'], l3 = ['M','O','N','E','Y'];
        l1.forEach(function (ch, i) { H.txt(ctx, ch, 110 + i * 46, 90, { size: 22, bold: true, color: TEAL }); });
        H.txt(ctx, '+', 64, 138, { size: 20, bold: true, color: DIM });
        l2.forEach(function (ch, i) { H.txt(ctx, ch, 110 + i * 46, 138, { size: 22, bold: true, color: TEAL }); });
        H.line(ctx, 80, 152, 300, 152, DIM, 2);
        l3.forEach(function (ch, i) { H.txt(ctx, ch, 110 + i * 46, 190, { size: 22, bold: true, color: GREEN }); });
        M.note(ctx, [
          { t: '约束', c: AMBER, rows: [['8 个字母互不相同', TXT], ['各取 0..9', TXT, true]] },
          { t: '暴力', rows: [['P(10,8) ≈ 180 万', DIM], ['能跑但不够聪明', DIM]] }
        ], 372, 70);
      } },
      { cap: '进位分析：和多一位 → M=1；百位向千位进位而 S+1≤10 → O=0；逐位缩小', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: AMBER, txt: '推导链' }], '剪枝');
        M.code(ctx, [
          ['① 四位数+四位数=五位数 → M=1', AMBER, true],
          ['② S+M 最多进一位 → O=0 或 1，M=1 已占 → O=0', AMBER, true],
          ['③ 千位：S+1 进位到万位 → S≥8（S≠9? 继续推）', TXT],
          ['④ 十位：N+R(+进位) = E+10k 联立个位方程', TXT],
          ['⑤ 剩下小空间枚举 → 9567+1085=10652', GREEN, true]
        ], 46, 56, { size: 12, gap: 25 });
        M.note(ctx, [
          { t: '答案', c: GREEN, rows: [['S=9 E=5 N=6 D=7', TXT, true], ['M=1 O=0 R=8 Y=2', TXT, true]] },
          { t: '回文变体', rows: [['枚举中心扩展 O(n²)', DIM], ['或逐位乘法约束搜索', DIM]] }
        ], 392, 60, 232);
      } },
      { cap: '通用解法：从低位到高位 DFS，每层枚举字母并维护进位，非法立即剪枝 ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '通用框架' }], '结论');
        M.code(ctx, [
          ['dfs(col, carry):', TXT],
          ['  本列未定字母 → 枚举可用数字', TXT],
          ['  和的该位 == (列和+carry) % 10 才继续', TEAL, true],
          ['  carry 传递到下一列；首字母≠0', TXT],
          ['剪枝后搜索树从 180 万降到几千', GREEN, true],
          ['回文数谜题同框架：从两端向中间定', DIM]
        ], 46, 56, { size: 12, gap: 25 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['进位是局部约束，', TXT], ['逐列检查早剪枝', TXT, true]] },
          { t: '同款', rows: [['约束满足问题 CSP', DIM], ['与 24 点、数独同构', DIM]] }
        ], 392, 70, 232);
      } }
    ] } });

  /* m59 · 挖雷游戏的概率 */
  D({ g: g, no: 59, title: '挖雷游戏的概率', e: 'board', strat: '条件概率', plain: '点开一个"1"，周围恰有两个未开格——每个未开格是雷的概率是 1/2 吗？若两个数字共享未开格，概率就互相牵扯：用"满足所有数字约束的雷布局数"作权重数格子，才是正确的条件概率。',
    p: { steps: [
      { cap: '简单局面："1"旁边恰两个未开格——雷在其中之一，每格概率 1/2', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: TEAL, txt: '数字格' }, { sw: 'box', color: '#273469', txt: '未开' }], '目标：雷的概率');
        var rows = [['1','',''],['','',''],['','','']];
        M.grid(ctx, rows, { x: 80, y: 80, cs: 46, fill: function (r, c) { return (r === 0 && c === 0) ? '#1e3a34' : '#273469'; }, ring: function (r, c) { return (r === 0 && c === 1 || r === 1 && c === 0) ? AMBER : null; }, size: 18 });
        H.txt(ctx, '?', 80 + 46 * 1.5, 80 + 23, { size: 16, bold: true, color: AMBER });
        H.txt(ctx, '?', 80 + 23, 80 + 46 + 23, { size: 16, bold: true, color: AMBER });
        M.code(ctx, [
          ['雷在两个未开格之一', TXT],
          ['对称 → 各 1/2', GREEN, true]
        ], 260, 120, { size: 13.5, gap: 28 });
        M.note(ctx, [
          { t: '问', c: AMBER, rows: [['两个数字共享', TXT], ['未开格时还对称吗？', TXT, true]] },
          { t: '直觉', rows: [['不一定！', RED, true]] }
        ], 372, 80);
      } },
      { cap: '共享局面：两数字约束同一批未开格 → 枚举所有合法雷布局，按布局数比例算概率', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'box', color: AMBER, txt: '合法布局' }], '条件概率');
        var rows = [['1','1',''],['','',''],['','','']];
        M.grid(ctx, rows, { x: 56, y: 60, cs: 40, fill: function (r, c) { return r === 0 && c < 2 ? '#1e3a34' : '#273469'; }, size: 16 });
        M.code(ctx, [
          ['未开格 a,b,c（邻接两个 1）', TXT],
          ['合法布局：雷数满足两个 1 的约束', TXT],
          ['  {a,b} {a,c} {b,c}…逐个数', AMBER, true],
          ['P(x 是雷) = 含 x 的布局数 / 总布局数', GREEN, true],
          ['各格概率不再相等！', RED]
        ], 200, 60, { size: 12, gap: 23 });
        M.note(ctx, [
          { t: '方法', c: TEAL, rows: [['把相邻数字+未开格', TXT], ['划成小区域独立算', TXT, true]] },
          { t: '复杂度', rows: [['区域小 → 枚举布局', DIM], ['可行；大盘分而治之', DIM]] }
        ], 210, 210, 280);
      } },
      { cap: '选概率最低的格点开；首点免雷、全盘雷数先验都是条件概率的"已知信息" ✓', fn: function (ctx, W) {
        M.legend(ctx, [{ sw: 'line', color: GREEN, txt: '策略' }], '结论');
        M.code(ctx, [
          ['P(某格是雷) = 合法布局中该格含雷的占比', GREEN, true],
          ['最优策略：每次点概率最低的可推格', TEAL],
          ['剩局雷数、未开格数 → 全局先验 n/m', TXT],
          ['无法推理时：先验最低区域先点', TXT],
          ['同款：贝叶斯推断——约束即证据', AMBER, true]
        ], 46, 66, { size: 12.5, gap: 26 });
        M.note(ctx, [
          { t: '思想', c: GREEN, rows: [['条件概率 =', TXT], ['合法世界里数比例', TXT, true]] },
          { t: '呼应', rows: [['m17 扫雷推理的', DIM], ['概率化升级版', DIM]] }
        ], 392, 80, 232);
      } }
    ] } });
})();
