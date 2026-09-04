/* 概览区 21 个示例（全覆盖） */
(function () {
  var H = PZ.H, U = PZ.U, D = PZ.def;
  var g = 'o';

  /* 概1 幻方 */
  D({ g: g, no: 1, title: '幻方', e: 'board', strat: '数学构造',
    plain: '把 1~9 填进九宫格，让每行、每列、两条对角线的和都一样。套路：总和 45 除以 3 行得 15，5 必须坐镇中央，偶数占四个角。',
    p: { steps: [
      { cap: '目标：1~9 填入 3×3，行、列、对角线和全相等', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['?', '?', '?'], ['?', '?', '?'], ['?', '?', '?']]); } },
      { cap: '总和 1+2+…+9 = 45，共 3 行 → 每行和必须是 45÷3 = 15', fn: function (ctx, W, Hh) { var g = U.grid(ctx, W, Hh, [['?', '?', '?'], ['?', '?', '?'], ['?', '?', '?']]); for (var r = 0; r < 3; r++) H.mono(ctx, '= 15', g.x0 + 3 * g.cell + 26, g.y0 + r * g.cell + g.cell / 2, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '5 必须放中央：过中心的 4 条线都要凑 15', fn: function (ctx, W, Hh) { var g = U.grid(ctx, W, Hh, [['?', '?', '?'], ['?', '5', '?'], ['?', '?', '?']]); for (var r = 0; r < 3; r++) H.mono(ctx, '= 15', g.x0 + 3 * g.cell + 26, g.y0 + r * g.cell + g.cell / 2, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '偶数占四角，口诀"戴九履一，左三右七"补齐四边', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['4', '9', '2'], ['3', '5', '7'], ['8', '1', '6']]); } },
      { cap: '验证：每行、每列、两对角线全部 = 15 ✓', fn: function (ctx, W, Hh) { var g = U.grid(ctx, W, Hh, [['4', '9', '2'], ['3', '5', '7'], ['8', '1', '6']], { cellColor: function () { return '#1e3a34'; } }); for (var r = 0; r < 3; r++) H.mono(ctx, '= 15', g.x0 + 3 * g.cell + 26, g.y0 + r * g.cell + g.cell / 2, { size: 13, bold: true, color: '#4ade80' }); for (var c = 0; c < 3; c++) H.mono(ctx, '15', g.x0 + c * g.cell + g.cell / 2, g.y0 + 3 * g.cell + 16, { size: 13, bold: true, color: '#4ade80' }); } }
    ] } });

  /* 概2 n皇后 */
  D({ g: g, no: 2, title: 'n 皇后问题', e: 'queens', strat: '回溯',
    plain: '在 8×8 棋盘放 8 个皇后，谁也不能吃掉谁。一行一行往下放，放不下就退回上一行换位置，这就是回溯法。',
    p: { n: 8, cap: '逐行试探，冲突即回退' } });

  /* 概3 名流问题 */
  D({ g: g, no: 3, title: '名流问题', e: 'board', strat: '减治',
    plain: '名人谁也不认识，但所有人都认识他。每次问"甲认识乙吗"，不管答案如何，总能立刻排除掉一个人。',
    p: { steps: [
      { cap: '一群人里藏着一位名人：找出他，提问要尽量少', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E']); } },
      { cap: '问：A 认识 B 吗？答"认识" → A 认识别人，A 出局', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E'], [{ out: 1 }, {}, {}, {}, {}]); } },
      { cap: '若答"不认识" → B 有人不认识他，B 出局。一问必淘汰一人', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E'], [{}, { out: 1 }, {}, {}, {}]); } },
      { cap: 'n−1 问后只剩一个候选人，再验证一遍即可 → 共 O(n) 次', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E'], [{ out: 1 }, { out: 1 }, { tag: '候选' }, { out: 1 }, { out: 1 }]); } }
    ] } });

  /* 概4 猜数字 */
  D({ g: g, no: 4, title: '猜数字', e: 'board', strat: '减治·二分',
    plain: '心里想一个 1~100 的数，你只能问"大了还是小了"。每次猜正中间，范围立刻砍一半，7 次之内必中。',
    p: { steps: [
      { cap: '在 1~100 里想一个数，只回答"大了/小了"', fn: function (ctx, W) { U.axis(ctx, W, 150, 1, 100, [1, 25, 50, 75, 100]); } },
      { cap: '猜 50 → "大了" → 范围缩到 1~49', fn: function (ctx, W) { U.axis(ctx, W, 150, 1, 100, [1, 25, 50, 75, 100], [{ v: 50, color: '#f87171', label: '大了' }]); H.line(ctx, 70 + 500 * 49 / 99, 100, 570, 100, '#5eead4', 3); } },
      { cap: '猜 25 → "小了" → 范围缩到 26~49', fn: function (ctx, W) { U.axis(ctx, W, 150, 1, 100, [1, 25, 50, 75, 100], [{ v: 25, color: '#4ade80', label: '小了' }]); H.line(ctx, 70 + 500 * 26 / 99, 100, 70 + 500 * 49 / 99, 100, '#5eead4', 3); } },
      { cap: '猜 37 → "大了" → 26~36', fn: function (ctx, W) { U.axis(ctx, W, 150, 1, 100, [1, 25, 50, 75, 100], [{ v: 37, color: '#f87171', label: '大了' }]); H.line(ctx, 70 + 500 * 26 / 99, 100, 70 + 500 * 36 / 99, 100, '#5eead4', 3); } },
      { cap: '猜 31 → "小了" → 32~36；再猜 34 → 中！5 次命中', fn: function (ctx, W) { U.axis(ctx, W, 150, 1, 100, [1, 25, 50, 75, 100], [{ v: 34, color: '#fbbf24', label: '中了!' }]); H.line(ctx, 70 + 500 * 32 / 99, 100, 70 + 500 * 36 / 99, 100, '#5eead4', 3); } }
    ] } });

  /* 概5 三格骨牌谜题 */
  D({ g: g, no: 5, title: '三格骨牌谜题', e: 'tiling', strat: '分治',
    plain: '缺了一个角的 8×8 棋盘，用 L 形三格骨牌铺满。诀窍：把棋盘切四半，在中心摆一块骨牌"制造"三个缺口，递归下去。',
    p: { n: 8, type: 'tromino', miss: [0, 0], cap: '分治：中心放一块，制造三个新缺口' } });

  /* 概6 变位词检测 */
  D({ g: g, no: 6, title: '变位词检测', e: 'board', strat: '变治',
    plain: '判断两个单词是否变位词，硬比要枚举全部排列；变治的妙处是先把字母排序成"签名"，签名相同就是变位词，一眼线性比对。',
    p: { steps: [
      { cap: 'listen 和 silent：字母相同、顺序不同，是变位词吗？', fn: function (ctx, W) { U.row(ctx, W, 80, 'listen'.split('')); U.row(ctx, W, 140, 'silent'.split('')); U.lines(ctx, W, [['直接比较：要试 6! = 720 种排列', 13, '#f87171', true]], 215); } },
      { cap: '硬比有多贵：6 个字母的全排列有 720 种', fn: function (ctx, W) { U.lines(ctx, W, [['硬比 = 逐个枚举排列', 14, '#8fa0c8'], ['listen 的排列数 = 6! = 720', 16, '#f87171', true], ['每个候选都要逐字符对照', 13, '#8fa0c8']], 90); } },
      { cap: '变治第一步：各自把字母排好序，得到"签名"', fn: function (ctx, W) { U.row(ctx, W, 70, 'listen'.split('')); H.txt(ctx, '↓ 排序', W / 2, 122, { size: 13, bold: true, color: '#fbbf24' }); U.row(ctx, W, 146, 'eilnst'.split(''), [0, 1, 2, 3, 4, 5]); U.lines(ctx, W, [['silent 排序后同样是 eilnst', 13, '#8fa0c8']], 215); } },
      { cap: '签名相同 → 是变位词；整个文件按签名排序即可分组', fn: function (ctx, W) { U.row(ctx, W, 80, 'eilnst'.split(''), [0, 1, 2, 3, 4, 5]); U.row(ctx, W, 130, 'eilnst'.split(''), [0, 1, 2, 3, 4, 5]); U.lines(ctx, W, [['按签名排序文件，同签名彼此相邻', 13, '#fbbf24', true]], 215); } },
      { cap: '一次扫描找出全部变位词集合 ✓（O(n log n)）', fn: function (ctx, W) { U.row(ctx, W, 90, 'eilnst'.split(''), [0, 1, 2, 3, 4, 5]); U.lines(ctx, W, [['相邻同签名 = 同一变位词集合', 14, '#8fa0c8'], ['签名分组 = 全部答案 ✓', 17, '#4ade80', true], ['从枚举排列降到排序：O(n log n)', 12, '#8fa0c8']], 170); } }
    ] } });

      /* 概7 现金分装 */
  D({ g: g, no: 7, title: '现金分装', e: 'board', strat: '数学技巧·二进制',
    plain: '10 个信封怎么覆盖 1~1000 的任何数额？靠二进制：前 9 个装 2 的幂可组合出 1~511，第 10 个装剩下的 489，任何数额都是若干信封的组合。',
    p: { steps: [
      { cap: '1000 张钞票装进 10 个信封，任何 1~1000 的数额都要用整信封凑出', fn: function (ctx, W) { U.row(ctx, W, 100, ['?', '?', '?', '?', '?', '?', '?', '?', '?', '?']); U.lines(ctx, W, [['不许找零 → 数额必须是若干信封之和', 14, '#5eead4', true]], 185); } },
      { cap: '笨办法：1 美元一个信封，要 1000 个——信封根本不够', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 1, 1, 1, 1, 1, 1, '…', 1]); U.lines(ctx, W, [['只能覆盖"拿整张"的数额，需要 1000 个信封', 13, '#f87171', true]], 185); } },
      { cap: '二进制原理：1, 2, 4, 8 四个数可组合出 1~15 的任何整数', fn: function (ctx, W) { U.row(ctx, W, 90, [1, 2, 4, 8], [0, 1, 2, 3]); U.lines(ctx, W, [['例：11 = 8 + 2 + 1，13 = 8 + 4 + 1', 14, '#8fa0c8'], ['k 个 2 的幂可覆盖 1 ~ 2ᵏ − 1', 15, '#fbbf24', true]], 175); } },
      { cap: '前 9 个信封装 1, 2, 4, …, 256 → 覆盖 1~511', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 2, 4, 8, 16, 32, 64, 128, 256, '?']); U.lines(ctx, W, [['9 个 2 的幂：2⁹ − 1 = 511', 14, '#fbbf24', true], ['还剩 1000 − 511 = 489 张', 13, '#8fa0c8']], 185); } },
      { cap: '第 10 个信封装 489 → 512~1000 的数额都用"489 + 若干 2 的幂"凑', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 2, 4, 8, 16, 32, 64, 128, 256, 489], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); U.lines(ctx, W, [['例：700 = 489 + 128 + 64 + 16 + 2 + 1', 13, '#8fa0c8']], 185); } },
      { cap: '10 个信封覆盖 1~1000 全部数额 ✓', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 2, 4, 8, 16, 32, 64, 128, 256, 489], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); U.lines(ctx, W, [['1~511：二进制组合；512~1000：489 + 二进制组合', 13, '#8fa0c8'], ['10 个信封 = 1000 个信封的效果 ✓', 16, '#4ade80', true]], 180); } }
    ] } });
/* 概8 两个吃醋的丈夫 */
  var jealValid = function (st) {
    function bad(s) {
      for (var i = 1; i <= 3; i++) {
        if (s.indexOf('W' + i) >= 0 && s.indexOf('H' + i) < 0) {
          for (var j = 1; j <= 3; j++) if (j !== i && s.indexOf('H' + j) >= 0) return true;
        }
      }
      return false;
    }
    return !bad(st.L) && !bad(st.R);
  };
  D({ g: g, no: 8, title: '两个吃醋的丈夫', e: 'river', strat: '穷举·状态空间',
    plain: '三对夫妻过河，船只能坐 2 人。任何妻子在没有自己丈夫陪同的情况下，绝不能和其他男人待在一起。电脑用广度优先搜索把 11 步方案穷了出来。',
    p: { items: [
      { id: 'H1', label: '夫1', color: '#5eead4' }, { id: 'W1', label: '妻1', color: '#f0abfc' },
      { id: 'H2', label: '夫2', color: '#818cf8' }, { id: 'W2', label: '妻2', color: '#fdba74' },
      { id: 'H3', label: '夫3', color: '#4ade80' }, { id: 'W3', label: '妻3', color: '#f87171' }],
      cap: 2, capText: '小船最多 2 人，无船夫，自己划', valid: jealValid } });

  /* 概9 Guarini 谜题：四骑士换位 */
  var guaMoves = [
    { id: 'W1', r: 2, c: 1 }, { id: 'B2', r: 0, c: 1 }, { id: 'B1', r: 1, c: 2 }, { id: 'W2', r: 1, c: 0 },
    { id: 'W1', r: 0, c: 2 }, { id: 'B2', r: 2, c: 0 }, { id: 'B1', r: 0, c: 0 }, { id: 'W2', r: 2, c: 2 },
    { id: 'W1', r: 1, c: 0 }, { id: 'B2', r: 1, c: 2 }, { id: 'B1', r: 2, c: 1 }, { id: 'W2', r: 0, c: 1 },
    { id: 'W1', r: 2, c: 2 }, { id: 'B2', r: 0, c: 0 }, { id: 'B1', r: 0, c: 2 }, { id: 'W2', r: 2, c: 0 }];
  D({ g: g, no: 9, title: 'Guarini 谜题', e: 'gridmove', strat: '图论·状态空间',
    plain: '3×3 棋盘四角各有一位骑士：两枚白骑士在底部两角、两枚黑骑士在顶部两角，要让黑白互换位置。把骑士所有合法落点连成一个 8 步循环，大家沿循环各走 4 步即可，共 16 跳。',
    p: { rows: 3, cols: 3, pieces: [
      { id: 'W1', label: '白1', color: '#e2e8f0', r: 2, c: 0 }, { id: 'W2', label: '白2', color: '#e2e8f0', r: 2, c: 2 },
      { id: 'B1', label: '黑1', color: '#334155', r: 0, c: 0 }, { id: 'B2', label: '黑2', color: '#334155', r: 0, c: 2 }],
      moves: guaMoves.map(function (m) { return { id: m.id, r: 2 - m.r, c: m.c }; }),
      cap: '16 步沿"8 字循环"轮换完成换位' } });

  /* 概10 最优馅饼切法 */
  var pieLines = [[0.5, 8], [1.6, 22], [2.6, -14], [1.05, -30]];
  function pieDraw(k) {
    return function (ctx, W, Hh) {
      var cx = W / 2, cy = 150, R = 105;
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      for (var i = 0; i < k; i++) {
        var th = pieLines[i][0], d = pieLines[i][1];
        var nx = -Math.sin(th), ny = Math.cos(th), fx = cx + d * nx, fy = cy + d * ny;
        var half = Math.sqrt(R * R - d * d);
        H.line(ctx, fx - half * Math.cos(th), fy - half * Math.sin(th), fx + half * Math.cos(th), fy + half * Math.sin(th), '#f87171', 2);
      }
      H.txt(ctx, (1 + k * (k + 1) / 2) + ' 块', cx, cy, { size: 22, bold: true, color: '#5eead4' });
    };
  }
  D({ g: g, no: 10, title: '最优馅饼切法', e: 'geo', strat: '数学技巧',
    plain: '在一块矩形的馅饼上直直地切 k 刀，最多能把馅饼切成多少块？每新的一刀都要和之前所有刀痕相交：答案是 1 + k(k+1)/2。',
    p: { steps: [
      { cap: '1 刀 → 2 块', fn: pieDraw(1) }, { cap: '2 刀相交 → 4 块', fn: pieDraw(2) },
      { cap: '3 刀两两相交 → 7 块', fn: pieDraw(3) }, { cap: '4 刀 → 11 块：公式 1 + k(k+1)/2', fn: pieDraw(4) }
    ] } });

  /* 概11 不可互攻的王 */
  D({ g: g, no: 11, title: '不可互攻的王', e: 'board', strat: '数学技巧',
    plain: '最多放几个互不攻击的王？两步走：先用 2×2 小块论证"最多 16"的上界，再给出恰好 16 个的摆法，上下夹逼即最优。',
    p: { steps: [
      { cap: '8×8 棋盘：最多放几个互不攻击的王？', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true }); U.lines(ctx, W, [['王攻击周围 8 格，任意两王不得相邻', 13, '#5eead4', true]], 296); } },
      { cap: '局部约束：每个 2×2 小方块里最多只能放 1 个王', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); } var gg = U.grid(ctx, W, Hh, b, { checker: true, cellColor: function (rr2, cc) { return rr2 < 2 && cc < 2 ? '#1e3a34' : null; } }); H.txt(ctx, '♚', gg.x0 + gg.cell / 2, gg.y0 + gg.cell / 2, { size: 20, bold: true, color: '#fbbf24' }); H.txt(ctx, '×', gg.x0 + 1.5 * gg.cell, gg.y0 + gg.cell / 2, { size: 15, color: '#f87171' }); H.txt(ctx, '×', gg.x0 + gg.cell / 2, gg.y0 + 1.5 * gg.cell, { size: 15, color: '#f87171' }); H.txt(ctx, '×', gg.x0 + 1.5 * gg.cell, gg.y0 + 1.5 * gg.cell, { size: 15, color: '#f87171' }); U.lines(ctx, W, [['放 2 个必相邻互攻 → 每区至多 1 个', 13, '#fbbf24', true]], 296); } },
      { cap: '上界：8×8 切成 16 个互不相交的 2×2 → 总数 ≤ 16', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); } var gg = U.grid(ctx, W, Hh, b, { checker: true }); for (var k = 2; k <= 6; k += 2) { H.line(ctx, gg.x0 + k * gg.cell, gg.y0 - 6, gg.x0 + k * gg.cell, gg.y0 + 8 * gg.cell + 6, '#fbbf24', 1.5); H.line(ctx, gg.x0 - 6, gg.y0 + k * gg.cell, gg.x0 + 8 * gg.cell + 6, gg.y0 + k * gg.cell, '#fbbf24', 1.5); } H.txt(ctx, '16 个 2×2 区域，每区至多 1 个王 → 上界 16', W / 2, gg.y0 + 8 * gg.cell + 16, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '构造：隔行隔列摆放，正好放下 16 个', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(r % 2 === 0 && c % 2 === 0 ? '♚' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, txtColor: function () { return '#fbbf24'; }, cellColor: function (rr2, cc) { return rr2 % 2 === 0 && cc % 2 === 0 ? '#1e3a34' : null; } }); } },
      { cap: '上界 16 恰好达到 → 答案就是 16 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(r % 2 === 0 && c % 2 === 0 ? '♚' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, txtColor: function () { return '#4ade80'; }, cellColor: function (rr2, cc) { return rr2 % 2 === 0 && cc % 2 === 0 ? '#1e3a34' : null; } });
        H.txt(ctx, '上界 + 构造 = 最优性证明 ✓', W / 2, 300, { size: 14, bold: true, color: '#4ade80' }); } }
    ] } });

  /* 概12 夜过吊桥 */
  D({ g: g, no: 12, title: '夜过吊桥', e: 'timeline', strat: '贪心·调度',
    plain: '4 人深夜过桥，只有一个火把，桥每次最多过 2 人，过桥速度按慢的算。关键一招：让最慢的两个人一起过，别让慢的人占着火把来回跑。',
    p: { total: 17, segs: [
      { who: '1+2 过桥', start: 0, dur: 2 }, { who: '1 送回火把', start: 2, dur: 1 },
      { who: '5+10 过桥', start: 3, dur: 10 }, { who: '2 送回火把', start: 13, dur: 2 },
      { who: '1+2 过桥', start: 15, dur: 2 }],
      cap: '总计 17 分钟：5 和 10 结伴过桥是精髓' } });

      /* 概13 柠檬水摊设点 */
  D({ g: g, no: 13, title: '柠檬水摊设点', e: 'board', strat: '贪心·中位数',
    plain: '摊点摆在哪让所有人走得最少？曼哈顿距离能把横纵两个方向拆开，各自取中位数就是最优——中位数恰好让两边户数平衡。',
    p: { steps: [
      { cap: '5 户人家分布在十字路口，摊点摆哪个路口总距离最短？', fn: function (ctx, W, Hh) { U.street(ctx, W, Hh, [[0, 1], [1, 4], [2, 0], [3, 2], [4, 3]]); U.lines(ctx, W, [['距离 = 横向街区数 + 纵向街区数（曼哈顿距离）', 13, '#5eead4', true]], 296); } },
      { cap: '随便试一个路口：总距离 = 各家横差之和 + 纵差之和', fn: function (ctx, W, Hh) { U.street(ctx, W, Hh, [[0, 1], [1, 4], [2, 0], [3, 2], [4, 3]], { med: [0, 0] }); U.lines(ctx, W, [['x 部分和 y 部分互不影响 → 可以分开优化', 13, '#fbbf24', true]], 296); } },
      { cap: '一维结论：摊点左边和右边户数平衡时，总距离最小', fn: function (ctx, W, Hh) { U.axis(ctx, W, 130, 0, 4, [0, 1, 2, 3, 4], [{ v: 2, color: '#4ade80', label: '中位数' }]); U.lines(ctx, W, [['5 户 x 坐标排序：0, 1, 2, 3, 4 → 中位数 2', 13, '#8fa0c8'], ['往左挪 → 右边 3 户变远；往右挪 → 左边 3 户变远', 13, '#8fa0c8']], 200); } },
      { cap: 'x、y 各自取中位数：摊点摆在 (2, 2) 路口', fn: function (ctx, W, Hh) { U.street(ctx, W, Hh, [[0, 1], [1, 4], [2, 0], [3, 2], [4, 3]], { med: [2, 2] }); U.lines(ctx, W, [['x 中位数 = 2（左右各 2 户），y 中位数 = 2', 13, '#fbbf24', true]], 296); } },
      { cap: '总距离 3+3+2+1+3 = 12，任何挪动都会变大 ✓', fn: function (ctx, W, Hh) { U.street(ctx, W, Hh, [[0, 1], [1, 4], [2, 0], [3, 2], [4, 3]], { med: [2, 2], paths: true }); U.lines(ctx, W, [['答案：二维中位数，总距离 12 最小 ✓', 13, '#4ade80', true]], 296); } }
    ] } });
  /* 概14 正数变号 */
  D({ g: g, no: 14, title: '正数变号', e: 'board', strat: '迭代改进',
    plain: '只许整行/整列变号，能让所有行列和非负吗？能——反复把负和的行或列翻面：每翻一次全体总和严格增大，总和有限，所以有限步必停。',
    p: { steps: [
      { cap: '目标：只许整行/整列变号，让所有行和、列和都非负', fn: function (ctx, W, Hh) { U.tableSum(ctx, W, Hh, [[-3, 1, 1], [2, -1, 3], [1, 2, -2]], { hlRow: 2 }); U.lines(ctx, W, [['红 = 负和：第 3 行和 −1、第 2 列和 −2', 13, '#5eead4', true]], 296); } },
      { cap: '迭代改进：找到负和的第 3 行，整行变号', fn: function (ctx, W, Hh) { U.tableSum(ctx, W, Hh, [[-3, 1, 1], [2, -1, 3], [-1, -2, 2]], { hlRow: 2 }); U.lines(ctx, W, [['该行和 −1 → +1，但总和只增加了 2', 13, '#fbbf24', true]], 296); } },
      { cap: '关键不变量：每次变号都让"全体总和"严格增大', fn: function (ctx, W, Hh) { U.tableSum(ctx, W, Hh, [[-3, 1, 1], [2, -1, 3], [-1, -2, 2]], { hlCol: 1 }); U.lines(ctx, W, [['负和 s 变号 → 总和增加 −2s > 0', 14, '#fbbf24', true], ['接着轮换处理新的负和列', 13, '#8fa0c8']], 296); } },
      { cap: '总和有限且严格递增 → 不可能永远翻下去，必在有限步停', fn: function (ctx, W, Hh) { U.tableSum(ctx, W, Hh, [[-3, 1, 1], [2, -1, 3], [-1, -2, 2]]); U.lines(ctx, W, [['停下来的条件：再无负和行/列', 13, '#8fa0c8']], 296); } },
      { cap: '算法存在：停止时所有行和列和非负 ✓', fn: function (ctx, W, Hh) { U.tableSum(ctx, W, Hh, [[3, -1, -1], [-2, 1, -3], [1, 2, -2]]); U.lines(ctx, W, [['单调有界 → 必然收敛，迭代改进成立 ✓', 14, '#4ade80', true]], 296); } }
    ] } });
/* 概15 最短路径计数 */
  D({ g: g, no: 15, title: '最短路径计数', e: 'griddp', strat: '动态规划',
    plain: '从城市网格的左上走到右下，只许向右和向下，一共有多少条最短路线？每格的路数 = 上方 + 左方，填表一路推到底。',
    p: { rows: 5, cols: 5, mode: 'count', val: function () { return 0; } } });

  /* 概16 国际象棋的发明 */
  D({ g: g, no: 16, title: '国际象棋的发明', e: 'board', strat: '数学技巧·指数',
    plain: '每格麦粒翻倍听起来不多，却是指数增长：翻到第 64 格是 2 的 63 次方，总数 2⁶⁴−1，全世界的麦子都不够付。',
    p: { steps: [
      { cap: '约定：第 k 格放 2^(k−1) 粒，每格翻倍，共 64 格', fn: function (ctx, W) {
        U.lines(ctx, W, [['格 1：1 粒；格 2：2 粒；格 3：4 粒…', 15, '#5eead4', true], ['第 k 格 = 2^(k−1) 粒', 14, '#8fa0c8']], 120); } },
      { cap: '前几格不吓人：1, 2, 4, 8, 16, 32, 64…', fn: function (ctx, W) {
        var ks = [1, 2, 4, 8, 16, 32, 64], base = 290, i;
        for (i = 0; i < ks.length; i++) { var h = 6 + Math.log2(ks[i]) * 34, x = 70 + i * 85;
          ctx.fillStyle = '#273469'; ctx.fillRect(x - 18, base - h, 36, h);
          H.txt(ctx, '格' + (i + 1), x, base + 12, { size: 11, color: '#8fa0c8' });
          H.mono(ctx, String(ks[i]), x, base - h - 11, { size: 12, bold: true, color: '#5eead4' }); }
        H.txt(ctx, '看着只是"稳步变高"', W / 2, 40, { size: 13, color: '#8fa0c8' }); } },
      { cap: '第 21 格就破百万：指数增长后半程失控', fn: function (ctx, W) {
        var ks = [1, 2, 4, 8, 16, 32, 64], base = 290, i;
        for (i = 0; i < ks.length; i++) { var h = 6 + Math.log2(ks[i]) * 34, x = 70 + i * 85, hot = ks[i] === 32 || ks[i] === 64;
          ctx.fillStyle = hot ? '#fbbf24' : '#273469'; ctx.fillRect(x - 18, base - h, 36, h);
          H.txt(ctx, '格' + (i + 1), x, base + 12, { size: 11, color: hot ? '#fbbf24' : '#8fa0c8' });
          H.mono(ctx, '2^' + i, x, base - h - 11, { size: 12, bold: true, color: hot ? '#fbbf24' : '#5eead4' }); }
        H.txt(ctx, '格21 = 2^20 ≈ 104 万粒，已是天文数字', W / 2, 40, { size: 14, bold: true, color: '#fbbf24' }); } },
      { cap: '第 64 格 = 2^63 ≈ 9.2×10^18 粒', fn: function (ctx, W) {
        U.lines(ctx, W, [['格64 = 2^63', 18, '#fbbf24', true], ['≈ 9.2×10^18 粒', 16, '#fbbf24'], ['比全球小麦年产量高出好几个量级', 13, '#8fa0c8']], 110); } },
      { cap: '总数 = 2^64 − 1 ≈ 1.8×10^19：全世界的麦子都不够 ✓', fn: function (ctx, W) {
        var ks = [1, 2, 4, 8, 16, 32, 64], base = 290, i;
        for (i = 0; i < ks.length; i++) { var h = 6 + Math.log2(ks[i]) * 34, x = 70 + i * 85;
          ctx.fillStyle = '#fbbf24'; ctx.fillRect(x - 18, base - h, 36, h);
          H.txt(ctx, '格' + (i + 1), x, base + 12, { size: 11, color: '#fbbf24' }); }
        H.txt(ctx, '总数 = 2^64 − 1 ≈ 1.8×10^19 粒', W / 2, 40, { size: 14, bold: true, color: '#fbbf24' });
        H.txt(ctx, '国王倾举国之粮也付不起 ✓', W / 2, 64, { size: 13, bold: true, color: '#f87171' }); } }
    ] } });

      /* 概17 方块搭建 */
  D({ g: g, no: 17, title: '方块搭建', e: 'board', strat: '数学技巧·递推',
    plain: '每步在外围铺一圈方块：第 i 步恰好新增 4(i−1) 个，累加后得闭式 2n²−2n+1，不用一个一个数。',
    p: { steps: [
      { cap: '从 1 个方块开始，每步在外围填满一圈', fn: function (ctx, W, Hh) { U.blocks(ctx, W, Hh, 1); U.lines(ctx, W, [['第 1 步：1 个方块', 15, '#5eead4', true]], 280); } },
      { cap: '第 2 步：外围新增 4 个 → 共 9 个', fn: function (ctx, W, Hh) { U.blocks(ctx, W, Hh, 2, 2); U.lines(ctx, W, [['新增 = 4×(2−1) = 4（金色）', 14, '#fbbf24', true], ['累计：1 + 4 = 9', 13, '#8fa0c8']], 280); } },
      { cap: '第 3 步：新增 8 个 → 共 25 个', fn: function (ctx, W, Hh) { U.blocks(ctx, W, Hh, 3, 3); U.lines(ctx, W, [['新增 = 4×(3−1) = 8（金色）', 14, '#fbbf24', true], ['累计：1 + 4 + 8 = 25', 13, '#8fa0c8']], 280); } },
      { cap: '规律：第 i 步外围恰增加 4(i−1) 个', fn: function (ctx, W, Hh) { U.blocks(ctx, W, Hh, 3); U.lines(ctx, W, [['总数 = 1 + 4×(1+2+…+(n−1))', 15, '#5eead4', true], ['每圈四条边，每边比上一圈多 1 个', 13, '#8fa0c8']], 280); } },
      { cap: '等差求和：总数 = 1 + 4·(n−1)n/2 = 2n² − 2n + 1 ✓', fn: function (ctx, W, Hh) { U.blocks(ctx, W, Hh, 3); U.lines(ctx, W, [['答案：第 n 步共 2n² − 2n + 1 个', 16, '#4ade80', true], ['验证：n=1→1、n=2→9、n=3→25 ✓', 13, '#8fa0c8']], 280); } }
    ] } });
/* 概18 汉诺塔 */
  D({ g: g, no: 18, title: '汉诺塔', e: 'hanoi', strat: '减治·递归',
    plain: '把 n 个大小盘从 A 柱搬到 C 柱，大盘永远不能压小盘。递归思路：先把上面 n−1 个借道搬到 B，搬最大的，再把 n−1 个搬回来。',
    p: { n: 4, pegs: 3, cap: '4 盘共 2^n − 1 = 15 步' } });

  /* 概19 缺角棋盘的多米诺铺陈 */
  D({ g: g, no: 19, title: '缺角棋盘的多米诺铺陈', e: 'board', strat: '奇偶/不变量',
    plain: '挖掉对角的棋盘剩 62 格，看似能用 31 张骨牌铺满；黑白染色后真相大白：每张骨牌必盖一黑一白，而剩下的黑白格并不相等。',
    p: { steps: [
      { cap: '挖掉对角两格的棋盘，能用 31 张多米诺铺满吗？', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push((r === 0 && c === 0) || (r === 7 && c === 7) ? '×' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, txtColor: function (r, c, v) { return v === '×' ? '#f87171' : '#e8ecf8'; } }); } },
      { cap: '数格子只是必要条件：62 = 31×2，数量对得上', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push((r === 0 && c === 0) || (r === 7 && c === 7) ? '×' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, txtColor: function (r, c, v) { return v === '×' ? '#f87171' : '#e8ecf8'; } });
        H.txt(ctx, '剩 62 格 = 31 张骨牌 × 2 格：数量不矛盾', W / 2, 306, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '黑白染色：每张多米诺必然盖住 1 黑 + 1 白', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push((r === 0 && c === 0) || (r === 7 && c === 7) ? '×' : ''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, txtColor: function (r, c, v) { return v === '×' ? '#f87171' : '#e8ecf8'; } });
        ctx.fillStyle = 'rgba(125,211,252,.30)'; H.rr(ctx, gg.x0 + 2 * gg.cell + 2, gg.y0 + 2, 2 * gg.cell - 4, gg.cell - 4, 6); ctx.fill();
        ctx.fillStyle = 'rgba(251,191,36,.30)'; H.rr(ctx, gg.x0 + 5 * gg.cell + 2, gg.y0 + 3 * gg.cell + 2, gg.cell - 4, 2 * gg.cell - 4, 6); ctx.fill();
        H.txt(ctx, '能铺满的必要条件：黑格数 = 白格数', W / 2, gg.y0 + 8 * gg.cell + 16, { size: 13, bold: true, color: '#5eead4' }); } },
      { cap: '对角两格同色 → 剩 30 黑 vs 32 白，不相等', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push((r === 0 && c === 0) || (r === 7 && c === 7) ? '×' : ''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, txtColor: function (r, c, v) { return v === '×' ? '#f87171' : '#e8ecf8'; } });
        H.txt(ctx, '挖掉的两格同色 → 剩 30 黑 32 白', W / 2, gg.y0 + 8 * gg.cell + 16, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '必要条件不满足 → 无论怎么铺都差 2 格，无解 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push((r === 0 && c === 0) || (r === 7 && c === 7) ? '×' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, txtColor: function (r, c, v) { return v === '×' ? '#f87171' : '#e8ecf8'; } });
        H.txt(ctx, '不变量一票否决：不可能铺满 ✓', W / 2, 306, { size: 14, bold: true, color: '#f87171' }); } }
    ] } });

  /* 概20 哥尼斯堡七桥 */
  D({ g: g, no: 20, title: '哥尼斯堡七桥问题', e: 'tour', strat: '图论·欧拉',
    plain: '能不能每座桥恰好走一遍再回到出发点？把陆地变成点、桥变成线后一看：4 个点全是奇数度，一笔画根本不存在，欧拉由此开创了图论。',
    p: { euler: true, start: 0, endNote: '失败：无法走遍全部 7 座桥',
      nodes: [{ x: 0.30, y: 0.16, label: '北岸' }, { x: 0.80, y: 0.42, label: '东岸' }, { x: 0.56, y: 0.84, label: '南岸' }, { x: 0.36, y: 0.52, label: '岛' }],
      edges: [[0, 3], [0, 3], [3, 2], [3, 2], [3, 1], [0, 1], [2, 1]],
      cap: '4 个奇度顶点 > 2 → 欧拉回路不存在' } });

      /* 概21 田地里的鸡 */
  D({ g: g, no: 21, title: '田地里的鸡', e: 'board', strat: '不变量·染色',
    plain: '棋盘染色后真相：每移一步所在格颜色必翻转，农夫与公鸡、农妇与母鸡各自同色出发就永远同色、永远追不上；互换目标才能捉到。',
    p: { steps: [
      { cap: '农夫捉公鸡、农妇捉母鸡：只能上下左右移动', fn: function (ctx, W, Hh) { U.checker(ctx, W, Hh, 5, 5, [{ r: 0, c: 0, label: '夫', color: '#7dd3fc' }, { r: 0, c: 2, label: '公', color: '#f87171' }, { r: 4, c: 4, label: '妇', color: '#6ee7b7' }, { r: 4, c: 2, label: '母', color: '#fbbf24' }]); U.lines(ctx, W, [['轮流移动，移一步就捉住对方即胜', 13, '#5eead4', true]], 296); } },
      { cap: '染色观察：每移一步，所在格的颜色必翻转', fn: function (ctx, W, Hh) { U.checker(ctx, W, Hh, 5, 5, [{ r: 0, c: 0, label: '夫', color: '#7dd3fc' }], [{ r: 0, c: 1, color: 'rgba(125,211,252,.25)' }, { r: 1, c: 0, color: 'rgba(125,211,252,.25)' }]); U.lines(ctx, W, [['上下左右相邻的格子颜色必相反', 13, '#fbbf24', true], ['同色格上出发 → 任意步后仍同色', 13, '#8fa0c8']], 296); } },
      { cap: '农夫与公鸡同色出发 → 永远同色，而捉住要求相邻（异色）', fn: function (ctx, W, Hh) { U.checker(ctx, W, Hh, 5, 5, [{ r: 0, c: 0, label: '夫', color: '#7dd3fc' }, { r: 0, c: 2, label: '公', color: '#f87171' }], [{ r: 0, c: 0, color: 'rgba(125,211,252,.25)' }, { r: 0, c: 2, color: 'rgba(125,211,252,.25)' }]); U.lines(ctx, W, [['同色永不相邻 → 农夫永远捉不到公鸡', 13, '#f87171', true]], 296); } },
      { cap: '同理：农妇与母鸡也同色，原目标都捉不到', fn: function (ctx, W, Hh) { U.checker(ctx, W, Hh, 5, 5, [{ r: 4, c: 4, label: '妇', color: '#6ee7b7' }, { r: 4, c: 2, label: '母', color: '#fbbf24' }], [{ r: 4, c: 4, color: 'rgba(251,191,36,.25)' }, { r: 4, c: 2, color: 'rgba(251,191,36,.25)' }]); U.lines(ctx, W, [['两组都同色 → 各自的目标都不可达', 13, '#f87171', true]], 296); } },
      { cap: '答案：交叉捉鸡——农夫捉母鸡、农妇捉公鸡 ✓', fn: function (ctx, W, Hh) { U.checker(ctx, W, Hh, 5, 5, [{ r: 1, c: 1, label: '夫', color: '#7dd3fc' }, { r: 3, c: 1, label: '公', color: '#f87171' }, { r: 3, c: 3, label: '妇', color: '#6ee7b7' }, { r: 1, c: 3, label: '母', color: '#fbbf24' }]); U.lines(ctx, W, [['异色出发才能相邻相捉 ✓', 13, '#4ade80', true]], 296); } }
    ] } });})();
