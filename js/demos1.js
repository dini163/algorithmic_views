/* 动画 demo 第一部分（GSAP 补间版）：穷举搜索 / 二分查找 / 汉诺塔 / 三格骨牌 / 变位词
   绘制签名：draw(p, now)。p = 当前步补间进度（GSAP 缓动后 0→1），用于过程动画 */
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

    let checked, cur, prevCur, si, phase, done, msg, hitFlash;

    function reset() {
      checked = 0; cur = perm.slice(); prevCur = cur; si = -1; phase = 'scan'; done = false; hitFlash = 0;
      msg = '把 1-9 填入 3×3，使每行、每列、两条对角线之和都等于 15，穷举全部 9! 种排列';
    }
    reset();

    function step() {
      if (done) return;
      if (phase === 'scan') {
        checked = Math.min(TOTAL, checked + BATCH);
        let hit = null;
        for (const s of solutions) if (s.idx < checked && s.idx >= checked - BATCH) hit = s;
        prevCur = cur;
        cur = permOf(checked - 1);
        if (hit) { msg = '扫到第 ' + checked + ' 种排列：命中一个幻方！（共 8 个，扫完后逐一展示）'; hitFlash = 1; }
        else msg = '第 ' + checked + ' 种排列检查完毕：8 条线的和不全是 15，放弃，继续下一个';
        if (checked >= TOTAL) { phase = 'reveal'; msg = '362880 种排列全部检查完，命中 8 个，逐一展示'; }
      } else {
        si++;
        prevCur = cur;
        cur = solutions[si].g;
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

    function cell(x, y, s, v, good, glow) {
      if (glow) A.glow(ctx, good ? '#4ade80' : '#5eead4', 14);
      ctx.fillStyle = good ? 'rgba(94,234,212,.28)' : '#1c2650';
      A.rr(ctx, x, y, s, s, 8); ctx.fill();
      if (glow) A.noglow(ctx);
      ctx.strokeStyle = good ? '#5eead4' : '#39437a'; ctx.lineWidth = 1.5;
      A.rr(ctx, x, y, s, s, 8); ctx.stroke();
      A.mono(ctx, String(v), x + s / 2, y + s / 2, { size: Math.round(s * 0.42), bold: true, color: '#e8ecf8' });
    }

    function draw(pp, now) {
      A.txt(ctx, '穷举搜索：三阶幻方 - 逐个检查 1-9 的全部 9! = 362880 种排列', W / 2, 30, { size: 16, bold: true });
      A.txt(ctx, '规则：每行、每列、两条对角线之和都等于 15', W / 2, 56, { size: 13, color: '#9aa6c8' });

      const cs = 76, gp = 6;
      const gx = 110, gy = 100;
      /* 主棋盘：新排列的数字随补间淡入，命中/展示阶段整体泛光 */
      const sums = lineSums(cur);
      const isSol = phase !== 'scan' || done;
      const gridGlow = hitFlash && phase === 'scan' ? pp : (isSol ? 1 : 0);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
        const x = gx + c * (cs + gp), y = gy + r * (cs + gp);
        const idx = r * 3 + c;
        const changed = !isSol && prevCur[idx] !== cur[idx];
        cell(x, y, cs, changed && pp < 1 ? '' : cur[idx], isSol, gridGlow > 0.4);
        /* 数字滚动：只对真正变化的格子做旧淡出/新淡入，未变格子纹丝不动 */
        if (pp < 1 && changed) {
          ctx.globalAlpha = 1 - pp;
          A.mono(ctx, String(prevCur[idx]), x + cs / 2, y + cs / 2 - pp * 10, { size: Math.round(cs * 0.42), bold: true, color: '#9aa6c8' });
          ctx.globalAlpha = pp;
          A.mono(ctx, String(cur[idx]), x + cs / 2, y + cs / 2 + (1 - pp) * 10, { size: Math.round(cs * 0.42), bold: true, color: '#e8ecf8' });
          ctx.globalAlpha = 1;
        }
      }
      /* 行/列/对角线和：达标绿、不达标红，随补间浮现 */
      for (let r = 0; r < 3; r++)
        A.mono(ctx, String(sums[r]), gx + 3 * (cs + gp) + 24, gy + r * (cs + gp) + cs / 2, { size: 15, bold: true, color: sums[r] === SOL ? '#4ade80' : '#f87171', align: 'left' });
      for (let c = 0; c < 3; c++)
        A.mono(ctx, String(sums[3 + c]), gx + c * (cs + gp) + cs / 2, gy + 3 * (cs + gp) + 22, { size: 15, bold: true, color: sums[3 + c] === SOL ? '#4ade80' : '#f87171' });
      A.mono(ctx, sums[6] === SOL ? '✓' + SOL : '✕' + sums[6], gx + 3 * (cs + gp) + 24, gy + 3 * (cs + gp) + 22, { size: 14, bold: true, color: sums[6] === SOL ? '#4ade80' : '#f87171', align: 'left' });

      /* 命中冲击波 */
      if (hitFlash && phase === 'scan' && pp < 1) {
        ctx.globalAlpha = (1 - pp) * 0.8;
        ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(gx + 1.5 * (cs + gp) - gp / 2, gy + 1.5 * (cs + gp) - gp / 2, 60 + pp * 130, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      const tw = 46, tg = 12, cols = 4, tx = 560, ty = 96;
      A.txt(ctx, '找到的幻方（共 8 个）', tx + (cols * (tw + tg) - tg) / 2, ty - 18, { size: 13, bold: true, color: '#9aa6c8' });
      const found = phase === 'scan' ? 0 : si + 1;
      for (let kk = 0; kk < 8; kk++) {
        const r = Math.floor(kk / cols), c = kk % cols;
        const x = tx + c * (tw + tg), y = ty + r * (tw + tg + 18);
        if (kk < found) {
          /* 新找到的解：从中心弹出 + 光晕 + 扩散环 */
          const justFound = kk === found - 1 && pp < 1;
          const s = justFound ? A.pop(pp) : 1;
          ctx.save();
          ctx.translate(x + tw / 2, y + tw / 2);
          ctx.scale(s, s);
          ctx.translate(-x - tw / 2, -y - tw / 2);
          if (justFound) A.glow(ctx, '#4ade80', 14);
          for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++)
            cell(x + j * (tw / 3), y + i * (tw / 3), tw / 3, solutions[kk].g[i * 3 + j], true, false);
          if (justFound) A.noglow(ctx);
          ctx.restore();
          if (justFound && pp > 0.3) {
            ctx.globalAlpha = (1 - pp) * 1.6;
            ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(x + tw / 2, y + tw / 2, tw * (0.5 + (pp - 0.3) * 0.9), 0, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = 1;
          }
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

    return { baseMs: 420, ease: 'power2.out', step: step, draw: draw, reset: reset, status: function () { return phase === 'scan' ? ('checked ' + checked + '/' + TOTAL) : ('solutions ' + (si + 1) + '/8'); }, get done() { return done; } };
  });

  /* ============ 02 二分查找：猜数字 ============ */
  A.register('binary', function (ctx, W, H) {
    const arr = [2, 5, 8, 11, 17, 23, 30, 38, 45, 52, 61, 69, 77, 84, 92];
    const target = 69;
    const n = arr.length;
    let lo, hi, mid, found, guesses, done, msg;
    let pLo, pHi, pMid;   /* 上一次的区间与猜测，用于补间 */

    function reset() {
      lo = 0; hi = n - 1; mid = -1; found = -1; guesses = 0; done = false;
      pLo = lo; pHi = hi; pMid = mid;
      msg = '目标数字 ' + target + '：每次猜中间，根据「大了/小了」砍掉一半';
    }
    reset();

    function step() {
      if (done) return;
      pLo = lo; pHi = hi; pMid = mid;
      mid = (lo + hi) >> 1;
      guesses++;
      if (arr[mid] === target) { found = mid; done = true; msg = '第 ' + guesses + ' 次猜中 ' + target + '！15 个数最多只需 4 次'; }
      else if (arr[mid] < target) { msg = '猜 ' + arr[mid] + '：小了 → 左半全部排除，只剩 ' + (hi - mid) + ' 个候选'; lo = mid + 1; }
      else { msg = '猜 ' + arr[mid] + '：大了 → 右半全部排除，只剩 ' + (mid - lo) + ' 个候选'; hi = mid - 1; }
      if (!done && lo > hi) done = true;
    }

    function draw(pp) {
      const cw = 54, gap = 6, x0 = (W - (n * cw + (n - 1) * gap)) / 2, y = 190;
      A.txt(ctx, '二分查找（猜数字）：有序是前提，每次比较排除一半', W / 2, 34, { size: 16, bold: true });
      A.txt(ctx, '目标 target = ' + target, W / 2, 78, { size: 14, color: '#fbbf24', bold: true });
      /* 补间后的"软"区间：被砍掉的一半逐渐熄灭 */
      const sLo = A.lerp(pLo, lo, pp), sHi = A.lerp(pHi, hi, pp);
      for (let k = 0; k < n; k++) {
        const x = x0 + k * (cw + gap);
        const alive = k >= lo && k <= hi;
        const wasAlive = k >= pLo && k <= pHi;
        let dim = 0; /* 正在被排除的程度 */
        if (wasAlive && !alive) dim = pp;
        else if (!wasAlive) dim = 1;
        const isMid = k === mid && !done;
        const base = k === found ? 'rgba(74,222,128,.9)' : (isMid ? 'rgba(251,191,36,.9)' : (alive ? '#273469' : '#141b3a'));
        ctx.fillStyle = base;
        ctx.globalAlpha = 1 - dim * 0.55;
        if (isMid) A.glow(ctx, '#fbbf24', 14);
        if (k === found) A.glow(ctx, '#4ade80', 18);
        A.rr(ctx, x, y, cw, 54, 8); ctx.fill();
        if (isMid || k === found) A.noglow(ctx);
        ctx.globalAlpha = 1;
        if (alive && !isMid) { ctx.strokeStyle = '#39437a'; ctx.lineWidth = 1; A.rr(ctx, x, y, cw, 54, 8); ctx.stroke(); }
        A.mono(ctx, String(arr[k]), x + cw / 2, y + 27, { size: 15, bold: true, color: (alive || k === found) ? '#e8ecf8' : '#4a5578' });
        /* 被排除的格子坠出 */
        if (wasAlive && !alive && pp < 1) {
          ctx.globalAlpha = (1 - pp) * 0.5;
          A.mono(ctx, String(arr[k]), x + cw / 2, y + 27 + pp * 26, { size: 15, bold: true, color: '#f87171' });
          ctx.globalAlpha = 1;
        }
      }
      /* 猜测指针：从上次位置滑到本次 */
      if (!done && mid >= 0 && pMid >= 0) {
        const mx = x0 + A.lerp(pMid, mid, pp) * (cw + gap) + cw / 2;
        ctx.fillStyle = '#fbbf24';
        A.glow(ctx, '#fbbf24', 10);
        ctx.beginPath(); ctx.moveTo(mx, y - 12); ctx.lineTo(mx - 7, y - 24); ctx.lineTo(mx + 7, y - 24); ctx.closePath(); ctx.fill();
        A.noglow(ctx);
      }
      /* 候选区间框：宽度随补间收缩 */
      if (!done && lo <= hi) {
        const bx = x0 + sLo * (cw + gap), bw2 = (sHi - sLo + 1) * cw + (sHi - sLo) * gap;
        ctx.strokeStyle = '#5eead4'; ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -performance.now() * 0.02;
        A.rr(ctx, bx - 5, y - 8, bw2 + 10, 70, 10); ctx.stroke(); ctx.setLineDash([]);
        A.txt(ctx, '候选区间 [' + lo + '..' + hi + ']，共 ' + (hi - lo + 1) + ' 个', W / 2, y + 96, { size: 13, color: '#5eead4' });
      }
      if (done && found >= 0 && pp < 1) {
        ctx.globalAlpha = (1 - pp) * 0.9;
        ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(x0 + found * (cw + gap) + cw / 2, y + 27, 30 + pp * 80, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }
      A.mono(ctx, '猜测次数 = ' + guesses, 170, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.mono(ctx, '若线性查找最多需 ' + n + ' 次', 620, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#5eead4' });
    }

    return { baseMs: 900, ease: 'power2.inOut', step: step, draw: draw, reset: reset, status: function () { return 'guess #' + guesses; }, get done() { return done; } };
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
      anim = { disk: m.disk, from: m.from, to: m.to };
      idx++;
      msg = '第 ' + idx + ' 步：把 ' + m.disk + ' 号盘从 ' + 'ABC'[m.from] + ' 移到 ' + 'ABC'[m.to];
      if (idx >= moves.length) { done = true; msg = '完成！共 ' + moves.length + ' 步 = 2^4 - 1，每步都是「规模减一」的递归'; }
    }

    const pegX = [W * 0.22, W * 0.5, W * 0.78];
    const baseY = H - 96, dh = 30;
    const diskW = function (d) { return 60 + d * 34; };
    const diskColor = ['#5eead4', '#818cf8', '#fbbf24', '#f87171'];

    function restPos(peg, stackIdx) { return { x: pegX[peg], y: baseY - stackIdx * dh - dh / 2 }; }

    function draw(pp) {
      A.txt(ctx, '汉诺塔：要搬最大盘，先把上面 n-1 层整体挪开（递归减一）', W / 2, 34, { size: 16, bold: true });
      for (let pg = 0; pg < 3; pg++) {
        ctx.strokeStyle = '#39437a'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(pegX[pg], baseY); ctx.lineTo(pegX[pg], baseY - N * dh - 26); ctx.stroke();
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(pegX[pg] - 90, baseY + 8); ctx.lineTo(pegX[pg] + 90, baseY + 8); ctx.stroke();
        A.txt(ctx, 'ABC'[pg], pegX[pg], baseY + 34, { size: 15, bold: true, color: '#9aa6c8' });
      }
      /* 飞行中：三段式，由补间 p 驱动（升起 → 平移 → 落下） */
      const animActive = !!anim && pp < 1;
      for (let pg = 0; pg < 3; pg++) {
        for (let s = 0; s < pegs[pg].length; s++) {
          const d = pegs[pg][s];
          if (animActive && pg === anim.to && s === pegs[pg].length - 1 && d === anim.disk) continue;
          const pos = restPos(pg, s);
          drawDisk(d, pos.x, pos.y, false);
        }
      }
      if (animActive) {
        const fromTop = pegs[anim.from].length;
        const toTop = pegs[anim.to].length - 1;
        const p0 = restPos(anim.from, fromTop);
        const p2 = restPos(anim.to, toTop);
        const topY = 92;
        let x, y;
        if (pp < 0.28) { x = p0.x; y = A.lerp(p0.y, topY, pp / 0.28); }
        else if (pp < 0.72) { x = A.lerp(p0.x, p2.x, (pp - 0.28) / 0.44); y = topY; }
        else { x = p2.x; y = A.lerp(topY, p2.y, (pp - 0.72) / 0.28); }
        /* 拖尾光点 */
        for (let tI = 1; tI <= 3; tI++) {
          const tp = Math.max(0, pp - tI * 0.06);
          let tx2, ty2;
          if (tp < 0.28) { tx2 = p0.x; ty2 = A.lerp(p0.y, topY, tp / 0.28); }
          else if (tp < 0.72) { tx2 = A.lerp(p0.x, p2.x, (tp - 0.28) / 0.44); ty2 = topY; }
          else { tx2 = p2.x; ty2 = A.lerp(topY, p2.y, (tp - 0.72) / 0.28); }
          ctx.globalAlpha = 0.28 - tI * 0.07;
          ctx.fillStyle = diskColor[anim.disk - 1];
          ctx.beginPath(); ctx.arc(tx2, ty2, 7 - tI, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        }
        drawDisk(anim.disk, x, y, true);
      }
      A.mono(ctx, '步数 ' + idx + ' / ' + moves.length + '  (2^4-1=15)', 170, 415, { size: 14, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#5eead4' });

      function drawDisk(d, x, y, flying) {
        const w = diskW(d);
        if (flying) A.glow(ctx, diskColor[d - 1], 18);
        ctx.fillStyle = diskColor[d - 1];
        A.rr(ctx, x - w / 2, y - dh / 2 + 2, w, dh - 6, 8); ctx.fill();
        if (flying) A.noglow(ctx);
        A.mono(ctx, String(d), x, y, { size: 13, bold: true, color: 'rgba(11,16,32,.6)' });
      }
    }

    return { baseMs: 700, ease: 'power2.inOut', step: step, draw: draw, reset: reset, status: function () { return 'move ' + idx + '/' + moves.length; }, get done() { return done; } };
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

    function draw(pp) {
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
        const s = isCur ? A.pop(pp) : 1;
        /* 质心：从中心弹出 */
        let cr = 0, cc = 0;
        placements[k].forEach(function (q) { cr += q[0]; cc += q[1]; });
        cr /= placements[k].length; cc /= placements[k].length;
        const cxp = x0 + (cc + 0.5) * cell, cyp = y0 + (cr + 0.5) * cell;
        if (isCur) A.glow(ctx, 'hsl(' + hue + ',72%,60%)', 14);
        ctx.fillStyle = 'hsla(' + hue + ',72%,' + (isCur ? 68 : 52) + '%,' + (isCur ? 1 : 0.88) + ')';
        ctx.save();
        ctx.translate(cxp, cyp);
        ctx.scale(s, s);
        ctx.translate(-cxp, -cyp);
        placements[k].forEach(function (cellPos) {
          const r = cellPos[0], c = cellPos[1];
          A.rr(ctx, x0 + c * cell + 2, y0 + r * cell + 2, cell - 4, cell - 4, 6); ctx.fill();
        });
        ctx.restore();
        if (isCur) A.noglow(ctx);
      }
      A.mono(ctx, '骨牌 ' + shown + ' / ' + placements.length, 170, 428, { size: 14, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, '每次递归：规模 8→4→2，问题数 1→4→16', 620, 428, { size: 13, color: '#9aa6c8', align: 'left' });
      A.txt(ctx, msg, W / 2, 452, { size: 13, color: '#c4b5fd' });
    }

    return { baseMs: 420, ease: 'power2.out', step: step, draw: draw, reset: reset, status: function () { return 'tromino ' + shown + '/' + placements.length; }, get done() { return done; } };
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
        flash = { w: s.w, i: s.i, j: s.j };
        msg = '变形阶段：排序单词 ' + s.w + '（交换 ' + s.i + ',' + s.j + '），把乱序变成可比较的形式';
      } else if (s.t === 'phase') {
        flash = null;
        msg = s.name === 'B' ? '单词 A 已排序，现在排序单词 B' : '两边都排好序了！开始逐位线性比较';
      } else if (s.t === 'cmp') {
        cmp = s.k + 1;
        msg = '比较第 ' + cmp + ' 位：' + a[s.k] + ' == ' + b[s.k] + ' ✓';
      } else {
        done = true;
        msg = '完全相同 → 是变位词！排序变形 O(n log n) 远胜枚举 6!=720 种排列';
      }
    }

    function drawRow(word, y, label, flashRow, pp) {
      const tw = 64, gap = 10, x0 = W / 2 - (6 * tw + 5 * gap) / 2;
      A.txt(ctx, label, x0 - 70, y + 27, { size: 14, bold: true, color: '#9aa6c8' });
      const swapping = flash && flash.w === flashRow && pp < 1;
      for (let k = 0; k < 6; k++) {
        /* 交换中的两个字母沿弧线换位 */
        let x = x0 + k * (tw + gap);
        let letter = word[k];
        let lift = 0;
        if (swapping) {
          const isI = k === flash.i, isJ = k === flash.j;
          if (isI || isJ) {
            const other = isI ? flash.j : flash.i;
            const fromX = x0 + other * (tw + gap);
            x = A.lerp(fromX, x, pp);
            lift = -Math.sin(pp * Math.PI) * (isI ? 30 : -30);
          }
        }
        const isSwapping = swapping && (k === flash.i || k === flash.j);
        if (isSwapping) A.glow(ctx, '#fbbf24', 14);
        ctx.fillStyle = isSwapping ? 'rgba(251,191,36,.9)' : '#273469';
        A.rr(ctx, x, y + lift, tw, 54, 8); ctx.fill();
        if (isSwapping) A.noglow(ctx);
        ctx.strokeStyle = '#39437a'; A.rr(ctx, x, y + lift, tw, 54, 8); ctx.stroke();
        A.mono(ctx, letter, x + tw / 2, y + lift + 27, { size: 20, bold: true });
        if (cmp > k) {
          const just = cmp - 1 === k && pp < 1;
          if (just) A.glow(ctx, '#4ade80', 10);
          ctx.globalAlpha = just ? pp : 1;
          A.txt(ctx, '=', x0 + k * (tw + gap) + tw / 2, y + 74, { size: 15, bold: true, color: '#4ade80' });
          ctx.globalAlpha = 1;
          if (just) A.noglow(ctx);
        }
      }
    }

    function draw(pp, now) {
      A.txt(ctx, '变治：先把问题变形成好解的形式（排序），再线性比较', W / 2, 34, { size: 16, bold: true });
      drawRow(a, 130, 'A', 'A', pp);
      drawRow(b, 250, 'B', 'B', pp);
      /* 比较扫描光束 */
      if (cmp > 0 && cmp <= 6 && pp < 1) {
        const tw = 64, gap = 10, x0 = W / 2 - (6 * tw + 5 * gap) / 2;
        const bx = x0 + (cmp - 1) * (tw + gap);
        ctx.globalAlpha = (1 - pp) * 0.5;
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(bx, 126, tw, 260);
        ctx.globalAlpha = 1;
      }
      A.mono(ctx, '暴力枚举排列 = 6! = 720 种', 170, 415, { size: 14, color: '#f87171', align: 'left' });
      A.mono(ctx, '变形后比较 ≈ n log n + n', 620, 415, { size: 14, color: '#4ade80', align: 'left' });
      A.txt(ctx, msg, W / 2, 445, { size: 13, color: '#f0abfc' });
    }

    return { baseMs: 300, ease: 'power2.inOut', step: step, draw: draw, reset: reset, status: function () { return 'step ' + si + '/' + steps.length; }, get done() { return done; } };
  });
})();
