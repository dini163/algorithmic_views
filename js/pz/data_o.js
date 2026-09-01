/* 第 1 章 · 概览 21 个示例（全覆盖） */
(function () {
  var H = PZ.H, U = PZ.U, D = PZ.def;
  var g = 'o';

  /* 概1 幻方 */
  D({ g: g, no: 1, title: '幻方', e: 'board', strat: '数学构造',
    plain: '把 1~9 填进九宫格，让每行、每列、两条对角线的和都一样。套路：总和 45 除以 3 行得 15，5 必须坐镇中央，偶数占四个角。',
    p: { steps: [
      { cap: '目标：1~9 填入 3×3，行、列、对角线和全相等', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['?', '?', '?'], ['?', '?', '?'], ['?', '?', '?']]); } },
      { cap: '总和 1+2+…+9 = 45，共 3 行 → 每行和必须是 45÷3 = 15', fn: function (ctx, W, Hh) { U.lines(ctx, W, [['1+2+…+9 = 45', 17, '#5eead4', true], ['每行和 = 45 ÷ 3 = 15', 17, '#fbbf24', true]], 90, 36); } },
      { cap: '5 必须放中央：过中心的 4 条线都要凑 15', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', ''], ['', '5', ''], ['', '', '']]); } },
      { cap: '口诀"戴九履一，左三右七"填完：4 9 2 / 3 5 7 / 8 1 6', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['4', '9', '2'], ['3', '5', '7'], ['8', '1', '6']]); } },
      { cap: '验证：每行、每列、两对角线全部 = 15 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['4', '9', '2'], ['3', '5', '7'], ['8', '1', '6']], { cellColor: function () { return '#1e3a34'; } }); } }
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

  /* 概6 变位词检测（原书：文件中找出所有变位词集合） */
  D({ g: g, no: 6, title: '变位词检测', e: 'board', strat: '变治',
    plain: '设计一种算法，在一个巨大的英语单词文件中找出所有的变位词集合（如 listen、silent、tinsel 互为变位词）。笨办法要枚举所有排列；聪明办法（变治）：为每个单词按字母排序得到"签名"，再按签名排序文件，变位词就彼此靠在一起了。',
    p: { steps: [
      { cap: 'listen 和 silent 是变位词吗？', fn: function (ctx, W) { U.row(ctx, W, 90, 'listen'.split('')); U.row(ctx, W, 150, 'silent'.split('')); } },
      { cap: '变治：每个单词排序得到"签名"，再按签名排序文件', fn: function (ctx, W) { U.lines(ctx, W, [['listen → eilnst；silent → eilnst', 14, '#8fa0c8']], 40); U.row(ctx, W, 90, 'eilnst'.split(''), [0, 1, 2, 3, 4, 5]); U.row(ctx, W, 150, 'eilnst'.split(''), [0, 1, 2, 3, 4, 5]); } },
      { cap: '签名相同的单词彼此相邻 → 全部变位词集合一次找出 ✓（O(n log n)）', fn: function (ctx, W) { U.row(ctx, W, 100, 'eilnst'.split(''), [0, 1, 2, 3, 4, 5]); U.lines(ctx, W, [['签名分组 = 变位词集合 ✓', 17, '#4ade80', true]], 180); } }
    ] } });

      /* 概7 现金分装（原书：1000 美元分装 10 个信封） */
  D({ g: g, no: 7, title: '现金分装', e: 'board', strat: '数学技巧·二进制',
    plain: '你手里有 1000 张 1 美元的钞票，如何将其分装到 10 个信封内，使得从 1 到 1000 美元（含）的任何数额皆可仅用若干信封的组合给出？（不允许找零。）答案：前 9 个信封分别装 1、2、4、8、16、32、64、128、256 张（2 的幂，可组合出 1~511），第 10 个信封装剩余 1000 − 511 = 489 张；任何数额都是若干信封的二进制组合。',
    p: { steps: [
      { cap: '1000 张 1 美元钞票，分装进 10 个信封，任何 1~1000 美元都能用整信封组合给出', fn: function (ctx, W) { U.lines(ctx, W, [['$1000 → 10 个信封', 18, '#5eead4', true]], 120); } },
      { cap: '前 9 个信封装 2 的幂：1, 2, 4, 8, 16, 32, 64, 128, 256（可组合 1~511）', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 2, 4, 8, 16, 32, 64, 128, 256]); U.lines(ctx, W, [['二进制组合覆盖 1~511', 14, '#8fa0c8']], 180); } },
      { cap: '第 10 个信封装 1000 − 511 = 489 张 → 任何 1~1000 数额都可组合 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['第 10 个信封：489 张', 16, '#fbbf24', true], ['如 $1000 = 489+256+128+64+32+16+8+4+2+1', 13, '#8fa0c8']], 100, 36); } }
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
    plain: '8×8 棋盘最多放几个互不攻击的王？王管周围一圈，所以每个 2×2 小方块里最多 1 个，隔行隔列摆，正好 16 个。',
    p: { steps: [
      { cap: '王攻击周围 8 格 → 每个 2×2 区域最多放 1 个', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['王', '×'], ['×', '×']], { max: 60 }); } },
      { cap: '8×8 = 16 个 2×2 区域 → 上界 16 个', fn: function (ctx, W, Hh) { U.lines(ctx, W, [['棋盘可划分成 16 个互不相交的 2×2 区域', 15, '#8fa0c8'], ['每个区域最多 1 个王 → 最多 16 个', 16, '#fbbf24', true]], 120); } },
      { cap: '隔行隔列摆放正好达到 16 个 → 答案 16 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(r % 2 === 0 && c % 2 === 0 ? '♚' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true }); } }
    ] } });

  /* 概12 夜过吊桥 */
  D({ g: g, no: 12, title: '夜过吊桥', e: 'timeline', strat: '贪心·调度',
    plain: '4 人深夜过桥，只有一个火把，桥每次最多过 2 人，过桥速度按慢的算。关键一招：让最慢的两个人一起过，别让慢的人占着火把来回跑。',
    p: { total: 17, segs: [
      { who: '1+2 过桥', start: 0, dur: 2 }, { who: '1 送回火把', start: 2, dur: 1 },
      { who: '5+10 过桥', start: 3, dur: 10 }, { who: '2 送回火把', start: 13, dur: 2 },
      { who: '1+2 过桥', start: 15, dur: 2 }],
      cap: '总计 17 分钟：5 和 10 结伴过桥是精髓' } });

      /* 概13 柠檬水摊设点（原书：十字路口二维曼哈顿距离） */
  D({ g: g, no: 13, title: '柠檬水摊设点', e: 'board', strat: '贪心·中位数',
    plain: '在纵横交错的城市街道上，艾力克斯、布兰达、凯茜、丹等 5 户人家的房子分布在五个十字路口。试问，柠檬水摊要摆在哪个十字路口，才能距离所有人的家最近（距离按纵横街区总数计算，即曼哈顿距离）？答案：摊点的 x 坐标取所有房子 x 坐标的中位数、y 坐标取所有房子 y 坐标的中位数——总距离在 x、y 方向相互独立，一维最优都是中位数，所以二维最优是 (x 中位数, y 中位数)。',
    p: { steps: [
      { cap: '5 户人家在街道十字路口，距离 = 横向街区数 + 纵向街区数（曼哈顿距离）', fn: function (ctx, W) { U.lines(ctx, W, [['总距离 = Σ|xᵢ−x| + Σ|yᵢ−y|', 15, '#5eead4', true]], 130); } },
      { cap: 'x、y 方向独立：各自取中位数（两边户数平衡的点）', fn: function (ctx, W) { U.lines(ctx, W, [['x 取 x 中位数、y 取 y 中位数', 15, '#fbbf24', true]], 130); } },
      { cap: '答案：摊点摆在中位数十字路口，总距离最小 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['答案：二维中位数', 18, '#4ade80', true]], 130); } }
    ] } });
  /* 概14 正数变号（原书：m×n 表格行/列变号使和非负） */
  D({ g: g, no: 14, title: '正数变号', e: 'board', strat: '迭代改进',
    plain: '给定一个 m×n 的实数表格，能否找出一个算法，在仅允许将一整行或一整列的数字改变符号的前提下，使得所有的行和列之和非负？答案：能——迭代改进：反复寻找和为负数的一行（或一列），把它整行（整列）变号。因为把负和的行/列变号会让"全体数字之和"严格增加，而总和有限，所以算法有限步后必然停止，此时不存在负和行/列，目标达成。',
    p: { steps: [
      { cap: '目标：仅允许整行/整列变号，使所有行和、列和非负', fn: function (ctx, W) { U.lines(ctx, W, [['每步把负和的行或列整体变号', 15, '#5eead4', true]], 130); } },
      { cap: '关键：负和行/列变号 → 全体数字总和严格增加（单变不变量）', fn: function (ctx, W) { U.lines(ctx, W, [['总和增加且有限 → 算法必然终止', 15, '#fbbf24', true]], 130); } },
      { cap: '答案：算法存在（迭代改进），有限步后所有行和列非负 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['答案：迭代改进可行', 18, '#4ade80', true]], 130); } }
    ] } });
/* 概15 最短路径计数 */
  D({ g: g, no: 15, title: '最短路径计数', e: 'griddp', strat: '动态规划',
    plain: '从城市网格的左上走到右下，只许向右和向下，一共有多少条最短路线？每格的路数 = 上方 + 左方，填表一路推到底。',
    p: { rows: 5, cols: 5, mode: 'count', val: function () { return 0; } } });

  /* 概16 国际象棋的发明 */
  D({ g: g, no: 16, title: '国际象棋的发明', e: 'board', strat: '数学技巧·指数',
    plain: '国王要奖赏发明者：棋盘第 1 格 1 粒麦子，第 2 格 2 粒，每格翻倍。翻到第 64 格就是 2 的 63 次方，全世界的麦子都不够。',
    p: { steps: [
      { cap: '第 k 格放 2^(k−1) 粒麦子', fn: function (ctx, W) { U.row(ctx, W, 110, ['格1: 1', '格2: 2', '格3: 4', '格4: 8', '格5: 16']); } },
      { cap: '翻倍增长极快：第 21 格就超过一百万粒', fn: function (ctx, W) { U.lines(ctx, W, [['2^10 = 1,024', 16, '#8fa0c8'], ['2^20 = 1,048,576（超过百万）', 16, '#fbbf24', true], ['2^30 ≈ 10.7 亿', 16, '#8fa0c8']], 100, 34); } },
      { cap: '第 64 格 = 2^63 ≈ 9.2×10^18 粒，总数 ≈ 1.8×10^19 粒', fn: function (ctx, W) { U.lines(ctx, W, [['总数 = 2^64 − 1', 18, '#5eead4', true], ['≈ 18,446,744,073,709,551,615 粒', 15, '#fbbf24', true], ['全世界的麦子都不够付', 15, '#f87171']], 100, 36); } }
    ] } });

      /* 概17 方块搭建（原书：每步外围填满方块，第 n 步 2n²−2n+1） */
  D({ g: g, no: 17, title: '方块搭建', e: 'board', strat: '数学技巧·递推',
    plain: '算法起始时只有一个单位方块。每步迭代都在上一步的外围填满方块。试问，在第 n 步迭代时，总共有多少个单位方块？（最初几步：第 1 步 1 个、第 2 步 9 个、第 3 步 25 个…）答案：2n² − 2n + 1——第 i 步（i>1）在外围增加 4(i−1) 个方块，总数 = 1 + 4(1+2+…+(n−1)) = 2n² − 2n + 1；也可看成最长的水平行有 2n−1 个方块，上下各含 1 到 2n−3 的所有奇数。',
    p: { steps: [
      { cap: '从 1 个方块开始，每步在外围填满一圈：1 → 9 → 25 → …', fn: function (ctx, W) { U.lines(ctx, W, [['第 1 步 1 个、第 2 步 9 个、第 3 步 25 个', 16, '#5eead4', true]], 130); } },
      { cap: '第 i 步外围增加 4(i−1) 个方块', fn: function (ctx, W) { U.lines(ctx, W, [['总数 = 1 + 4(1+2+…+(n−1))', 15, '#fbbf24', true]], 130); } },
      { cap: '答案：第 n 步共有 2n² − 2n + 1 个单位方块 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['答案：2n² − 2n + 1', 18, '#4ade80', true]], 130); } }
    ] } });
/* 概18 汉诺塔 */
  D({ g: g, no: 18, title: '汉诺塔', e: 'hanoi', strat: '减治·递归',
    plain: '把 n 个大小盘从 A 柱搬到 C 柱，大盘永远不能压小盘。递归思路：先把上面 n−1 个借道搬到 B，搬最大的，再把 n−1 个搬回来。',
    p: { n: 4, pegs: 3, cap: '4 盘共 2^n − 1 = 15 步' } });

  /* 概19 缺角棋盘的多米诺铺陈 */
  D({ g: g, no: 19, title: '缺角棋盘的多米诺铺陈', e: 'board', strat: '奇偶/不变量',
    plain: '8×8 棋盘挖掉对角的两个格，剩下 62 格能用 31 张多米诺骨牌铺满吗？不能！黑白染色后挖掉的两格同色，而每张骨牌必须盖一黑一白。',
    p: { steps: [
      { cap: '挖掉对角两格的棋盘，能用 31 张多米诺铺满吗？', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push((r === 0 && c === 0) || (r === 7 && c === 7) ? '×' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, txtColor: function (r, c, v) { return v === '×' ? '#f87171' : '#e8ecf8'; } }); } },
      { cap: '黑白染色：每张多米诺必然盖住一黑一白', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['黑', '白', '黑'], ['白', '黑', '白'], ['黑', '白', '黑']], { checker: true, txtColor: function (r, c) { return (r + c) % 2 ? '#7dd3fc' : '#fbbf24'; } }); } },
      { cap: '对角两格同色 → 剩 30 黑 32 白，骨牌一黑一白 → 不可能铺满', fn: function (ctx, W) { U.lines(ctx, W, [['挖掉的两格都是黑色', 16, '#fbbf24', true], ['剩余：30 黑 vs 32 白', 16, '#f87171', true], ['每张骨牌盖 1 黑 1 白 → 永远差 2 格 → 无解', 15, '#dfe6f8']], 110, 34); } }
    ] } });

  /* 概20 哥尼斯堡七桥 */
  D({ g: g, no: 20, title: '哥尼斯堡七桥问题', e: 'tour', strat: '图论·欧拉',
    plain: '能不能每座桥恰好走一遍再回到出发点？把陆地变成点、桥变成线后一看：4 个点全是奇数度，一笔画根本不存在，欧拉由此开创了图论。',
    p: { euler: true, start: 0, endNote: '失败：无法走遍全部 7 座桥',
      nodes: [{ x: 0.30, y: 0.16, label: '北岸' }, { x: 0.80, y: 0.42, label: '东岸' }, { x: 0.56, y: 0.84, label: '南岸' }, { x: 0.36, y: 0.52, label: '岛' }],
      edges: [[0, 3], [0, 3], [3, 2], [3, 2], [3, 1], [0, 1], [2, 1]],
      cap: '4 个奇度顶点 > 2 → 欧拉回路不存在' } });

      /* 概21 田地里的鸡（原书：农夫/农妇/公鸡/母鸡追逐） */
  D({ g: g, no: 21, title: '田地里的鸡', e: 'board', strat: '不变量·染色',
    plain: '在一块棋盘状田地上，农夫、农妇、公鸡、母鸡各占一格，依次移动：每次可以把棋子移到上下左右任一方向的相邻位置（不能移到对角线）。目标是让农夫捉住公鸡、农妇捉住母鸡（即人再移一步就占据鸡的位置），用最少移动步数完成。答案：把棋盘黑白染色后可以发现，只有人和鸡位于颜色不同的相邻格子里时，人才能捉到鸡；而农夫和公鸡、农妇和母鸡分别从同色格出发（该性质在任意有限步移动后保持不变），所以农夫应该去捉母鸡、农妇去捉公鸡。',
    p: { steps: [
      { cap: '农夫/农妇/公鸡/母鸡在棋盘上轮流移动（上下左右），目标是捉到鸡', fn: function (ctx, W) { U.lines(ctx, W, [['每次移动换格 → 所在格颜色翻转', 15, '#8fa0c8']], 130); } },
      { cap: '染色不变量：农夫和公鸡从同色格出发，永远保持同色 → 捉不到', fn: function (ctx, W) { U.lines(ctx, W, [['同色出发：农夫捉不到公鸡、农妇捉不到母鸡', 15, '#fbbf24', true]], 130); } },
      { cap: '答案：农夫去捉母鸡、农妇去捉公鸡 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['答案：交叉捉鸡（染色不变量）', 17, '#4ade80', true]], 130); } }
    ] } });})();
