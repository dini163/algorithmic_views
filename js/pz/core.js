/* 谜题全覆盖动画库 - 核心框架：卡片生成、懒挂载、GSAP 补间播放、绘图助手 */
(function () {
  const PZ = (window.PZ = { engines: {}, defs: [], H: {} });
  const H = PZ.H;
  const G = window.gsap; /* GSAP 全局 */

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
  /* 光晕与弹出（与主页 AlgoLab 同款） */
  H.glow = function (ctx, color, blur) { ctx.shadowColor = color; ctx.shadowBlur = blur === undefined ? 12 : blur; };
  H.noglow = function (ctx) { ctx.shadowBlur = 0; };
  H.pop = function (p) {
    p = H.clamp01(p);
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
  };
  /* 画布暗角 */
  H.vignette = function (ctx, W, Hh) {
    const g = ctx.createRadialGradient(W / 2, Hh / 2, Math.min(W, Hh) * 0.34, W / 2, Hh / 2, Math.max(W, Hh) * 0.78);
    g.addColorStop(0, 'rgba(3,5,14,0)');
    g.addColorStop(1, 'rgba(3,5,14,0.5)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, Hh);
  };
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
  /* 解题思路按 ①②③… 圈号拆成分步列表，一步一步读得懂 */
  function ideaList(id) {
    var parts = String(id).split(/[①②③④⑤⑥⑦⑧⑨⑩]/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s; });
    if (parts.length <= 1) return '<p>' + id + '</p>';
    return '<ol class="pz-idea">' + parts.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>';
  }
  const cards = [];
  PZ.build = function () {
    const side = document.getElementById('pz-side');
    const main = document.getElementById('pz-main');
    const links = [];
    let lastGroup = null;
    PZ.defs.forEach(function (d, idx) {
      const ex = (PZ.extra && PZ.extra[(d.g === 'o' ? 'o' : '') + d.no]) || {};
      const de = (PZ.desc && PZ.desc[(d.g === 'o' ? 'o' : '') + d.no]) || {};
      const id = (PZ.idea && PZ.idea[(d.g === 'o' ? 'o' : '') + d.no]) || '';
      if (d.g !== lastGroup) {
        lastGroup = d.g;
        const h = document.createElement('p');
        h.className = 'pz-group';
        h.textContent = d.g === 'o' ? '概览示例（21 题）' : '经典谜题（150 题）';
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
      /* 首页同款结构：题头 → 题目 → 动画 → 双栏解读（大白话+分步思路 / 复杂度+类比+案例） */
      sec.innerHTML =
        '<header><span class="no">' + (d.g === 'o' ? '概览' + d.no : '#' + d.no) + '</span>' +
        '<h3>' + d.title + '</h3><span class="strat">' + d.strat + '</span></header>' +
        '<p class="pz-q"><span class="pz-k">题目</span>' + de.q + '</p>' +
        '<div class="pz-canvas-wrap"><canvas></canvas></div>' +
        '<div class="pz-ctrl"><button data-a="play">播放</button><button data-a="step">单步</button>' +
        '<button data-a="reset">重置</button><label>速度<input type="range" min="0.5" max="6" step="0.5" value="1.5"></label>' +
        '<span class="pz-status"></span></div>' +
        '<div class="pz-info-grid">' +
        '<article class="pz-panel">' +
        '<h4>大白话解读</h4><p>' + d.plain + '</p>' +
        (id ? '<h5>解题思路</h5>' + ideaList(id) : '') +
        '</article>' +
        '<article class="pz-panel">' +
        '<h4>复杂度对比</h4><p class="pz-cp">' + de.cp + '</p>' +
        '<h5>生活类比</h5><p>' + (ex.life || '') + '</p>' +
        '<h5>软件工程案例</h5><p>' + (ex.case || '') + '</p>' +
        '</article>' +
        '</div>';
      main.appendChild(sec);
      cards.push({ el: sec, d: d, mounted: false, visible: false });
      links.push({ a: a, sec: sec });
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

    /* ---------- 侧栏当前项高亮（scrollspy：滚动定位 + 点击即时反馈 + 自动滚到可见） ---------- */
    function setActive(sec) {
      var changed = false;
      links.forEach(function (p) {
        var on = p.sec === sec;
        if (p.a.classList.contains('active') !== on) changed = true;
        p.a.classList.toggle('active', on);
      });
      return changed;
    }
    /* 让侧栏滚动到高亮链接可见（只滚动侧栏容器，不影响页面滚动） */
    function reveal(link) {
      if (!link) return;
      var sideEl = document.getElementById('pz-side');
      var sTop = sideEl.scrollTop;
      var top = link.getBoundingClientRect().top - sideEl.getBoundingClientRect().top + sTop;
      var bottom = top + link.offsetHeight;
      if (top < sTop) sideEl.scrollTop = top - 4;
      else if (bottom > sTop + sideEl.clientHeight) sideEl.scrollTop = bottom - sideEl.clientHeight + 4;
    }
    links.forEach(function (p) {
      p.a.addEventListener('click', function () {
        setActive(p.sec);
        reveal(p.a);
        /* 点击后短暂锁定：平滑滚动期间保持选中项稳定，避免沿途闪烁；
           滚动停止（150ms 无 scroll）后解锁并按当前位置校正；1.5s 兜底覆盖无需滚动的点击 */
        activeLocked = true;
        clearTimeout(unlockTimer);
        unlockTimer = setTimeout(unlock, 1500);
      });
    });
    var activeLocked = false, unlockTimer = null;
    function unlock() {
      activeLocked = false;
      onScroll();
    }
    function onScroll() {
      if (activeLocked) {
        clearTimeout(unlockTimer);
        unlockTimer = setTimeout(unlock, 150);
        return;
      }
      var cur = null;
      links.forEach(function (p) {
        if (p.sec.getBoundingClientRect().top <= 90) cur = p.sec;
      });
      if (setActive(cur)) {
        var hit = null;
        links.forEach(function (p) { if (p.sec === cur) hit = p.a; });
        reveal(hit);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
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
    let k = 0, playing = false, speed = parseFloat(speedIn.value);
    const prog = { p: 1 };   /* 当前步的补间进度（GSAP 驱动） */
    let tween = null, hold = null;

    function info() { status.textContent = (M.label ? M.label(k) : ('step ' + k + '/' + M.steps)); }
    function upBtn() { playBtn.textContent = playing ? '暂停' : (k >= M.steps ? '重播' : '播放'); }
    function kill() {
      if (tween) { tween.kill(); tween = null; }
      if (hold) { hold.kill(); hold = null; }
    }
    /* 推进一步：k 前进后用 GSAP 把视觉进度从 0 补间到 1 */
    function advance() {
      if (!playing || k >= M.steps) return;
      k++;
      info();
      prog.p = 0;
      const base = M.baseMs || 500;
      tween = G.to(prog, {
        p: 1, duration: base * 0.001 / speed, ease: M.ease || 'power3.out',
        onComplete: function () {
          if (k >= M.steps) { playing = false; upBtn(); return; }
          hold = G.delayedCall(base * 0.00035 / speed, advance);
        }
      });
    }
    playBtn.onclick = function () {
      if (k >= M.steps) { kill(); k = 0; prog.p = 1; info(); }
      playing = !playing; upBtn();
      if (playing) {
        if (tween) tween.play();
        else if (hold) hold.play(true);
        else advance();
      } else {
        if (tween) tween.pause();
        if (hold) hold.pause();
      }
    };
    stepBtn.onclick = function () {
      playing = false; kill(); upBtn();
      if (k >= M.steps) return;
      k++;
      prog.p = 0;
      tween = G.to(prog, { p: 1, duration: (M.baseMs || 500) * 0.001 / Math.max(speed, 1), ease: M.ease || 'power3.out' });
      info();
    };
    resetBtn.onclick = function () { playing = false; kill(); k = 0; prog.p = 1; upBtn(); info(); };
    speedIn.oninput = function () {
      const old = speed;
      speed = parseFloat(speedIn.value);
      if (tween) tween.timeScale(speed / old);
      if (hold) hold.timeScale(speed / old);
    };

    (function loop() {
      if (c.visible) {
        ctx.clearRect(0, 0, W, Hh);
        H.vignette(ctx, W, Hh);
        M.draw(ctx, W, Hh, k, prog.p, performance.now());
      }
      requestAnimationFrame(loop);
    })();
    info(); upBtn();
  }
})();
