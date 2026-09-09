/* 全站主题切换：跟随系统 / 浅色 / 深色，三态循环。
   选择持久化在 localStorage('algo-theme')；'system' 时不写 data-theme，
   由 CSS 的 @media (prefers-color-scheme) 自动跟随，系统切换即时生效。
   注意：画布（黑板井）两种模式下都保持深色，这里只切换页面 token。 */
(function () {
  var KEY = 'algo-theme';
  var MODES = ['system', 'light', 'dark'];
  var LABELS = { system: '跟随系统', light: '浅色', dark: '深色' };

  function get() {
    try {
      var v = localStorage.getItem(KEY);
      return MODES.indexOf(v) >= 0 ? v : 'system';
    } catch (e) { return 'system'; }
  }
  function apply(mode) {
    var root = document.documentElement;
    if (mode === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    try {
      if (mode === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, mode);
    } catch (e) {}
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('data-mode', mode);
      btn.querySelector('.tt-label').textContent = LABELS[mode];
      btn.title = '主题：' + LABELS[mode] + '（点击切换）';
    }
  }
  function cycle() {
    apply(MODES[(MODES.indexOf(get()) + 1) % MODES.length]);
  }
  function mount() {
    if (document.getElementById('theme-toggle')) { apply(get()); return; }
    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.innerHTML = '<span class="tt-dot" aria-hidden="true"></span><span class="tt-label"></span>';
    btn.addEventListener('click', cycle);
    document.body.appendChild(btn);
    apply(get());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
