/* 动画 demo 第一部分：穷举搜索 / 二分查找 / 汉诺塔 / 三格骨牌 / 变位词 */
(function () {
  const A = window.AlgoLab;

  /* ============ 01 穷举搜索：三阶幻方（教材同款） ============ */
  A.register('brute', function (ctx, W, H) {
    /* 预计算：按字典序枚举 1..9 的全部 9! = 362880 种排列，
       逐一检验 3 行 + 3 列 + 2 对角线是否都为 15，记录解的序号 */
    const SOL = 15;
    const perm = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const solutions = [];
    function magic(p) {
      return p[0] + p[1] + p[2] === SOL && p[3] + p[4] + p[5] === SOL && p[6] + p[7] + p[8] === SOL &&
        p[0] + p[3] + p[6] === SOL && p[1] + p[4] + p[7] === SOL && p[2] + p[5] + p[8] === SOL &&
        p[0] + p[4] + p[8] === SOL && p[2] + p[4] + p[6] === SOL;
    }
    function nextPerm(a) {
      let i = a.length - 2;
      while (i >= 0 && a[i] >= a[i + 1]) i--;
      if (i < 0) return false;
      let j = a.length - 1;
      while (a[j] <= a[i]) j--;
      let t = a[i]; a[i] = a[j]; a[j] = t;
      for (let l = i + 1, r = a.length - 1; l < r; l++, r--) { t = a[l]; a[l] = a[r]; a[r] = t; }
      return true;
    }
    (function precompute() {
      let idx = 0;
      do { if (magic(perm)) solutions.push({ idx: idx, g: perm.slice() }); idx++; } while (nextPerm(perm));
    })();
    const TOTAL = 362880;              // 9!
    const BATCH = 5184;                // 362880 / 70：每步检查的排列数
    const SCAN = TOTAL / BATCH;        // 70 步快速扫描

    let checked, cur, si, phase, done, msg, flashT;

    function reset() {
      checked = 0; cur = perm.slice(); si = -1; phase = 'scan'; done = false; flashT = 0;
      msg = '把 1-9 填入 3×3，使每行、每列、两条对角线之和都等于 15，穷举全部 9! 种排列';
    }
    reset();

    function step() {
      if (done) return;
      if (phase === 'scan') {
        checked = Math.min(TOTAL, checked + BATCH);
        let hit = null;
        for (const s of solutions) if (s.idx < checked && s.idx >= checked - BATCH) hit = s;
        cur = permOf(checked - 1);
        if (hit) msg = '扫到第 ' + checked + ' 种排列：命中一个幻方！（共 8 个，扫完后逐一展示）';
        else msg = '第 ' + checked + ' 种排列检查完毕：8 条线的和不全是 15，放弃，继续下一个';
        if (checked >= TOTAL) { phase = 'reveal'; msg = '362880 种排列全部检查完，命中 8 个，逐一展示'; }
      } else {
        si++;
        cur = solutions[si].g;
        flashT = performance.now();
        msg = '幻方 #' + (si + 1) + '：3 行、3 列、2 对角线，8 条线之和全是 15 ✓';
        if (si + 1 >= solutions.length) { done = true; msg = '共 8 个解，恰是同一幻方的旋转与镜像。穷举不聪明，但保证一个不漏'; }
      }
    }

    /* 求字典序第 k 个排列（k 从 0 计） */
    function permOf(k) {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9], res = [], fact = [1, 1, 2, 6, 24, 120, 720, 5040, 40320];
      for (let i = 9; i >= 1; i--) { const f = fact[i - 1], t = Math.floor(k / f); res.push(nums.splice(t, 1)[0]); k -= t * f; }
      return res;
    }

    function lineSums(g) {
      return [g[0] + g[1] + g[2], g[3] + g[4] + g[5], g[6] + g[7] + g[8],
        g[0] + g[3] + g[6], g[1] + g[4] + g[7], g[2] + g[5] + g[8],
        g[0] + g[4] + g[8], g[2] + g[4] + g[6]];
    }

    function cell(x, y, s, v, good, hot) {
      ctx.fillStyle = hot ? 'rgba(74,222,128,.92)' : (good ? 'rgba(94,234,212,.28)' : '#1c2650');
      A.rr(ctx, x, y, s, s, 8); ctx.fill();
      ctx.strokeStyle = good ? '#5eead4' : '#39437a'; ctx.lineWidth = 1.5;
      A.rr(ctx, x, y, s, s, 8); ctx.stroke();
      A.mono(ctx, String(v), x + s / 2, y + s / 2, { size: Math.round(s * 0.42), bold: true, color: '#e8ecf8' });
    }

    function draw() {
      A.txt(ctx, '穷举搜索：三阶幻方 - 逐个检查 1-9 的全部 9! = 362880 种排列', W / 2, 30, { size: 16, bold: true });
      A.txt(ctx, '规则：每行、每列、两条对角线之和都等于 15', W / 2, 56, { size: 13, color: '#9aa6c8' });

      const cs = 76, gp = 6;
      const gx = 110, gy = 100;
      const sums = lineSums(cur);
      const isSol = phase !== 'scan' || done;
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
        cell(gx + c * (cs + gp), gy + r * (cs + gp), cs, cur[r * 3 + c], isSol, false);
      for (let r = 0; r < 3; r++)
        A.mono(ctx, String(sums[r]), gx + 3 * (cs + gp) + 24, gy + r * (cs + gp) + cs / 2, { size: 15, bold: true, color: sums[r] === SOL ? '#4ade80' : '#f87171', align: 'left' });
      for (let c = 0; c < 3; c++)
        A.mono(ctx, String(sums[3 + c]), gx + c * (cs + gp) + cs / 2, gy + 3 * (cs + gp) + 22, { size: 15, bold: true, color: sums[3 + c] === SOL ? '#4ade80' : '#f87171' });
      A.mono(ctx, sums[6] === SOL ? '✓' + SOL : '✕' + sums[6], gx + 3 * (cs + gp) + 24, gy + 3 * (cs + gp) + 22, { size: 14, bold: true, color: sums[6] === SOL ? '#4ade80' : '#f87171', align: 'left' });

      const tw = 46, tg = 12, cols = 4, tx = 560, ty = 96;
      A.txt(ctx, '找到的幻方（共 8 个）', tx + (cols * (tw + tg) - tg) / 2, ty - 18, { size: 13, bold: true, color: '#9aa6c8' });
      const found = phase === 'scan' ? 0 : si + 1;
      for (let k = 0; k < 8; k++) {
        const r = Math.floor(k / cols), c = k % cols;
        const x = tx + c * (tw + tg), y = ty + r * (tw + tg + 18);
        if (k < found) {
          const justFound = k === found - 1 && performance.now() - flashT < 900;
          for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++)
            cell(x + j * (tw / 3), y + i * (tw / 3), tw / 3, solutions[k].g[i * 3 + j], true, justFound);
        } else {
          ctx.fillStyle = '#141b3a';
          A.rr(ctx, x, y, tw, tw, 6); ctx.fill();
          ctx.strokeStyle = '#232c56'; ctx.lineWidth = 1;
          A.rr(ctx, x, y, tw, tw, 6); ctx.stroke();
          A.txt(ctx, '?', x + tw / 2, y + tw / 2, { size: 16, bold: true, color: '#3a4470' });
        }
      }

      A.mono(ctx, phase === 'scan' ? ('已检查排列 ' + checked + ' / ' + TOTAL) : ('已找到 ' + found + ' / 8 个幻方'), 110, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.mono(ctx, '每个排列做 8 次加法验证', 620, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#5eead4' });
    }

    return { baseMs: 420, step: step, draw: draw, reset: reset, status: function () { return phase === 'scan' ? ('checked ' + checked + '/' + TOTAL) : ('solutions ' + (si + 1) + '/8'); }, get done() { return done; } };
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
