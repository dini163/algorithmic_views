/* 谜题全覆盖动画库 ，核心框架：卡片生成、懒挂载、播放控制、绘图助手 */
(function () {
  const PZ = (window.PZ = { engines: {}, defs: [], H: {} });
  const H = PZ.H;

  PZ.registerEngine = function (id, eng) { PZ.engines[id] = eng; };
  PZ.def = function (d) { PZ.defs.push(d); };

  /* ---------- 绘图助手 ---------- */
  H.rr = function (ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  };
  H.txt = function (ctx, s, x, y, o) {
    o = o || {};
    ctx.font = (o.bold ? '700 ' : '') + (o.size || 12) + 'px "Noto Sans SC","Microsoft YaHei",sans-serif';
    ctx.fillStyle = o.color || '#dfe6f8'; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(s, x, y);
  };
  H.mono = function (ctx, s, x, y, o) {
    o = o || {};
    ctx.font = (o.bold ? '700 ' : '') + (o.size || 12) + 'px Consolas,ui-monospace,monospace';
    ctx.fillStyle = o.color || '#dfe6f8'; ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(s, x, y);
  };
  H.line = function (ctx, x1, y1, x2, y2, color, w) {
    ctx.strokeStyle = color || '#39437a'; ctx.lineWidth = w || 1.5;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  };
  H.circle = function (ctx, x, y, r, fill, stroke) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  };
  H.lerp = function (a, b, t) { return a + (b - a) * t; };
  H.clamp01 = function (t) { return Math.max(0, Math.min(1, t)); };
  H.PAL = ['#5eead4', '#818cf8', '#fbbf24', '#f87171', '#4ade80', '#f0abfc', '#7dd3fc', '#fdba74', '#a3e635', '#e879f9'];

  /* ---------- 通用求解器 ---------- */
  const S = (PZ.S = {});
  S.bfs = function (start, moves, goal, key, maxNodes) {
    const q = [[start, []]];
    const seen = new Set([key(start)]);
    let n = 0;
    while (q.length) {
      const st = q.shift();
      const [state, path] = st;
      if (goal(state)) return path;
      for (const mv of moves(state)) {
        const k = key(mv.next);
        if (seen.has(k)) continue;
        seen.add(k);
        q.push([mv.next, path.concat([mv])]);
        if (++n > (maxNodes || 200000)) return null;
      }
    }
    return null;
  };

  /* ---------- 页面构建 ---------- */
  const cards = [];
  PZ.build = function () {
    const side = document.getElementById('pz-side');
    const main = document.getElementById('pz-main');
    let lastGroup = null;
    PZ.defs.forEach(function (d, idx) {
      const ex = (PZ.extra && PZ.extra[(d.g === 'o' ? 'o' : '') + d.no]) || {};
      const de = (PZ.desc && PZ.desc[(d.g === 'o' ? 'o' : '') + d.no]) || {};
      if (d.g !== lastGroup) {
        lastGroup = d.g;
        const h = document.createElement('p');
        h.className = 'pz-group';
        h.textContent = d.g === 'o' ? '第 1 章 · 概览示例（21 题）' : '第 2 章 · 谜题（150 题）';
        side.appendChild(h);
      }
      const a = document.createElement('a');
      a.href = '#pz' + d.no + (d.g === 'o' ? 'o' : '');
      a.textContent = (d.g === 'o' ? '概' + d.no : d.no) + '. ' + d.title;
      a.className = 'pz-link';
      side.appendChild(a);

      const sec = document.createElement('section');
      sec.className = 'pz-card';
      sec.id = 'pz' + d.no + (d.g === 'o' ? 'o' : '');
      sec.innerHTML =
        '<header><span class="no">' + (d.g === 'o' ? '概览' + d.no : '#' + d.no) + '</span>' +
        '<h3>' + d.title + '</h3><span class="strat">' + d.strat + '</span></header>' +
        '<p class="pz-q"><b>问题：</b>' + de.q + '</p>' +
        '<div class="pz-canvas-wrap"><canvas></canvas></div>' +
        '<div class="pz-ctrl"><button data-a="play">播放</button><button data-a="step">单步</button>' +
        '<button data-a="reset">重置</button><label>速度<input type="range" min="0.5" max="6" step="0.5" value="1.5"></label>' +
        '<span class="pz-status"></span></div>' +
        '<p class="pz-plain"><b>大白话：</b>' + d.plain + '</p>' +
        '<p class="pz-cp"><b>复杂度：</b>' + de.cp + '</p>' +
        '<p class="pz-life"><b>生活类比：</b>' + (ex.life || '') + '</p>' +
        '<p class="pz-case"><b>工程案例：</b>' + (ex.case || '') + '</p>';
      main.appendChild(sec);
      cards.push({ el: sec, d: d, mounted: false, visible: false });
    });

    const io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        const c = cards.find(function (x) { return x.el === e.target; });
        if (!c) return;
        c.visible = e.isIntersecting;
        if (c.visible && !c.mounted) { c.mounted = true; mount(c); }
      });
    }, { rootMargin: '300px 0px' });
    cards.forEach(function (c) { io.observe(c.el); });
  };

  function mount(c) {
    const eng = PZ.engines[c.d.e];
    const canvas = c.el.querySelector('canvas');
    const W = 640, Hh = 330;
    const ctx = canvas.getContext('2d');
    /* 高分屏适配：内部分辨率跟随实际显示宽度，避免 CSS 拉伸导致模糊 */
    function fit() {
      const cssW = canvas.clientWidth || W;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const px = Math.max(1, Math.round(cssW * dpr));
      if (canvas.width !== px) {
        canvas.width = px;
        canvas.height = Math.max(1, Math.round(cssW * Hh / W * dpr));
      }
      ctx.setTransform(canvas.width / W, 0, 0, canvas.width / W, 0, 0);
    }
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(canvas);
    else window.addEventListener('resize', fit);
    const M = eng.build(c.d.p || {});
    c.model = M;

    const status = c.el.querySelector('.pz-status');
    const playBtn = c.el.querySelector('[data-a="play"]');
    const stepBtn = c.el.querySelector('[data-a="step"]');
    const resetBtn = c.el.querySelector('[data-a="reset"]');
    const speedIn = c.el.querySelector('input');
    let k = 0, playing = false, speed = parseFloat(speedIn.value), timer = null;

    function info() { status.textContent = (M.label ? M.label(k) : ('step ' + k + '/' + M.steps)); }
    function upBtn() { playBtn.textContent = playing ? '暂停' : (k >= M.steps ? '重播' : '播放'); }
    function sched() {
      clearTimeout(timer);
      if (!playing) return;
      timer = setTimeout(function () {
        if (!playing) return;
        if (k < M.steps) k++;
        info();
        if (k >= M.steps) { playing = false; upBtn(); return; }
        sched();
      }, (M.baseMs || 500) / speed);
    }
    playBtn.onclick = function () {
      if (k >= M.steps) k = 0;
      playing = !playing; upBtn(); sched();
    };
    stepBtn.onclick = function () { playing = false; upBtn(); if (k < M.steps) k++; info(); };
    resetBtn.onclick = function () { playing = false; clearTimeout(timer); k = 0; upBtn(); info(); };
    speedIn.oninput = function () { speed = parseFloat(speedIn.value); if (playing) sched(); };

    (function loop() {
      if (c.visible) {
        ctx.clearRect(0, 0, W, Hh);
        M.draw(ctx, W, Hh, k, performance.now());
      }
      requestAnimationFrame(loop);
    })();
    info(); upBtn();
  }
})();
