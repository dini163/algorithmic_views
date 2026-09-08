function ok(cols) {
  const n = cols.length;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (Math.abs(cols[i] - cols[j]) === j - i) return '(' + i + ',' + cols[i] + ')&(' + j + ',' + cols[j] + ')';
  }
  return null;
}
function construct(n) {
  const evens = [], odds = [];
  for (let i = 2; i <= n; i += 2) evens.push(i);
  for (let i = 1; i <= n; i += 2) odds.push(i);
  const m = n % 6;
  let cols;
  if (m === 2) {
    /* 奇数组：交换 1,3，把 5 移到末尾 */
    const o2 = [3, 1].concat(odds.slice(3)).concat([5]);
    cols = evens.concat(o2);
  } else if (m === 3) {
    cols = evens.slice(1).concat([2]).concat(odds.slice(2)).concat([1, 3]);
  } else {
    cols = evens.concat(odds);
  }
  return cols;
}
let allOk = true;
for (let n = 4; n <= 200; n++) {
  const cols = construct(n);
  const err = ok(cols.map(x => x - 1));
  if (err) { allOk = false; console.log('n=' + n + ' FAIL ' + err); }
}
console.log(allOk ? 'n=4..200 全部构造成功 ✓' : '存在失败');
