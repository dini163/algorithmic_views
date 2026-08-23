/* 算法可视化实验室 ，动画框架：统一的播放/单步/重置/调速控制 */
(function () {
  const A = (window.AlgoLab = { demos: {} });

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
    let timer = null;

    function setStatus() {
      const s = demo.status ? demo.status() : '';
      statusEl.textContent = s;
    }

    function updatePlayBtn() {
      playBtn.textContent = playing ? '暂停' : (demo.done ? '重播' : '播放');
      playBtn.classList.toggle('primary', playing);
    }

    function schedule() {
      clearTimeout(timer);
      if (!playing) return;
      timer = setTimeout(function tick() {
        if (!playing) return;
        demo.step();
        setStatus();
        if (demo.done) { playing = false; updatePlayBtn(); return; }
        schedule();
      }, (demo.baseMs || 500) / speed);
    }

    playBtn.addEventListener('click', function () {
      if (demo.done) { demo.reset(); }
      playing = !playing;
      updatePlayBtn();
      schedule();
    });

    stepBtn.addEventListener('click', function () {
      playing = false;
      updatePlayBtn();
      demo.step();
      setStatus();
      updatePlayBtn();
    });

    resetBtn.addEventListener('click', function () {
      playing = false;
      clearTimeout(timer);
      demo.reset();
      updatePlayBtn();
      setStatus();
    });

    speedInput.addEventListener('input', function () {
      speed = parseFloat(speedInput.value) || 1;
      if (playing) schedule();
    });

    /* 渲染循环：始终重绘，允许 demo 做时间插值的平滑动画 */
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      demo.draw(performance.now());
      requestAnimationFrame(loop);
    })();

    setStatus();
    updatePlayBtn();
  };
})();
