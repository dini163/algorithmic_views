/* 用行号把 data_o.js 第 7-15 行（概1 幻方旧定义）替换为新定义 */
const fs = require('fs');
const path = 'E:/workspace/algorithmic_views/js/pz/data_o.js';
const lines = fs.readFileSync(path, 'utf8').split('\n');
const newDef = `  D({ g: g, no: 1, title: '幻方', e: 'board', strat: '数学构造',
    plain: '把 1~9 填进九宫格，让每行、每列、两条对角线的和都一样。套路：总和 45 除以 3 行得 15，5 必须坐镇中央，偶数占四个角。',
    p: { baseMs: 750, steps: (function () {
      var FULL = [[2, 9, 4], [7, 5, 3], [6, 1, 8]];
      /* vals: 3x3，0 = 未填；just: 刚填的格子 */
      function mg(ctx, W, Hh, vals, just, note) {
        var g2 = U.grid(ctx, W, Hh, vals.map(function (row) { return row.map(function (v) { return v ? String(v) : ''; }); }), {
          max: 46,
          txtColor: function (r, c) { return just && just[0] === r && just[1] === c ? '#4ade80' : '#dfe6f8'; },
          cellColor: function (r, c) { return just && just[0] === r && just[1] === c ? '#1e3a34' : null; }
        });
        /* 行和 */
        for (var r = 0; r < 3; r++) {
          var s = vals[r][0] + vals[r][1] + vals[r][2];
          if (vals[r][0] && vals[r][1] && vals[r][2]) H.mono(ctx, '= ' + s, g2.x0 + 3 * g2.cell + 30, g2.y0 + r * g2.cell + g2.cell / 2, { size: 13, bold: true, color: s === 15 ? '#4ade80' : '#f87171' });
        }
        if (note) U.lines(ctx, W, [note], 300);
        return g2;
      }
      function blank() { return [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; }
      function set(v, r, c, x) { v[r][c] = x; return v; }
      return [
        { cap: '目标：1~9 填入九宫格，每行、每列、两条对角线的和全相等', fn: function (ctx, W, Hh) { mg(ctx, W, Hh, blank(), null, ['先算目标和：总和 45 ÷ 3 行 = 15', 14, '#fbbf24', true]); } },
        { cap: '第 1 步：5 必须坐镇中央 —— 过中心的 4 条线都要凑 15，只有 5 能同时照顾', fn: function (ctx, W, Hh) { mg(ctx, W, Hh, set(blank(), 1, 1, 5), [1, 1], ['中心格被 4 条线共用，5 是唯一人选', 13, '#8fa0c8']); } },
        { cap: '第 2 步：偶数占角 —— 左上放 2（对角配对：2 与 8 凑 10）', fn: function (ctx, W, Hh) { var v = set(blank(), 1, 1, 5); mg(ctx, W, Hh, set(v, 0, 0, 2), [0, 0], ['过中心的线：两端之和必须是 10', 13, '#8fa0c8']); } },
        { cap: '第 3 步：右下放 8 —— 与 2 配对：2 + 5 + 8 = 15 ✓', fn: function (ctx, W, Hh) { var v = set(set(blank(), 1, 1, 5), 0, 0, 2); mg(ctx, W, Hh, set(v, 2, 2, 8), [2, 2], ['对角线 2+5+8 = 15 ✓', 13, '#4ade80', true]); } },
        { cap: '第 4 步：右上放 4，左下放 6 配对：4 + 5 + 6 = 15 ✓', fn: function (ctx, W, Hh) { var v = set(set(set(blank(), 1, 1, 5), 0, 0, 2), 2, 2, 8); set(v, 0, 2, 4); mg(ctx, W, Hh, set(v, 2, 0, 6), [2, 0], ['另一对角线 4+5+6 = 15 ✓', 13, '#4ade80', true]); } },
        { cap: '第 5 步：补边 —— 上中 = 15 − 2 − 4 = 9', fn: function (ctx, W, Hh) { var v = set(set(set(blank(), 1, 1, 5), 0, 0, 2), 2, 2, 8); set(v, 0, 2, 4); set(v, 2, 0, 6); mg(ctx, W, Hh, set(v, 0, 1, 9), [0, 1], ['首行：2 + 9 + 4 = 15 ✓', 13, '#4ade80', true]); } },
        { cap: '第 6 步：左中 = 15 − 2 − 6 = 7；右中 = 15 − 4 − 8 = 3', fn: function (ctx, W, Hh) { var v = set(set(set(blank(), 1, 1, 5), 0, 0, 2), 2, 2, 8); set(v, 0, 2, 4); set(v, 2, 0, 6); set(v, 0, 1, 9); set(v, 1, 0, 7); mg(ctx, W, Hh, set(v, 1, 2, 3), [1, 2], ['中行：7 + 5 + 3 = 15 ✓', 13, '#4ade80', true]); } },
        { cap: '第 7 步：下中 = 15 − 6 − 8 = 1 —— 全部填完', fn: function (ctx, W, Hh) { mg(ctx, W, Hh, FULL, [2, 1], ['底行：6 + 1 + 8 = 15 ✓', 13, '#4ade80', true]); } },
        { cap: '验证：3 行 + 3 列 + 2 对角线 = 8 条线，全部 = 15 ✓', fn: function (ctx, W, Hh) { var g2 = mg(ctx, W, Hh, FULL, null, ['8 条线全部 = 15 ✓', 14, '#4ade80', true]); for (var c = 0; c < 3; c++) H.mono(ctx, '15', g2.x0 + c * g2.cell + g2.cell / 2, g2.y0 + 3 * g2.cell + 16, { size: 12, bold: true, color: '#4ade80' }); } }
      ];
    })() } });`;
if (!lines[6].includes('no: 1') || !lines[14].includes('] } });')) {
  console.error('行号对不上：line7=' + lines[6].slice(0, 40) + ' line15=' + lines[14]);
  process.exit(1);
}
lines.splice(6, 9, newDef);
fs.writeFileSync(path, lines.join('\n'));
console.log('概1 替换完成');
