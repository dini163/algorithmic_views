/* 第 2 章 · 谜题 1-50（全覆盖） */
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
    plain: '抽屉里 5 双黑手套、5 双棕手套，左右手混放，摸黑取。要保证取到一双同色的，最坏要先摸出全部 10 只左手，第 11 只必成双。',
    p: { steps: [
      { cap: '5 双黑 + 5 双棕，左右手混在一起，摸黑取', fn: function (ctx, W) { U.lines(ctx, W, [['黑手套 ×5 双', 16, '#8fa0c8'], ['棕手套 ×5 双', 16, '#fdba74']], 110, 36); } },
      { cap: '最坏情况：前 10 只全是左手（5 黑左 + 5 棕左）', fn: function (ctx, W) { U.row(ctx, W, 110, ['黑左', '黑左', '黑左', '黑左', '黑左', '棕左', '棕左', '棕左', '棕左', '棕左']); } },
      { cap: '第 11 只必是右手 → 与已有左手配成同色一双 → 答案 11', fn: function (ctx, W) { U.row(ctx, W, 110, ['…10只左手…', '右手!'], [1]); U.lines(ctx, W, [['至少取 11 只', 18, '#4ade80', true]], 190); } }
    ] } });

  /* 3 矩形切割 */
  D({ g: g, no: 3, title: '矩形切割', e: 'geo', strat: '几何构造',
    plain: '把 9×4 的矩形剪开再拼成 6×6 的正方形。沿一条"阶梯线"剪成两块，把其中一块平移上去，严丝合缝。',
    p: { steps: [
      { cap: '9×4 矩形面积 36 = 6×6，目标是拼成正方形', fn: function (ctx, W) {
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - 135, 110, 270, 120);
        H.txt(ctx, '9 × 4', W / 2, 170, { size: 16, bold: true }); } },
      { cap: '沿阶梯线剪成两块：台阶宽 3 高 2', fn: function (ctx, W) {
        var x0 = W / 2 - 135, y0 = 110;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 270, 120);
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = '#f87171'; ctx.beginPath();
        ctx.moveTo(x0 + 90, y0); ctx.lineTo(x0 + 90, y0 + 60); ctx.lineTo(x0 + 180, y0 + 60); ctx.lineTo(x0 + 180, y0 + 120);
        ctx.stroke(); ctx.setLineDash([]); } },
      { cap: '右块向上平移一格、左移一格 → 6×6 正方形 ✓', fn: function (ctx, W) {
        var x0 = W / 2 - 90, y0 = 74;
        ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2.5; ctx.strokeRect(x0, y0, 180, 180);
        H.line(ctx, x0, y0 + 120, x0 + 180, y0 + 120, '#f87171', 1.5);
        H.line(ctx, x0 + 90, y0, x0 + 90, y0 + 120, '#f87171', 1.5);
        H.txt(ctx, '6 × 6', W / 2, y0 + 90, { size: 16, bold: true, color: '#4ade80' }); } }
    ] } });

  /* 4 士兵摆渡 */
  var sol4Items = [{ id: 'S1', label: '兵1', color: '#818cf8' }, { id: 'S2', label: '兵2', color: '#818cf8' }, { id: 'B1', label: '童1', color: '#fbbf24' }, { id: 'B2', label: '童2', color: '#fbbf24' }];
  D({ g: g, no: 4, title: '士兵摆渡', e: 'board', strat: '穷举·模式复用',
    plain: '两个士兵要过河，船小得只能载 1 个士兵或 2 个男孩。套路固定：男孩来回当"摆渡机"，每送一个士兵要 4 渡，共 9 渡。',
    p: { steps: U.riverSeq(sol4Items, [['B1', 'B2'], ['B1'], ['S1'], ['B2'], ['B1', 'B2'], ['B1'], ['S2'], ['B2'], ['B1', 'B2']]) } });

  /* 5 行列变换 */
  D({ g: g, no: 5, title: '行列变换', e: 'board', strat: '变治',
    plain: '不许动单个格子，只许整行整行、整列整列地交换，把打乱的九宫格恢复成 1~9 顺序。先换行、再换列，两步搞定。',
    p: { steps: [
      { cap: '只能整行/整列交换，复原成 1~9', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['6', '5', '4'], ['3', '2', '1'], ['9', '8', '7']]); } },
      { cap: '第 1 步：交换第 1、2 行', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['3', '2', '1'], ['6', '5', '4'], ['9', '8', '7']], { cellColor: function (r) { return r < 2 ? '#2b3a6e' : null; } }); } },
      { cap: '第 2 步：交换第 1、3 列 → 复原 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']], { cellColor: function () { return '#1e3a34'; } }); } }
    ] } });

  /* 6 数数的手指 */
  D({ g: g, no: 6, title: '数数的手指', e: 'board', strat: '找周期',
    plain: '大拇指 1、食指 2、中指 3、无名指 4、小指 5、再倒回来 6、7、8、9…手指走"之"字形，8 个数一个循环。1000 ÷ 8 余 0，落在食指。',
    p: { steps: [
      { cap: '之字形数手指：拇 1、食 2、中 3、无名 4、小 5，再折返', fn: function (ctx, W) { U.row(ctx, W, 110, ['拇1', '食2', '中3', '无名4', '小5', '无名6', '中7', '食8', '拇9']); } },
      { cap: '每 8 个数一个循环', fn: function (ctx, W) { U.lines(ctx, W, [['循环长度 = 8', 18, '#5eead4', true], ['1000 ÷ 8 = 125 …… 余 0', 18, '#fbbf24', true]], 110, 40); } },
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
    plain: '1000 块的拼图要拼多少次？每次拼接都把"部件数"减 1：从 1000 个散块到 1 个整体，恰好 999 次，一步都省不了。',
    p: { steps: [
      { cap: '1000 块散片，每次拼接把两块并成一块', fn: function (ctx, W) { U.lines(ctx, W, [['部件数：1000', 20, '#5eead4', true]], 130); } },
      { cap: '每拼一次，部件数 −1', fn: function (ctx, W) { U.row(ctx, W, 110, [1000, 999, 998, '…', 2, 1]); } },
      { cap: '1000 → 1 需要恰好 999 次拼接', fn: function (ctx, W) { U.lines(ctx, W, [['拼接次数 = 1000 − 1 = 999', 20, '#fbbf24', true]], 130); } }
    ] } });

  /* 9 心算求和 */
  D({ g: g, no: 9, title: '心算求和', e: 'board', strat: '数学技巧·配对',
    plain: '高斯小时候的招：1+2+…+100 首尾配对，1+100、2+99……每对都是 101，共 50 对，答案 5050，不用一个个加。',
    p: { steps: [
      { cap: '求 1 + 2 + 3 + … + 100', fn: function (ctx, W) { U.row(ctx, W, 110, [1, 2, 3, 4, '…', 98, 99, 100]); } },
      { cap: '首尾配对：1+100 = 2+99 = 3+98 = … = 101', fn: function (ctx, W) { U.row(ctx, W, 90, [1, 2, 3, '…'], [0]); U.row(ctx, W, 150, [100, 99, 98, '…'], [0]); U.lines(ctx, W, [['每对和都是 101', 15, '#4ade80', true]], 220); } },
      { cap: '50 对 × 101 = 5050 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['100 ÷ 2 = 50 对', 16, '#8fa0c8'], ['50 × 101 = 5050', 22, '#fbbf24', true]], 110, 44); } }
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
    plain: '10 堆硬币，其中一堆全是假币（每枚轻 1 克），只许称一次。从第 k 堆取 k 枚一起称：少了几克，假币就是第几堆，把编号编码进重量里。',
    p: { n: 10, title: '10 堆中找整堆假币，只称 1 次', steps: [
      { L: [1, 2, 3, 4, 5, 6, 7], R: [8, 9, 10], res: '=', note: '从第 k 堆取 k 枚（共 55 枚）一起称，数字是堆号' },
      { L: [], R: [], res: '=', note: '若全真应重 55w；读数少 d 克 → 第 d 堆是假币堆 ✓' }
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
  D({ g: g, no: 14, title: '复原国际象棋棋盘', e: 'board', strat: '分治',
    plain: '打乱的棋盘怎么复原？别一格一格找：先各自拼好四个 4×4 象限，再对齐合并成 8×8，大问题拆成四个小问题。',
    p: { steps: [
      { cap: '64 格全乱了 → 先分成四个 4×4 象限', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', '', '|', '', '', '', ''], ['', '', '', '|', '', '', '', ''], ['', '', '', '|', '', '', '', ''], ['', '', '', '|', '', '', '', ''], ['-', '-', '-', '+', '-', '-', '-', '-'], ['', '', '', '|', '', '', '', ''], ['', '', '', '|', '', '', '', ''], ['', '', '', '|', '', '', '', '']], { max: 30 }); } },
      { cap: '每个象限独立复原（小问题）', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['1', '2', '3', '4'], ['5', '6', '7', '8'], ['9', '10', '11', '12'], ['13', '14', '15', '16']], { cellColor: function () { return '#1e3a34'; } }); } },
      { cap: '四个象限按边角特征对齐合并 → 棋盘复原 ✓', fn: function (ctx, W, Hh) {
        var b = []; for (var r = 1; r <= 8; r++) { var row = []; for (var c = 1; c <= 8; c++) row.push(String(r * 8 - 8 + c)); b.push(row); }
        U.grid(ctx, W, Hh, b, { checker: true, max: 30 }); } }
    ] } });

  /* 15 三格骨牌平铺问题 */
  D({ g: g, no: 15, title: '三格骨牌平铺问题', e: 'tiling', strat: '分治',
    plain: '缺角 8×8 棋盘用 L 形三格骨牌铺满：四等分棋盘，在中心交界处放一块骨牌，让每个子棋盘也"缺"一角，递归铺到底。',
    p: { n: 8, type: 'tromino', miss: [3, 5], cap: '分治递归：(8×8−1) ÷ 3 = 21 块' } });

  /* 16 煎饼制作 */
  D({ g: g, no: 16, title: '煎饼制作', e: 'timeline', strat: '贪心·调度',
    plain: '锅里最多放 2 张饼，每面要煎 2 分钟，煎 3 张饼最少几分钟？别一张一张煎：轮换上下锅，6 分钟三张全熟。',
    p: { total: 6, segs: [
      { who: 'A正面 + B正面', start: 0, dur: 2 },
      { who: 'A反面 + C正面', start: 2, dur: 2 },
      { who: 'B反面 + C反面', start: 4, dur: 2 }],
      cap: '6 分钟（而非 8 分钟）：锅里始终两张饼在煎' } });

  /* 17 国王的走位 */
  D({ g: g, no: 17, title: '国王的走位', e: 'griddp', strat: '动态规划',
    plain: '国王从棋盘一角走到对角，只向右和向下时的最短路线数，和机器人走网格一模一样：每格路线数 = 上方 + 左方。',
    p: { rows: 5, cols: 5, mode: 'count', val: function () { return 0; } } });

  /* 18 骑士的征途 */
  D({ g: g, no: 18, title: '骑士的征途', e: 'knight', strat: '回溯·启发式',
    plain: '骑士能否跳遍 5×5 棋盘每格恰好一次？回溯加"下一跳选出口最少的格子"（Warnsdorff 启发），几乎不用回头就能走完。',
    p: { n: 5, mode: 'tour', start: [0, 0], cap: '25 格全数跳到，恰好一次' } });

  /* 19 页码计数 */
  D({ g: g, no: 19, title: '页码计数', e: 'board', strat: '数学技巧·分段',
    plain: '一本 1000 页的书页码用了多少个数字？按位数分段算：1 位数 9 页、2 位数 90 页、3 位数 900 页、4 位数 1 页。',
    p: { steps: [
      { cap: '1~9：9 页 × 1 位 = 9 个数字', fn: function (ctx, W) { U.lines(ctx, W, [['9 × 1 = 9', 18, '#5eead4', true]], 130); } },
      { cap: '10~99：90 页 × 2 位 = 180；100~999：900 页 × 3 位 = 2700', fn: function (ctx, W) { U.lines(ctx, W, [['90 × 2 = 180', 18, '#5eead4', true], ['900 × 3 = 2700', 18, '#5eead4', true]], 110, 40); } },
      { cap: '第 1000 页 4 位 → 总计 9 + 180 + 2700 + 4 = 2893 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['9 + 180 + 2700 + 4 = 2893 个数字', 20, '#fbbf24', true]], 130); } }
    ] } });

  /* 20 寻找最大和 */
  D({ g: g, no: 20, title: '寻找最大和', e: 'griddp', strat: '动态规划',
    plain: '从网格左上走到右下，只向右或向下，沿途数字加起来最大能是多少？每格记"到这里的最优和 = 本格值 + max(上方, 左方)"。',
    p: { rows: 5, cols: 5, mode: 'max', showVals: true,
      val: function (r, c) { return ((r * 5 + c) * 7) % 9 + 1; } } });

  /* 21 正方形的拆分 */
  D({ g: g, no: 21, title: '正方形的拆分', e: 'geo', strat: '几何构造',
    plain: '把一个大正方形拆成若干个大小不同的小正方形并非显然可行。先从简单拆法练手：6×6 = 一个 4×4 加四个 2×2。',
    p: { steps: [
      { cap: '问题：把正方形拆成若干个小正方形', fn: function (ctx, W) {
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - 90, 75, 180, 180); } },
      { cap: '6×6 = 4×4 + 4 个 2×2（5 块）', fn: function (ctx, W) {
        var x0 = W / 2 - 90, y0 = 75, u = 30;
        ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, 6 * u, 6 * u);
        ctx.fillStyle = 'rgba(94,234,212,.25)'; ctx.fillRect(x0, y0, 4 * u, 4 * u);
        ctx.fillStyle = 'rgba(251,191,36,.25)';
        ctx.fillRect(x0 + 4 * u, y0, 2 * u, 2 * u); ctx.fillRect(x0 + 4 * u, y0 + 2 * u, 2 * u, 2 * u);
        ctx.fillRect(x0, y0 + 4 * u, 2 * u, 2 * u); ctx.fillRect(x0 + 2 * u, y0 + 4 * u, 2 * u, 2 * u);
        ctx.strokeStyle = '#f87171';
        ctx.strokeRect(x0, y0, 4 * u, 4 * u);
        H.txt(ctx, '4×4', x0 + 2 * u, y0 + 2 * u, { size: 14, bold: true, color: '#5eead4' }); } },
      { cap: '进阶：存在拆成 11 个互不相同小正方形的拆法（完美正方形）', fn: function (ctx, W) { U.lines(ctx, W, [['完美正方形：块块大小不同', 16, '#8fa0c8'], ['最少 21 块 → 后来找到 11 块以上方案', 15, '#fbbf24', true]], 120, 36); } }
    ] } });

  /* 22 球队排名 */
  D({ g: g, no: 22, title: '球队排名', e: 'board', strat: '图论·拓扑排序',
    plain: '循环赛只给了胜负关系，怎么排出名次？把"赢"画成箭头，做拓扑排序：每次挑出"没有被任何人压着"的队排到前面。',
    p: { steps: [
      { cap: '战绩：A胜B、B胜C、C胜D、A胜D、B胜D、A胜C', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D']); U.lines(ctx, W, [['A→B→C→D，且 A→C、A→D、B→D', 14, '#8fa0c8']], 200); } },
      { cap: '拓扑排序：先找赢过所有剩余对手的队 → A', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D'], [{ tag: '#1' }]); } },
      { cap: '去掉 A 后剩 B 最强，再去掉 B…排名 A > B > C > D ✓', fn: function (ctx, W) { U.people(ctx, W, 120, ['A', 'B', 'C', 'D'], [{ tag: '#1', out: 1 }, { tag: '#2', out: 1 }, { tag: '#3', out: 1 }, { tag: '#4', out: 1 }]); } }
    ] } });

  /* 23 波兰国旗问题 */
  D({ g: g, no: 23, title: '波兰国旗问题', e: 'arrange', strat: '双指针·贪心',
    plain: '把混放的白红两色棋子分成"左白右红"，只能两两交换。两个指针从两头往中间扫，遇到放错的就互换，一趟搞定。',
    p: { init: ['白', '红', '白', '红', '红', '白', '白', '红'], dark: true,
      colorOf: function (v) { return v === '白' ? '#e2e8f0' : '#dc2626'; },
      ops: [
        { t: 'swap', i: 1, j: 5, hl: [1, 5], cap: '左指针遇到"红"，与右侧的"白"交换' },
        { t: 'swap', i: 3, j: 6, hl: [3, 6], cap: '继续扫描，再换一次 → 左白右红 ✓' }
      ], cap: '一趟扫描 O(n)，这就是"国旗问题"的两色版' } });

  /* 24 国际象棋棋盘着色问题 */
  D({ g: g, no: 24, title: '国际象棋棋盘着色问题', e: 'board', strat: '奇偶/不变量',
    plain: '棋盘黑白染色是最强"不变量"工具：多米诺永远盖一黑一白，L 三格骨牌盖 2 黑 1 白或 1 黑 2 白，很多"能不能铺"的问题一染色就见分晓。',
    p: { steps: [
      { cap: '给棋盘黑白染色', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']], { checker: true }); } },
      { cap: '多米诺 = 1 黑 + 1 白', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['■', '□']], { checker: true, txtColor: function (r, c) { return (r + c) % 2 ? '#7dd3fc' : '#fbbf24'; } }); } },
      { cap: 'L 三格骨牌 = 2 黑 1 白 或 1 黑 2 白 → 黑白差会变化', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['■', '□'], ['■', '']], { checker: true, txtColor: function (r, c) { return (r + c) % 2 ? '#7dd3fc' : '#fbbf24'; } }); } },
      { cap: '用黑白计数差，可证明或否定各种平铺方案', fn: function (ctx, W) { U.lines(ctx, W, [['统计黑格、白格数量 → 与骨牌覆盖对比', 16, '#fbbf24', true]], 130); } }
    ] } });

  /* 25 科学家在世的最好时代 */
  D({ g: g, no: 25, title: '科学家在世的最好时代', e: 'timeline', strat: '扫描线',
    plain: '给定几位科学家的生卒年，哪一年同时在世的人最多？把生卒事件按时间排序扫一遍，遇到出生 +1、去世 −1，峰值即答案。',
    p: { total: 70, segs: [
      { who: '科学家A', start: 0, dur: 35 }, { who: '科学家B', start: 10, dur: 40 },
      { who: '科学家C', start: 20, dur: 30 }, { who: '科学家D', start: 30, dur: 25 }],
      cap: '第 30~35 年：四人同时在世，人数最多' } });

  /* 26 寻找图灵 */
  D({ g: g, no: 26, title: '寻找图灵', e: 'board', strat: '减治·二分',
    plain: '在一本按字母排好序的名人录里找一个人，从头翻到尾太傻：每次翻中间，根据"在前半还是后半"把搜索范围砍半，二分查找。',
    p: { steps: [
      { cap: '16 个有序位置中找目标 11', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]); } },
      { cap: '查中间 8 → 目标更大 → 看后半', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], [7]); } },
      { cap: '查中间 12 → 目标更小 → 10 → 更小 → 11 命中', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], [10]); } },
      { cap: '16 个元素最多 4 次命中：log2(16) = 4', fn: function (ctx, W) { U.lines(ctx, W, [['比较次数 = log2(n)', 18, '#4ade80', true]], 130); } }
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
  D({ g: g, no: 29, title: '重温幻方', e: 'board', strat: '数学构造·走位法',
    plain: '用"楼梯法"机械地构造奇数阶幻方：1 放顶行中间，之后每步向右上走；出界就绕回来，被占位就改放到正下方。',
    p: { steps: [
      { cap: '规则：右上走，出界绕回，占位则下移', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '1', ''], ['', '', ''], ['', '', '']]); } },
      { cap: '2→右下绕回，3→继续，4 被占位下移…填到 6', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '1', ''], ['', '', '4'], ['2', '', '']]); U.lines(ctx, W, [['已填 1~4', 13, '#8fa0c8']], 260); } },
      { cap: '填完 7、8、9 → 8 1 6 / 3 5 7 / 4 9 2 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['8', '1', '6'], ['3', '5', '7'], ['4', '9', '2']], { cellColor: function () { return '#1e3a34'; } }); } }
    ] } });

  /* 30 棍子切割 */
  D({ g: g, no: 30, title: '棍子切割', e: 'board', strat: '二进制·减治',
    plain: '7 尺长的棍子最少切几刀，就能用切出的段量出 1~7 尺任何整数长度？切两刀成 1、2、4 三段，二进制砝码思想。',
    p: { steps: [
      { cap: '7 尺棍子，切几刀能量出 1~7 任意整数尺？', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5, 6, 7]); } },
      { cap: '切两刀，得到 1、2、4 三段', fn: function (ctx, W) { U.row(ctx, W, 120, ['1尺', '2尺', '4尺'], [0, 1, 2]); } },
      { cap: '任意长度都是子集和：5=4+1，6=4+2，7=4+2+1 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['3 = 2+1 5 = 4+1', 16, '#5eead4'], ['6 = 4+2 7 = 4+2+1', 16, '#5eead4'], ['二进制的力量', 15, '#fbbf24', true]], 100, 34); } }
    ] } });

  /* 31 三堆牌魔术 */
  D({ g: g, no: 31, title: '三堆牌魔术', e: 'board', strat: '三分·减治',
    plain: '21 张牌发成 3 堆，观众指出目标牌在哪堆，把该堆放中间收牌；重复 3 次，目标牌必在第 11 张，每次把范围缩小到三分之一。',
    p: { steps: [
      { cap: '21 张牌轮流发成 3 堆（每堆 7 张）', fn: function (ctx, W) { U.row(ctx, W, 90, ['堆A', '堆A', '…']); U.row(ctx, W, 140, ['堆B', '堆B', '…']); U.row(ctx, W, 190, ['堆C', '堆C', '…']); } },
      { cap: '目标堆夹在中间收牌 → 目标牌范围 21→7', fn: function (ctx, W) { U.lines(ctx, W, [['嫌疑范围 ÷ 3', 18, '#5eead4', true]], 130); } },
      { cap: '第 2、3 次同样操作：7→3→1…精确到第 11 张', fn: function (ctx, W) { U.lines(ctx, W, [['3 次后：21 → 7 → 3 → 定位', 16, '#8fa0c8'], ['目标牌必在整叠第 11 张 ✓', 17, '#fbbf24', true]], 110, 38); } }
    ] } });

  /* 32 单淘汰赛 */
  D({ g: g, no: 32, title: '单淘汰赛', e: 'board', strat: '分治·计数',
    plain: '16 人单淘汰赛要打几场？每场淘汰恰好 1 人，要淘汰 15 人才有冠军，所以恰好 15 场，不用数赛程表。',
    p: { steps: [
      { cap: '16 人淘汰赛：第一轮 8 场', fn: function (ctx, W) { U.lines(ctx, W, [['16 人 → 8 场 → 剩 8 人', 17, '#5eead4', true]], 130); } },
      { cap: '第二轮 4 场，第三轮 2 场，决赛 1 场', fn: function (ctx, W) { U.row(ctx, W, 110, ['8场', '4场', '2场', '1场']); } },
      { cap: '总数 8+4+2+1 = 15 = n−1：每场恰好淘汰 1 人', fn: function (ctx, W) { U.lines(ctx, W, [['场数 = 人数 − 1 = 15', 20, '#fbbf24', true]], 130); } }
    ] } });

  /* 33 真伪幻方 */
  D({ g: g, no: 33, title: '真伪幻方', e: 'board', strat: '穷举·验证',
    plain: '给你一个填好的方阵，怎么验证它是不是幻方？把每行、每列、两条对角线的和全算一遍，全部相等且数字不重复才算数。',
    p: { steps: [
      { cap: '候选方阵：验证行、列、对角线和', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['16', '3', '2', '13'], ['5', '10', '11', '8'], ['9', '6', '7', '12'], ['4', '15', '14', '1']]); } },
      { cap: '4 行和：34, 34, 34, 34 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['16', '3', '2', '13'], ['5', '10', '11', '8'], ['9', '6', '7', '12'], ['4', '15', '14', '1']], { cellColor: function (r) { return r === 1 ? '#1e3a34' : null; } }); } },
      { cap: '列与对角线也都是 34，且 1~16 不重不漏 → 真幻方 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['行=列=对角线=34', 18, '#4ade80', true], ['数字 1~16 各一次', 16, '#8fa0c8']], 120, 38); } }
    ] } });

  /* 34 星星的硬币 */
  D({ g: g, no: 34, title: '星星的硬币', e: 'geo', strat: '几何构造',
    plain: '把 10 枚硬币放到五角星的 10 个交点上，使每条边线上恰好 4 枚。五角星有 5 个尖角点和 5 个内交点，正好 10 个位置。',
    p: { steps: [
      { cap: '五角星有 10 个交点', fn: function (ctx, W, Hh) { star(ctx, W, Hh, []); } },
      { cap: '10 枚硬币放到 10 个交点：每条线上恰好 4 枚 ✓', fn: function (ctx, W, Hh) { star(ctx, W, Hh, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); } }
    ], baseMs: 1000 } });
  function star(ctx, W, Hh, filled) {
    var cx = W / 2, cy = Hh / 2, R = 120, pts = [];
    for (var k = 0; k < 5; k++) {
      var a = (k * 72 - 90) * Math.PI / 180;
      pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
    }
    ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (k = 0; k < 5; k++) { var p = pts[k], q = pts[(k + 2) % 5]; ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }
    ctx.stroke();
    var all = pts.slice();
    for (k = 0; k < 5; k++) {
      var p1 = pts[k], q1 = pts[(k + 2) % 5], p2 = pts[(k + 1) % 5], q2 = pts[(k + 4) % 5];
      var d = (q1[0] - p1[0]) * (q2[1] - p2[1]) - (q1[1] - p1[1]) * (q2[0] - p2[0]);
      var t = ((p2[0] - p1[0]) * (q2[1] - p2[1]) - (p2[1] - p1[1]) * (q2[0] - p2[0])) / d;
      all.push([p1[0] + t * (q1[0] - p1[0]), p1[1] + t * (q1[1] - p1[1])]);
    }
    filled.forEach(function (idx) { H.circle(ctx, all[idx][0], all[idx][1], 9, '#fbbf24'); });
    if (!filled.length) all.forEach(function (pt) { H.circle(ctx, pt[0], pt[1], 4, '#39437a'); });
  }

  /* 35 三个水壶 */
  D({ g: g, no: 35, title: '三个水壶', e: 'jugs', strat: '穷举·状态空间',
    plain: '8 升满壶、5 升和 3 升空壶，不许用别的量具，怎么分出两个 4 升？把"每个壶的水量"当作状态，广度优先搜索倒水方案。',
    p: { caps: [8, 5, 3], init: [8, 0, 0], goal: [4, 4, 0] } });

  /* 36 有限的差异 */
  D({ g: g, no: 36, title: '有限的差异', e: 'board', strat: '数学技巧·差分',
    plain: '数列 1, 4, 9, 16 的下一项是什么？算相邻差：3, 5, 7，差的差恒为 2，所以下一个差是 9，下一项 25。差分法是找规律的利器。',
    p: { steps: [
      { cap: '数列：1, 4, 9, 16, ?', fn: function (ctx, W) { U.row(ctx, W, 110, [1, 4, 9, 16, '?']); } },
      { cap: '一阶差分：3, 5, 7 → 二阶差分恒为 2', fn: function (ctx, W) { U.row(ctx, W, 110, [1, 4, 9, 16, '?']); U.row(ctx, W, 170, ['3', '5', '7', '?'], [3]); } },
      { cap: '下一个差 = 9 → 答案是 16 + 9 = 25 ✓', fn: function (ctx, W) { U.row(ctx, W, 110, [1, 4, 9, 16, 25], [4]); } }
    ] } });

  /* 37 2n 筹码问题 */
  D({ g: g, no: 37, title: '2n 筹码问题', e: 'arrange', strat: '贪心·交换',
    plain: '红黑筹码交替排成一排，只许交换两个筹码的位置，让红的全靠左、黑的全靠右。挑最"错位"的两枚互换，两步到位。',
    p: { init: ['红', '黑', '红', '黑', '红', '黑', '红', '黑'], dark: true,
      colorOf: function (v) { return v === '红' ? '#dc2626' : '#334155'; },
      ops: [
        { t: 'swap', i: 1, j: 6, hl: [1, 6], cap: '第 2 位的黑与第 7 位的红互换' },
        { t: 'swap', i: 3, j: 4, hl: [3, 4], cap: '中间两枚互换 → 红左黑右 ✓' }
      ] } });

  /* 38 四格骨牌平铺问题 */
  D({ g: g, no: 38, title: '四格骨牌平铺问题', e: 'board', strat: '奇偶/不变量',
    plain: '5 种四格骨牌（共 20 格）能拼成 4×5 矩形吗？黑白染色：T 字形永远盖 3 黑 1 白（或反之），而棋盘是 10 黑 10 白，对不上，不可能！',
    p: { steps: [
      { cap: '5 种四格骨牌，总面积 20 = 4×5', fn: function (ctx, W) { U.lines(ctx, W, [['I  O  T  L  S', 22, '#5eead4', true], ['共 5 × 4 = 20 格', 15, '#8fa0c8']], 110, 44); } },
      { cap: '黑白染色：T 字形盖 3 黑 1 白，其余四种都是 2 黑 2 白', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['■', '■', '■'], ['', '■', '']], { checker: true, txtColor: function (r, c) { return (r + c) % 2 ? '#7dd3fc' : '#fbbf24'; } }); } },
      { cap: '5 块合计 11 黑 9 白 ≠ 棋盘的 10 黑 10 白 → 不可能拼成', fn: function (ctx, W) { U.lines(ctx, W, [['骨牌合计：11 黑 + 9 白', 17, '#f87171', true], ['4×5 棋盘：10 黑 + 10 白', 17, '#f87171', true], ['矛盾 → 无解', 17, '#4ade80', true]], 90, 38); } }
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
    plain: '3×3 棋盘四角的骑士要黑白互换。骑士在 3×3 上只能沿一个 8 格循环跳，让每位骑士沿循环前进 4 站，16 跳完成调换。',
    p: { rows: 3, cols: 3, pieces: [
      { id: 'W1', label: '白', color: '#e2e8f0', r: 0, c: 0 }, { id: 'W2', label: '白', color: '#e2e8f0', r: 0, c: 2 },
      { id: 'B1', label: '黑', color: '#334155', r: 2, c: 0 }, { id: 'B2', label: '黑', color: '#334155', r: 2, c: 2 }],
      moves: guaMoves, cap: '沿 8 格循环各走 4 跳' } });

  /* 41 灯之圈 */
  D({ g: g, no: 41, title: '灯之圈', e: 'flip', strat: '数学技巧·奇偶',
    plain: '6 盏灯围成圈，按一个开关会翻转它自己和左右邻居。选对两个开关（1 号和 4 号），每盏灯恰好被翻一次，一次全亮。',
    p: { init: [0, 0, 0, 0, 0, 0], cols: 6,
      ops: [
        { at: [], cap: '每按一个开关，翻转自己和左右邻居' },
        { at: [5, 0, 1], cap: '按开关 1 → 灯 6、1、2 翻转' },
        { at: [2, 3, 4], cap: '按开关 4 → 灯 3、4、5 翻转 → 全亮 ✓' }
      ], cap: '每盏灯恰好被覆盖一次' } });

  /* 42 狼羊菜过河另一版本 */
  D({ g: g, no: 42, title: '狼羊菜过河另一版本', e: 'river', strat: '穷举·状态空间',
    plain: '升级版：船一次能载两样东西！约束不变（狼羊、羊菜不能独处）。船大了，最优方案从 7 渡缩短，搜索空间变了，答案跟着变。',
    p: { items: [{ id: '狼', label: '狼', color: '#8fa0c8' }, { id: '羊', label: '羊', color: '#fbbf24' }, { id: '菜', label: '菜', color: '#4ade80' }],
      cap: 2, capText: '船每次可载 2 样',
      valid: function (st) { var s = st[st.boat === 'L' ? 'R' : 'L']; return !(s.indexOf('羊') >= 0 && (s.indexOf('狼') >= 0 || s.indexOf('菜') >= 0)); } } });

  /* 43 数字填充 */
  D({ g: g, no: 43, title: '数字填充', e: 'board', strat: '回溯·约束',
    plain: '把 1~9 填进九宫格，相邻两格（上下左右）不许是连续数。先填最受限的中央 5，再让 4、6 离它远远的，回溯试错即可。',
    p: { steps: [
      { cap: '约束：上下左右相邻的数不能相差 1', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['?', '?', '?'], ['?', '?', '?'], ['?', '?', '?']]); } },
      { cap: '5 放中央：它的邻居必须是 1,3,7,9 这类', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['', '', ''], ['', '5', ''], ['', '', '']]); } },
      { cap: '回溯填充完成：8 3 6 / 1 5 9 / 4 7 2 ✓', fn: function (ctx, W, Hh) { U.grid(ctx, W, Hh, [['8', '3', '6'], ['1', '5', '9'], ['4', '7', '2']], { cellColor: function () { return '#1e3a34'; } }); } }
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
  D({ g: g, no: 46, title: '三色排列', e: 'arrange', strat: '三指针·贪心',
    plain: '红白蓝三色棋子乱序排列，只许交换，排成红-白-蓝三段。这就是"荷兰国旗问题"：三个指针各司其职，一趟扫描完成。',
    p: { init: ['红', '白', '蓝', '红', '蓝', '白', '红', '白', '蓝'], dark: true,
      colorOf: function (v) { return v === '红' ? '#dc2626' : v === '白' ? '#e2e8f0' : '#2563eb'; },
      ops: [
        { t: 'swap', i: 1, j: 3, hl: [1, 3], cap: '把第 4 位的红换到红色区' },
        { t: 'swap', i: 2, j: 7, hl: [2, 7], cap: '第 8 位的红归位 → 红区完成' },
        { t: 'swap', i: 4, j: 8, hl: [4, 8], cap: '白蓝各归其位 → 红白蓝三段 ✓' }
      ] } });

  /* 47 展览规划 */
  D({ g: g, no: 47, title: '展览规划', e: 'timeline', strat: '贪心·调度',
    plain: '展厅只有一个入口通道，四个展览的布展要排队；能并行的就并行，关键路径（最长链）决定开展时间。',
    p: { total: 8, segs: [
      { who: '展A布展', start: 0, dur: 2 }, { who: '展B布展', start: 2, dur: 4 },
      { who: '展C布展', start: 2, dur: 3 }, { who: '展D布展', start: 5, dur: 2 }],
      cap: '关键路径 A→B→D 共 8 小时，按此排期准点开展' } });

  /* 48 麦乐鸡数字 */
  D({ g: g, no: 48, title: '麦乐鸡数字', e: 'board', strat: '数论·枚举',
    plain: '麦乐鸡只卖 6 块、9 块、20 块装，哪些总数买不出来？43 块是最大的"买不到数"，从 44 开始每个数都凑得出。',
    p: { steps: [
      { cap: '只有 6、9、20 块三种包装', fn: function (ctx, W) { U.row(ctx, W, 120, ['6块装', '9块装', '20块装']); } },
      { cap: '43 = ? 怎么都凑不出：试 20×0,1,2 都失败', fn: function (ctx, W) { U.lines(ctx, W, [['43 − 20×0 = 43（6和9凑不出）', 15, '#f87171'], ['43 − 20×1 = 23（6和9凑不出）', 15, '#f87171'], ['43 − 20×2 = 3（太小）', 15, '#f87171']], 90, 34); } },
      { cap: '44=6×4+20，45=9×5，46=20×2+6… 44 起全都能买到 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['44 = 6×4 + 20', 16, '#4ade80'], ['45 = 9×5', 16, '#4ade80'], ['46 = 20×2 + 6，连续 6 个成立后永续成立', 15, '#8fa0c8']], 90, 34); } }
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
    plain: '桌上 10 个球，两人轮流拿 1~2 个，拿到最后一个的赢。从终点倒推：谁面对 3 的倍数个球谁被动，先手拿 1 个，之后凑 3 即可稳赢。',
    p: { steps: [
      { cap: '10 个球，轮流拿 1~2 个，拿最后一个者胜', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); } },
      { cap: '倒推：剩 3 个时轮谁谁输（拿 1 对方拿 2，拿 2 对方拿 1）', fn: function (ctx, W) { U.row(ctx, W, 120, [1, 2, 3], [0, 1, 2]); } },
      { cap: '先手拿 1 个（剩 9），之后每轮与对手凑 3 → 稳赢 ✓', fn: function (ctx, W) { U.lines(ctx, W, [['10 → 9（3的倍数）→ 6 → 3 → 0', 17, '#4ade80', true], ['始终让对手面对 3 的倍数', 15, '#fbbf24']], 110, 38); } }
    ] } });

})();
