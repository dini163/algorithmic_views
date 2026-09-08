/* #85/#86 方案模拟验证 */
/* #85 单向消息：乙丙丁戊→甲（收集），甲→乙丙丁戊（广播）= 8 条 */
(function () {
  const know = { 甲: ['a'], 乙: ['b'], 丙: ['c'], 丁: ['d'], 戊: ['e'] };
  const seq = [['乙', '甲'], ['丙', '甲'], ['丁', '甲'], ['戊', '甲'], ['甲', '乙'], ['甲', '丙'], ['甲', '丁'], ['甲', '戊']];
  seq.forEach((s, i) => {
    know[s[1]] = Array.from(new Set(know[s[1]].concat(know[s[0]]))).sort();
    console.log('#85 消息' + (i + 1) + ' ' + s[0] + '→' + s[1] + ': ' + JSON.stringify(know));
  });
  console.log('  全知?', Object.values(know).every(v => v.length === 5) ? 'OK, 8 条' : 'FAIL');
})();
/* #86 电话最优方案 2n−4 = 6 通（n=5）：戊→甲；甲↔乙；丙↔丁；甲↔丙；乙↔丁；甲↔戊 */
(function () {
  const know = { 甲: ['a'], 乙: ['b'], 丙: ['c'], 丁: ['d'], 戊: ['e'] };
  const calls = [['戊', '甲'], ['甲', '乙'], ['丙', '丁'], ['甲', '丙'], ['乙', '丁'], ['甲', '戊']];
  calls.forEach((s, i) => {
    const all = Array.from(new Set(know[s[0]].concat(know[s[1]]))).sort();
    know[s[0]] = all; know[s[1]] = all;
    console.log('#86 第' + (i + 1) + '通 ' + s[0] + '↔' + s[1] + ': ' + JSON.stringify(know));
  });
  console.log('  全知?', Object.values(know).every(v => v.length === 5) ? 'OK, 6 通 = 2n−4' : 'FAIL');
})();
