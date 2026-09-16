(function () {
  var STORE_KEY = 'empiria-lang';
  var root = document.documentElement;

  function read(fn, fallback) {
    try { return fn(); } catch (e) { return fallback; }
  }

  function apply(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute(
        'aria-pressed',
        buttons[i].getAttribute('data-set-lang') === lang ? 'true' : 'false'
      );
    }
  }

  function initial() {
    var param = read(function () {
      return new URLSearchParams(window.location.search).get('lang');
    }, null);
    if (param === 'hr' || param === 'en') return param;

    var stored = read(function () { return localStorage.getItem(STORE_KEY); }, null);
    if (stored === 'hr' || stored === 'en') return stored;

    var nav = (navigator.language || '').toLowerCase();
    return nav.indexOf('hr') === 0 ? 'hr' : 'en';
  }

  apply(initial());

  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('[data-set-lang]');
    if (!button) return;
    var lang = button.getAttribute('data-set-lang');
    apply(lang);
    read(function () { localStorage.setItem(STORE_KEY, lang); });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
