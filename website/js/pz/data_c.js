/* 第 2 章 · 谜题 101-150（全覆盖） */
(function () {
  var H = PZ.H, U = PZ.U, D = PZ.def, g = 'c';

  /* 101 房间喷漆 */
  D({ g: g, no: 101, title: '房间喷漆', e: 'board', strat: '图论·着色',
    plain: '相邻房间不能喷同色，最少用几种颜色？把房间当点、相邻关系当边，就是图的着色问题；这间户型 3 种颜色足够。',
    p: { steps: [
      { cap: '5 个房间，相邻的不能同色', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E']); } },
      { cap: '贪心着色：按顺序挑"邻居没用过的最小编号"颜色', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E'], [{ color: '#f87171' }, { color: '#7dd3fc' }]); } },
      { cap: '3 色完成：红-蓝-绿循环分配，相邻全不同 ✓', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E'], [{ color: '#f87171' }, { color: '#7dd3fc' }, { color: '#4ade80' }, { color: '#f87171' }, { color: '#7dd3fc' }]); } }
    ] } });

  /* 102 猴子和椰子 */
  D({ g: g, no: 102, title: '猴子和椰子', e: 'board', strat: '倒推·同余',
    plain: '5 个水手分椰子：每人夜里把椰子分 5 份恰多 1 个给猴子，藏起自己那份。最小的初值是多少？从最后倒推、用同余一步步还原：3121。',
    p: { steps: [
      { cap: '每次分 5 份多 1 给猴子，共 5 轮，最后还能 5 等分', fn: function (ctx, W) { U.lines(ctx, W, [['N ≡ 1 (mod 5)，连过 5 关', 17, '#5eead4', true]], 130); } },
      { cap: '倒推：设最后剩 5k 个，逐轮乘 5/4 加回猴子的 1 个', fn: function (ctx, W) { U.lines(ctx, W, [['倒推公式：上轮 = 本轮 × 5/4 + 1', 16, '#fbbf24', true]], 130); } },
      { cap: '最小整数解：3121 个椰子 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['3121', 30, '#4ade80', true], ['3121 → 2496 → 1996 → 1596 → 1276 → 1020，均可 5 等分多 1', 13, '#8fa0c8']], 100, 44); } }
    ] } });

  /* 103 跳到另一边 */
  D({ g: g, no: 103, title: '跳到另一边', e: 'arrange', strat: '构造·交替',
    plain: '2 个红棋 2 个蓝棋隔空对坐，棋子只能前进：滑一格或跳过对方一枚。5 步就能让两队完全互换，滑动与跳跃要交替安排。',
    p: { init: ['红', '红', '_', '蓝', '蓝'], dark: true,
      colorOf: function (v) { return v === '红' ? '#dc2626' : v === '蓝' ? '#2563eb' : '#131a38'; },
      textOf: function (v) { return v === '_' ? '' : v; },
      ops: [
        { t: 'mov', i: 1, j: 2, cap: '红滑一格' },
        { t: 'mov', i: 3, j: 1, cap: '蓝跳过红' },
        { t: 'mov', i: 2, j: 4, cap: '红跳过蓝' },
        { t: 'mov', i: 3, j: 2, cap: '蓝滑一格' },
        { t: 'mov', i: 0, j: 2, cap: '红跳过蓝 → 互换完成 ✓' }
      ] } });

  /* 104 堆分割 */
  D({ g: g, no: 104, title: '堆分割', e: 'board', strat: '二进制·分治',
    plain: '一堆 n 个石子反复"分成两堆"直到全是 1。无论怎么分，都要恰好分 n−1 次，每次分裂只让堆数加 1。',
    p: { steps: [
      { cap: '8 个石子的一堆', fn: function (ctx, W) { piles(ctx, W, [8]); } },
      { cap: '每次把一堆拆成两堆：堆数 +1', fn: function (ctx, W) { piles(ctx, W, [4, 4]); } },
      { cap: '拆到 8 个单粒堆要 7 次：n−1 次 ✓', fn: function (ctx, W) { piles(ctx, W, [1, 1, 1, 1, 1, 1, 1, 1]); } }
    ] } });
  function piles(ctx, W, arr) {
    var total = arr.length;
    var gap = Math.min(80, (W - 160) / Math.max(total, 1));
    var x0 = (W - gap * (total - 1)) / 2;
    arr.forEach(function (n, i) {
      for (var k = 0; k < n && k < 9; k++) H.circle(ctx, x0 + i * gap, 230 - k * 17, 7, '#fbbf24');
      H.mono(ctx, String(n), x0 + i * gap, 252, { size: 12, color: '#8fa0c8', bold: true });
    });
  }

  /* 105 MU 问题 */
  D({ g: g, no: 105, title: 'MU 问题', e: 'arrange', strat: '不变量·形式系统',
    plain: '从 MI 出发，用四条规则能推出 MU 吗？不能！I 的个数初始是 1，任何规则都无法让 I 的个数变成 3 的倍数，而 MU 需要 0 个 I。',
    p: { init: ['M', 'I'], dark: true,
      colorOf: function (v) { return v === 'M' ? '#fbbf24' : v === 'I' ? '#7dd3fc' : '#f0abfc'; },
      ops: [
        { t: 'ins', i: 2, v: 'I', cap: '规则2 Mx→Mxx：MI → MII' },
        { t: 'ins', i: 3, v: 'I', cap: '规则2：MII → MIII' },
        { t: 'ins', i: 4, v: 'I', cap: '规则2：MIII → MIIII' },
        { t: 'set', i: 2, v: 'U', cap: '规则3 III→U（第一步）' },
        { t: 'del', i: 3, cap: '规则3：删去多余 I → MIU' },
        { t: 'del', i: 3, cap: '得到 MIU：I 的个数始终是 1、2、4…永不是 3 的倍数' },
        { t: 'swap', i: 0, j: 0, cap: 'MU 需要 0 个 I（0 是 3 的倍数）→ 永远推不出 MU ✓' }
      ] } });

  /* 106 开灯 */
  D({ g: g, no: 106, title: '开灯', e: 'flip', strat: '数学技巧·十字翻转',
    plain: '3×3 灯阵，按一盏灯会翻转它和上下左右邻居。现在亮着的是个"十"字，按一下正中央，十字的五盏灯同时翻转，正好全灭。',
    p: { init: [0, 1, 0, 1, 1, 1, 0, 1, 0], cols: 3,
      ops: [
        { at: [], cap: '当前亮灯呈十字形' },
        { at: [1, 3, 4, 5, 7], cap: '按正中央：十字五灯同时翻转 → 全灭 ✓' }
      ], cap: '一次命中所有亮灯' } });

  /* 107 狐狸和野兔 */
  D({ g: g, no: 107, title: '狐狸和野兔', e: 'gridmove', strat: '贪心·追逐',
    plain: '4×4 草地上狐狸追兔子，轮流跑一格。狐狸的策略：先把行或列对齐，再一步步缩小包围圈，把兔子逼进死角。',
    p: { rows: 4, cols: 4,
      pieces: [{ id: '狐', label: '狐', color: '#f87171', r: 0, c: 0 }, { id: '兔', label: '兔', color: '#fbbf24', r: 3, c: 3 }],
      moves: [
        { id: '兔', r: 3, c: 2, cap: '兔向左逃' }, { id: '狐', r: 1, c: 0, cap: '狐逼近' },
        { id: '兔', r: 2, c: 2, cap: '兔向上逃' }, { id: '狐', r: 2, c: 0, cap: '狐对齐第 3 行！' },
        { id: '兔', r: 2, c: 3, cap: '兔向右挣扎' }, { id: '狐', r: 2, c: 1, cap: '狐横向收网' },
        { id: '兔', r: 1, c: 3, cap: '兔逃向角落' }, { id: '狐', r: 2, c: 2, cap: '狐封锁退路，兔子无路可逃 ✓' }
      ], cap: '对齐-逼近-收网' } });

  /* 108 最长路径 */
  D({ g: g, no: 108, title: '最长路径', e: 'griddp', strat: '动态规划',
    plain: '带障碍的网格里，从左上到右下能走的最长路线（只向右/向下）有多长？把每格价值记 1，做"最大值"版 DP，障碍格不可达。',
    p: { rows: 6, cols: 6, mode: 'max', showVals: false, blocked: [[1, 3], [3, 1], [4, 4]],
      val: function () { return 1; } } });

  /* 109 双 n 多米诺骨牌 */
  var k7N = [], k7E = [], k;
  for (k = 0; k < 7; k++) {
    var a7 = (k * 360 / 7 - 90) * Math.PI / 180;
    k7N.push({ x: 0.5 + 0.38 * Math.cos(a7), y: 0.5 + 0.38 * Math.sin(a7), label: String(k) });
  }
  for (var i7 = 0; i7 < 7; i7++) for (var j7 = i7 + 1; j7 < 7; j7++) k7E.push([i7, j7]);
  D({ g: g, no: 109, title: '双 n 多米诺骨牌', e: 'tour', strat: '图论·欧拉',
    plain: '双 6 骨牌的 21 张牌能首尾相接排成一条链吗？把数字当顶点、每张牌当一条边，问题变成 K7 的欧拉路径，每个顶点 6 条边全是偶度，能成环！',
    p: { euler: true, start: 0, nodes: k7N, edges: k7E, endNote: '21 张牌全部接上', cap: 'K7 全偶度 → 欧拉回路存在' } });

  /* 110 变色龙 */
  D({ g: g, no: 110, title: '变色龙', e: 'board', strat: '同余/不变量',
    plain: '岛上有 13 红、15 绿、17 蓝变色龙，两只不同色相遇就都变成第三种颜色。能让所有变色龙同色吗？看三色数量模 3 的差，它是不变量，目标状态到不了。',
    p: { steps: [
      { cap: '红 13、绿 15、蓝 17', fn: function (ctx, W) { U.row(ctx, W, 110, ['红13', '绿15', '蓝17']); } },
      { cap: '两异色相遇 → 各 −1，第三色 +2：模 3 的差不变', fn: function (ctx, W) { U.lines(ctx, W, [['(13,15,17) → (12,14,19) → …', 16, '#5eead4'], ['两两之差 mod 3 保持不变', 16, '#fbbf24', true]], 110, 38); } },
      { cap: '全同色要求两色为 0（差 ≡ 0 mod 3），与初始差矛盾 → 不可能 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['初始差 mod 3 ≠ 0', 17, '#f87171', true], ['结论：永远无法全部同色', 17, '#4ade80', true]], 110, 38); } }
    ] } });

  /* 111 反转硬币三角形阵 */
  D({ g: g, no: 111, title: '反转硬币三角形阵', e: 'board', strat: '几何·移动',
    plain: '15 枚硬币摆成 5 层三角形，移动 3 枚让三角形上下颠倒。搬走顶层 1 枚、底层两端的 2 枚，放到对面即可。',
    p: { steps: [
      { cap: '5 层硬币三角，尖端朝上', fn: function (ctx, W) { triCoins(ctx, W, 5, false, []); } },
      { cap: '标记要移动的 3 枚：顶点与底边两端', fn: function (ctx, W) { triCoins(ctx, W, 5, false, [[0, 0], [4, 0], [4, 4]]); } },
      { cap: '移到对面 → 三角形倒转 ✓', fn: function (ctx, W) { triCoins(ctx, W, 5, true, []); } }
    ] } });
  function triCoins(ctx, W, rows, flip, hot) {
    var cx = W / 2, y0 = flip ? 240 : 70, sp = 34;
    for (var r = 0; r < rows; r++) for (var c = 0; c <= r; c++) {
      var x = cx + (c - r / 2) * sp, y = flip ? y0 - r * sp * 0.87 : y0 + r * sp * 0.87;
      var isHot = hot.some(function (h) { return h[0] === r && h[1] === c; });
      H.circle(ctx, x, y, 11, isHot ? '#f87171' : '#fbbf24');
    }
  }

  /* 112 再次讨论多米诺平铺问题 */
  D({ g: g, no: 112, title: '再次讨论多米诺平铺问题', e: 'tiling', strat: '奇偶/构造',
    plain: '挖掉一黑一白两个格子的棋盘还能铺满吗？染色条件满足（30 黑 30 白），回溯法真的能找到铺法，必要条件这回也是充分的。',
    p: { n: 8, m: 8, type: 'domino', miss: [[0, 0], [7, 6]], cap: '挖掉一黑一白 → 仍可铺满' } });

  /* 113 拿走硬币 */
  D({ g: g, no: 113, title: '拿走硬币', e: 'board', strat: '博弈·倒推',
    plain: '21 枚硬币，每人每次拿 1~3 枚，拿到最后一枚的输。倒推必胜态：给对手留下 1、5、9、13、17、21……先手拿 1 枚，之后与对手凑 4。',
    p: { steps: [
      { cap: '21 枚硬币，拿最后一枚者输', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, '…', 19, 20, 21]); } },
      { cap: '倒推：剩 1 枚轮到谁谁输 → 必胜点是 5,9,13,17,21', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 5, 9, 13, 17, 21], [0, 1, 2, 3, 4, 5]); } },
      { cap: '先手拿 1（剩 20），此后每轮与对手凑 4 → 稳赢 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['21 → 20 → 16 → 12 → 8 → 4 → 1(对手拿)', 16, '#4ade80', true]], 130); } }
    ] } });

  /* 114 划线过点 */
  var dot9 = function (ctx, W, Hh) {
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) H.circle(ctx, W / 2 + (c - 1) * 50, 150 + (r - 1) * 50, 7, '#dfe6f8');
  };
  D({ g: g, no: 114, title: '划线过点', e: 'geo', strat: '突破框架·构造',
    plain: '3×3 的 9 个点，用 4 条不间断的直线一笔全穿过？必须把线画到点阵外面去，"跳出方框"才能解开这道经典题。',
    p: { steps: [
      { cap: '9 个点，4 条直线，一笔连完', fn: function (ctx, W, Hh) { dot9(ctx, W, Hh); } },
      { cap: '第 1 条：竖穿左列，画到点阵外', fn: function (ctx, W, Hh) { dot9(ctx, W, Hh); H.line(ctx, W / 2 - 50, 100, W / 2 - 50, 250, '#f87171', 2.5); } },
      { cap: '第 2 条：斜穿到右上方界外', fn: function (ctx, W, Hh) { dot9(ctx, W, Hh); H.line(ctx, W / 2 - 50, 100, W / 2 - 50, 250, '#f87171', 2.5); H.line(ctx, W / 2 - 50, 250, W / 2 + 100, 100, '#fbbf24', 2.5); } },
      { cap: '第 3 条：横穿顶行回到左上', fn: function (ctx, W, Hh) { dot9(ctx, W, Hh); H.line(ctx, W / 2 - 50, 100, W / 2 - 50, 250, '#f87171', 2.5); H.line(ctx, W / 2 - 50, 250, W / 2 + 100, 100, '#fbbf24', 2.5); H.line(ctx, W / 2 + 100, 100, W / 2 - 100, 100, '#4ade80', 2.5); } },
      { cap: '第 4 条：对角线收尾 → 9 点全过 ✓', fn: function (ctx, W, Hh) { dot9(ctx, W, Hh); H.line(ctx, W / 2 - 50, 100, W / 2 - 50, 250, '#f87171', 2.5); H.line(ctx, W / 2 - 50, 250, W / 2 + 100, 100, '#fbbf24', 2.5); H.line(ctx, W / 2 + 100, 100, W / 2 - 100, 100, '#4ade80', 2.5); H.line(ctx, W / 2 - 100, 100, W / 2 + 50, 250, '#7dd3fc', 2.5); } }
    ] } });

  /* 115 Bachet 的砝码 */
  D({ g: g, no: 115, title: 'Bachet 的砝码', e: 'weigh', strat: '三进制·贪心',
    plain: '只许 4 个砝码，要在天平上称出 1~40 克任何整数重量：选 1、3、9、27（3 的幂）。砝码可以放两边，三进制里每位取 −1、0、1。',
    p: { n: 4, title: '砝码 1、3、9、27 称遍 1~40', steps: [
      { L: ['7克物', '3'], R: ['9', '1'], res: '=', note: '称 7 克：物品 + 3 克砝码 vs 9 + 1 → 7 = 9 + 1 − 3' },
      { L: ['2克物', '1'], R: ['3'], res: '=', note: '称 2 克：物品 + 1 vs 3 → 2 = 3 − 1 ✓' }
    ] } });

  /* 116 轮空计数 */
  D({ g: g, no: 116, title: '轮空计数', e: 'board', strat: '数学技巧·2 的幂',
    plain: '37 人打单淘汰赛，第一轮要让几个人轮空？补到最近的 2 的幂：64 − 37 = 27 个轮空位，这样第二轮开始就是完美对半 bracket。',
    p: { steps: [
      { cap: '37 名选手，淘汰赛需要 2 的幂个签位', fn: function (ctx, W) { U.lines(ctx, W, [['选手：37', 18, '#5eead4', true]], 130); } },
      { cap: '最近的 2 的幂是 64', fn: function (ctx, W) { U.row(ctx, W, 120, [16, 32, 64, 128], [2]); } },
      { cap: '轮空数 = 64 − 37 = 27 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['27 人首轮轮空', 20, '#fbbf24', true]], 130); } }
    ] } });

  /* 117 一维跳棋 */
  D({ g: g, no: 117, title: '一维跳棋', e: 'arrange', strat: '构造·跳跃',
    plain: '一排跳棋只能向右跳（滑一格或跳过一枚对方棋子），最少几步整体推进？跳跃比滑动"赚"一格，规划好跳与滑的节奏。',
    p: { init: ['●', '○', '●', '○', '_', '_'], dark: true,
      colorOf: function (v) { return v === '●' ? '#e2e8f0' : v === '○' ? '#dc2626' : '#131a38'; },
      textOf: function (v) { return v === '_' ? '' : v; },
      ops: [
        { t: 'mov', i: 2, j: 4, cap: '● 跳到空位' },
        { t: 'mov', i: 3, j: 2, cap: '○ 向左跳' },
        { t: 'mov', i: 4, j: 3, cap: '● 滑一格补位' },
        { t: 'mov', i: 0, j: 1, cap: '整体向右推进一格 ✓（循环使用跳+滑）' }
      ] } });

  /* 118 六骑士 */
  D({ g: g, no: 118, title: '六骑士', e: 'board', strat: '图论·轮换',
    plain: '3×4 棋盘上 3 白骑士与 3 黑骑士互换位置。把所有合法跳跃连成一个大循环，让 6 位骑士沿循环各走半圈。',
    p: { steps: [
      { cap: '3×4 棋盘：白在上排，黑在下排', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['♞', '♞', '♞', ''], ['', '', '', ''], ['', '', '', '♞']], { max: 44, txtColor: function (r, c, v) { return r === 0 ? '#e2e8f0' : '#475569'; } }); } },
      { cap: '骑士可达格连成一个 8 步大循环', fn: function (ctx, W) { U.lines(ctx, W, [['把棋盘上的合法跳跃画成图', 15, '#8fa0c8'], ['恰好构成一条环路', 16, '#fbbf24', true]], 120, 36); } },
      { cap: '每位骑士沿环路前进半圈 → 黑白互换 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['♞', '', '', ''], ['', '', '', ''], ['♞', '♞', '♞', '']], { max: 44, txtColor: function (r, c, v) { return r === 2 ? '#e2e8f0' : '#475569'; } }); } }
    ] } });

  /* 119 有色三格板平铺 */
  D({ g: g, no: 119, title: '有色三格板平铺', e: 'tiling', strat: '分治·染色',
    plain: '给每块 L 三格骨牌染上不同颜色，再铺满缺角棋盘，分治法保证每块骨牌来自哪一层递归一目了然，像年轮一样。',
    p: { n: 4, type: 'tromino', miss: [0, 0], cap: '不同颜色 = 不同递归层级' } });

  /* 120 硬币分发机 */
  D({ g: g, no: 120, title: '硬币分发机', e: 'board', strat: '贪心·找零',
    plain: '找零 87 美分（25、10、5、1 美分硬币），怎么给最少枚数？贪心：先用最大的 25，再用 10……美国币值下贪心恰好最优。',
    p: { steps: [
      { cap: '找零 87 美分', fn: function (ctx, W) { U.lines(ctx, W, [['87¢', 24, '#5eead4', true]], 130); } },
      { cap: '贪心：87 = 25×3 + 10 + 1×2', fn: function (ctx, W) { U.row(ctx, W, 120, [25, 25, 25, 10, 1, 1]); } },
      { cap: '共 6 枚，已是最少 ✓（并非所有币值贪心都最优！）', fn: function (ctx, W) { U.lines(ctx, W, [['6 枚硬币', 18, '#fbbf24', true], ['反例：币值 1,3,4 找 6 → 贪心 4+1+1 不如 3+3', 13, '#8fa0c8']], 110, 38); } }
    ] } });

  /* 121 超级蛋测试 */
  D({ g: g, no: 121, title: '超级蛋测试', e: 'board', strat: '动态规划·均衡',
    plain: '100 层楼、2 颗蛋，找出蛋会碎的最低楼层，最坏情况最少试几次？第一颗蛋按 14、13、12……递减的间隔跳，最坏恰好 14 次。',
    p: { steps: [
      { cap: '100 层 2 颗蛋：碎了就没得试', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 100, [0, 50, 100]); } },
      { cap: '首跳 14 层：1+2+…+14 = 105 ≥ 100', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 100, [14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100]); } },
      { cap: '碎了就用第二颗蛋逐层扫上一段 → 最坏 14 次 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['答案：14 次', 22, '#fbbf24', true]], 130); } }
    ] } });

  /* 122 议会和解 */
  D({ g: g, no: 122, title: '议会和解', e: 'board', strat: '图论·二分',
    plain: '议员之间有矛盾，要分成两个委员会让矛盾双方不同组，就是图的二染色。若能染成，和解方案存在；染到冲突就说明无解。',
    p: { steps: [
      { cap: '6 位议员，连线表示"合不来"', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁', '戊', '己']); } },
      { cap: '二染色：交替分入两个委员会', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁', '戊', '己'], [{ color: '#7dd3fc' }, { color: '#fdba74' }, { color: '#7dd3fc' }]); } },
      { cap: '染完无冲突 → 两组委员会成立 ✓', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁', '戊', '己'], [{ color: '#7dd3fc' }, { color: '#fdba74' }, { color: '#7dd3fc' }, { color: '#fdba74' }, { color: '#7dd3fc' }, { color: '#fdba74' }]); } }
    ] } });

  /* 123 荷兰国旗问题 */
  D({ g: g, no: 123, title: '荷兰国旗问题', e: 'arrange', strat: '三指针·一趟扫描',
    plain: '把红白蓝三色乱序数组排成三段，只扫描一趟、只做交换。Dijkstra 的三指针：红指针收红、蓝指针收蓝、白指针巡检。',
    p: { init: ['红', '白', '蓝', '红', '蓝', '白', '白', '红', '蓝'], dark: true,
      colorOf: function (v) { return v === '红' ? '#dc2626' : v === '白' ? '#e2e8f0' : '#2563eb'; },
      ops: [
        { t: 'swap', i: 2, j: 8, hl: [2, 8], cap: '蓝指针遇到蓝 → 与队尾交换' },
        { t: 'swap', i: 1, j: 3, hl: [1, 3], cap: '红指针把红收进红区' },
        { t: 'swap', i: 4, j: 6, hl: [4, 6], cap: '中部白归位' },
        { t: 'swap', i: 5, j: 7, hl: [5, 7], cap: '红白蓝三段完成 ✓' }
      ], cap: '一趟扫描 O(n)，只做交换' } });

  /* 124 切割链条 */
  D({ g: g, no: 124, title: '切割链条', e: 'board', strat: '二进制·贪心',
    plain: '7 节链条当房费，每天付 1 节、可以找零。最少剪开几节？剪开第 3 节：得到单节 1、段 2、段 4，二进制组合覆盖 1~7。',
    p: { steps: [
      { cap: '7 节链条，每天付 1 节，允许找零', fn: function (ctx, W) { U.row(ctx, W, 120, ['○', '○', '○', '○', '○', '○', '○']); } },
      { cap: '剪开第 3 节 → 得到 1 节、2 节段、4 节段', fn: function (ctx, W) { U.row(ctx, W, 120, ['1', '2', '4'], [0, 1, 2]); } },
      { cap: '1~7 都能组合+找零支付：最少只剪 1 节 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['第1天给1；第2天给2找1；第4天给4找1+2…', 14, '#8fa0c8'], ['二进制组合的力量', 16, '#fbbf24', true]], 110, 38); } }
    ] } });

  /* 125 对 5 个物品称重 7 次来排序 */
  D({ g: g, no: 125, title: '对 5 个物品称重 7 次来排序', e: 'weigh', strat: '比较排序·决策树',
    plain: '5 个重量接近的物品，只靠天平比较，7 次称量能把它们完全排序。思路就是排序网络：先两两比，再合并有序段。',
    p: { n: 5, title: '7 次天平比较给 5 件物品排序', steps: [
      { L: [1], R: [2], res: '<', note: '① 1 < 2' },
      { L: [3], R: [4], res: '<', note: '② 3 < 4' },
      { L: [1], R: [3], res: '<', note: '③ 1 < 3 → 1 是前四最小' },
      { L: [2], R: [3], res: '<', note: '④ 2 < 3 → 前四顺序 1<2<3<4' },
      { L: [5], R: [2], res: '>', note: '⑤ 5 > 2：插入位置在 2 之后' },
      { L: [5], R: [3], res: '<', note: '⑥ 5 < 3：夹在 2、3 之间' },
      { L: [5], R: [4], res: '<', note: '⑦ 确认 → 最终 1 < 2 < 5 < 3 < 4 ✓' }
    ] } });

  /* 126 公平切分蛋糕 */
  D({ g: g, no: 126, title: '公平切分蛋糕', e: 'geo', strat: '博弈·协议设计',
    plain: '两个人公平分蛋糕："一人切、一人先选"，切的人自然会把两半切得一样大。三个人呢？移动刀法：刀缓缓划过，谁先喊停谁拿第一块。',
    p: { steps: [
      { cap: '2 人：一人切，另一人先选', fn: function (ctx, W) { cake(ctx, W, [0.5]); } },
      { cap: '切者必然切成两等份（否则自己可能拿小的）', fn: function (ctx, W) { cake(ctx, W, [0.5]); H.txt(ctx, '激励相容：公平是自发行为', W / 2, 40, { size: 13, color: '#fbbf24' }); } },
      { cap: '3 人：移动刀协议 + 递归处理剩余部分 ✓', fn: function (ctx, W) { cake(ctx, W, [1 / 3, 2 / 3]); } }
    ] } });
  function cake(ctx, W, cuts) {
    var x0 = W / 2 - 140, y0 = 100;
    ctx.fillStyle = '#7c5a3a'; H.rr(ctx, x0, y0, 280, 120, 10); ctx.fill();
    ctx.fillStyle = '#f0abfc'; H.rr(ctx, x0, y0, 280, 26, 10); ctx.fill();
    cuts.forEach(function (c) { H.line(ctx, x0 + 280 * c, y0 - 8, x0 + 280 * c, y0 + 128, '#f87171', 2.5); });
  }

  /* 127 骑士之旅 */
  D({ g: g, no: 127, title: '骑士之旅', e: 'knight', strat: '回溯·启发式',
    plain: '标准 8×8 版太难画，这里演示 6×6 骑士之旅：马踏遍 36 格各一次。Warnsdorff 启发"走向最没出路的一格"是实战最好用的策略。',
    p: { n: 6, mode: 'tour', start: [0, 0], cap: '36 格巡游' } });

  /* 128 安全开关 */
  D({ g: g, no: 128, title: '安全开关', e: 'flip', strat: '数学技巧·状态',
    plain: '5 个开关控制保险库，每次必须同时拨动相邻的 2 个，全部拨到"开"才能开门。从最左的错态开始，带着错位一路向右抹平。',
    p: { init: [1, 0, 0, 1, 1], cols: 5, labels: ['1', '2', '3', '4', '5'],
      ops: [
        { at: [], cap: '目标：5 个开关全部朝上' },
        { at: [1, 2], cap: '拨第 2、3 个 → 全部朝上 ✓' }
      ], cap: '相邻成对拨动' } });

  /* 129 Reve 之谜 */
  D({ g: g, no: 129, title: 'Reve 之谜', e: 'hanoi', strat: '分治·四柱',
    plain: '四柱汉诺塔！Frame-Stewart 策略：先用三柱办法把上面几盘挪到辅助柱，腾出柱子搬大盘，最后再把小盘摞回来。4 盘只要 9 步（三柱需 15 步）。',
    p: { n: 4, pegs: 4, moves: [
      { d: 1, f: 0, t: 2 }, { d: 2, f: 0, t: 1 }, { d: 1, f: 2, t: 1 },
      { d: 3, f: 0, t: 2 }, { d: 4, f: 0, t: 3 }, { d: 3, f: 2, t: 3 },
      { d: 1, f: 1, t: 2 }, { d: 2, f: 1, t: 3 }, { d: 1, f: 2, t: 3 }
    ], cap: 'Frame-Stewart：4 盘 9 步' } });

  /* 130 毒酒 */
  D({ g: g, no: 130, title: '毒酒', e: 'board', strat: '二进制编码',
    plain: '1000 桶酒里 1 桶有毒，10 个试毒员、一夜出结果。给每桶编上二进制号，试毒员各负责一个二进制位，死掉的试毒员组合起来就是毒酒编号。',
    p: { steps: [
      { cap: '10 人 = 10 个二进制位 → 可区分 2^10 = 1024 桶', fn: function (ctx, W) { U.lines(ctx, W, [['2^10 = 1024 ≥ 1000', 18, '#5eead4', true]], 130); } },
      { cap: '第 k 位是 1 的酒，让第 k 个试毒员喝一口', fn: function (ctx, W) { U.row(ctx, W, 110, '0001100100'.split(''), [4, 5, 8]); U.lines(ctx, W, [['例：编号 100 的二进制', 13, '#8fa0c8']], 190); } },
      { cap: '一夜后：死掉的人对应的位为 1 → 拼出毒酒编号 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['死者的位组合 = 毒酒编号', 17, '#fbbf24', true]], 130); } }
    ] } });

  /* 131 Tait 筹码谜题 */
  D({ g: g, no: 131, title: 'Tait 筹码谜题', e: 'arrange', strat: '贪心·交换',
    plain: '黑白筹码交替排列，每次交换任意两个筹码的位置，让同色相邻。挑"错位最狠"的一对直接互换，一次到位。',
    p: { init: ['黑', '白', '黑', '白', '黑', '白'], dark: true,
      colorOf: function (v) { return v === '黑' ? '#334155' : '#e2e8f0'; },
      ops: [
        { t: 'swap', i: 0, j: 0, hl: [1, 4], ptr: [[1, '白'], [4, '黑']], cap: '瞄准第 2 位的白与第 5 位的黑' },
        { t: 'swap', i: 1, j: 4, hl: [1, 4], cap: '一次交换 → 黑黑黑白白白 ✓' }
      ] } });

  /* 132 跳棋军队 */
  D({ g: g, no: 132, title: '跳棋军队', e: 'board', strat: '构造·接力',
    plain: '跳棋只能跳过相邻棋子落到空位。想让一枚棋子深入"无人区"第 4 行？需要一支军队接力牺牲：最少 8 枚棋子搭人梯。',
    p: { steps: [
      { cap: '下方是军队，目标：送一枚棋子越过前线 4 格', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', ''], ['', '', ''], ['●', '●', '●'], ['●', '●', '●']], { max: 44, txtColor: function () { return '#fbbf24'; } }); } },
      { cap: '跳跃一次前进 2 格，但消耗 1 枚垫子', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '●', ''], ['', '', ''], ['', '●', '●'], ['●', '', '●']], { max: 44, txtColor: function () { return '#fbbf24'; } }); } },
      { cap: '层层接力 → 尖兵抵达第 4 行 ✓（至少 8 枚）', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '★', ''], ['', '', ''], ['', '', ''], ['', '', '']], { max: 44, txtColor: function () { return '#4ade80'; } }); } }
    ] } });

  /* 133 生命的游戏 */
  function gliderGen(g) {
    var base = [
      [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 1, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    ];
    return base[g];
  }
  D({ g: g, no: 133, title: '生命的游戏', e: 'life', strat: '模拟·细胞自动机',
    plain: '康威生命游戏：周围恰好 3 个邻居就诞生，2 个邻居维持，其它情况死亡。"滑翔机"这个图案会一边保持形状一边斜着飞行。',
    p: { gens: [gliderGen(0), gliderGen(1), gliderGen(2), gliderGen(3), gliderGen(4)], color: '#4ade80', cap: '滑翔机：每 4 代向右下平移 1 格' } });

  /* 134 点着色 */
  D({ g: g, no: 134, title: '点着色', e: 'geo', strat: '鸽笼·Ramsey',
    plain: '平面上任意 6 点，把连线染红蓝两色，必存在一个同色三角形！这就是 Ramsey 定理的最小情形 R(3,3)=6。',
    p: { steps: [
      { cap: '6 个点，两两连线染红或蓝', fn: function (ctx, W, Hh) { ramsey(ctx, W, Hh, 0); } },
      { cap: '任取一点 P：它有 5 条边，鸽笼原理 → 至少 3 条同色（设红色）', fn: function (ctx, W, Hh) { ramsey(ctx, W, Hh, 1); } },
      { cap: '这 3 个端点间若有红边 → 红三角；若全蓝 → 蓝三角。必有同色三角 ✓', fn: function (ctx, W, Hh) { ramsey(ctx, W, Hh, 2); } }
    ] } });
  function ramsey(ctx, W, Hh, mode) {
    var cx = W / 2, cy = Hh / 2 - 6, R = 115, pts = [];
    for (var k = 0; k < 6; k++) { var a = (k * 60 - 90) * Math.PI / 180; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
    if (mode >= 1) { for (var m = 1; m <= 3; m++) H.line(ctx, pts[0][0], pts[0][1], pts[m][0], pts[m][1], '#f87171', 2); }
    if (mode === 2) { H.line(ctx, pts[1][0], pts[1][1], pts[2][0], pts[2][1], '#f87171', 2); }
    pts.forEach(function (p, idx) { H.circle(ctx, p[0], p[1], 9, mode >= 1 && idx === 0 ? '#fbbf24' : '#5eead4'); });
  }

  /* 135 不同的配对 */
  D({ g: g, no: 135, title: '不同的配对', e: 'board', strat: '数学技巧·计数',
    plain: '6 个人两两配对打羽毛球，有多少种不同配法？固定一个人选搭档（5 种），剩下 4 人递归配：5 × 3 × 1 = 15 种。',
    p: { steps: [
      { cap: '6 人两两配对', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E', 'F']); } },
      { cap: 'A 选搭档：5 种；剩 4 人中某人再选：3 种；最后 1 种', fn: function (ctx, W) { U.lines(ctx, W, [['5 × 3 × 1', 20, '#5eead4', true]], 130); } },
      { cap: '共 15 种配法（双阶乘 5!!）✓', fn: function (ctx, W) { U.lines(ctx, W, [['15 种', 24, '#fbbf24', true]], 130); } }
    ] } });

  /* 136 抓捕间谍 */
  D({ g: g, no: 136, title: '抓捕间谍', e: 'board', strat: '奇偶·搜索',
    plain: '间谍藏在 5 个房间之一，每晚必移到相邻房间，侦探每天白天查 1 间。利用奇偶性：查 2、3、4，再查 2、3、4，两种起始奇偶性一网打尽。',
    p: { steps: [
      { cap: '5 个房间排成一排，间谍每晚移动 ±1', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5]); } },
      { cap: '间谍的房间号奇偶性每晚翻转', fn: function (ctx, W) { U.lines(ctx, W, [['奇 → 偶 → 奇 → 偶 …', 18, '#fbbf24', true]], 130); } },
      { cap: '依次查 2→3→4→2→3→4：两种奇偶起点都被逮住 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5], [1, 2, 3]); } }
    ] } });

  /* 137 跳跃成对 II */
  D({ g: g, no: 137, title: '跳跃成对 II', e: 'board', strat: '构造·推广',
    plain: '跳跃成对的加强版：10 枚硬币要组成 5 对，每次跳过 2 枚。思路同 I：从目标倒推跳法，中央先成对、向两端扩展。',
    p: { steps: [
      { cap: '10 枚硬币：○○○○○○○○○○', fn: function (ctx, W) { U.row(ctx, W, 120, ['○', '○', '○', '○', '○', '○', '○', '○', '○', '○']); } },
      { cap: '每次跳 2 枚落位成对，共需 5 次跳跃', fn: function (ctx, W) { U.row(ctx, W, 120, ['○', '○', '◎', '○', '○', '◎', '○', '○', '○', '○'], [2, 5]); } },
      { cap: '5 步后：5 对叠币完成 ✓（倒推法编排跳序）', fn: function (ctx, W) { U.row(ctx, W, 120, ['◎', '◎', '◎', '◎', '◎'], [0, 1, 2, 3, 4]); } }
    ] } });

  /* 138 糖果分享 */
  D({ g: g, no: 138, title: '糖果分享', e: 'board', strat: '迭代改进·收敛',
    plain: '几个孩子围坐，每轮每人把一半糖果给右边的人，奇数颗的老师补一颗。不管初始多不均匀，几轮之后人人糖果一样多，迭代平均必然收敛。',
    p: { steps: [
      { cap: '初始：2、10、2、6 颗', fn: function (ctx, W) { U.row(ctx, W, 120, [2, 10, 2, 6]); } },
      { cap: '一轮：各给一半给右边（奇数补 1）→ 4、6、6、4', fn: function (ctx, W) { U.row(ctx, W, 120, [4, 6, 6, 4]); } },
      { cap: '再一轮 → 5、5、5、5：完全平均 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, [5, 5, 5, 5], [0, 1, 2, 3]); } }
    ] } });

  /* 139 亚瑟国王的圆桌 */
  D({ g: g, no: 139, title: '亚瑟国王的圆桌', e: 'board', strat: '数学技巧·约瑟夫',
    plain: '亚瑟王用"数到某数就出局"的游戏决定骑士座次，本质是约瑟夫问题。想坐上加冕位，得先算出安全位置。',
    p: { steps: [
      { cap: '圆桌 12 个座位，从某位开始报数', fn: function (ctx, W) { U.people(ctx, W, 130, ['1', '2', '3', '4', '5', '6']); U.people(ctx, W, 200, ['7', '8', '9', '10', '11', '12']); } },
      { cap: '数到 5 出局，座位逐个关闭', fn: function (ctx, W) { U.people(ctx, W, 130, ['1', '2', '3', '4', '5', '6'], [{}, {}, {}, {}, { out: 1 }, {}]); U.people(ctx, W, 200, ['7', '8', '9', '10', '11', '12']); } },
      { cap: '最后留下的位置就是"荣耀座" → 提前算好再就座 ✓', fn: function (ctx, W) { U.people(ctx, W, 150, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], [{ out: 1 }, { out: 1 }, { out: 1 }, {}, { out: 1 }, { out: 1 }, { out: 1 }, { out: 1 }, { out: 1 }, { out: 1 }, { out: 1 }, { out: 1 }]); } }
    ] } });

  /* 140 重温 n 皇后问题 */
  D({ g: g, no: 140, title: '重温 n 皇后问题', e: 'queens', strat: '回溯·剪枝',
    plain: '再见 n 皇后：这回体会"剪枝"的威力，一发现冲突立即回退，不再往深处浪费。8 皇后共有 92 个解，回溯只探索了极小一部分节点。',
    p: { n: 8, cap: '冲突即回退：剪枝省下海量搜索' } });

  /* 141 约瑟夫问题 */
  D({ g: g, no: 141, title: '约瑟夫问题', e: 'arrange', strat: '模拟·递推',
    plain: '10 人围圈，从 1 报数，数到 3 出局，最后一个安全位是几号？一步步模拟出局过程，最后剩下 4 号。递推公式还能 O(n) 直接算。',
    p: { init: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      colorOf: function () { return '#3b55a6'; },
      ops: [
        { t: 'del', i: 2, hl: [2], cap: '3 号出局' }, { t: 'del', i: 4, hl: [4], cap: '6 号出局' },
        { t: 'del', i: 6, hl: [6], cap: '9 号出局' }, { t: 'del', i: 1, hl: [1], cap: '2 号出局' },
        { t: 'del', i: 3, hl: [3], cap: '7 号出局' }, { t: 'del', i: 0, hl: [0], cap: '1 号出局' },
        { t: 'del', i: 2, hl: [2], cap: '8 号出局' }, { t: 'del', i: 1, hl: [1], cap: '5 号出局' },
        { t: 'del', i: 1, hl: [1], cap: '10 号出局 → 幸存者 4 号 ✓' }
      ], cap: 'n=10, k=3' } });

  /* 142 12 枚硬币 */
  D({ g: g, no: 142, title: '12 枚硬币', e: 'weigh', strat: '减治·三分·决策树',
    plain: '12 枚硬币中 1 枚假币，不知轻重，3 次天平称量找出它并判断轻重。每次称 4 vs 4，把 24 种可能（12 枚 × 轻/重）三分再三分。',
    p: { n: 12, title: '12 枚中找假币（不知轻重），3 次', steps: [
      { L: [1, 2, 3, 4], R: [5, 6, 7, 8], res: '<', note: '① 1~4 vs 5~8 → 左轻：假币在 1~4(偏轻) 或 5~8(偏重)' },
      { L: [1, 2, 7], R: [3, 4, 5], res: '>', note: '② 1,2,7 vs 3,4,5 → 左重：只有"7 偏重"能解释' },
      { L: [7], R: [9], res: '>', note: '③ 7 vs 真币 9 → 确认 7 号是假币且偏重 ✓' }
    ] } });

  /* 143 被感染的棋盘 */
  D({ g: g, no: 143, title: '被感染的棋盘', e: 'life', strat: '不变量·周长',
    plain: '感染规则：一格若有至少 2 个被感染的正交邻居就会被传染。斜对角的两个感染源只会扩成 2×2 方块就停，感染区的周长是不变量！',
    p: { gens: [
      [[0, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
      [[0, 0, 0, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
    ], color: '#f87171', cap: '感染停止：周长不增的不变量' } });

  /* 144 拆除方格 */
  D({ g: g, no: 144, title: '拆除方格', e: 'board', strat: '奇偶/不变量',
    plain: '从 8×8 棋盘拆掉哪 2 格，剩下的恰好能被多米诺铺满？一黑一白就行！染色条件既必要又足够（对矩形挖角情形）。',
    p: { steps: [
      { cap: '拆 2 格后要用 31 张多米诺铺满', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', '']], { checker: true, max: 36 }); } },
      { cap: '拆同色两格 → 黑白不等 → 必失败', fn: function (ctx, W) { U.lines(ctx, W, [['拆两黑：剩 30 黑 32 白 ✗', 16, '#f87171', true]], 130); } },
      { cap: '拆一黑一白 → 31 黑 31 白 → 可以铺满 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['一黑一白：必要条件也是充分的', 16, '#4ade80', true]], 130); } }
    ] } });

  /* 145 十五谜题 */
  D({ g: g, no: 145, title: '十五谜题', e: 'gridmove', strat: '穷举·可解性',
    plain: '4×4 滑块拼图。不是所有打乱都能复原，"逆序数 + 空格行号"的奇偶性是不变量。这里演示一段合法的 5 步还原。',
    p: { rows: 4, cols: 4, baseMs: 700,
      pieces: [
        { id: 1, label: '1', color: '#5eead4', r: 0, c: 0 }, { id: 2, label: '2', color: '#818cf8', r: 0, c: 2 },
        { id: 3, label: '3', color: '#fbbf24', r: 1, c: 2 }, { id: 4, label: '4', color: '#f87171', r: 0, c: 3 },
        { id: 5, label: '5', color: '#4ade80', r: 1, c: 0 }, { id: 6, label: '6', color: '#f0abfc', r: 1, c: 1 },
        { id: 7, label: '7', color: '#7dd3fc', r: 2, c: 2 }, { id: 8, label: '8', color: '#fdba74', r: 1, c: 3 },
        { id: 9, label: '9', color: '#a3e635', r: 2, c: 0 }, { id: 10, label: '10', color: '#e879f9', r: 2, c: 1 },
        { id: 11, label: '11', color: '#5eead4', r: 3, c: 2 }, { id: 12, label: '12', color: '#818cf8', r: 2, c: 3 },
        { id: 13, label: '13', color: '#fbbf24', r: 3, c: 0 }, { id: 14, label: '14', color: '#f87171', r: 3, c: 1 },
        { id: 15, label: '15', color: '#4ade80', r: 3, c: 3 }
      ],
      moves: [
        { id: 2, r: 0, c: 1, cap: '2 左滑' }, { id: 3, r: 0, c: 2, cap: '3 上滑' },
        { id: 7, r: 1, c: 2, cap: '7 上滑' }, { id: 11, r: 2, c: 2, cap: '11 上滑' },
        { id: 15, r: 3, c: 2, cap: '15 左滑 → 复原 ✓' }
      ], cap: '空格在 (0,1)，5 步复原' } });

  /* 146 击中移动目标 */
  D({ g: g, no: 146, title: '击中移动目标', e: 'board', strat: '奇偶·搜索',
    plain: '目标藏在 5 个洞之一，每晚必搬到相邻洞，你每天只能查一个洞。和抓间谍同款：利用奇偶性，2→3→4 查一轮再查一轮，必中。',
    p: { steps: [
      { cap: '5 个洞，目标每晚移到相邻洞', fn: function (ctx, W) { U.row(ctx, W, 120, ['洞1', '洞2', '洞3', '洞4', '洞5']); } },
      { cap: '假设目标起始在偶数洞：查 2、3、4 必中', fn: function (ctx, W) { U.row(ctx, W, 120, ['洞1', '洞2', '洞3', '洞4', '洞5'], [1, 2, 3]); } },
      { cap: '若起始在奇数洞，等一天后再查 2、3、4 → 必中 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['两轮 2→3→4 覆盖两种奇偶性', 16, '#4ade80', true]], 130); } }
    ] } });

  /* 147 编号的帽子 */
  D({ g: g, no: 147, title: '编号的帽子', e: 'arrange', strat: '图论·循环跟随',
    plain: '4 个盒子乱放着 1~4 号帽子，每人只能开 2 个盒子找自己的帽子。策略：从自己编号的盒子开起，按盒中号码继续开，沿"循环"走，循环长度 ≤ 4 就赢。',
    p: { init: [2, 4, 1, 3],
      colorOf: function () { return '#3b55a6'; },
      ops: [
        { t: 'swap', i: 0, j: 0, hl: [0], cap: '1 号开盒 1：里面是 2 号帽' },
        { t: 'swap', i: 1, j: 1, hl: [1], cap: '再开盒 2：里面是 4 号帽' },
        { t: 'swap', i: 3, j: 3, hl: [3], cap: '再开盒 4：里面是 3 号帽' },
        { t: 'swap', i: 2, j: 2, hl: [2], cap: '再开盒 3：找到自己的 1 号帽 ✓（2 次开盒限额内）' }
      ], cap: '沿置换循环走' } });

  /* 148 自由硬币 */
  D({ g: g, no: 148, title: '自由硬币', e: 'flip', strat: '不变量·线性',
    plain: '3×3 硬币全正面朝上。每次翻一枚会连带翻转它整行整列。哪些图案能翻出来？把每次操作看成 0/1 向量相加，可达状态构成一个线性空间。',
    p: { init: [1, 1, 1, 1, 1, 1, 1, 1, 1], cols: 3,
      ops: [
        { at: [], cap: '全正面；翻一枚 = 翻转其所在行+列（共 5 枚）' },
        { at: [0, 1, 3, 4, 6], cap: '翻左上角那枚 → 十字区域翻转' },
        { at: [2, 5, 6, 7, 8], cap: '再翻右下角 → 得到对称图案' },
        { at: [4, 1, 3, 5, 7], cap: '翻中心 → 回到全正面的补图；组合空间共 2^9 种状态' }
      ], cap: '操作可交换、可叠加' } });

  /* 149 卵石扩张 */
  function diamond(rad) {
    var g = [];
    for (var r = 0; r < 7; r++) { var row = []; for (var c = 0; c < 7; c++) row.push(Math.abs(r - 3) + Math.abs(c - 3) <= rad ? 1 : 0); g.push(row); }
    return g;
  }
  D({ g: g, no: 149, title: '卵石扩张', e: 'life', strat: '迭代·生长',
    plain: '一颗卵石放在网格中央，每一代向所有与它相邻的空格扩张。扩张前沿是菱形，距离（曼哈顿距离）决定到达时间。',
    p: { gens: [diamond(0), diamond(1), diamond(2), diamond(3)], color: '#7dd3fc', cap: '菱形扩张：曼哈顿距离波' } });

  /* 150 保加利亚接龙 */
  D({ g: g, no: 150, title: '保加利亚接龙', e: 'board', strat: '迭代改进·不动点',
    plain: '6 张牌分成若干堆，每轮从每堆各抽 1 张组成新堆。不管怎么开局，最终都会停在 1、2、3 的不动点上，三角形数 6 = 1+2+3 是它的归宿。',
    p: { steps: [
      { cap: '初始：1 堆 6 张', fn: function (ctx, W) { piles(ctx, W, [6]); } },
      { cap: '每堆抽 1 张组新堆：6 → 1+5', fn: function (ctx, W) { piles(ctx, W, [1, 5]); } },
      { cap: '1+5 → 2+4（1 张的堆消失，抽出的 2 张成新堆）', fn: function (ctx, W) { piles(ctx, W, [2, 4]); } },
      { cap: '2+4 → 1+2+3 → 不动点 ✓（6 = 1+2+3 是三角形数）', fn: function (ctx, W) { piles(ctx, W, [1, 2, 3]); H.txt(ctx, '不动点：1 + 2 + 3', W / 2, 60, { size: 16, bold: true, color: '#4ade80' }); } }
    ] } });
})();
