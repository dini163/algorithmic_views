/* 谜题区 101-150（全覆盖） */
(function () {
  var H = PZ.H, U = PZ.U, D = PZ.def, g = 'c';

  /* 101 房间喷漆 */
  D({ g: g, no: 101, title: '房间喷漆', e: 'board', strat: '图论·着色',
    plain: '相邻房间不能喷同色：把房间当点、相邻关系当边就是图着色。贪心选"邻居没用过的最小编号"颜色，这间户型 3 色足够。',
    p: { steps: [
      { cap: '5 个房间，相邻的不能喷同色 → 最少用几种颜色？', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E']); U.lines(ctx, W, [['每个房间一种颜色，相邻必须不同', 13, '#8fa0c8']], 220); } },
      { cap: '建模：房间当顶点、相邻关系当边 → 每条边两端颜色不同', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D', 'E']); U.lines(ctx, W, [['图着色：顶点 = 房间，边 = 相邻关系', 14, '#5eead4', true]], 210); } },
      { cap: '贪心着色：按顺序挑"邻居没用过的最小编号"颜色', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E'], [{ color: '#f87171' }, { color: '#7dd3fc' }]); U.lines(ctx, W, [['A 用红；B 与 A 相邻 → 用蓝', 13, '#fbbf24', true]], 220); } },
      { cap: '逐个推进：C 绿、D 红、E 蓝——总挑编号最小的合法色', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E'], [{ color: '#f87171' }, { color: '#7dd3fc' }, { color: '#4ade80' }, { color: '#f87171' }, { color: '#7dd3fc' }]); } },
      { cap: '3 色完成，相邻全不同色 ✓', fn: function (ctx, W) { U.people(ctx, W, 130, ['A', 'B', 'C', 'D', 'E'], [{ color: '#f87171' }, { color: '#7dd3fc' }, { color: '#4ade80' }, { color: '#f87171' }, { color: '#7dd3fc' }]); U.lines(ctx, W, [['答案：3 种颜色足够 ✓', 16, '#4ade80', true]], 220); } }
    ] } });

  /* 102 猴子和椰子 */
  D({ g: g, no: 102, title: '猴子和椰子', e: 'board', strat: '倒推·同余',
    plain: '5 个水手夜里轮流分椰子：每次恰多 1 个给猴子、藏走 1/5，早上剩余仍能 5 等分。从最后倒推、用同余逐步还原，最小初值 = 3121。',
    p: { steps: [
      { cap: '夜里规则：分 5 份恰多 1 个给猴子，藏走其中 1 份', fn: function (ctx, W) { piles(ctx, W, [16]); U.lines(ctx, W, [['例：16 = 5×3 + 1 → 藏 3 个，剩 12 个', 14, '#5eead4', true]], 90); } },
      { cap: '5 个水手各来一轮，早上剩下的还要能 5 等分', fn: function (ctx, W) { piles(ctx, W, [12]); U.lines(ctx, W, [['每轮数量都形如 5k + 1，藏走后剩 4k', 14, '#5eead4', true]], 90); } },
      { cap: '正推太盲目 → 倒推：设最后剩 5k 个，上一轮 = 本轮 × 5/4 + 1', fn: function (ctx, W) { piles(ctx, W, [12]); U.lines(ctx, W, [['倒推公式：上轮 = 本轮 × 5/4 + 1', 15, '#fbbf24', true]], 90); } },
      { cap: '逐轮还原，每步必须是整数 → 搜索最小的 k', fn: function (ctx, W) { piles(ctx, W, [1020]); U.lines(ctx, W, [['1020 → 1276 → 1596 → 1996 → 2496，一路还原', 13, '#8fa0c8']], 90); } },
      { cap: '最小初值 3121 个椰子 ✓', fn: function (ctx, W) { piles(ctx, W, [3121]); U.lines(ctx, W, [['3121 → 2496 → 1996 → 1596 → 1276 → 1020 ✓', 13, '#4ade80', true]], 90); } }
    ] } });

  /* 103 跳到另一边 */
  D({ g: g, no: 103, title: '跳到另一边', e: 'board', strat: '不变量·染色',
    plain: '把斜线上方的 15 个棋子全跳到下方？黑白染色后跳跃不改变所在格颜色：上方占 9 黑 6 白，下方却只有 6 个黑格——不可能。',
    p: { steps: [
      { cap: '5×6 棋盘：斜线上方 15 个棋子，要全部跳到斜线下方', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 5; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(r + c < 5 ? '●' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true, max: 40, txtColor: function () { return '#5eead4'; } }); U.lines(ctx, W, [['跳法：越过相邻棋子落到空位（横/竖/斜）', 13, '#8fa0c8']], 300); } },
      { cap: '反复跳就能挪过去吗？——先给棋盘做国际象棋式黑白染色', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 5; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true, max: 40 }); U.lines(ctx, W, [['把每个格子染成黑或白', 14, '#f87171', true]], 300); } },
      { cap: '不变量：棋子跳跃不改变所在格的颜色（垂直/水平/对角跳跃都保持同色）', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 5; r++) { var row = []; for (var c = 0; c < 6; c++) row.push('●'); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 40, txtColor: function (r, c) { return (r + c) % 2 ? '#fbbf24' : '#7dd3fc'; } });
        H.line(ctx, gg.x0 + 0.5 * gg.cell, gg.y0 + 0.5 * gg.cell, gg.x0 + 2.5 * gg.cell, gg.y0 + 2.5 * gg.cell, '#f87171', 2);
        H.txt(ctx, '对角跳 2 格：落点颜色不变', W / 2, gg.y0 + 5 * gg.cell + 16, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '数一数：上方 15 个棋子占 9 黑 6 白 → 9 个棋子永远停在黑格', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 5; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(r + c < 5 ? '●' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, max: 40, txtColor: function (r, c) { return (r + c) % 2 ? '#fbbf24' : '#7dd3fc'; } });
        H.txt(ctx, '上方 15 格：9 黑 + 6 白', W / 2, 320, { size: 14, bold: true, color: '#fbbf24' }); } },
      { cap: '斜线下方只有 6 个黑格 → 装不下 9 个黑格棋子 → 不可能 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 5; r++) { var row = []; for (var c = 0; c < 6; c++) row.push('●'); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 40, txtColor: function (r, c) { return (r + c) % 2 ? '#fbbf24' : '#7dd3fc'; }, cellColor: function (rr2, cc) { return rr2 + cc >= 5 ? '#1e3a34' : null; } });
        H.txt(ctx, '9 黑棋需 9 黑目标格，只有 6 个 → 不可能 ✓', W / 2, gg.y0 + 5 * gg.cell + 16, { size: 13, bold: true, color: '#f87171' }); } }
    ] } });
  /* 104 堆分割 */
  D({ g: g, no: 104, title: '堆分割', e: 'board', strat: '数学技巧·不变量',
    plain: 'n 个筹码逐次一分为二，每次记下两堆乘积再求和：总和与分法无关，恒等于 (n−1)n/2；(b) 改为求和时每次只分出 1 个。',
    p: { steps: [
      { cap: 'n = 4：把一堆分成两堆，记下两堆数量的乘积', fn: function (ctx, W) { piles(ctx, W, [1, 3]); U.lines(ctx, W, [['第一次分：1 × 3 = 3', 14, '#5eead4', true]], 90); } },
      { cap: '继续分到只剩单枚堆，把所有乘积相加：3 + 2 + 1 = 6', fn: function (ctx, W) { piles(ctx, W, [1, 1, 1, 1]); U.lines(ctx, W, [['1×3 + 1×2 + 1×1 = 6', 14, '#5eead4', true]], 90); } },
      { cap: '换个分法：先 2+2 → 2×2 + 1×1 + 1×1 = 6，总和不变！', fn: function (ctx, W) { piles(ctx, W, [2, 2]); U.lines(ctx, W, [['换种分法照样得 6 → 疑似不变量', 14, '#fbbf24', true]], 90); } },
      { cap: '归纳证明：P(n) = a·b + P(a) + P(b) = (n−1)n/2，与分法无关', fn: function (ctx, W) { piles(ctx, W, [2, 2]); U.lines(ctx, W, [['P(n) = ab + P(a) + P(b) = (n−1)n/2', 15, '#fbbf24', true]], 90); } },
      { cap: '答案：(a) 乘积和恒为 (n−1)n/2；(b) 求和版每次只分出 1 个 ✓', fn: function (ctx, W) { piles(ctx, W, [1, 1, 1, 1]); U.lines(ctx, W, [['答案：(n−1)n/2 = 6 ✓；(b) 每次只分 1 个', 13, '#4ade80', true]], 90); } }
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
  D({ g: g, no: 106, title: '开灯', e: 'board', strat: '递归·格雷码',
    plain: 'n 个开关全闭合灯才亮，开关状态看不见、只能盲按。最坏情况需按 2ⁿ−1 次：格雷码递归遍历全部 2ⁿ 种组合。',
    p: { steps: [
      { cap: 'n 个开关全闭合灯才亮；看不见状态，只能盲按', fn: function (ctx, W) { U.lamps(ctx, W, 130, '0000', -1); U.lines(ctx, W, [['目标：全 1 状态，但不知道当前在哪', 13, '#8fa0c8']], 230); } },
      { cap: '最笨做法：2ⁿ 种组合逐个试 → 最坏按到最后一个', fn: function (ctx, W) { U.lamps(ctx, W, 110, '0101', 1); U.lines(ctx, W, [['组合共 2ⁿ 个，盲按无法跳过', 14, '#f87171', true]], 230); } },
      { cap: '关键：递归按法——先按前 n−1 个，再按第 n 个，再按前 n−1 个', fn: function (ctx, W) { U.lamps(ctx, W, 110, '0111', 2); U.lines(ctx, W, [['W(n) = 2W(n−1) + 1：每层递归恰好遍历一遍', 14, '#fbbf24', true]], 230); } },
      { cap: '计数：W(1)=1 → W(2)=3 → W(3)=7 → W(4)=15（格雷码序）', fn: function (ctx, W) { U.lamps(ctx, W, 110, '0111', 3); U.lines(ctx, W, [['每加一个开关，最坏次数翻倍加 1', 13, '#8fa0c8']], 230); } },
      { cap: '答案：最坏情况需按 2ⁿ − 1 次 ✓', fn: function (ctx, W) { U.lamps(ctx, W, 110, '1111'); U.lines(ctx, W, [['答案：2ⁿ − 1 次，灯亮 ✓', 16, '#4ade80', true]], 230); } }
    ] } });
  /* 107 狐狸和野兔 */
  D({ g: g, no: 107, title: '狐狸和野兔', e: 'board', strat: '不变量·奇偶',
    plain: '30 格直线追逐：狐狸每步走 1 格、野兔每步跳 3 格，两者间距的奇偶性永远不变。s 为奇数抓不到、偶数能逼入角落。',
    p: { steps: [
      { cap: '30 格直线：狐狸从 1 号起步，野兔从 s 号（s>1）起跑', fn: function (ctx, W) { U.axis(ctx, W, 160, 1, 30, [1, 6, 11, 16, 21, 26, 30], [{ v: 1, label: '狐', color: '#f87171' }, { v: 6, label: '兔', color: '#fbbf24' }]); U.lines(ctx, W, [['狐狸走 1 格；野兔跳 3 格，不能落在狐狸处', 13, '#8fa0c8']], 240); } },
      { cap: '相邻即狐狸赢 → 能否让间距变成 1？', fn: function (ctx, W) { U.axis(ctx, W, 160, 1, 30, [1, 6, 11, 16, 21, 26, 30], [{ v: 3, label: '狐', color: '#f87171' }, { v: 4, label: '兔', color: '#fbbf24' }]); U.lines(ctx, W, [['间距 = 1 时狐狸获胜', 14, '#5eead4', true]], 240); } },
      { cap: '不变量：间距变化恒为 ±1±3 → 奇偶性永远保持', fn: function (ctx, W) { U.axis(ctx, W, 160, 1, 30, [1, 6, 11, 16, 21, 26, 30], [{ v: 1, label: '狐', color: '#f87171' }, { v: 6, label: '兔', color: '#fbbf24' }]); U.lines(ctx, W, [['差的变化 = ±1±3 → 恒为偶数，奇偶守恒', 13, '#fbbf24', true]], 240); } },
      { cap: 's 为奇数：间距恒为偶数，永远到不了 1 → 狐狸抓不到', fn: function (ctx, W) { U.axis(ctx, W, 160, 1, 30, [1, 5, 11, 16, 21, 26, 30], [{ v: 2, label: '狐', color: '#f87171' }, { v: 5, label: '兔', color: '#fbbf24' }]); U.lines(ctx, W, [['s 奇：差恒为偶数 → 永不相邻，抓不到', 13, '#f87171', true]], 240); } },
      { cap: 's 为偶数：狐狸向右逼近，能把野兔逼到角落 → 答案 ✓', fn: function (ctx, W) { U.axis(ctx, W, 160, 1, 30, [1, 6, 11, 16, 21, 26, 30], [{ v: 29, label: '狐', color: '#f87171' }, { v: 30, label: '兔', color: '#fbbf24' }]); U.lines(ctx, W, [['答案：s 为偶数时狐狸能赢 ✓', 14, '#4ade80', true]], 240); } }
    ] } });
  /* 108 最长路径 */
  D({ g: g, no: 108, title: '最长路径', e: 'board', strat: '数学技巧·计数',
    plain: '一排 n 个等距柱子全部走一遍，最坏的路线：1 → n → 2 → n−1 来回大跨度，总距离 = (n−1)n/2。',
    p: { steps: [
      { cap: 'n 个等距柱子（间距 1），需经过全部柱子', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 8, [1, 2, 3, 4, 5, 6, 7]); U.lines(ctx, W, [['起点、终点随意，只要每个柱子都到', 13, '#8fa0c8']], 220); } },
      { cap: '最省路线：1 → 2 → … → n 顺次走，总距离 = n−1', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 8, [1, 2, 3, 4, 5, 6, 7]); H.line(ctx, 70, 128, 570, 128, '#5eead4', 2); U.lines(ctx, W, [['最短 = n−1；那最长能绕多远？', 14, '#5eead4', true]], 220); } },
      { cap: '最坏路线：每次跳到最远的未访问柱子 → 1 → n → 2 → n−1 …', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 8, [1, 2, 3, 4, 5, 6, 7]); H.line(ctx, 70, 120, 570, 90, '#fbbf24', 2); H.line(ctx, 570, 90, 141, 120, '#fbbf24', 2); H.line(ctx, 141, 120, 500, 90, '#fbbf24', 2); U.lines(ctx, W, [['1 → 7 → 2 → 6 → … 来回大跨度', 14, '#fbbf24', true]], 220); } },
      { cap: '各段距离恰好用遍 (n−1)、(n−2)、…、1 各一次', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 8, [1, 2, 3, 4, 5, 6, 7]); U.lines(ctx, W, [['n=7：6 + 5 + 4 + 3 + 2 + 1', 15, '#8fa0c8']], 230); } },
      { cap: '答案：最长距离 = (n−1)n/2 ✓', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 8, [1, 2, 3, 4, 5, 6, 7]); U.lines(ctx, W, [['答案：最长距离 = (n−1)n/2 ✓', 17, '#4ade80', true]], 230); } }
    ] } });
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
    plain: '两只异色变色龙相遇就同时变成第三种颜色。棕 10、灰 14、黑 15：任意两色数量之差 mod 3 是不变量，全同色状态到不了。',
    p: { steps: [
      { cap: '岛上三色：棕 10、灰 14、黑 15', fn: function (ctx, W) { U.row(ctx, W, 110, ['棕10', '灰14', '黑15'], null, function (v) { return v[0] === '棕' ? '#fdba74' : v[0] === '灰' ? '#94a3b8' : '#39437a'; }); U.lines(ctx, W, [['能否让 39 只全部变成同一颜色？', 14, '#5eead4', true]], 200); } },
      { cap: '规则：两异色相遇 → 两只都变成第三色（各 −1，第三色 +2）', fn: function (ctx, W) { U.row(ctx, W, 90, ['棕10', '灰14', '黑15'], null, function (v) { return v[0] === '棕' ? '#fdba74' : v[0] === '灰' ? '#94a3b8' : '#39437a'; }); U.row(ctx, W, 160, ['棕9', '灰13', '黑17'], [2], function (v) { return v[0] === '棕' ? '#fdba74' : v[0] === '灰' ? '#94a3b8' : '#39437a'; }); U.lines(ctx, W, [['棕灰相遇 → (10,14,15) → (9,13,17)', 13, '#5eead4', true]], 240); } },
      { cap: '不变量：任意两色之差 mod 3 保持不变（变化只有 −1、+2 或 −1、−1）', fn: function (ctx, W) { U.row(ctx, W, 110, ['棕9', '灰13', '黑17'], null, function (v) { return v[0] === '棕' ? '#fdba74' : v[0] === '灰' ? '#94a3b8' : '#39437a'; }); U.lines(ctx, W, [['灰−棕：14−10=4 ≡ 13−9=4 (mod 3)，永远不变', 13, '#fbbf24', true]], 200); } },
      { cap: '全同色要求另外两色都为 0 → 两色之差 ≡ 0 (mod 3)', fn: function (ctx, W) { U.row(ctx, W, 110, ['棕?', '灰0', '黑?'], [0, 2], function (v) { return v[0] === '棕' ? '#fdba74' : v[0] === '灰' ? '#94a3b8' : '#39437a'; }); U.lines(ctx, W, [['目标状态的任意两色差都是 0', 13, '#8fa0c8']], 200); } },
      { cap: '初始差 4 ≢ 0 (mod 3) → 目标状态永远到不了 → 不可能 ✓', fn: function (ctx, W) { U.row(ctx, W, 110, ['棕10', '灰14', '黑15'], null, function (v) { return v[0] === '棕' ? '#fdba74' : v[0] === '灰' ? '#94a3b8' : '#39437a'; }); U.lines(ctx, W, [['答案：不可能全同色（模 3 不变量）✓', 14, '#4ade80', true]], 200); } }
    ] } });

  /* 111 反转硬币三角形阵 */
  D({ g: g, no: 111, title: '反转硬币三角形阵', e: 'board', strat: '几何·移动',
    plain: '15 枚硬币摆成 5 层三角形，只移 3 枚让三角形上下颠倒：搬走顶点与底层两端的 3 枚，放到对面补齐倒三角。',
    p: { steps: [
      { cap: '5 层硬币三角，尖端朝上', fn: function (ctx, W) { triCoins(ctx, W, 5, false, []); } },
      { cap: '目标：只移动 3 枚，让三角形上下颠倒', fn: function (ctx, W) { triCoins(ctx, W, 5, false, []); U.lines(ctx, W, [['倒转后尖端应朝下：谁去补角？', 14, '#fbbf24', true]], 290); } },
      { cap: '观察：顶点要变成底角，底层两端要变成新顶角的左右翼', fn: function (ctx, W) { triCoins(ctx, W, 5, false, [[0, 0], [4, 0], [4, 4]]); U.lines(ctx, W, [['只有这 3 枚需要动', 13, '#8fa0c8']], 290); } },
      { cap: '标记：顶点 1 枚 + 底边两端 2 枚', fn: function (ctx, W) { triCoins(ctx, W, 5, false, [[0, 0], [4, 0], [4, 4]]); } },
      { cap: '移到对面 → 三角形倒转 ✓', fn: function (ctx, W) { triCoins(ctx, W, 5, true, []); U.lines(ctx, W, [['答案：3 枚足够 ✓', 16, '#4ade80', true]], 290); } }
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
  D({ g: g, no: 113, title: '拿走硬币', e: 'board', strat: '不变量·奇偶',
    plain: '拿走全部硬币：每次只能拿正面币，拿后其原序相邻币全部翻转。正面数的奇偶决定一切：初始正面为奇数才有解。',
    p: { steps: [
      { cap: '一排硬币正反面混杂，目标：全部拿走', fn: function (ctx, W) { U.row(ctx, W, 110, ['正', '正', '反', '反', '正'], null, function (v) { return v === '正' ? '#1e3a34' : '#7f3030'; }); U.lines(ctx, W, [['正面 = 绿，反面 = 红', 13, '#8fa0c8']], 200); } },
      { cap: '规则：只能拿正面币；拿后原序相邻的币全部翻面', fn: function (ctx, W) { U.row(ctx, W, 110, ['正', '正', '反', '反', '正']); U.lines(ctx, W, [['拿掉中间的正 → 两侧翻面', 14, '#fbbf24', true]], 200); } },
      { cap: '计账：拿 1 正、翻 2 邻 → 每步正面数的变化恒为奇数', fn: function (ctx, W) { U.row(ctx, W, 110, ['正', '', '反', '反', '正'], [2, 3], function (v) { return v === '正' ? '#1e3a34' : v === '反' ? '#7f3030' : null; }); U.lines(ctx, W, [['每步变化 ∈ {−3, −1, +1}：奇偶性成为判据', 13, '#fbbf24', true]], 200); } },
      { cap: '最后一枚必须拿正面 → 初始正面数的奇偶决定成败', fn: function (ctx, W) { U.row(ctx, W, 110, ['正'], [0], function () { return '#1e3a34'; }); U.lines(ctx, W, [['收尾那一步只能拿正面币', 13, '#8fa0c8']], 200); } },
      { cap: '答案：初始正面数为奇数时有解 ✓', fn: function (ctx, W) { U.row(ctx, W, 110, ['正'], [0], function () { return '#1e3a34'; }); U.lines(ctx, W, [['答案：初始正面数为奇数时有解 ✓', 15, '#4ade80', true]], 200); } }
    ] } });
  /* 114 划线过点 */
  D({ g: g, no: 114, title: '划线过点', e: 'board', strat: '构造·跳出框架',
    plain: 'n×n 点阵一笔画过所有点：n=3 就是经典九点四线，诀窍是把线延伸到点阵外再折回；一般 n 需要 2n−2 条线。',
    p: { steps: [
      { cap: 'n=3：9 个点，一笔 4 条（2n−2）直线全部穿过', fn: function (ctx, W) { var r, c; for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) H.circle(ctx, W / 2 + (c - 1) * 50, 150 + (r - 1) * 50, 7, '#dfe6f8'); U.lines(ctx, W, [['不许抬笔，也不许重画任何一段', 13, '#8fa0c8']], 300); } },
      { cap: '直觉陷阱：只在点阵内部折返 → 4 条永远做不到', fn: function (ctx, W) { var r, c; for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) H.circle(ctx, W / 2 + (c - 1) * 50, 150 + (r - 1) * 50, 7, '#dfe6f8'); U.lines(ctx, W, [['困在框内 → 无解：必须跳出来', 14, '#f87171', true]], 300); } },
      { cap: '突破：把线延伸到点阵之外再折回', fn: function (ctx, W, Hh) { for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) H.circle(ctx, W / 2 + (c - 1) * 50, 150 + (r - 1) * 50, 7, '#dfe6f8'); H.line(ctx, W / 2 - 50, 100, W / 2 - 50, 250, '#f87171', 2); H.line(ctx, W / 2 - 50, 250, W / 2 + 100, 100, '#fbbf24', 2); H.line(ctx, W / 2 + 100, 100, W / 2 - 100, 100, '#4ade80', 2); H.line(ctx, W / 2 - 100, 100, W / 2 + 50, 250, '#7dd3fc', 2); } },
      { cap: '一般 n：2n−2 条线，水平线扫每行、垂直线错位连接', fn: function (ctx, W) {
        var r, c, cx = W / 2, d = 45, y0 = 130;
        var px = function (cc) { return cx + (cc - 1) * d; }, py = function (rr) { return y0 + (rr - 1) * d; };
        for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) H.circle(ctx, px(c), py(r), 7, '#dfe6f8');
        H.line(ctx, px(0), py(0), px(0), py(3), '#f87171', 2);
        H.line(ctx, px(0), py(3), px(3), py(0), '#fbbf24', 2);
        H.line(ctx, px(3), py(0), px(0), py(0), '#4ade80', 2);
        H.line(ctx, px(0), py(0), px(2), py(2), '#7dd3fc', 2);
        U.lines(ctx, W, [['把线延伸到点阵外再折回', 14, '#fbbf24', true]], 300); } },
      { cap: '答案：一笔 2n−2 条直线穿过 n×n 点阵（跳出方框）✓', fn: function (ctx, W) {
        var r, c, cx = W / 2, d = 45, y0 = 130;
        var px = function (cc) { return cx + (cc - 1) * d; }, py = function (rr) { return y0 + (rr - 1) * d; };
        for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) H.circle(ctx, px(c), py(r), 7, '#dfe6f8');
        H.line(ctx, px(0), py(0), px(0), py(3), '#f87171', 2);
        H.line(ctx, px(0), py(3), px(3), py(0), '#fbbf24', 2);
        H.line(ctx, px(3), py(0), px(0), py(0), '#4ade80', 2);
        H.line(ctx, px(0), py(0), px(2), py(2), '#7dd3fc', 2);
        U.lines(ctx, W, [['答案：2n−2 条线（n=3 即 4 条）✓', 15, '#4ade80', true]], 300); } }
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
    plain: '37 人打单淘汰赛，第一轮需要几个轮空？补到最近的 2 的幂：64 − 37 = 27，第二轮起就是完美对半 bracket。',
    p: { steps: [
      { cap: '37 名选手，淘汰赛需要 2 的幂个签位', fn: function (ctx, W) {
        var i;
        for (i = 0; i < 64; i++) { var ok = i < 37; ctx.fillStyle = ok ? '#273469' : '#0d1330'; H.rr(ctx, W / 2 - 268 + (i % 16) * 34, 90 + Math.floor(i / 16) * 40, 28, 28, 5); ctx.fill(); if (ok) H.circle(ctx, W / 2 - 268 + (i % 16) * 34 + 14, 104 + Math.floor(i / 16) * 40, 7, '#5eead4'); }
        U.lines(ctx, W, [['37 人（青点）+ 27 个空签位（暗格）', 14, '#5eead4', true]], 290); } },
      { cap: '第二轮起必须对半对决 → 总签位得是 2 的幂', fn: function (ctx, W) { U.lines(ctx, W, [['每轮淘汰一半：签位数 = 2 的幂', 15, '#fbbf24', true], ['37 夹在 32 和 64 之间', 13, '#8fa0c8']], 130, 46); } },
      { cap: '最近的 2 的幂是 64（32 不够装下 37 人）', fn: function (ctx, W) { U.row(ctx, W, 120, [16, 32, 64, 128], [2]); } },
      { cap: '轮空数 = 64 − 37 = 27 ✓', fn: function (ctx, W) {
        var i;
        for (i = 0; i < 64; i++) { var ok = i < 37; ctx.fillStyle = ok ? '#1e3a34' : '#7f3030'; H.rr(ctx, W / 2 - 268 + (i % 16) * 34, 90 + Math.floor(i / 16) * 40, 28, 28, 5); ctx.fill(); }
        U.lines(ctx, W, [['27 人首轮轮空 → 第二轮起恰好对半 ✓', 15, '#fbbf24', true]], 290); } }
    ] } });

    /* 117 一维跳棋 */
  D({ g: g, no: 117, title: '一维跳棋', e: 'board', strat: '不变量·构造',
    plain: '一维孔明跳棋：棋子跳过相邻棋子落空位、被跳者移除，目标只剩一枚。初始空格必须在第 2 或第 5 位（对称位同理）才有解。',
    p: { steps: [
      { cap: 'n 为偶数，除一格外全部放棋子；跳过后被跳棋子移除', fn: function (ctx, W) { U.row(ctx, W, 110, ['●', '', '●', '●', '●', '●']); U.lines(ctx, W, [['目标：最后只剩一枚棋子', 13, '#8fa0c8']], 200); } },
      { cap: '例 n=6，空格在位置 2：棋子可向左/右跳过相邻棋子', fn: function (ctx, W) { U.row(ctx, W, 110, ['●', '', '●', '●', '●', '●'], [1, 2]); U.lines(ctx, W, [['3 号跳过 2 号位落到 1 号 → 2 号棋子移除', 13, '#5eead4', true]], 200); } },
      { cap: '模式观察：任何走法后空位组合受限 → 空格只能在 2 或 5（对称位）', fn: function (ctx, W) { U.row(ctx, W, 90, ['●', '●', '', '', '●'], [2, 3], function (v) { return v === '●' ? '#273469' : null; }); U.row(ctx, W, 160, ['●', '', '', '●', '●'], [1, 2], function (v) { return v === '●' ? '#273469' : null; }); U.lines(ctx, W, [['空格只能在位置 2 或 5（对称）', 15, '#fbbf24', true]], 240); } },
      { cap: '验证：位置 2 开局能一路消到只剩一枚', fn: function (ctx, W) { U.row(ctx, W, 110, ['●', '●', '●', '●', '●', ''], [5], function (v, i2) { return i2 === 5 ? '#4a3a12' : '#273469'; }); U.lines(ctx, W, [['逐步消减：6 → 4 → 2 → 1', 13, '#8fa0c8']], 200); } },
      { cap: '答案：初始空格在 2 或 5（或对称的 n−1、n−4）✓', fn: function (ctx, W) { U.row(ctx, W, 110, ['●', '', '●', '●', '●', '●'], [1], function (v, i2) { return i2 === 1 ? '#1e3a34' : '#273469'; }); U.lines(ctx, W, [['答案：空格在 2 或 5 ✓', 16, '#4ade80', true]], 200); } }
    ] } });
/* 118 六骑士 */
  D({ g: g, no: 118, title: '六骑士', e: 'board', strat: '图论·轮换',
    plain: '3×4 棋盘上黑白各 3 个骑士分居两行，要互换位置。把所有合法跳跃连成 8 步大循环，每位骑士沿循环各走半圈即可。',
    p: { steps: [
      { cap: '3×4 棋盘：3 个白骑士在最下行，3 个黑骑士在最上行', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['♞', '♞', '♞', ''], ['', '', '', ''], ['', '', '', '♞']], { max: 44, txtColor: function (r, c, v) { return r === 0 ? '#475569' : '#e2e8f0'; } }); U.lines(ctx, W, [['目标：黑白两行互换位置', 13, '#8fa0c8']], 300); } },
      { cap: '直接对换会互相卡死 → 换思路：把合法跳跃画成图', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['♞', '♞', '♞', ''], ['', '', '', ''], ['', '', '', '♞']], { max: 44, txtColor: function (r, c, v) { return r === 0 ? '#475569' : '#e2e8f0'; } }); U.lines(ctx, W, [['两骑士可互相跳跃：把可达关系连成边', 13, '#f87171', true]], 300); } },
      { cap: '惊喜：所有可跳格恰好连成一个 8 步大循环', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, [['♞', '♞', '♞', ''], ['', '', '', ''], ['', '', '', '♞']], { max: 44, txtColor: function (r, c, v) { return r === 0 ? '#475569' : '#e2e8f0'; } });
        var pts = [[0, 0], [1, 2], [2, 0], [0, 1], [2, 2], [1, 0], [0, 2], [2, 3]], k2;
        for (k2 = 0; k2 < pts.length; k2++) { var a = pts[k2], b2 = pts[(k2 + 1) % pts.length]; H.line(ctx, gg.x0 + (a[1] + 0.5) * gg.cell, gg.y0 + (a[0] + 0.5) * gg.cell, gg.x0 + (b2[1] + 0.5) * gg.cell, gg.y0 + (b2[0] + 0.5) * gg.cell, '#fbbf24', 1.5); H.circle(ctx, gg.x0 + (a[1] + 0.5) * gg.cell, gg.y0 + (a[0] + 0.5) * gg.cell, 4, '#fbbf24'); }
        U.lines(ctx, W, [['合法跳跃连成 8 步环路', 14, '#fbbf24', true]], 300); } },
      { cap: '每位骑士沿环路前进半圈（4 步）→ 到达对面行', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['♞', '♞', '♞', ''], ['', '', '', ''], ['', '', '', '♞']], { max: 44, txtColor: function (r, c, v) { return r === 0 ? '#475569' : '#e2e8f0'; } }); U.lines(ctx, W, [['沿循环走半圈 = 4 次跳跃', 13, '#8fa0c8']], 300); } },
      { cap: '6 位骑士同时绕环半圈 → 黑白互换 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['♞', '', '', ''], ['', '', '', ''], ['♞', '♞', '♞', '']], { max: 44, txtColor: function (r, c, v) { return r === 0 ? '#e2e8f0' : '#475569'; } }); U.lines(ctx, W, [['答案：沿循环走半圈即完成 ✓', 14, '#4ade80', true]], 300); } }
    ] } });

    /* 119 有色三格板平铺 */
  D({ g: g, no: 119, title: '有色三格板平铺', e: 'board', strat: '分治·染色',
    plain: '2n×2n 缺一格，用三色 L 形三格板铺满且相邻板块不同色：递归四等分，中心放一块让四个子棋盘各缺一角，逐层三色轮换。',
    p: { steps: [
      { cap: '2n×2n 缺一角，用 L 形三格板铺满，相邻板颜色不同', fn: function (ctx, W, Hh) { var b = [], r, c; for (r = 0; r < 4; r++) { var row = []; for (c = 0; c < 4; c++) row.push(r === 0 && c === 0 ? '缺' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { max: 44, cellColor: function (rr2, cc) { return rr2 === 0 && cc === 0 ? '#05070f' : null; }, txtColor: function () { return '#f87171'; } }); U.lines(ctx, W, [['只有三色可用：灰 / 黑 / 白', 13, '#5eead4', true]], 300); } },
      { cap: '关键：四等分后，在中心放一块三格板', fn: function (ctx, W, Hh) { var b = [], r, c; for (r = 0; r < 4; r++) { var row = []; for (c = 0; c < 4; c++) row.push(r === 0 && c === 0 ? '缺' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { max: 44, cellColor: function (rr2, cc) { return rr2 === 0 && cc === 0 ? '#05070f' : (rr2 >= 1 && rr2 <= 2 && cc >= 1 && cc <= 2 && rr2 + cc >= 3 && rr2 + cc <= 4) ? '#39437a' : null; }, txtColor: function () { return '#f87171'; } }); U.lines(ctx, W, [['中心块吃掉 3 个子棋盘的内角', 13, '#fbbf24', true]], 300); } },
      { cap: '四个子棋盘各缺一角 → 变成同样的子问题，递归铺满', fn: function (ctx, W, Hh) { var b = [], r, c, cols = ['#39437a', '#1e3a34', '#3a2a50']; for (r = 0; r < 4; r++) { var row = []; for (c = 0; c < 4; c++) row.push(r === 0 && c === 0 ? '缺' : '■'); b.push(row); } U.grid(ctx, W, Hh, b, { max: 44, cellColor: function (rr2, cc) { return rr2 === 0 && cc === 0 ? '#05070f' : cols[((rr2 + cc) % 3 + 3) % 3]; }, txtColor: function (rr2, cc) { return rr2 === 0 && cc === 0 ? '#f87171' : '#dfe6f8'; } }); U.lines(ctx, W, [['中心块 + 四角子问题递归', 13, '#fbbf24', true]], 300); } },
      { cap: '每层用三色循环染色，保证相邻板不同色', fn: function (ctx, W, Hh) { var b = [], r, c, cols = ['#39437a', '#1e3a34', '#3a2a50']; for (r = 0; r < 4; r++) { var row = []; for (c = 0; c < 4; c++) row.push(r === 0 && c === 0 ? '缺' : '■'); b.push(row); } U.grid(ctx, W, Hh, b, { max: 44, cellColor: function (rr2, cc) { return rr2 === 0 && cc === 0 ? '#05070f' : cols[((rr2 + cc) % 3 + 3) % 3]; }, txtColor: function (rr2, cc) { return rr2 === 0 && cc === 0 ? '#f87171' : '#dfe6f8'; } }); } },
      { cap: '答案：递归三色平铺，相邻骨牌全不同色 ✓', fn: function (ctx, W, Hh) { var b = [], r, c, cols = ['#39437a', '#1e3a34', '#3a2a50']; for (r = 0; r < 4; r++) { var row = []; for (c = 0; c < 4; c++) row.push(r === 0 && c === 0 ? '缺' : '■'); b.push(row); } U.grid(ctx, W, Hh, b, { max: 44, cellColor: function (rr2, cc) { return rr2 === 0 && cc === 0 ? '#05070f' : cols[((rr2 + cc) % 3 + 3) % 3]; }, txtColor: function (rr2, cc) { return rr2 === 0 && cc === 0 ? '#f87171' : '#dfe6f8'; } }); U.lines(ctx, W, [['答案：递归三色平铺 ✓', 14, '#4ade80', true]], 300); } }
    ] } });
  /* 120 硬币分发机 */
  D({ g: g, no: 120, title: '硬币分发机', e: 'board', strat: '数学技巧·二进制',
    plain: '两枚硬币换右边盒子一枚——本质是二进制进位：最终分布就是 n 的二进制展开、与顺序无关；最少盒子数 = 二进制位数。',
    p: { steps: [
      { cap: '规则：某盒 2 枚 → 换右边盒子 1 枚，直到每盒 ≤1 枚', fn: function (ctx, W) { U.row(ctx, W, 110, ['×6', '', '', '', '', ''], [0]); U.lines(ctx, W, [['初始：最左盒 6 枚', 14, '#5eead4', true]], 200); } },
      { cap: '疑虑：处理硬币对的顺序不同，结果会不一样吗？', fn: function (ctx, W) { U.row(ctx, W, 110, ['×6', '', '', '', '', ''], [0]); U.lines(ctx, W, [['先换左边还是右边？试试两种顺序', 14, '#f87171', true]], 200); } },
      { cap: '关键：两换一就是二进制进位 → 最终分布唯一 = n 的二进制展开', fn: function (ctx, W) { U.row(ctx, W, 110, ['×0', '×1', '×1', '', '', ''], [1, 2]); U.lines(ctx, W, [['n = 6 = 110₂ → 盒子：0,1,1 枚，与顺序无关', 14, '#fbbf24', true]], 200); } },
      { cap: '(b) 装下 n 枚需 ⌈log₂n⌉+1 个盒子（二进制位数）', fn: function (ctx, W) { U.row(ctx, W, 110, ['×0', '×1', '×1', '', '', ''], [1, 2]); U.lines(ctx, W, [['6 用 3 个盒子：最高位到 2²', 13, '#8fa0c8']], 200); } },
      { cap: '(c) 总分配次数 = n − b₀（6 = 110₂，b₀=0 → 6 次）✓', fn: function (ctx, W) { U.row(ctx, W, 110, ['×0', '×1', '×1', '', '', '']); U.lines(ctx, W, [['答案：(a) 无关 (b) ⌈log₂n⌉+1 (c) n−b₀ ✓', 13, '#4ade80', true]], 200); } }
    ] } });
/* 121 超级蛋测试 */
  D({ g: g, no: 121, title: '超级蛋测试', e: 'board', strat: '动态规划·均衡',
    plain: '100 层楼 2 颗蛋找临界楼层：第一颗蛋按 14、13、12…递减间隔跳，碎了再用第二颗逐层扫——最坏恰好 14 次。',
    p: { steps: [
      { cap: '100 层 2 颗蛋：找出蛋会碎的最低楼层，碎了就少一颗', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 100, [0, 50, 100]); U.lines(ctx, W, [['最坏情况下最少试几次？', 14, '#5eead4', true]], 230); } },
      { cap: '二分法不行：第一颗碎了，第二颗最多还要扫 50 层', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 100, [0, 50, 100]); U.lines(ctx, W, [['50 层首试 → 碎了只剩 1 颗扫 1~49', 13, '#f87171', true]], 230); } },
      { cap: '均衡思想：第一颗每多跳一次，第二颗要扫的段就短 1 层', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 100, [14, 27, 39]); U.lines(ctx, W, [['跳的间隔逐次 −1：总次数恒等', 14, '#fbbf24', true]], 230); } },
      { cap: '首跳 14 层：1+2+…+14 = 105 ≥ 100，刚好盖住全楼', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 100, [14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100]); } },
      { cap: '碎了就用第二颗蛋逐层扫上一段 → 最坏恰好 14 次 ✓', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 100, [14, 27, 39, 50, 60, 69, 77, 84, 90, 95, 99, 100]); U.lines(ctx, W, [['答案：最坏恰好 14 次 ✓', 17, '#4ade80', true]], 230); } }
    ] } });

    /* 122 议会和解 */
  D({ g: g, no: 122, title: '议会和解', e: 'board', strat: '迭代改进',
    plain: '每人至多 3 个仇敌，能把议会分两组使每组内各人仇敌 ≤1 吗？能：组内仇敌 ≥2 的人就换组，同组仇敌对数必然递减。',
    p: { steps: [
      { cap: '条件：每个议员最多 3 个仇敌（敌意相互）', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['A', 'B', 'C', 'D', 'E', 'F'], ['#273469', '#273469', '#273469', '#4a3a12', '#4a3a12', '#4a3a12'], [[0, 1, '#f87171'], [0, 2, '#f87171'], [1, 2, '#f87171']]); U.lines(ctx, W, [['红线 = 同组内的仇敌对', 13, '#5eead4', true]], 290); } },
      { cap: '目标：分成两组，每人组内仇敌不超过 1 个', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['A', 'B', 'C', 'D', 'E', 'F'], ['#273469', '#273469', '#273469', '#4a3a12', '#4a3a12', '#4a3a12'], [[0, 1, '#f87171'], [0, 2, '#f87171'], [1, 2, '#f87171']]); U.lines(ctx, W, [['A 在自己组有 2 个仇敌 → 不达标', 13, '#f87171', true]], 290); } },
      { cap: '改进操作：把"组内仇敌 ≥2"的人换到另一组', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['A', 'B', 'C', 'D', 'E', 'F'], ['#273469', '#273469', '#4a3a12', '#4a3a12', '#4a3a12', '#4a3a12'], [[1, 2, '#f87171']]); U.lines(ctx, W, [['C 换组后，组内仇敌对数至少 −1', 13, '#fbbf24', true]], 290); } },
      { cap: '势函数：同组仇敌对数 p 每次至少减 1 → 有限步必停', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['A', 'B', 'C', 'D', 'E', 'F'], ['#273469', '#273469', '#4a3a12', '#4a3a12', '#4a3a12', '#4a3a12'], [[1, 2, '#f87171']]); U.lines(ctx, W, [['他在新组最多 1 个仇敌（总共 ≤3 个）', 13, '#8fa0c8']], 290); } },
      { cap: '收敛：每组内每人仇敌都不多于 1 个 → 命题为真 ✓', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['A', 'B', 'C', 'D', 'E', 'F'], ['#273469', '#273469', '#4a3a12', '#4a3a12', '#4a3a12', '#4a3a12'], []); U.lines(ctx, W, [['答案：命题为真（迭代改进）✓', 14, '#4ade80', true]], 290); } }
    ] } });
/* 123 荷兰国旗问题 */
  D({ g: g, no: 123, title: '荷兰国旗问题', e: 'arrange', strat: '三指针·一趟扫描',
    plain: '把红白蓝三色乱序数组排成三段，只扫描一趟、只做交换。Dijkstra 的三指针：红指针收红、蓝指针收蓝、白指针巡检。',
    p: { init: ['红', '白', '蓝', '红', '蓝', '白', '白', '红', '蓝'], dark: true,
      colorOf: function (v) { return v === '红' ? '#dc2626' : v === '白' ? '#e2e8f0' : '#2563eb'; },
      pointer: true, cap0: '三指针：L = 红区末尾 · M = 扫描 · H = 蓝区开头',
      ops: [
        { t: 'swap', i: 0, j: 0, hl: [0], ptr: [[1, 'L'], [1, 'M'], [8, 'H']], cap: 'M 指向红 → 与 L 交换（同格），红区扩展' },
        { t: 'swap', i: 1, j: 1, ptr: [[1, 'L'], [2, 'M'], [8, 'H']], cap: 'M 指向白 → 直接前移' },
        { t: 'swap', i: 2, j: 8, hl: [2, 8], ptr: [[1, 'L'], [2, 'M'], [7, 'H']], cap: 'M 指向蓝 → 与 H 交换（同色），蓝区扩展' },
        { t: 'swap', i: 2, j: 7, hl: [2, 7], ptr: [[1, 'L'], [2, 'M'], [6, 'H']], cap: 'M 指向蓝 → 与 H 交换，蓝区扩展' },
        { t: 'swap', i: 1, j: 2, hl: [1, 2], ptr: [[2, 'L'], [3, 'M'], [6, 'H']], cap: 'M 指向红 → 与 L 交换，红区扩展' },
        { t: 'swap', i: 2, j: 3, hl: [2, 3], ptr: [[3, 'L'], [4, 'M'], [6, 'H']], cap: 'M 指向红 → 与 L 交换，红区扩展' },
        { t: 'swap', i: 4, j: 6, hl: [4, 6], ptr: [[3, 'L'], [4, 'M'], [5, 'H']], cap: 'M 指向蓝 → 与 H 交换，蓝区扩展' },
        { t: 'swap', i: 4, j: 4, ptr: [[3, 'L'], [5, 'M'], [5, 'H']], cap: 'M 指向白 → 前移' },
        { t: 'swap', i: 5, j: 5, ptr: [[3, 'L'], [6, 'M'], [5, 'H']], cap: 'M 越过 H → 排序完成 ✓' }
      ], cap: '一趟扫描 O(n)、只做交换：红-白-蓝三段 ✓' } });

  /* 124 切割链条 */
  D({ g: g, no: 124, title: '切割链条', e: 'board', strat: '二进制·贪心',
    plain: '7 节链条当房费，每天付 1 节、可以找零。只剪开第 3 节：得到 1、2、4 三段，二进制组合覆盖 1~7。',
    p: { steps: [
      { cap: '7 节链条抵房费：每天付 1 节，房东可以找零', fn: function (ctx, W) { U.row(ctx, W, 120, ['○', '○', '○', '○', '○', '○', '○']); U.lines(ctx, W, [['住 7 天，最少剪开几节？', 14, '#5eead4', true]], 200); } },
      { cap: '全剪开太浪费 → 剪出的段要能拼出 1~7 任意数', fn: function (ctx, W) { U.row(ctx, W, 120, ['○', '○', '○', '○', '○', '○', '○']); U.lines(ctx, W, [['找零 = 收回已付的段，组合支付', 13, '#f87171', true]], 200); } },
      { cap: '二进制思路：段长取 1、2、4 就能组合出 1~7 任何数', fn: function (ctx, W) { U.lines(ctx, W, [['1、2、4 → 子集和覆盖 1~7', 16, '#fbbf24', true], ['3 = 1+2、5 = 1+4、6 = 2+4、7 = 1+2+4', 13, '#8fa0c8']], 130, 46); } },
      { cap: '剪开第 3 节 → 得到单节 1、段 2、段 4', fn: function (ctx, W) { U.row(ctx, W, 120, ['1', '2', '4'], [0, 1, 2]); } },
      { cap: '1~7 都能组合+找零支付：最少只剪 1 节 ✓', fn: function (ctx, W) { U.row(ctx, W, 110, ['1', '2', '4'], [0, 1, 2]); U.lines(ctx, W, [['第1天给1；第2天给2找1；第4天给4找1+2 ✓', 14, '#4ade80', true]], 200); } }
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
    plain: '两人分蛋糕："一人切、一人先选"，切的人自然会把两半切得一样大。三人用移动刀法：刀缓缓划过，谁先喊停谁拿第一块。',
    p: { steps: [
      { cap: '2 人：一人切，另一人先选', fn: function (ctx, W) { cake(ctx, W, [0.5]); } },
      { cap: '切者必然切成两等份（否则自己可能拿小的）', fn: function (ctx, W) { cake(ctx, W, [0.5]); H.txt(ctx, '激励相容：公平是自发行为', W / 2, 40, { size: 13, color: '#fbbf24' }); } },
      { cap: '3 人：移动刀协议——刀缓缓划过，谁先喊停谁拿第一块', fn: function (ctx, W) { cake(ctx, W, [1 / 3]); H.txt(ctx, '喊停者拿走的，正是他心里的 1/3', W / 2, 40, { size: 13, color: '#5eead4' }); } },
      { cap: '剩下 2 人对余下的蛋糕再来一次"一人切、一人先选"', fn: function (ctx, W) { cake(ctx, W, [1 / 3, 2 / 3]); } },
      { cap: '递归处理剩余部分 → 人人都觉得自己拿到 ≥1/n ✓', fn: function (ctx, W) { cake(ctx, W, [1 / 3, 2 / 3]); H.txt(ctx, '答案：切-选 + 移动刀，公平可递归 ✓', W / 2, 40, { size: 13, bold: true, color: '#4ade80' }); } }
    ] } });
  function cake(ctx, W, cuts) {
    var x0 = W / 2 - 140, y0 = 100;
    ctx.fillStyle = '#7c5a3a'; H.rr(ctx, x0, y0, 280, 120, 10); ctx.fill();
    ctx.fillStyle = '#f0abfc'; H.rr(ctx, x0, y0, 280, 26, 10); ctx.fill();
    cuts.forEach(function (c) { H.line(ctx, x0 + 280 * c, y0 - 8, x0 + 280 * c, y0 + 128, '#f87171', 2.5); });
  }

  /* 127 骑士之旅 */
  D({ g: g, no: 127, title: '骑士之旅', e: 'knight', strat: '回溯·启发式',
    plain: '骑士能否走遍 8×8 棋盘每格恰一次并回到起点（闭合之旅）？能：Warnsdorff 启发"走向最没出路的一格"最实用，动画以 6×6 演示。',
    p: { n: 6, mode: 'tour', start: [0, 0], cap: '6×6 演示巡游；8×8 同样存在闭合之旅' } });

    /* 128 安全开关 */
  D({ g: g, no: 128, title: '安全开关', e: 'board', strat: '数学技巧·格雷码',
    plain: '一排安全开关：最右随意拨，其余需"右邻开、其余全关"才能拨。等价于格雷码遍历，最少 2ⁿ−1 次操作。',
    p: { steps: [
      { cap: '目标：关闭所有开关；最右开关可以随意拨', fn: function (ctx, W) { U.lamps(ctx, W, 110, '1111', 3); U.lines(ctx, W, [['切换一个开关计一次操作', 13, '#8fa0c8']], 230); } },
      { cap: '限制：其他开关只在"右邻开、其余全关"时才能拨', fn: function (ctx, W) { U.lamps(ctx, W, 110, '1011', 1); U.lines(ctx, W, [['想拨第 2 个？先把右边调成 10', 14, '#f87171', true]], 230); } },
      { cap: '每步只能改变 1 位 → 等价于格雷码遍历所有状态', fn: function (ctx, W) { U.lamps(ctx, W, 110, '011', 2); U.lines(ctx, W, [['000 → 001 → 011 → 010 → …：每步只变 1 位', 13, '#fbbf24', true]], 230); } },
      { cap: '递推：W(n) = 2W(n−1) + 1 → W(3)=7、W(4)=15', fn: function (ctx, W) { U.lamps(ctx, W, 110, '0111', 3); U.lines(ctx, W, [['拨完前 n−1、拨第 n、再拨前 n−1', 13, '#8fa0c8']], 230); } },
      { cap: '答案：最少 2ⁿ−1 次操作（n=4 时 15 次）✓', fn: function (ctx, W) { U.lamps(ctx, W, 110, '0000', -1); U.lines(ctx, W, [['W(n) = 2W(n−1) + 1 = 2ⁿ−1 ✓', 15, '#4ade80', true]], 230); } }
    ] } });
/* 129 Reve 之谜 */
  D({ g: g, no: 129, title: 'Reve 之谜', e: 'hanoi', strat: '分治·四柱',
    plain: '四柱汉诺塔，8 个圆盘：Frame-Stewart 策略分组——先用四柱把小盘组挪到辅助桩，腾出柱子搬大盘组，再把小盘组摞回来，33 步完成（三柱需 255 步）。',
    p: { n: 8, pegs: 4, moves: [
      { d: 1, f: 0, t: 2 }, { d: 2, f: 0, t: 1 }, { d: 3, f: 0, t: 3 }, { d: 2, f: 1, t: 3 }, { d: 4, f: 0, t: 1 },
      { d: 2, f: 3, t: 0 }, { d: 3, f: 3, t: 1 }, { d: 2, f: 0, t: 1 }, { d: 1, f: 2, t: 1 }, { d: 5, f: 0, t: 2 },
      { d: 6, f: 0, t: 3 }, { d: 5, f: 2, t: 3 }, { d: 7, f: 0, t: 2 }, { d: 5, f: 3, t: 0 }, { d: 6, f: 3, t: 2 },
      { d: 5, f: 0, t: 2 }, { d: 8, f: 0, t: 3 }, { d: 5, f: 2, t: 3 }, { d: 6, f: 2, t: 0 }, { d: 5, f: 3, t: 0 },
      { d: 7, f: 2, t: 3 }, { d: 5, f: 0, t: 2 }, { d: 6, f: 0, t: 3 }, { d: 5, f: 2, t: 3 }, { d: 1, f: 1, t: 0 },
      { d: 2, f: 1, t: 3 }, { d: 3, f: 1, t: 2 }, { d: 2, f: 3, t: 2 }, { d: 4, f: 1, t: 3 }, { d: 2, f: 2, t: 1 },
      { d: 3, f: 2, t: 3 }, { d: 2, f: 1, t: 3 }, { d: 1, f: 0, t: 3 }
    ], cap: 'Frame-Stewart：8 盘 33 次（三柱需 255 次）' } });

    /* 130 毒酒 */
  D({ g: g, no: 130, title: '毒酒', e: 'board', strat: '二进制编码',
    plain: '1000 桶酒 1 桶有毒，用 10 人一轮测出：桶号转 10 位二进制，第 i 位为 1 就让第 i 人喝；30 天后死者位拼出毒酒编号。',
    p: { steps: [
      { cap: '1000 桶中恰 1 桶有毒；毒性 30 天发作，只有一轮机会', fn: function (ctx, W) { var st = {}; U.people(ctx, W, 100, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], st); U.lines(ctx, W, [['35 天内必须找出毒酒', 13, '#8fa0c8']], 200); } },
      { cap: '(a) 10 人 = 10 位二进制：1000 < 2¹⁰ = 1024，编号可区分', fn: function (ctx, W) { var st = {}; U.people(ctx, W, 100, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], st); U.lines(ctx, W, [['每人对应一个二进制位', 14, '#5eead4', true]], 200); } },
      { cap: '编码：每桶编号转 10 位二进制，第 i 位为 1 → 第 i 人喝', fn: function (ctx, W) { var st = {}; U.people(ctx, W, 100, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], st); U.lines(ctx, W, [['每人同时尝几百桶的混合样本', 13, '#5eead4', true]], 200); } },
      { cap: '30 天后死掉的奴隶位组合 = 毒酒编号（如 1、3、10 号死 → 2⁰+2²+2⁹）', fn: function (ctx, W) { var st = { 0: { out: true }, 2: { out: true }, 9: { out: true } }; U.people(ctx, W, 100, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], st); U.word(ctx, W, 176, ['1', '0', '1', '0', '0', '0', '0', '0', '0', '1'], [0, 2, 9]); U.lines(ctx, W, [['死者位为 1：2⁰ + 2² + 2⁹ = 517 号是毒酒', 14, '#fbbf24', true]], 240); } },
      { cap: '(b) 8 个奴隶也可行：分 4 组 + 分阶段测试，宴会前确定毒酒 ✓', fn: function (ctx, W) { var st = { 0: { out: true }, 2: { out: true }, 9: { out: true } }; U.people(ctx, W, 100, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], st); U.lines(ctx, W, [['(b) 8 人：1000 桶分 4 组，两轮分阶段测试也可确定 ✓', 13, '#4ade80', true]], 200); } }
    ] } });
  /* 131 Tait 筹码谜题 */
  D({ g: g, no: 131, title: 'Tait 筹码谜题', e: 'board', strat: '构造·成对移动',
    plain: '2n 个黑白交替的筹码要重排成 WWW…BBB，只能把相邻一对整体移到空位（顺序不变）。n≥3 时恰好 n 次移动可完成。',
    p: { steps: [
      { cap: '初始：黑白交替 BWBWBW…', fn: function (ctx, W) { U.row(ctx, W, 110, ['B', 'W', 'B', 'W', 'B', 'W'], null, function (v) { return v === 'B' ? '#334155' : '#e2e8f0'; }); U.lines(ctx, W, [['黑白完全交错，最坏情况', 13, '#5eead4', true]], 200); } },
      { cap: '目标：白色全在黑色前面（WWW…BBB），且不许留空隙', fn: function (ctx, W) { U.row(ctx, W, 110, ['W', 'W', 'W', 'B', 'B', 'B']); U.lines(ctx, W, [['白色全部在黑色前面：WWW…BBB', 14, '#fbbf24', true]], 200); } },
      { cap: '约束：只能成对移动——相邻一对整体搬到空位，顺序不能变', fn: function (ctx, W) { U.row(ctx, W, 90, ['B', 'W', 'B', 'W', 'B', 'W'], [1, 2], function (v) { return v === 'B' ? '#334155' : '#e2e8f0'; }); U.row(ctx, W, 160, ['W', 'B', '', '', 'B', 'W'], [0, 5], function (v) { return v === 'B' ? '#334155' : v === 'W' ? '#e2e8f0' : null; }); U.lines(ctx, W, [['把中间的 WB 对整体移到空位，顺序不变', 13, '#fbbf24', true]], 240); } },
      { cap: '策略：每次把一对错位筹码搬进空隙，空隙像接力一样前进', fn: function (ctx, W) { U.row(ctx, W, 90, ['W', 'W', 'B', '', '', 'B'], [3, 4], function (v) { return v === 'B' ? '#334155' : v === 'W' ? '#e2e8f0' : null; }); U.lines(ctx, W, [['每步解决一对错位，空位移到新战场', 13, '#8fa0c8']], 180); } },
      { cap: '答案：n≥3 时恰好 n 次移动完成 ✓', fn: function (ctx, W) { U.row(ctx, W, 110, ['W', 'W', 'W', 'B', 'B', 'B'], null, function (v) { return v === 'B' ? '#334155' : '#e2e8f0'; }); U.lines(ctx, W, [['答案：n≥3 恰好 n 次成对移动 ✓', 15, '#4ade80', true]], 200); } }
    ] } });
/* 132 跳棋军队 */
  D({ g: g, no: 132, title: '跳棋军队', e: 'board', strat: '构造·接力',
    plain: '线下棋子只能向前跳过相邻棋子（被跳者移除）：8 枚能把侦察兵送到线上第 3 行，20 枚送到第 4 行。',
    p: { steps: [
      { cap: '无限棋盘被水平线一分为二：要把一枚侦察兵送过线尽量高', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', ''], ['', '', ''], ['', '', ''], ['●', '●', '●'], ['●', '●', '●'], ['●', '●', '']], { max: 40, txtColor: function () { return '#fbbf24'; } }); U.lines(ctx, W, [['线下棋子只能水平/竖直跳跃', 13, '#8fa0c8']], 300); } },
      { cap: '(a) 8 枚军队列阵，目标：送一枚到线上第 3 行', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', ''], ['', '', ''], ['', '', ''], ['●', '●', '●'], ['●', '●', '●'], ['●', '●', '']], { max: 40, txtColor: function () { return '#fbbf24'; } }); } },
      { cap: '跳跃一次前进 2 格、消耗 1 枚垫子；垫子自身又需要下层棋子接力', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '●', ''], ['', '', ''], ['', '', ''], ['', '●', '●'], ['●', '', '●'], ['●', '', '']], { max: 40, txtColor: function () { return '#fbbf24'; } }); } },
      { cap: '(a) 层层接力 → 8 枚足以把尖兵送到第 3 行 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '★', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', ''], ['', '', '']], { max: 40, txtColor: function () { return '#4ade80'; } }); } },
      { cap: '(b) 深入第 4 行需要 20 枚（深入 k 行所需棋子数按递推增长）', fn: function (ctx, W, Hh) { var gg = U.grid(ctx, W, Hh, [['', '', ''], ['', '', ''], ['8', ''], ['4', ''], ['2', '']], { max: 40, txtColor: function (r, c, v) { return v ? '#fbbf24' : ''; } }); H.txt(ctx, '第 1 行 2 枚 → 第 2 行 4 → 第 3 行 8 → 第 4 行 20', W / 2, gg.y0 + 5 * gg.cell + 16, { size: 12, bold: true, color: '#8fa0c8' }); } }
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
  D({ g: g, no: 134, title: '点着色', e: 'board', strat: '递归·构造',
    plain: '网格上 n 个点染黑白两色，使每条横线竖线上黑白数相同或差 1：递归——选奇数线留一点，先涂其余，最后补涂。',
    p: { steps: [
      { cap: '目标：每行、每列上黑点与白点数相同或相差 1', fn: function (ctx, W) { var px = function (c) { return W / 2 + (c - 1) * 70; }, py = function (r) { return 90 + r * 60; }, r, c; for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) H.circle(ctx, px(c), py(r), 13, (r + c) % 2 ? '#e8ecf8' : '#fbbf24'); U.lines(ctx, W, [['每行/每列 |黑−白| ≤ 1：棋盘式染色即满足', 14, '#5eead4', true]], 290); } },
      { cap: 'n 为奇数时：选一条含奇数个点的线，留一个点待涂', fn: function (ctx, W) { var px = function (c) { return W / 2 + (c - 1) * 70; }, py = function (r) { return 90 + r * 60; }, r, c; for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) { var pend = r === 0 && c === 0; H.circle(ctx, px(c), py(r), 13, pend ? '#0f1430' : ((r + c) % 2 ? '#e8ecf8' : '#fbbf24'), pend ? '#fbbf24' : null); if (pend) H.txt(ctx, '?', px(c), py(r), { size: 14, bold: true, color: '#fbbf24' }); } U.lines(ctx, W, [['首行 3 个点为奇数：留 1 个待定', 13, '#fbbf24', true]], 290); } },
      { cap: '递归：先把其余 n−1 个点涂好（归纳保证满足条件）', fn: function (ctx, W) { var px = function (c) { return W / 2 + (c - 1) * 70; }, py = function (r) { return 90 + r * 60; }, r, c; for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) { var pend = r === 0 && c === 0; H.circle(ctx, px(c), py(r), 13, pend ? '#0f1430' : ((r + c) % 2 ? '#e8ecf8' : '#fbbf24'), pend ? '#8fa0c8' : null); if (pend) H.txt(ctx, '?', px(c), py(r), { size: 14, bold: true, color: '#fbbf24' }); } U.lines(ctx, W, [['n−1 为偶数：其余点可按对均分涂完', 13, '#8fa0c8']], 290); } },
      { cap: '补涂：待定点所在的两条线各差 1，总有一种颜色不破坏条件', fn: function (ctx, W) { var px = function (c) { return W / 2 + (c - 1) * 70; }, py = function (r) { return 90 + r * 60; }, r, c; for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) { var pend = r === 0 && c === 0; H.circle(ctx, px(c), py(r), 13, pend ? '#0f1430' : ((r + c) % 2 ? '#e8ecf8' : '#fbbf24'), pend ? '#fbbf24' : null); if (pend) H.txt(ctx, '?', px(c), py(r), { size: 14, bold: true, color: '#fbbf24' }); } U.lines(ctx, W, [['挑"两条线都容忍"的颜色补上', 13, '#fbbf24', true]], 290); } },
      { cap: '答案：递归算法总可完成 ✓', fn: function (ctx, W) { var px = function (c) { return W / 2 + (c - 1) * 70; }, py = function (r) { return 90 + r * 60; }, r, c; for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) H.circle(ctx, px(c), py(r), 13, (r + c) % 2 ? '#e8ecf8' : '#fbbf24'); U.lines(ctx, W, [['答案：递归涂色，所有直线黑白差 ≤ 1 ✓', 14, '#4ade80', true]], 290); } }
    ] } });
  /* 135 不同的配对 */
  D({ g: g, no: 135, title: '不同的配对', e: 'board', strat: '构造·轮转',
    plain: '2n 个孩子每天配对散步，2n−1 天不重复：轮转法——固定 1 号，其余每天轮转一格，"对面"两人配对。',
    p: { steps: [
      { cap: '2n 个孩子每天配成 n 对，2n−1 天内分组不许重复', fn: function (ctx, W) { U.row(ctx, W, 110, ['1', '2', '3', '4', '5', '6']); U.lines(ctx, W, [['例：6 个孩子（n=3），要走 5 天', 14, '#5eead4', true]], 200); } },
      { cap: '轮转法：固定 1 号，其余 2n−1 个孩子每天顺时针轮转一格', fn: function (ctx, W) { U.row(ctx, W, 110, ['1', '2', '3', '4', '5', '6']); U.lines(ctx, W, [['其余 5 人每天转一格，1 号永远不动', 13, '#fbbf24', true]], 200); } },
      { cap: '每天由"对面"的两人配对：第 1 天 (1,6)(2,5)(3,4)', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['1', '3', '4', '5', '6', '2'], null, [[0, 1], [2, 5], [3, 4]]); U.lines(ctx, W, [['圆桌对面两人一组', 13, '#5eead4', true]], 290); } },
      { cap: '轮转一格 → 第 2 天 (1,3)(4,6)(5,2)，与昨天全不同', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['1', '3', '4', '5', '6', '2'], null, [[0, 1], [2, 5], [3, 4]]); U.lines(ctx, W, [['每个"对面关系"恰好用一次', 13, '#fbbf24', true]], 290); } },
      { cap: '答案：轮转法（循环赛日程表）实现 2n−1 天全不同 ✓', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['1', '3', '4', '5', '6', '2'], null, []); U.lines(ctx, W, [['2n−1 天每天 n 对，全不重复 ✓', 14, '#4ade80', true]], 290); } }
    ] } });
  /* 136 抓捕间谍 */
  D({ g: g, no: 136, title: '抓捕间谍', e: 'board', strat: '穷举·枚举',
    plain: '间谍位置 = a+bt，a、b 都是未知整数：把所有 (a,b) 假设排成螺旋队列，第 t 步验证第 t 个假设，有限次必中。',
    p: { steps: [
      { cap: '间谍：位置 = a + bt，起点 a 与速度 b 都是未知整数', fn: function (ctx, W) { U.axis(ctx, W, 150, -5, 20, [-5, 0, 5, 10, 15, 20], [{ v: 3, label: 'a', color: '#7dd3fc' }, { v: 9, label: 'a+bt', color: '#fbbf24' }]); U.lines(ctx, W, [['你只能问：间谍在位置 x 吗？得是/否', 13, '#8fa0c8']], 230); } },
      { cap: '假设无穷多：(a,b) 是全部整数对 → 直接猜永远猜不完', fn: function (ctx, W) { U.lines(ctx, W, [['(a,b) ∈ ℤ×ℤ：无穷多个假设', 15, '#f87171', true], ['但可数：能排成一列逐个验证', 13, '#8fa0c8']], 130, 46); } },
      { cap: '关键：把所有 (a,b) 按螺旋顺序编号 0,1,2,…', fn: function (ctx, W) { var sp = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]], s = 40, ox = W / 2 - 130, oy = 150, i; for (i = 0; i < sp.length - 1; i++) H.line(ctx, ox + sp[i][0] * s, oy - sp[i][1] * s, ox + sp[i + 1][0] * s, oy - sp[i + 1][1] * s, '#39437a', 1.5); for (i = 0; i < sp.length; i++) { H.circle(ctx, ox + sp[i][0] * s, oy - sp[i][1] * s, 11, '#273469', '#5eead4'); H.mono(ctx, String(i), ox + sp[i][0] * s, oy - sp[i][1] * s, { size: 10, bold: true, color: i === 0 ? '#fbbf24' : '#e8ecf8' }); } U.lines(ctx, W, [['螺旋枚举：每个整数对都有编号', 13, '#fbbf24', true]], 250); } },
      { cap: '第 t 步：检查第 t 个假设对应的位置 a + bt', fn: function (ctx, W) { U.axis(ctx, W, 150, -5, 20, [-5, 0, 5, 10, 15, 20], [{ v: 9, label: 'a+bt', color: '#fbbf24' }]); U.lines(ctx, W, [['每步验证一个假设，命中即破案', 13, '#5eead4', true]], 230); } },
      { cap: '答案：螺旋枚举 (a,b)，有限次提问必然找到 ✓', fn: function (ctx, W) { U.axis(ctx, W, 150, -5, 20, [-5, 0, 5, 10, 15, 20], [{ v: 9, label: '间谍', color: '#4ade80' }]); U.lines(ctx, W, [['假设有限而间谍真实存在 → 有限步内必命中 ✓', 13, '#4ade80', true]], 230); } }
    ] } });
/* 137 跳跃成对 II */
  D({ g: g, no: 137, title: '跳跃成对 II', e: 'board', strat: '构造·逆向',
    plain: 'n 枚硬币排成一行，n/2 次移动各跳过 1,2,… 枚组成 n/2 对：最后一步须跳过偶数枚，故当且仅当 n 为 4 的倍数有解。',
    p: { steps: [
      { cap: 'n = 4：第 1 次跳 1 枚、第 2 次跳 2 枚，最终形成 2 对', fn: function (ctx, W) { U.row(ctx, W, 120, ['○', '○', '○', '○']); U.lines(ctx, W, [['跳数递增：1, 2, …, n/2', 13, '#8fa0c8']], 200); } },
      { cap: '第 1 次（跳 1 枚）：4 号跳过 3 号落在 2 号 → 第 2 格成对', fn: function (ctx, W) { U.row(ctx, W, 120, ['○', '◎', '○', ''], [1]); } },
      { cap: '第 2 次（跳 2 枚）：1 号跳过已成对的第 2 格（算 2 枚）落在 3 号 → 2 对完成 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, ['', '◎', '◎', ''], [1, 2]); } },
      { cap: '一般结论：最后一步须跳过偶数枚 → n/2 为偶数 → 当且仅当 n 为 4 的倍数有解', fn: function (ctx, W) { U.row(ctx, W, 110, ['◎', '◎', '◎', '◎'], [0, 1, 2, 3]); U.lines(ctx, W, [['n = 8 同样可解：答案 n ≡ 0 (mod 4) ✓', 15, '#4ade80', true]], 200); } }
    ] } });

  /* 138 糖果分享 */
  D({ g: g, no: 138, title: '糖果分享', e: 'board', strat: '迭代改进·收敛',
    plain: '几个孩子围坐，每轮每人把一半糖果给右边的人，奇数颗的老师补一颗。不管初始多不均匀，几轮后人人一样多。',
    p: { steps: [
      { cap: '规则：每轮每人把一半糖果给右边的人；奇数颗老师先补 1 颗', fn: function (ctx, W) { U.row(ctx, W, 120, [2, 10, 2, 6]); U.lines(ctx, W, [['同时出手：收左边的、给右边的', 13, '#8fa0c8']], 210); } },
      { cap: '初始：2、10、2、6 —— 很不均匀', fn: function (ctx, W) { U.row(ctx, W, 120, [2, 10, 2, 6], [1]); U.lines(ctx, W, [['最多 10 颗、最少 2 颗，差 8', 13, '#f87171', true]], 210); } },
      { cap: '第 1 轮：各给一半给右边 → 4、6、6、4，差距缩小', fn: function (ctx, W) { U.row(ctx, W, 120, [4, 6, 6, 4]); U.lines(ctx, W, [['最大值下降、最小值上升', 13, '#fbbf24', true]], 210); } },
      { cap: '再一轮 → 5、5、5、5：完全平均', fn: function (ctx, W) { U.row(ctx, W, 120, [5, 5, 5, 5], [0, 1, 2, 3]); } },
      { cap: '不管怎么开局，迭代平均必然收敛 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, [5, 5, 5, 5], [0, 1, 2, 3], function () { return '#1e3a34'; }); U.lines(ctx, W, [['答案：有限轮后人人一样多 ✓', 15, '#4ade80', true]], 210); } }
    ] } });

    /* 139 亚瑟国王的圆桌 */
  D({ g: g, no: 139, title: '亚瑟国王的圆桌', e: 'board', strat: '迭代改进',
    plain: 'n 骑士圆桌排座，每人朋友 ≥ n/2，要求无人邻座仇敌：迭代改进——段互换让相邻仇敌对数逐次递减至 0。',
    p: { steps: [
      { cap: '条件：每个骑士朋友数 ≥ n/2 → 仇敌数 ≤ n/2−1', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['A', 'B', 'C', 'D', 'E', 'F'], null, [[0, 1], [2, 3]]); U.lines(ctx, W, [['先任意入座：红线 = 相邻仇敌，初始有 2 对', 14, '#5eead4', true]], 290); } },
      { cap: '目标：重排座位，让相邻仇敌对数变成 0', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['A', 'B', 'C', 'D', 'E', 'F'], null, [[0, 1], [2, 3]]); U.lines(ctx, W, [['朋友够多 → 总有腾挪空间', 13, '#8fa0c8']], 290); } },
      { cap: '关键：相邻仇敌 A、B → 找 A 的朋友 C、B 的朋友 D，段互换', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['A', 'C', 'B', 'D', 'E', 'F'], null, [[1, 2]]); U.lines(ctx, W, [['把 B 到 C 之间的座位段整体互换', 13, '#fbbf24', true]], 290); } },
      { cap: '每换一次，相邻仇敌对数至少减少 1 → 有限步必停', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['A', 'C', 'B', 'D', 'E', 'F'], null, [[1, 2]]); U.lines(ctx, W, [['段互换后剩 1 对，继续改进', 14, '#fbbf24', true]], 290); } },
      { cap: '答案：有限轮后无人坐在仇敌旁 ✓', fn: function (ctx, W, Hh) { U.roundTable(ctx, W, Hh, ['A', 'C', 'B', 'E', 'D', 'F'], null, []); U.lines(ctx, W, [['答案：迭代改进，相邻仇敌对数递减至 0 ✓', 14, '#4ade80', true]], 290); } }
    ] } });
  /* 140 重温 n 皇后问题 */
  D({ g: g, no: 140, title: '重温 n 皇后问题', e: 'board', strat: '构造·分情况',
    plain: 'n>3 时线性时间构造 n 皇后：按 n mod 6 分情况——余 0/4/5 直接"偶数列在前、奇数列在后"，余 2/3 需交换特定列。',
    p: { steps: [
      { cap: 'n×n 棋盘放 n 个皇后，互不同行/列/对角线 → 要 O(n) 构造', fn: function (ctx, W, Hh) { U.queens(ctx, W, Hh, [1, 3, 5, 7, 0, 2, 4, 6]); U.lines(ctx, W, [['回溯太慢：能不能直接写公式？', 13, '#5eead4', true]], 290); } },
      { cap: '基本构造：按 2,4,6,…,n,1,3,5,… 的顺序放皇后', fn: function (ctx, W, Hh) { U.queens(ctx, W, Hh, [1, 3, 5, 7, 0, 2, 4, 6]); U.lines(ctx, W, [['n=8：先偶数列 2,4,6,8，再奇数列 1,3,5,7', 13, '#5eead4', true]], 290); } },
      { cap: 'n mod 6 = 2 或 3：直接放会出对角线冲突 → 需要微调', fn: function (ctx, W, Hh) { U.queens(ctx, W, Hh, [3, 1, 7, 5, 0, 2, 4, 6]); U.lines(ctx, W, [['余 2/3 的两种情况要特殊处理', 13, '#f87171', true]], 290); } },
      { cap: '调整：交换前后两组中的特定皇后，冲突消失', fn: function (ctx, W, Hh) { U.queens(ctx, W, Hh, [3, 1, 7, 5, 0, 2, 4, 6]); U.lines(ctx, W, [['交换后对角线差 ≠ 0：无冲突', 13, '#fbbf24', true]], 290); } },
      { cap: '答案：n>3 时线性时间 O(n) 构造出可行解 ✓', fn: function (ctx, W, Hh) { U.queens(ctx, W, Hh, [1, 3, 5, 7, 0, 2, 4, 6]); U.lines(ctx, W, [['答案：n>3 总能 O(n) 直接构造可行解 ✓', 13, '#4ade80', true]], 290); } }
    ] } });
/* 141 约瑟夫问题 */
  D({ g: g, no: 141, title: '约瑟夫问题', e: 'arrange', strat: '模拟·递推',
    plain: '10 人围圈，从 1 号起数到 2 者出局，谁站到最后？逐步模拟出局顺序找出幸存者 5 号，递推公式还能 O(n) 直接算。',
    p: { init: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      colorOf: function () { return '#3b55a6'; },
      ops: [
        { t: 'del', i: 1, hl: [1], cap: '2 号出局' }, { t: 'del', i: 2, hl: [2], cap: '4 号出局' },
        { t: 'del', i: 3, hl: [3], cap: '6 号出局' }, { t: 'del', i: 4, hl: [4], cap: '8 号出局' },
        { t: 'del', i: 5, hl: [5], cap: '10 号出局' }, { t: 'del', i: 1, hl: [1], cap: '3 号出局' },
        { t: 'del', i: 2, hl: [2], cap: '7 号出局' }, { t: 'del', i: 0, hl: [0], cap: '1 号出局' },
        { t: 'del', i: 1, hl: [1], cap: '9 号出局 → 幸存者 5 号 ✓' }
      ], cap: 'n=10, k=2：幸存位置 = 2L+1（10 = 2³+2 → 5 号）' } });

  /* 142 12 枚硬币 */
  D({ g: g, no: 142, title: '12 枚硬币', e: 'weigh', strat: '减治·三分·决策树',
    plain: '12 枚硬币中 1 枚假币，不知轻重，3 次天平称量找出它并判断轻重。每次称 4 vs 4，把 24 种可能（12 枚 × 轻/重）三分再三分。',
    p: { n: 12, title: '12 枚中找假币（不知轻重），3 次', steps: [
      { L: [1, 2, 3, 4], R: [5, 6, 7, 8], res: '<', note: '① 1~4 vs 5~8 → 左轻：假币在 1~4(偏轻) 或 5~8(偏重)' },
      { L: [1, 2, 7], R: [3, 4, 5], res: '>', note: '② 1,2,7 vs 3,4,5 → 左重：只有"7 偏重"能解释' },
      { L: [7], R: [9], res: '>', note: '③ 7 vs 真币 9 → 确认 7 号是假币且偏重 ✓' }
    ] } });

    /* 143 被感染的棋盘 */
  D({ g: g, no: 143, title: '被感染的棋盘', e: 'board', strat: '构造·不变量',
    plain: '一格有 ≥2 个感染邻居就被传染。最少用 n 个初始感染格染遍 n×n 棋盘：整条主对角线起步，向两侧逐层扩散。',
    p: { steps: [
      { cap: '规则：一格有 ≥2 个被感染的正交邻居 → 它也被传染', fn: function (ctx, W, Hh) {
        var b = [], r, c; for (r = 0; r < 6; r++) { var row = []; for (c = 0; c < 6; c++) row.push((r === 0 && c === 1) || (r === 1 && c === 0) ? '●' : (r === 0 && c === 0) ? '?' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function (r, c, v) { return v === '●' ? '#f87171' : '#fbbf24'; }, cellColor: function (rr2, cc) { return rr2 === 0 && cc === 0 ? '#4a3a12' : null; } });
        U.lines(ctx, W, [['两个感染邻居 → 角上这格也被传染', 13, '#8fa0c8']], 300); } },
      { cap: '问题：想感染整个棋盘，初始最少感染几格？', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(r === c ? '●' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function () { return '#f87171'; } }); U.lines(ctx, W, [['太少 → 扩散中断；多少才够？', 14, '#5eead4', true]], 300); } },
      { cap: '构造：把整条主对角线 n 个方格作为初始感染源', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(r === c ? '●' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function () { return '#f87171'; } }); U.lines(ctx, W, [['对角线上每格都有两个对角邻居待感染', 13, '#fbbf24', true]], 300); } },
      { cap: '病毒沿对角线向两侧逐层扩散，一圈圈吃掉棋盘', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(Math.abs(r - c) <= 1 ? '●' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function () { return '#f87171'; } });
        U.lines(ctx, W, [['第 k 轮：距对角线 ≤ k 的格全部感染', 13, '#fbbf24', true]], 300); } },
      { cap: '最终感染整个棋盘（少于 n 个不行）✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push('●'); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, max: 38, cellColor: function () { return '#1e3a34'; }, txtColor: function () { return '#4ade80'; } });
        U.lines(ctx, W, [['答案：最少 n 个（主对角线）✓', 14, '#4ade80', true]], 300); } }
    ] } });
  /* 144 拆除方格 */
  D({ g: g, no: 144, title: '拆除方格', e: 'board', strat: '构造·递归',
    plain: '牙签拼成的 n×n 平板，最少移除 ⌊n²/2⌋+1 根就能破坏所有大小方格：递归拆外框多米诺环的中线，再处理内层。',
    p: { steps: [
      { cap: 'n×n 平板由牙签拼成，要破坏所有大小方格的边界', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push(''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true, max: 48 }); U.lines(ctx, W, [['移除最少的牙签，让任何方格都不完整', 13, '#8fa0c8']], 300); } },
      { cap: '观察：每根牙签最多同时破坏两个方格 → 要拆得巧', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push(''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true, max: 48 }); U.lines(ctx, W, [['挑"共享边"下手，一根抵两根', 14, '#f87171', true]], 300); } },
      { cap: '递归：先处理宽 1 的外框架（多米诺骨牌环）', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push(''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 48, cellColor: function (rr2, cc) { return rr2 === 0 || rr2 === 3 || cc === 0 || cc === 3 ? 'rgba(248,113,113,.22)' : null; } });
        for (var k = 0; k < 4; k++) { H.line(ctx, gg.x0 + k * gg.cell + gg.cell / 2, gg.y0, gg.x0 + k * gg.cell + gg.cell / 2, gg.y0 + 8, '#f87171', 2); H.line(ctx, gg.x0 + k * gg.cell + gg.cell / 2, gg.y0 + 4 * gg.cell - 8, gg.x0 + k * gg.cell + gg.cell / 2, gg.y0 + 4 * gg.cell, '#f87171', 2); }
        U.lines(ctx, W, [['移除每张骨牌中线的牙签', 13, '#fbbf24', true]], 300); } },
      { cap: '再递归处理内部 (n−2)×(n−2) 子平板，层层向内', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push(''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true, max: 48, cellColor: function (rr2, cc) { return (rr2 === 1 || rr2 === 2) && (cc === 1 || cc === 2) ? 'rgba(251,191,36,.18)' : null; } }); U.lines(ctx, W, [['外框 → 内层：同样的子问题', 13, '#fbbf24', true]], 300); } },
      { cap: '答案：最少移除 ⌊n²/2⌋+1 根牙签（n>1）✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push(''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, max: 48, cellColor: function () { return '#1e3a34'; } });
        U.lines(ctx, W, [['答案：⌊n²/2⌋+1 根（n>1）✓', 15, '#4ade80', true]], 300); } }
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
    plain: '目标藏在 5 个洞之一，每晚必搬到相邻洞，每天只能查一个洞。利用奇偶性：2→3→4 查一轮，再查一轮，必中。',
    p: { steps: [
      { cap: '5 个洞，目标藏在其一；每晚必搬到相邻洞', fn: function (ctx, W) { U.row(ctx, W, 120, ['洞1', '洞2', '洞3', '洞4', '洞5']); U.lines(ctx, W, [['每天只能查一个洞', 13, '#8fa0c8']], 210); } },
      { cap: '乱查等于碰运气 → 注意：每晚搬家必翻转洞号的奇偶性', fn: function (ctx, W) { U.row(ctx, W, 120, ['洞1', '洞2', '洞3', '洞4', '洞5'], [1]); U.lines(ctx, W, [['奇洞 ↔ 偶洞：每晚必变', 14, '#f87171', true]], 210); } },
      { cap: '假设目标起始在偶数洞：按 2 → 3 → 4 的顺序查，必中', fn: function (ctx, W) { U.row(ctx, W, 120, ['洞1', '洞2', '洞3', '洞4', '洞5'], [1, 2, 3]); U.lines(ctx, W, [['扫描速度 ≥ 目标移动 → 逃不掉', 13, '#fbbf24', true]], 210); } },
      { cap: '若起始在奇数洞：等一天让其奇偶翻转，再查 2 → 3 → 4', fn: function (ctx, W) { U.row(ctx, W, 120, ['洞1', '洞2', '洞3', '洞4', '洞5'], [1, 2, 3]); U.lines(ctx, W, [['停一天：奇偶性换位，再扫一轮', 13, '#fbbf24', true]], 210); } },
      { cap: '两轮 2→3→4 覆盖两种奇偶性 → 必中 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, ['洞1', '洞2', '洞3', '洞4', '洞5'], [1, 2, 3], function (v, i2) { return [1, 2, 3].indexOf(i2) >= 0 ? '#1e3a34' : null; }); U.lines(ctx, W, [['答案：两轮扫描必中 ✓', 15, '#4ade80', true]], 210); } }
    ] } });

    /* 147 编号的帽子 */
  D({ g: g, no: 147, title: '编号的帽子', e: 'board', strat: '数学技巧·同余',
    plain: 'n 顶帽子写 0~n−1，每人只看得到别人的数。同余策略：第 i 人猜 (i − 他人和) mod n，恰有一人必猜中。',
    p: { steps: [
      { cap: 'n 个数学家，帽上写 0~n−1（可重复）；只看得到别人的数', fn: function (ctx, W) { U.people(ctx, W, 100, ['0', '1', '2', '3']); U.lines(ctx, W, [['不许交流，同时写下自己帽上的数', 13, '#8fa0c8']], 220); } },
      { cap: '只要有一人写对就赢 → 他们真有办法吗？', fn: function (ctx, W) { U.people(ctx, W, 100, ['0', '1', '2', '3']); U.lines(ctx, W, [['看似无解：每人对自己一无所知', 14, '#f87171', true]], 220); } },
      { cap: '策略：事先编号 0~n−1；第 i 人猜 xᵢ = (i − Sᵢ) mod n', fn: function (ctx, W) { U.people(ctx, W, 100, ['0', '1', '2', '3'], { 0: { tag: 'x=(0−S) mod 4' }, 1: { tag: 'x=(1−S) mod 4' }, 2: { tag: 'x=(2−S) mod 4' }, 3: { tag: 'x=(3−S) mod 4' } }); U.lines(ctx, W, [['帽上数字 2、0、1、3；Sᵢ = 看到的数之和', 13, '#fbbf24', true]], 220); } },
      { cap: '设真实总和为 S：编号 j ≡ S (mod n) 的那个人必然猜中', fn: function (ctx, W) { U.people(ctx, W, 100, ['0', '1', '2', '3'], { 0: { tag: 'S mod 4 = 0', color: '#4ade80' }, 1: { tag: '猜错' }, 2: { tag: '猜错' }, 3: { tag: '猜错' } }); U.lines(ctx, W, [['总和 S = 6 ≡ 0 (mod 4) → 0 号数学家猜中', 14, '#fbbf24', true]], 220); } },
      { cap: '答案：有方法（同余策略），必有一人猜中 ✓', fn: function (ctx, W) { U.people(ctx, W, 100, ['0', '1', '2', '3'], { 0: { tag: '猜中 ✓', color: '#4ade80' }, 1: {}, 2: {}, 3: {} }); U.lines(ctx, W, [['答案：能赢——编号 ≡ 总和 (mod n) 者必猜中 ✓', 14, '#4ade80', true]], 220); } }
    ] } });
  /* 148 自由硬币 */
  D({ g: g, no: 148, title: '自由硬币', e: 'board', strat: '构造·编码',
    plain: '8×8 硬币板，A 只许翻一枚硬币给 B 传目标格：约定 0~63 编号，翻"异或和 ⊕ 目标号"那枚，B 算异或和即可。',
    p: { steps: [
      { cap: '8×8 硬币板：狱卒指定目标格，A 只能翻一枚硬币', fn: function (ctx, W, Hh) { var cs = 34, x0 = W / 2 - 4 * cs - 30, y0 = 50, r, c; for (r = 0; r < 8; r++) for (c = 0; c < 8; c++) { var head = (r * 3 + c * 5) % 4 < 2; ctx.fillStyle = '#121a3a'; H.rr(ctx, x0 + c * cs + 1, y0 + r * cs + 1, cs - 2, cs - 2, 3); ctx.fill(); H.txt(ctx, head ? '●' : '○', x0 + c * cs + cs / 2, y0 + r * cs + cs / 2, { size: 12, color: head ? '#fbbf24' : '#39437a' }); if (r === 2 && c === 2) { H.rr(ctx, x0 + c * cs - 2, y0 + r * cs - 2, cs + 4, cs + 4, 5); ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2; ctx.stroke(); } } U.lines(ctx, W, [['红框 = 目标格（编号 18）', 13, '#5eead4', true]], 290); } },
      { cap: 'B 只能看板面 → 约定：64 格编号 0~63，信息藏在"正面格编号的异或和"里', fn: function (ctx, W, Hh) { var cs = 34, x0 = W / 2 - 4 * cs - 30, y0 = 50, r, c; for (r = 0; r < 8; r++) for (c = 0; c < 8; c++) { var head = (r * 3 + c * 5) % 4 < 2; ctx.fillStyle = '#121a3a'; H.rr(ctx, x0 + c * cs + 1, y0 + r * cs + 1, cs - 2, cs - 2, 3); ctx.fill(); H.txt(ctx, head ? '●' : '○', x0 + c * cs + cs / 2, y0 + r * cs + cs / 2, { size: 12, color: head ? '#fbbf24' : '#39437a' }); } U.lines(ctx, W, [['当前异或和 = 7：和目标 18 差多少？', 13, '#fbbf24', true]], 290); } },
      { cap: 'A 翻硬币 T = (当前异或和) ⊕ (目标编号)：翻转 T 号硬币后异或和恰好 = 目标编号', fn: function (ctx, W, Hh) { var cs = 34, x0 = W / 2 - 4 * cs - 30, y0 = 50, r, c; for (r = 0; r < 8; r++) for (c = 0; c < 8; c++) { var head = (r === 0 && c === 5) ? true : (r * 3 + c * 5) % 4 < 2; ctx.fillStyle = '#121a3a'; H.rr(ctx, x0 + c * cs + 1, y0 + r * cs + 1, cs - 2, cs - 2, 3); ctx.fill(); H.txt(ctx, head ? '●' : '○', x0 + c * cs + cs / 2, y0 + r * cs + cs / 2, { size: 12, color: head ? '#fbbf24' : '#39437a' }); if (r === 2 && c === 2) { H.rr(ctx, x0 + c * cs - 2, y0 + r * cs - 2, cs + 4, cs + 4, 5); ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2; ctx.stroke(); } if (r === 0 && c === 5) { H.rr(ctx, x0 + c * cs - 2, y0 + r * cs - 2, cs + 4, cs + 4, 5); ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.stroke(); } } U.lines(ctx, W, [['翻金框 5 号硬币：7 ⊕ 18 = 21 → 新异或和 = 18', 13, '#fbbf24', true]], 290); } },
      { cap: '为什么总有一枚可翻：T 号硬币无论正反，翻转后异或和必变到目标值', fn: function (ctx, W) { U.lines(ctx, W, [['x ⊕ T ⊕ T = x：异或的自反性', 16, '#8fa0c8', true], ['翻掉 T 号 → 异或和从 7 变为 7 ⊕ 21 = 18', 13, '#fbbf24', true]], 130, 46); } },
      { cap: 'B 计算异或和 → 指出目标格 → 囚犯能赢 ✓', fn: function (ctx, W, Hh) { var cs = 34, x0 = W / 2 - 4 * cs - 30, y0 = 50, r, c; for (r = 0; r < 8; r++) for (c = 0; c < 8; c++) { var head = (r === 0 && c === 5) ? true : (r * 3 + c * 5) % 4 < 2; ctx.fillStyle = '#121a3a'; H.rr(ctx, x0 + c * cs + 1, y0 + r * cs + 1, cs - 2, cs - 2, 3); ctx.fill(); H.txt(ctx, head ? '●' : '○', x0 + c * cs + cs / 2, y0 + r * cs + cs / 2, { size: 12, color: head ? '#fbbf24' : '#39437a' }); if (r === 2 && c === 2) { H.rr(ctx, x0 + c * cs - 2, y0 + r * cs - 2, cs + 4, cs + 4, 5); ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2; ctx.stroke(); } } U.lines(ctx, W, [['B 算出异或和 18 = 目标编号 ✓', 14, '#4ade80', true]], 290); } }
    ] } });
  /* 149 卵石扩张 */
  D({ g: g, no: 149, title: '卵石扩张', e: 'board', strat: '不变量·权值',
    plain: '移除一枚卵石需在它右边、上方各放一枚。想清空 n 条对角线的楼梯区：权值 2^(−i−j) 不变量证明仅 n=1、2 有解。',
    p: { steps: [
      { cap: '规则：移除一枚卵石 → 在它右边、上方各放一枚（须为空）', fn: function (ctx, W) { var s = 44, x0 = W / 2 - 3 * s, y0 = 70, i, j; for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) { ctx.fillStyle = '#121a3a'; H.rr(ctx, x0 + i * s + 2, y0 + j * s + 2, s - 4, s - 4, 4); ctx.fill(); } H.circle(ctx, x0 + s / 2, y0 + s / 2, 13, '#5eead4'); U.lines(ctx, W, [['目标：清空楼梯形区域 Sₙ（n 条对角线）', 13, '#8fa0c8']], 290); } },
      { cap: 'n=1：角落卵石可直接清除 → 有解', fn: function (ctx, W) { var s = 44, x0 = W / 2 - 3 * s, y0 = 70, i, j; for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) { ctx.fillStyle = '#121a3a'; H.rr(ctx, x0 + i * s + 2, y0 + j * s + 2, s - 4, s - 4, 4); ctx.fill(); } H.circle(ctx, x0 + s / 2, y0 + s / 2, 13, '#5eead4'); U.lines(ctx, W, [['n=1、n=2 都能手工完成', 14, '#5eead4', true]], 290); } },
      { cap: 'n 再大还行吗？给方格 (i,j) 赋权 2^(−i−j)，越远越轻', fn: function (ctx, W) { var s = 44, x0 = W / 2 - 3 * s, y0 = 70, i, j, wts = ['1', '1/2', '1/4', '1/8', '1/16']; for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) { ctx.fillStyle = '#121a3a'; H.rr(ctx, x0 + i * s + 2, y0 + j * s + 2, s - 4, s - 4, 4); ctx.fill(); H.mono(ctx, wts[(i + j) > 4 ? 4 : i + j], x0 + i * s + s / 2, y0 + j * s + s / 2, { size: 10, color: '#8fa0c8' }); } U.lines(ctx, W, [['权值随曼哈顿距离指数衰减', 13, '#5eead4', true]], 290); } },
      { cap: '不变量：移除 1 枚需放上右、上两枚 → 权值 1 ≤ 1/2 + 1/2，总权不减', fn: function (ctx, W) { var s = 44, x0 = W / 2 - 3 * s, y0 = 70, i, j, wts = ['1', '1/2', '1/4', '1/8', '1/16']; for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) { ctx.fillStyle = '#121a3a'; H.rr(ctx, x0 + i * s + 2, y0 + j * s + 2, s - 4, s - 4, 4); ctx.fill(); H.mono(ctx, wts[(i + j) > 4 ? 4 : i + j], x0 + i * s + s / 2, y0 + j * s + s / 2, { size: 10, color: '#8fa0c8' }); } H.circle(ctx, x0 + s * 3 / 2, y0 + s / 2, 13, '#5eead4'); H.circle(ctx, x0 + s / 2, y0 + s * 3 / 2, 13, '#5eead4'); U.lines(ctx, W, [['任何操作都只能让总权不降', 13, '#fbbf24', true]], 290); } },
      { cap: '答案：仅当 n=1、2 时有解 ✓', fn: function (ctx, W) {
        var s = 44, x0 = W / 2 - 3 * s, y0 = 70, i, j, wts = ['1', '1/2', '1/4', '1/8', '1/16'];
        for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) { ctx.fillStyle = '#121a3a'; H.rr(ctx, x0 + i * s + 2, y0 + j * s + 2, s - 4, s - 4, 4); ctx.fill(); H.mono(ctx, wts[(i + j) > 4 ? 4 : i + j], x0 + i * s + s / 2, y0 + j * s + s / 2, { size: 10, color: '#8fa0c8' }); }
        H.circle(ctx, x0 + s * 3 / 2, y0 + s / 2, 13, '#5eead4'); H.circle(ctx, x0 + s / 2, y0 + s * 3 / 2, 13, '#5eead4');
        U.lines(ctx, W, [['S₃ 总权 < 1 = 初始权 → 矛盾 → 仅 n=1、2 有解 ✓', 13, '#4ade80', true]], 290); } }
    ] } });
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
