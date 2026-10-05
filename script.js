/* Tema claro/escuro */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme');
  var saved = null;
  try { saved = localStorage.getItem('autoteste-tema'); } catch (e) {}
  if (saved) root.setAttribute('data-theme', saved);

  btn.addEventListener('click', function () {
    var atual = root.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var novo = atual === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', novo);
    try { localStorage.setItem('autoteste-tema', novo); } catch (e) {}
  });
})();

/* Abas SAST / DAST (com navegação por setas) */
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));

  function ativar(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { ativar(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') ativar(tabs[(i + 1) % tabs.length]);
      if (e.key === 'ArrowLeft') ativar(tabs[(i - 1 + tabs.length) % tabs.length]);
    });
  });
})();
