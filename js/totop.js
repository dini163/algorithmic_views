/* 全站「回到顶部」浮动按钮：向下滚动超过一屏后淡入，点击平滑回顶。
   外观与右上角的 .theme-toggle 同款（var(--card) 底 + 圆角 + 琥珀描边悬停），
   遵循 Ink & Amber 配色纪律。首页与动画库页共用本文件。 */
(function () {
  var THRESHOLD = 400; // 滚动超过约一屏才出现

  function mount() {
    if (document.getElementById('to-top')) return;

    var btn = document.createElement('button');
    btn.id = 'to-top';
    btn.className = 'to-top';
    btn.type = 'button';
    btn.title = '回到顶部';
    btn.setAttribute('aria-label', '回到顶部');
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>';
    document.body.appendChild(btn);

    var reduce = !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'auto' : 'smooth' });
      btn.blur();
    });

    var ticking = false;
    function sync() {
      ticking = false;
      var y = window.pageYOffset ||
        document.documentElement.scrollTop || document.body.scrollTop || 0;
      btn.classList.toggle('show', y > THRESHOLD);
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(sync); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    sync();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
