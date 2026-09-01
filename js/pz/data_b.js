/* 第 2 章 · 谜题 51-100（全覆盖） */
(function () {
  var H = PZ.H, U = PZ.U, D = PZ.def, g = 'c';

  /* 51 缺失的数字 */
  D({ g: g, no: 51, title: '缺失的数字', e: 'board', strat: '数学技巧·求和',
    plain: '1~100 里少了一个数，只许扫一遍就找出来。算出应有的总和 5050，减去实际总和，差就是丢失的数。',
    p: { steps: [
      { cap: '1~100 中某个数字丢了', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, '…', '?', '…', 100]); } },
      { cap: '理论总和 = 100×101÷2 = 5050', fn: function (ctx, W) { U.lines(ctx, W, [['1 + 2 + … + 100 = 5050', 18, '#5eead4', true]], 130); } },
      { cap: '实际总和 5008 → 缺失 5050 − 5008 = 42 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['5050 − 5008 = 42', 22, '#fbbf24', true]], 130); } }
    ] } });

  /* 52 数三角形 */
  D({ g: g, no: 52, title: '数三角形', e: 'geo', strat: '穷举·系统计数',
    plain: '大三角形里套着若干条线，数一数总共有多少个三角形。诀窍是按"底边大小"分类系统地数，不重不漏。',
    p: { steps: [
      { cap: '从顶点引出射线，底边分成 3 段', fn: function (ctx, W, Hh) { tri(ctx, W, Hh); } },
      { cap: '每个三角形对应底边上一段区间 → 数区间即可', fn: function (ctx, W, Hh) { tri(ctx, W, Hh); H.txt(ctx, '区间数 = 3+2+1 = 6', W / 2, Hh - 40, { size: 14, bold: true, color: '#fbbf24' }); } },
      { cap: '共 6 个三角形：单段 3 个 + 双段 2 个 + 整段 1 个 ✓', fn: function (ctx, W, Hh) { tri(ctx, W, Hh); H.txt(ctx, '6 个三角形', W / 2, 60, { size: 18, bold: true, color: '#4ade80' }); } }
    ] } });
  function tri(ctx, W, Hh) {
    var ax = W / 2, ay = 50, yb = 250;
    var bs = [[W / 2 - 150, yb], [W / 2 - 50, yb], [W / 2 + 50, yb], [W / 2 + 150, yb]];
    ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2;
    bs.forEach(function (b) { H.line(ctx, ax, ay, b[0], b[1], '#5eead4', 2); });
    H.line(ctx, bs[0][0], yb, bs[3][0], yb, '#5eead4', 2);
  }

  /* 53 弹簧秤甄别假币（原书：n 枚硬币 1 枚假币，读数秤二分称重，最少 ⌈log₂n⌉ 次） */
  D({ g: g, no: 53, title: '弹簧秤甄别假币', e: 'board', strat: '减治·二分',
    plain: 'n 枚外观一致的硬币中有 1 枚假币（重量与真币 g 不同），用能精确读数的弹簧秤找出它，称重次数要最少。每次称一半：读数对得上"全真"就排除这半，否则假币就在这半——范围减半，⌈log₂n⌉ 次定位。',
    p: { steps: [
      { cap: 'n = 8 枚硬币，1 枚假币（重量 ≠ g）。每次称量把嫌疑范围减半', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5, 6, 7, 8]); U.lines(ctx, W, [['8 枚 → ⌈log₂8⌉ = 3 次足够', 13, '#8fa0c8']], 200); } },
      { cap: '第 1 次：称 1~4 号。读数 = 4g（全真）→ 假币在 5~8 号', fn: function (ctx, W) { U.row(ctx, W, 100, [1, 2, 3, 4], [0, 1, 2, 3]); U.row(ctx, W, 170, [5, 6, 7, 8]); U.lines(ctx, W, [['读数 = 4g → 排除左半', 14, '#fbbf24', true]], 240); } },
      { cap: '第 2 次：称 5~6 号。读数 ≠ 2g → 假币在 5、6 号中', fn: function (ctx, W) { U.row(ctx, W, 100, [5, 6], [0, 1]); U.row(ctx, W, 170, [7, 8]); U.lines(ctx, W, [['读数 ≠ 2g → 假币在 5、6 中', 14, '#fbbf24', true]], 240); } },
      { cap: '第 3 次：称 5 号。读数 ≠ g → 5 号是假币 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, [5], [0]); U.lines(ctx, W, [['读数 ≠ g → 假币 = 5 号', 16, '#4ade80', true], ['最少次数 = ⌈log₂n⌉', 14, '#8fa0c8']], 190, 36); } }
    ] } });

  /* 54 矩形切割（64=65 悖论） */
  D({ g: g, no: 54, title: '矩形切割', e: 'geo', strat: '几何·悖论',
    plain: '把 8×8 的正方形剪成 4 块重拼，竟然"变出"了 5×13 = 65 的面积？多出的 1 藏在新图形中间一条细长的缝隙里，斜率差了一点点。',
    p: { steps: [
      { cap: '8×8 正方形，面积 64', fn: function (ctx, W) {
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - 96, 69, 192, 192);
        H.txt(ctx, '8 × 8 = 64', W / 2, 165, { size: 16, bold: true }); } },
      { cap: '按斐波那契尺寸剪成 4 块（2 个梯形 + 2 个三角形）', fn: function (ctx, W) {
        var x0 = W / 2 - 96, y0 = 69, u = 24;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 8 * u, 8 * u);
        ctx.setLineDash([5, 4]); ctx.strokeStyle = '#f87171';
        H.line(ctx, x0, y0 + 3 * u, x0 + 3 * u, y0 + 3 * u, '#f87171', 2);
        H.line(ctx, x0 + 3 * u, y0, x0 + 3 * u, y0 + 3 * u, '#f87171', 2);
        H.line(ctx, x0 + 3 * u, y0 + 3 * u, x0 + 8 * u, y0 + 5 * u, '#f87171', 2);
        H.line(ctx, x0 + 5 * u, y0 + 5 * u, x0 + 5 * u, y0 + 8 * u, '#f87171', 2);
        ctx.setLineDash([]); } },
      { cap: '"拼成" 5×13 = 65？中间藏着一条面积 1 的细缝！', fn: function (ctx, W) {
        var x0 = W / 2 - 156, y0 = 105, u = 24;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 13 * u, 5 * u);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x0 + 3 * u, y0); ctx.lineTo(x0 + 5 * u, y0 + 2.5 * u); ctx.lineTo(x0 + 8 * u, y0 + 5 * u); ctx.stroke();
        H.txt(ctx, '5 × 13 = 65 ?  多出的 1 在细缝里', W / 2, y0 + 5 * u + 24, { size: 13, bold: true, color: '#fbbf24' }); } }
    ] } });

  /* 55 里程表之谜 */
  D({ g: g, no: 55, title: '里程表之谜', e: 'board', strat: '穷举·回文',
    plain: '里程表显示回文数 15951，再过几公里会出现下一个回文数？从里向外构造：16061 只要 110 公里就到。',
    p: { steps: [
      { cap: '当前读数 15951 是回文数', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 5, 9, 5, 1]); } },
      { cap: '下一个回文要万位=个位、千位=十位：16_61', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 6, '?', 6, 1], [2]); } },
      { cap: '中间取最小的 0 → 16061，距离 16061−15951 = 110 公里 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 6, 0, 6, 1], [0, 1, 2, 3, 4]); } }
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
      { cap: '第 1、2 月：各 1 对', fn: function (ctx, W) { U.row(ctx, W, 120, ['月1: 1', '月2: 1']); } },
      { cap: '之后每月 = 上月 + 上上月', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 1, 2, 3, 5, 8]); } },
      { cap: '一直推：13, 21, 34, 55…… 增长率趋向黄金比例', fn: function (ctx, W) { U.row(ctx, W, 120, [8, 13, 21, 34, 55, 89]); } }
    ] } });

  /* 58 二维排序 */
  D({ g: g, no: 58, title: '二维排序', e: 'board', strat: '迭代改进',
    plain: '把矩阵变有序：先排每一行，再排每一列，反复来回。每轮"逆序"都在减少，几轮之后行列全部有序。',
    p: { steps: [
      { cap: '初始矩阵：行列都乱', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['9', '2', '7'], ['4', '8', '1'], ['6', '3', '5']], { max: 56 }); } },
      { cap: '第 1 轮：先排每行', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['2', '7', '9'], ['1', '4', '8'], ['3', '5', '6']], { max: 56 }); } },
      { cap: '再排每列', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '4', '6'], ['2', '5', '8'], ['3', '7', '9']], { max: 56 }); } },
      { cap: '行列同时有序 → 收敛 ✓（迭代改进思想）', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '4', '6'], ['2', '5', '8'], ['3', '7', '9']], { max: 56, cellColor: function () { return '#1e3a34'; } }); } }
    ] } });

  /* 59 双色帽子 */
  D({ g: g, no: 59, title: '双色帽子', e: 'board', strat: '逻辑推理·公共知识',
    plain: '3 人各戴一顶帽子（3 白 2 黑中取），只能看别人的帽子。没人能立刻答出自己帽色，这份"沉默"本身就是信息，层层推理后都能猜出自己是白的。',
    p: { steps: [
      { cap: '3 白 2 黑共 5 顶，每人戴 1 顶，只能看别人', fn: function (ctx, W) { U.people(ctx, W, 120, ['甲', '乙', '丙']); } },
      { cap: '若甲看到两顶黑帽，立刻知道自己是白 → 甲沉默 ⇒ 乙丙不全黑', fn: function (ctx, W) { U.people(ctx, W, 120, ['甲', '乙', '丙'], [{}, { tag: '白?' }, { tag: '白?' }]); } },
      { cap: '乙同理再推一层；丙综合两份沉默 → 三人都推出自己戴白 ✓', fn: function (ctx, W) { U.people(ctx, W, 120, ['甲', '乙', '丙'], [{ tag: '白' }, { tag: '白' }, { tag: '白' }]); } }
    ] } });

  /* 60 硬币三角形变正方形 */
  D({ g: g, no: 60, title: '硬币三角形变正方形', e: 'geo', strat: '几何·变换',
    plain: '10 枚硬币摆成朝上的三角形，只移动 3 枚让它倒过来。把三个角上的硬币搬到对面即可。',
    p: { steps: [
      { cap: '硬币三角形，尖端朝上', fn: function (ctx, W, Hh) { coinTri(ctx, W, 0); } },
      { cap: '标记要移动的 3 枚（三个角）', fn: function (ctx, W, Hh) { coinTri(ctx, W, 1); } },
      { cap: '搬到对侧 → 三角形倒过来了 ✓', fn: function (ctx, W, Hh) { coinTri(ctx, W, 2); } }
    ] } });
  function coinTri(ctx, W, mode) {
    var cx = W / 2, y0 = 90, sp = 40;
    var rows = mode === 2 ? [[0], [-1, 1], [-2, 0, 2], [-1, 1, -3, 3].slice(0, 3)] : null;
    function dot(x, y, hot) { H.circle(ctx, x, y, 12, hot ? '#f87171' : '#fbbf24'); }
    if (mode === 2) {
      // 倒三角
      for (var r = 0; r < 4; r++) for (var k2 = 0; k2 <= r; k2++) dot(cx + (k2 - r / 2) * sp, y0 + (3 - r) * sp * 0.87 + 20, r === 3);
      return;
    }
    for (var r2 = 0; r2 < 4; r2++) for (var k = 0; k <= r2; k++) {
      var corner = (r2 === 0) || (r2 === 3 && (k === 0 || k === 3));
      dot(cx + (k - r2 / 2) * sp, y0 + r2 * sp * 0.87, mode === 1 && corner);
    }
  }

  /* 61 对角线上的棋子 */
  D({ g: g, no: 61, title: '对角线上的棋子', e: 'board', strat: '数学技巧·计数',
    plain: 'n×n 棋盘的主对角线穿过多少个小方格？答案是 n + n − gcd(n,n) = n。8×8 的对角线恰好穿过 8 格。',
    p: { steps: [
      { cap: '8×8 棋盘，主对角线穿过多方格？', fn: function (ctx, W, Hh) { diagGrid(ctx, W, Hh, 8, []); } },
      { cap: '对角线每进入新格必跨过一条网格线', fn: function (ctx, W, Hh) { diagGrid(ctx, W, Hh, 8, [0, 1, 2, 3]); } },
      { cap: '共穿过 8 格：公式 2n − gcd(n,n) = n ✓', fn: function (ctx, W, Hh) { diagGrid(ctx, W, Hh, 8, [0, 1, 2, 3, 4, 5, 6, 7]); } }
    ] } });
  function diagGrid(ctx, W, Hh, n, hot) {
    var b = [];
    for (var r = 0; r < n; r++) { var row = []; for (var c = 0; c < n; c++) row.push(hot.indexOf(r) >= 0 && r === c ? '◆' : ''); b.push(row); }
    U.grid(ctx, W, Hh, b, { checker: true, txtColor: function () { return '#fbbf24'; } });
  }

  /* 62 硬币收集 */
  D({ g: g, no: 62, title: '硬币收集', e: 'griddp', strat: '动态规划',
    plain: '机器人从左上走到右下收集金币，只许向右或向下。动态规划：每格记"到这里最多能收几枚 = 本格金币 + max(上方, 左方)"。',
    p: { rows: 5, cols: 5, mode: 'max', coins: true,
      val: function (r, c) { return ((r * 3 + c) % 4 === 0) ? 1 : 0; } } });

  /* 63 加减归零（原书：1~n 填 ± 号使总和为 0，哪些 n 可行？答案 n≡0 或 3 mod 4） */
  D({ g: g, no: 63, title: '加减归零', e: 'board', strat: '奇偶/不变量',
    plain: '用符号 + 和 − 填 1~n 这 n 个整数，使代数和为 0。找出所有有解的 n 值。关键：总和 S = n(n+1)/2 必须为偶数才能分成相等两半，且一半要能用部分数字凑出——答案是 n 为 4 的倍数或 n+1 为 4 的倍数（即 n ≡ 0 或 3 mod 4）。',
    p: { steps: [
      { cap: '问题：给 1~n 配 +/− 号使总和 = 0，哪些 n 可行？', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, '…', 'n']); } },
      { cap: '必要条件：总和 S = n(n+1)/2 必须为偶数，才能分成相等的两半', fn: function (ctx, W) { U.lines(ctx, W, [['n(n+1)/2 为偶数 ⇔ n ≡ 0 或 3 (mod 4)', 16, '#fbbf24', true]], 130); } },
      { cap: '例：n = 9 → S = 45（奇）无解；n = 8 → S = 36，取 3+7+8 = 18 变负号 → 和为 0 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['9 无解；8 可行：+1+2−3+4+5+6−7−8 = 0', 15, '#4ade80', true], ['答案：n ≡ 0 或 3 (mod 4)', 16, '#fbbf24', true]], 110, 38); } }
    ] } });

  /* 64 构建八边形 */
  D({ g: g, no: 64, title: '构建八边形', e: 'geo', strat: '几何构造',
    plain: '怎么从正方形得到正八边形？把四个角各切掉一个等腰直角三角形，切口长度取好比例，八条边就一样长了。',
    p: { steps: [
      { cap: '从正方形出发', fn: function (ctx, W) { ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - 95, 70, 190, 190); } },
      { cap: '四角各切一个等腰直角三角形', fn: function (ctx, W) {
        var x0 = W / 2 - 95, y0 = 70, s = 190, t = 56;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, s, s);
        ctx.setLineDash([5, 4]); ctx.strokeStyle = '#f87171';
        H.line(ctx, x0 + t, y0, x0, y0 + t, '#f87171', 2); H.line(ctx, x0 + s - t, y0, x0 + s, y0 + t, '#f87171', 2);
        H.line(ctx, x0, y0 + s - t, x0 + t, y0 + s, '#f87171', 2); H.line(ctx, x0 + s - t, y0 + s, x0 + s, y0 + s - t, '#f87171', 2);
        ctx.setLineDash([]); } },
      { cap: '切完即正八边形：8 条边等长 ✓', fn: function (ctx, W) {
        var x0 = W / 2 - 95, y0 = 70, s = 190, t = 56;
        ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2.5; ctx.beginPath();
        ctx.moveTo(x0 + t, y0); ctx.lineTo(x0 + s - t, y0); ctx.lineTo(x0 + s, y0 + t); ctx.lineTo(x0 + s, y0 + s - t);
        ctx.lineTo(x0 + s - t, y0 + s); ctx.lineTo(x0 + t, y0 + s); ctx.lineTo(x0, y0 + s - t); ctx.lineTo(x0, y0 + t);
        ctx.closePath(); ctx.stroke(); } }
    ] } });

  /* 65 猜密码 */
  D({ g: g, no: 65, title: '猜密码', e: 'board', strat: '减治·逐位',
    plain: '三位数字密码锁，转轮反馈"对不对"。别从 000 试到 999：逐位破解，每位最多 10 次，总共最多 30 次开锁。',
    p: { steps: [
      { cap: '三位密码，每次尝试得到"某位对不对"的反馈', fn: function (ctx, W) { U.row(ctx, W, 120, ['?', '?', '?']); } },
      { cap: '先固定后两位，转动第一位 → 最多 10 次定下第 1 位', fn: function (ctx, W) { U.row(ctx, W, 120, ['7', '?', '?'], [0]); } },
      { cap: '同理定第 2、3 位 → 最多 10+10+10 = 30 次 ✓', fn: function (ctx, W) { U.row(ctx, W, 120, ['7', '2', '9'], [0, 1, 2]); } }
    ] } });

  /* 66 留下的数字 */
  D({ g: g, no: 66, title: '留下的数字', e: 'board', strat: '奇偶/不变量',
    plain: '黑板上写着 1~100，每次擦掉两个数、写上它们的差。最后剩下的数是奇是偶？总和的奇偶性是不变量：5050 为偶，最后剩下的必是偶数。',
    p: { steps: [
      { cap: '1~100，每次擦两数、写上它们的差', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, '…', 100]); } },
      { cap: '擦 a、b 写 |a−b|：总和改变 a+b−|a−b|，是偶数 → 奇偶不变', fn: function (ctx, W) { U.lines(ctx, W, [['初始总和 5050（偶）', 17, '#5eead4', true], ['每步总和变化为偶数 → 奇偶性守恒', 16, '#fbbf24', true]], 110, 38); } },
      { cap: '最后剩一个数，与 5050 同奇偶 → 必是偶数 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['剩下的数是偶数', 20, '#4ade80', true]], 130); } }
    ] } });

  /* 67 均分减少 */
  D({ g: g, no: 67, title: '均分减少', e: 'board', strat: '数学技巧·平均数',
    plain: '1~10 的平均数是 5.5。擦掉一个数后平均数变了多少？擦掉比平均数大的数，平均数就下降，平均数被"拉向"留下的那一边。',
    p: { steps: [
      { cap: '1~10 的平均数 = 55 ÷ 10 = 5.5', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); } },
      { cap: '擦掉 10：新平均 = 45 ÷ 9 = 5（下降）', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5, 6, 7, 8, 9]); } },
      { cap: '擦掉大于平均的数 → 平均下降；反之上升 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['擦 10 → 5.0 擦 1 → 6.0', 17, '#fbbf24', true]], 130); } }
    ] } });

  /* 68 数位求和 */
  D({ g: g, no: 68, title: '数位求和', e: 'board', strat: '数学技巧·按位统计',
    plain: '把 1~999 所有数字的各位数字加起来是多少？按位统计：个位上 0~9 各出现 100 次，十位百位同理，答案是 45×100×3 = 13500。',
    p: { steps: [
      { cap: '求 1~999 所有数字的数位之和', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, '…', 998, 999]); } },
      { cap: '补齐 000~999：每一位上 0~9 各出现 100 次', fn: function (ctx, W) { U.lines(ctx, W, [['每位贡献 (0+1+…+9) × 100 = 4500', 17, '#5eead4', true]], 130); } },
      { cap: '三个数位 → 4500 × 3 = 13500 ✓（补 000 不改变和）', fn: function (ctx, W) { U.lines(ctx, W, [['13500', 26, '#fbbf24', true]], 130); } }
    ] } });

  /* 69 扇区上的筹码 */
  D({ g: g, no: 69, title: '扇区上的筹码', e: 'geo', strat: '奇偶/不变量',
    plain: '圆盘分成几个扇区，筹码只能移到相邻空扇区。想交换两枚筹码的位置？奇偶不变量说：有些目标状态永远到不了。',
    p: { steps: [
      { cap: '6 个扇区，筹码只能滑到相邻空位', fn: function (ctx, W, Hh) { sector(ctx, W, Hh, [1, 0, 0, 2, 0, 0]); } },
      { cap: '移动不改变两枚筹码的"环绕顺序"', fn: function (ctx, W, Hh) { sector(ctx, W, Hh, [0, 0, 1, 0, 2, 0]); } },
      { cap: '想交换红蓝顺序 → 不可能（顺序是不变量）✓', fn: function (ctx, W, Hh) { sector(ctx, W, Hh, [2, 0, 0, 1, 0, 0]); H.txt(ctx, '红蓝的相对顺序永远不变', W / 2, Hh - 40, { size: 13, bold: true, color: '#fbbf24' }); } }
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
      { cap: '8 枚硬币：○○○○○○○○', fn: function (ctx, W) { coinRow(ctx, W, [[0, 0], [0, 0], [0, 0], [0, 0]]); } },
      { cap: '规则：跳过恰好 2 枚硬币（或空格），落点成对', fn: function (ctx, W) { coinRow(ctx, W, [[0, 0], [0, 1], [0, 0], [0, 0]]); } },
      { cap: '4 步之后：每堆恰好 2 枚 ✓（跳法：1→5, 7→3, 4→8, 2→6）', fn: function (ctx, W) { coinRow(ctx, W, [[1, 1], [1, 1], [1, 1], [1, 1]]); } }
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
      { cap: '每行每列都要有标记格，最少标几格？', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']], { max: 52 }); } },
      { cap: '下界：4 行各行至少 1 个 → 至少 4 格', fn: function (ctx, W) { U.lines(ctx, W, [['下界 = 行数 = 4', 17, '#fbbf24', true]], 130); } },
      { cap: '对角线放 4 个正好达标 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['★', '', '', ''], ['', '★', '', ''], ['', '', '★', ''], ['', '', '', '★']], { max: 52, txtColor: function () { return '#4ade80'; } }); } }
    ] } });

  /* 72 标记方格 II */
  D({ g: g, no: 72, title: '标记方格 II', e: 'board', strat: '构造·周期性',
    plain: '加强版：8×8 棋盘上每个 2×2 小方块都要含一个标记格。按"隔行隔列"的周期模式放 16 个，既充分又必要。',
    p: { steps: [
      { cap: '每个 2×2 区域都要含标记格', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['?', '?'], ['?', '?']], { max: 56 }); } },
      { cap: '棋盘可分成 16 个互不相交的 2×2 → 至少 16 格', fn: function (ctx, W) { U.lines(ctx, W, [['下界 = 16', 17, '#fbbf24', true]], 130); } },
      { cap: '隔行隔列周期放置恰好 16 格 → 最优 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 0; r < 8; r++) { var row = []; for (var c = 0; c < 8; c++) row.push(r % 2 === 1 && c % 2 === 1 ? '★' : ''); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, txtColor: function () { return '#4ade80'; } }); } }
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
    plain: '仓库建在一条路的哪个位置，到 4 个客户的总运输距离最短？答案在中位数区间：建在中间两个客户之间的任何位置都一样好。',
    p: { steps: [
      { cap: '客户在 2、3、6、9 号位置', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 10, [2, 3, 6, 9]); } },
      { cap: '建在两头会被远处的客户拖走成本', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 10, [2, 3, 6, 9], [{ v: 9, color: '#f87171', label: '贵' }]); } },
      { cap: '中位数区间 [3, 6]：总距离恒为 10，最优 ✓', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 10, [2, 3, 6, 9], [{ v: 4, color: '#4ade80', label: '最优区' }]); } }
    ] } });

  /* 75 加油站检查问题 */
  D({ g: g, no: 75, title: '加油站检查问题', e: 'geo', strat: '贪心·环路',
    plain: '环形公路上一圈加油站，总油量刚好够跑一圈。从哪个站出发能跑完全程？贪心：从"油量缺口最大"的下一站出发即可。',
    p: { steps: [
      { cap: '环形路线 + 4 个加油站，总油量 = 总路程', fn: function (ctx, W, Hh) { ring(ctx, W, Hh, -1); } },
      { cap: '逐个模拟：中途油量变负就失败，换下一站', fn: function (ctx, W, Hh) { ring(ctx, W, Hh, 0); } },
      { cap: '从"累计缺口最大处"的下一站出发 → 全程油量不为负 ✓', fn: function (ctx, W, Hh) { ring(ctx, W, Hh, 2); } }
    ] } });
  function ring(ctx, W, Hh, mode) {
    var cx = W / 2, cy = Hh / 2 - 6, R = 100;
    ctx.strokeStyle = '#39437a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    var names = ['站1', '站2', '站3', '站4'];
    for (var k = 0; k < 4; k++) {
      var a = -Math.PI / 2 + k * Math.PI / 2;
      var x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      H.circle(ctx, x, y, 16, mode === 2 && k === 1 ? '#4ade80' : '#273469', '#5eead4');
      H.txt(ctx, names[k], x, y, { size: 10, bold: true });
    }
    if (mode === 0) H.txt(ctx, '模拟行驶中…', cx, cy, { size: 13, color: '#fbbf24' });
    if (mode === 2) H.txt(ctx, '起点：站2', cx, cy, { size: 13, bold: true, color: '#4ade80' });
  }

  /* 76 高效的车 */
  D({ g: g, no: 76, title: '高效的车', e: 'board', strat: '贪心·接力',
    plain: '一箱油只够跑半程，怎么穿越整段沙漠？在路上设临时储油点，来回接力运油，贪心地让每一段都"恰好够用"。',
    p: { steps: [
      { cap: '满油跑 500 公里，沙漠宽 1000 公里', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 1000, [0, 500, 1000]); } },
      { cap: '先在中点前设储油点，多次往返囤油', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 1000, [0, 333, 500, 1000], [{ v: 333, color: '#fbbf24', label: '油库' }]); } },
      { cap: '接力推进：每段消耗最小化 → 全程穿越 ✓', fn: function (ctx, W) { U.axis(ctx, W, 150, 0, 1000, [0, 333, 666, 1000], [{ v: 1000, color: '#4ade80', label: '到达' }]); } }
    ] } });

  /* 77 模式搜索 */
  D({ g: g, no: 77, title: '模式搜索', e: 'board', strat: '变治·KMP思想',
    plain: '在长串里找模式 "ABA"。朴素法每次只挪 1 格；聪明的办法利用已匹配的信息："ABA" 失配时往往能一次多挪好几格。',
    p: { steps: [
      { cap: '在 ABABABA 中找 ABA', fn: function (ctx, W) { U.row(ctx, W, 100, 'ABABABA'.split('')); U.row(ctx, W, 160, 'ABA'.split('')); } },
      { cap: '第 1 处命中（位置 1）', fn: function (ctx, W) { U.row(ctx, W, 100, 'ABABABA'.split(''), [0, 1, 2]); U.row(ctx, W, 160, 'ABA'.split('')); } },
      { cap: '利用重叠前后缀：模式一次跳 2 格继续找', fn: function (ctx, W) { U.row(ctx, W, 100, 'ABABABA'.split(''), [2, 3, 4]); U.row(ctx, W, 160, 'ABA'.split('')); } },
      { cap: '共命中 3 处：位置 1、3、5 ✓', fn: function (ctx, W) { U.row(ctx, W, 100, 'ABABABA'.split(''), [4, 5, 6]); U.lines(ctx, W, [['命中 3 次', 16, '#4ade80', true]], 210); } }
    ] } });

  /* 78 直三格板平铺 */
  D({ g: g, no: 78, title: '直三格板平铺', e: 'board', strat: '三色/不变量',
    plain: '1×3 的直条骨牌铺棋盘，用三色循环染色：每块骨牌必盖三色各一。数一数三色格子是否相等，立刻知道能不能铺。',
    p: { steps: [
      { cap: '直三格骨牌 = 1×3 的长条', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['■', '■', '■']], { max: 56, txtColor: function () { return '#5eead4'; } }); } },
      { cap: '按列三色循环染色：每块骨牌必盖三色各一', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['A', 'B', 'C', 'A'], ['A', 'B', 'C', 'A'], ['A', 'B', 'C', 'A']], { txtColor: function (r, c) { return ['#5eead4', '#fbbf24', '#f87171'][c % 3]; } }); } },
      { cap: '三色格数不等 → 无法铺满；相等才有机会 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['统计 A、B、C 三色格数', 16, '#8fa0c8'], ['不等 → 一票否决', 17, '#4ade80', true]], 120, 38); } }
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
  D({ g: g, no: 80, title: '王子之旅', e: 'knight', strat: '回溯·启发式',
    plain: '王子骑骑士巡游 5×5 领地，每块地恰好踏足一次。Warnsdorff 规则：下一跳永远选"出口最少"的格子，避免把自己走死。',
    p: { n: 5, mode: 'tour', start: [2, 2], cap: '从中心出发的巡游' } });

  /* 81 再论名人问题 */
  D({ g: g, no: 81, title: '再论名人问题', e: 'board', strat: '减治·优化',
    plain: '名人问题的最优解：每次提问淘汰一人，n−1 问后只剩候选者；再花至多 2(n−1) 问验证。整体 O(n)，不可能更快，每问最多排除一人。',
    p: { steps: [
      { cap: '6 人中找名人', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D', 'E', 'F']); } },
      { cap: '两两淘汰赛式提问：5 问剩 1 人', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D', 'E', 'F'], [{ out: 1 }, { out: 1 }, { out: 1 }, {}, { out: 1 }, { out: 1 }]); } },
      { cap: '验证 D：问"所有人认识 D 吗"+"D 认识谁吗" → 确认 ✓', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D', 'E', 'F'], [{ out: 1 }, { out: 1 }, { out: 1 }, { tag: '名人' }, { out: 1 }, { out: 1 }]); } }
    ] } });

  /* 82 头像朝上 */
  D({ g: g, no: 82, title: '头像朝上', e: 'flip', strat: '奇偶/不变量',
    plain: '6 枚硬币 3 正 3 反，每次必须同时翻转相邻 2 枚，能全变正面吗？不能！每次翻转改变正面数 ±2 或 0，奇偶性不变：3 是奇数，6 是偶数。',
    p: { init: [1, 0, 1, 0, 1, 0], cols: 6,
      ops: [
        { at: [], cap: '3 正 3 反，每次必须翻相邻 2 枚' },
        { at: [0, 1], cap: '试翻第 1、2 枚：正面数 3→2（变化为偶）' },
        { at: [2, 3], cap: '再试：正面数偶偶交替，永远是偶数…但目标 6 是偶数？注意初始是 3' },
        { at: [4, 5], cap: '奇偶不变量：3（奇）永远到不了 6（偶）→ 无解 ✓' }
      ], cap: '奇偶不变量一票否决' } });

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
  D({ g: g, no: 85, title: '散布谣言 I', e: 'board', strat: '倍增·并行',
    plain: '一个谣言要让 8 个人都知道，每轮每人只能打一个电话（通话双方共享全部消息）。消息数每轮翻倍：1→2→4→8，3 轮搞定。',
    p: { steps: [
      { cap: '第 0 轮：只有 1 人知情', fn: function (ctx, W) { U.people(ctx, W, 130, ['1', '2', '3', '4', '5', '6', '7', '8'], [{ color: '#4ade80' }]); } },
      { cap: '第 1~2 轮：知情者两两打电话，人数翻倍', fn: function (ctx, W) { U.people(ctx, W, 130, ['1', '2', '3', '4', '5', '6', '7', '8'], [{ color: '#4ade80' }, { color: '#4ade80' }, { color: '#4ade80' }, { color: '#4ade80' }]); } },
      { cap: '第 3 轮：8 人全知道 ✓（log2 轮）', fn: function (ctx, W) { U.people(ctx, W, 130, ['1', '2', '3', '4', '5', '6', '7', '8'], [{ color: '#4ade80' }, { color: '#4ade80' }, { color: '#4ade80' }, { color: '#4ade80' }, { color: '#4ade80' }, { color: '#4ade80' }, { color: '#4ade80' }, { color: '#4ade80' }]); } }
    ] } });

  /* 86 散布谣言 II */
  D({ g: g, no: 86, title: '散布谣言 II', e: 'board', strat: '分治·聚合',
    plain: '升级版：n 个人各持一条独家消息，要让所有人知道全部 n 条。先"收集"到中心（n−1 通电话），再"广播"回去（n−1 通），共 2n−2 通。',
    p: { steps: [
      { cap: '每人一条独家消息', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁']); } },
      { cap: '收集阶段：消息逐级汇聚到一人手中', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁'], [{ tag: '全量' }]); } },
      { cap: '广播阶段：再由他分发 → 2(n−1) 通电话 ✓', fn: function (ctx, W) { U.people(ctx, W, 130, ['甲', '乙', '丙', '丁'], [{ tag: '全量' }, { tag: '全量' }, { tag: '全量' }, { tag: '全量' }]); } }
    ] } });

  /* 87 倒置的玻璃杯 */
  D({ g: g, no: 87, title: '倒置的玻璃杯', e: 'flip', strat: '贪心·相邻翻转',
    plain: '7 个玻璃杯有几个倒扣着，每次必须同时翻转相邻的 2 个，全部摆正。从第一个倒扣的杯子开始，带着"坑"一路向右推平。',
    p: { kind: 'cup', init: [1, 1, 0, 1, 0, 1, 1], cols: 7,
      ops: [
        { at: [2, 3], cap: '翻第 3、4 个：坑移到第 4 位' },
        { at: [3, 4], cap: '再翻第 4、5 个：两个坑抵消 → 全部立正 ✓' }
      ], cap: '把倒扣的杯子向右"搬运"抵消' } });

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
  D({ g: g, no: 89, title: '纸牌交换', e: 'arrange', strat: '变治·区间反转',
    plain: '把左半叠牌和右半叠牌整体互换，只许做"翻转一段"这一个动作？反转整个区间一次到位，很多交换问题都能变成反转问题。',
    p: { init: ['A', 'A', 'A', '空', 'B', 'B', 'B'], dark: true,
      colorOf: function (v) { return v === 'A' ? '#5eead4' : v === 'B' ? '#f87171' : '#131a38'; },
      textOf: function (v) { return v === '空' ? '' : v; },
      ops: [
        { t: 'rev', i: 0, j: 6, hl: [0, 6], cap: '反转整个区间：AAA 与 BBB 位置整体互换' },
        { t: 'rev', i: 0, j: 2, cap: '把 B 段再反转回正序' },
        { t: 'rev', i: 4, j: 6, cap: '把 A 段反转回正序 → 交换完成 ✓' }
      ] } });

  /* 90 座位重排 */
  D({ g: g, no: 90, title: '座位重排', e: 'arrange', strat: '循环移位',
    plain: '圆桌边 5 个人要整体顺移一个座位。与其每人挪一次，不如把它看成一个"循环"，用一次移动+空位传递完成。',
    p: { init: ['甲', '乙', '丙', '丁', '戊'], dark: true,
      colorOf: function () { return '#3b55a6'; },
      ops: [
        { t: 'mov', i: 0, j: 5, cap: '甲移到队尾（等价于整体左移一位）' },
        { t: 'mov', i: 0, j: 1, cap: '微调归位：乙甲相邻…继续传递' }
      ], cap: '循环移位：k 次交换完成 n 人轮换' } });

  /* 91 水平的和垂直的多米诺骨牌 */
  D({ g: g, no: 91, title: '水平的和垂直的多米诺骨牌', e: 'board', strat: '奇偶/不变量',
    plain: '6×6 棋盘用多米诺铺满，水平牌和垂直牌的数量一定都是偶数。为什么？用"奇偶行染色"数一数就知道。',
    p: { steps: [
      { cap: '6×6 铺满 18 张多米诺', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', ''], ['', '', '', '', '', '']], { checker: true, max: 34 }); } },
      { cap: '把奇数行染黑：每张水平牌盖 0 或 2 个黑格，垂直牌盖 1 个', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['■', '■', '■'], ['', '', ''], ['■', '■', '■'], ['', '', '']], { max: 40, cellColor: function (r) { return r % 2 === 0 ? '#232c56' : '#101736'; }, txtColor: function () { return '#fbbf24'; } }); } },
      { cap: '黑格共 18 个（偶）→ 垂直牌数量必须是偶数；水平牌同理 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['垂直牌数 = 黑格数的配对 → 必为偶数', 16, '#4ade80', true]], 130); } }
    ] } });

  /* 92 梯形平铺 */
  D({ g: g, no: 92, title: '梯形平铺', e: 'board', strat: '构造·递推',
    plain: '楼梯形区域（第 1 行 1 格、第 2 行 2 格……）能用直三格骨牌铺吗？按 3 的倍数分段构造，从最小的楼梯递推着铺。',
    p: { steps: [
      { cap: '楼梯形：1+2+3+4+5 = 15 格', fn: function (ctx, W, Hh) { stairs(ctx, W, Hh, []); } },
      { cap: '15 = 5 块直三格骨牌；从拐角处开始铺', fn: function (ctx, W, Hh) { stairs(ctx, W, Hh, [0]); } },
      { cap: '逐层铺满：每 3 格一组沿楼梯咬合 ✓', fn: function (ctx, W, Hh) { stairs(ctx, W, Hh, [0, 1, 2, 3, 4]); } }
    ] } });
  function stairs(ctx, W, Hh, groups) {
    var u = 36, x0 = W / 2 - 2.5 * u, y0 = Hh / 2 - 2.5 * u;
    var pal = ['#5eead4', '#818cf8', '#fbbf24', '#f87171', '#4ade80'];
    var gi = 0;
    for (var r = 0; r < 5; r++) for (var c = 0; c <= r; c++) {
      ctx.fillStyle = groups.length && gi < 15 ? pal[Math.floor(gi / 3) % 5] : '#1b2450';
      H.rr(ctx, x0 + c * u + 2, y0 + r * u + 2, u - 4, u - 4, 4); ctx.fill();
      gi++;
    }
  }

  /* 93 击中战舰（原书：10×10 板、4×1 战舰，最少 24 炮） */
  D({ g: g, no: 93, title: '击中战舰', e: 'board', strat: '穷举·稀疏采样',
    plain: '在 10×10 的板上，要击中一艘 4×1（或 1×4）的战舰最少需要开火几次？战舰可能处在任意位置、方向可横可竖。答案：24 炮——战舰只有 24 个可能的"条带"位置，精心选择采样点开火，任何 4 格长条必压中至少一个采样点；少于 24 炮无法保证命中。',
    p: { steps: [
      { cap: '10×10 板，藏着一艘 4×1 的战舰（可横可竖、位置任意）', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, mk10(function () { return ''; }), { max: 34, checker: true }); } },
      { cap: '按采样点开火：任何长度 4 的条状船必压中至少一个采样点', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, mk10(function (r, c) { return (r + c) % 4 === 0 ? '●' : ''; }), { max: 34, checker: true, txtColor: function () { return '#f87171'; } }); } },
      { cap: '战舰的 24 个可能位置使下界为 24 → 最少 24 炮保证命中 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['最少 24 炮（8×8 版为 21 炮）', 18, '#4ade80', true]], 130); } }
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
    plain: '用 L 形三格骨牌铺 3 级楼梯（6 格）：恰好 2 块。更大的楼梯可以拆成小楼梯加一个拐角，递归地铺。',
    p: { steps: [
      { cap: '3 级楼梯：1+2+3 = 6 格', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['■', '', ''], ['■', '■', ''], ['■', '■', '■']], { max: 48, txtColor: function () { return '#39437a'; } }); } },
      { cap: '第 1 块 L 骨牌盖住左上拐角', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['★', '', ''], ['★', '★', ''], ['', '', '']], { max: 48, txtColor: function () { return '#5eead4'; } }); } },
      { cap: '第 2 块盖住剩余 3 格 → 铺满 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['★', '', ''], ['★', '★', ''], ['●', '●', '●']], { max: 48, txtColor: function (r, c, v) { return v === '★' ? '#5eead4' : '#fbbf24'; } }); } }
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
    plain: '1~10000 里有多少回文数？回文由"前半"唯一决定：1 位 9 个、2 位 9 个、3 位 90 个、4 位 90 个，共 198 个。',
    p: { steps: [
      { cap: '回文：正读反读一样，如 7、33、121、1221', fn: function (ctx, W) { U.row(ctx, W, 120, [7, 33, 121, 1221]); } },
      { cap: '位数定了，前半定了，整个数就定了', fn: function (ctx, W) { U.lines(ctx, W, [['1 位：9 个 2 位：9 个', 16, '#5eead4'], ['3 位：9×10 = 90 个 4 位：9×10 = 90 个', 16, '#5eead4']], 110, 36); } },
      { cap: '合计 9+9+90+90 = 198 个（10000 本身不是回文）✓', fn: function (ctx, W) { U.lines(ctx, W, [['198', 26, '#fbbf24', true]], 130); } }
    ] } });

  /* 99 倒序排列 */
  D({ g: g, no: 99, title: '倒序排列', e: 'arrange', strat: '减治·反转排序',
    plain: '只许"反转某一段"，把乱序排列排成升序。策略类似煎饼排序：每轮把当前最小值反转到队首，再反转到它该在的位置。',
    p: { init: [3, 2, 5, 4, 1],
      colorOf: function (v) { return ['#3b55a6', '#4463c2', '#5274d6', '#6b8ae8', '#8aa4f5'][v - 1]; },
      ops: [
        { t: 'rev', i: 0, j: 4, hl: [0, 4], cap: '整段反转：1 到队首' },
        { t: 'rev', i: 1, j: 4, cap: '处理剩余 4 个：反转把 2 放到正确位置附近' },
        { t: 'rev', i: 1, j: 2, cap: '2、3 归位' },
        { t: 'rev', i: 3, j: 4, cap: '4、5 归位 → 1 2 3 4 5 ✓' }
      ] } });

  /* 100 骑士的走位 */
  D({ g: g, no: 100, title: '骑士的走位', e: 'knight', strat: '穷举·BFS',
    plain: '6×6 棋盘上骑士从左上到右下，最少几跳？BFS 一圈一圈扩散，第一次到达终点的层数就是答案，顺带还能看到所有"同层"格子。',
    p: { n: 6, start: [0, 0], goal: [5, 5], cap: 'BFS 最短路径' } });
})();
