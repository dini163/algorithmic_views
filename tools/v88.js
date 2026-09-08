/* 验证 #88 走法在 swap（与空位交换）语义下的合法性 */
const ops = [[2, 3], [4, 2], [5, 4], [3, 5], [1, 3], [0, 1], [2, 0], [4, 2], [6, 4], [5, 6], [3, 5], [1, 3], [2, 1], [4, 2], [3, 4]];
let a = ['蟾', '蟾', '蟾', '_', '蛙', '蛙', '蛙'];
let bad = 0;
ops.forEach(function (o, k) {
  const i = o[0], j = o[1], v = a[i];
  const dist = Math.abs(i - j);
  if (a[j] !== '_') { console.log('第' + (k + 1) + '步：落点非空'); bad++; }
  if (dist < 1 || dist > 2) { console.log('第' + (k + 1) + '步：步距非法'); bad++; }
  if (v === '蟾' && j < i) { console.log('第' + (k + 1) + '步：蟾不能左移'); bad++; }
  if (v === '蛙' && j > i) { console.log('第' + (k + 1) + '步：蛙不能右移'); bad++; }
  const t = a[i]; a[i] = a[j]; a[j] = t;
  console.log('第' + String(k + 1).padStart(2) + '步 ' + v + ' ' + i + '→' + j + '  ' + a.join(' '));
});
console.log('终局:', a.join(''), a.join('') === '蛙蛙蛙_蟾蟾蟾' ? '✓ 达成目标' : '✗ 未达成', '违规:', bad);
