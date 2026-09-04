/* 算法可视化实验室 - 动画框架：GSAP 补间播放层 + 统一的播放/单步/重置/调速控制
   播放模型：demo.step() 推进离散状态后，GSAP 把进度 p 从 0 补间到 1（带缓动），
   draw(p, now) 每帧拿到补间进度，在两个状态之间做平滑过渡，杜绝"瞬移式"跳变 */
(function () {
  const A = (window.AlgoLab = { demos: {} });
  const G = window.gsap; /* GSAP 全局 */

  A.register = function (id, factory) { A.demos[id] = factory; };

  /* ---------- 绘图小工具 ---------- */
  A.rr = function (ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  A.txt = function (ctx, str, x, y, o) {
    o = o || {};
    ctx.font = (o.bold ? '700 ' : '') + (o.size || 13) + 'px "Noto Sans SC","Microsoft YaHei",sans-serif';
    ctx.fillStyle = o.color || '#e8ecf8';
    ctx.textAlign = o.align || 'center';
    ctx.textBaseline = o.baseline || 'middle';
    ctx.fillText(str, x, y);
  };

  A.mono = function (ctx, str, x, y, o) {
    o = o || {};
    ctx.font = (o.bold ? '700 ' : '') + (o.size || 13) + 'px Consolas,ui-monospace,monospace';
    ctx.fillStyle = o.color || '#e8ecf8';
    ctx.textAlign = o.align || 'center';
    ctx.textBaseline = o.baseline || 'middle';
    ctx.fillText(str, x, y);
  };

  A.lerp = (a, b, t) => a + (b - a) * t;
  A.clamp01 = (t) => Math.max(0, Math.min(1, t));

  /* 光晕：给活动元素上发光，用完调 A.noglow 复位 */
  A.glow = function (ctx, color, blur) { ctx.shadowColor = color; ctx.shadowBlur = blur === undefined ? 14 : blur; };
  A.noglow = function (ctx) { ctx.shadowBlur = 0; };

  /* 回弹缩放（过冲），用于新元素弹出 */
  A.pop = function (p) {
    p = A.clamp01(p);
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
  };

  /* 画布暗角：让演示区有"聚焦舞台"感 */
  A.vignette = function (ctx, W, H) {
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.36, W / 2, H / 2, Math.max(W, H) * 0.74);
    g.addColorStop(0, 'rgba(3,5,14,0)');
    g.addColorStop(1, 'rgba(3,5,14,0.55)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  };

  /* ---------- 挂载一个 demo 区块 ---------- */
  A.mount = function (section) {
    const id = section.dataset.demo;
    const factory = A.demos[id];
    if (!factory) return;

    const canvas = section.querySelector('canvas');
    const W = 960, H = 470;
    const ctx = canvas.getContext('2d');
    /* 高分屏适配：内部分辨率跟随实际显示宽度，避免 CSS 拉伸导致模糊 */
    function fit() {
      const cssW = canvas.clientWidth || W;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const px = Math.max(1, Math.round(cssW * dpr));
      if (canvas.width !== px) {
        canvas.width = px;
        canvas.height = Math.max(1, Math.round(cssW * H / W * dpr));
      }
      ctx.setTransform(canvas.width / W, 0, 0, canvas.width / W, 0, 0);
    }
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(canvas);
    else window.addEventListener('resize', fit);

    const demo = factory(ctx, W, H);

    const playBtn = section.querySelector('[data-action="play"]');
    const stepBtn = section.querySelector('[data-action="step"]');
    const resetBtn = section.querySelector('[data-action="reset"]');
    const speedInput = section.querySelector('.speed input');
    const statusEl = section.querySelector('.status');

    let playing = false;
    let speed = parseFloat(speedInput.value) || 1;
    const prog = { p: 1 };      /* 当前步的补间进度（GSAP 驱动） */
    let tween = null;            /* 当前补间 */
    let hold = null;             /* 步与步之间的停顿 */

    function setStatus() {
      const s = demo.status ? demo.status() : '';
      statusEl.textContent = s;
    }

    function updatePlayBtn() {
      playBtn.textContent = playing ? '暂停' : (demo.done ? '重播' : '播放');
      playBtn.classList.toggle('primary', playing);
    }

    function killTimers() {
      if (tween) { tween.kill(); tween = null; }
      if (hold) { hold.kill(); hold = null; }
    }

    /* 推进一步：先更新离散状态，再用 GSAP 把视觉进度从 0 补间到 1 */
    function advance() {
      if (!playing || demo.done) return;
      demo.step();
      setStatus();
      prog.p = 0;
      const base = demo.baseMs || 500;
      tween = G.to(prog, {
        p: 1, duration: base * 0.001 / speed, ease: demo.ease || 'power3.out',
        onComplete: function () {
          if (demo.done) { playing = false; updatePlayBtn(); return; }
          hold = G.delayedCall(base * 0.00038 / speed, advance);
        }
      });
      if (demo.done) {
        /* 最后一步：补间播完即停 */
      }
    }

    playBtn.addEventListener('click', function () {
      if (demo.done) { killTimers(); demo.reset(); prog.p = 1; setStatus(); }
      playing = !playing;
      updatePlayBtn();
      if (playing) {
        if (tween) tween.play();
        else if (hold) hold.play(true);
        else advance();
      } else {
        if (tween) tween.pause();
        if (hold) hold.pause();
      }
    });

    stepBtn.addEventListener('click', function () {
      playing = false;
      killTimers();
      if (demo.done) return;
      demo.step();
      prog.p = 0;
      tween = G.to(prog, { p: 1, duration: (demo.baseMs || 500) * 0.001 / Math.max(speed, 1), ease: demo.ease || 'power3.out' });
      setStatus();
      updatePlayBtn();
    });

    resetBtn.addEventListener('click', function () {
      playing = false;
      killTimers();
      demo.reset();
      prog.p = 1;
      updatePlayBtn();
      setStatus();
    });

    speedInput.addEventListener('input', function () {
      const old = speed;
      speed = parseFloat(speedInput.value) || 1;
      if (tween) tween.timeScale(speed / old);
      if (hold) hold.timeScale(speed / old);
    });

    /* 渲染循环：始终重绘，draw 拿到补间进度 p 与时间戳 */
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      A.vignette(ctx, W, H);
      demo.draw(prog.p, performance.now());
      requestAnimationFrame(loop);
    })();

    setStatus();
    updatePlayBtn();
  };
})();
