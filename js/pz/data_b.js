/* 谜题区 51-100（全覆盖） */
(function () {
  var H = PZ.H, U = PZ.U, D = PZ.def, g = 'c';

  function mk8(fn) { var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(fn(r, c)); b.push(row); } return b; }

  /* 51 缺失的数字 */
  D({ g: g, no: 51, title: '缺失的数字', e: 'board', strat: '数学技巧·求和',
    plain: '1~100 少了一个数，只许扫一遍：应有总和 5050 减去实际总和，差就是丢失的数，一次遍历、无需排序。',
    p: { steps: [
      { cap: '1~100 里丢了一个数，只许扫一遍就找出来', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, '…', '?', '…', 100]); } },
      { cap: '朴素做法：排序后逐个比对 → 又慢又费内存', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 2, 3, '…', '?', '…', 100]); U.lines(ctx, W, [['排序 + 扫描：O(n log n)，还要额外空间', 14, '#f87171', true]], 190); } },
      { cap: '关键观察：总和是不变量 → 1+2+…+100 = 100×101÷2 = 5050', fn: function (ctx, W) { U.lines(ctx, W, [['高斯求和：100 × 101 ÷ 2 = 5050', 16, '#fbbf24', true], ['只需一遍累加，O(n) 时间、O(1) 空间', 13, '#8fa0c8']], 120, 46); } },
      { cap: '扫一遍累加得实际总和 5008', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 2, 3, '…', '?', '…', 100]); U.lines(ctx, W, [['实际总和 = 5008', 16, '#5eead4', true]], 190); } },
      { cap: '差值 5050 − 5008 = 42 → 丢失的就是 42 ✓', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 2, 3, '…', 42, '…', 100], [4], function (v) { return v === 42 ? '#4a3a12' : null; }); U.lines(ctx, W, [['5050 − 5008 = 42 ✓', 17, '#4ade80', true]], 190); } }
    ] } });

    /* 52 数三角形 */
  D({ g: g, no: 52, title: '数三角形', e: 'board', strat: '数学技巧·递推',
    plain: '每轮在大三角形外围添一圈小三角形：第 n 轮新增 3(n−1) 个，累加得 T(n) = 1 + 3n(n−1)/2 个。',
    p: { steps: [
      { cap: '第 1 次迭代：中心 1 个 + 外围 3 个 = 4 个三角形', fn: function (ctx, W) {
        var cx = W / 2, y0 = 70, h = 90;
        H.line(ctx, cx, y0, cx - 52, y0 + h, '#5eead4', 2); H.line(ctx, cx, y0, cx + 52, y0 + h, '#5eead4', 2); H.line(ctx, cx - 52, y0 + h, cx + 52, y0 + h, '#5eead4', 2);
        H.line(ctx, cx, y0 + 2 * h, cx - 104, y0 + h, '#fbbf24', 1.5); H.line(ctx, cx, y0 + 2 * h, cx + 104, y0 + h, '#fbbf24', 1.5); H.line(ctx, cx - 104, y0 + h, cx + 104, y0 + h, '#fbbf24', 1.5); H.line(ctx, cx - 52, y0, cx - 104, y0 + h, '#fbbf24', 1.5); H.line(ctx, cx + 52, y0, cx + 104, y0 + h, '#fbbf24', 1.5);
        U.lines(ctx, W, [['T(1) = 1 + 3 = 4（金色为新增）', 14, '#5eead4', true]], 280); } },
      { cap: '第 n 次迭代新增 3(n−1) 个：T(n) = T(n−1) + 3(n−1)', fn: function (ctx, W) {
        var cx = W / 2, y0 = 60, h = 60;
        H.line(ctx, cx, y0, cx - 104, y0 + 2 * h, '#5eead4', 2); H.line(ctx, cx, y0, cx + 104, y0 + 2 * h, '#5eead4', 2); H.line(ctx, cx - 104, y0 + 2 * h, cx + 104, y0 + 2 * h, '#5eead4', 2);
        var i; for (i = -1; i <= 1; i += 2) { H.line(ctx, cx + i * 52, y0 + h, cx + i * 156, y0 + 2 * h, '#fbbf24', 1.5); }
        H.line(ctx, cx - 156, y0 + 2 * h, cx + 156, y0 + 2 * h, '#fbbf24', 1.5); H.line(ctx, cx - 52, y0 + 2 * h, cx, y0 + h, '#fbbf24', 1.5); H.line(ctx, cx + 52, y0 + 2 * h, cx, y0 + h, '#fbbf24', 1.5);
        U.lines(ctx, W, [['T(2) = 4 + 6 = 10；T(3) = 10 + 9 = 19', 14, '#fbbf24', true]], 280); } },
      { cap: '通项：T(n) = 1 + 3(1+2+…+(n−1)) = 1 + 3n(n−1)/2 ✓', fn: function (ctx, W) {
        var cx = W / 2, y0 = 70, h = 90;
        H.line(ctx, cx, y0, cx - 52, y0 + h, '#5eead4', 2); H.line(ctx, cx, y0, cx + 52, y0 + h, '#5eead4', 2); H.line(ctx, cx - 52, y0 + h, cx + 52, y0 + h, '#5eead4', 2);
        U.lines(ctx, W, [['答案：1 + 3n(n−1)/2 个 ✓', 16, '#4ade80', true]], 280); } }
    ] } });
/* 53 弹簧秤甄别假币 */
  D({ g: g, no: 53, title: '弹簧秤甄别假币', e: 'board', strat: '减治·二分',
    plain: '弹簧秤能给精确读数：每次称一半，读数吻合"全真"就排除这半，否则假币在这半。嫌疑范围逐次减半，⌈log₂n⌉ 次定位。',
    p: { steps: [
      { cap: 'n = 8 枚硬币，1 枚假币（重量 ≠ g）。每次称量把嫌疑范围减半', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5, 6, 7, 8]); U.lines(ctx, W, [['8 枚 → ⌈log₂8⌉ = 3 次足够', 13, '#8fa0c8']], 200); } },
      { cap: '第 1 次：称 1~4 号。读数 = 4g（全真）→ 假币在 5~8 号', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 2, 3, 4], [0, 1, 2, 3]); U.row(ctx, W, 170, [5, 6, 7, 8]); U.lines(ctx, W, [['读数 = 4g → 排除左半', 14, '#fbbf24', true]], 240); } },
      { cap: '第 2 次：称 5~6 号。读数 ≠ 2g → 假币在 5、6 号中', fn: function (ctx, W) { U.row(ctx, W, 100, [5, 6], [0, 1]); U.row(ctx, W, 170, [7, 8]); U.lines(ctx, W, [['读数 ≠ 2g → 假币在 5、6 中', 14, '#fbbf24', true]], 240); } },
      { cap: '第 3 次：称 5 号。读数 ≠ g → 5 号是假币 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, [5], [0]); U.lines(ctx, W, [['读数 ≠ g → 假币 = 5 号', 16, '#4ade80', true], ['最少次数 = ⌈log₂n⌉', 14, '#8fa0c8']], 190, 36); } }
    ] } });

    /* 54 矩形切割 */
  D({ g: g, no: 54, title: '矩形切割', e: 'board', strat: '分治·叠切',
    plain: 'm×n 纸板沿格线裁成 1×1 小块，允许叠起来一刀切透多层：宽度对半叠切 ⌈log₂m⌉ 次、高度再切 ⌈log₂n⌉ 次即达最优。',
    p: { steps: [
      { cap: '8×8 纸板要裁成 64 个 1×1；规则：叠起来一刀只算一次', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, mk8(function () { return ''; }), { checker: true, max: 38 }); } },
      { cap: '不许叠切的话：竖 7 刀 + 横 7 刀 = 14 刀，太浪费', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, mk8(function () { return ''; }), { checker: true, max: 38 });
        for (var k = 1; k < 8; k++) H.line(ctx, gg.x0 + k * gg.cell, gg.y0 - 4, gg.x0 + k * gg.cell, gg.y0 + 8 * gg.cell + 4, '#f87171', 1);
        U.lines(ctx, W, [['逐条切：7 + 7 = 14 刀', 14, '#f87171', true]], gg.y0 + 8 * gg.cell + 26); } },
      { cap: '关键：对半叠切，一刀让所有层同时减半 → 宽度 8 只需 3 刀', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, mk8(function () { return ''; }), { checker: true, max: 38 });
        H.line(ctx, gg.x0 + 4 * gg.cell, gg.y0 - 6, gg.x0 + 4 * gg.cell, gg.y0 + 8 * gg.cell + 6, '#fbbf24', 2.5);
        U.lines(ctx, W, [['8 → 4 → 2 → 1：⌈log₂8⌉ = 3 刀', 14, '#fbbf24', true]], gg.y0 + 8 * gg.cell + 26); } },
      { cap: '竖切 3 刀成 8 条，摞起来横切 3 刀 → 共 6 刀', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, mk8(function () { return ''; }), { checker: true, max: 38 });
        for (var k = 1; k < 8; k++) H.line(ctx, gg.x0 + k * gg.cell, gg.y0 - 4, gg.x0 + k * gg.cell, gg.y0 + 8 * gg.cell + 4, '#f87171', 1.5);
        U.lines(ctx, W, [['3 + 3 = 6 刀完成 64 块', 14, '#8fa0c8']], gg.y0 + 8 * gg.cell + 26); } },
      { cap: '一般结论：最少 ⌈log₂m⌉ + ⌈log₂n⌉ 刀（宽度、高度各自对半叠切）✓', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, mk8(function () { return ''; }), { checker: true, max: 38, cellColor: function () { return '#1e3a34'; } });
        U.lines(ctx, W, [['答案：⌈log₂m⌉ + ⌈log₂n⌉ 刀 ✓', 15, '#4ade80', true]], gg.y0 + 8 * gg.cell + 26); } }
    ] } });
  /* 55 里程表之谜 */
  D({ g: g, no: 55, title: '里程表之谜', e: 'board', strat: '数学技巧·计数',
    plain: '里程表跑遍 000000~999999：含 1 的里程数用反面计数 = 10⁶ − 9⁶；数字 1 共显示 6×10⁵ 次——每个数位上 0~9 均匀轮转。',
    p: { steps: [
      { cap: '里程表跑遍 000000~999999，共 10⁶ 个读数', fn: function (ctx, W) { U.word(ctx, W, 110, ['0', '0', '0', '0', '0', '0']); U.lines(ctx, W, [['六位读数共 10⁶ 个', 14, '#5eead4', true]], 200); } },
      { cap: '问一：多少读数至少含一个 1？正面数太难 → 反过来数"不含 1"', fn: function (ctx, W) { U.word(ctx, W, 110, ['0', '0', '0', '0', '1', '1'], [4, 5]); U.lines(ctx, W, [['反面计数：全部 − 不含 1 的', 14, '#fbbf24', true]], 200); } },
      { cap: '不含 1：每个数位只有 9 种选择 → 共 9⁶ 个', fn: function (ctx, W) { U.word(ctx, W, 90, ['0', '0', '0', '0', '0', '9'], null, function () { return '#273469'; }); U.lines(ctx, W, [['9 × 9 × … × 9 = 9⁶', 15, '#8fa0c8']], 180); } },
      { cap: '含 1 的读数 = 10⁶ − 9⁶ = 468,559', fn: function (ctx, W) { U.word(ctx, W, 110, ['4', '6', '8', '5', '5', '9'], null, function () { return '#4a3a12'; }); U.lines(ctx, W, [['10⁶ − 9⁶ = 468,559', 15, '#fbbf24', true]], 200); } },
      { cap: '问二：1 共显示几次？每数位 0~9 均分 → 6 × 10⁵ = 600,000 次 ✓', fn: function (ctx, W) { U.word(ctx, W, 90, ['1', '2', '3', '4', '5', '6'], null, function (ch, i2) { return ['#f87171', '#fbbf24', '#4ade80', '#7dd3fc', '#818cf8', '#5eead4'][i2]; }); U.lines(ctx, W, [['每数位 1 出现 10⁵ 次 × 6 位 = 600,000 ✓', 14, '#4ade80', true]], 190); } }
    ] } });

  /* 56 新兵列队 */
  D({ g: g, no: 56, title: '新兵列队', e: 'arrange', strat: '选择排序',
    plain: '新兵按身高从左到右站好，每次只能让两个人交换位置。选择排序思路：每次找出最矮的，换到队伍最左边。',
    p: { init: [5, 3, 1, 4, 2],
      colorOf: function (v) { return ['#273469', '#2b3a6e', '#33478a', '#3b55a6', '#4463c2'][v - 1]; },
      ops: [
        { t: 'swap', i: 0, j: 2, hl: [0, 2], cap: '最矮的 1 换到第 1 位' },
        { t: 'swap', i: 1, j: 4, hl: [1, 4], cap: '剩下的最矮 2 换到第 2 位' },
        { t: 'swap', i: 2, j: 3, hl: [2, 3], cap: '3 归位，4、5 已有序 → 完成 ✓' }
      ], cap: '身高从矮到高' } });

  /* 57 斐波那契的兔子问题 */
  D({ g: g, no: 57, title: '斐波那契的兔子问题', e: 'board', strat: '递推',
    plain: '一对兔子每月生一对新兔子，新兔子满两个月也开始生。第 n 月的对数 = 前两月之和：1,1,2,3,5,8,13…这就是斐波那契数列。',
    p: { steps: [
      { cap: '第 1 月：刚抱来 1 对小兔子', fn: function (ctx, W) { U.row(ctx, W, 120, ['月1：1 对']); } },
      { cap: '规则：每对免子每月生 1 对，新生的满两个月后也开始生', fn: function (ctx, W) { U.row(ctx, W, 100, ['老免', '→', '生 1 对', '→', '满 2 月再生']); U.lines(ctx, W, [['新免子不是当月就能生：要“成熟”两个月', 13, '#8fa0c8']], 190); } },
      { cap: '第 2 月仍 1 对；第 3 月老免生新对 → 2 对', fn: function (ctx, W) { U.row(ctx, W, 120, ['月1: 1', '月2: 1', '月3: 2'], [2]); } },
      { cap: '递推：每月对数 = 上月 + 上上月（新生的恰好是两个月前的总数）', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 1, 2, 3, 5, 8]); U.lines(ctx, W, [['F(n) = F(n−1) + F(n−2)', 16, '#fbbf24', true]], 190); } },
      { cap: '1, 1, 2, 3, 5, 8, 13, 21… 斐波那契数列，相邻之比趋近黄金比例 ✓', fn: function (ctx, W) { U.row(ctx, W, 100, [8, 13, 21, 34, 55, 89], null, function () { return '#1e3a34'; }); U.lines(ctx, W, [['55 ÷ 34 ≈ 1.618 → 黄金比例 ✓', 14, '#4ade80', true]], 190); } }
    ] } });

  /* 58 二维排序 */
  D({ g: g, no: 58, title: '二维排序', e: 'board', strat: '迭代改进',
    plain: '把矩阵变有序：先排每一行，再排每一列，反复来回。每轮"逆序"都在减少，几轮之后行列全部有序。',
    p: { steps: [
      { cap: '初始矩阵：行乱、列也乱', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['9', '2', '7'], ['4', '8', '1'], ['6', '3', '5']], { max: 56 }); } },
      { cap: '第 1 轮：先把每一行排成升序', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['2', '7', '9'], ['1', '4', '8'], ['3', '5', '6']], { max: 56 }); } },
      { cap: '再把每一列排成升序（列内交换不破坏行序？看看结果）', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '4', '6'], ['2', '5', '8'], ['3', '7', '9']], { max: 56 }); } },
      { cap: '验证：排完列后，每一行仍然是升序 → 无需再来一轮', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '4', '6'], ['2', '5', '8'], ['3', '7', '9']], { max: 56, cellColor: function () { return '#1e3a34'; } }); } },
      { cap: '行列同时有序 → 收敛 ✓（每轮逆序数单调下降，必终止）', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '4', '6'], ['2', '5', '8'], ['3', '7', '9']], { max: 56, cellColor: function () { return '#1e3a34'; }, txtColor: function () { return '#4ade80'; } }); } }
    ] } });

    /* 59 双色帽子 */
  D({ g: g, no: 59, title: '双色帽子', e: 'board', strat: '逻辑推理·公共知识',
    plain: '12 名囚犯戴黑/白帽（各色至少一顶），只能看别人的帽。无人出列的沉默本身就是信息：k 顶黑帽时，前 k−1 次无人出列，第 k 次所有黑帽同时出列。',
    p: { steps: [
      { cap: '12 人戴帽（黑/白，至少各一顶），只能看别人的帽子，不能交流', fn: function (ctx, W) { U.people(ctx, W, 130, ['囚1', '囚2', '囚3', '囚4', '囚5', '囚6']); U.people(ctx, W, 190, ['囚7', '囚8', '囚9', '囚10', '囚11', '囚12']); } },
      { cap: '底线：只有 1 顶黑帽 → 那人看到 11 顶白帽，立刻知道自己是黑', fn: function (ctx, W) { U.people(ctx, W, 110, ['囚1', '囚2', '囚3', '囚4', '囚5', '囚6'], [{ out: 1 }, {}, {}, {}, {}, {}]); U.people(ctx, W, 170, ['囚7', '囚8', '囚9', '囚10', '囚11', '囚12']); U.lines(ctx, W, [['看到全白 → 自己必黑，第 1 次列队即出列', 13, '#fbbf24', true]], 240); } },
      { cap: '若 2 顶黑帽：各自只看到 1 顶黑，等对方先出列 → 第 1 次无人动', fn: function (ctx, W) { U.people(ctx, W, 110, ['囚1', '囚2', '囚3', '囚4', '囚5', '囚6'], [{ tag: '黑' }, { tag: '黑' }, {}, {}, {}, {}]); U.people(ctx, W, 170, ['囚7', '囚8', '囚9', '囚10', '囚11', '囚12']); U.lines(ctx, W, [['沉默 = “黑帽不止 1 顶”，两人同时推理出真相', 13, '#8fa0c8']], 240); } },
      { cap: '归纳：前 k−1 次无人出列 → 每个黑帽者都看到 k−1 顶黑帽', fn: function (ctx, W) { U.people(ctx, W, 110, ['囚1', '囚2', '囚3', '囚4', '囚5', '囚6'], [{ tag: '黑' }, {}, {}, { tag: '黑' }, {}, {}]); U.people(ctx, W, 170, ['囚7', '囚8', '囚9', '囚10', '囚11', '囚12'], [{}, { tag: '黑' }, {}, {}, {}, {}]); U.lines(ctx, W, [['沉默即信息：黑帽数 ≥ 当前轮次 + 1', 13, '#fbbf24', true]], 240); } },
      { cap: '第 k 次列队：所有黑帽者同时向前出列 ✓', fn: function (ctx, W) { U.people(ctx, W, 110, ['囚1', '囚2', '囚3', '囚4', '囚5', '囚6'], [{ out: 1 }, {}, {}, { out: 1 }, {}, {}]); U.people(ctx, W, 170, ['囚7', '囚8', '囚9', '囚10', '囚11', '囚12'], [{}, { out: 1 }, {}, {}, {}, {}]); U.lines(ctx, W, [['k 顶黑帽 → 第 k 次全部同时出列 ✓', 13, '#4ade80', true]], 240); } }
    ] } });
  /* 60 硬币三角形变正方形 */
  D({ g: g, no: 60, title: '硬币三角形变正方形', e: 'board', strat: '数学技巧·计数',
    plain: '各行 1、3、…、2n−1 枚硬币的三角形共 n² 枚，正好排成 n×n 正方形：从最长的行移硬币补最短的行，最少移 ⌊n/2⌋·⌈n/2⌉ 枚。',
    p: { steps: [
      { cap: '硬币总数 = 1+3+…+(2n−1) = n²，恰好排成 n×n 正方形', fn: function (ctx, W) {
        var cy = 90, row;
        for (row = 0; row < 4; row++) { var cnt = 2 * row + 1, gap = 24, x0 = W / 2 - (cnt - 1) * gap / 2; for (var i = 0; i < cnt; i++) H.circle(ctx, x0 + i * gap, cy + row * 24, 8, '#fbbf24'); }
        U.lines(ctx, W, [['逐行 +2：奇数枚一排', 13, '#8fa0c8']], 230); } },
      { cap: '总数 = 1+3+5+7 = 16 = 4²，恰好能排成 4×4 正方形', fn: function (ctx, W) { U.lines(ctx, W, [['1+3+…+(2n−1) = n²：奇数和恒为平方数', 14, '#5eead4', true], ['目标：不动总数，重排成 n×n', 13, '#8fa0c8']], 120, 40); } },
      { cap: '对比每行枚数：三角形 1,3,5,7 → 正方形 4,4,4,4', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 3, 5, 7], null, function (v) { return +v > 4 ? '#7f3030' : +v < 4 ? '#4a3a12' : null; }); U.lines(ctx, W, [['↓ 长行多出、短行欠缺', 13, '#8fa0c8']], 150); U.row(ctx, W, 200, [4, 4, 4, 4]); } },
      { cap: '从最长的行移出、补到最短的行 → 需移 ⌊n/2⌋·⌈n/2⌉ 枚', fn: function (ctx, W) {
        var r, c, cell = 24, x0 = W / 2 - 2 * cell, y0 = 70;
        for (r = 0; r < 4; r++) for (c = 0; c < 4; c++) { var mv = (r === 0 && c >= 1) || (r === 1 && c === 3); H.circle(ctx, x0 + c * cell + cell / 2, y0 + r * cell + cell / 2, 8, mv ? '#f87171' : '#fbbf24'); }
        U.lines(ctx, W, [['红 = 需移动的 ⌊n/2⌋·⌈n/2⌉ = 4 枚', 14, '#fbbf24', true]], 230); } },
      { cap: '答案：最少移动 ⌊n/2⌋⌈n/2⌉ 枚；不同正方形个数随 n 的奇偶而定 ✓', fn: function (ctx, W) {
        var r, c, cell = 24, x0 = W / 2 - 2 * cell, y0 = 70;
        for (r = 0; r < 4; r++) for (c = 0; c < 4; c++) H.circle(ctx, x0 + c * cell + cell / 2, y0 + r * cell + cell / 2, 8, '#fbbf24');
        U.lines(ctx, W, [['答案：最少移动 ⌊n/2⌋·⌈n/2⌉ 枚 ✓', 15, '#4ade80', true]], 230); } }
    ] } });
  /* 61 对角线上的棋子 */
  D({ g: g, no: 61, title: '对角线上的棋子', e: 'board', strat: '不变量·奇偶',
    plain: '主对角线上 n 枚棋子要全部下移到底边：每次选两枚同时下移一格。总距离 (n−1)n/2 必为偶数才有解，需 (n−1)n/4 次。',
    p: { steps: [
      { cap: 'n×n 棋盘，主对角线各格一枚棋子；目标：全部到达底边', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(r === c ? '●' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function () { return '#fbbf24'; } }); } },
      { cap: '规则：每次选任意两枚，同时向下移一格（不许出界）', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(''); b.push(row); }
        b[0][0] = '●'; b[2][2] = '●'; b[3][3] = '●'; b[5][4] = '●'; b[5][5] = '●';
        U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function () { return '#fbbf24'; } }); } },
      { cap: '不变量：每枚棋子到底边的距离之和，每次恰好减少 2', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(r === c ? '●' : ''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function () { return '#fbbf24'; } });
        H.txt(ctx, '总距离 = 0+1+…+(n−1) = (n−1)n/2，每步 −2', W / 2, gg.y0 + 6 * gg.cell + 16, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '总距离必须是偶数才可能减到 0 → n−1 或 n 是 4 的倍数才有解', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(r === c ? '●' : ''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function () { return '#f87171'; } });
        H.txt(ctx, '总距离为奇 → 永远差 1，无解', W / 2, gg.y0 + 6 * gg.cell + 16, { size: 13, bold: true, color: '#f87171' }); } },
      { cap: '有解时次数 = 总距离 ÷ 2 = (n−1)n/4 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(r === 5 ? '●' : ''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, max: 38, txtColor: function () { return '#4ade80'; }, cellColor: function (rr2) { return rr2 === 5 ? '#1e3a34' : null; } });
        H.txt(ctx, '全部到底边 → 移动 (n−1)n/4 次 ✓', W / 2, gg.y0 + 6 * gg.cell + 16, { size: 13, bold: true, color: '#4ade80' }); } }
    ] } });
/* 62 硬币收集 */
  D({ g: g, no: 62, title: '硬币收集', e: 'griddp', strat: '动态规划',
    plain: '机器人从左上走到右下收集金币，只许向右或向下。动态规划：每格记"到这里最多能收几枚 = 本格金币 + max(上方, 左方)"。',
    p: { rows: 5, cols: 5, mode: 'max', coins: true,
      val: function (r, c) { return ((r * 3 + c) % 4 === 0) ? 1 : 0; } } });

  /* 63 加减归零 */
  D({ g: g, no: 63, title: '加减归零', e: 'board', strat: '奇偶/不变量',
    plain: '给 1~n 配 +/− 号使代数和为 0：总和必须为偶数才能对半，恰好当 n ≡ 0 或 3 (mod 4)，且构造总存在。',
    p: { steps: [
      { cap: '问题：给 1~n 逐个配 +/− 号，让代数和恰好为 0，哪些 n 可行？', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, '…', 'n']); } },
      { cap: '必要条件：总和 S = n(n+1)/2 必须是偶数，才能平分成相等的两半', fn: function (ctx, W) { U.lines(ctx, W, [['+ 的一组 = − 的一组 = S/2', 15, '#8fa0c8'], ['S 为奇 → 无法对半 → 直接无解', 14, '#f87171', true]], 110, 44); } },
      { cap: 'S 为偶 ⇔ n ≡ 0 或 3 (mod 4)：n=4 和 3 是最小的两个可行者', fn: function (ctx, W) { U.row(ctx, W, 100, ['n=3: 1+2−3=0', 'n=4: 1−2−3+4=0'], null, function () { return '#1e3a34'; }); U.lines(ctx, W, [['n ≡ 1, 2 (mod 4) → S 为奇 → 无解', 14, '#f87171', true]], 190); } },
      { cap: '充分性：n=8 → S=36，取 3+7+8 = 18 那组变负号 → 和为 0', fn: function (ctx, W) { U.row(ctx, W, 90, [1, 2, 3, 4, 5, 6, 7, 8], [2, 6, 7], function (v, i2) { return [2, 6, 7].indexOf(i2) >= 0 ? '#7f3030' : '#1e3a34'; }); U.lines(ctx, W, [['红组取负：(1+2+4+5+6) − (3+7+8) = 18−18 = 0', 13, '#fbbf24', true]], 180); } },
      { cap: '答案：当且仅当 n ≡ 0 或 3 (mod 4) 时有解 ✓', fn: function (ctx, W) { U.row(ctx, W, 100, ['n = 3,4,7,8,11,12 …']); U.lines(ctx, W, [['充要条件：n ≡ 0 或 3 (mod 4) ✓', 16, '#4ade80', true]], 180); } }
    ] } });

  /* 64 构建八边形 */
  D({ g: g, no: 64, title: '构建八边形', e: 'geo', strat: '几何构造',
    plain: '从正方形得到正八边形：四角各切一个等腰直角三角形，切口取 x = s/(2+√2)，八条边就一样长了。',
    p: { steps: [
      { cap: '从边长 s 的正方形出发，目标：八条边等长、八角相等', fn: function (ctx, W) { ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - 95, 70, 190, 190); H.txt(ctx, '边长 s', W / 2, 275, { size: 13, bold: true, color: '#5eead4' }); } },
      { cap: '四角各切一个等腰直角三角形，切口直角边长记为 x', fn: function (ctx, W) {
        var x0 = W / 2 - 95, y0 = 70, s = 190, t = 56;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, s, s);
        H.line(ctx, x0 + t, y0, x0, y0 + t, '#f87171', 2); H.line(ctx, x0 + s - t, y0, x0 + s, y0 + t, '#f87171', 2);
        H.line(ctx, x0, y0 + s - t, x0 + t, y0 + s, '#f87171', 2); H.line(ctx, x0 + s - t, y0 + s, x0 + s, y0 + s - t, '#f87171', 2);
        H.txt(ctx, '切口直角边 = x', W / 2, 275, { size: 13, bold: true, color: '#f87171' }); } },
      { cap: '关键方程：斜切边 x√2 要等于剩下的直边 s−2x', fn: function (ctx, W) {
        var x0 = W / 2 - 95, y0 = 70, s = 190, t = 56;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, s, s);
        H.line(ctx, x0 + t, y0, x0, y0 + t, '#fbbf24', 2.5);
        H.txt(ctx, 'x√2 = s − 2x → x = s/(2+√2)', W / 2, 275, { size: 14, bold: true, color: '#fbbf24' }); } },
      { cap: '切完即正八边形：4 条斜边 + 4 条直边全部等长', fn: function (ctx, W) {
        var x0 = W / 2 - 95, y0 = 70, s = 190, t = 56;
        ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2.5; ctx.beginPath();
        ctx.moveTo(x0 + t, y0); ctx.lineTo(x0 + s - t, y0); ctx.lineTo(x0 + s, y0 + t); ctx.lineTo(x0 + s, y0 + s - t);
        ctx.lineTo(x0 + s - t, y0 + s); ctx.lineTo(x0 + t, y0 + s); ctx.lineTo(x0, y0 + s - t); ctx.lineTo(x0, y0 + t);
        ctx.closePath(); ctx.stroke();
        H.txt(ctx, '8 边等长、8 角皆 135° ✓', W / 2, 275, { size: 13, bold: true, color: '#4ade80' }); } }
    ] } });

  /* 65 猜密码 */
  D({ g: g, no: 65, title: '猜密码', e: 'board', strat: '减治·逐位',
    plain: '三位密码锁逐位破解：固定其余两位只转一位，每位最多 10 次，总共最多 30 次开锁，远好于从 000 试到 999。',
    p: { steps: [
      { cap: '三位密码 ???，转轮会给"这位对不对"的反馈', fn: function (ctx, W) { U.row(ctx, W, 120, ['?', '?', '?']); } },
      { cap: '笨办法：000~999 逐个试 → 最多 1000 次', fn: function (ctx, W) { U.row(ctx, W, 100, ['000', '001', '…', '999']); U.lines(ctx, W, [['全枚举：最坏 1000 次', 14, '#f87171', true]], 190); } },
      { cap: '关键：逐位独立破解 → 先固定后两位，只转第一位', fn: function (ctx, W) { U.row(ctx, W, 110, ['?', '0', '0'], [0]); U.lines(ctx, W, [['最多试 10 次定下第 1 位', 14, '#fbbf24', true]], 190); } },
      { cap: '同理：第二位、第三位也各自最多 10 次', fn: function (ctx, W) { U.row(ctx, W, 120, ['7', '?', '0'], [0, 1]); U.lines(ctx, W, [['每一位互不干扰，问题规模 ÷10', 13, '#8fa0c8']], 200); } },
      { cap: '总共最多 10+10+10 = 30 次开锁 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, ['7', '2', '9'], [0, 1, 2]); U.lines(ctx, W, [['30 次 ≪ 1000 次 ✓（减治：逐位击破）', 15, '#4ade80', true]], 200); } }
    ] } });

  /* 66 留下的数字 */
  D({ g: g, no: 66, title: '留下的数字', e: 'board', strat: '奇偶/不变量',
    plain: '黑板上写着 1~100，每次擦掉两个数、写上它们的差。最后剩下的数是奇是偶？总和的奇偶性是不变量：5050 为偶，最后剩下的必是偶数。',
    p: { steps: [
      { cap: '1~100 写在黑板：每次擦掉两个数、写上它们的差', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, '…', 100]); } },
      { cap: '观察一步：擦 a、b 写 |a−b|，总和变化 = a+b−|a−b| = 2·min(a,b)', fn: function (ctx, W) { U.row(ctx, W, 90, [1, 2, 3, '…', 98, 99, 100], [0, 1], function (v) { return v === 1 || v === 2 ? '#4a3a12' : null; }); U.row(ctx, W, 160, [1, 3, '…', 98, 99, 100], [0], function (v) { return v === 1 ? '#4a3a12' : null; }); U.lines(ctx, W, [['擦 1、2 写 1：总和减少 2', 14, '#8fa0c8']], 240); } },
      { cap: '不变量：总和变化恒为偶数 → 总和的奇偶性永不改变', fn: function (ctx, W) { U.lines(ctx, W, [['初始总和 1+2+…+100 = 5050（偶）', 15, '#fbbf24', true], ['无论怎么擦，总和始终为偶', 13, '#8fa0c8']], 120, 44); } },
      { cap: '最后只剩一个数：它本身就是"总和" → 必为偶数 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, ['偶'], [0], function () { return '#1e3a34'; }); U.lines(ctx, W, [['与 5050 同奇偶 → 必为偶数 ✓', 15, '#4ade80', true]], 210); } }
    ] } });

  /* 67 均分减少 */
  D({ g: g, no: 67, title: '均分减少', e: 'board', strat: '数学技巧·平均数',
    plain: '擦掉一个数后平均数怎么变？擦掉比平均大的数平均下降、擦掉小的上升——平均数总被"拉向"留下的一侧。',
    p: { steps: [
      { cap: '1~10 的平均数 = 55 ÷ 10 = 5.5', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); } },
      { cap: '擦掉 10（比平均大）：新平均 = 45 ÷ 9 = 5 → 下降', fn: function (ctx, W) { U.row(ctx, W, 110, [1, 2, 3, 4, 5, 6, 7, 8, 9]); U.lines(ctx, W, [['5.5 → 5：平均被拉向留下的小数一侧', 13, '#fbbf24', true]], 200); } },
      { cap: '反过来：从原数列擦掉 1（比平均小）：新平均 = 54 ÷ 9 = 6 → 上升', fn: function (ctx, W) { U.row(ctx, W, 110, [2, 3, 4, 5, 6, 7, 8, 9, 10]); U.lines(ctx, W, [['5.5 → 6：平均被拉向留下的大数一侧', 13, '#fbbf24', true]], 200); } },
      { cap: '规律：擦掉的数 > 平均 → 平均下降；< 平均 → 上升 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['平均数永远朝被移除数的反方向偏移', 14, '#8fa0c8'], ['结论：擦大降、擦小升 ✓', 15, '#4ade80', true]], 120, 44); } }
    ] } });

  /* 68 数位求和 */
  D({ g: g, no: 68, title: '数位求和', e: 'board', strat: '数学技巧·按位统计',
    plain: '把 1~999 所有数字的各位数字加起来是多少？按位统计：个位上 0~9 各出现 100 次，十位百位同理，答案是 45×100×3 = 13500。',
    p: { steps: [
      { cap: '求 1~999 所有数字的数位之和：逐个加太繁琐', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, '…', 998, 999]); } },
      { cap: '小技巧：补上 000，凑成 000~999（加 0 不改变和）', fn: function (ctx, W) { U.row(ctx, W, 110, ['000', '001', '002', '…', '999']); U.lines(ctx, W, [['统一成三位数：整整 1000 个数', 14, '#5eead4', true]], 200); } },
      { cap: '对称性：每个数位上 0~9 各恰好出现 100 次', fn: function (ctx, W) { U.row(ctx, W, 110, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], null, function (v) { return +v % 2 ? '#1e3a34' : '#273469'; }); U.lines(ctx, W, [['个、十、百位地位平等，轮转均匀', 13, '#8fa0c8']], 200); } },
      { cap: '单个数位的贡献 = (0+1+…+9) × 100 = 45 × 100 = 4500', fn: function (ctx, W) { U.lines(ctx, W, [['0+1+…+9 = 45', 15, '#8fa0c8'], ['45 × 100 次 = 4500', 16, '#fbbf24', true]], 110, 44); } },
      { cap: '三个数位 → 4500 × 3 = 13500 ✓', fn: function (ctx, W) { U.row(ctx, W, 110, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], null, function () { return '#1e3a34'; }); U.lines(ctx, W, [['4500 × 3 个数位 = 13500 ✓', 17, '#4ade80', true]], 200); } }
    ] } });

  /* 69 扇区上的筹码 */
  D({ g: g, no: 69, title: '扇区上的筹码', e: 'geo', strat: '奇偶/不变量',
    plain: '圆盘分成几个扇区，筹码只能移到相邻空扇区。想交换两枚筹码的位置？奇偶不变量说：有些目标状态永远到不了。',
    p: { steps: [
      { cap: '圆盘分 6 个扇区，红、蓝两枚筹码；只能滑到相邻空扇区', fn: function (ctx, W, Hh) { sector(ctx, W, Hh, [1, 0, 0, 2, 0, 0]); } },
      { cap: '试着走几步：两枚筹码绕着圆环一前一后滑行', fn: function (ctx, W, Hh) { sector(ctx, W, Hh, [0, 0, 1, 0, 2, 0]); } },
      { cap: '目标：让红蓝交换位置（红到蓝原来的扇区）', fn: function (ctx, W, Hh) { sector(ctx, W, Hh, [2, 0, 0, 1, 0, 0]); H.txt(ctx, '目标状态：红蓝互换', W / 2, Hh - 40, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '不变量：滑动只能让两枚一起绕环，环绕顺序永远不变', fn: function (ctx, W, Hh) { sector(ctx, W, Hh, [0, 2, 0, 0, 1, 0]); H.txt(ctx, '无论怎么滑，红总在蓝前面（顺时针）', W / 2, Hh - 40, { size: 13, bold: true, color: '#8fa0c8' }); } },
      { cap: '交换需要逆序 → 永远不可能 ✓（顺序是不变量）', fn: function (ctx, W, Hh) { sector(ctx, W, Hh, [2, 0, 0, 1, 0, 0]); H.txt(ctx, '红蓝互换不可达 ✓', W / 2, Hh - 40, { size: 14, bold: true, color: '#4ade80' }); } }
    ] } });
  function sector(ctx, W, Hh, arr) {
    var cx = W / 2, cy = Hh / 2 - 8, R = 110;
    ctx.strokeStyle = '#39437a'; ctx.lineWidth = 1.5;
    for (var k = 0; k < 6; k++) {
      var a = k * Math.PI / 3;
      H.line(ctx, cx, cy, cx + R * Math.cos(a), cy + R * Math.sin(a), '#39437a', 1.5);
    }
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    arr.forEach(function (v, k) {
      if (!v) return;
      var a2 = (k + 0.5) * Math.PI / 3;
      H.circle(ctx, cx + R * 0.62 * Math.cos(a2), cy + R * 0.62 * Math.sin(a2), 13, v === 1 ? '#f87171' : '#7dd3fc');
    });
  }

  /* 70 跳跃成对 I */
  D({ g: g, no: 70, title: '跳跃成对 I', e: 'board', strat: '构造·逆向',
    plain: '8 枚硬币排成一排，每次拿一枚硬币跳过两枚（落在空位），最终组成 4 对叠放的硬币。从目标倒推每一步该跳谁。',
    p: { steps: [
      { cap: '8 枚硬币排成一排：○○○○○○○○', fn: function (ctx, W) { coinRow(ctx, W, [[0, 0], [0, 0], [0, 0], [0, 0]]); } },
      { cap: '目标：4 步之后形成 4 对叠放的硬币', fn: function (ctx, W) { coinRow(ctx, W, [[1, 1], [1, 1], [1, 1], [1, 1]]); U.lines(ctx, W, [['每堆恰好 2 枚，只许跳 4 步', 13, '#8fa0c8']], 220); } },
      { cap: '规则：拿起一枚，跳过恰好 2 枚（硬币或空格）落位成对', fn: function (ctx, W) { coinRow(ctx, W, [[0, 0], [0, 1], [0, 0], [0, 0]]); U.lines(ctx, W, [['落点必须形成一对', 13, '#5eead4', true]], 220); } },
      { cap: '策略：从目标倒推，每一步想清楚该跳哪一枚', fn: function (ctx, W) { coinRow(ctx, W, [[0, 0], [0, 1], [0, 0], [0, 1]]); U.lines(ctx, W, [['逆向构造：先定终局、再回填走法', 13, '#fbbf24', true]], 220); } },
      { cap: '解：1→5、7→3、4→8、2→6 → 4 堆两枚 ✓', fn: function (ctx, W) { coinRow(ctx, W, [[1, 1], [1, 1], [1, 1], [1, 1]]); U.lines(ctx, W, [['跳法：1→5, 7→3, 4→8, 2→6 ✓', 14, '#4ade80', true]], 220); } }
    ] } });
  function coinRow(ctx, W, pairs) {
    var x0 = W / 2 - 140;
    pairs.forEach(function (p, k) {
      var x = x0 + k * 80 + 40;
      if (p[0]) H.circle(ctx, x, 160, 16, '#fbbf24');
      if (p[1]) H.circle(ctx, x, p[0] ? 148 : 160, 16, '#fbbf24');
      if (!p[0] && !p[1]) H.circle(ctx, x, 160, 16, null, '#39437a');
    });
  }

  /* 71 标记方格 I */
  D({ g: g, no: 71, title: '标记方格 I', e: 'board', strat: '构造·对角线',
    plain: '在 4×4 棋盘上标记最少的方格，使每行每列都至少有一个标记格。对角线放 4 个就够了，而 4 行各需至少 1 个，所以 4 是最优。',
    p: { steps: [
      { cap: '4×4 棋盘：每行每列都至少一个标记格，最少标几格？', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']], { max: 52 }); } },
      { cap: '下界（行视角）：4 行各自至少 1 个 → 至少 4 格', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']], { max: 52 });
        for (var r = 0; r < 4; r++) H.txt(ctx, '≥1', gg.x0 - 20, gg.y0 + r * gg.cell + gg.cell / 2, { size: 11, bold: true, color: '#fbbf24' });
        H.txt(ctx, '下界 = 行数 = 4', W / 2, gg.y0 + 4 * gg.cell + 18, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '下界（列视角）：4 列同样各自至少 1 个 → 不矛盾，仍是 4', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']], { max: 52 });
        for (var c = 0; c < 4; c++) H.txt(ctx, '≥1', gg.x0 + c * gg.cell + gg.cell / 2, gg.y0 - 16, { size: 11, bold: true, color: '#5eead4' });
        H.txt(ctx, '行、列双重视角下界一致 = 4', W / 2, gg.y0 + 4 * gg.cell + 18, { size: 13, bold: true, color: '#5eead4' }); } },
      { cap: '构造：主对角线放 4 个 → 每行每列各恰好 1 个', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['★', '', '', ''], ['', '★', '', ''], ['', '', '★', ''], ['', '', '', '★']], { max: 52, txtColor: function () { return '#fbbf24'; } }); } },
      { cap: '上界 = 下界 = 4 → 最少 4 格 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['★', '', '', ''], ['', '★', '', ''], ['', '', '★', ''], ['', '', '', '★']], { max: 52, txtColor: function () { return '#4ade80'; }, cellColor: function (r, c) { return r === c ? '#1e3a34' : null; } }); } }
    ] } });

  /* 72 标记方格 II */
  D({ g: g, no: 72, title: '标记方格 II', e: 'board', strat: '构造·周期性',
    plain: '加强版：8×8 棋盘上每个 2×2 小方块都要含一个标记格。按"隔行隔列"的周期模式放 16 个，既充分又必要。',
    p: { steps: [
      { cap: '加强版：8×8 棋盘上，每一个 2×2 小块都要含标记格', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['?', '?'], ['?', '?']], { max: 56 }); } },
      { cap: '难在哪：2×2 相互重叠，共 (8−1)² = 49 个约束', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true, cellColor: function (r, c) { return (r === 1 || r === 2) && (c === 2 || c === 3) ? 'rgba(248,113,113,.35)' : null; } });
        H.txt(ctx, '49 个重叠的 2×2，逐个满足太难', W / 2, gg.y0 + 8 * gg.cell + 16, { size: 13, bold: true, color: '#f87171' }); } },
      { cap: '下界：棋盘可分成 16 个互不相交的 2×2 → 至少 16 格', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { checker: true });
        for (var k = 2; k <= 6; k += 2) { H.line(ctx, gg.x0 + k * gg.cell, gg.y0 - 4, gg.x0 + k * gg.cell, gg.y0 + 8 * gg.cell + 4, '#fbbf24', 1.5); H.line(ctx, gg.x0 - 4, gg.y0 + k * gg.cell, gg.x0 + 8 * gg.cell + 4, gg.y0 + k * gg.cell, '#fbbf24', 1.5); }
        H.txt(ctx, '16 个不相交 2×2 → 下界 16 格', W / 2, gg.y0 + 8 * gg.cell + 16, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '构造：隔行隔列周期放置，恰好 16 格', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(r % 2 === 1 && c % 2 === 1 ? '★' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, txtColor: function () { return '#fbbf24'; } }); } },
      { cap: '验证：任何 2×2 都恰好盖住一个 ★ → 16 格最优 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(r % 2 === 1 && c % 2 === 1 ? '★' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, txtColor: function () { return '#4ade80'; }, cellColor: function (r, c) { return r % 2 === 1 && c % 2 === 1 ? '#1e3a34' : null; } }); } }
    ] } });

  /* 73 逮公鸡 */
  D({ g: g, no: 73, title: '逮公鸡', e: 'gridmove', strat: '贪心·追逐',
    plain: '5×5 场地上人追公鸡，轮流走一格。策略：始终缩小与公鸡在同一行/列上的距离，把它逼向角落再收网。',
    p: { rows: 5, cols: 5,
      pieces: [{ id: 'P', label: '人', color: '#7dd3fc', r: 0, c: 0 }, { id: 'C', label: '鸡', color: '#fbbf24', r: 4, c: 4 }],
      moves: [
        { id: 'C', r: 4, c: 3, cap: '鸡向左跑' }, { id: 'P', r: 1, c: 0, cap: '人逼近（先对齐行/列）' },
        { id: 'C', r: 3, c: 3, cap: '鸡向上跑' }, { id: 'P', r: 2, c: 0, cap: '人继续压上' },
        { id: 'C', r: 3, c: 2, cap: '鸡再向左' }, { id: 'P', r: 3, c: 0, cap: '人对齐第 4 行！' },
        { id: 'C', r: 3, c: 1, cap: '鸡被逼向左' }, { id: 'P', r: 3, c: 1, cap: '人逮住公鸡 ✓' }
      ], cap: '逼角战术：先对齐一行，再横向收网' } });

    /* 74 地点选择 */
  D({ g: g, no: 74, title: '地点选择', e: 'board', strat: '贪心·中位数',
    plain: '曼哈顿距离下让所有房子到某点总距离最小：横、纵方向互不干扰，各自取坐标的中位数即可。',
    p: { steps: [
      { cap: '城市街道纵横：距离只能沿街区走（曼哈顿距离）', fn: function (ctx, W, Hh) { U.street(ctx, W, Hh, [[0, 3], [1, 0], [2, 2], [3, 4], [4, 1]], { paths: true }); U.lines(ctx, W, [['距离 = |xᵢ−x| + |yᵢ−y|', 14, '#5eead4', true]], 296); } },
      { cap: '关键：横向距离只依赖 x、纵向只依赖 y → 拆成两个一维问题', fn: function (ctx, W, Hh) { U.street(ctx, W, Hh, [[0, 3], [1, 0], [2, 2], [3, 4], [4, 1]]); U.lines(ctx, W, [['总距离 = Σ|xᵢ−x| + Σ|yᵢ−y|，两方向独立', 13, '#fbbf24', true]], 296); } },
      { cap: '一维最优：取坐标的中位数（左右户数平衡，挪动只会变差）', fn: function (ctx, W, Hh) { U.street(ctx, W, Hh, [[0, 3], [1, 0], [2, 2], [3, 4], [4, 1]], { med: [2, 2] }); U.lines(ctx, W, [['x 坐标 0,1,2,3,4 → 中位数 2', 13, '#8fa0c8']], 296); } },
      { cap: 'y 同理取中位数 2 → 候选点 (2, 2)', fn: function (ctx, W, Hh) { U.street(ctx, W, Hh, [[0, 3], [1, 0], [2, 2], [3, 4], [4, 1]], { med: [2, 2], paths: true }); U.lines(ctx, W, [['x 中位 = 2、y 中位 = 2', 13, '#fbbf24', true]], 296); } },
      { cap: '答案：地点选在 (x 中位数, y 中位数)，总距离最小 ✓', fn: function (ctx, W, Hh) { U.street(ctx, W, Hh, [[0, 3], [1, 0], [2, 2], [3, 4], [4, 1]], { med: [2, 2], paths: true }); U.lines(ctx, W, [['二维中位数，总距离最小 ✓', 14, '#4ade80', true]], 296); } }
    ] } });
  /* 75 加油站检查问题 */
  D({ g: g, no: 75, title: '加油站检查问题', e: 'board', strat: '贪心·路径',
    plain: '直线公路等距 n 个加油站，从站 1 出发还要再访站 1、站 n 访两次、中间站次数相同：每站至少 2 次 → 路线 ≥ (2n−1)d；偶数 n 折返可达，奇数 n 无解。',
    p: { steps: [
      { cap: 'n 个加油站等距排在一条直线上，检查员从站 1 出发', fn: function (ctx, W) {
        for (var i = 0; i < 6; i++) { H.circle(ctx, 120 + i * 80, 150, 16, '#273469', '#5eead4'); H.txt(ctx, String(i + 1), 120 + i * 80, 150, { size: 11, bold: true }); if (i < 5) H.line(ctx, 136 + i * 80, 150, 184 + i * 80, 150, '#39437a', 2); }
        U.lines(ctx, W, [['相邻站间距 = d', 13, '#8fa0c8']], 230); } },
      { cap: '约束：站 1 再访一次、站 n 访两次、中间站次数相同 → 每站 ≥ 2 次', fn: function (ctx, W) {
        for (var i = 0; i < 6; i++) { H.circle(ctx, 120 + i * 80, 150, 16, i === 0 || i === 5 ? '#4a3a12' : '#273469', '#fbbf24'); H.txt(ctx, String(i + 1), 120 + i * 80, 150, { size: 11, bold: true }); if (i < 5) H.line(ctx, 136 + i * 80, 150, 184 + i * 80, 150, '#39437a', 2); }
        U.lines(ctx, W, [['首尾各 2 次、中间站次数一致', 13, '#fbbf24', true]], 230); } },
      { cap: '下界：共 ≥ 2n 次访问 → 至少 2n−1 段 → 路线 ≥ (2n−1)d', fn: function (ctx, W) { U.lines(ctx, W, [['访问次数 ≥ 2n', 14, '#8fa0c8'], ['路线长度 ≥ (2n−1)·d', 16, '#fbbf24', true]], 120, 46); } },
      { cap: 'n 偶数：折返路线 1,2,1,2,3,4,3,4,… 每段恰好走 2 次 → 达下界', fn: function (ctx, W) { U.row(ctx, W, 110, ['1', '2', '1', '2', '3', '4', '3', '4']); U.lines(ctx, W, [['每段走 2 次、换站 1 次，无浪费', 14, '#5eead4', true]], 200); } },
      { cap: 'n 奇数：中间站无法恰好 2 次 → 无解；结论：偶数达 (2n−1)d，奇数无路线 ✓', fn: function (ctx, W) {
        for (var i = 0; i < 5; i++) { H.circle(ctx, 160 + i * 80, 130, 16, i === 2 ? '#7f3030' : '#273469', i === 2 ? '#f87171' : '#5eead4'); H.txt(ctx, String(i + 1), 160 + i * 80, 130, { size: 11, bold: true }); if (i < 4) H.line(ctx, 176 + i * 80, 130, 224 + i * 80, 130, '#39437a', 2); }
        U.lines(ctx, W, [['n 偶：(2n−1)d 可达；n 奇：无解 ✓', 14, '#4ade80', true]], 220); } }
    ] } });
  /* 76 高效的车 */
  D({ g: g, no: 76, title: '高效的车', e: 'board', strat: '贪心·路径',
    plain: '车一步可横/竖扫过整行/整列：走完 n×n 所有格最少 2n−1 步——n 步扫行 + n−1 步转向，锯齿路线恰好达标。',
    p: { steps: [
      { cap: '车一步可以扫过整行或整列：要经过 n×n 的每一格', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(''); b.push(row); }
        U.grid(ctx, W, Hh, b, { max: 40 });
        U.lines(ctx, W, [['起点、终点格默认已经过', 13, '#8fa0c8']], 300); } },
      { cap: '下界：扫遍 6 行至少 6 步扫行，行间还要 5 步转向 → 2n−1', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(''); b.push(row); }
        U.grid(ctx, W, Hh, b, { max: 40 });
        U.lines(ctx, W, [['下界 = n 步扫行 + (n−1) 步转向 = 2n−1', 14, '#fbbf24', true]], 300); } },
      { cap: '构造：锯齿路线——沿行走到头、转向换行、反向走回来…', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(''); b.push(row); } U.grid(ctx, W, Hh, b, { max: 40 }); H.line(ctx, 240, 65, 460, 65, '#5eead4', 2); H.line(ctx, 460, 65, 460, 140, '#5eead4', 2); H.line(ctx, 460, 140, 240, 140, '#5eead4', 2); H.line(ctx, 240, 140, 240, 215, '#5eead4', 2); H.line(ctx, 240, 215, 460, 215, '#5eead4', 2); H.line(ctx, 460, 215, 460, 290, '#5eead4', 2); } },
      { cap: '数步数：6 步扫行 + 5 步转向 = 11，恰好触到下界', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(''); b.push(row); }
        U.grid(ctx, W, Hh, b, { max: 40 });
        H.line(ctx, 240, 65, 460, 65, '#fbbf24', 2); H.line(ctx, 460, 65, 460, 140, '#fbbf24', 2); H.line(ctx, 460, 140, 240, 140, '#fbbf24', 2); H.line(ctx, 240, 140, 240, 215, '#fbbf24', 2); H.line(ctx, 240, 215, 460, 215, '#fbbf24', 2); H.line(ctx, 460, 215, 460, 290, '#fbbf24', 2);
        U.lines(ctx, W, [['6 + 5 = 11 = 2×6−1', 15, '#fbbf24', true]], 300); } },
      { cap: '答案：最少 2n−1 步（8×8 为 15 步）✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 6; r++) { var row = []; for (var c = 0; c < 6; c++) row.push(''); b.push(row); }
        U.grid(ctx, W, Hh, b, { max: 40, cellColor: function () { return '#1e3a34'; } });
        H.line(ctx, 240, 65, 460, 65, '#4ade80', 2); H.line(ctx, 460, 65, 460, 140, '#4ade80', 2); H.line(ctx, 460, 140, 240, 140, '#4ade80', 2); H.line(ctx, 240, 140, 240, 215, '#4ade80', 2); H.line(ctx, 240, 215, 460, 215, '#4ade80', 2); H.line(ctx, 460, 215, 460, 290, '#4ade80', 2);
        U.lines(ctx, W, [['锯齿路线恰达下界：2n−1 步 ✓', 14, '#4ade80', true]], 300); } }
    ] } });
  /* 77 模式搜索 */
  D({ g: g, no: 77, title: '模式搜索', e: 'board', strat: '数学技巧·模式',
    plain: '1×1、11×11、111×111…：k 个 1 相乘得回文 1…k…1，k ≤ 9 时模式成立，从 10 个 1 起进位破坏规律。',
    p: { steps: [
      { cap: '先算几个小例子：1×1 = 1，11×11 = 121', fn: function (ctx, W) { U.word(ctx, W, 90, ['1']); U.word(ctx, W, 150, ['1', '2', '1'], [1]); U.lines(ctx, W, [['结果好像有点规律？', 13, '#8fa0c8']], 240); } },
      { cap: '继续：111×111 = 12321，1111×1111 = 1234321', fn: function (ctx, W) { U.word(ctx, W, 90, ['1', '2', '3', '2', '1'], [2]); U.word(ctx, W, 150, ['1', '2', '3', '4', '3', '2', '1'], [3]); U.lines(ctx, W, [['先升后降的回文！', 14, '#5eead4', true]], 240); } },
      { cap: '猜想：k 个 1 相乘 = 回文 1,2,…,k,…,2,1', fn: function (ctx, W) { U.lines(ctx, W, [['为什么？竖式里每一位都是“不携带的重叠计数”', 13, '#8fa0c8'], ['猜想：k 个 1 × k 个 1 → 1…k…1', 15, '#fbbf24', true]], 120, 46); } },
      { cap: '极限验证：9 个 1 → 12345678987654321，模式完美成立', fn: function (ctx, W) { U.word(ctx, W, 110, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '8', '7', '6', '5', '4', '3', '2', '1'], [8], function (ch) { return +ch % 2 ? '#273469' : '#1e3a34'; }); U.lines(ctx, W, [['9 个 1：回文峰顶恰好是 9', 14, '#fbbf24', true]], 200); } },
      { cap: '10 个 1 起：峰顶 10 产生进位 → 模式被破坏 ✓', fn: function (ctx, W) { U.word(ctx, W, 90, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '1', '0', '0', '9', '8', '7', '6', '5', '4', '3', '2', '1'], [9, 10, 11], function (ch, i2) { return (i2 >= 9 && i2 <= 11) ? 'rgba(248,113,113,.85)' : '#273469'; }); U.lines(ctx, W, [['答案：k ≤ 9 成立，10 个 1 起进位破坏 ✓', 13, '#4ade80', true]], 200); } }
    ] } });
  /* 78 直三格板平铺 */
  D({ g: g, no: 78, title: '直三格板平铺', e: 'board', strat: '构造·分治',
    plain: '直三格板 (3×1) + 一块单格板铺 n×n（n>3 且 3∤n）：拆成 4×4 或 5×5 角块 + 两个 3k 边长矩形，总能铺满。',
    p: { steps: [
      { cap: '3 | n 时容易：整行/整列排 3×1 骨牌即可；难的是 3 ∤ n', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['3', '3', '3'], ['3', '3', '3'], ['3', '3', '3']], { max: 52, txtColor: function () { return '#5eead4'; } }); U.lines(ctx, W, [['问：n>3 且 3∤n，加一块 1×1 单格板能铺吗？', 13, '#8fa0c8']], 290); } },
      { cap: '拆分思路：n ≡ 1 (mod 3) → 写 n = 4 + 3k', fn: function (ctx, W, Hh) { U.lines(ctx, W, [['把 n×n 切成：一个 4×4 角块 + 两个边长含 3k 的矩形', 13, '#8fa0c8'], ['3k 边长的矩形 → 直三格板直接铺满', 14, '#5eead4', true]], 130, 46); } },
      { cap: '4×4 角块：单格板放一角，剩 15 格 = 5 块直三格板', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['单', '3', '3', '3'], ['3', '3', '3', '3'], ['3', '3', '3', '3'], ['3', '3', '3', '3']], { max: 48, txtColor: function (r, c, v) { return v === '单' ? '#f87171' : '#5eead4'; } }); } },
      { cap: '拼合：4×4 角块 + 两个 3k 矩形 → n ≡ 1 时铺满', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, [['单', '3', '3', '3'], ['3', '3', '3', '3'], ['3', '3', '3', '3'], ['3', '3', '3', '3']], { max: 48, txtColor: function (r, c, v) { return v === '单' ? '#f87171' : '#5eead4'; }, cellColor: function (rr2, cc) { return (rr2 === 0 && cc === 0) ? null : '#1e3a34'; } });
        H.txt(ctx, '单格板只在 4×4 里用一次', W / 2, gg.y0 + 4 * gg.cell + 18, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: 'n ≡ 2 (mod 3)：写 n = 5+3k，5×5 角块同理 → 所有 n>3 都能铺 ✓', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, [['单', '3', '3', '3', '3'], ['3', '3', '3', '3', '3'], ['3', '3', '3', '3', '3'], ['3', '3', '3', '3', '3'], ['3', '3', '3', '3', '3']], { max: 42, txtColor: function (r, c, v) { return v === '单' ? '#f87171' : '#5eead4'; }, cellColor: function (rr2, cc) { return (rr2 === 0 && cc === 0) ? null : '#1e3a34'; } });
        H.txt(ctx, 'n = 5+3k 同理 → 总能平铺 ✓', W / 2, gg.y0 + 5 * gg.cell + 16, { size: 13, bold: true, color: '#4ade80' }); } }
    ] } });
/* 79 储物柜门 */
  D({ g: g, no: 79, title: '储物柜门', e: 'flip', strat: '数论·因子',
    plain: '100 个储物柜，第 k 轮把所有编号是 k 的倍数的柜门翻一次。翻偶数次的关着、奇次数的开着，只有完全平方数才有奇数个因子！',
    p: { init: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], cols: 12, labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      ops: [
        { at: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], cap: '第 1 轮：全开（1 的倍数）' },
        { at: [1, 3, 5, 7, 9, 11], cap: '第 2 轮：翻 2 的倍数' },
        { at: [2, 5, 8, 11], cap: '第 3 轮：翻 3 的倍数' },
        { at: [3, 7, 11], cap: '第 4 轮' }, { at: [4, 9], cap: '第 5 轮' }, { at: [5, 11], cap: '第 6 轮' },
        { at: [6], cap: '第 7 轮' }, { at: [7], cap: '第 8 轮' }, { at: [8], cap: '第 9 轮' },
        { at: [9], cap: '第 10 轮' }, { at: [10], cap: '第 11 轮' }, { at: [11], cap: '第 12 轮' }
      ], cap: '最后开着的：1、4、9 ，只有完全平方数' } });

    /* 80 王子之旅 */
  D({ g: g, no: 80, title: '王子之旅', e: 'board', strat: '构造·螺旋',
    plain: '"王子"只会右移、下移、左上侧移一格：对角线 + 上下两条螺旋线串起全部格子，任意 n>1 都能每格恰好走一次。',
    p: { steps: [
      { cap: '王子走法：右 1 格、下 1 格、或左上侧移 1 格', fn: function (ctx, W, Hh) { var b = [], r, c; for (r = 0; r < 6; r++) { var row = []; for (c = 0; c < 6; c++) row.push(''); b.push(row); } U.grid(ctx, W, Hh, b, { max: 36, y0: 50 }); var cs = 36, x0 = (W - 36 * 6) / 2, y0 = 50, px = x0 + 3 * cs + cs / 2, py = y0 + 3 * cs + cs / 2; H.circle(ctx, px, py, 12, '#5eead4'); H.line(ctx, px, py, px + cs, py, '#fbbf24', 2); H.line(ctx, px, py, px, py + cs, '#fbbf24', 2); H.line(ctx, px, py, px - cs, py - cs, '#fbbf24', 2); H.txt(ctx, '→↓↖', px + 10, py - 20, { size: 12, bold: true, color: '#fbbf24' }); } },
      { cap: '构造骨架：先沿主对角线走（↖ 步），它把棋盘分成上下两半', fn: function (ctx, W, Hh) { var b = [], r, c; for (r = 0; r < 6; r++) { var row = []; for (c = 0; c < 6; c++) row.push(''); b.push(row); } U.grid(ctx, W, Hh, b, { max: 36, y0: 50, cellColor: function (r, c) { return r === c ? 'rgba(94,234,212,.35)' : null; } }); U.lines(ctx, W, [['对角线是两半的“公共干道”', 13, '#5eead4', true]], 300); } },
      { cap: '上半用“右+下”旋入、下半用对称螺旋，都从对角线进出 → 任意 n>1 走遍每格一次', fn: function (ctx, W, Hh) { var b = [], r, c; for (r = 0; r < 6; r++) { var row = []; for (c = 0; c < 6; c++) row.push((r + c) % 2 === 0 ? '·' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { max: 36, y0: 50, txtColor: function () { return '#fbbf24'; }, cellColor: function (r, c) { return r === c ? 'rgba(94,234,212,.35)' : null; } }); U.lines(ctx, W, [['对角线 + 双侧螺旋，每格恰好一次', 13, '#fbbf24', true]], 300); } },
      { cap: '答案：对任何 n 都有解（且路线不唯一）✓', fn: function (ctx, W, Hh) { var b = [], r, c; for (r = 0; r < 6; r++) { var row = []; for (c = 0; c < 6; c++) row.push('✓'); b.push(row); } U.grid(ctx, W, Hh, b, { max: 36, y0: 50, txtColor: function () { return '#4ade80'; } }); U.lines(ctx, W, [['答案：任意 n > 1 均可 ✓', 14, '#4ade80', true]], 300); } }
    ] } });
/* 81 再论名人问题 */
  D({ g: g, no: 81, title: '再论名人问题', e: 'board', strat: '减治·优化',
    plain: '名人问题最优解：每问必淘汰一人，n−1 问只剩候选者，再验证认识关系；整体 O(n)，且不可能更快。',
    p: { steps: [
      { cap: '6 人中藏着一位名人：谁也不认识、所有人认识他', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D', 'E', 'F']); } },
      { cap: '关键：一问"甲认识乙吗"，无论答案如何都能淘汰一人', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D', 'E', 'F'], [{ out: 1 }, {}, {}, {}, {}, {}]); U.lines(ctx, W, [['认识→甲出局；不认识→乙出局', 13, '#fbbf24', true]], 210); } },
      { cap: '淘汰赛式提问：5 问后只剩 1 位候选者', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D', 'E', 'F'], [{ out: 1 }, { out: 1 }, { out: 1 }, {}, { out: 1 }, { out: 1 }]); U.lines(ctx, W, [['n−1 问 = 淘汰赛，必只剩 1 人', 13, '#8fa0c8']], 210); } },
      { cap: '验证：确认"所有人认识 D"且"D 谁也不认识"', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D', 'E', 'F'], [{ out: 1 }, { out: 1 }, { out: 1 }, { tag: '候选' }, { out: 1 }, { out: 1 }]); U.lines(ctx, W, [['再花至多 2(n−1) 问验证', 13, '#8fa0c8']], 210); } },
      { cap: '确认 D 是名人 ✓；总问数 O(n)，每问至多排除 1 人 → 不可能更快', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D', 'E', 'F'], [{ out: 1 }, { out: 1 }, { out: 1 }, { tag: '名人' }, { out: 1 }, { out: 1 }]); U.lines(ctx, W, [['O(n) 即最优 ✓', 15, '#4ade80', true]], 210); } }
    ] } });

    /* 82 头像朝上 */
  D({ g: g, no: 82, title: '头像朝上', e: 'board', strat: '贪心',
    plain: '翻连续段让所有硬币头像朝上：从左到右扫，遇到背面就翻它到右端，把"坑"不断向右推；最差情况需 n 次。',
    p: { steps: [
      { cap: 'n 枚硬币随机正/背，一次可翻任意连续一段', fn: function (ctx, W) { U.row(ctx, W, 110, ['背', '正', '背', '背', '正', '背']); } },
      { cap: '贪心：从左到右，遇背面就翻"从它到右端"的整段', fn: function (ctx, W) { U.row(ctx, W, 110, ['背', '正', '背', '背', '正', '背'], [0]); U.lines(ctx, W, [['翻 [0..5]：把最左的坑向右推', 14, '#fbbf24', true]], 200); } },
      { cap: '每翻一次，左端就多锁定一枚正面，坑整体右移', fn: function (ctx, W) { U.row(ctx, W, 110, ['正', '背', '正', '正', '背', '正'], [0], function (v) { return v === '正' ? '#1e3a34' : '#7f3030'; }); U.lines(ctx, W, [['左端正面逐个锁定，坑被向右推', 14, '#8fa0c8']], 200); } },
      { cap: '重复扫描直到全正：每枚背面至多引发一次翻动', fn: function (ctx, W) { U.row(ctx, W, 110, ['正', '正', '正', '正', '正', '正'], null, function () { return '#1e3a34'; }); U.lines(ctx, W, [['翻动次数 ≤ 背面出现的次数', 13, '#8fa0c8']], 200); } },
      { cap: '最差情况（正反交替）恰好 n 次 → 答案：最差 n 次 ✓', fn: function (ctx, W) { U.row(ctx, W, 110, ['正', '正', '正', '正', '正', '正'], null, function () { return '#1e3a34'; }); U.lines(ctx, W, [['答案：最差 n 次翻动 ✓', 16, '#4ade80', true]], 200); } }
    ] } });
/* 83 受限的汉诺塔 */
  D({ g: g, no: 83, title: '受限的汉诺塔', e: 'hanoi', strat: '递归·受限',
    plain: '加强版汉诺塔：盘子只能在相邻柱子之间移动（不许 A 直接到 C）。2 个盘子就要 8 步，约束一变，代价指数级上涨。',
    p: { n: 2, pegs: 3, moves: [
      { d: 1, f: 0, t: 1 }, { d: 1, f: 1, t: 2 }, { d: 2, f: 0, t: 1 }, { d: 1, f: 2, t: 1 },
      { d: 1, f: 1, t: 0 }, { d: 2, f: 1, t: 2 }, { d: 1, f: 0, t: 1 }, { d: 1, f: 1, t: 2 }
    ], cap: '相邻移动限制：2 盘需 8 步（普通版仅 3 步）' } });

  /* 84 煎饼排序 */
  D({ g: g, no: 84, title: '煎饼排序', e: 'arrange', strat: '减治·翻转',
    plain: '一摞大小不一的煎饼，唯一的操作是把铲子插进去、把上面一段整体翻面。策略：每轮把当前最大的翻到最顶，再整体翻到它该去的位置。',
    p: { init: [5, 3, 4, 1, 2],
      colorOf: function (v) { return ['#3b55a6', '#4463c2', '#5274d6', '#6b8ae8', '#8aa4f5'][v - 1]; },
      ops: [
        { t: 'rev', i: 0, j: 4, hl: [0, 4], cap: '最大的 5 已在顶部 → 整摞翻面，5 沉底' },
        { t: 'rev', i: 0, j: 2, cap: '4 翻到顶部' },
        { t: 'rev', i: 0, j: 3, cap: '把前 4 个翻面 → 4 到倒数第二位' },
        { t: 'rev', i: 0, j: 2, cap: '3 归位 → 1 2 3 4 5 完成 ✓' }
      ], cap: '唯一操作：翻转顶部一段' } });

    /* 85 散布谣言 I */
  D({ g: g, no: 85, title: '散布谣言 I', e: 'board', strat: '分治·聚合',
    plain: 'n 人各持一条谣言，消息一对多发送：先"收集"到一人（n−1 条），再由他"广播"给其余人（n−1 条），共 2n−2 条。',
    p: { steps: [
      { cap: 'n 个人各知道一条独家谣言，要让所有人都知道全部', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁']); } },
      { cap: '收集阶段：大家把各自消息发给同一人 → n−1 条', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁'], [{ tag: '全量' }]); U.lines(ctx, W, [['中心人拿到全部 n 条谣言', 13, '#8fa0c8']], 210); } },
      { cap: '发送者会把自己知道的全部打包发出 → 一条顶 n 条', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁'], [{ tag: '全量' }, { tag: '全量' }, {}, {}]); U.lines(ctx, W, [['每次发送携带全部已知消息', 13, '#fbbf24', true]], 210); } },
      { cap: '广播阶段：中心人把全量消息逐个发回 → 再 n−1 条', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁'], [{ tag: '全量' }, { tag: '全量' }, { tag: '全量' }, {}]); U.lines(ctx, W, [['收集 n−1 + 广播 n−1', 14, '#fbbf24', true]], 210); } },
      { cap: '答案：最少 2n−2 条消息，人人都知道全部谣言 ✓', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁'], [{ tag: '全量' }, { tag: '全量' }, { tag: '全量' }, { tag: '全量' }]); U.lines(ctx, W, [['答案：2(n−1) 条 ✓', 15, '#4ade80', true]], 210); } }
    ] } });
/* 86 散布谣言 II */
  D({ g: g, no: 86, title: '散布谣言 II', e: 'board', strat: '分治·聚合',
    plain: '电话版：通话时双方互通全部消息，一通电话相当于两条消息。收集到中心 n−1 通 + 广播回去 n−1 通，共 2n−2 通。',
    p: { steps: [
      { cap: 'n 人各持一条独家消息；通话时双方互通所有已知消息', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁']); U.lines(ctx, W, [['与 #85 的区别：一次通话 = 双向交换', 13, '#8fa0c8']], 210); } },
      { cap: '收集阶段：逐个打给中心人 → n−1 通，中心人拿全量', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁'], [{ tag: '全量' }]); U.lines(ctx, W, [['每通电话同时让中心人多拿一条', 13, '#8fa0c8']], 210); } },
      { cap: '广播阶段：中心人逐个回拨 → 再 n−1 通，对方一步拿全', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁'], [{ tag: '全量' }, { tag: '全量' }, { tag: '全量' }, {}]); U.lines(ctx, W, [['回拨一通，对方就知晓全部', 13, '#fbbf24', true]], 210); } },
      { cap: '为什么不能再少：最后一个人知道全量前，必须有人把全量传给他', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁'], [{ tag: '全量' }, { tag: '全量' }, { tag: '全量' }, { tag: '全量' }]); U.lines(ctx, W, [['收集与广播各至少 n−1 通', 13, '#8fa0c8']], 210); } },
      { cap: '答案：共 2(n−1) 通电话，且已是最优 ✓', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁'], [{ tag: '全量' }, { tag: '全量' }, { tag: '全量' }, { tag: '全量' }]); U.lines(ctx, W, [['2n−2 通，最优 ✓', 15, '#4ade80', true]], 210); } }
    ] } });

    /* 87 倒置的玻璃杯 */
  D({ g: g, no: 87, title: '倒置的玻璃杯', e: 'flip', strat: '奇偶/不变量',
    plain: 'n 个倒置玻璃杯，每次翻转 n−1 个：n 为奇数时倒置杯数奇偶性恒不变、无解；n 为偶数时第 i 步翻转除第 i 个外的全部，n 步全朝上且最优。',
    p: { init: [0, 0, 0, 0, 0, 0], cols: 6,
      ops: [
        { at: [], cap: 'n 个杯子全倒置；每次必须翻转 n−1 个（即只留 1 个不动）' },
        { at: [1, 2, 3, 4, 5], cap: '第 1 步：翻转除 1 号外的所有杯子' },
        { at: [0, 2, 3, 4, 5], cap: '第 2 步：翻转除 2 号外的所有杯子' },
        { at: [0, 1, 3, 4, 5], cap: '第 3 步：翻转除 3 号外的所有杯子' },
        { at: [0, 1, 2, 4, 5], cap: '第 4 步：翻转除 4 号外的所有杯子' },
        { at: [0, 1, 2, 3, 5], cap: '第 5 步：翻转除 5 号外的所有杯子' },
        { at: [0, 1, 2, 3, 4], cap: '第 6 步：翻转除 6 号外的所有杯子 → 全朝上 ✓' }
      ], cap: 'n 偶数可 n 步解决；n 奇数无解（奇偶不变量）' } });
/* 88 蟾蜍和青蛙 */
  D({ g: g, no: 88, title: '蟾蜍和青蛙', e: 'arrange', strat: '构造·交替推进',
    plain: '3 只蟾蜍和 3 只青蛙隔着 1 个空位对坐，蟾蜍只会右移、青蛙只会左移，可以走一格或跳过对方一只。交替"跳一步、滑一步"，15 步完成换位。',
    p: { init: ['蟾', '蟾', '蟾', '_', '蛙', '蛙', '蛙'], dark: true,
      colorOf: function (v) { return v === '蟾' ? '#4ade80' : v === '蛙' ? '#f87171' : '#131a38'; },
      textOf: function (v) { return v === '_' ? '' : v; },
      ops: [
        { t: 'mov', i: 2, j: 3, cap: '蟾滑一格' }, { t: 'mov', i: 4, j: 2, cap: '蛙跳过蟾' },
        { t: 'mov', i: 5, j: 4, cap: '蛙滑一格' }, { t: 'mov', i: 3, j: 5, cap: '蟾跳过蛙' },
        { t: 'mov', i: 1, j: 3, cap: '蟾跳过蛙' }, { t: 'mov', i: 0, j: 1, cap: '蟾滑一格' },
        { t: 'mov', i: 2, j: 0, cap: '蛙跳过蟾' }, { t: 'mov', i: 4, j: 2, cap: '蛙跳过蟾' },
        { t: 'mov', i: 6, j: 4, cap: '蛙跳过蟾' }, { t: 'mov', i: 5, j: 6, cap: '蟾滑一格' },
        { t: 'mov', i: 3, j: 5, cap: '蟾跳过蛙' }, { t: 'mov', i: 1, j: 3, cap: '蟾跳过蛙' },
        { t: 'mov', i: 2, j: 1, cap: '蛙滑一格' }, { t: 'mov', i: 4, j: 2, cap: '蛙跳过蟾' },
        { t: 'mov', i: 3, j: 4, cap: '蟾滑一格 → 换位完成 ✓' }
      ], cap: 'n 对共 (n+1)²−1 步' } });

    /* 89 纸牌交换 */
  D({ g: g, no: 89, title: '纸牌交换', e: 'board', strat: '构造·化归',
    plain: '(2n+1)² 棋盘上 W 只向右/下、B 只向左/上，互换成反色位置：化归为一维"蟾蛙换位"，先中间列、再逐行，共 2n(n+1)(n+2) 步。',
    p: { steps: [
      { cap: '(2n+1)×(2n+1) 板：W 只能向右/下、B 只能向左/上（跳过一个反色牌）', fn: function (ctx, W, Hh) { var b = [], r, c, n = 2; for (r = 0; r < 2 * n + 1; r++) { var row = []; for (c = 0; c < 2 * n + 1; c++) { if (r === n && c === n) row.push(''); else row.push(c <= (r < n ? n : n - (r === n ? 0 : -1)) && c < (r === n ? n : n + (r < n ? 1 : 0)) ? 'W' : 'B'); } b.push(row); } U.grid(ctx, W, Hh, b, { max: 38, txtColor: function (rr2, cc, v) { return v === 'W' ? '#dfe6f8' : '#fbbf24'; }, cellColor: function (rr2, cc, v) { return v === 'W' ? '#273469' : v === 'B' ? '#4a3a12' : '#05070f'; } }); U.lines(ctx, W, [['W 向右/下，B 向左/上', 13, '#5eead4', true]], 300); } },
      { cap: '目标：所有 W 与 B 互换到反色初始位置（跳过一个反色牌）', fn: function (ctx, W, Hh) { var b = [], r, c, n = 2; for (r = 0; r < 2 * n + 1; r++) { var row = []; for (c = 0; c < 2 * n + 1; c++) row.push(r === n && c === n ? '?' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { max: 38, txtColor: function () { return '#fbbf24'; } }); U.lines(ctx, W, [['W 全部去 B 的位置，反之亦然', 13, '#fbbf24', true]], 300); } },
      { cap: '直接二维推演太乱 → 化归：它就是 #88"蟾蛙换位"的二维版', fn: function (ctx, W, Hh) { var b = [], r, c, n = 2; for (r = 0; r < 2 * n + 1; r++) { var row = []; for (c = 0; c < 2 * n + 1; c++) row.push(c === n ? '↓' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { max: 38, txtColor: function () { return '#5eead4'; }, cellColor: function (rr2, cc) { return cc === n ? 'rgba(94,234,212,.18)' : null; } }); U.lines(ctx, W, [['一维算法可整体搬进二维', 13, '#5eead4', true]], 300); } },
      { cap: '第一步：把一维算法用于中间列（列内交换就位）', fn: function (ctx, W, Hh) { var b = [], r, c, n = 2; for (r = 0; r < 2 * n + 1; r++) { var row = []; for (c = 0; c < 2 * n + 1; c++) row.push(c === n ? '↓' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { max: 38, txtColor: function () { return '#fbbf24'; }, cellColor: function (rr2, cc) { return cc === n ? 'rgba(251,191,36,.18)' : null; } }); U.lines(ctx, W, [['中间列先完成换位', 13, '#fbbf24', true]], 300); } },
      { cap: '第二步：再逐行使用同一算法，每行 n²+2n 次', fn: function (ctx, W, Hh) { var b = [], r, c, n = 2; for (r = 0; r < 2 * n + 1; r++) { var row = []; for (c = 0; c < 2 * n + 1; c++) row.push(r === n ? '→' : ''); b.push(row); } U.grid(ctx, W, Hh, b, { max: 38, txtColor: function () { return '#fbbf24'; }, cellColor: function (rr2) { return rr2 === n ? 'rgba(251,191,36,.18)' : null; } }); U.lines(ctx, W, [['逐行推进，互不干扰', 13, '#8fa0c8']], 300); } },
      { cap: '答案：总移动 2n(n+1)(n+2) 次 ✓', fn: function (ctx, W, Hh) { var b = [], r, c, n = 2; for (r = 0; r < 2 * n + 1; r++) { var row = []; for (c = 0; c < 2 * n + 1; c++) { if (r === n && c === n) row.push(''); else row.push(c < (r < n ? n + 1 : n) ? 'B' : 'W'); } b.push(row); } U.grid(ctx, W, Hh, b, { max: 38, txtColor: function (rr2, cc, v) { return v === 'W' ? '#dfe6f8' : '#fbbf24'; }, cellColor: function (rr2, cc, v) { return v === 'W' ? '#273469' : v === 'B' ? '#4a3a12' : '#05070f'; } }); U.lines(ctx, W, [['答案：总移动 2n(n+1)(n+2) ✓', 14, '#4ade80', true]], 300); } }
    ] } });
  /* 90 座位重排 */
  D({ g: g, no: 90, title: '座位重排', e: 'board', strat: '生成排列',
    plain: '只许相邻小孩互换座位，枚举所有座次：相邻交换生成全排列，把 n 交替蛇行插入 (n−1) 排列，相邻两次只差一次交换。',
    p: { steps: [
      { cap: 'n 个小孩占着一排座位，只许相邻两人互换 → 枚举所有座次', fn: function (ctx, W) { U.row(ctx, W, 100, ['1', '2', '3']); U.lines(ctx, W, [['问题 = 相邻交换生成全部排列', 13, '#8fa0c8']], 190); } },
      { cap: '要求：相邻两次座次只差一次相邻交换（否则一步做不到）', fn: function (ctx, W) { U.row(ctx, W, 70, ['1', '2', '3']); U.row(ctx, W, 130, ['1', '3', '2'], [1, 2]); U.lines(ctx, W, [['排列序列要“平滑过渡”', 13, '#fbbf24', true]], 210); } },
      { cap: '例 n = 3：123 → 132 → 312 → 321 → 231 → 213，共 6 个', fn: function (ctx, W) { U.row(ctx, W, 60, ['1', '2', '3']); U.row(ctx, W, 105, ['1', '3', '2'], [1, 2]); U.row(ctx, W, 150, ['3', '1', '2'], [0, 1]); U.lines(ctx, W, [['相邻两次只差一次相邻交换', 13, '#5eead4', true]], 220); } },
      { cap: '算法：递归生成 (n−1) 排列，把 n 交替左→右、右→左蛇行插入', fn: function (ctx, W) { U.row(ctx, W, 70, ['3', '2', '1'], [0, 1]); U.row(ctx, W, 115, ['2', '3', '1'], [1, 2]); U.row(ctx, W, 160, ['2', '1', '3'], [2]); U.lines(ctx, W, [['3 交替蛇行插入，保证相邻平滑', 13, '#fbbf24', true]], 240); } },
      { cap: '答案：按此算法得到全部 n! 种座次 ✓', fn: function (ctx, W) { U.row(ctx, W, 100, ['共', '3!', '=', '6', '种'], [4]); U.lines(ctx, W, [['答案：全部 n! 种座次 ✓', 15, '#4ade80', true]], 200); } }
    ] } });
  /* 91 水平的和垂直的多米诺骨牌 */
  D({ g: g, no: 91, title: '水平的和垂直的多米诺骨牌', e: 'board', strat: '构造·整除',
    plain: 'n×n 平板用横竖骨牌平铺且两者数量相等：一对横+竖盖 4 格 → 4 | n²，n=2 构造不出，当且仅当 4 | n 可行。',
    p: { steps: [
      { cap: '目标：多米诺铺满 n×n，水平与垂直骨牌数量相等', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push(''); b.push(row); }
        U.grid(ctx, W, Hh, b, { max: 52 });
        U.lines(ctx, W, [['横骨牌数 = 竖骨牌数', 14, '#5eead4', true]], 290); } },
      { cap: '必要条件：一横一竖一对盖 4 格 → 总格数 4 | n²', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push(''); b.push(row); }
        var gg = U.grid(ctx, W, Hh, b, { max: 52, cellColor: function (rr2, cc) { return rr2 < 2 ? 'rgba(94,234,212,.20)' : 'rgba(251,191,36,.20)'; } });
        ctx.fillStyle = 'rgba(94,234,212,.45)'; H.rr(ctx, gg.x0 + 2, gg.y0 + 2, 2 * gg.cell - 4, gg.cell - 4, 6); ctx.fill();
        ctx.fillStyle = 'rgba(251,191,36,.45)'; H.rr(ctx, gg.x0 + 2 * gg.cell + 2, gg.y0 + gg.cell + 2, gg.cell - 4, 2 * gg.cell - 4, 6); ctx.fill();
        H.txt(ctx, '1 横 + 1 竖 = 4 格 → 4 | n² → n 必为偶数', W / 2, gg.y0 + 4 * gg.cell + 18, { size: 13, bold: true, color: '#fbbf24' }); } },
      { cap: '但 n = 2 不行：2×2 只能全横或全竖，凑不出 1+1', fn: function (ctx, W, Hh) {
        var gg = U.grid(ctx, W, Hh, [['—', '—'], ['—', '—']], { max: 60, txtColor: function () { return '#f87171'; } });
        H.txt(ctx, 'n = 2：无法各放 1 块 → 排除', W / 2, gg.y0 + 2 * gg.cell + 18, { size: 13, bold: true, color: '#f87171' }); } },
      { cap: 'n 为 4 的倍数时可构造：2×2 块内对角分横竖，平铺全板', fn: function (ctx, W, Hh) { var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push((r < 2) === (c < 2) ? '—' : '|'); b.push(row); } U.grid(ctx, W, Hh, b, { max: 52, txtColor: function (r, c, v) { return v === '—' ? '#5eead4' : '#fbbf24'; } }); } },
      { cap: '答案：当且仅当 n 能被 4 整除 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 4; r++) { var row = []; for (var c = 0; c < 4; c++) row.push((r < 2) === (c < 2) ? '—' : '|'); b.push(row); }
        U.grid(ctx, W, Hh, b, { max: 52, cellColor: function () { return '#1e3a34'; }, txtColor: function () { return '#4ade80'; } });
        U.lines(ctx, W, [['答案：n ≡ 0 (mod 4) ✓', 15, '#4ade80', true]], 290); } }
    ] } });
  /* 92 梯形平铺 */
  D({ g: g, no: 92, title: '梯形平铺', e: 'board', strat: '构造·计数',
    plain: '等边三角形每边 n 等分、砍掉顶角后用“三合一梯形”铺满：区域小三角形数 n²−1 须是 3 的倍数，当且仅当 3 ∤ n。',
    p: { steps: [
      { cap: '等边三角形每边 n 等分，砍掉顶角 → 剩一个梯形区域', fn: function (ctx, W, Hh) {
        var cs = 30, n = 4, y0 = 70, r, c;
        for (r = 1; r < n; r++) for (c = 0; c <= r; c++) if (r + c >= n - 1 && r + c <= 2 * n - 3) { ctx.fillStyle = '#273469'; H.rr(ctx, W / 2 + (c - r / 2) * cs - cs / 2, y0 + r * cs * 0.87 - cs / 2, cs - 2, cs - 2, 3); ctx.fill(); }
        U.lines(ctx, W, [['用“3 个小三角形拼成的梯形”铺满它', 13, '#8fa0c8']], 240); } },
      { cap: '必要条件：每块梯形盖 3 个小三角形 → 总数须是 3 的倍数', fn: function (ctx, W, Hh) { U.lines(ctx, W, [['区域小三角形数 = n² − 1', 15, '#8fa0c8'], ['需 3 | (n²−1)', 15, '#fbbf24', true]], 120, 46); } },
      { cap: 'n 是 3 的倍数时：n²−1 ≡ −1 (mod 3) → 除不尽 → 无解', fn: function (ctx, W, Hh) {
        var cs = 30, n = 4, y0 = 70, r, c;
        for (r = 1; r < n; r++) for (c = 0; c <= r; c++) if (r + c >= n - 1 && r + c <= 2 * n - 3) { ctx.fillStyle = '#7f3030'; H.rr(ctx, W / 2 + (c - r / 2) * cs - cs / 2, y0 + r * cs * 0.87 - cs / 2, cs - 2, cs - 2, 3); ctx.fill(); }
        U.lines(ctx, W, [['n = 3k：总数差 1，永远铺不满', 13, '#f87171', true]], 240); } },
      { cap: '3 ∤ n 时可构造：三色分组，每 3 个相邻小三角形拼一块梯形', fn: function (ctx, W, Hh) {
        var cs = 30, n = 4, y0 = 70, r, c, colors = ['#273469', '#1e3a34', '#3a2a50'];
        for (r = 1; r < n; r++) for (c = 0; c <= r; c++) if (r + c >= n - 1 && r + c <= 2 * n - 3) { ctx.fillStyle = colors[((r - c) % 3 + 3) % 3]; H.rr(ctx, W / 2 + (c - r / 2) * cs - cs / 2, y0 + r * cs * 0.87 - cs / 2, cs - 2, cs - 2, 3); ctx.fill(); }
        U.lines(ctx, W, [['三色分块：每 3 个小三角形一组', 13, '#8fa0c8']], 240); } },
      { cap: '答案：当且仅当 n 不能被 3 整除 ✓', fn: function (ctx, W, Hh) {
        var cs = 30, n = 4, y0 = 70, r, c;
        for (r = 1; r < n; r++) for (c = 0; c <= r; c++) if (r + c >= n - 1 && r + c <= 2 * n - 3) { ctx.fillStyle = '#1e3a34'; H.rr(ctx, W / 2 + (c - r / 2) * cs - cs / 2, y0 + r * cs * 0.87 - cs / 2, cs - 2, cs - 2, 3); ctx.fill(); }
        U.lines(ctx, W, [['答案：3 ∤ n 时可铺 ✓', 15, '#4ade80', true]], 240); } }
    ] } });
/* 93 击中战舰 */
  D({ g: g, no: 93, title: '击中战舰', e: 'board', strat: '穷举·稀疏采样',
    plain: '10×10 板上藏一艘 4×1 战舰（可横可竖）：按隔 4 的采样点开炮，任何 4 格长条必中一点，最少 24 炮保证命中。',
    p: { steps: [
      { cap: '10×10 板上藏着一艘 4×1 战舰：位置、朝向都未知', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, mk10(function () { return ''; }), { max: 34, checker: true }); } },
      { cap: '一炮一格太浪费：要用采样点"一网打尽"所有可能位置', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, mk10(function () { return ''; }), { max: 34, checker: true }); U.lines(ctx, W, [['目标：无论舰在哪，至少压中一个采样点', 13, '#8fa0c8']], 290); } },
      { cap: '采样策略：沿对角线方向每隔 4 格放一个点', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, mk10(function (r, c) { return (r + c) % 4 === 0 ? '●' : ''; }), { max: 34, checker: true, txtColor: function () { return '#fbbf24'; } }); U.lines(ctx, W, [['任意连续 4 格的长条必含一个点', 13, '#fbbf24', true]], 290); } },
      { cap: '横、竖两种朝向的战舰都被同样的点阵覆盖', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, mk10(function (r, c) { return (r + c) % 4 === 0 ? '●' : ''; }), { max: 34, checker: true, txtColor: function () { return '#f87171'; } }); U.lines(ctx, W, [['横舰、竖舰都逃不掉', 13, '#8fa0c8']], 290); } },
      { cap: '数采样点：24 个 → 最少 24 炮保证命中 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, mk10(function (r, c) { return (r + c) % 4 === 0 ? '●' : ''; }), { max: 34, checker: true, cellColor: function () { return '#1e3a34'; }, txtColor: function () { return '#4ade80'; } }); U.lines(ctx, W, [['答案：最少 24 炮 ✓', 15, '#4ade80', true]], 290); } }
    ] } });
  function mk10(fn) { var b = []; for (var r = 0; r < 10; r++) { var row = []; for (var c = 0; c < 10; c++) row.push(fn(r, c)); b.push(row); } return b; }

  /* 94 搜索排好序的表 */
  D({ g: g, no: 94, title: '搜索排好序的表', e: 'board', strat: '减治·阶梯搜索',
    plain: '矩阵每行每列都升序，找一个数。从右上角出发：比目标大就左移，比目标小就下移，每步排除一行或一列，O(m+n) 找到。',
    p: { steps: [
      { cap: '行列均升序的 4×4 表，找 7', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '3', '5', '8'], ['2', '4', '7', '9'], ['6', '7', '8', '10'], ['9', '11', '12', '13']], { max: 44 }); } },
      { cap: '右上角 8 > 7 → 左移', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '3', '5', '8'], ['2', '4', '7', '9'], ['6', '7', '8', '10'], ['9', '11', '12', '13']], { max: 44, cellColor: function (r, c) { return r === 0 && c === 3 ? '#7f3030' : null; } }); } },
      { cap: '5 < 7 → 下移…阶梯式逼近', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '3', '5', '8'], ['2', '4', '7', '9'], ['6', '7', '8', '10'], ['9', '11', '12', '13']], { max: 44, cellColor: function (r, c) { return (r === 0 && c === 2) ? '#7f3030' : null; } }); } },
      { cap: '命中 7 ✓（只走了 7 步，而非扫 16 格）', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '3', '5', '8'], ['2', '4', '7', '9'], ['6', '7', '8', '10'], ['9', '11', '12', '13']], { max: 44, cellColor: function (r, c) { return r === 1 && c === 2 ? '#1e3a34' : null; } }); } }
    ] } });

  /* 95 最大-最小称重 */
  D({ g: g, no: 95, title: '最大-最小称重', e: 'weigh', strat: '分治·锦标赛',
    plain: '4 枚硬币找最重和最轻，最少称几次？两两配对称，胜者争最大、败者争最小：4 次称量同时锁定两头。',
    p: { n: 4, title: '4 枚中同时找最重与最轻', steps: [
      { L: [1], R: [2], res: '>', note: '第 1 次：1 > 2（1 进"争最大"组，2 进"争最小"组）' },
      { L: [3], R: [4], res: '<', note: '第 2 次：3 < 4（4 争最大，3 争最小）' },
      { L: [1], R: [4], res: '>', note: '第 3 次：1 > 4 → 1 号最重' },
      { L: [2], R: [3], res: '<', note: '第 4 次：2 < 3 → 2 号最轻 ✓' }
    ] } });

  /* 96 平铺楼梯区域 */
  D({ g: g, no: 96, title: '平铺楼梯区域', e: 'board', strat: '构造·递归',
    plain: 'L 形三格骨牌铺楼梯：3 级楼梯 6 格恰好 2 块；大楼梯拆成小楼梯 + 一个拐角，递归铺到底。',
    p: { steps: [
      { cap: '3 级楼梯：1+2+3 = 6 格', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['■', '', ''], ['■', '■', ''], ['■', '■', '■']], { max: 48, txtColor: function () { return '#39437a'; } }); } },
      { cap: '一块 L 骨牌盖 3 格 → 6 格恰好需要 2 块', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['★', '', ''], ['★', '★', ''], ['■', '■', '■']], { max: 48, txtColor: function (r, c, v) { return v === '★' ? '#5eead4' : '#39437a'; } }); U.lines(ctx, W, [['6 ÷ 3 = 2 块，不多不少', 13, '#8fa0c8']], 280); } },
      { cap: '第 1 块：盖住左上拐角', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['★', '', ''], ['★', '★', ''], ['', '', '']], { max: 48, txtColor: function () { return '#5eead4'; } }); } },
      { cap: '第 2 块：盖住剩余 3 格 → 铺满 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['★', '', ''], ['★', '★', ''], ['●', '●', '●']], { max: 48, txtColor: function (r, c, v) { return v === '★' ? '#5eead4' : '#fbbf24'; } }); } },
      { cap: '推广：更大的楼梯 = 小楼梯 + 一个拐角，递归铺下去 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['★', '', '', ''], ['★', '★', '', ''], ['●', '●', '●', ''], ['●', '●', '●', '●']], { max: 40, txtColor: function (r, c, v) { return v === '★' ? '#5eead4' : '#fbbf24'; } }); U.lines(ctx, W, [['递归拆分，逐级铺满 ✓', 13, '#4ade80', true]], 300); } }
    ] } });

  /* 97 Topswops 游戏 */
  D({ g: g, no: 97, title: 'Topswops 游戏', e: 'arrange', strat: '模拟·循环',
    plain: '一叠牌顶牌是几，就把前几张整体翻面，直到顶牌变成 1。这个简单游戏的行为深不可测，但模拟它只需一个反转操作。',
    p: { init: [3, 1, 2],
      colorOf: function (v) { return ['#3b55a6', '#5274d6', '#8aa4f5'][v - 1]; },
      ops: [
        { t: 'rev', i: 0, j: 2, hl: [0, 2], cap: '顶牌是 3 → 反转前 3 张：3 1 2 → 2 1 3' },
        { t: 'rev', i: 0, j: 1, cap: '顶牌是 2 → 反转前 2 张：2 1 3 → 1 2 3' },
        { t: 'rev', i: 0, j: 0, cap: '顶牌是 1 → 游戏结束，共 2 步 ✓' }
      ], cap: '顶牌为 k 就反转前 k 张' } });

    /* 98 回文计数 */
  D({ g: g, no: 98, title: '回文计数', e: 'board', strat: '数学技巧·计数',
    plain: '菱形排列里读回文 WASITACATISAW：关于中央 C 对称，半程拼写数用 DP 翻倍累加，四块组合得 63,504 种读法。',
    p: { steps: [
      { cap: '规则：从任一 W 出发，沿上下左右相邻字母读完全词', fn: function (ctx, W) {
        var s = 'WASITACATISAW', i, cs = 36, x0 = W / 2 - (s.length - 1) * cs / 2;
        for (i = 0; i < s.length; i++) { var y = 130 + Math.abs(i - 6) * 24; H.circle(ctx, x0 + i * cs, y, 13, '#273469', '#5eead4'); H.txt(ctx, s[i], x0 + i * cs, y, { size: 11, bold: true, color: '#e8ecf8' }); }
        U.lines(ctx, W, [['字母可重复使用，方向任意', 13, '#8fa0c8']], 260); } },
      { cap: '对称拆解：每条读法关于中央 C 对称 → 数半程再平方', fn: function (ctx, W) {
        var s = 'WASITACATISAW', i, cs = 36, x0 = W / 2 - (s.length - 1) * cs / 2;
        for (i = 0; i < s.length; i++) { var y = 130 + Math.abs(i - 6) * 24; H.circle(ctx, x0 + i * cs, y, 13, i === 6 ? '#fbbf24' : '#273469', '#5eead4'); H.txt(ctx, s[i], x0 + i * cs, y, { size: 11, bold: true, color: i === 6 ? '#0b1020' : '#e8ecf8' }); }
        U.lines(ctx, W, [['菱形排列关于中央 C 对称', 13, '#8fa0c8']], 260); } },
      { cap: '半程 = 从中央 C 拼出 CATISAW 的方式数', fn: function (ctx, W) {
        var s = 'WASITACATISAW', i, cs = 36, x0 = W / 2 - (s.length - 1) * cs / 2;
        for (i = 0; i < s.length; i++) { var y = 130 + Math.abs(i - 6) * 24; H.circle(ctx, x0 + i * cs, y, 13, i === 6 ? '#fbbf24' : '#273469', '#5eead4'); H.txt(ctx, s[i], x0 + i * cs, y, { size: 11, bold: true, color: i === 6 ? '#0b1020' : '#e8ecf8' }); }
        U.lines(ctx, W, [['读法数 = （半程拼写数）²', 14, '#fbbf24', true]], 260); } },
      { cap: 'CATISAW 的拼写数用 DP（帕斯卡三角形）逐格累加', fn: function (ctx, W) {
        var s = 'WASITACATISAW', i, cs = 36, x0 = W / 2 - (s.length - 1) * cs / 2;
        for (i = 0; i < s.length; i++) { var y = 130 + Math.abs(i - 6) * 24; var v = i <= 6 ? Math.pow(2, i) : Math.pow(2, 12 - i); H.circle(ctx, x0 + i * cs, y, 13, '#273469', '#fbbf24'); H.txt(ctx, String(v), x0 + i * cs, y, { size: 9, bold: true, color: '#fbbf24' }); }
        U.lines(ctx, W, [['每格方式数向两侧翻倍（四方向）', 13, '#fbbf24', true]], 260); } },
      { cap: '菱形四个三角形组合 → 总读法 = 63,504 ✓', fn: function (ctx, W) {
        var s = 'WASITACATISAW', i, cs = 36, x0 = W / 2 - (s.length - 1) * cs / 2;
        for (i = 0; i < s.length; i++) { var y = 130 + Math.abs(i - 6) * 24; H.circle(ctx, x0 + i * cs, y, 13, '#1e3a34', '#4ade80'); H.txt(ctx, s[i], x0 + i * cs, y, { size: 11, bold: true, color: '#e8ecf8' }); }
        U.lines(ctx, W, [['答案：63,504 种读法 ✓', 15, '#4ade80', true]], 260); } }
    ] } });
/* 99 倒序排列 */
  D({ g: g, no: 99, title: '倒序排列', e: 'board', strat: '减治·奇偶',
    plain: '降序卡片只许交换"隔一张"的一对：同奇偶位置才能互换，奇数 n 可解（最少 (n−1)/4 次），偶数 n 无解。',
    p: { steps: [
      { cap: 'n 张卡片降序排列；只许交换"中间隔一张"的一对', fn: function (ctx, W) { U.row(ctx, W, 100, ['5', '4', '3', '2', '1']); U.lines(ctx, W, [['目标：变成升序', 13, '#8fa0c8']], 200); } },
      { cap: '观察：隔一张的两张 → 位置奇偶性相同，只能同奇偶互跳', fn: function (ctx, W) { U.row(ctx, W, 100, ['5', '4', '3', '2', '1'], null, function (v, i2) { return i2 % 2 === 0 ? '#4a3a12' : '#1e3a34'; }); U.lines(ctx, W, [['金底 = 奇数位，绿底 = 偶数位：只能同色互跳', 13, '#fbbf24', true]], 200); } },
      { cap: 'n 为偶数：最大编号在奇数位、需到偶数位 → 跨不了 → 无解', fn: function (ctx, W) { U.row(ctx, W, 100, ['4', '3', '2', '1'], [0, 3], function (v, i2) { return i2 % 2 === 0 ? '#4a3a12' : '#1e3a34'; }); U.lines(ctx, W, [['4 在奇数位、需到偶数位 → 无解', 14, '#f87171', true]], 200); } },
      { cap: 'n 为奇数：奇、偶数位各自独立排序（互不干扰）', fn: function (ctx, W) { U.row(ctx, W, 70, ['5', '4', '3', '2', '1'], [0, 2], function (v, i2) { return i2 % 2 === 0 ? '#4a3a12' : '#1e3a34'; }); U.row(ctx, W, 115, ['3', '4', '5', '2', '1'], [2, 4], function (v, i2) { return i2 % 2 === 0 ? '#4a3a12' : '#1e3a34'; }); U.lines(ctx, W, [['先排奇数位、再排偶数位', 13, '#8fa0c8']], 200); } },
      { cap: '完成：最少 (n−1)/4 次交换 ✓', fn: function (ctx, W) { U.row(ctx, W, 100, ['1', '2', '3', '4', '5'], null, function (v, i2) { return i2 % 2 === 0 ? '#1e3a34' : '#1e3a34'; }); U.lines(ctx, W, [['答案：奇数 n 可解，(n−1)/4 次 ✓', 14, '#4ade80', true]], 200); } }
    ] } });
  /* 100 骑士的走位 */
  D({ g: g, no: 100, title: '骑士的走位', e: 'board', strat: '数学技巧·计数',
    plain: '无限棋盘上骑士 n 步能到多少格：可达区是以起点为中心的八角形，分块计数得 R(n) = 7n² + 4n + 1（n≥3）。',
    p: { steps: [
      { cap: '骑士走 L 形：横竖 2 格 + 垂直 1 格，共 8 种跳法', fn: function (ctx, W, Hh) {
        var cs = 22, cx = W / 2, cy = 150, i, j;
        for (i = -4; i <= 4; i++) for (j = -4; j <= 4; j++) { ctx.fillStyle = (i + j + 200) % 2 ? '#101736' : '#161f45'; H.rr(ctx, cx + j * cs - cs / 2 + 0.5, cy + i * cs - cs / 2 + 0.5, cs - 1, cs - 1, 2); ctx.fill(); }
        [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(function (m) { H.circle(ctx, cx + m[1] * cs, cy + m[0] * cs, 6, '#fbbf24'); });
        H.circle(ctx, cx, cy, 7, '#5eead4');
        U.lines(ctx, W, [['骑士 1 步可达 8 格（金）', 13, '#5eead4', true]], 280); } },
      { cap: '奇偶规律：每步跳都换格色 → 奇数步只能到异色格', fn: function (ctx, W, Hh) {
        var cs = 22, cx = W / 2, cy = 150, i, j;
        for (i = -3; i <= 3; i++) for (j = -3; j <= 3; j++) { ctx.fillStyle = (i + j + 200) % 2 ? '#1e3a34' : '#101736'; H.rr(ctx, cx + j * cs - cs / 2 + 0.5, cy + i * cs - cs / 2 + 0.5, cs - 1, cs - 1, 2); ctx.fill(); }
        H.circle(ctx, cx, cy, 7, '#5eead4');
        U.lines(ctx, W, [['可达格色与步数同奇偶，区域仍连续扩张', 13, '#8fa0c8']], 280); } },
      { cap: 'n≥3：可达格构成以起点为中心的八角形', fn: function (ctx, W, Hh) {
        var cs = 22, cx = W / 2, cy = 150, i, j, cnt = 0;
        for (i = -4; i <= 4; i++) for (j = -4; j <= 4; j++) { var ok = Math.max(Math.abs(i), Math.abs(j)) + Math.min(Math.abs(i), Math.abs(j)) <= 5; ctx.fillStyle = ok ? (cnt++, '#1e3a34') : '#101736'; H.rr(ctx, cx + j * cs - cs / 2 + 0.5, cy + i * cs - cs / 2 + 0.5, cs - 1, cs - 1, 2); ctx.fill(); }
        H.circle(ctx, cx, cy, 7, '#5eead4');
        U.lines(ctx, W, [['八角形 = 矩形 + 上下梯形', 13, '#fbbf24', true]], 280); } },
      { cap: '分块计数：中间矩形 + 四个梯形，逐块加总', fn: function (ctx, W, Hh) {
        var cs = 22, cx = W / 2, cy = 150, i, j;
        for (i = -4; i <= 4; i++) for (j = -4; j <= 4; j++) { var ok = Math.max(Math.abs(i), Math.abs(j)) + Math.min(Math.abs(i), Math.abs(j)) <= 5; ctx.fillStyle = ok ? ((Math.abs(i) <= 1) ? '#273469' : '#1e3a34') : '#101736'; H.rr(ctx, cx + j * cs - cs / 2 + 0.5, cy + i * cs - cs / 2 + 0.5, cs - 1, cs - 1, 2); ctx.fill(); }
        H.circle(ctx, cx, cy, 7, '#5eead4');
        U.lines(ctx, W, [['矩形打底、梯形补角，逐块相加', 13, '#8fa0c8']], 280); } },
      { cap: '答案：R(n) = 7n² + 4n + 1（n≥3；R(1)=8、R(2)=33）✓', fn: function (ctx, W, Hh) {
        var cs = 22, cx = W / 2, cy = 150, i, j;
        for (i = -4; i <= 4; i++) for (j = -4; j <= 4; j++) { var ok = Math.max(Math.abs(i), Math.abs(j)) + Math.min(Math.abs(i), Math.abs(j)) <= 5; ctx.fillStyle = ok ? '#1e3a34' : '#101736'; H.rr(ctx, cx + j * cs - cs / 2 + 0.5, cy + i * cs - cs / 2 + 0.5, cs - 1, cs - 1, 2); ctx.fill(); }
        H.circle(ctx, cx, cy, 7, '#5eead4');
        U.lines(ctx, W, [['答案：R(n) = 7n² + 4n + 1 ✓', 15, '#4ade80', true]], 280); } }
    ] } });
})();
