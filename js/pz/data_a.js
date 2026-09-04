/* 谜题区 1-50（全覆盖） */
(function () {
  var H = PZ.H, U = PZ.U, D = PZ.def, g = 'c';

  /* 骑士 8 格循环轮换脚本（40 题用） */
  var guaMoves = [
    { id: 'W1', r: 2, c: 1 }, { id: 'B2', r: 0, c: 1 }, { id: 'B1', r: 1, c: 2 }, { id: 'W2', r: 1, c: 0 },
    { id: 'W1', r: 0, c: 2 }, { id: 'B2', r: 2, c: 0 }, { id: 'B1', r: 0, c: 0 }, { id: 'W2', r: 2, c: 2 },
    { id: 'W1', r: 1, c: 0 }, { id: 'B2', r: 1, c: 2 }, { id: 'B1', r: 2, c: 1 }, { id: 'W2', r: 0, c: 1 },
    { id: 'W1', r: 2, c: 2 }, { id: 'B2', r: 0, c: 0 }, { id: 'B1', r: 0, c: 2 }, { id: 'W2', r: 2, c: 0 }];

  /* 1 狼羊菜过河 */
  D({ g: g, no: 1, title: '狼羊菜过河', e: 'river', strat: '穷举·状态空间',
    plain: '农夫带狼、羊、菜过河，船一次只能带一样。农夫不在时狼吃羊、羊吃菜，所以羊必须先过，再回来接。广度优先搜索自动找出 7 步方案。',
    p: { items: [{ id: '狼', label: '狼', color: '#8fa0c8' }, { id: '羊', label: '羊', color: '#fbbf24' }, { id: '菜', label: '菜', color: '#4ade80' }],
      cap: 1, capText: '船每次只能载 1 样（农夫划船）',
      valid: function (st) { var s = st[st.boat === 'L' ? 'R' : 'L']; return !(s.indexOf('羊') >= 0 && (s.indexOf('狼') >= 0 || s.indexOf('菜') >= 0)); } } });

  /* 2 手套选择 */
  D({ g: g, no: 2, title: '手套选择', e: 'board', strat: '最坏情况',
    plain: '黑暗中摸手套，按最坏情况兜底：10 只左手全摸完还没成双，所以 (a) 至少要 11 只；要三色都成双，最坏得等到第 19 只。',
    p: { steps: [
      { cap: '20 只手套：黑 5 双、棕 3 双、灰 2 双，左右手混放在抽屉里', fn: function (ctx, W) { U.row(ctx, W, 100, ['黑', '黑', '黑', '黑', '黑', '棕', '棕', '棕', '灰', '灰'], null, function (v) { return v === '黑' ? '#8fa0c8' : v === '棕' ? '#fdba74' : '#94a3b8'; }); U.lines(ctx, W, [['黑暗中摸取：看不见颜色，也分不清左右手', 13, '#5eead4', true]], 195); } },
      { cap: '最坏情况：前 10 只摸到的全是左手，一双都没配上', fn: function (ctx, W) { U.row(ctx, W, 100, ['黑', '黑', '黑', '黑', '黑', '棕', '棕', '棕', '灰', '灰'], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], function (v) { return v === '黑' ? '#8fa0c8' : v === '棕' ? '#fdba74' : '#94a3b8'; }); U.lines(ctx, W, [['最坏先摸齐全部左手 → 仍无配对', 14, '#f87171', true]], 195); } },
      { cap: '(a) 第 11 只必是右手 → 与任一左手同色即成双 → a = 11', fn: function (ctx, W) { U.row(ctx, W, 100, ['黑', '黑', '黑', '黑', '黑', '棕', '棕', '棕', '灰', '灰', '?'], [10], function (v) { return v === '黑' ? '#8fa0c8' : v === '棕' ? '#fdba74' : '#94a3b8'; }); U.lines(ctx, W, [['10 只左手 + 1 只右手 = 11 只', 15, '#fbbf24', true]], 195); } },
      { cap: '(b) 最坏继续：又摸出 5 只黑右 + 3 只棕右，共 18 只仍缺灰双', fn: function (ctx, W) { U.row(ctx, W, 100, ['10左', '5黑右', '3棕右', '?'], [3]); U.lines(ctx, W, [['黑双、棕双已齐，只差灰右', 14, '#8fa0c8']], 195); } },
      { cap: '第 19 只必是灰右手 → 三色全部成双 → b = 19 ✓', fn: function (ctx, W) { U.row(ctx, W, 100, ['10左', '5黑右', '3棕右', '灰右'], [3], function (v, i2) { return i2 === 3 ? '#1e3a34' : null; }); U.lines(ctx, W, [['(a) = 11，(b) = 19 ✓（最坏情况 + 鸽笼）', 15, '#4ade80', true]], 195); } }
    ] } });

  /* 3 矩形切割 */
  D({ g: g, no: 3, title: '矩形切割', e: 'geo', strat: '数学构造',
    plain: '把矩形拆成 n 个直角三角形，任意 n>1 都可行：n=2 沿对角线切一刀；之后每沿"直角顶点到斜边的高线"切一刀，三角形数就加 1。',
    p: { steps: [
      { cap: '目标：把矩形分成 n 个直角三角形（n>1），找出所有可行的 n', fn: function (ctx, W) {
        var x0 = W / 2 - 90, y0 = 90;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 180, 120);
        H.txt(ctx, 'n = 2, 3, 4, … 哪些可行？', W / 2, y0 + 150, { size: 14, bold: true, color: '#5eead4' }); } },
      { cap: '基础 n = 2：沿对角线切一刀 → 2 个直角三角形', fn: function (ctx, W) {
        var x0 = W / 2 - 90, y0 = 90;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 180, 120);
        H.line(ctx, x0, y0, x0 + 180, y0 + 120, '#f87171', 2);
        H.txt(ctx, '2 个直角三角形', W / 2, y0 + 150, { size: 13, color: '#fbbf24' }); } },
      { cap: '归纳刀法：从直角顶点向斜边作高线，1 个三角形被切成 2 个', fn: function (ctx, W) {
        var x0 = W / 2 - 90, y0 = 90;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 180, 120);
        H.line(ctx, x0, y0, x0 + 180, y0 + 120, '#f87171', 2);
        H.line(ctx, x0, y0 + 120, x0 + 45, y0 + 30, '#fbbf24', 1.5);
        H.txt(ctx, '高线垂直于斜边 → 切出的仍是直角三角形', W / 2, y0 + 150, { size: 13, color: '#fbbf24' }); } },
      { cap: '每切一刀数量 +1：2 → 3 → 4 → …，想要几个就切几刀', fn: function (ctx, W) {
        var x0 = W / 2 - 90, y0 = 90;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 180, 120);
        H.line(ctx, x0, y0, x0 + 180, y0 + 120, '#f87171', 2);
        H.line(ctx, x0, y0 + 120, x0 + 45, y0 + 30, '#fbbf24', 1.5);
        H.line(ctx, x0 + 180, y0, x0 + 90, y0 + 60, '#fbbf24', 1.5); } },
      { cap: '任意 n > 1 都可行 ✓：对角线打底，高线逐刀累加', fn: function (ctx, W) {
        var x0 = W / 2 - 90, y0 = 90;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 180, 120);
        H.line(ctx, x0, y0, x0 + 180, y0 + 120, '#f87171', 2);
        H.line(ctx, x0 + 180, y0, x0 + 90, y0 + 60, '#fbbf24', 1.5);
        H.line(ctx, x0, y0 + 120, x0 + 90, y0 + 60, '#fbbf24', 1.5);
        H.txt(ctx, '每刀 +1：任意 n > 1 都可行 ✓', W / 2, y0 + 150, { size: 13, color: '#4ade80' }); } }
    ] } });

  /* 4 士兵摆渡 */
  function scene4(ctx, W, bx, cargo, crossed) {
    ctx.fillStyle = '#123252'; ctx.fillRect(0, 200, W, 60);
    ctx.fillStyle = '#1d3a2a'; ctx.fillRect(0, 200, 140, 60); ctx.fillRect(W - 140, 200, 140, 60);
    var i, sx = crossed ? W - 128 : 22;
    for (i = 0; i < 15; i++) H.circle(ctx, sx + (i % 8) * 15, 222 + Math.floor(i / 8) * 16, 6, '#818cf8');
    H.txt(ctx, crossed ? '士兵 ×25（已过河）' : '士兵 ×25', crossed ? W - 70 : 70, 188, { size: 12, bold: true, color: '#818cf8' });
    ctx.fillStyle = '#6b4a2b'; H.rr(ctx, bx - 35, 222, 70, 16, 6); ctx.fill();
    var m;
    for (m = 0; m < cargo.length; m++) H.circle(ctx, bx - 14 + m * 28, 214, cargo[m] === '兵' ? 9 : 7, cargo[m] === '兵' ? '#818cf8' : '#fbbf24');
  }
  D({ g: g, no: 4, title: '士兵摆渡', e: 'board', strat: '穷举·模式复用',
    plain: '船只能载两男孩或一士兵：两个男孩当"摆渡机"，每送一个士兵固定 4 渡，25 个士兵 100 渡，收尾再 1 渡，共 101 渡。',
    p: { steps: [
      { cap: '25 个士兵 + 2 个男孩在左岸；船很小：只载 2 男孩 或 1 士兵', fn: function (ctx, W) { scene4(ctx, W, 90, ['童', '童']); H.txt(ctx, '士兵不会划船？不——是船载不动“兵+童”', W / 2, 80, { size: 14, bold: true, color: '#8fa0c8' }); } },
      { cap: '困境：士兵过河后，船还得有人划回来 → 只能靠轻的男孩跑腿', fn: function (ctx, W) { scene4(ctx, W, W / 2, ['兵']); H.txt(ctx, '士兵过河 → 男孩划回 → 循环', W / 2, 80, { size: 14, bold: true, color: '#fbbf24' }); } },
      { cap: '送 1 个士兵的固定套路（4 渡）：两男孩过 → 一男孩回 → 士兵过 → 一男孩回', fn: function (ctx, W) { scene4(ctx, W, W / 2, ['兵']); U.lines(ctx, W, [['①两男孩→ ②一男孩← ③士兵→ ④一男孩←', 15, '#fbbf24', true]], 90); } },
      { cap: '套路复用 25 次：每送 1 个士兵回到原状态，25 × 4 = 100 渡', fn: function (ctx, W) { scene4(ctx, W, 90, ['童', '童']); U.lines(ctx, W, [['每轮结束后船和男孩回到左岸，下轮照旧', 13, '#8fa0c8'], ['25 名士兵 × 4 渡 = 100 渡', 16, '#fbbf24', true]], 80, 40); } },
      { cap: '收尾：两男孩一起过河（1 渡）→ 共 100 + 1 = 101 渡 ✓', fn: function (ctx, W) { scene4(ctx, W, W - 90, ['童', '童'], true); H.txt(ctx, '25 × 4 + 1 = 101 次渡河 ✓', W / 2, 80, { size: 16, bold: true, color: '#4ade80' }); } }
    ] } });

  /* 5 行列变换 */
  D({ g: g, no: 5, title: '行列变换', e: 'board', strat: '不变量',
    plain: '只许行交换和列交换，能把左阵列变成右阵列吗？不能——"每列的元素集合"是不变量，两个阵列的列集合根本对不上。',
    p: { steps: [
      { cap: '左阵列（4×4）：每列元素集合 {1,5,9,13}、{2,6,10,14}…', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '2', '3', '4'], ['5', '6', '7', '8'], ['9', '10', '11', '12'], ['13', '14', '15', '16']], { max: 36 }); } },
      { cap: '目标右阵列：每列集合是 {1,2,3,4}、{5,6,7,8}…（像转置）', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['13', '9', '5', '1'], ['14', '10', '6', '2'], ['15', '11', '7', '3'], ['16', '12', '8', '4']], { max: 36, cellColor: function () { return '#1e3a34'; } }); } },
      { cap: '行交换只是重排行的顺序：每一列里装着谁，纹丝不动', fn: function (ctx, W) { U.lines(ctx, W, [['行交换：列的元素集合不变', 16, '#fbbf24', true]], 130); } },
      { cap: '列交换只是整列挪位置：每列的元素集合同样不变', fn: function (ctx, W) { U.lines(ctx, W, [['列交换：列的元素集合仍不变', 16, '#fbbf24', true], ['"每列元素集合"是两种操作共同的不变量', 13, '#8fa0c8']], 110, 44); } },
      { cap: '左阵列有列 {1,5,9,13}，右阵列找不到 → 不可达 → 不能 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['答案：不能（列元素集合是不变量）', 16, '#4ade80', true]], 130); } }
    ] } });

  /* 6 数数的手指 */
  D({ g: g, no: 6, title: '数数的手指', e: 'board', strat: '找周期',
    plain: '手指走"之"字形数数：去程 5 指、返程 4 指，8 个数一个循环。1000 ÷ 8 余 0，正好落在循环末位——食指。',
    p: { steps: [
      { cap: '去程：拇 1、食 2、中 3、无名 4、小 5', fn: function (ctx, W) { U.row(ctx, W, 110, ['拇1', '食2', '中3', '无名4', '小5']); } },
      { cap: '返程折回：无名 6、中 7、食 8、拇 9（端点指不重复数）', fn: function (ctx, W) { U.row(ctx, W, 110, ['无名6', '中7', '食8', '拇9']); } },
      { cap: '发现周期：拇 1 → … → 食 8，每 8 个数一个循环', fn: function (ctx, W) { U.row(ctx, W, 110, ['拇1', '食2', '中3', '无名4', '小5', '无名6', '中7', '食8'], null, function (v, i2) { return i2 === 1 ? '#4a3a12' : null; }); } },
      { cap: '1000 ÷ 8 = 125 … 余 0 → 位置对应循环里的第 8 位', fn: function (ctx, W) { U.lines(ctx, W, [['循环长度 = 8', 15, '#8fa0c8'], ['1000 ÷ 8 = 125 … 余 0', 16, '#fbbf24', true]], 110, 44); } },
      { cap: '余 0 即循环第 8 位 → 食指 ✓', fn: function (ctx, W) { U.row(ctx, W, 110, ['拇1', '食2', '中3', '无名4', '小5', '无名6', '中7', '食8'], [7]); } }
    ] } });

  /* 7 夜过吊桥 */
  D({ g: g, no: 7, title: '夜过吊桥', e: 'timeline', strat: '贪心·调度',
    plain: '四人过桥要 1、2、5、10 分钟，桥每次最多 2 人，必须带火把。让 5 和 10 一起过，用 1 和 2 当"送火把的跑腿"，17 分钟全员通过。',
    p: { total: 17, segs: [
      { who: '1+2 过', start: 0, dur: 2 }, { who: '1 回', start: 2, dur: 1 },
      { who: '5+10 过', start: 3, dur: 10 }, { who: '2 回', start: 13, dur: 2 },
      { who: '1+2 过', start: 15, dur: 2 }], cap: '17 分钟：最慢两人结伴是关键' } });

  /* 8 拼图问题 */
  D({ g: g, no: 8, title: '拼图问题', e: 'board', strat: '不变量',
    plain: '1000 块拼图要拼多少次？每次拼接都把"部件数"恰好减 1：从 1000 到 1，必拼 999 次，一步不多一步不少。',
    p: { steps: [
      { cap: '1000 个散块，每次操作：把两块（或两堆）并成一块', fn: function (ctx, W) {
        var i, y = 110;
        for (i = 0; i < 10; i++) { ctx.fillStyle = '#273469'; H.rr(ctx, W / 2 - 110 + i * 22, y, 18, 18, 3); ctx.fill(); }
        H.txt(ctx, '1000 个独立部件', W / 2, y + 52, { size: 15, bold: true, color: '#5eead4' }); } },
      { cap: '关键观察：每拼一次，"部件数"恰好减少 1', fn: function (ctx, W) {
        var i, y = 110;
        ctx.fillStyle = '#fbbf24'; H.rr(ctx, W / 2 - 110, y, 40, 18, 3); ctx.fill();
        for (i = 2; i < 10; i++) { ctx.fillStyle = '#273469'; H.rr(ctx, W / 2 - 110 + i * 22, y, 18, 18, 3); ctx.fill(); }
        H.txt(ctx, '两块并成 1 组 → 部件数 1000 → 999', W / 2, y + 52, { size: 15, bold: true, color: '#fbbf24' }); } },
      { cap: '不管怎么拼（两块还是两堆），每步都只能减 1', fn: function (ctx, W) { U.lines(ctx, W, [['部件数：1000 → 999 → 998 → … → 1', 17, '#8fa0c8']], 130); } },
      { cap: '从 1000 降到 1，需要恰好 1000 − 1 = 999 次减 1', fn: function (ctx, W) { U.lines(ctx, W, [['每次拼接 = 减 1（不变量）', 14, '#8fa0c8'], ['1000 − 1 = 999 次', 19, '#fbbf24', true]], 110, 44); } },
      { cap: '答案：999 次拼接，一步都省不了 ✓', fn: function (ctx, W) {
        var y = 110;
        ctx.fillStyle = '#1e3a34'; H.rr(ctx, W / 2 - 110, y - 10, 220, 38, 6); ctx.fill();
        H.txt(ctx, '拼接次数 = 1000 − 1 = 999 ✓', W / 2, y + 60, { size: 16, bold: true, color: '#4ade80' }); } }
    ] } });

  /* 9 心算求和 */
  D({ g: g, no: 9, title: '心算求和', e: 'board', strat: '数学技巧·配对',
    plain: '高斯小时候的招：1+2+…+100 首尾配对，每对都是 101，共 50 对，一次乘法得 5050，不用一个个加。',
    p: { steps: [
      { cap: '求 1 + 2 + 3 + … + 100：逐项相加要 99 次加法', fn: function (ctx, W) { U.row(ctx, W, 110, [1, 2, 3, 4, '…', 98, 99, 100]); } },
      { cap: '高斯的观察：首尾配对 1+100、2+99、3+98…', fn: function (ctx, W) { U.row(ctx, W, 90, [1, 2, 3, '…'], [0]); U.row(ctx, W, 150, [100, 99, 98, '…'], [0]); } },
      { cap: '每对的和都相等：1+100 = 2+99 = … = 101', fn: function (ctx, W) { U.row(ctx, W, 90, [1, 2, 3, '…']); U.row(ctx, W, 150, [100, 99, 98, '…']); U.lines(ctx, W, [['每对和都是 101', 15, '#4ade80', true]], 220); } },
      { cap: '共 100 ÷ 2 = 50 对', fn: function (ctx, W) { U.lines(ctx, W, [['100 个数两两配对 → 50 对', 16, '#fbbf24', true]], 130); } },
      { cap: '50 × 101 = 5050 ✓：99 次加法变 1 次乘法', fn: function (ctx, W) { U.lines(ctx, W, [['100 ÷ 2 = 50 对', 14, '#8fa0c8'], ['50 × 101 = 5050', 22, '#fbbf24', true]], 110, 44); } }
    ] } });

  /* 10 硬币中的假币 */
  D({ g: g, no: 10, title: '硬币中的假币', e: 'weigh', strat: '减治·三分',
    plain: '8 枚硬币里 1 枚偏轻的假币，天平最少称几次？每次称量把嫌疑范围砍到三分之一：3 vs 3，再 1 vs 1，两次就够。',
    p: { n: 8, title: '8 枚中找 1 枚较轻的假币', steps: [
      { L: [1, 2, 3], R: [4, 5, 6], res: '<', note: '第 1 次：1,2,3 vs 4,5,6 → 左边轻，假币在 1,2,3' },
      { L: [1], R: [2], res: '=', note: '第 2 次：1 vs 2 → 平衡，假币就是 3 号（较轻）✓' }
    ] } });

  /* 11 假币堆问题 */
  D({ g: g, no: 11, title: '假币堆问题', e: 'weigh', strat: '编码·一次称重',
    plain: '10 堆硬币混着一整堆假币（每枚重 1 克）：从第 k 堆取 k 枚一起称，全真应 550 克，读数多几克就是第几堆，一次定位。',
    p: { n: 10, title: '10 堆中找整堆假币，只称 1 次', steps: [
      { L: [1, 2, 3, 4, 5, 6, 7], R: [8, 9, 10], res: '=', note: '从第 k 堆取 k 枚（共 55 枚）一起称' },
      { L: [], R: [], res: '=', note: '全真应重 55×10 = 550 克；读数多 d 克 → 第 d 堆是假币堆 ✓' }
    ] } });

  /* 12 平铺多米诺问题 */
  D({ g: g, no: 12, title: '平铺多米诺问题', e: 'tiling', strat: '构造·回溯',
    plain: '8×8 棋盘用 32 张多米诺骨牌铺满。回溯法从左到右找第一个空格，横着放不行就竖着放，总能铺满。',
    p: { n: 8, m: 8, type: 'domino', cap: '32 张骨牌恰好铺满 64 格' } });

  /* 13 被堵塞的路径 */
  D({ g: g, no: 13, title: '被堵塞的路径', e: 'griddp', strat: '动态规划',
    plain: '网格里有几格是障碍，从左上到右下的最短路线有多少条？还是"每格 = 上 + 左"，只是障碍格记 0。',
    p: { rows: 6, cols: 6, mode: 'count', val: function () { return 0; }, blocked: [[1, 1], [2, 3], [3, 1], [4, 4]] } });

    /* 14 复原国际象棋棋盘 */
  D({ g: g, no: 14, title: '复原国际象棋棋盘', e: 'board', strat: '构造·不变量',
    plain: '打乱的黑白棋盘切块拼回标准样：标准棋盘不存在同色相邻的 2×1，所以每块都不能含同色相邻对，按此约束最少切 25 块。',
    p: { steps: [
      { cap: '标准 8×8 棋盘：黑白格交错', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true, max: 38 }); } },
      { cap: '观察：标准棋盘上不存在 2×1 或 1×2 的同色区域', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 38, cellColor: function (rr2, cc) { return rr2 < 2 && cc < 2 ? '#7f3030' : null; } });
        H.txt(ctx, '相邻两格必异色 → 同色 2×1 不存在', W / 2, gg.y0 + 8 * gg.cell + 16, { size: 13, bold: true, color: '#f87171' }); } },
      { cap: '约束推论：任何拼块都不能含相邻同色格，否则拼不回去', fn: function (ctx, W) { U.lines(ctx, W, [['拼块含同色相邻对 → 无家可归', 15, '#fbbf24', true], ['切割方案必须满足这条局部约束', 13, '#8fa0c8']], 110, 44); } },
      { cap: '按约束设计切割：小块互相咬合、无同色相邻', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 38 });
        var i, j; for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) { ctx.fillStyle = (i + j) % 2 ? '#1e3a34' : '#4a3a12'; H.rr(ctx, gg.x0 + 8 * gg.cell + 14 + j * 13, gg.y0 + 40 + i * 13, 11, 11, 2); ctx.fill(); } } },
      { cap: '最少切成 25 块即可复原 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 38 });
        var i, j; for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) { ctx.fillStyle = (i + j) % 2 ? '#1e3a34' : '#4a3a12'; H.rr(ctx, gg.x0 + 8 * gg.cell + 14 + j * 13, gg.y0 + 40 + i * 13, 11, 11, 2); ctx.fill(); }
        H.txt(ctx, '切成 25 块 ✓', gg.x0 + 8 * gg.cell + 46, gg.y0 + 120, { size: 13, bold: true, color: '#4ade80' }); } }
    ] } });
  /* 15 三格骨牌平铺问题 */
  D({ g: g, no: 15, title: '三格骨牌平铺问题', e: 'board', strat: '构造·整除',
    plain: 'L 形三格骨牌能铺满哪种大方板？三个判决：3×3 最小实例直接失败，5^n×5^n 被"整除 3"一票否决，6^n×6^n 切块 2×3 矩形可铺。',
    p: { steps: [
      { cap: '问：(a) 3^n、(b) 5^n、(c) 6^n 的方格板能否用 L 形三格骨牌铺满？', fn: function (ctx, W) { U.lines(ctx, W, [['三种边长：3ⁿ、5ⁿ、6ⁿ', 16, '#5eead4', true], ['每块骨牌盖 3 个相邻格（L 形）', 13, '#8fa0c8']], 110, 44); } },
      { cap: '必要条件：总格数必须能被 3 整除（每块盖 3 格）', fn: function (ctx, W) { U.lines(ctx, W, [['总格数 ÷ 3 不整 → 一票否决', 16, '#f87171', true]], 130); } },
      { cap: '(a) 3×3：整除通过，但角上一块后剩余空间卡死 → 不能铺', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['★', '', ''], ['★', '★', '']], { max: 52, txtColor: function (r, c, v) { return v === '★' ? '#5eead4' : ''; } }); U.lines(ctx, W, [['最小实例失败 → 所有 3ⁿ×3ⁿ 都不行 ✗', 13, '#f87171', true]], 270); } },
      { cap: '(b) 5^(2n) 不是 3 的倍数 → 连必要条件都不满足 ✗', fn: function (ctx, W) { U.lines(ctx, W, [['5^(2n) mod 3 ≠ 0', 17, '#f87171', true], ['整除性直接判死，无需试铺', 13, '#8fa0c8']], 110, 44); } },
      { cap: '(c) 6^n × 6^n：划分成 2×3 矩形，每块用 2 个 L 骨牌 → 铺满 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['★', '★', '★', '●', '●', '●'], ['○', '', '', '▲', '', '']], { max: 46, txtColor: function (r, c, v) { return v ? (r === 0 ? (c < 3 ? '#5eead4' : '#fbbf24') : '#f87171') : ''; } }); U.lines(ctx, W, [['2×3 矩形 = 2 块 L 骨牌，重复平铺即可', 13, '#4ade80', true]], 270); } }
    ] } });
  /* 16 煎饼制作 */
  D({ g: g, no: 16, title: '煎饼制作', e: 'timeline', strat: '贪心·调度',
    plain: '煎 n 张饼，每面 1 分钟、锅一次两张：2n 个面 ÷ 每分钟 2 面 = n 分钟是下界；奇数先花 3 分钟煎好前 3 张，其余成对，恰好达到下界。',
    p: { total: 5, segs: [
      { who: 'n=3：饼1正 + 饼2正', start: 0, dur: 1, color: '#5eead4' },
      { who: '饼1反 + 饼3正', start: 1, dur: 1, color: '#818cf8' },
      { who: '饼2反 + 饼3反', start: 2, dur: 1, color: '#fbbf24' },
      { who: 'n>3 奇数：剩下 n−3 个两两配对', start: 3, dur: 2, color: '#4ade80' }
    ], cap: '3 个煎饼 3 分钟；一般 n>1 恰 n 分钟（2n 个面 ÷ 每分钟 2 面）' } });
  /* 17 国王的走位 */
  D({ g: g, no: 17, title: '国王的走位', e: 'board', strat: '数学技巧·计数',
    plain: '国王在无限棋盘走 n 步能到多少格：(a) 八方向可达区是大正方形，n>1 时 (2n+1)² 格；(b) 禁走对角线后变成菱形区域。',
    p: { steps: [
      { cap: '国王每步可到周围 8 个相邻格（含对角）', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', ''], ['', '♔', ''], ['', '', '']], { max: 52, cellColor: function (r, c) { return r === 1 && c === 1 ? '#1e3a34' : '#4a3a12'; }, txtColor: function (r, c, v) { return v === '♔' ? '#5eead4' : '#39437a'; } }); } },
      { cap: '(a) n = 1：到达周围 8 个方格（特例）', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', ''], ['', '♔', ''], ['', '', '']], { max: 52, cellColor: function (r, c) { return r === 1 && c === 1 ? '#1e3a34' : null; }, txtColor: function (r, c, v) { return v === '♔' ? '#5eead4' : '#39437a'; } }); U.lines(ctx, W, [['n = 1 → 8 格', 14, '#fbbf24', true]], 296); } },
      { cap: '(a) n = 2：可达区扩成 5×5 大正方形，逐圈外拖', fn: function (ctx, W, Hh) {
        var b = [], r, c; for (r = 0; r < 5; r++) { var row = []; for (c = 0; c < 5; c++) row.push(r === 2 && c === 2 ? '♔' : ''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { max: 46, cellColor: function (rr2, cc) { return rr2 === 2 && cc === 2 ? '#1e3a34' : '#4a3a12'; }, txtColor: function () { return '#5eead4'; } });
        H.txt(ctx, 'n=2：(2n+1)² = 25 格', W / 2, gg.y0 + 5 * gg.cell + 18, { size: 14, bold: true, color: '#fbbf24' }); } },
      { cap: '(a) 结论：n>1 时可达 (2n+1)² 格——每多一步，正方形外拖一圈', fn: function (ctx, W) { U.lines(ctx, W, [['可达区 = 以起点为中心的 (2n+1)×(2n+1) 正方形', 13, '#8fa0c8'], ['(2n+1)² 格（n>1）✓', 17, '#4ade80', true]], 110, 44); } },
      { cap: '(b) 禁走对角线：可达区变成菱形，计数随之改变', fn: function (ctx, W, Hh) {
        var b = [], r, c; for (r = 0; r < 5; r++) { var row = []; for (c = 0; c < 5; c++) row.push(r === 2 && c === 2 ? '♔' : ''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { max: 46, cellColor: function (rr2, cc) { return rr2 === 2 && cc === 2 ? '#1e3a34' : Math.abs(rr2 - 2) + Math.abs(cc - 2) <= 2 ? '#4a3a12' : null; }, txtColor: function () { return '#5eead4'; } });
        H.txt(ctx, '(b) 只能水平/竖直 → 曼哈顿距离 ≤ n 的菱形', W / 2, gg.y0 + 5 * gg.cell + 18, { size: 13, bold: true, color: '#4ade80' }); } }
    ] } });
/* 18 骑士的征途 */
  D({ g: g, no: 18, title: '骑士的征途', e: 'knight', strat: '回溯·启发式',
    plain: '骑士能否跳遍 5×5 棋盘每格恰好一次？回溯加"下一跳选出口最少的格子"（Warnsdorff 启发），几乎不用回头就能走完。',
    p: { n: 5, mode: 'tour', start: [0, 0], cap: '25 格全数跳到，恰好一次' } });

    /* 19 页码计数 */
  D({ g: g, no: 19, title: '页码计数', e: 'board', strat: '数学技巧·分段',
    plain: '页码共用 1578 个数字：按位数分段——1~9 用 9 个、10~99 用 180 个，剩下 1389 个全属三位数页码，÷3 = 463 页，共 562 页。',
    p: { steps: [
      { cap: '设共 n 页：写页码用掉的数字总数 = 1578', fn: function (ctx, W) { U.row(ctx, W, 110, ['1', '2', '…', '99', '100', '…', 'n']); } },
      { cap: '分段 1：1~9 共 9 页，每页 1 位数字 → 用掉 9 个', fn: function (ctx, W) { U.row(ctx, W, 110, ['1~9', '10~99', '100~n'], [0]); U.lines(ctx, W, [['9 页 × 1 位 = 9 个数字', 15, '#5eead4', true]], 200); } },
      { cap: '分段 2：10~99 共 90 页，每页 2 位 → 用掉 180 个，累计 189', fn: function (ctx, W) { U.row(ctx, W, 110, ['1~9', '10~99', '100~n'], [1]); U.lines(ctx, W, [['90 页 × 2 位 = 180；9 + 180 = 189', 15, '#5eead4', true]], 200); } },
      { cap: '剩余 1578 − 189 = 1389 个数字，全部来自三位数页码 → 1389 ÷ 3 = 463 页', fn: function (ctx, W) { U.row(ctx, W, 110, ['1~9', '10~99', '100~n'], [2]); U.lines(ctx, W, [['1389 ÷ 3 = 463 页（从 100 起）', 15, '#fbbf24', true]], 200); } },
      { cap: '总页数 = 99 + 463 = 562 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['99 + 463', 16, '#8fa0c8'], ['= 562 页 ✓', 20, '#4ade80', true]], 110, 44); } }
    ] } });
  /* 20 寻找最大和 */
  D({ g: g, no: 20, title: '寻找最大和', e: 'board', strat: '动态规划',
    plain: '数字三角形最大路径和：穷举要枚 2^(n−1) 条路径；DP 逐行填表，每格 = 自身 + 上一行相邻两格和值的较大者，底边最大值即答案。',
    p: { steps: [
      { cap: '示例三角形（5 层）：每层选一个数字，从顶点走到底边', fn: function (ctx, W, Hh) { triD(ctx, W, Hh, [['9'], ['6', '5'], ['7', '1', '8'], ['2', '3', '4', '6'], ['4', '5', '8', '1', '3']], null); } },
      { cap: '穷举有多贵：每层 2 选 1，共 2⁴ = 16 条路径；层数再多就爆炸', fn: function (ctx, W) { U.lines(ctx, W, [['路径数 = 2^(层数−1)，指数增长', 15, '#f87171', true]], 130); } },
      { cap: 'DP 突破口：到达每格只有两条来路（上左/上右），最优子结构', fn: function (ctx, W) { U.lines(ctx, W, [['每格的最优 = 自身 + max(上左, 上右)', 16, '#fbbf24', true]], 130); } },
      { cap: '自顶向下逐行填表：9 → 15/14 → 22/16/22 → …', fn: function (ctx, W, Hh) { triD(ctx, W, Hh, [['9'], ['15', '14'], ['22', '16', '22'], ['24', '25', '26', '28'], ['28', '30', '34', '29', '31']], null); U.lines(ctx, W, [['每格只加一次，全表 O(n²)', 13, '#fbbf24', true]], 300); } },
      { cap: '底边最大值 34 → 最大路径和 34 ✓（回溯绿点即最优路径）', fn: function (ctx, W, Hh) { triD(ctx, W, Hh, [['9'], ['6', '5'], ['7', '1', '8'], ['2', '3', '4', '6'], ['4', '5', '8', '1', '3']], null); var cx = W / 2, y0 = 70, rh = 40; [[0, 0], [1, 0], [2, 0], [3, 1], [4, 2]].forEach(function (p2) { var row = p2[0], c = p2[1], len = row + 1; H.circle(ctx, cx + (c - (len - 1) / 2) * 44, y0 + row * rh, 6, '#4ade80'); }); U.lines(ctx, W, [['最大路径和 = 34（绿点路径）', 14, '#4ade80', true]], 300); } }
    ] } });
  function triD(ctx, W, Hh, rows, hot) {
    var cx = W / 2, y0 = 70, rh = 40;
    rows.forEach(function (row, r) {
      var y = y0 + r * rh;
      row.forEach(function (v, c) {
        var x = cx + (c - (row.length - 1) / 2) * 44;
        H.circle(ctx, x, y, 16, '#273469', '#5eead4');
        H.txt(ctx, String(v), x, y, { size: 11, bold: true, color: '#e8ecf8' });
      });
    });
  }
  /* 21 正方形的拆分 */
  D({ g: g, no: 21, title: '正方形的拆分', e: 'geo', strat: '数学构造',
    plain: '正方形拆成 n 个小正方形：n = 2、3、5 不可能，其余 n = 4 或 n ≥ 6 都有构造——偶数沿相邻两边剃边，奇数再把一块四等分（+3）。',
    p: { steps: [
      { cap: '问：n 取哪些值时，正方形能拆成 n 个小正方形？', fn: function (ctx, W) {
        var x0 = W / 2 - 60, y0 = 90, u = 60;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 2 * u, 2 * u);
        H.txt(ctx, 'n = 4？6？7？… 哪些可行', W / 2, y0 + 2 * u + 24, { size: 14, bold: true, color: '#5eead4' }); } },
      { cap: 'n = 4：十字切两刀即可；n = 2、3、5 无解', fn: function (ctx, W) {
        var x0 = W / 2 - 60, y0 = 90, u = 60;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 2 * u, 2 * u);
        ctx.beginPath(); ctx.moveTo(x0 + u, y0); ctx.lineTo(x0 + u, y0 + 2 * u); ctx.moveTo(x0, y0 + u); ctx.lineTo(x0 + 2 * u, y0 + u); ctx.stroke();
        H.txt(ctx, '4 个小正方形 ✓；2、3、5 不可能', W / 2, y0 + 2 * u + 24, { size: 13, color: '#fbbf24' }); } },
      { cap: '偶数 n = 2k：沿相邻两边剃出 2k−1 个等大小块 + 1 大块（如 n = 6）', fn: function (ctx, W) {
        var x0 = W / 2 - 90, y0 = 60, u = 30;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 6 * u, 6 * u);
        ctx.fillStyle = 'rgba(94,234,212,.2)'; ctx.fillRect(x0, y0, 5 * u, 5 * u);
        ctx.fillStyle = 'rgba(251,191,36,.25)';
        ctx.fillRect(x0 + 5 * u, y0, u, u);
        ctx.fillRect(x0, y0 + 5 * u, u, u); ctx.fillRect(x0 + u, y0 + 5 * u, u, u); ctx.fillRect(x0 + 2 * u, y0 + 5 * u, u, u); ctx.fillRect(x0 + 3 * u, y0 + 5 * u, u, u); ctx.fillRect(x0 + 4 * u, y0 + 5 * u, u, u);
        ctx.strokeStyle = '#f87171'; ctx.strokeRect(x0, y0, 5 * u, 5 * u); } },
      { cap: '奇数 n = 2k+1：在偶数方案上把一块四等分 → 总数 +3（6 → 9）', fn: function (ctx, W) {
              var x0 = W / 2 - 90, y0 = 60, u = 30;
              ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 6 * u, 6 * u);
              ctx.fillStyle = 'rgba(94,234,212,.2)'; ctx.fillRect(x0, y0, 5 * u, 5 * u);
              ctx.fillStyle = 'rgba(251,191,36,.25)';
              ctx.fillRect(x0 + 5 * u, y0, u, u);
              ctx.fillRect(x0, y0 + 5 * u, u, u); ctx.fillRect(x0 + u, y0 + 5 * u, u, u); ctx.fillRect(x0 + 2 * u, y0 + 5 * u, u, u); ctx.fillRect(x0 + 3 * u, y0 + 5 * u, u, u); ctx.fillRect(x0 + 4 * u, y0 + 5 * u, u, u);
              H.line(ctx, x0 + 5 * u + u / 2, y0, x0 + 5 * u + u / 2, y0 + u, '#f87171', 1.5);
              H.line(ctx, x0 + 5 * u, y0 + u / 2, x0 + 6 * u, y0 + u / 2, '#f87171', 1.5); } },
      { cap: '答案：n = 4 或 n ≥ 6 ✓（偶数剃边、奇数四等分迭加）', fn: function (ctx, W) {
              var x0 = W / 2 - 90, y0 = 60, u = 30;
              ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 6 * u, 6 * u);
              ctx.fillStyle = 'rgba(94,234,212,.2)'; ctx.fillRect(x0, y0, 5 * u, 5 * u);
              ctx.fillStyle = 'rgba(251,191,36,.25)';
              ctx.fillRect(x0 + 5 * u, y0, u, u);
              ctx.fillRect(x0, y0 + 5 * u, u, u); ctx.fillRect(x0 + u, y0 + 5 * u, u, u); ctx.fillRect(x0 + 2 * u, y0 + 5 * u, u, u); ctx.fillRect(x0 + 3 * u, y0 + 5 * u, u, u); ctx.fillRect(x0 + 4 * u, y0 + 5 * u, u, u);
              H.line(ctx, x0 + 5 * u + u / 2, y0, x0 + 5 * u + u / 2, y0 + u, '#f87171', 1.5);
              H.line(ctx, x0 + 5 * u, y0 + u / 2, x0 + 6 * u, y0 + u / 2, '#f87171', 1.5);
              H.txt(ctx, '一块再四等分 → 6 + 3 = 9；答案：n = 4 或 n ≥ 6 ✓', W / 2, y0 + 6 * u + 22, { size: 13, color: '#4ade80' }); } }
    ] } });
/* 22 球队排名 */
  D({ g: g, no: 22, title: '球队排名', e: 'board', strat: '图论·拓扑排序',
    plain: '循环赛只给了胜负关系，怎么排出名次？把"赢"画成箭头做拓扑排序：每轮挑出"没输给剩余任何人"的队排到前面。',
    p: { steps: [
      { cap: '战绩：A胜B、B胜C、C胜D、A胜D、B胜D、A胜C', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D']); U.lines(ctx, W, [['A→B→C→D，且 A→C、A→D、B→D', 14, '#8fa0c8']], 200); } },
      { cap: '建模：把"赢"画成有向边，赢者指向输者', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D']); U.lines(ctx, W, [['名次 = 与所有边方向一致的排列', 14, '#5eead4', true]], 200); } },
      { cap: '拓扑排序：先找没输给剩余任何人的队 → A 排第 1', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D'], [{ tag: '#1' }]); } },
      { cap: '去掉 A：剩下 B 最强 → 第 2；再依次出列 C、D', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D'], [{ tag: '#1', out: 1 }, { tag: '#2' }]); } },
      { cap: '排名 A > B > C > D ✓（若出现环则无唯一排名）', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D'], [{ tag: '#1', out: 1 }, { tag: '#2', out: 1 }, { tag: '#3', out: 1 }, { tag: '#4', out: 1 }]); } }
    ] } });

  /* 23 波兰国旗问题 */
  D({ g: g, no: 23, title: '波兰国旗问题', e: 'arrange', strat: '双指针·贪心',
    plain: '把混放的白红两色棋子分成"左白右红"，只能两两交换。两个指针从两头往中间扫，遇到放错的就互换，一趟搞定。',
    p: { init: ['白', '红', '白', '红', '红', '白', '白', '红'], dark: true,
      colorOf: function (v) { return v === '白' ? '#e2e8f0' : '#dc2626'; },
      pointer: true, cap0: '双指针：L 从左找"红"、R 从右找"白"',
      ops: [
        { t: 'swap', i: 1, j: 6, hl: [1, 6], ptr: [[3, 'L'], [5, 'R']], cap: '左指针停在"红"、右指针停在"白" → 交换，指针继续向中间' },
        { t: 'swap', i: 3, j: 5, hl: [3, 5], ptr: [[4, 'L'], [3, 'R']], cap: '第二对错位交换 → 左白右红 ✓，指针交叉结束' }
      ], cap: '一趟扫描 O(n)，这就是"国旗问题"的两色版' } });

    /* 24 国际象棋棋盘着色问题 */
  D({ g: g, no: 24, title: '国际象棋棋盘着色问题', e: 'board', strat: '图论·着色',
    plain: '给棋盘染色，让同色格上的棋子互不威胁，最少用几色？互攻图决定答案：骑士 2 色、主教 n 色、国王 4 色、车 n 色。',
    p: { steps: [
      { cap: '思路：把"互攻"建成图，最少色数 = 图的着色数', fn: function (ctx, W) { U.lines(ctx, W, [['同色格上的任意两枚棋子不得互攻', 15, '#5eead4', true]], 130); } },
      { cap: '(a) 骑士：骑士跳一步必换格色 → 标准黑白染色即可，2 色', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['黑', '白', '黑'], ['白', '黑', '白'], ['黑', '白', '黑']], { checker: true, txtColor: function (r, c) { return (r + c) % 2 ? '#fbbf24' : '#7dd3fc'; } }); } },
      { cap: '(b) 主教：同一主对角线的 n 格两两互攻 → 至少 n 色', fn: function (ctx, W, Hh) { var cols = ['#f87171', '#fbbf24', '#4ade80', '#7dd3fc']; U.grid(ctx, W, Hh, [['♝', '♝', '♝', '♝'], ['♝', '♝', '♝', '♝'], ['♝', '♝', '♝', '♝'], ['♝', '♝', '♝', '♝']], { max: 46, txtColor: function () { return '#e8ecf8'; }, cellColor: function (rr2, cc) { return cols[cc]; } }); } },
      { cap: '(c) 国王：每个 2×2 内四格两两互攻 → 4 色循环染色', fn: function (ctx, W, Hh) { var cols = ['#f87171', '#fbbf24', '#4ade80', '#7dd3fc']; U.grid(ctx, W, Hh, [['♚', '♚', '♚', '♚'], ['♚', '♚', '♚', '♚'], ['♚', '♚', '♚', '♚'], ['♚', '♚', '♚', '♚']], { max: 46, txtColor: function () { return '#e8ecf8'; }, cellColor: function (rr2, cc) { return cols[(rr2 % 2) * 2 + (cc % 2)]; } }); } },
      { cap: '(d) 车：同行/列 n 格两两互攻 → n 色；总结：攻击范围决定色数 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['骑士 2 | 主教 n | 国王 4 | 车 n', 17, '#fbbf24', true], ['互攻图的结构直接给出最少色数 ✓', 13, '#4ade80']], 110, 44); } }
    ] } });
/* 25 科学家在世的最好时代 */
  D({ g: g, no: 25, title: '科学家在世的最好时代', e: 'timeline', strat: '扫描线',
    plain: '给定几位科学家的生卒年，哪一年同时在世的人最多？把生卒事件按时间排序扫一遍，遇到出生 +1、去世 −1，峰值即答案。',
    p: { total: 70, segs: [
      { who: '科学家A', start: 0, dur: 35 }, { who: '科学家B', start: 10, dur: 40 },
      { who: '科学家C', start: 20, dur: 30 }, { who: '科学家D', start: 30, dur: 25 }],
      cap: '第 30~35 年：四人同时在世，人数最多' } });

    /* 26 寻找图灵 */
  D({ g: g, no: 26, title: '寻找图灵', e: 'board', strat: '数学技巧·排列排名',
    plain: 'TURING 在 6 字母全排列的字典序里排第几？倒着数"它后面还有几个"：U 开头 120 个 + TURN** 形 2 个，720 − 122 = 598。',
    p: { steps: [
      { cap: '6 个字母的全排列共 6! = 720 个，按字典序从 GINRTU 排起', fn: function (ctx, W) { U.word(ctx, W, 90, ['T', 'U', 'R', 'I', 'N', 'G']); U.lines(ctx, W, [['总排列数 = 6! = 720', 16, '#5eead4', true]], 190); } },
      { cap: '正向数太慢：改数"排在 TURING 后面"的单词有多少', fn: function (ctx, W) { U.word(ctx, W, 90, ['T', 'U', 'R', 'I', 'N', 'G'], [0, 1, 2, 3, 4, 5]); U.lines(ctx, W, [['位置 = 720 − 后面的个数', 15, '#fbbf24', true]], 190); } },
      { cap: '第一类：U 开头的单词，剩 5 字母任意排 → 5! = 120 个', fn: function (ctx, W) { U.word(ctx, W, 100, ['U', '*', '*', '*', '*', '*'], [0]); U.lines(ctx, W, [['U 开头：5! = 120 个', 15, '#fbbf24', true]], 200); } },
      { cap: '第二类：TURN** 形（第 4 位 N 先于 I）→ 2! = 2 个；合计 122', fn: function (ctx, W) { U.word(ctx, W, 100, ['T', 'U', 'R', 'N', '*', '*'], [3]); U.lines(ctx, W, [['120 + 2 = 122 个排在后面', 15, '#fbbf24', true]], 200); } },
      { cap: '位置 = 720 − 122 = 598 ✓', fn: function (ctx, W) { U.word(ctx, W, 90, ['T', 'U', 'R', 'I', 'N', 'G'], [0, 1, 2, 3, 4, 5]); U.lines(ctx, W, [['答案：第 720 − 122 = 598 位 ✓', 17, '#4ade80', true]], 190); } }
    ] } });
/* 27 Icosian 游戏 */
  var icoN = [], icoE = [], i;
  for (i = 0; i < 10; i++) {
    var a1 = (i * 36 - 90) * Math.PI / 180;
    icoN.push({ x: 0.5 + 0.42 * Math.cos(a1), y: 0.5 + 0.42 * Math.sin(a1), label: String(i + 1) });
  }
  for (i = 0; i < 10; i++) {
    var a2 = (i * 36 + 18 - 90) * Math.PI / 180;
    icoN.push({ x: 0.5 + 0.2 * Math.cos(a2), y: 0.5 + 0.2 * Math.sin(a2) });
  }
  for (i = 0; i < 10; i++) { icoE.push([i, (i + 1) % 10]); icoE.push([i, 10 + i]); icoE.push([10 + i, 10 + (i + 2) % 10]); }
  D({ g: g, no: 27, title: 'Icosian 游戏', e: 'tour', strat: '图论·哈密顿',
    plain: '汉密尔顿发明的游戏：在正十二面体的 20 个顶点上找一条路线，每个顶点恰好经过一次再回到起点。这就是著名的"哈密顿回路"。',
    p: { ham: true, start: 0, nodes: icoN, edges: icoE, endNote: '20 顶点恰好各走一次', cap: '回溯搜索找哈密顿回路' } });

  /* 28 一笔画 */
  D({ g: g, no: 28, title: '一笔画', e: 'tour', strat: '图论·欧拉',
    plain: '信封图形能不能一笔画完不重复？数每个点的连线数：奇数度的点只能有 0 个或 2 个。这里恰好 2 个奇度点，从其中一个起笔即可。',
    p: { euler: true, start: 0, endNote: '每条边恰好一次',
      nodes: [{ x: 0.15, y: 0.78, label: '1' }, { x: 0.85, y: 0.78, label: '2' }, { x: 0.85, y: 0.38, label: '3' }, { x: 0.15, y: 0.38, label: '4' }, { x: 0.5, y: 0.08, label: '5' }],
      edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3], [3, 4], [2, 4]],
      cap: '恰有 2 个奇度点（1、2）→ 存在欧拉路径' } });

    /* 29 重温幻方 */
  D({ g: g, no: 29, title: '重温幻方', e: 'board', strat: '数学构造',
    plain: '3 阶幻方共有 8 个：公共和 15、中央必为 5、偶数占四角，构造一个后旋转加镜像翻出全部。',
    p: { steps: [
      { cap: '目标：1~9 填 3×3，行、列、两对角线和全相等；共几个？', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['?', '?', '?'], ['?', '?', '?'], ['?', '?', '?']]); } },
      { cap: '公共和 = (1+2+…+9) ÷ 3 = 45 ÷ 3 = 15', fn: function (ctx, W, Hh) { var g = U.grid(ctx, W, Hh, [['?', '?', '?'], ['?', '?', '?'], ['?', '?', '?']]); for (var r = 0; r < 3; r++) H.mono(ctx, '= 15', g.x0 + 3 * g.cell + 26, g.y0 + r * g.cell + g.cell / 2, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '中央格被行、列、两对角线共 4 条线共用 → 必为 5', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['?', '?', '?'], ['?', '5', '?'], ['?', '?', '?']], { cellColor: function (r, c) { return r === 1 && c === 1 ? '#4a3a12' : null; } }); } },
      { cap: '偶数占四角、奇数占四边："戴九履一，左三右七，二四为肩，六八为足"', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['4', '9', '2'], ['3', '5', '7'], ['8', '1', '6']]); } },
      { cap: '验证全部 = 15；旋转 4 种 × 镜像 2 种 → 共 8 个 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['8', '1', '6'], ['3', '5', '7'], ['4', '9', '2']], { cellColor: function () { return '#1e3a34'; } }); U.lines(ctx, W, [['共 8 个（旋转 4 × 镜像 2）✓', 14, '#4ade80', true]], 300); } }
    ] } });
  /* 30 棍子切割 */
  D({ g: g, no: 30, title: '棍子切割', e: 'board', strat: '二进制·减治',
    plain: '棍子叠起来切：每次把最长的对半切，100 → 50 → 25 → 13 → 7 → 4 → 2 → 1 只要 7 刀；一般地，长度 n 最少 ⌈log₂n⌉ 刀。',
    p: { steps: [
      { cap: '目标：长度 100 切成 100 段长度 1；允许把多根叠起来同时切', fn: function (ctx, W) { U.sticks(ctx, W, 110, [100], [0]); U.lines(ctx, W, [['一次可以同时切多根 → 怎么切最省？', 14, '#5eead4', true]], 200); } },
      { cap: '笨办法：一段一段切，要 99 刀——完全没用上"叠切"', fn: function (ctx, W) { U.lines(ctx, W, [['逐段切：每刀只多出 1 段', 14, '#f87171', true], ['100 段需要 99 刀', 15, '#8fa0c8']], 110, 44); } },
      { cap: '对半切策略：把所有长棍叠齐，一刀下去全部减半', fn: function (ctx, W) { U.sticks(ctx, W, 100, [100, 50], [1]); U.lines(ctx, W, [['最长棍每刀长度减半', 14, '#fbbf24', true]], 200); } },
      { cap: '100 → 50 → 25 → 13 → 7 → 4 → 2 → 1：7 刀后全部段长 ≤ 1', fn: function (ctx, W) { U.sticks(ctx, W, 100, [100, 50, 25, 13, 7, 4, 2, 1], [7]); } },
      { cap: '答案：7 刀；一般长度 n 最少 ⌈log₂n⌉ 刀 ✓', fn: function (ctx, W) { U.sticks(ctx, W, 100, [100, 50, 25, 13, 7, 4, 2, 1]); U.lines(ctx, W, [['答案：7 次（一般 ⌈log₂n⌉ 次）✓', 16, '#4ade80', true]], 200); } }
    ] } });
  /* 31 三堆牌魔术 */
  D({ g: g, no: 31, title: '三堆牌魔术', e: 'board', strat: '三分·减治',
    plain: '27 张牌的三堆魔术：每次发三堆、目标堆放中间，嫌疑范围逐次缩到 1/3，3 次后目标牌必在整叠正中间（第 14 张）。',
    p: { steps: [
      { cap: '观众从 27 张里抽一张记住；魔术师把它洗回牌堆', fn: function (ctx, W) { U.row(ctx, W, 100, ['27 张', '抽 1 张', '洗回']); } },
      { cap: '第 1 轮：牌面向上发成 3 堆（每堆 9 张），观众指出目标在哪堆', fn: function (ctx, W) { U.row(ctx, W, 100, ['堆A ×9', '堆B ×9', '堆C ×9'], [1]); U.lines(ctx, W, [['嫌疑范围 27 → 9', 15, '#5eead4', true]], 190); } },
      { cap: '把目标堆夹在中间收牌 → 目标牌位置落在中间 1/3 段', fn: function (ctx, W) { U.row(ctx, W, 100, ['堆A ×9', '目标堆', '堆C ×9'], [1], function (v, i2) { return i2 === 1 ? '#4a3a12' : null; }); U.lines(ctx, W, [['夹中间 = 位置锁定在 10~18', 14, '#fbbf24', true]], 190); } },
      { cap: '再发三堆：范围 9 → 3；第三轮：3 → 正中间 1 张', fn: function (ctx, W) { U.row(ctx, W, 100, ['×3', '×3', '×3'], [1]); U.lines(ctx, W, [['27 → 9 → 3 → 1，每轮除以 3', 15, '#fbbf24', true]], 190); } },
      { cap: '第 3 次后目标牌必在整叠第 14 张（正中间），魔术师直接报牌 ✓', fn: function (ctx, W) { U.row(ctx, W, 100, ['13', '12', '11', '10', '1', '9', '8', '7', '6'], [4]); U.lines(ctx, W, [['27 → 9 → 3 → 正中间第 14 张 ✓', 15, '#4ade80', true]], 190); } }
    ] } });
/* 32 单淘汰赛 */
  D({ g: g, no: 32, title: '单淘汰赛', e: 'board', strat: '分治·计数',
    plain: '16 人单淘汰赛要打几场？每场恰好淘汰 1 人，要淘汰 15 人才有冠军，所以恰好 15 场，不用数赛程表。',
    p: { steps: [
      { cap: '16 人单淘汰赛：每场输者出局，赢者晋级', fn: function (ctx, W) {
        var i; for (i = 0; i < 16; i++) H.circle(ctx, 70 + i * 32, 110, 10, '#818cf8');
        U.lines(ctx, W, [['每场比赛恰好淘汰 1 人', 15, '#5eead4', true]], 190); } },
      { cap: '第一轮 8 场：16 人 → 剩 8 人', fn: function (ctx, W) {
        var i; for (i = 0; i < 16; i++) H.circle(ctx, 70 + i * 32, 110, 10, '#818cf8');
        for (i = 0; i < 8; i++) { H.line(ctx, 70 + 2 * i * 32, 124, 70 + (2 * i + 1) * 32, 124, '#5eead4', 1.5); H.circle(ctx, (70 + 2 * i * 32 + 70 + (2 * i + 1) * 32) / 2, 150, 9, '#4a3a12'); }
        U.lines(ctx, W, [['16 人 → 8 场 → 剩 8 人', 15, '#5eead4', true]], 200); } },
      { cap: '第二轮 4 场 → 剩 4；第三轮 2 场 → 剩 2', fn: function (ctx, W) { U.row(ctx, W, 110, ['8场', '4场', '2场', '1场']); } },
      { cap: '决赛 1 场 → 冠军产生；数赛程表：8+4+2+1 = 15', fn: function (ctx, W) {
        var i; for (i = 0; i < 16; i++) H.circle(ctx, 70 + i * 32, 110, 10, '#1e3a34');
        H.circle(ctx, W / 2, 160, 14, '#4a3a12', '#fbbf24'); H.txt(ctx, '冠', W / 2, 160, { size: 11, bold: true, color: '#fbbf24' }); } },
      { cap: '不变量视角：淘汰 15 人需要恰好 15 场 = n − 1 ✓', fn: function (ctx, W) {
        H.circle(ctx, W / 2, 130, 14, '#4a3a12', '#fbbf24'); H.txt(ctx, '冠', W / 2, 130, { size: 11, bold: true, color: '#fbbf24' });
        U.lines(ctx, W, [['每场淘汰 1 人 → 场数 = 人数 − 1 = 15 ✓', 16, '#fbbf24', true]], 200); } }
    ] } });

    /* 33 真伪幻方 */
  D({ g: g, no: 33, title: '真伪幻方', e: 'board', strat: '数学构造',
    plain: '(a) 每个 3×3 子表都必须是幻方 → 中央格处处受限，只有 n=3 可行；(b) 放宽成伪幻方后，3×3 幻方平铺扩展，n≥3 都行。',
    p: { steps: [
      { cap: '(a) 要求：1~9 填 n×n，任何 3×3 子表格都是幻方', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['4', '9', '2'], ['3', '5', '7'], ['8', '1', '6']]); } },
      { cap: '关键性质：3×3 幻方的中央格必为 5（公共和 15 的必然推论）', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['?', '?', '?'], ['?', '5', '?'], ['?', '?', '?']], { cellColor: function (r, c) { return r === 1 && c === 1 ? '#4a3a12' : null; } }); } },
      { cap: 'n > 3 时内部格会被多个子表共享为"中央"，约束互相冲突 → 只有 n = 3', fn: function (ctx, W) { U.lines(ctx, W, [['(a) 答案：只有 n = 3', 17, '#fbbf24', true]], 130); } },
      { cap: '(b) 伪幻方：只要行和列相等 → 用 3×3 幻方平铺扩展', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['4', '9', '2', '4', '9'], ['3', '5', '7', '3', '5'], ['8', '1', '6', '8', '1'], ['4', '9', '2', '4', '9'], ['3', '5', '7', '3', '5']], { max: 42 }); } },
      { cap: '平铺后每行每列和仍相等 → (b) n ≥ 3 都可行 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['4', '9', '2', '4', '9'], ['3', '5', '7', '3', '5'], ['8', '1', '6', '8', '1'], ['4', '9', '2', '4', '9'], ['3', '5', '7', '3', '5']], { max: 42, cellColor: function () { return '#1e3a34'; } }); U.lines(ctx, W, [['(a) n = 3；(b) n ≥ 3 ✓', 15, '#4ade80', true]], 296); } }
    ] } });
  /* 34 星星的硬币 */
  D({ g: g, no: 34, title: '星星的硬币', e: 'geo', strat: '数学技巧·贪心',
    plain: '八芒星顶点上放硬币，每枚"先放后移"且就位不动：让后一枚停在前一枚的起点，接力式能放 7 枚，之后无路可走。',
    p: { steps: [
      { cap: '八芒星 8 个顶点（1~8）；规则：先放空顶点 → 再沿线移到另一空顶点', fn: function (ctx, W, Hh) { var cx = W / 2, cy = Hh / 2, R = 100; for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4 - Math.PI / 2; H.circle(ctx, cx + R * Math.cos(a), cy + R * Math.sin(a), 12, '#273469', '#5eead4'); H.txt(ctx, String(k + 1), cx + R * Math.cos(a), cy + R * Math.sin(a), { size: 10, bold: true }); } U.lines(ctx, W, [['就位后不能再动 → 放一枚少一条路', 13, '#5eead4', true]], 296); } },
      { cap: '贪心技巧：后一枚停在前一枚的起点，把路线"接力"下去', fn: function (ctx, W) { U.lines(ctx, W, [['第 k 枚：从 v 出发 → 停在上一枚的起点', 15, '#fbbf24', true], ['这样每枚都占掉一个空位又不堵死下一步', 13, '#8fa0c8']], 110, 44); } },
      { cap: '第 1 枚：6 → 1；第 2 枚：3 → 6；第 3 枚：8 → 3', fn: function (ctx, W, Hh) { var cx = W / 2, cy = Hh / 2, R = 100, k; for (k = 0; k < 8; k++) { var a = k * Math.PI / 4 - Math.PI / 2; H.circle(ctx, cx + R * Math.cos(a), cy + R * Math.sin(a), 12, '#273469', '#5eead4'); H.txt(ctx, String(k + 1), cx + R * Math.cos(a), cy + R * Math.sin(a), { size: 10, bold: true }); } [0, 2, 5].forEach(function (v2) { H.circle(ctx, cx + R * Math.cos(v2 * Math.PI / 4 - Math.PI / 2), cy + R * Math.sin(v2 * Math.PI / 4 - Math.PI / 2) - 16, 6, '#fbbf24'); }); U.lines(ctx, W, [['6→1、3→6、8→3', 14, '#fbbf24', true]], 296); } },
      { cap: '接力继续：5 → 8、2 → 5、7 → 2、4 → 7，共 7 枚', fn: function (ctx, W, Hh) { var cx = W / 2, cy = Hh / 2, R = 100, k; for (k = 0; k < 8; k++) { var a = k * Math.PI / 4 - Math.PI / 2; H.circle(ctx, cx + R * Math.cos(a), cy + R * Math.sin(a), 12, '#273469', '#5eead4'); H.txt(ctx, String(k + 1), cx + R * Math.cos(a), cy + R * Math.sin(a), { size: 10, bold: true }); } [0, 1, 2, 4, 5, 6, 7].forEach(function (v2) { H.circle(ctx, cx + R * Math.cos(v2 * Math.PI / 4 - Math.PI / 2), cy + R * Math.sin(v2 * Math.PI / 4 - Math.PI / 2) - 16, 6, '#fbbf24'); }); U.lines(ctx, W, [['6→1, 3→6, 8→3, 5→8, 2→5, 7→2, 4→7', 13, '#fbbf24', true]], 296); } },
      { cap: '第 8 枚无处可走（4 号位已无路线）→ 最多 7 枚 ✓', fn: function (ctx, W, Hh) { var cx = W / 2, cy = Hh / 2, R = 100, k; for (k = 0; k < 8; k++) { var a = k * Math.PI / 4 - Math.PI / 2, px = cx + R * Math.cos(a), py = cy + R * Math.sin(a); H.circle(ctx, px, py, 12, '#273469', '#5eead4'); H.txt(ctx, String(k + 1), px, py, { size: 10, bold: true }); if (k !== 3) H.circle(ctx, px, py - 16, 6, '#fbbf24'); } H.circle(ctx, cx + R * Math.cos(3 * Math.PI / 4 - Math.PI / 2), cy + R * Math.sin(3 * Math.PI / 4 - Math.PI / 2), 17, null, '#f87171'); U.lines(ctx, W, [['答案：最多 7 枚 ✓', 15, '#4ade80', true]], 296); } }
    ] } });
/* 35 三个水壶 */
  D({ g: g, no: 35, title: '三个水壶', e: 'jugs', strat: '穷举·状态空间',
    plain: '8 升满壶、5 升和 3 升空壶，不许用别的量具，怎么分出两个 4 升？把"每个壶的水量"当作状态，广度优先搜索倒水方案。',
    p: { caps: [8, 5, 3], init: [8, 0, 0], goal: [4, 4, 0] } });

    /* 36 有限的差异 */
  D({ g: g, no: 36, title: '有限的差异', e: 'board', strat: '数学技巧·奇偶',
    plain: '用 +/− 填 n×n，要求每格恰好只有一个邻居符号相反：行两两成对交替填 ++/−−/++，n 为偶数有解、奇数无解。',
    p: { steps: [
      { cap: '要求：每格的上下左右邻居中，恰好 1 个与它符号相反', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['?', '?', '?', '?'], ['?', '?', '?', '?'], ['?', '?', '?', '?'], ['?', '?', '?', '?']], { max: 46 }); } },
      { cap: '观察：若整行同号，相反邻居只能出现在"行与行的边界"上', fn: function (ctx, W) { U.lines(ctx, W, [['整行同号 → 左右邻居必同号', 15, '#fbbf24', true], ['唯一相反邻居只能来自上下方向', 13, '#8fa0c8']], 110, 44); } },
      { cap: '构造：行两两成对——第 1、2 行填 +，第 3、4 行填 −，交替下去', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['+', '+', '+', '+'], ['+', '+', '+', '+'], ['−', '−', '−', '−'], ['−', '−', '−', '−']], { max: 46, txtColor: function (r) { return r < 2 ? '#5eead4' : '#f87171'; } }); } },
      { cap: '验证：每格唯一的相反邻居就在行对边界上 ✓', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, [['+', '+', '+', '+'], ['+', '+', '+', '+'], ['−', '−', '−', '−'], ['−', '−', '−', '−']], { max: 46, txtColor: function (r) { return r < 2 ? '#5eead4' : '#f87171'; } });
        H.line(ctx, gg.x0 - 8, gg.y0 + 2 * gg.cell, gg.x0 + 4 * gg.cell + 8, gg.y0 + 2 * gg.cell, '#fbbf24', 2.5);
        H.txt(ctx, '唯一相反邻居就在行对边界上', W / 2, gg.y0 + 4 * gg.cell + 18, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: 'n 为奇数时最后一行无法成对 → 无解；结论：当且仅当 n 为偶数 ✓', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, [['+', '+', '+', '+'], ['+', '+', '+', '+'], ['−', '−', '−', '−'], ['−', '−', '−', '−']], { max: 46, cellColor: function () { return '#1e3a34'; }, txtColor: function (r) { return r < 2 ? '#5eead4' : '#f87171'; } });
        H.txt(ctx, '答案：当且仅当 n 为偶数 ✓', W / 2, gg.y0 + 4 * gg.cell + 18, { size: 14, bold: true, color: '#4ade80' }); } }
    ] } });
  /* 37 2n 筹码问题 */
  D({ g: g, no: 37, title: '2n 筹码问题', e: 'board', strat: '构造·图论',
    plain: '在 n×n 上放 2n 枚筹码，同行/列/对角线都不超过 2：让每行每列恰好 2 枚，两行一组错开列号，任意 n>1 都有构造。',
    p: { steps: [
      { cap: '约束：同行、同列、同对角线的筹码数都 ≤ 2', fn: function (ctx, W) { U.lines(ctx, W, [['n×n 棋盘上放 2n 枚，三个方向都不得超 2', 15, '#5eead4', true]], 130); } },
      { cap: '思路：每行每列恰好放 2 枚 → 行和列的约束自动满足', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); } b[0][0] = '●'; b[1][0] = '●'; b[2][1] = '●'; b[3][1] = '●'; b[4][6] = '●'; b[5][6] = '●'; b[6][7] = '●'; b[7][7] = '●'; U.grid(ctx, W, Hh, b, { max: 38, checker: true, txtColor: function (r, c, v) { return v ? '#fbbf24' : ''; } }); } },
      { cap: '对角线也 ≤ 2：两行一组，列号取 1、8、2、7…错开不碰头', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); }
        b[0][0] = '●'; b[1][0] = '●'; b[2][1] = '●'; b[3][1] = '●'; b[4][6] = '●'; b[5][6] = '●'; b[6][7] = '●'; b[7][7] = '●';
        var gg = U.grid(ctx, W, Hh, b, { max: 38, checker: true, txtColor: function (r, c, v) { return v ? '#fbbf24' : ''; } });
        H.line(ctx, gg.x0 - 10, gg.y0 + 1, gg.x0 - 10, gg.y0 + 2 * gg.cell - 1, '#5eead4', 3); H.line(ctx, gg.x0 + 8 * gg.cell + 10, gg.y0 + 6 * gg.cell + 1, gg.x0 + 8 * gg.cell + 10, gg.y0 + 8 * gg.cell - 1, '#5eead4', 3);
        H.txt(ctx, '每行每列恰好 2 枚，对角线 ≤ 2', W / 2, gg.y0 + 8 * gg.cell + 16, { size: 13, bold: true, color: '#8fa0c8' }); } },
      { cap: '偶数 n = 2k：两行一组直接铺满；奇数 n：中列补 2 枚、左右对称', fn: function (ctx, W) { U.lines(ctx, W, [['偶数：两行一组直接构造', 15, '#8fa0c8'], ['奇数：中列补 2 枚 + 中心对称', 15, '#8fa0c8']], 110, 44); } },
      { cap: '任意 n>1 都有构造 → 2n 枚筹码就位 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); }
        b[0][0] = '●'; b[1][0] = '●'; b[2][1] = '●'; b[3][1] = '●'; b[4][6] = '●'; b[5][6] = '●'; b[6][7] = '●'; b[7][7] = '●';
        var gg = U.grid(ctx, W, Hh, b, { max: 38, checker: true, cellColor: function (rr2, cc, v) { return v ? '#1e3a34' : null; }, txtColor: function (r, c, v) { return v ? '#4ade80' : ''; } });
        H.txt(ctx, '任意 n>1 均有构造 → 2n 枚 ✓', W / 2, gg.y0 + 8 * gg.cell + 16, { size: 13, bold: true, color: '#4ade80' }); } }
    ] } });
  /* 38 四格骨牌平铺问题 */
  D({ g: g, no: 38, title: '四格骨牌平铺问题', e: 'board', strat: '构造·奇偶',
    plain: '同一种四格骨牌 16 张铺 8×8：直条/方形/L/T 四等分棋盘即可，Z 型角上卡死不行，15T+1方被黑白奇偶一票否决。',
    p: { steps: [
      { cap: '五类四格骨牌：直条、方形、L、T、Z，各 16 张铺 8×8', fn: function (ctx, W) { U.lines(ctx, W, [['问题：哪几种能平铺？哪几种不能？', 15, '#5eead4', true]], 130); } },
      { cap: '(a)~(d) 直条/方形/L/T：把棋盘四等分，每块 4×4 重复平铺 → 可以', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push((r < 4 && c < 4) || (r >= 4 && c >= 4) ? '▣' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function () { return '#5eead4'; } }); } },
      { cap: '(e) Z 型：角上放一块后，第一行剩两格谁也盖不住 → 不能', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push((r < 4 && c < 4) || (r >= 4 && c >= 4) ? '▣' : ''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function () { return '#5eead4'; }, cellColor: function (rr2, cc) { return rr2 < 2 && cc < 2 ? '#7f3030' : null; } });
        H.txt(ctx, 'Z 型角上放一块后剩 2 格无法盖 ✗', W / 2, gg.y0 + 8 * gg.cell + 16, { size: 13, bold: true, color: '#f87171' }); } },
      { cap: '(f) 奇偶论证：T 型盖奇数个深色格，15T + 1方形仍是奇数 ≠ 32 → 不能', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push((r + c) % 2 ? '▣' : ''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function () { return '#4ade80'; } });
        H.txt(ctx, '棋盘 32 个深色格；15×奇 + 偶 = 奇 ✗', W / 2, gg.y0 + 8 * gg.cell + 16, { size: 13, bold: true, color: '#f87171' }); } },
      { cap: '结论：(a)~(d) 可以 ✓；(e)(f) 不能 ✗', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push((r < 4 && c < 4) || (r >= 4 && c >= 4) ? '▣' : ''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 38, cellColor: function () { return '#1e3a34'; }, txtColor: function () { return '#4ade80'; } });
        H.txt(ctx, '(a)~(d) 可以；(e)(f) 不能 ✓', W / 2, gg.y0 + 8 * gg.cell + 16, { size: 13, bold: true, color: '#4ade80' }); } }
    ] } });
/* 39 方格遍历 */
  var g39N = [], g39E = [];
  for (var r39 = 0; r39 < 4; r39++) for (var c39 = 0; c39 < 4; c39++) g39N.push({ x: 0.14 + c39 * 0.24, y: 0.16 + r39 * 0.22, label: '' });
  for (r39 = 0; r39 < 4; r39++) for (c39 = 0; c39 < 4; c39++) {
    var id39 = r39 * 4 + c39;
    if (c39 < 3) g39E.push([id39, id39 + 1]);
    if (r39 < 3) g39E.push([id39, id39 + 4]);
  }
  D({ g: g, no: 39, title: '方格遍历', e: 'tour', strat: '回溯·哈密顿',
    plain: '从 4×4 网格的一格出发，每格恰好走一次能否遍历全部 16 格？这就是网格图上的哈密顿路径问题，回溯法一步步试。',
    p: { ham: true, start: 0, nodes: g39N, edges: g39E, endNote: '16 格全部走遍', cap: '回溯搜索网格哈密顿路径' } });

  /* 40 四个调换的骑士 */
  D({ g: g, no: 40, title: '四个调换的骑士', e: 'gridmove', strat: '图论·轮换',
    plain: '3×3 棋盘四角的骑士要黑白互换：两枚白骑士在底部两角、两枚黑骑士在顶部两角。骑士在 3×3 上只能沿一个 8 格循环跳，让每位骑士沿循环前进 4 站，16 跳完成调换。',
    p: { rows: 3, cols: 3, pieces: [
      { id: 'W1', label: '白', color: '#e2e8f0', r: 2, c: 0 }, { id: 'W2', label: '白', color: '#e2e8f0', r: 2, c: 2 },
      { id: 'B1', label: '黑', color: '#334155', r: 0, c: 0 }, { id: 'B2', label: '黑', color: '#334155', r: 0, c: 2 }],
      moves: guaMoves.map(function (m) { return { id: m.id, r: 2 - m.r, c: m.c }; }),
      cap: '沿 8 格循环各走 4 跳' } });

  /* 41 灯之圈 */
  D({ g: g, no: 41, title: '灯之圈', e: 'flip', strat: '数学技巧·奇偶',
    plain: '6 盏灯围成圈，按一个开关会翻转它自己和左右邻居。选对两个开关（1 号和 4 号），每盏灯恰好被翻一次，一次全亮。',
    p: { init: [0, 0, 0, 0, 0, 0], cols: 6,
      ops: [
        { at: [], cap: '每按一个开关，翻转自己和左右邻居' },
        { at: [5, 0, 1], cap: '按开关 1 → 灯 6、1、2 翻转' },
        { at: [2, 3, 4], cap: '按开关 4 → 灯 3、4、5 翻转 → 全亮 ✓' }
      ], cap: '每盏灯恰好被覆盖一次' } });

    /* 42 狼羊菜过河问题的另一个版本 */
  D({ g: g, no: 42, title: '狼羊菜过河问题的另一个版本', e: 'board', strat: '构造·模式',
    plain: '狼、羊、菜、猎人各 n 个排一列，避危险且同类不相邻：W 只能挨 C、G 只能挨 H，所以只有 WC…+HG… 及其镜像 2 种排法。',
    p: { steps: [
      { cap: '记号：W 狼、C 菜、G 羊、H 猎人；危险：W 挨 H、G 挨 W、C 挨 G', fn: function (ctx, W) { U.row(ctx, W, 110, ['W', 'C', 'G', 'H'], null, function (v) { return v === 'W' ? '#f87171' : v === 'C' ? '#4ade80' : v === 'G' ? '#fbbf24' : '#818cf8'; }); U.lines(ctx, W, [['同类筹码还不允许挨在一起', 13, '#8fa0c8']], 200); } },
      { cap: '推理 1：W 的邻居不能是 W/H/G → 只能是 C → 必成 WCWC… 段', fn: function (ctx, W) { U.row(ctx, W, 110, ['W', 'C', 'W', 'C', 'W', 'C']); U.lines(ctx, W, [['W 只能挨 C → WCWC… 段', 15, '#fbbf24', true]], 200); } },
      { cap: '推理 2：G 的邻居不能是 G/W/C → 只能是 H → 必成 GHGH… 段', fn: function (ctx, W) { U.row(ctx, W, 110, ['G', 'H', 'G', 'H', 'G', 'H']); U.lines(ctx, W, [['G 只能挨 H → GHGH… 段', 15, '#fbbf24', true]], 200); } },
      { cap: '两段拼接：WC…WCHG…HG（交界处 C 挨 H，安全）', fn: function (ctx, W) { U.row(ctx, W, 90, ['W', 'C', 'W', 'C', 'G', 'H', 'G', 'H'], null, function (v) { return v === 'W' ? '#f87171' : v === 'C' ? '#4ade80' : v === 'G' ? '#fbbf24' : '#818cf8'; }); } },
      { cap: '镜像对称的第二种：GH…GHCW…CW → 恰好 2 种 ✓', fn: function (ctx, W) { U.row(ctx, W, 90, ['G', 'H', 'G', 'H', 'W', 'C', 'W', 'C'], null, function (v) { return v === 'W' ? '#f87171' : v === 'C' ? '#4ade80' : v === 'G' ? '#fbbf24' : '#818cf8'; }); U.lines(ctx, W, [['对称的第 2 种排法 → 恰好 2 种 ✓', 15, '#4ade80', true]], 190); } }
    ] } });
  /* 43 数字填充 */
  D({ g: g, no: 43, title: '数字填充', e: 'board', strat: '变治·排序',
    plain: '把 n 个数填进不等号链：先排序，每轮看首个符号——> 就填最大、< 就填最小，删数减治，直到全填完。',
    p: { steps: [
      { cap: '示例：数字 {1,2,3,4}，不等式 _ > _ < _ > _', fn: function (ctx, W) { U.row(ctx, W, 120, ['?', '?', '?', '?']); U.lines(ctx, W, [['> < >', 18, '#5eead4', true]], 190); } },
      { cap: '第一步：数字升序排好；每轮只看第一个不等号', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 2, 3, 4], [0, 1, 2, 3]); U.lines(ctx, W, [['首符号是 > → 先填最大的数', 15, '#fbbf24', true]], 190); } },
      { cap: '首空是 > → 填最大 4，删掉它；剩下 1,2,3 面对 _ < _ > _', fn: function (ctx, W) { U.row(ctx, W, 120, ['4', '?', '?', '?'], [0]); U.lines(ctx, W, [['> 填最大：4 > 任何数都成立', 15, '#fbbf24', true]], 190); } },
      { cap: '首空是 < → 填最小 1；再 > → 填剩余最大 3；最后剩 2', fn: function (ctx, W) { U.row(ctx, W, 120, ['4', '1', '3', '?'], [1, 2]); U.lines(ctx, W, [['< 填最小、> 填最大，交替减治', 14, '#8fa0c8']], 190); } },
      { cap: '4 > 1 < 3 > 2 全部满足 ✓（排序 O(n log n) + 线性填数）', fn: function (ctx, W) { U.row(ctx, W, 120, ['4', '1', '3', '2'], [0, 1, 2, 3]); U.lines(ctx, W, [['4 > 1 < 3 > 2 满足所有不等式 ✓', 15, '#4ade80', true]], 190); } }
    ] } });
/* 44 孰轻孰重 */
  D({ g: g, no: 44, title: '孰轻孰重', e: 'weigh', strat: '减治·决策树',
    plain: '3 枚硬币里 1 枚假币，不知偏轻还是偏重，天平两次能揪出它并说明轻重吗？先 1 vs 2 定位，再拿真币当参照称一次。',
    p: { n: 3, title: '3 枚中找假币并判断轻重', steps: [
      { L: [1], R: [2], res: '=', note: '第 1 次：1 vs 2 平衡 → 假币是 3 号（且 1 号是真的）' },
      { L: [3], R: [1], res: '>', note: '第 2 次：3 vs 真币 1 → 3 号偏重 ✓' }
    ] } });

  /* 45 骑士的捷径 */
  D({ g: g, no: 45, title: '骑士的捷径', e: 'knight', strat: '穷举·BFS',
    plain: '骑士从棋盘一角跳到对角，最少跳几步？广度优先搜索像水波一样一圈圈扩散，第一次碰到目标时的圈数就是最短步数。',
    p: { n: 8, start: [0, 0], goal: [7, 7], cap: 'BFS 保证步数最少' } });

    /* 46 三色排列 */
  D({ g: g, no: 46, title: '三色排列', e: 'board', strat: '构造·归约',
    plain: '3×n 板上散着红白蓝各 n 枚，只许同行交换，让每列三色齐全：从左逐列整理，当前列换齐三色后锁定右推。',
    p: { steps: [
      { cap: '3×n 板：每格 1 枚筹码，目标每列红白蓝各一个', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['红', '蓝', '白'], ['白', '红', '蓝'], ['蓝', '白', '红']], { max: 52, txtColor: function (r, c, v) { return v === '红' ? '#dc2626' : v === '白' ? '#e2e8f0' : '#2563eb'; } }); } },
      { cap: '操作只许同行交换 → 每行的颜色多重集是不变量（幸好每行三色各有）', fn: function (ctx, W) { U.lines(ctx, W, [['同行交换：行的颜色集合不变', 15, '#fbbf24', true], ['可行性靠"每行三色各有"保证', 13, '#8fa0c8']], 110, 44); } },
      { cap: '逐列策略：当前列有同色重复时，把多余那枚与右侧同行缺色格互换', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, [['红', '蓝', '红'], ['白', '红', '蓝'], ['蓝', '白', '红']], { max: 52, txtColor: function (r, c, v) { return v === '红' ? '#dc2626' : v === '白' ? '#e2e8f0' : '#2563eb'; }, cellColor: function (rr2, cc) { return cc === 0 ? '#1e3a34' : null; } });
        H.line(ctx, gg.x0 + gg.cell - 4, gg.y0, gg.x0 + gg.cell - 4, gg.y0 + 3 * gg.cell, '#fbbf24', 2);
        H.txt(ctx, '整理第 1 列：同行换走多余颜色', W / 2, gg.y0 + 3 * gg.cell + 18, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '当前列三色齐全后锁定，向右推进下一列（锁定的列不再动）', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, [['红', '蓝', '白'], ['白', '红', '蓝'], ['蓝', '白', '红']], { max: 52, txtColor: function (r, c, v) { return v === '红' ? '#dc2626' : v === '白' ? '#e2e8f0' : '#2563eb'; }, cellColor: function (rr2, cc) { return cc === 0 ? '#1e3a34' : null; } });
        H.txt(ctx, '第 1 列已齐三色 → 锁定，向右推进', W / 2, gg.y0 + 3 * gg.cell + 18, { size: 13, bold: true, color: '#5eead4' }); } },
      { cap: '逐列推进到最后一列 → 每列三色齐全 ✓（算法总能完成）', fn: function (ctx, W, Hh) {
        U.grid(ctx, W, Hh, [['红', '白', '蓝'], ['白', '蓝', '红'], ['蓝', '红', '白']], { max: 52, cellColor: function () { return '#1e3a34'; }, txtColor: function (r, c, v) { return v === '红' ? '#dc2626' : v === '白' ? '#e2e8f0' : '#2563eb'; } });
        U.lines(ctx, W, [['每列三色齐全 ✓', 16, '#4ade80', true]], 280); } }
    ] } });
  /* 47 展览规划 */
  D({ g: g, no: 47, title: '展览规划', e: 'board', strat: '图论·哈密顿路径',
    plain: '4×4 展厅走一遍不回头：参观路线是哈密顿路径，16 室要 15 道内部门，再加入口、出口各 1，最少 17 扇门。',
    p: { steps: [
      { cap: '16 个房间（4×4），相邻房间有门；北边进、南边出', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push(''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true, max: 52 }); } },
      { cap: '"每室恰好参观一次"→ 路线是 16 顶点上的哈密顿路径', fn: function (ctx, W) { U.lines(ctx, W, [['哈密顿路径：每顶点恰经过一次', 15, '#5eead4', true]], 130); } },
      { cap: '哈密顿路径含 16 − 1 = 15 条边 → 15 道内部门（一进一出算两次）', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push(''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 52 });
        var i, xs = [];
        for (i = 0; i < 4; i++) xs.push(gg.x0 + (i % 2 === 0 ? i / 2 : (3 - (i - 1) / 2)) * gg.cell + gg.cell / 2);
        for (i = 0; i < 3; i++) H.line(ctx, xs[i], gg.y0 + i * gg.cell + gg.cell / 2, xs[i + 1], gg.y0 + (i + 1) * gg.cell + gg.cell / 2, '#fbbf24', 2);
        H.line(ctx, xs[3], gg.y0 + 3 * gg.cell + gg.cell / 2, gg.x0 + 3.5 * gg.cell, gg.y0 + 3 * gg.cell + gg.cell / 2, '#fbbf24', 2); } },
      { cap: '再加入口 1 扇 + 出口 1 扇：15 + 1 + 1 = 17，少一扇路线就断', fn: function (ctx, W) { U.lines(ctx, W, [['15 内部门 + 入口 + 出口', 15, '#8fa0c8'], ['= 17 扇门（下界）', 17, '#fbbf24', true]], 110, 44); } },
      { cap: '(b) 入口/出口位置：按棋盘黑白染色，路径两端必在异色角 → 可构造 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push(''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 52, cellColor: function () { return '#1e3a34'; } });
        H.txt(ctx, '15 道内部门 + 入口 + 出口 = 17 扇 ✓', W / 2, gg.y0 + 4 * gg.cell + 18, { size: 13, bold: true, color: '#4ade80' }); } }
    ] } });
  /* 48 麦乐鸡数字 */
  D({ g: g, no: 48, title: '麦乐鸡数字', e: 'board', strat: '数论·枚举',
    plain: '4、6、9、20 块装的鸡块能凑出哪些数？只有 1、2、3、5、7、11 凑不出；关键在 12~15 连续四个数都能凑，之后每次加一盒 4 块即可推进。',
    p: { steps: [
      { cap: '包装规格：4、6、9、20 块；麦乐鸡数 = 若干盒的块数和', fn: function (ctx, W) { U.row(ctx, W, 120, ['4块', '6块', '9块', '20块']); } },
      { cap: '逐个枚举 1~20：红色是凑不出的数', fn: function (ctx, W) {
        var i;
        for (i = 1; i <= 20; i++) {
          var bad = [1, 2, 3, 5, 7, 11].indexOf(i) >= 0;
          ctx.fillStyle = bad ? '#7f3030' : '#1e3a34'; H.rr(ctx, W / 2 - 205 + (i - 1) * 21, 110, 18, 18, 3); ctx.fill();
          H.txt(ctx, String(i), W / 2 - 205 + (i - 1) * 21 + 9, 119, { size: 9, bold: true, color: bad ? '#f87171' : '#e8ecf8' });
          if (bad) H.txt(ctx, '✗', W / 2 - 205 + (i - 1) * 21 + 9, 142, { size: 10, bold: true, color: '#f87171' });
        }
        U.lines(ctx, W, [['红 = 凑不出的 1, 2, 3, 5, 7, 11', 14, '#8fa0c8']], 200); } },
      { cap: '小数字查表：4=4、6=6、8=4+4、9=9、10=4+6、12=3×4、15=6+9…', fn: function (ctx, W) { U.lines(ctx, W, [['12、13、14、15 连续四个数都能凑出', 15, '#fbbf24', true]], 130); } },
      { cap: '关键：连续 4 个可凑数 → 之后每个数 = 前者 + 一盒 4 块，步步推进', fn: function (ctx, W) { U.lines(ctx, W, [['n > 15：n = (n−4) + 一盒4块', 16, '#fbbf24', true], ['归纳推进：≥ 12 的数全部可凑', 13, '#8fa0c8']], 110, 44); } },
      { cap: '(a) 非麦乐鸡数仅 1,2,3,5,7,11；(b) 递归减 4 即得订单 ✓', fn: function (ctx, W) {
        var i;
        for (i = 1; i <= 20; i++) {
          var bad = [1, 2, 3, 5, 7, 11].indexOf(i) >= 0;
          ctx.fillStyle = bad ? '#7f3030' : '#1e3a34'; H.rr(ctx, W / 2 - 205 + (i - 1) * 21, 110, 18, 18, 3); ctx.fill();
          H.txt(ctx, String(i), W / 2 - 205 + (i - 1) * 21 + 9, 119, { size: 9, bold: true, color: bad ? '#f87171' : '#e8ecf8' });
        }
        U.lines(ctx, W, [['≥ 12 全部可凑 ✓', 15, '#4ade80', true]], 200); } }
    ] } });
/* 49 传教士与食人族 */
  D({ g: g, no: 49, title: '传教士与食人族', e: 'river', strat: '穷举·状态空间',
    plain: '3 个传教士和 3 个食人族过河，船载 2 人。任何一岸只要食人族比传教士多，传教士就有危险。状态空间搜索找出 11 渡方案。',
    p: { items: [
      { id: 'M1', label: '传1', color: '#7dd3fc' }, { id: 'M2', label: '传2', color: '#7dd3fc' }, { id: 'M3', label: '传3', color: '#7dd3fc' },
      { id: 'C1', label: '食1', color: '#f87171' }, { id: 'C2', label: '食2', color: '#f87171' }, { id: 'C3', label: '食3', color: '#f87171' }],
      cap: 2, capText: '船载 2 人；食人族数不得超过该岸传教士数',
      valid: function (st) {
        function ok(s) { var m = 0; s.forEach(function (x) { if (x[0] === 'M') m++; }); return !(m > 0 && s.length - m > m); }
        return ok(st.L) && ok(st.R);
      } } });

  /* 50 最后一个球 */
  D({ g: g, no: 50, title: '最后一个球', e: 'board', strat: '博弈·倒推',
    plain: '10 个球轮流拿 1~2 个，拿最后一个赢：从终点倒推，谁面对 3 的倍数谁被动；先手拿 1 个，之后每轮与对手凑 3 稳赢。',
    p: { steps: [
      { cap: '10 个球，两人轮流拿 1~2 个，拿到最后一个者胜', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); } },
      { cap: '从终点倒推：剩 1~2 个时轮谁谁赢（一次拿完）', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2], [0, 1], function () { return '#1e3a34'; }); U.lines(ctx, W, [['剩 1 或 2 → 必胜局', 15, '#4ade80', true]], 205); } },
      { cap: '剩 3 个时轮谁谁输：拿 1 对方拿 2，拿 2 对方拿 1', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3], [0, 1, 2], function () { return '#7f3030'; }); U.lines(ctx, W, [['剩 3 → 必败局', 15, '#f87171', true]], 205); } },
      { cap: '继续倒推：6、9 同样是必败局（对手总能把你推回 3 的倍数）', fn: function (ctx, W) { U.row(ctx, W, 120, [9, 8, 7, 6, 5, 4, 3], [0, 3, 6], function (v, i2) { return [0, 3, 6].indexOf(i2) >= 0 ? '#7f3030' : null; }); } },
      { cap: '先手拿 1 个（剩 9），之后每轮凑 3：9 → 6 → 3 → 0 稳赢 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, [9, 8, 7, 6, 5, 4, 3, 2, 1], [0, 3, 6], function (v, i2) { return [0, 3, 6].indexOf(i2) >= 0 ? '#1e3a34' : null; }); U.lines(ctx, W, [['10 → 9 → 6 → 3 → 0：始终让对手面对 3 的倍数 ✓', 14, '#4ade80', true]], 205); } }
    ] } });

})();
