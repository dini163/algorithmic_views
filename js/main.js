/* 主控：挂载所有 demo + 侧栏高亮 */
(function () {
  document.querySelectorAll('section[data-demo]').forEach(function (s) {
    window.AlgoLab.mount(s);
  });

  const links = Array.prototype.slice.call(document.querySelectorAll('.sidebar a'));
  const map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });

  const obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (a) { a.classList.remove('active'); });
        const a = map[e.target.id];
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  document.querySelectorAll('section.algo').forEach(function (s) { obs.observe(s); });
})();
