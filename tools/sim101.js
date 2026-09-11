/* #101 房间喷漆：验证"分而治之"行走方案的数学正确性
 * 题目：8x8 宫殿，每间四墙有门，地板初始全白。
 *      要喷成棋盘式黑白相间（(r+c) 奇数 = 黑）；漆匠每经过一间就喷一次（颜色翻转）。
 *      问能否 <= 60 次。
 * 方案（PDF p190 图 4.74）：主对角线不动；只构造下半三角 30 次（13+11+6），
 *      另一半沿对角线镜像再 30 次，共 60 次。
 */
var N = 8;

/* 下半三角（r > c）目标黑格 = (r+c) 奇数 */
function isBlackTarget(r, c) { return (r + c) % 2 === 1; }

var A = [[2, 1], [3, 1], [3, 2], [4, 2], [4, 3], [5, 3], [5, 4], [6, 4], [6, 5], [7, 5], [7, 6], [8, 6], [8, 7]];
var B = [[3, 1], [4, 1], [4, 2], [5, 2], [5, 3], [6, 3], [6, 4], [7, 4], [7, 5], [8, 5], [8, 6]];
var C1 = [[6, 1]];
var C2 = [[7, 1], [7, 2], [7, 1]];
var C3 = [[8, 1]];
var C4 = [[8, 3]];

function mirrorRev(seg) { return seg.slice().reverse().map(function (p) { return [p[1], p[0]]; }); }

var SEGS = [
  { name: 'A', cells: A, half: 'lower' },
  { name: 'B', cells: B, half: 'lower' },
  { name: 'C1', cells: C1, half: 'lower' },
  { name: 'C2', cells: C2, half: 'lower' },
  { name: 'C3', cells: C3, half: 'lower' },
  { name: 'C4', cells: C4, half: 'lower' },
  { name: "A'", cells: mirrorRev(A), half: 'upper' },
  { name: "B'", cells: mirrorRev(B), half: 'upper' },
  { name: "C1'", cells: mirrorRev(C1), half: 'upper' },
  { name: "C2'", cells: mirrorRev(C2), half: 'upper' },
  { name: "C3'", cells: mirrorRev(C3), half: 'upper' },
  { name: "C4'", cells: mirrorRev(C4), half: 'upper' }
];

var errs = [];
SEGS.forEach(function (s) {
  for (var i = 1; i < s.cells.length; i++) {
    var a = s.cells[i - 1], b = s.cells[i];
    if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) !== 1) errs.push('not adjacent in ' + s.name + ': ' + a + ' -> ' + b);
  }
  s.cells.forEach(function (p) {
    if (p[0] < 1 || p[0] > N || p[1] < 1 || p[1] > N) errs.push('out of board in ' + s.name + ': ' + p);
  });
});

var cnt = {}, total = 0;
SEGS.forEach(function (s) {
  s.cells.forEach(function (p) {
    var k = p[0] + ',' + p[1];
    cnt[k] = (cnt[k] || 0) + 1;
    total++;
  });
});

var bad = [];
for (var r = 1; r <= N; r++) for (var c = 1; c <= N; c++) {
  var k = r + ',' + c, n = cnt[k] || 0;
  var finalBlack = n % 2 === 1;
  var wantBlack = isBlackTarget(r, c);
  if (finalBlack !== wantBlack) bad.push('(' + r + ',' + c + ') paints=' + n + ' final=' + (finalBlack ? 'B' : 'W') + ' want=' + (wantBlack ? 'B' : 'W'));
}

var lowerHalf = 0, upperHalf = 0, diag = 0;
SEGS.forEach(function (s) { (s.half === 'lower' ? lowerHalf += s.cells.length : upperHalf += s.cells.length); });
for (var d = 1; d <= N; d++) if (cnt[d + ',' + d]) diag++;

console.log('segments:', SEGS.map(function (s) { return s.name + '=' + s.cells.length; }).join(' '));
console.log('lower half paints:', lowerHalf, ' upper half paints:', upperHalf, ' total:', total);
console.log('diagonal cells painted:', diag, '(must be 0)');
console.log('connectivity errors:', errs.length ? errs : 'none');
console.log('final-board mismatches:', bad.length ? bad : 'none');
console.log(total === 60 && lowerHalf === 30 && upperHalf === 30 && diag === 0 && !errs.length && !bad.length ? 'RESULT: ALL CORRECT (60 steps)' : 'RESULT: FAILED');
