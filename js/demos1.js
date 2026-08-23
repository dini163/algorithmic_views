/* 动画 demo 第一部分：穷举搜索 / 二分查找 / 汉诺塔 / 三格骨牌 / 变位词 */
(function () {
  const A = window.AlgoLab;

  /* ============ 01 穷举搜索：寻找最大和 ============ */
  A.register('brute', function (ctx, W, H) {
    const arr = [3, -4, 2, 5, -1, 3, -2, 4];
    const n = arr.length;
    const total = n * (n + 1) / 2;
    let i, j, cur, best, bi, bj, checked, done, msg;

    function reset() {
      i = 0; j = 0; cur = 0; best = -Infinity; bi = 0; bj = 0;
      checked = 0; done = false; msg = '点击「播放」，开始枚举全部 ' + total + ' 个子数组';
    }
    reset();

    function step() {
      if (done) return;
      cur += arr[j];
      checked++;
      if (cur > best) { best = cur; bi = i; bj = j; msg = '子数组[' + i + '..' + j + '] 和=' + cur + '，刷新当前最佳！'; }
      else msg = '子数组[' + i + '..' + j + '] 和=' + cur + '，不如最佳 ' + best;
      if (j + 1 < n) j++;
      else if (i + 1 < n) { i++; j = i; cur = 0; }
      else { done = true; msg = '枚举完毕：最大和=' + best + '，来自子数组[' + bi + '..' + bj + ']'; }
    }

    function draw() {
      const bw = 86, gap = 18, x0 = (W - (n * bw + (n - 1) * gap)) / 2;
      const baseY = 250, unit = 26;
      A.txt(ctx, '穷举搜索：逐个枚举所有子数组，比较它们的和', W / 2, 34, { size: 16, bold: true });
      for (let k = 0; k < n; k++) {
        const x = x0 + k * (bw + gap);
        const v = arr[k];
        const h = Math.abs(v) * unit;
        const inCur = !done && k >= i && k <= j;
        const inBest = done && k >= bi && k <= bj;
        ctx.fillStyle = '#1c2650';
        A.rr(ctx, x, baseY - Math.max(v, 0) * unit, bw, Math.max(h, 4), 6); ctx.fill();
        if (v >= 0) { ctx.fillStyle = inCur ? 'rgba(94,234,212,.85)' : (inBest ? 'rgba(74,222,128,.9)' : '#3b4a8f'); }
        else { ctx.fillStyle = inCur ? 'rgba(251,191,36,.85)' : '#5b3a5e'; }
        A.rr(ctx, x, v >= 0 ? baseY - h : baseY, bw, Math.max(h, 4), 6); ctx.fill();
        A.mono(ctx, String(v), x + bw / 2, v >= 0 ? baseY - h - 16 : baseY + h + 16, { size: 14, bold: true, color: '#cbd5e1' });
      }
      ctx.strokeStyle = '#39437a'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x0 - 10, baseY); ctx.lineTo(x0 + n * (bw + gap), baseY); ctx.stroke();
      if (!done) {
        const x = x0 + i * (bw + gap), w2 = (j - i + 1) * bw + (j - i) * gap;
        ctx.strokeStyle = '#5eead4'; ctx.setLineDash([6, 5]);
        A.rr(ctx, x - 6, 120, w2 + 12, 210, 10); ctx.stroke(); ctx.setLineDash([]);
      } else {
        const x = x0 + bi * (bw + gap), w2 = (bj - bi + 1) * bw + (bj - bi) * gap;
        ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2.5;
        A.rr(ctx, x - 6, 120, w2 + 12, 210, 10); ctx.stroke();
      }
      A.mono(ctx, '已检查 ' + checked + ' / ' + total + ' 个子数组', 170, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.mono(ctx, '当前最佳和 = ' + (best === -Infinity ? '-' : best), 620, 415, { size: 14, color: '#4ade80', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#5eead4' });
    }

    return { baseMs: 350, step: step, draw: draw, reset: reset, status: function () { return '已检查 ' + checked + '/' + total; }, get done() { return done; } };
  });

  /* ============ 02 二分查找：猜数字 ============ */
  A.register('binary', function (ctx, W, H) {
    const arr = [2, 5, 8, 11, 17, 23, 30, 38, 45, 52, 61, 69, 77, 84, 92];
    const target = 69;
    const n = arr.length;
    let lo, hi, mid, found, guesses, done, msg;

    function reset() {
      lo = 0; hi = n - 1; mid = -1; found = -1; guesses = 0; done = false;
      msg = '目标数字 ' + target + '：每次猜中间，根据「大了/小了」砍掉一半';
    }
    reset();

    function step() {
      if (done) return;
      mid = (lo + hi) >> 1;
      guesses++;
      if (arr[mid] === target) { found = mid; done = true; msg = '第 ' + guesses + ' 次猜中 ' + target + '！15 个数最多只需 4 次'; }
      else if (arr[mid] < target) { msg = '猜 ' + arr[mid] + '：小了 → 左半全部排除，只剩 ' + (hi - mid) + ' 个候选'; lo = mid + 1; }
      else { msg = '猜 ' + arr[mid] + '：大了 → 右半全部排除，只剩 ' + (mid - lo) + ' 个候选'; hi = mid - 1; }
      if (!done && lo > hi) done = true;
    }

    function draw() {
      const cw = 54, gap = 6, x0 = (W - (n * cw + (n - 1) * gap)) / 2, y = 190;
      A.txt(ctx, '二分查找（猜数字）：有序是前提，每次比较排除一半', W / 2, 34, { size: 16, bold: true });
      A.txt(ctx, '目标 target = ' + target, W / 2, 78, { size: 14, color: '#fbbf24', bold: true });
      for (let k = 0; k < n; k++) {
        const x = x0 + k * (cw + gap);
        const alive = k >= lo && k <= hi;
        ctx.fillStyle = k === found ? 'rgba(74,222,128,.9)' : (k === mid && !done ? 'rgba(251,191,36,.9)' : alive ? '#273469' : '#141b3a');
        A.rr(ctx, x, y, cw, 54, 8); ctx.fill();
        if (alive && k !== mid) { ctx.strokeStyle = '#39437a'; ctx.lineWidth = 1; A.rr(ctx, x, y, cw, 54, 8); ctx.stroke(); }
        A.mono(ctx, String(arr[k]), x + cw / 2, y + 27, { size: 15, bold: true, color: alive || k === found ? '#e8ecf8' : '#4a5578' });
      }
      if (!done && mid >= 0) {
        const x = x0 + mid * (cw + gap) + cw / 2;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.moveTo(x, y - 12); ctx.lineTo(x - 7, y - 24); ctx.lineTo(x + 7, y - 24); ctx.closePath(); ctx.fill();
      }
      if (!done && lo <= hi) {
        const x = x0 + lo * (cw + gap), w2 = (hi - lo + 1) * cw + (hi - lo) * gap;
        ctx.strokeStyle = '#5eead4'; ctx.setLineDash([5, 5]);
        A.rr(ctx, x - 5, y - 8, w2 + 10, 70, 10); ctx.stroke(); ctx.setLineDash([]);
        A.txt(ctx, '候选区间 [' + lo + '..' + hi + ']，共 ' + (hi - lo + 1) + ' 个', W / 2, y + 96, { size: 13, color: '#5eead4' });
      }
      A.mono(ctx, '猜测次数 = ' + guesses, 170, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.mono(ctx, '若线性查找最多需 ' + n + ' 次', 620, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#5eead4' });
    }

    return { baseMs: 900, step: step, draw: draw, reset: reset, status: function () { return 'guess #' + guesses; }, get done() { return done; } };
  });

  /* ============ 03 汉诺塔（减一递归） ============ */
  A.register('hanoi', function (ctx, W, H) {
    const N = 4;
    const moves = [];
    (function gen(m, from, to, aux) {
      if (m === 0) return;
      gen(m - 1, from, aux, to);
      moves.push({ disk: m, from: from, to: to });
      gen(m - 1, aux, to, from);
    })(N, 0, 2, 1);

    let pegs, idx, anim, done, msg;
    function reset() {
      pegs = [[], [], []];
      for (let d = N; d >= 1; d--) pegs[0].push(d);
      idx = 0; anim = null; done = false;
      msg = '把 4 层塔从 A 搬到 C：先搬开上面 3 层，同款问题，规模减一';
    }
    reset();

    function step() {
      if (done) return;
      const m = moves[idx];
      pegs[m.from].pop();
      pegs[m.to].push(m.disk);
      anim = { disk: m.disk, from: m.from, to: m.to, t0: performance.now() };
      idx++;
      msg = '第 ' + idx + ' 步：把 ' + m.disk + ' 号盘从 ' + 'ABC'[m.from] + ' 移到 ' + 'ABC'[m.to];
      if (idx >= moves.length) { done = true; msg = '完成！共 ' + moves.length + ' 步 = 2^4 - 1，每步都是「规模减一」的递归'; }
    }

    const pegX = [W * 0.22, W * 0.5, W * 0.78];
    const baseY = H - 96, dh = 30;
    const diskW = function (d) { return 60 + d * 34; };
    const diskColor = ['#5eead4', '#818cf8', '#fbbf24', '#f87171'];

    function restPos(peg, stackIdx) { return { x: pegX[peg], y: baseY - stackIdx * dh - dh / 2 }; }

    function draw(now) {
      A.txt(ctx, '汉诺塔：要搬最大盘，先把上面 n-1 层整体挪开（递归减一）', W / 2, 34, { size: 16, bold: true });
      for (let p = 0; p < 3; p++) {
        ctx.strokeStyle = '#39437a'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(pegX[p], baseY); ctx.lineTo(pegX[p], baseY - N * dh - 26); ctx.stroke();
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(pegX[p] - 90, baseY + 8); ctx.lineTo(pegX[p] + 90, baseY + 8); ctx.stroke();
        A.txt(ctx, 'ABC'[p], pegX[p], baseY + 34, { size: 15, bold: true, color: '#9aa6c8' });
      }
      const dur = 560;
      const animActive = anim && (now - anim.t0 < dur);
      for (let p = 0; p < 3; p++) {
        for (let s = 0; s < pegs[p].length; s++) {
          const d = pegs[p][s];
          if (animActive && p === anim.to && s === pegs[p].length - 1 && d === anim.disk) continue;
          const pos = restPos(p, s);
          drawDisk(d, pos.x, pos.y, 1);
        }
      }
      if (animActive) {
        const t = A.clamp01((now - anim.t0) / dur);
        const fromTop = pegs[anim.from].length;           // 搬走后源柱剩余高度
        const toTop = pegs[anim.to].length - 1;           // 目标位置 stack 索引
        const p0 = restPos(anim.from, fromTop);
        const p2 = restPos(anim.to, toTop);
        const topY = 92;
        let x, y;
        if (t < 0.3) { x = p0.x; y = A.lerp(p0.y, topY, t / 0.3); }
        else if (t < 0.7) { x = A.lerp(p0.x, p2.x, (t - 0.3) / 0.4); y = topY; }
        else { x = p2.x; y = A.lerp(topY, p2.y, (t - 0.7) / 0.3); }
        drawDisk(anim.disk, x, y, 1);
      } else if (anim && !animActive) {
        // 动画结束后正常绘制（下一帧会进入普通分支）
      }
      A.mono(ctx, '步数 ' + idx + ' / ' + moves.length + '  (2^4-1=15)', 170, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#5eead4' });

      function drawDisk(d, x, y, alpha) {
        const w = diskW(d);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = diskColor[d - 1];
        A.rr(ctx, x - w / 2, y - dh / 2 + 2, w, dh - 6, 8); ctx.fill();
        ctx.fillStyle = 'rgba(11,16,32,.55)';
        A.mono(ctx, String(d), x, y, { size: 13, bold: true });
        ctx.globalAlpha = 1;
      }
    }

    return { baseMs: 700, step: step, draw: draw, reset: reset, status: function () { return 'move ' + idx + '/' + moves.length; }, get done() { return done; } };
  });

  /* ============ 04 分治：三格骨牌铺棋 ============ */
  A.register('tromino', function (ctx, W, H) {
    const N = 8;
    const miss = { r: 2, c: 5 };
    const placements = [];
    (function tile(size, r, c, mr, mc) {
      if (size === 2) {
        const cells = [];
        for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
          if (!(r + i === mr && c + j === mc)) cells.push([r + i, c + j]);
        }
        placements.push(cells);
        return;
      }
      const h = size / 2;
      const midCells = [];
      const quadOfMiss = (mr < r + h ? 0 : 2) + (mc < c + h ? 0 : 1);
      const centers = [[r + h - 1, c + h - 1], [r + h - 1, c + h], [r + h, c + h - 1], [r + h, c + h]];
      for (let q = 0; q < 4; q++) if (q !== quadOfMiss) midCells.push(centers[q]);
      placements.push(midCells);
      for (let q = 0; q < 4; q++) {
        const nr = r + (q >= 2 ? h : 0), nc = c + (q % 2 === 1 ? h : 0);
        let nmr, nmc;
        if (q === quadOfMiss) { nmr = mr; nmc = mc; }
        else { nmr = centers[q][0]; nmc = centers[q][1]; }
        tile(h, nr, nc, nmr, nmc);
      }
    })(N, 0, 0, miss.r, miss.c);

    let shown, done, msg;
    function reset() { shown = 0; done = false; msg = '8×8 缺角棋盘：在中心放一个 L，四个象限变成同款小问题'; }
    reset();

    function step() {
      if (done) return;
      shown++;
      msg = '放置第 ' + shown + ' 个 L 形骨牌（共 ' + placements.length + ' 个）';
      if (shown >= placements.length) { done = true; msg = '铺满！(64-1)/3 = 21 个骨牌，分治递归完成'; }
    }

    function draw(now) {
      const cell = 44, x0 = (W - N * cell) / 2, y0 = 66;
      A.txt(ctx, '分治：三格骨牌铺满缺角棋盘 - 分解、递归解决、无需合并', W / 2, 34, { size: 16, bold: true });
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        ctx.strokeStyle = '#232c56'; ctx.lineWidth = 1;
        ctx.strokeRect(x0 + c * cell, y0 + r * cell, cell, cell);
      }
      ctx.fillStyle = '#05070f';
      ctx.fillRect(x0 + miss.c * cell + 1, y0 + miss.r * cell + 1, cell - 2, cell - 2);
      A.txt(ctx, '×', x0 + miss.c * cell + cell / 2, y0 + miss.r * cell + cell / 2, { size: 18, bold: true, color: '#f87171' });
      for (let k = 0; k < shown; k++) {
        const hue = (k * 47) % 360;
        const isCur = k === shown - 1;
        ctx.fillStyle = 'hsla(' + hue + ',72%,' + (isCur ? 68 : 52) + '%,' + (isCur ? 1 : 0.88) + ')';
        placements[k].forEach(function (cellPos) {
          const r = cellPos[0], c = cellPos[1];
          A.rr(ctx, x0 + c * cell + 2, y0 + r * cell + 2, cell - 4, cell - 4, 6); ctx.fill();
        });
      }
      A.mono(ctx, '骨牌 ' + shown + ' / ' + placements.length, 170, 428, { size: 14, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, '每次递归：规模 8→4→2，问题数 1→4→16', 620, 428, { size: 13, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, msg, W / 2, 452, { size: 13, color: '#c4b5fd' });
    }

    return { baseMs: 420, step: step, draw: draw, reset: reset, status: function () { return 'tromino ' + shown + '/' + placements.length; }, get done() { return done; } };
  });

  /* ============ 05 变治：变位词检测 ============ */
  A.register('transform', function (ctx, W, H) {
    const wordA = 'listen'.split('');
    const wordB = 'silent'.split('');
    const steps = [];
    (function build() {
      function swaps(w, tag) {
        const a = w.slice();
        for (let i = 0; i < a.length - 1; i++)
          for (let j = 0; j < a.length - 1 - i; j++)
            if (a[j] > a[j + 1]) { steps.push({ t: 'swap', w: tag, i: j, j: j + 1 }); const tmp = a[j]; a[j] = a[j + 1]; a[j + 1] = tmp; }
      }
      swaps(wordA, 'A');
      steps.push({ t: 'phase', name: 'B' });
      swaps(wordB, 'B');
      steps.push({ t: 'phase', name: 'cmp' });
      for (let k = 0; k < 6; k++) steps.push({ t: 'cmp', k: k });
      steps.push({ t: 'done' });
    })();

    let a, b, si, cmp, done, msg, flash;
    function reset() {
      a = wordA.slice(); b = wordB.slice(); si = 0; cmp = 0; done = false; flash = null;
      msg = '判断 listen 与 silent 是否互为变位词：先「变形」(排序)，再线性比较';
    }
    reset();

    function step() {
      if (done) return;
      const s = steps[si++];
      if (s.t === 'swap') {
        const arr = s.w === 'A' ? a : b;
        const t = arr[s.i]; arr[s.i] = arr[s.j]; arr[s.j] = t;
        flash = { w: s.w, i: s.i, j: s.j, t0: performance.now() };
        msg = '变形阶段：排序单词 ' + s.w + '（交换 ' + s.i + ',' + s.j + '），把乱序变成可比较的形式';
      } else if (s.t === 'phase') {
        msg = s.name === 'B' ? '单词 A 已排序，现在排序单词 B' : '两边都排好序了！开始逐位线性比较';
      } else if (s.t === 'cmp') {
        cmp = s.k + 1;
        msg = '比较第 ' + cmp + ' 位：' + a[s.k] + ' == ' + b[s.k] + ' ✓';
      } else {
        done = true;
        msg = '完全相同 → 是变位词！排序变形 O(n log n) 远胜枚举 6!=720 种排列';
      }
    }

    function drawRow(word, y, label, flashRow) {
      const tw = 64, gap = 10, x0 = W / 2 - (6 * tw + 5 * gap) / 2;
      A.txt(ctx, label, x0 - 70, y + 27, { size: 14, bold: true, color: '#9aa6c8' });
      for (let k = 0; k < 6; k++) {
        const x = x0 + k * (tw + gap);
        let hot = false;
        if (flashRow && flash && flash.w === flashRow && (flash.i === k || flash.j === k) && performance.now() - flash.t0 < 400) hot = true;
        ctx.fillStyle = hot ? 'rgba(251,191,36,.9)' : '#273469';
        A.rr(ctx, x, y, tw, 54, 8); ctx.fill();
        ctx.strokeStyle = '#39437a'; A.rr(ctx, x, y, tw, 54, 8); ctx.stroke();
        A.mono(ctx, word[k], x + tw / 2, y + 27, { size: 20, bold: true });
        if (cmp > k) {
          A.txt(ctx, '=', x + tw / 2, y + 74, { size: 15, bold: true, color: '#4ade80' });
        }
      }
    }

    function draw() {
      A.txt(ctx, '变治：先把问题变形成好解的形式（排序），再线性比较', W / 2, 34, { size: 16, bold: true });
      drawRow(a, 130, 'A', 'A');
      drawRow(b, 250, 'B', 'B');
      A.mono(ctx, '暴力枚举排列 = 6! = 720 种', 170, 415, { size: 14, color: '#f87171', align: 'left' });
      A.mono(ctx, '变形后比较 ≈ n log n + n', 620, 415, { size: 14, color: '#4ade80', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#f0abfc' });
    }

    return { baseMs: 300, step: step, draw: draw, reset: reset, status: function () { return 'step ' + si + '/' + steps.length; }, get done() { return done; } };
  });
})();
